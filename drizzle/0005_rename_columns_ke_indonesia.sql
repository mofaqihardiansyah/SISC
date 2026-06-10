-- Rename columns di tabel users
ALTER TABLE "users" RENAME COLUMN "institution" TO "institusi";
ALTER TABLE "users" RENAME COLUMN "email_verified" TO "email_terverifikasi";
ALTER TABLE "users" RENAME COLUMN "is_approved" TO "disetujui";
ALTER TABLE "users" RENAME COLUMN "is_suspended" TO "diblokir";
ALTER TABLE "users" RENAME COLUMN "last_active_at" TO "terakhir_aktif_pada";
ALTER TABLE "users" RENAME COLUMN "avatar_url" TO "url_avatar";

-- Rename columns di tabel otp_codes
ALTER TABLE "otp_codes" RENAME COLUMN "expires_at" TO "kedaluwarsa_pada";

-- Rename columns di tabel profil_penyelenggara
ALTER TABLE "profil_penyelenggara" RENAME COLUMN "dokumen_legalitas_url" TO "url_dokumen_legalitas";
ALTER TABLE "profil_penyelenggara" RENAME COLUMN "website_url" TO "url_website";

-- Rename columns di tabel kategori
ALTER TABLE "kategori" RENAME COLUMN "icon_url" TO "url_ikon";

-- Rename columns di tabel event
ALTER TABLE "event" RENAME COLUMN "banner_url" TO "url_banner";
ALTER TABLE "event" RENAME COLUMN "is_event_polines" TO "event_polines";
ALTER TABLE "event" RENAME COLUMN "foto_pembicara_url" TO "url_foto_pembicara";
ALTER TABLE "event" RENAME COLUMN "qris_image_url" TO "url_gambar_qris";

-- Rename columns di tabel lampiran_event
ALTER TABLE "lampiran_event" RENAME COLUMN "file_url" TO "url_file";

-- Rename columns di tabel paper_submission
ALTER TABLE "paper_submission" RENAME COLUMN "file_url" TO "url_file";

-- Rename columns di tabel pemberitahuan
ALTER TABLE "pemberitahuan" RENAME COLUMN "created_at" TO "dibuat_pada";

-- Rename columns di tabel favorit
ALTER TABLE "favorit" RENAME COLUMN "created_at" TO "dibuat_pada";
