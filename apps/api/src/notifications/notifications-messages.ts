import { notificationTypeEnum } from 'src/drizzle/schemas/notifications.schema';

type NotificationType = (typeof notificationTypeEnum.enumValues)[number];

export const notificationMessageMap: Record<NotificationType, string> = {
  flood_report_posted: 'A new flood report has been posted.',
  flood_resolved: 'A flood has been marked as resolved.',
  user_comment_on_report: 'Someone commented on your report.',
  admin_reported_flood: 'An admin has reported a flood alert.',
  admin_deleted_report: 'An admin has deleted your report.',
  admin_verified_report: 'An admin has verified your report.',
  admin_warning_comment: 'An admin has issued a warning about your comment.',
  user_comment_on_report_admin: 'A user commented on a report.',
  user_reported_comment: 'A user flagged a comment as inappropriate.',
  admin_self_reported_flood: 'You have successfully reported a flood alert.',
  admin_self_deleted_report: 'You have successfully deleted a report.',
  admin_self_verified_report: 'You have successfully verified a flood report.',
};
