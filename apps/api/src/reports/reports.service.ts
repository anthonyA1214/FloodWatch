import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateFloodAlertInput,
  ReportFloodAlertInput,
  ReportListQueryInput,
  ReportQueryInput,
} from '@repo/schemas';
import { inArray } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { aliasedTable, asc } from 'drizzle-orm';
import { and, count, desc, eq, like, or, sql } from 'drizzle-orm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { DRIZZLE } from 'src/drizzle/drizzle-connection';
import { profileInfo, users } from 'src/drizzle/schemas';
import { reports } from 'src/drizzle/schemas';
import { reportConfirmations } from 'src/drizzle/schemas/report-confirmations.schema';
import type { DrizzleDB } from 'src/drizzle/types/drizzle';
import { GeocoderService } from 'src/geocoder/geocoder.service';
import { ImagesService } from 'src/images/images.service';
import { InjectQueue } from '@nestjs/bullmq';
import {
  NOTIFICATION_JOBS,
  NotificationJobData,
  NOTIFICATIONS_QUEUE,
} from 'src/notifications/notifications.types';
import { Queue } from 'bullmq';
import { notificationMessageMap } from 'src/notifications/notifications-messages';
import { MailerService } from 'src/mailer/mailer.service';

interface UploadedImageFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

