import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const notificationTypeSchema = z.enum([
  'flood_report_posted',
  'flood_resolved',
  'user_comment_on_report',
  'admin_reported_flood',
  'admin_deleted_report',
  'admin_verified_report',
  'admin_warning_comment',
  'user_comment_on_report_admin',
  'user_reported_comment',
  'admin_self_reported_flood',
  'admin_self_deleted_report',
  'admin_self_verified_report',
  'user_confirmed_flood_ongoing',
]);

export const notificationItemSchema = z.object({
  id: z.number(),
  type: notificationTypeSchema,
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.date(),
});

export class NotificationItemDto extends createZodDto(notificationItemSchema) {}

export type NotificationItemInput = z.infer<typeof notificationItemSchema>;
