CREATE TYPE "public"."event_status" AS ENUM('pending', 'published', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."jenis_event" AS ENUM('seminar', 'conference');--> statement-breakpoint
CREATE TYPE "public"."jenis_kelamin" AS ENUM('Laki-laki', 'Perempuan');--> statement-breakpoint
CREATE TYPE "public"."paper_status" AS ENUM('review', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."pendaftaran_status" AS ENUM('terdaftar', 'dibatalkan', 'hadir');--> statement-breakpoint
CREATE TYPE "public"."tipe_harga" AS ENUM('free', 'paid');--> statement-breakpoint
CREATE TYPE "public"."tipe_platform" AS ENUM('online', 'offline', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'organizer', 'visitor');--> statement-breakpoint
CREATE TABLE "bookmark" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"event_id" integer,
	"dibuat_pada" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event" (
	"id" serial PRIMARY KEY NOT NULL,
	"organizer_id" integer,
	"kategori_id" integer,
	"kota_id" integer,
	"judul" varchar(255) NOT NULL,
	"slug" varchar(255),
	"deskripsi" text,
	"syarat_dan_ketentuan" text,
	"banner_url" varchar(512),
	"penyelenggara" varchar(255),
	"tanggal_mulai" timestamp NOT NULL,
	"tanggal_selesai" timestamp,
	"batas_registrasi" timestamp,
	"is_event_polines" boolean DEFAULT false,
	"jenis_event" "jenis_event",
	"tipe_platform" "tipe_platform",
	"tipe_harga" "tipe_harga",
	"harga" integer DEFAULT 0,
	"detail_lokasi" text,
	"link_eksternal" varchar(512),
	"nama_kontak" varchar(255),
	"email_kontak" varchar(255),
	"telepon_kontak" varchar(20),
	"kuota" integer,
	"maks_tiket_per_transaksi" integer,
	"satu_akun_satu_transaksi" boolean DEFAULT false,
	"status" "event_status" DEFAULT 'pending',
	"hasil_scraping" boolean DEFAULT false,
	"website_sumber" varchar(255),
	"jumlah_tayangan" integer DEFAULT 0,
	"alasan_penolakan" text,
	"nama_pembicara" varchar(255),
	"peran_pembicara" varchar(100),
	"foto_pembicara_url" varchar(512),
	"dibuat_pada" timestamp DEFAULT now(),
	"diperbarui_pada" timestamp,
	"dihapus_pada" timestamp,
	CONSTRAINT "event_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "event_tag" (
	"event_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "event_tag_event_id_tag_id_pk" PRIMARY KEY("event_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "jadwal_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"waktu_mulai" timestamp,
	"waktu_selesai" timestamp,
	"deskripsi" text
);
--> statement-breakpoint
CREATE TABLE "kategori" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" varchar(100),
	"slug" varchar(100),
	"icon_url" varchar(512),
	CONSTRAINT "kategori_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "kota" (
	"id" serial PRIMARY KEY NOT NULL,
	"provinsi_id" integer,
	"nama" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "lampiran_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"file_url" varchar(512),
	"tipe_file" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "log_admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" integer,
	"event_id" integer,
	"aksi" varchar(100),
	"data_sebelumnya" jsonb,
	"dibuat_pada" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "otp_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"code" varchar(6) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"dibuat_pada" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "paper_submission" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"judul" varchar(255) NOT NULL,
	"penulis" text NOT NULL,
	"file_url" varchar(512) NOT NULL,
	"status" "paper_status" DEFAULT 'review',
	"komentar_penolakan" text,
	"dibuat_pada" timestamp DEFAULT now(),
	"diperbarui_pada" timestamp
);
--> statement-breakpoint
CREATE TABLE "pendaftaran" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"user_id" integer,
	"kode_pendaftaran" varchar(50),
	"status" "pendaftaran_status" DEFAULT 'terdaftar',
	"dibuat_pada" timestamp DEFAULT now(),
	"diperbarui_pada" timestamp,
	"dihapus_pada" timestamp,
	CONSTRAINT "pendaftaran_kode_pendaftaran_unique" UNIQUE("kode_pendaftaran")
);
--> statement-breakpoint
CREATE TABLE "peserta" (
	"id" serial PRIMARY KEY NOT NULL,
	"pendaftaran_id" integer,
	"kode_peserta" varchar(50),
	"nama_lengkap" varchar(255),
	"email" varchar(255),
	"nomor_telepon" varchar(20),
	"jenis_kelamin" "jenis_kelamin",
	"sudah_check_in" boolean DEFAULT false,
	"waktu_check_in" timestamp,
	CONSTRAINT "peserta_kode_peserta_unique" UNIQUE("kode_peserta")
);
--> statement-breakpoint
CREATE TABLE "profil_penyelenggara" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"nama_instansi" varchar(255),
	"deskripsi_instansi" text,
	"dokumen_legalitas_url" varchar(512),
	"website_url" varchar(255),
	"dibuat_pada" timestamp DEFAULT now(),
	"diperbarui_pada" timestamp,
	CONSTRAINT "profil_penyelenggara_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "provinsi" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" varchar(100),
	CONSTRAINT "provinsi_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" varchar(100),
	CONSTRAINT "tag_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama_lengkap" varchar(255),
	"email" varchar(255),
	"nomor_telepon" varchar(20),
	"institution" varchar(255),
	"password" varchar(255),
	"email_verified" timestamp,
	"tanggal_lahir" timestamp,
	"jenis_kelamin" "jenis_kelamin",
	"nik" varchar(16),
	"role" "user_role" DEFAULT 'visitor',
	"is_terverifikasi" boolean DEFAULT false,
	"avatar_url" varchar(512) DEFAULT '/uploads/avatars/fotodummy.jpg',
	"dibuat_pada" timestamp DEFAULT now(),
	"diperbarui_pada" timestamp,
	"dihapus_pada" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_kategori_id_kategori_id_fk" FOREIGN KEY ("kategori_id") REFERENCES "public"."kategori"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_kota_id_kota_id_fk" FOREIGN KEY ("kota_id") REFERENCES "public"."kota"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_tag" ADD CONSTRAINT "event_tag_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_tag" ADD CONSTRAINT "event_tag_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jadwal_event" ADD CONSTRAINT "jadwal_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kota" ADD CONSTRAINT "kota_provinsi_id_provinsi_id_fk" FOREIGN KEY ("provinsi_id") REFERENCES "public"."provinsi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lampiran_event" ADD CONSTRAINT "lampiran_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_admin" ADD CONSTRAINT "log_admin_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_admin" ADD CONSTRAINT "log_admin_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paper_submission" ADD CONSTRAINT "paper_submission_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paper_submission" ADD CONSTRAINT "paper_submission_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pendaftaran" ADD CONSTRAINT "pendaftaran_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pendaftaran" ADD CONSTRAINT "pendaftaran_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peserta" ADD CONSTRAINT "peserta_pendaftaran_id_pendaftaran_id_fk" FOREIGN KEY ("pendaftaran_id") REFERENCES "public"."pendaftaran"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profil_penyelenggara" ADD CONSTRAINT "profil_penyelenggara_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "bookmark_user_event_idx" ON "bookmark" USING btree ("user_id","event_id");--> statement-breakpoint
CREATE INDEX "organizer_idx" ON "event" USING btree ("organizer_id");--> statement-breakpoint
CREATE INDEX "kategori_idx" ON "event" USING btree ("kategori_id");--> statement-breakpoint
CREATE INDEX "status_idx" ON "event" USING btree ("status");