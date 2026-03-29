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
  UpdateCommentDto,
} from '@repo/schemas';
import { and, desc, eq, lt, or, sql } from 'drizzle-orm';
import { User } from 'src/auth/types/auth-request.type';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { DRIZZLE } from 'src/drizzle/drizzle-connection';
import {
  commentReports,
  comments,
  profileInfo,
  reports,
  users,
} from 'src/drizzle/schemas';
import { type DrizzleDB } from 'src/drizzle/types/drizzle';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private imagesService: ImagesService,
    private cloudinaryService: CloudinaryService,
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
    image: Express.Multer.File,
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
    image: Express.Multer.File,
  ) {
    const [comment] = await this.db
      .select()
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
      .values({
        userId,
        commentId,
        reason,
        description,
      })
      .returning();

    return report;
  }
}
