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

@Injectable()
export class ReportsService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private imagesService: ImagesService,
    private cloudinaryService: CloudinaryService,
    private geocoderService: GeocoderService,
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
          like(reports.location, `%${q}%`),
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
        .select()
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
        })
        .from(reports)
        .leftJoin(users, eq(reports.userId, users.id))
        .leftJoin(profileInfo, eq(users.id, profileInfo.userId))
        .where(searchCondition),
    ]);

    const { total } = counts[0];
    const { totalCount, verifiedCount, unverifiedCount } = statsResult[0];

    const formattedData = data.map((item) => ({
      id: item.reports.id,
      location: item.reports.location,
      description: item.reports.description,
      image: item.reports.image,
      severity: item.reports.severity,
      status: item.reports.status,
      latitude: item.reports.latitude,
      longitude: item.reports.longitude,
      range: item.reports.range,
      reportedAt: item.reports.createdAt,
      reporter: item.users
        ? {
            id: item.users.id,
            email: item.users.email,
            name: item.profile_info
              ? `${item.profile_info.firstName} ${item.profile_info.lastName}`.trim()
              : '',
            profilePicture: item.profile_info?.profilePicture || '',
          }
        : null,
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
      },
    };
  }

  async createReport(
    userId: number,
    floodAlertDto: ReportFloodAlertInput,
    image: Express.Multer.File,
  ) {
    const { latitude, longitude, severity, description, range } = floodAlertDto;

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (image) {
      const { buffer, mimetype } = await this.imagesService.normalizeImage(
        image.buffer,
      );

      const normalizedFile: Express.Multer.File = {
        ...image,
        buffer,
        mimetype,
        originalname: image.originalname.replace(
          /\.(jpe?g|png|jfif|webp)$/i,
          '.webp',
        ),
      };

      const uploaded = await this.cloudinaryService.uploadImage(
        normalizedFile,
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

    return { message: 'Report created successfully' };
  }

  async createReportAdmin(
    userId: number,
    floodAlertDto: CreateFloodAlertInput,
    image: Express.Multer.File,
  ) {
    const { latitude, longitude, locationName, severity, description, range } =
      floodAlertDto;

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (image) {
      const { buffer, mimetype } = await this.imagesService.normalizeImage(
        image.buffer,
      );

      const normalizedFile: Express.Multer.File = {
        ...image,
        buffer,
        mimetype,
        originalname: image.originalname.replace(
          /\.(jpe?g|png|jfif|webp)$/i,
          '.webp',
        ),
      };

      const uploaded = await this.cloudinaryService.uploadImage(
        normalizedFile,
        'reports',
      );

      imageUrl = uploaded.secure_url as string;
      imagePublicId = uploaded.public_id as string;
    }

    await this.db.insert(reports).values({
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
    });

    return { message: 'Report created and verified successfully' };
  }

  async verifyReportStatus(reportId: number, userId: number) {
    const report = await this.db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))
      .limit(1);

    if (!report.length) {
      throw new NotFoundException('Report not found');
    }

    await this.db
      .update(reports)
      .set({ verifierId: userId, status: 'verified', updatedAt: new Date() })
      .where(eq(reports.id, reportId));

    return { message: 'Report verified successfully' };
  }

  async deleteReport(id: number) {
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
}
