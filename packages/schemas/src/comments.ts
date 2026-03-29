import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

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
  reason: z.enum([
    'misinformation',
    'wrong_pinned_location',
    'not_disaster_related',
    'harmful_panic_content',
  ]),
  description: z.string().trim().max(300).optional(),
});

export class CreateCommentDto extends createZodDto(createCommentSchema) {}
export class UpdateCommentDto extends createZodDto(updateCommentSchema) {}
export class CommentQueryDto extends createZodDto(commentQuerySchema) {}
export class CommentDto extends createZodDto(CommentSchema) {}
export class CommentsResponseDto extends createZodDto(CommentsResponseSchema) {}
export class ReportCommentDto extends createZodDto(reportCommentSchema) {}

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CommentQueryInput = z.infer<typeof commentQuerySchema>;
export type CommentInput = z.infer<typeof CommentSchema>;
export type CommentsResponseInput = z.infer<typeof CommentsResponseSchema>;
export type ReportCommentInput = z.infer<typeof reportCommentSchema>;