@Injectable()
export class ReportsService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private imagesService: ImagesService,
    private cloudinaryService: CloudinaryService,
    private geocoderService: GeocoderService,
    private mailerService: MailerService,
    @InjectQueue(NOTIFICATIONS_QUEUE) private notificationsQueue: Queue,
  ) {}

  async getReportMapPins() {
    return await this.db
      .select({
        id: reports.id,
        latitude: reports.latitude,
        longitude: reports.longitude,
        range: reports.range,
        severity: reports.severity,
        status: reports.status,
      })
      .from(reports)
      .orderBy(asc(reports.createdAt));
  }

  async getReportDetail(reportId: number) {
    const verifierUser = aliasedTable(users, 'verifier_user');
    const verifierProfile = aliasedTable(profileInfo, 'verifier_profile');

    const [data] = await this.db
      .select({
        id: reports.id,
        location: reports.location,
        description: reports.description,
        latitude: reports.latitude,
        longitude: reports.longitude,
        range: reports.range,
        severity: reports.severity,
        status: reports.status,
        image: reports.image,
        confirms: this.db.$count(
          reportConfirmations,
          and(
            eq(reportConfirmations.action, 'confirm'),
            eq(reportConfirmations.reportId, reports.id),
          ),
        ),
        denies: this.db.$count(
          reportConfirmations,
          and(
            eq(reportConfirmations.action, 'deny'),
            eq(reportConfirmations.reportId, reports.id),
          ),
        ),
        reportedAt: reports.createdAt,
        isAdmin: reports.isAdmin,
        reporter: {
          id: users.id,
          email: users.email,
          name: sql<string>`CONCAT(${profileInfo.firstName}, ' ', ${profileInfo.lastName})`,
          profilePicture: profileInfo.profilePicture,
        },
        verifier: {
          id: verifierUser.id,
          email: verifierUser.email,
          name: sql<string>`CONCAT(${verifierProfile.firstName}, ' ', ${verifierProfile.lastName})`,
          profilePicture: verifierProfile.profilePicture,
        },
        verifiedAt: reports.verifiedAt,
      })
      .from(reports)
      .leftJoin(users, eq(reports.userId, users.id))
      .leftJoin(profileInfo, eq(users.id, profileInfo.userId))
      .leftJoin(verifierUser, eq(reports.verifierId, verifierUser.id))
      .leftJoin(verifierProfile, eq(reports.verifierId, verifierProfile.userId))
      .where(eq(reports.id, reportId));

    return data;
  }

  async getReportList(reportListQueryDto: ReportListQueryInput) {
    const { page, limit, severities, q } = reportListQueryDto;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const searchCondition = q ? ilike(reports.location, `%${q}%`) : undefined;
    const severityCondition =
      severities && severities.length > 0
        ? inArray(reports.severity, severities)
        : undefined;

    const whereClause =
      severityCondition && searchCondition
        ? and(severityCondition, searchCondition)
        : (severityCondition ?? searchCondition);

    const [data, counts] = await Promise.all([
      this.db
        .select({
          id: reports.id,
          location: reports.location,
          description: reports.description,
          severity: reports.severity,
          status: reports.status,
          reportedAt: reports.createdAt,
        })
        .from(reports)
        .where(whereClause)
        .orderBy(desc(reports.createdAt))
        .limit(limitNumber)
        .offset(offset),
      this.db.select({ total: count() }).from(reports).where(whereClause),
    ]);

    const { total } = counts[0];
    return {
      data,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
        hasNextPage: pageNumber * limitNumber < total,
        hasPrevPage: pageNumber > 1,
      },
    };
  }

  async getAllReports(reportQueryDto: ReportQueryInput) {
    const { page, limit, status, q } = reportQueryDto;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    // Build search condition once, reused across all queries
    const searchCondition = q
      ? or(
          like(users.email, `%${q}%`),
          like(profileInfo.firstName, `%${q}%`),
          like(profileInfo.lastName, `%${q}%`),
          sql`CONCAT(${profileInfo.firstName}, ' ', ${profileInfo.lastName}) ILIKE ${`%${q}%`}`,
        )
      : undefined;

    // Full where clause (search + optional status filter)
    const whereClause =
      status && searchCondition
        ? and(eq(reports.status, status), searchCondition)
        : status
          ? eq(reports.status, status)
          : searchCondition;

    const [data, counts, statsResult] = await Promise.all([
      // Main paginated query
      this.db
        .select({
          id: reports.id,
          reporterId: users.id,
          reporterEmail: users.email,
          reporterFirstName: profileInfo.firstName,
          reporterLastName: profileInfo.lastName,
          reporterProfilePicture: profileInfo.profilePicture,
          reportedAt: reports.createdAt,
          status: reports.status,
        })
        .from(reports)
        .leftJoin(users, eq(reports.userId, users.id))
        .leftJoin(profileInfo, eq(users.id, profileInfo.userId))
        .where(whereClause)
        .orderBy(desc(reports.createdAt))
        .limit(limitNumber)
        .offset(offset),

      this.db
        .select({ total: count() })
        .from(reports)
        .leftJoin(users, eq(reports.userId, users.id))
        .leftJoin(profileInfo, eq(users.id, profileInfo.userId))
        .where(whereClause),

      // All counts in a single query using FILTER
      this.db
        .select({
          totalCount: count(),
          verifiedCount: sql<number>`COUNT(*) FILTER (WHERE ${reports.status} = 'verified')`,
          unverifiedCount: sql<number>`COUNT(*) FILTER (WHERE ${reports.status} = 'unverified')`,
          resolvedCount: sql<number>`COUNT(*) FILTER (WHERE ${reports.status} = 'resolved')`,
        })
        .from(reports)
        .leftJoin(users, eq(reports.userId, users.id))
        .leftJoin(profileInfo, eq(users.id, profileInfo.userId))
        .where(searchCondition),
    ]);

    const { total } = counts[0];
    const { totalCount, verifiedCount, unverifiedCount, resolvedCount } =
      statsResult[0];

    const formattedData = data.map((item) => ({
      id: item.id,
      reporter: {
        id: item.reporterId,
        email: item.reporterEmail,
        name: `${item.reporterFirstName} ${item.reporterLastName}`,
        profilePicture: item.reporterProfilePicture,
      },
      reportedAt: item.reportedAt,
      status: item.status,
    }));

    return {
      data: formattedData,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
        hasNextPage: pageNumber * limitNumber < total,
        hasPrevPage: pageNumber > 1,
      },
      stats: {
        verifiedCount,
        unverifiedCount,
        totalCount,
        resolvedCount,
      },
    };
  }

  async createReport(
    userId: number,
    reportFloodAlertDto: ReportFloodAlertInput,
    image: UploadedImageFile,
  ) {
    const { latitude, longitude, severity, description, range } =
      reportFloodAlertDto;

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (image) {
      const { buffer, mimetype } = await this.imagesService.normalizeImage(
        image.buffer,
      );

      const normalizedFile: UploadedImageFile = {
        ...image,
        buffer,
        mimetype,
        originalname: image.originalname.replace(
          /\.(jpe?g|png|jfif|webp)$/i,
          '.webp',
        ),
      };

      const uploaded = await this.cloudinaryService.uploadImage(
        normalizedFile as any,
        'reports',
      );

      imageUrl = uploaded.secure_url as string;
      imagePublicId = uploaded.public_id as string;
    }

    const { displayName } = await this.geocoderService.reverseGeocode(
      latitude,
      longitude,
    );

    await this.db.insert(reports).values({
      userId,
      latitude,
      longitude,
      severity,
      description,
      range,
      image: imageUrl,
      imagePublicId,
      location: displayName,
    });

    await this.sendFloodAlertEmails({
      location: displayName,
      severity,
    });

    return { message: 'Report created successfully' };
  }

  async createReportAdmin(
    userId: number,
    floodAlertDto: CreateFloodAlertInput,
    image: UploadedImageFile,
  ) {
    const { latitude, longitude, locationName, severity, description, range } =
      floodAlertDto;

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (image) {
      const { buffer, mimetype } = await this.imagesService.normalizeImage(
        image.buffer,
      );

      const normalizedFile: UploadedImageFile = {
        ...image,
        buffer,
        mimetype,
        originalname: image.originalname.replace(
          /\.(jpe?g|png|jfif|webp)$/i,
          '.webp',
        ),
      };

      const uploaded = await this.cloudinaryService.uploadImage(
        normalizedFile as any,
        'reports',
      );

      imageUrl = uploaded.secure_url as string;
      imagePublicId = uploaded.public_id as string;
    }

    const [report] = await this.db
      .insert(reports)
      .values({
        userId,
        latitude,
        longitude,
        severity,
        description,
        range,
        image: imageUrl,
        imagePublicId,
        location: locationName,
        status: 'verified', // Admin-created reports are auto-verified
        isAdmin: true,
        verifierId: userId, // Set the admin as the verifier
        verifiedAt: new Date(),
      })
      .returning();

    const recipients = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, 'user'));

    await Promise.all([
      this.notificationsQueue.addBulk(
        recipients.map((recipient) => ({
          name: NOTIFICATION_JOBS.SEND,
          data: {
            recipientId: recipient.id,
            actorId: userId,
            type: 'admin_reported_flood',
            message: notificationMessageMap['admin_reported_flood'],
            reportId: report.id,
          } satisfies NotificationJobData,
        })),
      ),

      this.notificationsQueue.add(NOTIFICATION_JOBS.SEND, {
        recipientId: userId,
        actorId: userId,
        type: 'admin_self_reported_flood',
        message: notificationMessageMap['admin_self_reported_flood'],
        reportId: report.id,
      } satisfies NotificationJobData),
    ]).catch((err: unknown) => {
      console.error('Failed to send notifications:', err);
    });

    await this.sendFloodAlertEmails({
      location: locationName,
      severity,
    });

    return { message: 'Report created and verified successfully' };
  }

  async verifyReportStatus(reportId: number, userId: number) {
    const [report] = await this.db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))
      .limit(1);

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    await this.db
      .update(reports)
      .set({
        verifierId: userId,
        status: 'verified',
        verifiedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(reports.id, reportId));

    await Promise.all([
      this.notificationsQueue.add(NOTIFICATION_JOBS.SEND, {
        recipientId: report.userId,
        actorId: userId,
        type: 'admin_verified_report',
        message: notificationMessageMap['admin_verified_report'],
        reportId,
      } satisfies NotificationJobData),
      this.notificationsQueue.add(NOTIFICATION_JOBS.SEND, {
        recipientId: userId,
        actorId: userId,
        type: 'admin_self_verified_report',
        message: notificationMessageMap['admin_self_verified_report'],
        reportId,
      } satisfies NotificationJobData),
    ]).catch((err: unknown) => {
      console.error('Failed to send notifications:', err);
    });

    if (report.userId) {
      const [reporter] = await this.db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, report.userId))
        .limit(1);

      if (reporter?.email && report.location && report.severity) {
        await this.mailerService.sendReportVerifiedEmail(reporter.email, {
          location: report.location,
          severity: report.severity,
        });
      }
    }

    return { message: 'Report verified successfully' };
  }

  async resolveReport(reportId: number, userId: number) {
    const [report] = await this.db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))
      .limit(1);

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    await this.db
      .update(reports)
      .set({
        verifierId: userId,
        status: 'resolved',
        verifiedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(reports.id, reportId));

    const recipients = await this.db.select({ id: users.id }).from(users);

    await Promise.all([
      this.notificationsQueue.addBulk(
        recipients.map((recipient) => ({
          name: NOTIFICATION_JOBS.SEND,
          data: {
            recipientId: recipient.id,
            actorId: userId,
            type: 'flood_resolved',
            message: notificationMessageMap['flood_resolved'],
            reportId,
          } satisfies NotificationJobData,
        })),
      ),
    ]).catch((err: unknown) => {
      console.error('Failed to send notifications:', err);
    });

    return { message: 'Report resolved successfully' };
  }

  async deleteReport(id: number, userId: number) {
    const [report] = await this.db
      .select()
      .from(reports)
      .where(eq(reports.id, id))
      .limit(1);

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    // Delete image from Cloudinary if exists
    if (report.imagePublicId) {
      await this.cloudinaryService.deleteImage(report.imagePublicId);
    }

    await this.db.delete(reports).where(eq(reports.id, id));

    await Promise.all([
      this.notificationsQueue.add(NOTIFICATION_JOBS.SEND, {
        recipientId: report.userId,
        actorId: userId,
        type: 'admin_deleted_report',
        message: notificationMessageMap['admin_deleted_report'],
      } satisfies NotificationJobData),
      this.notificationsQueue.add(NOTIFICATION_JOBS.SEND, {
        recipientId: userId,
        actorId: userId,
        type: 'admin_self_deleted_report',
        message: notificationMessageMap['admin_self_deleted_report'],
      } satisfies NotificationJobData),
    ]).catch((err) => {
      console.error('Failed to send notifications:', err);
    });

    return { message: 'Report deleted successfully' };
  }

  async voteReport(
    reportId: number,
    userId: number,
    action: 'confirm' | 'deny',
  ) {
    const [report] = await this.db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))
      .limit(1);

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const existing = await this.db.query.reportConfirmations.findFirst({
      where: and(
        eq(reportConfirmations.reportId, reportId),
        eq(reportConfirmations.userId, userId),
      ),
    });

    if (existing) {
      if (existing.action === action) {
        // toggle off
        await this.db
          .delete(reportConfirmations)
          .where(eq(reportConfirmations.id, existing.id));

        return { message: 'Vote removed successfully' };
      }

      // flip vote
      await this.db
        .update(reportConfirmations)
        .set({
          action,
        })
        .where(eq(reportConfirmations.id, existing.id));

      return { message: 'Vote updated successfully' };
    }

    // insert new
    await this.db.insert(reportConfirmations).values({
      action,
      userId,
      reportId,
    });

    return { message: 'Vote added successfully' };
  }

  async getMyVote(reportId: number, userId: number) {
    const vote = await this.db.query.reportConfirmations.findFirst({
      where: and(
        eq(reportConfirmations.reportId, reportId),
        eq(reportConfirmations.userId, userId),
      ),
    });

    return { action: vote?.action ?? null };
  }

  async countActiveAlerts() {
    const [activeAlerts] = await this.db
      .select({
        count: count(),
      })
      .from(reports)
      .where(and(eq(reports.status, 'verified')));

    return activeAlerts.count;
  }

  async countTotalReports() {
    const [totalReports] = await this.db
      .select({
        count: count(),
      })
      .from(reports);

    return totalReports.count;
  }

  async countPendingReview() {
    const [pendingReview] = await this.db
      .select({
        count: count(),
      })
      .from(reports)
      .where(eq(reports.status, 'unverified'));

    return pendingReview.count;
  }

  async getMonthlyReport() {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyData = await this.db.execute(sql`
        SELECT
          TO_CHAR(months.month, 'YYYY-MM') AS month,
          TO_CHAR(months.month, 'Mon YYYY') AS month_name,
          COUNT(r.id) AS reports
        FROM generate_series(
          ${sixMonthsAgo}::timestamp,
          DATE_TRUNC('month', ${now}::timestamp),
          '1 month'::interval
        ) AS months(month)
        LEFT JOIN ${reports} r
          ON TO_CHAR(r.created_at, 'YYYY-MM') = TO_CHAR(months.month, 'YYYY-MM')
          AND r.status = 'verified'
        GROUP BY months.month
        ORDER BY months.month
      `);

    return monthlyData.rows.map((item) => ({
      month: item.month as string,
      monthName: item.month_name as string,
      reports: Number(item.reports),
    }));
  }

  async getReportDistribution() {
    const distribution = await this.db
      .select({
        severity: reports.severity,
        reports: count(),
      })
      .from(reports)
      .where(eq(reports.status, 'verified'))
      .groupBy(reports.severity);

    return distribution.map((item) => ({
      severity: item.severity,
      reports: Number(item.reports),
    }));
  }

  private async sendFloodAlertEmails(args: {
    location: string;
    severity: string;
  }) {
    const { location, severity } = args;

    const recipients = await this.db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        status: users.status,
        homeAddress: profileInfo.homeAddress,
      })
      .from(users)
      .leftJoin(profileInfo, eq(users.id, profileInfo.userId));

    const userRecipients = recipients.filter(
      (recipient) =>
        recipient.email &&
        recipient.role === 'user' &&
        recipient.status === 'active',
    );

    const adminRecipients = recipients.filter(
      (recipient) =>
        recipient.email &&
        recipient.role === 'admin' &&
        recipient.status === 'active',
    );

    const nearRecipients: { email: string }[] = [];
    const genericRecipients: { email: string }[] = [];

    for (const recipient of userRecipients) {
      const homeAddress = recipient.homeAddress ?? '';

      if (this.isHomeAddressMatchingLocation(homeAddress, location)) {
        nearRecipients.push({ email: recipient.email });
      } else {
        genericRecipients.push({ email: recipient.email });
      }
    }

    const nearTasks = nearRecipients.map(({ email }) =>
      this.mailerService.sendFloodNearYouEmail(email, {
        location,
        severity,
      }),
    );

    const genericTasks = genericRecipients.map(({ email }) =>
      this.mailerService.sendGenericFloodAlertEmail(email, {
        location,
        severity,
      }),
    );

    await Promise.all(nearTasks.concat(genericTasks));

    for (const { email } of adminRecipients) {
      await this.mailerService.sendAdminFloodAlertEmail(email, {
        location,
        severity,
      });
    }
  }

  private isHomeAddressMatchingLocation(homeAddress: string, location: string) {
    const trimmedHome = homeAddress.trim().toLowerCase();
    if (!trimmedHome) return false;

    const parts = location
      .toLowerCase()
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part.length >= 3);

    return parts.some((part) => trimmedHome.includes(part));
  }

  async getRecentReports() {
    const recentReports = await this.db
      .select({
        id: reports.id,
        location: reports.location,
        description: reports.description,
        severity: reports.severity,
        reportedAt: reports.createdAt,
      })
      .from(reports)
      .where(eq(reports.status, 'verified'))
      .orderBy(desc(reports.createdAt))
      .limit(5);

    return recentReports;
  }

  async getReportsNeedingAttention() {
    const reportsNeedingAttention = await this.db
      .select({
        id: reports.id,
        location: reports.location,
        description: reports.description,
        reportedAt: reports.createdAt,
        confirms: this.db.$count(
          reportConfirmations,
          and(
            eq(reportConfirmations.action, 'confirm'),
            eq(reportConfirmations.reportId, reports.id),
          ),
        ),
      })
      .from(reports)
      .where(
        and(
          eq(reports.status, 'unverified'),
          sql`${this.db.$count(
            reportConfirmations,
            and(
              eq(reportConfirmations.action, 'confirm'),
              eq(reportConfirmations.reportId, reports.id),
            ),
          )} >= 10`, // Threshold of 10 confirmations
        ),
      );

    return reportsNeedingAttention;
  }
}
