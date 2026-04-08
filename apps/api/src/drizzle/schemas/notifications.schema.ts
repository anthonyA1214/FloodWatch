import {
  pgTable,
  text,
  boolean,
  timestamp,
  pgEnum,
  serial,
  integer,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { reports } from './reports.schema';
import { comments } from './comments.schema';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const notificationTypeEnum = pgEnum('notification_type', [
  // ── Shared (visible to both user & admin) ──
  'flood_report_posted', // Someone posted a flood report
  'flood_resolved', // A flood has been marked resolved

  // ── User notifications ──
  'user_comment_on_report', // Another user commented on your report
  'admin_reported_flood', // Admin posted a flood report
  'admin_deleted_report', // Admin deleted your report
  'admin_verified_report', // Admin verified your report
  'admin_warning_comment', // Admin issued a warning about your comment (inappropriate)

  // ── Admin notifications ──
  'user_comment_on_report_admin', // User commented on a report (admin view)
  'user_reported_comment', // User flagged a comment as inappropriate
  'admin_self_reported_flood', // Admin themselves reported a flood
  'admin_self_deleted_report', // Admin themselves deleted a report
  'admin_self_verified_report', // Admin themselves verified a report
  // 'user_confirmed_flood_ongoing', // User confirmed a flood is still ongoing
]);

// ─── Table ────────────────────────────────────────────────────────────────────

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  recipientId: integer('recipient_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  actorId: integer('actor_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  type: notificationTypeEnum('type').notNull(),
  message: text('message').notNull(),
  reportId: integer('report_id').references(() => reports.id, {
    onDelete: 'set null',
  }),
  commentId: integer('comment_id').references(() => comments.id, {
    onDelete: 'set null',
  }),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});
