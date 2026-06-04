ALTER TYPE "public"."event_status" ADD VALUE 'draft' BEFORE 'pending';--> statement-breakpoint
ALTER TABLE "peserta" DROP COLUMN "sudah_check_in";--> statement-breakpoint
ALTER TABLE "peserta" DROP COLUMN "waktu_check_in";