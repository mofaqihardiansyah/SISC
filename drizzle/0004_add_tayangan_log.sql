CREATE TABLE "tayangan_log" (
	"event_id" integer,
	"tanggal" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tayangan_log" ADD CONSTRAINT "tayangan_log_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "tayangan_log_idx" ON "tayangan_log" USING btree ("event_id","tanggal");
