import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { reports } from './reports.schema';

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  reportId: integer('report_id')
    .references(() => reports.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  content: text('content'),
  image: text('image'),
  imagePublicId: text('image_public_id'),
  isAdmin: boolean('is_admin').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
