import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/db";
import { rawScrapedData, logScraping, kota, kategori, scrapingSources, scrapingValidationRules } from "@/db/schema";
import { desc, eq, isNull, or } from "drizzle-orm";
import type { ScrapedData, LogScraping } from "./ScrapingClient";

export interface ValidationRule {
  id: number;
  fieldName: string;
  isRequired: boolean | null;
  minLength: number | null;
  maxLength: number | null;
  regexPattern: string | null;
  confidenceThreshold: number | null;
}

export async function getScrapingPageData() {
  noStore();
  const [allData, logs, cities, categories, sources, validationRules] = await Promise.all([
    db.select().from(rawScrapedData)
      .where(or(eq(rawScrapedData.statusIntegrasi, false), isNull(rawScrapedData.statusIntegrasi)))
      .orderBy(desc(rawScrapedData.dibuatPada)),
    db.select().from(logScraping).orderBy(desc(logScraping.mulaiPada)).limit(50),
    db.select().from(kota).orderBy(kota.nama),
    db.select().from(kategori).orderBy(kategori.nama),
    db.select().from(scrapingSources).where(eq(scrapingSources.isActive, true)).orderBy(scrapingSources.name),
    db.select().from(scrapingValidationRules).orderBy(scrapingValidationRules.fieldName),
  ]);

  // ponytail: dedup by linkEksternal (keep first), filter out integrated
  const seen = new Set<string>();
  const data = allData.filter(d => {
    const link = (d.data as Record<string, unknown>)?.linkEksternal || (d.data as Record<string, unknown>)?.linkRegistrasi;
    if (link && typeof link === 'string') {
      if (seen.has(link)) return false;
      seen.add(link);
    }
    return true;
  });

  return {
    initialData: data as unknown as ScrapedData[],
    initialLogs: logs as unknown as LogScraping[],
    cities,
    categories,
    sources: sources.map(s => ({ id: s.id, name: s.name, baseUrl: s.baseUrl, scraperType: s.scraperType })),
    validationRules: validationRules as ValidationRule[],
  };
}
