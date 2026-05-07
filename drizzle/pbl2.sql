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
	"judul" varchar,
	"slug" varchar,
	"deskripsi" text,
	"syarat_dan_ketentuan" text,
	"banner_url" varchar,
	"penyelenggara" varchar,
	"tanggal_mulai" timestamp,
	"tanggal_selesai" timestamp,
	"batas_registrasi" timestamp,
	"is_event_polines" boolean DEFAULT false,
	"jenis_event" varchar,
	"tipe_platform" varchar,
	"tipe_harga" varchar,
	"harga" integer DEFAULT 0,
	"detail_lokasi" text,
	"link_eksternal" varchar,
	"nama_kontak" varchar,
	"email_kontak" varchar,
	"telepon_kontak" varchar,
	"kuota" integer,
	"maks_tiket_per_transaksi" integer,
	"satu_akun_satu_transaksi" boolean DEFAULT false,
	"status" varchar DEFAULT 'pending',
	"hasil_scraping" boolean DEFAULT false,
	"website_sumber" varchar,
	"jumlah_tayangan" integer DEFAULT 0,
	"alasan_penolakan" text,
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
	"nama" varchar,
	"slug" varchar,
	"icon_url" varchar,
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
	"file_url" varchar,
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
CREATE TABLE "otp_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"code" varchar(6) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"dibuat_pada" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pembicara_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"nama" varchar,
	"peran" varchar,
	"foto_url" varchar
);
--> statement-breakpoint
CREATE TABLE "peserta" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaksi_id" integer,
	"kode_peserta" varchar,
	"nama_lengkap" varchar,
	"email" varchar,
	"nomor_telepon" varchar,
	"jenis_kelamin" varchar,
	"sudah_check_in" boolean DEFAULT false,
	"waktu_check_in" timestamp,
	CONSTRAINT "peserta_kode_peserta_unique" UNIQUE("kode_peserta")
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
CREATE TABLE "provinsi" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" varchar,
	CONSTRAINT "provinsi_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" varchar,
	CONSTRAINT "tag_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "transaksi" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"user_id" integer,
	"kode_booking" varchar,
	"total_harga" integer DEFAULT 0,
	"metode_pembayaran" varchar,
	"bukti_pembayaran_url" varchar,
	"status" varchar DEFAULT 'pending',
	"alasan_penolakan" text,
	"dibuat_pada" timestamp DEFAULT now(),
	"diperbarui_pada" timestamp,
	"dihapus_pada" timestamp,
	CONSTRAINT "transaksi_kode_booking_unique" UNIQUE("kode_booking")
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
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama_lengkap" varchar,
	"email" varchar,
	"nomor_telepon" varchar,
	"institution" varchar,
	"password" varchar,
	"email_verified" timestamp,
	"tanggal_lahir" timestamp,
	"jenis_kelamin" varchar,
	"nik" varchar,
	"role" varchar,
	"is_terverifikasi" boolean DEFAULT false,
	"avatar_url" varchar DEFAULT '/uploads/avatars/fotodummy.jpg',
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
ALTER TABLE "pembicara_event" ADD CONSTRAINT "pembicara_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peserta" ADD CONSTRAINT "peserta_transaksi_id_transaksi_id_fk" FOREIGN KEY ("transaksi_id") REFERENCES "public"."transaksi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profil_penyelenggara" ADD CONSTRAINT "profil_penyelenggara_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_event" ADD CONSTRAINT "user_event_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_event" ADD CONSTRAINT "user_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;