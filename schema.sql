-- ============================================================
-- SISC Database Schema (PostgreSQL)
-- Generated from Drizzle ORM schema.ts — source of truth
-- ============================================================

-- ENUMS
CREATE TYPE "public"."event_status" AS ENUM('draft', 'pending', 'published', 'rejected');
CREATE TYPE "public"."jenis_event" AS ENUM('seminar', 'conference');
CREATE TYPE "public"."tipe_platform" AS ENUM('online', 'offline', 'hybrid');
CREATE TYPE "public"."tipe_harga" AS ENUM('free', 'paid');
CREATE TYPE "public"."tipe_pembayaran" AS ENUM('bank_transfer', 'qris');
CREATE TYPE "public"."paper_status" AS ENUM('review', 'accepted', 'rejected');
CREATE TYPE "public"."user_role" AS ENUM('admin', 'organizer', 'visitor');
CREATE TYPE "public"."pendaftaran_status" AS ENUM('terdaftar', 'menunggu_verifikasi', 'lunas', 'dibatalkan', 'hadir');
CREATE TYPE "public"."jenis_kelamin" AS ENUM('Laki-laki', 'Perempuan');
CREATE TYPE "public"."log_scraping_status" AS ENUM('pending', 'processing', 'success', 'failed');
CREATE TYPE "public"."scraper_type" AS ENUM('cheerio', 'crawlee_playwright');

-- 1. USERS
CREATE TABLE "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "nama_lengkap" varchar(255),
    "email" varchar(255) UNIQUE,
    "nomor_telepon" varchar(20),
    "institusi" varchar(255),
    "pekerjaan" varchar(255),
    "password" varchar(255),
    "email_terverifikasi" timestamp,
    "tanggal_lahir" timestamp,
    "jenis_kelamin" "jenis_kelamin",
    "role" "user_role" DEFAULT 'visitor',
    "disetujui" boolean DEFAULT false,
    "diblokir" boolean DEFAULT false,
    "terakhir_aktif_pada" timestamp,
    "url_avatar" varchar(512) DEFAULT '/uploads/avatars/fotodummy.jpg',
    "dibuat_pada" timestamp DEFAULT now(),
    "diperbarui_pada" timestamp,
    "dihapus_pada" timestamp
);

-- 2. OTP CODES
CREATE TABLE "otp_codes" (
    "id" serial PRIMARY KEY NOT NULL,
    "email" varchar NOT NULL,
    "code" varchar(6) NOT NULL,
    "kedaluwarsa_pada" timestamp NOT NULL,
    "dibuat_pada" timestamp DEFAULT now()
);

-- 3. PROFIL PENYELENGGARA
CREATE TABLE "profil_penyelenggara" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" integer UNIQUE REFERENCES "users"("id"),
    "nama_instansi" varchar(255),
    "deskripsi_instansi" text,
    "url_dokumen_legalitas" varchar(512),
    "url_website" varchar(255),
    "alasan_penolakan" text,
    "dibuat_pada" timestamp DEFAULT now(),
    "diperbarui_pada" timestamp
);

-- 4. PROVINSI
CREATE TABLE "provinsi" (
    "id" serial PRIMARY KEY NOT NULL,
    "nama" varchar(100) UNIQUE
);

-- 5. KOTA
CREATE TABLE "kota" (
    "id" serial PRIMARY KEY NOT NULL,
    "provinsi_id" integer REFERENCES "provinsi"("id"),
    "nama" varchar(100)
);
CREATE UNIQUE INDEX "kota_provinsi_idx" ON "kota" ("provinsi_id", "nama");

-- 6. KATEGORI
CREATE TABLE "kategori" (
    "id" serial PRIMARY KEY NOT NULL,
    "nama" varchar(100),
    "slug" varchar(100) UNIQUE,
    "url_ikon" varchar(512)
);

-- 7. TAG
CREATE TABLE "tag" (
    "id" serial PRIMARY KEY NOT NULL,
    "nama" varchar(100) UNIQUE
);

-- 8. EVENT TAG (M:N junction)
CREATE TABLE "event_tag" (
    "event_id" integer NOT NULL REFERENCES "event"("id"),
    "tag_id" integer NOT NULL REFERENCES "tag"("id"),
    PRIMARY KEY ("event_id", "tag_id")
);

