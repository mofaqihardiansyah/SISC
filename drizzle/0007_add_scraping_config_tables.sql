CREATE TYPE "public"."scraper_type" AS ENUM('cheerio', 'crawlee_playwright');

CREATE TABLE IF NOT EXISTS "scraping_sources" (
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

CREATE TABLE IF NOT EXISTS "scraping_validation_rules" (
  "id" serial PRIMARY KEY NOT NULL,
  "field_name" varchar(100) NOT NULL,
  "is_required" boolean DEFAULT true,
  "min_length" integer,
  "max_length" integer,
  "regex_pattern" varchar(500),
  "confidence_threshold" integer DEFAULT 75,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "scraping_auto_approval_rules" (
  "id" serial PRIMARY KEY NOT NULL,
  "rule_name" varchar(255) NOT NULL,
  "condition_type" varchar(50) NOT NULL,
  "threshold_value" integer DEFAULT 85,
  "auto_publish" boolean DEFAULT true,
  "enabled" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now()
);
