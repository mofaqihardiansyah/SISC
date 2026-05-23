ALTER TABLE "users" ADD COLUMN "pekerjaan" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_approved" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_suspended" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_active_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "nik";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_terverifikasi";