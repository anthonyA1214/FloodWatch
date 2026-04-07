import {
  pgTable,
  serial,
  integer,
  timestamp,
  unique,
  text,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { comments } from './comments.schema';

export const commentReportReasonEnum = pgEnum('comment_report_reason', [
  'misinformation',
  'wrong_pinned_location',
  'not_disaster_related',
  'harmful_panic_content',
]);

export const commentReports = pgTable(
  'comment_reports',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
    commentId: integer('comment_id').references(() => comments.id, {
      onDelete: 'cascade',
    }),
    reason: commentReportReasonEnum('reason').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => [unique().on(t.userId, t.commentId)],
);
