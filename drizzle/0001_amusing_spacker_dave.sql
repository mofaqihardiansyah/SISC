CREATE TABLE "komentar_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"user_id" integer,
	"pesan" text,
	"dibuat_pada" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rekening_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"nama_bank" varchar,
	"nomor_rekening" varchar,
	"atas_nama" varchar
);
--> statement-breakpoint
ALTER TABLE "pengguna" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "bookmark" RENAME COLUMN "pengguna_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "event" RENAME COLUMN "penyelenggara_id" TO "organizer_id";--> statement-breakpoint
ALTER TABLE "event" RENAME COLUMN "syarat_ketentuan" TO "syarat_dan_ketentuan";--> statement-breakpoint
ALTER TABLE "event" RENAME COLUMN "url_banner" TO "banner_url";--> statement-breakpoint
ALTER TABLE "event" RENAME COLUMN "sumber_website" TO "website_sumber";--> statement-breakpoint
ALTER TABLE "event" RENAME COLUMN "jumlah_dilihat" TO "jumlah_tayangan";--> statement-breakpoint
ALTER TABLE "kategori" RENAME COLUMN "url_ikon" TO "icon_url";--> statement-breakpoint
ALTER TABLE "lampiran_event" RENAME COLUMN "url_file" TO "file_url";--> statement-breakpoint
ALTER TABLE "notifikasi" RENAME COLUMN "pengguna_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "pembicara_event" RENAME COLUMN "url_foto" TO "foto_url";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "no_telepon" TO "nomor_telepon";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "peran" TO "role";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "url_avatar" TO "avatar_url";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "terverifikasi" TO "is_terverifikasi";--> statement-breakpoint
ALTER TABLE "peserta" RENAME COLUMN "no_telepon" TO "nomor_telepon";--> statement-breakpoint
ALTER TABLE "peserta" RENAME COLUMN "hadir" TO "sudah_check_in";--> statement-breakpoint
ALTER TABLE "peserta" RENAME COLUMN "waktu_kehadiran" TO "waktu_check_in";--> statement-breakpoint
ALTER TABLE "transaksi" RENAME COLUMN "pengguna_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "pengguna_email_unique";--> statement-breakpoint
ALTER TABLE "bookmark" DROP CONSTRAINT "bookmark_pengguna_id_pengguna_id_fk";
--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT "event_penyelenggara_id_pengguna_id_fk";
--> statement-breakpoint
ALTER TABLE "log_admin" DROP CONSTRAINT "log_admin_admin_id_pengguna_id_fk";
--> statement-breakpoint
ALTER TABLE "notifikasi" DROP CONSTRAINT "notifikasi_pengguna_id_pengguna_id_fk";
--> statement-breakpoint
ALTER TABLE "transaksi" DROP CONSTRAINT "transaksi_pengguna_id_pengguna_id_fk";
--> statement-breakpoint
ALTER TABLE "transaksi" ADD COLUMN "metode_pembayaran" varchar;--> statement-breakpoint
ALTER TABLE "transaksi" ADD COLUMN "bukti_pembayaran_url" varchar;--> statement-breakpoint
ALTER TABLE "komentar_event" ADD CONSTRAINT "komentar_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "komentar_event" ADD CONSTRAINT "komentar_event_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rekening_event" ADD CONSTRAINT "rekening_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_admin" ADD CONSTRAINT "log_admin_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");