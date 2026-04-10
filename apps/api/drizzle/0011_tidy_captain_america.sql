ALTER TYPE "public"."report_status" ADD VALUE 'resolved';--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "user_id" SET NOT NULL;