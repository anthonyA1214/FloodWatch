import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CommentQueryInput,
  CreateCommentInput,
  ReportCommentInput,
  ReportedCommentActionInput,
  ReportedCommentQueryInput,
  UpdateCommentDto,
} from '@repo/schemas';
import { Queue } from 'bullmq';
import { count } from 'drizzle-orm';
import { ilike } from 'drizzle-orm';
import { and, desc, eq, lt, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { User } from 'src/auth/types/auth-request.type';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { type UploadedImageFile } from 'src/common/types/uploaded-image-file.type';
import { DRIZZLE } from 'src/drizzle/drizzle-connection';
import {
  commentReportReviews,
  commentReports,
  comments,
  profileInfo,
  reports,
  users,
} from 'src/drizzle/schemas';
import { type DrizzleDB } from 'src/drizzle/types/drizzle';
import { ImagesService } from 'src/images/images.service';
import { notificationMessageMap } from 'src/notifications/notifications-messages';
import {
  NOTIFICATION_JOBS,
  NotificationJobData,
  NOTIFICATIONS_QUEUE,
} from 'src/notifications/notifications.types';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private imagesService: ImagesService,
    private cloudinaryService: CloudinaryService,
    @InjectQueue(NOTIFICATIONS_QUEUE) private notificationsQueue: Queue,
  ) {}

  async getComments(
    reportId: number,
    commentQueryDto: CommentQueryInput,
    userId: number,
  ) {
    const { cursorDate, cursorId, limit } = commentQueryDto;

    const commentsList = await this.db
      .select({
        id: comments.id,
        content: comments.content,
        image: comments.image,
        reportCount: sql<number>`(SELECT COUNT(*) FROM ${commentReports} WHERE ${commentReports.commentId} = ${comments.id})::int`,
        hasReported: userId
          ? sql<boolean>`EXISTS (SELECT 1 FROM ${commentReports} WHERE ${commentReports.commentId} = ${comments.id} AND ${commentReports.userId} = ${userId})`
          : sql<boolean>`false`,
        createdAt: comments.createdAt,
        author: {
          id: users.id,
          name: sql<string>`CONCAT(${profileInfo.firstName}, ' ', ${profileInfo.lastName})`,
          profilePicture: profileInfo.profilePicture,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .leftJoin(profileInfo, eq(users.id, profileInfo.userId))
      .where(
        cursorDate && cursorId
          ? and(
              eq(comments.reportId, reportId),
              or(
                lt(comments.createdAt, new Date(cursorDate)),
                and(
                  eq(comments.createdAt, new Date(cursorDate)),
                  lt(comments.id, cursorId),
                ),
              ),
            )
          : eq(comments.reportId, reportId),
      )
      .orderBy(desc(comments.createdAt), desc(comments.id))
      .limit(limit + 1);

    const hasMore = commentsList.length > limit;
    const data = hasMore ? commentsList.slice(0, limit) : commentsList;
    const lastItem = data[data.length - 1];
    const nextCursor =
      hasMore && lastItem
        ? {
            cursorDate: lastItem.createdAt?.toISOString() ?? null,
            cursorId: lastItem.id ?? null,
          }
        : null;

    return { data, meta: { hasMore, nextCursor } };
  }

  async addComment(
    reportId: number,
    createCommentDto: CreateCommentInput,
    userId: number,
    image: UploadedImageFile,
  ) {
    const { content } = createCommentDto;

    if (!content && !image) {
      throw new BadRequestException('Content or image is required');
    }

    const report = await this.db
      .select()
      .from(reports)
      .where(eq(reports.id, reportId))
      .limit(1);

    if (!report.length) throw new NotFoundException('Report not found');

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
        normalizedFile,
        'comments',
      );

      imageUrl = uploaded.secure_url as string;
      imagePublicId = uploaded.public_id as string;
    }

    const [comment] = await this.db
      .insert(comments)
      .values({
        content,
        reportId,
        userId,
        image: imageUrl,
        imagePublicId,
      })
      .returning();

    return comment;
  }

  async updateComment(
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    userId: number,
    image: UploadedImageFile,
  ) {
    const [comment] = await this.db
      .select({
        userId: comments.userId,
        image: comments.image,
        imagePublicId: comments.imagePublicId,
      })
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this comment',
      );
    }

    const { content, removeImage } = updateCommentDto;

    let imageUrl = comment.image;
    let imagePublicId = comment.imagePublicId;

    if (removeImage && !image) {
      // if the user wants to remove the image
      if (imagePublicId) {
        await this.cloudinaryService.deleteImage(imagePublicId);
      }
      imageUrl = null;
      imagePublicId = null;
    } else if (image) {
      // if the user wants to update the image
      if (imagePublicId) {
        await this.cloudinaryService.deleteImage(imagePublicId);
      }

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
        normalizedFile,
        'comments',
      );

      imageUrl = uploaded.secure_url as string;
      imagePublicId = uploaded.public_id as string;
    }

    const [updatedComment] = await this.db
      .update(comments)
      .set({
        content,
        image: imageUrl,
        imagePublicId,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, commentId))
      .returning();

    return updatedComment;
  }

  async deleteComment(commentId: number, user: User) {
    const [comment] = await this.db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.userId === user.id || user.role === 'admin') {
      if (comment.imagePublicId) {
        await this.cloudinaryService.deleteImage(comment.imagePublicId);
      }

      await this.db.delete(comments).where(eq(comments.id, commentId));

      return { message: 'Comment deleted successfully' };
    } else {
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );
    }
  }

  async reportComment(
    commentId: number,
    userId: number,
    reportCommentDto: ReportCommentInput,
  ) {
    const { reason, description } = reportCommentDto;

    const [comment] = await this.db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);
    if (!comment) throw new NotFoundException('Comment not found');

    const [existingReport] = await this.db
      .select()
      .from(commentReports)
      .where(
        and(
          eq(commentReports.commentId, commentId),
          eq(commentReports.userId, userId),
        ),
      )
      .limit(1);
    if (existingReport) {
      throw new BadRequestException('You have already reported this comment');
    }

    const [report] = await this.db
      .insert(commentReports)
      .values({ userId, commentId, reason, description })
      .returning();

    await this.db
      .insert(commentReportReviews)
      .values({ commentId, status: 'pending' })
      .onConflictDoNothing();

    const recipients = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, 'admin'));

    await this.notificationsQueue.addBulk(
      recipients.map((recipient) => ({
        name: NOTIFICATION_JOBS.SEND,
        data: {
          recipientId: recipient.id,
          actorId: userId,
          type: 'user_reported_comment',
          message: notificationMessageMap['user_reported_comment'],
          commentId,
          reportId: report.id,
        } satisfies NotificationJobData,
      })),
    );

    return report;
  }

  async getReportedComments(reportedCommentQuery: ReportedCommentQueryInput) {
    const { page, limit, status, q } = reportedCommentQuery;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const searchCondition = q
      ? or(
          ilike(users.email, `%${q}%`),
          ilike(profileInfo.firstName, `%${q}%`),
          ilike(profileInfo.lastName, `%${q}%`),
          sql`CONCAT(${profileInfo.firstName}, ' ', ${profileInfo.lastName}) ILIKE ${`%${q}%`}`,
        )
      : undefined;

    const whereClause =
      status && searchCondition
        ? and(eq(commentReportReviews.status, status), searchCondition)
        : status
          ? eq(commentReportReviews.status, status)
          : searchCondition;

    const [data, counts, statsResult] = await Promise.all([
      this.db
        .select({
          commentId: comments.id,
          status: commentReportReviews.status,
          reportCount: sql<number>`(
            SELECT COUNT(*) FROM ${commentReports}
            WHERE ${commentReports.commentId} = ${comments.id}
          )::int`,
          commenterId: users.id,
          commenterEmail: users.email,
          commenterFirstName: profileInfo.firstName,
          commenterLastName: profileInfo.lastName,
          commenterProfilePicture: profileInfo.profilePicture,
        })
        .from(commentReportReviews)
        .innerJoin(comments, eq(commentReportReviews.commentId, comments.id))
        .leftJoin(users, eq(comments.userId, users.id))
        .leftJoin(profileInfo, eq(users.id, profileInfo.userId))
        .where(whereClause)
        .orderBy(desc(commentReportReviews.reviewedAt))
        .limit(limitNumber)
        .offset(offset),

      this.db
        .select({ total: count() })
        .from(commentReportReviews)
        .innerJoin(comments, eq(commentReportReviews.commentId, comments.id))
        .leftJoin(users, eq(comments.userId, users.id))
        .leftJoin(profileInfo, eq(users.id, profileInfo.userId))
        .where(whereClause),

      this.db
        .select({
          totalCount: count(),
          pendingCount: sql<number>`COUNT(*) FILTER (WHERE ${commentReportReviews.status} = 'pending')::int`,
          resolvedCount: sql<number>`COUNT(*) FILTER (WHERE ${commentReportReviews.status} = 'resolved')::int`,
          dismissedCount: sql<number>`COUNT(*) FILTER (WHERE ${commentReportReviews.status} = 'dismissed')::int`,
        })
        .from(commentReportReviews)
        .innerJoin(comments, eq(commentReportReviews.commentId, comments.id))
        .leftJoin(users, eq(comments.userId, users.id))
        .leftJoin(profileInfo, eq(users.id, profileInfo.userId))
        .where(searchCondition),
    ]);

    const { total } = counts[0];
    const { totalCount, pendingCount, resolvedCount, dismissedCount } =
      statsResult[0];

    const formattedData = data.map((item) => ({
      id: item.commentId,
      reportCount: item.reportCount,
      status: item.status,
      commenter: item.commenterId
        ? {
            id: item.commenterId,
            email: item.commenterEmail,
            name: `${item.commenterFirstName ?? ''} ${item.commenterLastName ?? ''}`.trim(),
            profilePicture: item.commenterProfilePicture ?? '',
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
        totalCount,
        pendingCount,
        resolvedCount,
        dismissedCount,
      },
    };
  }

  async getReportedCommentDetails(commentId: number) {
    const commenter = alias(users, 'commenter');
    const commenterProfile = alias(profileInfo, 'commenterProfile');
    const reviewer = alias(users, 'reviewer');
    const reviewerProfile = alias(profileInfo, 'reviewerProfile');

    const [detail] = await this.db
      .select({
        commentId: comments.id,
        content: comments.content,
        image: comments.image,
        createdAt: comments.createdAt,
        status: commentReportReviews.status,
        reviewedAt: commentReportReviews.reviewedAt,
        actionTaken: commentReportReviews.actionTaken,
        reportCount: sql<number>`(
          SELECT COUNT(*) FROM ${commentReports}
          WHERE ${commentReports.commentId} = ${comments.id}
        )::int`,
        commenterId: commenter.id,
        commenterEmail: commenter.email,
        commenterFirstName: commenterProfile.firstName,
        commenterLastName: commenterProfile.lastName,
        commenterProfilePicture: commenterProfile.profilePicture,
        reviewerId: reviewer.id,
        reviewerEmail: reviewer.email,
        reviewerFirstName: reviewerProfile.firstName,
        reviewerLastName: reviewerProfile.lastName,
        reviewerProfilePicture: reviewerProfile.profilePicture,
      })
      .from(commentReportReviews)
      .innerJoin(comments, eq(commentReportReviews.commentId, comments.id))
      .leftJoin(commenter, eq(comments.userId, commenter.id))
      .leftJoin(commenterProfile, eq(commenter.id, commenterProfile.userId))
      .leftJoin(reviewer, eq(commentReportReviews.reviewedBy, reviewer.id))
      .leftJoin(reviewerProfile, eq(reviewer.id, reviewerProfile.userId))
      .where(eq(comments.id, commentId))
      .limit(1);

    if (!detail) {
      throw new NotFoundException('Reported comment not found');
    }

    const reporters = await this.db
      .select({
        userId: users.id,
        email: users.email,
        firstName: profileInfo.firstName,
        lastName: profileInfo.lastName,
        profilePicture: profileInfo.profilePicture,
        reason: commentReports.reason,
        description: commentReports.description,
        createdAt: commentReports.createdAt,
      })
      .from(commentReports)
      .innerJoin(users, eq(commentReports.userId, users.id))
      .leftJoin(profileInfo, eq(users.id, profileInfo.userId))
      .where(eq(commentReports.commentId, commentId));

    return {
      id: detail.commentId,
      createdAt: detail.createdAt,
      actionTaken: detail.actionTaken,
      comment: {
        id: detail.commentId,
        content: detail.content,
        image: detail.image,
        createdAt: detail.createdAt,
        author: detail.commenterId
          ? {
              id: detail.commenterId,
              email: detail.commenterEmail,
              name: `${detail.commenterFirstName ?? ''} ${detail.commenterLastName ?? ''}`.trim(),
              profilePicture: detail.commenterProfilePicture ?? null,
            }
          : null,
      },
      reportCount: detail.reportCount,
      status: detail.status,
      reviewedAt: detail.reviewedAt,
      commenter: detail.commenterId
        ? {
            id: detail.commenterId,
            email: detail.commenterEmail,
            name: `${detail.commenterFirstName ?? ''} ${detail.commenterLastName ?? ''}`.trim(),
            profilePicture: detail.commenterProfilePicture ?? null,
          }
        : null,
      reviewer: detail.reviewerId
        ? {
            id: detail.reviewerId,
            email: detail.reviewerEmail,
            name: `${detail.reviewerFirstName ?? ''} ${detail.reviewerLastName ?? ''}`.trim(),
            profilePicture: detail.reviewerProfilePicture ?? null,
          }
        : null,
      reporters: reporters.map((r) => ({
        id: r.userId,
        email: r.email,
        name: `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim(),
        profilePicture: r.profilePicture ?? null,
        reason: r.reason,
        description: r.description ?? null,
        createdAt: r.createdAt,
      })),
    };
  }

  async handleReportedCommentAction(
    commentId: number,
    actionDto: ReportedCommentActionInput,
    reviewerId: number,
  ) {
    const { action } = actionDto;

    const report = await this.db.query.commentReportReviews.findFirst({
      where: and(
        eq(commentReportReviews.commentId, commentId),
        eq(commentReportReviews.status, 'pending'),
      ),
    });

    if (!report) {
      throw new NotFoundException('No pending report found for this comment');
    }

    const comment = await this.db.query.comments.findFirst({
      where: eq(comments.id, commentId),
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (action === 'warn') {
      await this.db
        .update(commentReportReviews)
        .set({
          status: 'resolved',
          actionTaken: action,
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
        })
        .where(eq(commentReportReviews.commentId, commentId));

      await this.db.delete(comments).where(eq(comments.id, commentId));

      await this.notificationsQueue.add(NOTIFICATION_JOBS.SEND, {
        recipientId: comment.userId,
        actorId: reviewerId,
        type: 'admin_warning_comment',
        message: notificationMessageMap['admin_warning_comment'],
        commentId,
        reportId: report.id,
      } satisfies NotificationJobData);
    } else if (action === 'block') {
      await this.db
        .update(commentReportReviews)
        .set({
          status: 'resolved',
          actionTaken: action,
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
        })
        .where(eq(commentReportReviews.commentId, commentId));
    } else if (action === 'dismiss') {
      await this.db
        .update(commentReportReviews)
        .set({
          status: 'dismissed',
          actionTaken: action,
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
        })
        .where(eq(commentReportReviews.commentId, commentId));
    }

    return {
      message: `Comment report has been ${action === 'dismiss' ? 'dismissed' : 'resolved with action: ' + action}`,
    };
  }

  async deleteReportedComment(commentId: number) {
    const commentReview = await this.db.query.commentReportReviews.findFirst({
      where: eq(commentReportReviews.commentId, commentId),
    });

    if (!commentReview) {
      throw new NotFoundException('No reported comment found for this ID');
    }

    await this.db
      .delete(commentReportReviews)
      .where(eq(commentReportReviews.commentId, commentId));
    await this.db
      .delete(commentReports)
      .where(eq(commentReports.commentId, commentId));
  }
}