-- 9. EVENT
CREATE TABLE "event" (
    "id" serial PRIMARY KEY NOT NULL,
    "organizer_id" integer REFERENCES "users"("id"),
    "kategori_id" integer REFERENCES "kategori"("id"),
    "kota_id" integer REFERENCES "kota"("id"),
    "judul" varchar(255) NOT NULL,
    "slug" varchar(255) UNIQUE,
    "deskripsi" text,
    "syarat_dan_ketentuan" text,
    "url_banner" varchar(512),
    "penyelenggara" varchar(255),
    "tanggal_mulai" timestamp NOT NULL,
    "tanggal_selesai" timestamp,
    "batas_registrasi" timestamp,
    "event_polines" boolean DEFAULT false,
    "jenis_event" "jenis_event",
    "tipe_platform" "tipe_platform",
    "tipe_harga" "tipe_harga",
    "harga" integer DEFAULT 0,
    "metode_pembayaran" jsonb,
    "detail_lokasi" text,
    "link_eksternal" varchar(512),
    "kuota" integer,
    "status" "event_status" DEFAULT 'pending',
    "hasil_scraping" boolean DEFAULT false,
    "website_sumber" varchar(255),
    "jumlah_tayangan" integer DEFAULT 0,
    "alasan_penolakan" text,
    "dibuat_pada" timestamp DEFAULT now(),
    "diperbarui_pada" timestamp,
    "dihapus_pada" timestamp
);
CREATE INDEX "organizer_idx" ON "event" ("organizer_id");
CREATE INDEX "kategori_idx" ON "event" ("kategori_id");
CREATE INDEX "status_idx" ON "event" ("status");

-- 10. INFO PEMBAYARAN (global payment methods)
CREATE TABLE "info_pembayaran" (
    "id" serial PRIMARY KEY NOT NULL,
    "tipe" "tipe_pembayaran" NOT NULL,
    "nama_bank" varchar(100),
    "nomor_rekening" varchar(50),
    "pemilik_rekening" varchar(255),
    "url_gambar_qris" varchar(512),
    "aktif" boolean DEFAULT true,
    "dibuat_pada" timestamp DEFAULT now(),
    "diperbarui_pada" timestamp
);

-- 11. PEMBICARA (event speakers, separated from event)
CREATE TABLE "pembicara" (
    "id" serial PRIMARY KEY NOT NULL,
    "event_id" integer NOT NULL REFERENCES "event"("id"),
    "nama" varchar(255) NOT NULL,
    "peran" varchar(100),
    "url_foto" varchar(512),
    "dibuat_pada" timestamp DEFAULT now(),
    "diperbarui_pada" timestamp
);

-- 12. LAMPIRAN EVENT
CREATE TABLE "lampiran_event" (
    "id" serial PRIMARY KEY NOT NULL,
    "event_id" integer REFERENCES "event"("id"),
    "url_file" varchar(512),
    "tipe_file" varchar(50),
    "urutan" integer DEFAULT 0,
    "dibuat_pada" timestamp DEFAULT now()
);

-- 13. LOG ADMIN
CREATE TABLE "log_admin" (
    "id" serial PRIMARY KEY NOT NULL,
    "admin_id" integer REFERENCES "users"("id"),
    "event_id" integer REFERENCES "event"("id"),
    "aksi" varchar(100),
    "data_sebelumnya" jsonb,
    "dibuat_pada" timestamp DEFAULT now()
);

-- 14. FAVORIT (bookmarked events)
CREATE TABLE "favorit" (
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "event_id" integer NOT NULL REFERENCES "event"("id"),
    "dibuat_pada" timestamp DEFAULT now(),
    PRIMARY KEY ("user_id", "event_id")
);

-- 15. PENDAFTARAN (registration + payment combined)
CREATE TABLE "pendaftaran" (
    "id" serial PRIMARY KEY NOT NULL,
    "event_id" integer REFERENCES "event"("id"),
    "user_id" integer REFERENCES "users"("id"),
    "kode_pendaftaran" varchar(50) UNIQUE,
    "status" "pendaftaran_status" DEFAULT 'terdaftar',
    "metode_pembayaran_id" integer REFERENCES "info_pembayaran"("id"),
    "bukti_pembayaran" text,
    "total_harga" integer DEFAULT 0,
    "alasan_penolakan" text,
    "dibuat_pada" timestamp DEFAULT now(),
    "diperbarui_pada" timestamp,
    "dihapus_pada" timestamp
);

-- 16. PESERTA (individual participants per registration)
CREATE TABLE "peserta" (
    "id" serial PRIMARY KEY NOT NULL,
    "pendaftaran_id" integer REFERENCES "pendaftaran"("id"),
    "user_id" integer REFERENCES "users"("id"),
    "kode_peserta" varchar(50) UNIQUE,
    "nama_lengkap" varchar(255),
    "email" varchar(255),
    "nomor_telepon" varchar(20),
    "jenis_kelamin" "jenis_kelamin",
    "dibuat_pada" timestamp DEFAULT now(),
    "diperbarui_pada" timestamp
);

