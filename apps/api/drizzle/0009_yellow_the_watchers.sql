CREATE TYPE "public"."notification_type" AS ENUM('flood_report_posted', 'flood_resolved', 'user_comment_on_report', 'admin_reported_flood', 'admin_deleted_report', 'admin_verified_report', 'admin_deleted_comment', 'user_comment_on_report_admin', 'user_reported_comment', 'admin_self_reported_flood', 'admin_self_deleted_report', 'admin_self_verified_report', 'user_confirmed_flood_ongoing');--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipient_id" integer NOT NULL,
	"actor_id" integer,
	"type" "notification_type" NOT NULL,
	"message" text NOT NULL,
	"report_id" integer,
	"comment_id" integer,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;