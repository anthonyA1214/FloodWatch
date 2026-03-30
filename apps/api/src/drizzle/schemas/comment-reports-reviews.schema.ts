import {
  pgTable,
  serial,
  integer,
  pgEnum,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { comments } from './comments.schema';
import { users } from './users.schema';

export const commentReportStatusEnum = pgEnum('comment_report_status', [
  'pending',
  'resolved',
  'dismissed',
]);

export const commentReportReviews = pgTable('comment_report_reviews', {
  id: serial('id').primaryKey(),
  commentId: integer('comment_id')
    .unique() // enforces one review per comment
    .references(() => comments.id, { onDelete: 'cascade' }),
  reviewedBy: integer('reviewed_by').references(() => users.id, {
    onDelete: 'set null',
  }),
  status: commentReportStatusEnum('status').notNull().default('pending'),
  reviewedAt: timestamp('reviewed_at'),
});
