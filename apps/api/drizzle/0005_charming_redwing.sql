CREATE TABLE "comment_report_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment_id" integer,
	"reviewed_by" integer,
	"status" "comment_report_status" DEFAULT 'pending' NOT NULL,
	"admin_notes" text,
	"reviewed_at" timestamp,
	CONSTRAINT "comment_report_reviews_comment_id_unique" UNIQUE("comment_id")
);
--> statement-breakpoint
ALTER TABLE "comment_reports" DROP CONSTRAINT "comment_reports_reviewed_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "comment_report_reviews" ADD CONSTRAINT "comment_report_reviews_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_report_reviews" ADD CONSTRAINT "comment_report_reviews_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_reports" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "comment_reports" DROP COLUMN "reviewed_by";--> statement-breakpoint
ALTER TABLE "comment_reports" DROP COLUMN "reviewed_at";