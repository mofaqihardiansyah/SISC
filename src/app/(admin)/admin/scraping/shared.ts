import { db } from "@/db";
import { rawScrapedData, logScraping, kota, kategori } from "@/db/schema";
import { desc } from "drizzle-orm";
import type { ScrapedData, LogScraping } from "./ScrapingClient";

export async function getScrapingPageData() {
  const [data, logs, cities, categories] = await Promise.all([
    db.select().from(rawScrapedData),
    db.select().from(logScraping).orderBy(desc(logScraping.mulaiPada)).limit(50),
    db.select().from(kota).orderBy(kota.nama),
    db.select().from(kategori).orderBy(kategori.nama),
  ]);

  return {
    initialData: data as unknown as ScrapedData[],
    initialLogs: logs as unknown as LogScraping[],
    cities,
    categories,
  };
}
