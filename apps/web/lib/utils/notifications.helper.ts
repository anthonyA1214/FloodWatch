import {
  IconMapPinExclamation,
  IconMessageDots,
  IconShieldExclamation,
  IconTrash,
  IconRosetteDiscountCheck,
  IconAlertTriangle,
  IconMessageReport,
  IconFlag,
  IconUserBolt,
  IconUserX,
  IconUserCheck,
  IconClockExclamation,
  Icon,
  IconCircleCheck,
} from '@tabler/icons-react';
import { NotificationItemInput } from '@repo/schemas';

type NotificationType = NotificationItemInput['type'];

export const iconMap: Record<NotificationType, Icon> = {
  flood_report_posted: IconMapPinExclamation,
  flood_resolved: IconCircleCheck,
  user_comment_on_report: IconMessageDots,
  admin_reported_flood: IconShieldExclamation,
  admin_deleted_report: IconTrash,
  admin_verified_report: IconRosetteDiscountCheck,
  admin_warning_comment: IconAlertTriangle,
  user_comment_on_report_admin: IconMessageReport,
  user_reported_comment: IconFlag,
  admin_self_reported_flood: IconUserBolt,
  admin_self_deleted_report: IconUserX,
  admin_self_verified_report: IconUserCheck,
  user_confirmed_flood_ongoing: IconClockExclamation,
};

export const colorMap: Record<NotificationType, string> = {
  flood_report_posted: '#0066CC',
  flood_resolved: '#00D69B',
  user_comment_on_report: '#0066CC',
  admin_reported_flood: '#9B32E4',
  admin_deleted_report: '#FB2C36',
  admin_verified_report: '#00D69B',
  admin_warning_comment: '#FB923C',
  user_comment_on_report_admin: '#0066CC',
  user_reported_comment: '#D85A30',
  admin_self_reported_flood: '#9B32E4',
  admin_self_deleted_report: '#FB2C36',
  admin_self_verified_report: '#00D69B',
  user_confirmed_flood_ongoing: '#FB923C',
};

export const titleMap: Record<NotificationType, string> = {
  flood_report_posted: 'Flood Report Posted',
  flood_resolved: 'Flood Resolved',
  user_comment_on_report: 'New Comment on Your Report',
  admin_reported_flood: 'Admin Posted a Flood Report',
  admin_deleted_report: 'Your Report Was Deleted',
  admin_verified_report: 'Your Report Was Verified',
  admin_warning_comment: 'Warning on Your Comment',
  user_comment_on_report_admin: 'New Comment on a Report',
  user_reported_comment: 'Comment Flagged as Inappropriate',
  admin_self_reported_flood: 'You Posted a Flood Report',
  admin_self_deleted_report: 'You Deleted a Report',
  admin_self_verified_report: 'You Verified a Report',
  user_confirmed_flood_ongoing: 'Flood Confirmed Still Ongoing',
};
