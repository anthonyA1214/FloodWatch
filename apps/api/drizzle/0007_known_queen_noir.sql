CREATE TYPE "public"."action_taken" AS ENUM('warn', 'block', 'dismiss');--> statement-breakpoint
ALTER TABLE "comment_report_reviews" ADD COLUMN "action_taken" "action_taken";