-- 17. PAPER SUBMISSION
CREATE TABLE "paper_submission" (
    "id" serial PRIMARY KEY NOT NULL,
    "event_id" integer NOT NULL REFERENCES "event"("id"),
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "judul" varchar(255) NOT NULL,
    "abstrak" text,
    "kata_kunci" varchar(255),
    "track" varchar(255),
    "url_file" varchar(512) NOT NULL,
    "status" "paper_status" DEFAULT 'review',
    "komentar_penolakan" text,
    "dibuat_pada" timestamp DEFAULT now(),
    "diperbarui_pada" timestamp
);

-- 18. PENULIS PAPER (paper authors, separated from paper_submission)
CREATE TABLE "penulis_paper" (
    "id" serial PRIMARY KEY NOT NULL,
    "paper_submission_id" integer NOT NULL REFERENCES "paper_submission"("id"),
    "nama" varchar(255) NOT NULL,
    "email" varchar(255),
    "institusi" varchar(255),
    "is_corresponding" boolean DEFAULT false,
    "urutan" integer DEFAULT 0,
    "dibuat_pada" timestamp DEFAULT now()
);

-- 19. JADWAL EVENT
CREATE TABLE "jadwal_event" (
    "id" serial PRIMARY KEY NOT NULL,
    "event_id" integer REFERENCES "event"("id"),
    "waktu_mulai" timestamp,
    "waktu_selesai" timestamp,
    "deskripsi" text,
    "dibuat_pada" timestamp DEFAULT now()
);

-- 20. TAYANGAN LOG (event view tracking)
CREATE TABLE "tayangan_log" (
    "event_id" integer REFERENCES "event"("id"),
    "tanggal" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX "tayangan_log_idx" ON "tayangan_log" ("event_id", "tanggal");

-- 21. RAW SCRAPED DATA
CREATE TABLE "raw_scraped_data" (
    "id" serial PRIMARY KEY NOT NULL,
    "sumber" varchar(255) NOT NULL,
    "url_target" varchar(512),
    "data" jsonb NOT NULL,
    "status_integrasi" boolean DEFAULT false,
    "status" varchar(20) DEFAULT 'pending',
    "dibuat_pada" timestamp DEFAULT now()
);
CREATE INDEX "raw_scraped_url_target_idx" ON "raw_scraped_data" ("url_target");
CREATE INDEX "raw_scraped_status_idx" ON "raw_scraped_data" ("status");

-- 22. LOG SCRAPING
CREATE TABLE "log_scraping" (
    "id" serial PRIMARY KEY NOT NULL,
    "target_url" varchar(512),
    "sumber" varchar(255),
    "status" "log_scraping_status" DEFAULT 'pending',
    "jumlah_data" integer DEFAULT 0,
    "error_message" text,
    "mulai_pada" timestamp DEFAULT now(),
    "selesai_pada" timestamp
);

-- 23. SCRAPING SOURCES
CREATE TABLE "scraping_sources" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar(255) NOT NULL,
    "base_url" varchar(500) NOT NULL,
    "url_pattern" varchar(500),
    "scraper_type" "scraper_type" DEFAULT 'cheerio',
    "cron_schedule" varchar(100),
    "max_results_per_run" integer DEFAULT 100,
    "rate_limit_delay_ms" integer DEFAULT 1000,
    "max_concurrent_requests" integer DEFAULT 5,
    "is_active" boolean DEFAULT true,
    "last_scraped_at" timestamp,
    "last_successful_count" integer,
    "last_error_message" text,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- 24. SCRAPING VALIDATION RULES
CREATE TABLE "scraping_validation_rules" (
    "id" serial PRIMARY KEY NOT NULL,
    "field_name" varchar(100) NOT NULL,
    "is_required" boolean DEFAULT true,
    "min_length" integer,
    "max_length" integer,
    "regex_pattern" varchar(500),
    "confidence_threshold" integer DEFAULT 75,
    "created_at" timestamp DEFAULT now()
);

-- 25. SCRAPING AUTO-APPROVAL RULES
CREATE TABLE "scraping_auto_approval_rules" (
    "id" serial PRIMARY KEY NOT NULL,
    "rule_name" varchar(255) NOT NULL,
    "condition_type" varchar(50) NOT NULL,
    "threshold_value" integer DEFAULT 85,
    "auto_publish" boolean DEFAULT true,
    "enabled" boolean DEFAULT true,
    "created_at" timestamp DEFAULT now()
);

-- ============================================================
-- NOTES:
-- 1. Tables 1-20 and tayangan_log have been applied via migrations.
-- 2. Tables info_pembayaran, pembicara, penulis_paper, and
--    enum tipe_pembayaran exist in schema.ts but have NOT yet
--    been generated as a Drizzle Kit migration — they are
--    included above as the intended final state.
-- 3. To apply, run:     npm run db:generate   &&   npm run db:migrate
-- ============================================================
