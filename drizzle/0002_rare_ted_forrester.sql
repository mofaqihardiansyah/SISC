CREATE TABLE "otp_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"code" varchar(6) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"dibuat_pada" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profil_penyelenggara" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"nama_instansi" varchar,
	"deskripsi_instansi" text,
	"dokumen_legalitas_url" varchar,
	"website_url" varchar,
	"dibuat_pada" timestamp DEFAULT now(),
	"diperbarui_pada" timestamp,
	CONSTRAINT "profil_penyelenggara_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "sosial_media_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"platform" varchar,
	"url" varchar
);
--> statement-breakpoint
CREATE TABLE "user_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"event_id" integer,
	"status" varchar,
	"dibuat_pada" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "tiket_event" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "tiket_event" CASCADE;--> statement-breakpoint
ALTER TABLE "peserta" RENAME COLUMN "kode_tiket" TO "kode_peserta";--> statement-breakpoint
ALTER TABLE "peserta" DROP CONSTRAINT "peserta_kode_tiket_unique";--> statement-breakpoint
ALTER TABLE "peserta" DROP CONSTRAINT "peserta_tiket_id_tiket_event_id_fk";
--> statement-breakpoint
ALTER TABLE "event_tag" ALTER COLUMN "event_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event_tag" ALTER COLUMN "tag_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "jenis_event" varchar;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "harga" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "kuota" integer;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "dihapus_pada" timestamp;--> statement-breakpoint
ALTER TABLE "rekening_event" ADD COLUMN "qr_code_url" varchar;--> statement-breakpoint
ALTER TABLE "transaksi" ADD COLUMN "rekening_id" integer;--> statement-breakpoint
ALTER TABLE "transaksi" ADD COLUMN "total_harga" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "transaksi" ADD COLUMN "alasan_penolakan" text;--> statement-breakpoint
ALTER TABLE "transaksi" ADD COLUMN "dihapus_pada" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "institution" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "major" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "diperbarui_pada" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dihapus_pada" timestamp;--> statement-breakpoint
ALTER TABLE "profil_penyelenggara" ADD CONSTRAINT "profil_penyelenggara_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sosial_media_user" ADD CONSTRAINT "sosial_media_user_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_event" ADD CONSTRAINT "user_event_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_event" ADD CONSTRAINT "user_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_rekening_id_rekening_event_id_fk" FOREIGN KEY ("rekening_id") REFERENCES "public"."rekening_event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peserta" DROP COLUMN "tiket_id";--> statement-breakpoint
ALTER TABLE "peserta" ADD CONSTRAINT "peserta_kode_peserta_unique" UNIQUE("kode_peserta");