import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const commentReportReasonSchema = z.enum([
  'misinformation',
  'wrong_pinned_location',
  'not_disaster_related',
  'harmful_panic_content',
]);

export const commentReportStatusSchema = z.enum([
  'pending',
  'resolved',
  'dismissed',
]);

export const actionEnum = z.enum(['warn', 'block', 'dismiss']);

export const createCommentSchema = z.object({
  content: z.string().trim().optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().trim().optional(),
  removeImage: z
    .literal('true')
    .transform(() => true)
    .optional(),
});

export const commentQuerySchema = z
  .object({
    cursorDate: z.iso.datetime().optional(),
    cursorId: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).default(5),
  })
  .refine(
    (data) => (data.cursorDate === undefined) === (data.cursorId === undefined),
    {
      message: 'cursorDate and cursorId must both be provided or both omitted',
    },
  );

const CommentSchema = z.object({
  id: z.number(),
  content: z.string(),
  image: z.string().nullable(),
  reportCount: z.number(),
  hasReported: z.boolean(),
  createdAt: z.date(),
  author: z
    .object({
      id: z.number(),
      name: z.string(),
      profilePicture: z.string().nullable(),
    })
    .nullable(),
});

const CommentPreviewSchema = CommentSchema.pick({
  id: true,
  content: true,
  image: true,
  createdAt: true,
  author: true,
});

export const CommentsResponseSchema = z.object({
  data: CommentSchema.array(),
  meta: z.object({
    hasMore: z.boolean(),
    nextCursor: z
      .object({
        cursorDate: z.string(),
        cursorId: z.number(),
      })
      .nullable(),
  }),
});

export const reportCommentSchema = z.object({
  reason: commentReportReasonSchema,
  description: z.string().trim().max(300).optional(),
});

export const reportedCommentSchema = z.object({
  id: z.number(),
  commenter: z.object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
    profilePicture: z.string().nullable(),
  }),
  reportCount: z.number(),
  status: commentReportStatusSchema,
});

export const reportedCommentDetailSchema = reportedCommentSchema.extend({
  comment: CommentPreviewSchema,
  reviewer: z
    .object({
      id: z.number(),
      email: z.string(),
      name: z.string(),
      profilePicture: z.string().nullable(),
    })
    .nullable(),
  reviewedAt: z.coerce.date().nullable(),
  reporters: z.array(
    z.object({
      id: z.number(),
      email: z.string(),
      name: z.string(),
      profilePicture: z.string().nullable(),
      reason: commentReportReasonSchema,
      description: z.string().nullable(),
      createdAt: z.coerce.date().nullable(),
    }),
  ),
  actionTaken: actionEnum,
});

export const reportedCommentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: commentReportStatusSchema.optional(),
  q: z.string().optional(),
});

export const reportedCommentActionSchema = z.object({
  action: actionEnum,
});

export class CreateCommentDto extends createZodDto(createCommentSchema) {}
export class UpdateCommentDto extends createZodDto(updateCommentSchema) {}
export class CommentQueryDto extends createZodDto(commentQuerySchema) {}
export class CommentDto extends createZodDto(CommentSchema) {}
export class CommentPreviewDto extends createZodDto(CommentPreviewSchema) {}
export class CommentsResponseDto extends createZodDto(CommentsResponseSchema) {}
export class ReportCommentDto extends createZodDto(reportCommentSchema) {}
export class ReportedCommentDto extends createZodDto(reportedCommentSchema) {}
export class ReportedCommentDetailDto extends createZodDto(
  reportedCommentDetailSchema,
) {}
export class ReportedCommentQueryDto extends createZodDto(
  reportedCommentQuerySchema,
) {}
export class ReportedCommentActionDto extends createZodDto(
  reportedCommentActionSchema,
) {}

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CommentQueryInput = z.infer<typeof commentQuerySchema>;
export type CommentInput = z.infer<typeof CommentSchema>;
export type CommentPreviewInput = z.infer<typeof CommentPreviewSchema>;
export type CommentsResponseInput = z.infer<typeof CommentsResponseSchema>;
export type ReportCommentInput = z.infer<typeof reportCommentSchema>;
export type ReportedCommentInput = z.infer<typeof reportedCommentSchema>;
export type ReportedCommentDetailInput = z.infer<
  typeof reportedCommentDetailSchema
>;
export type ReportedCommentQueryInput = z.infer<
  typeof reportedCommentQuerySchema
>;
export type ReportedCommentActionInput = z.infer<
  typeof reportedCommentActionSchema
>;
