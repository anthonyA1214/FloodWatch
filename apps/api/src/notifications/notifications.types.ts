import { InferInsertModel } from 'drizzle-orm';
import { notifications } from 'src/drizzle/schemas/notifications.schema';

export const NOTIFICATIONS_QUEUE = 'notifications';

export const NOTIFICATION_JOBS = {
  SEND: 'send-notification',
} as const;

export type NotificationJobData = Omit<
  InferInsertModel<typeof notifications>,
  'id' | 'isRead' | 'createdAt'
>;
