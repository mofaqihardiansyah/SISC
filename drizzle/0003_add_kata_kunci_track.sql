CREATE TABLE "favorit" (
	"user_id" integer NOT NULL,
	"event_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "favorit_user_id_event_id_pk" PRIMARY KEY("user_id","event_id")
);
--> statement-breakpoint
CREATE TABLE "pemberitahuan" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" text,
	"isi" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transaksi" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"kode_transaksi" varchar(50),
	"status" varchar(50) DEFAULT 'pending',
	"total_harga" integer DEFAULT 0,
	"dibuat_pada" timestamp DEFAULT now(),
	"diperbarui_pada" timestamp,
	CONSTRAINT "transaksi_kode_transaksi_unique" UNIQUE("kode_transaksi")
);
--> statement-breakpoint
-- Convert existing comma-separated text to JSON array before altering type
UPDATE "paper_submission" 
SET "penulis" = to_jsonb(string_to_array("penulis", ', '::text))
WHERE "penulis" IS NOT NULL AND "penulis" != ''
  AND "penulis" !~ '^\['::text;
--> statement-breakpoint
ALTER TABLE "paper_submission" ALTER COLUMN "penulis" SET DATA TYPE jsonb USING "penulis"::jsonb;
--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "nama_bank" varchar(100);--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "nomor_rekening" varchar(50);--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "pemilik_rekening" varchar(255);--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "nama_bank_alternatif" varchar(100);--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "nomor_rekening_alternatif" varchar(50);--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "pemilik_rekening_alternatif" varchar(255);--> statement-breakpoint
ALTER TABLE "paper_submission" ADD COLUMN "kata_kunci" varchar(255);--> statement-breakpoint
ALTER TABLE "paper_submission" ADD COLUMN "track" varchar(255);--> statement-breakpoint
ALTER TABLE "pendaftaran" ADD COLUMN "bukti_pembayaran" text;--> statement-breakpoint
ALTER TABLE "peserta" ADD COLUMN "transaksi_id" integer;--> statement-breakpoint
ALTER TABLE "favorit" ADD CONSTRAINT "favorit_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorit" ADD CONSTRAINT "favorit_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peserta" ADD CONSTRAINT "peserta_transaksi_id_transaksi_id_fk" FOREIGN KEY ("transaksi_id") REFERENCES "public"."transaksi"("id") ON DELETE no action ON UPDATE no action;