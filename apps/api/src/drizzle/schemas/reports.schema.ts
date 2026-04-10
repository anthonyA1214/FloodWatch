import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  text,
  serial,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { doublePrecision } from 'drizzle-orm/pg-core';

export const severityEnum = pgEnum('severity', [
  'low',
  'moderate',
  'high',
  'critical',
]);

export const reportsStatusEnum = pgEnum('report_status', [
  'unverified',
  'verified',
  'resolved',
]);

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  verifierId: integer('verifier_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  location: text('location').notNull().default('Unknown location'),
  range: doublePrecision('range').notNull(),
  description: text('description'),
  image: text('image'),
  imagePublicId: text('image_public_id'),
  severity: severityEnum().notNull(),
  status: reportsStatusEnum().notNull().default('unverified'),
  isAdmin: boolean('is_admin').notNull().default(false),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
