CREATE TABLE "bookmark" (
	"id" serial PRIMARY KEY NOT NULL,
	"pengguna_id" integer,
	"event_id" integer,
	"dibuat_pada" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event" (
	"id" serial PRIMARY KEY NOT NULL,
	"penyelenggara_id" integer,
	"kategori_id" integer,
	"kota_id" integer,
	"judul" varchar,
	"slug" varchar,
	"deskripsi" text,
	"syarat_ketentuan" text,
	"url_banner" varchar,
	"tanggal_mulai" timestamp,
	"tanggal_selesai" timestamp,
	"batas_registrasi" timestamp,
	"is_event_polines" boolean DEFAULT false,
	"tipe_platform" varchar,
	"tipe_harga" varchar,
	"detail_lokasi" text,
	"link_eksternal" varchar,
	"nama_kontak" varchar,
	"email_kontak" varchar,
	"telepon_kontak" varchar,
	"maks_tiket_per_transaksi" integer,
	"satu_akun_satu_transaksi" boolean DEFAULT false,
	"status" varchar DEFAULT 'pending',
	"hasil_scraping" boolean DEFAULT false,
	"sumber_website" varchar,
	"jumlah_dilihat" integer DEFAULT 0,
	"alasan_penolakan" text,
	"dibuat_pada" timestamp DEFAULT now(),
	"diperbarui_pada" timestamp,
	CONSTRAINT "event_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "event_tag" (
	"event_id" integer,
	"tag_id" integer,
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
	"nama" varchar,
	"slug" varchar,
	"url_ikon" varchar,
	CONSTRAINT "kategori_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "kota" (
	"id" serial PRIMARY KEY NOT NULL,
	"provinsi_id" integer,
	"nama" varchar
);
--> statement-breakpoint
CREATE TABLE "lampiran_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"url_file" varchar,
	"tipe_file" varchar
);
--> statement-breakpoint
CREATE TABLE "log_admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" integer,
	"event_id" integer,
	"aksi" varchar,
	"data_sebelumnya" jsonb,
	"dibuat_pada" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifikasi" (
	"id" serial PRIMARY KEY NOT NULL,
	"pengguna_id" integer,
	"judul" varchar,
	"pesan" text,
	"sudah_dibaca" boolean DEFAULT false,
	"dibuat_pada" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pembicara_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"nama" varchar,
	"peran" varchar,
	"url_foto" varchar
);
--> statement-breakpoint
CREATE TABLE "pengguna" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama_lengkap" varchar,
	"email" varchar,
	"password" varchar,
	"no_telepon" varchar,
	"tanggal_lahir" timestamp,
	"jenis_kelamin" varchar,
	"nik" varchar,
	"peran" varchar,
	"url_avatar" varchar,
	"terverifikasi" boolean DEFAULT false,
	"dibuat_pada" timestamp DEFAULT now(),
	CONSTRAINT "pengguna_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "peserta" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaksi_id" integer,
	"tiket_id" integer,
	"kode_tiket" varchar,
	"nama_lengkap" varchar,
	"email" varchar,
	"no_telepon" varchar,
	"hadir" boolean DEFAULT false,
	"waktu_kehadiran" timestamp,
	CONSTRAINT "peserta_kode_tiket_unique" UNIQUE("kode_tiket")
);
--> statement-breakpoint
CREATE TABLE "provinsi" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" varchar,
	CONSTRAINT "provinsi_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "sosial_media_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"platform" varchar,
	"url" varchar
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" varchar,
	CONSTRAINT "tag_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "tiket_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"nama" varchar,
	"deskripsi" text,
	"harga" integer DEFAULT 0,
	"kuota" integer,
	"tanggal_mulai_penjualan" timestamp,
	"tanggal_selesai_penjualan" timestamp,
	"dibuat_pada" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transaksi" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"pengguna_id" integer,
	"kode_booking" varchar,
	"status" varchar DEFAULT 'pending',
	"dibuat_pada" timestamp DEFAULT now(),
	"diperbarui_pada" timestamp,
	CONSTRAINT "transaksi_kode_booking_unique" UNIQUE("kode_booking")
);
--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_pengguna_id_pengguna_id_fk" FOREIGN KEY ("pengguna_id") REFERENCES "public"."pengguna"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_penyelenggara_id_pengguna_id_fk" FOREIGN KEY ("penyelenggara_id") REFERENCES "public"."pengguna"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_kategori_id_kategori_id_fk" FOREIGN KEY ("kategori_id") REFERENCES "public"."kategori"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_kota_id_kota_id_fk" FOREIGN KEY ("kota_id") REFERENCES "public"."kota"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_tag" ADD CONSTRAINT "event_tag_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_tag" ADD CONSTRAINT "event_tag_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jadwal_event" ADD CONSTRAINT "jadwal_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kota" ADD CONSTRAINT "kota_provinsi_id_provinsi_id_fk" FOREIGN KEY ("provinsi_id") REFERENCES "public"."provinsi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lampiran_event" ADD CONSTRAINT "lampiran_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_admin" ADD CONSTRAINT "log_admin_admin_id_pengguna_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."pengguna"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_admin" ADD CONSTRAINT "log_admin_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_pengguna_id_pengguna_id_fk" FOREIGN KEY ("pengguna_id") REFERENCES "public"."pengguna"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pembicara_event" ADD CONSTRAINT "pembicara_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peserta" ADD CONSTRAINT "peserta_transaksi_id_transaksi_id_fk" FOREIGN KEY ("transaksi_id") REFERENCES "public"."transaksi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peserta" ADD CONSTRAINT "peserta_tiket_id_tiket_event_id_fk" FOREIGN KEY ("tiket_id") REFERENCES "public"."tiket_event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sosial_media_event" ADD CONSTRAINT "sosial_media_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tiket_event" ADD CONSTRAINT "tiket_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_pengguna_id_pengguna_id_fk" FOREIGN KEY ("pengguna_id") REFERENCES "public"."pengguna"("id") ON DELETE no action ON UPDATE no action;