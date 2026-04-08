ALTER TABLE "notifications" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."notification_type";--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('flood_report_posted', 'flood_resolved', 'user_comment_on_report', 'admin_reported_flood', 'admin_deleted_report', 'admin_verified_report', 'admin_warning_comment', 'user_comment_on_report_admin', 'user_reported_comment', 'admin_self_reported_flood', 'admin_self_deleted_report', 'admin_self_verified_report');--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "type" SET DATA TYPE "public"."notification_type" USING "type"::"public"."notification_type";--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "report_id" SET NOT NULL;