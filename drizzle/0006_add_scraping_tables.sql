CREATE TYPE "public"."log_scraping_status" AS ENUM('pending', 'processing', 'success', 'failed');

CREATE TABLE IF NOT EXISTS "raw_scraped_data" (
  "id" serial PRIMARY KEY NOT NULL,
  "sumber" varchar(255) NOT NULL,
  "url_target" varchar(512),
  "data" jsonb NOT NULL,
  "status_integrasi" boolean DEFAULT false,
  "status" varchar(20) DEFAULT 'pending',
  "dibuat_pada" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "log_scraping" (
  "id" serial PRIMARY KEY NOT NULL,
  "target_url" varchar(512),
  "sumber" varchar(255),
  "status" "log_scraping_status" DEFAULT 'pending',
  "jumlah_data" integer DEFAULT 0,
  "error_message" text,
  "mulai_pada" timestamp DEFAULT now(),
  "selesai_pada" timestamp
);
