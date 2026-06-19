'use server';

import { db } from "@/db";
import { event, rawScrapedData, logScraping } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { slugify } from "@/lib/utils";
import { cleanRawData } from "@/lib/scraper/cleaner";

const MONTH_MAP: Record<string, number> = {
  'jan': 0, 'januari': 0, 'feb': 1, 'februari': 1,
  'mar': 2, 'maret': 2, 'apr': 3, 'april': 3,
  'mei': 4, 'jun': 5, 'juni': 5, 'jul': 6, 'juli': 6,
  'agu': 7, 'agustus': 7, 'sep': 8, 'september': 8,
  'okt': 9, 'oktober': 9, 'nov': 10, 'nopember': 10,
  'des': 11, 'desember': 11,
};

function parseIndoDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const cleaned = dateStr.replace(/,/g, '').trim();
  const dmy = cleaned.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (dmy) {
    const month = MONTH_MAP[dmy[2].toLowerCase()];
    if (month !== undefined) return new Date(+dmy[3], month, +dmy[1]);
  }
  const iso = Date.parse(cleaned);
  return isNaN(iso) ? new Date() : new Date(iso);
}

export async function publishRawEvent(rawId: number) {
  const [raw] = await db.select().from(rawScrapedData).where(eq(rawScrapedData.id, rawId));
  if (!raw || raw.statusIntegrasi) return { success: false, error: "Data tidak ditemukan atau sudah terintegrasi" };

  const data = raw.data as any;

  await db.insert(event).values({
    judul: data.judul,
    slug: `${slugify(data.judul)}-${Math.floor(Math.random() * 1000)}`,
    linkEksternal: data.linkEksternal,
    urlBanner: data.urlBanner,
    detailLokasi: data.detailLokasi,
    tanggalMulai: parseIndoDate(data.tanggalMentah),
    eventPolines: false,
    hasilScraping: true,
    status: 'published',
    websiteSumber: data.websiteSumber,
    jenisEvent: data.jenisEvent || 'seminar',
    tipePlatform: data.tipePlatform || null,
    kategoriId: data.kategoriId || null,
    kotaId: data.kotaId || null,
  });

  await db.update(rawScrapedData).set({ statusIntegrasi: true }).where(eq(rawScrapedData.id, rawId));
  return { success: true };
}

export async function bulkPublishRawEvents(ids: number[]) {
  const results = [];
  for (const id of ids) {
    const r = await publishRawEvent(id);
    results.push(r);
  }
  return { success: results.every(r => r.success), count: results.filter(r => r.success).length };
}

export async function bulkDeleteRawEvents(ids: number[]) {
  if (!ids.length) return { success: false, error: "Tidak ada data dipilih" };
  await db.delete(rawScrapedData).where(inArray(rawScrapedData.id, ids));
  return { success: true, count: ids.length };
}

export async function cleanRawDataAction(rawId: number) {
  return cleanRawData(rawId);
}

export async function bulkCleanRawData(ids: number[]) {
  let count = 0;
  for (const id of ids) {
    const r = await cleanRawData(id);
    if (r.success) count++;
  }
  return { success: true, count };
}

export async function getLogScraping(limit = 50) {
  return db.select().from(logScraping).orderBy(logScraping.mulaiPada).limit(limit);
}
