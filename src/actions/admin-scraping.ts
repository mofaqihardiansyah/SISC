'use server';

import { db } from "@/db";
import { event, rawScrapedData, logScraping } from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";
import { slugify } from "@/lib/utils";
import { auth } from "@/auth";
import { SITE } from "@/lib/constants";
import { cleanRawData } from "@/lib/scraper/cleaner";

const checkAdminAuth = async () => {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    throw new Error("Unauthorized");
  }
};

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

export async function publishRawEvent(
  rawId: number,
  editedData?: {
    judul?: string;
    tanggalMulai?: string | null;
    tanggalSelesai?: string | null;
    detailLokasi?: string;
    tipePlatform?: 'online' | 'offline' | 'hybrid' | null;
    kategoriId?: number | null;
    kotaId?: number | null;
    jenisEvent?: 'seminar' | 'conference';
    deskripsi?: string;
    tipeHarga?: 'free' | 'paid';
    harga?: number;
    kuota?: number | null;
    linkRegistrasi?: string | null;
    namaKontak?: string | null;
    teleponKontak?: string | null;
    emailKontak?: string | null;
  }
) {
  await checkAdminAuth();
  const [raw] = await db.select().from(rawScrapedData).where(eq(rawScrapedData.id, rawId));
  if (!raw || raw.statusIntegrasi) return { success: false, error: "Data tidak ditemukan atau sudah terintegrasi" };

  const data = raw.data as any;

  const judul = editedData?.judul !== undefined ? editedData.judul : data.judul;
  const urlBanner = data.urlBanner;
  const detailLokasi = editedData?.detailLokasi !== undefined ? editedData.detailLokasi : data.detailLokasi;

  const tanggalMulai = editedData?.tanggalMulai !== undefined
    ? (editedData.tanggalMulai ? new Date(editedData.tanggalMulai) : parseIndoDate(data.tanggalMentah))
    : (data.tanggalMulai ? new Date(data.tanggalMulai) : parseIndoDate(data.tanggalMentah));

  const tanggalSelesai = editedData?.tanggalSelesai !== undefined
    ? (editedData.tanggalSelesai ? new Date(editedData.tanggalSelesai) : null)
    : (data.tanggalSelesai ? new Date(data.tanggalSelesai) : null);

  const jenisEvent = editedData?.jenisEvent !== undefined ? editedData.jenisEvent : (data.jenisEvent || 'seminar');
  const tipePlatform = editedData?.tipePlatform !== undefined ? editedData.tipePlatform : (data.tipePlatform || null);
  const kategoriId = editedData?.kategoriId !== undefined ? editedData.kategoriId : (data.kategoriId || null);
  const kotaId = editedData?.kotaId !== undefined ? editedData.kotaId : (data.kotaId || null);

  // New detailed fields
  const deskripsi = editedData?.deskripsi !== undefined ? editedData.deskripsi : (data.deskripsi || "");
  const tipeHarga = editedData?.tipeHarga !== undefined ? editedData.tipeHarga : (data.tipeHarga || 'free');
  const harga = editedData?.harga !== undefined ? editedData.harga : (data.harga || 0);
  const kuota = editedData?.kuota !== undefined ? editedData.kuota : (data.kuota || null);
  const namaKontak = editedData?.namaKontak !== undefined ? editedData.namaKontak : (data.namaKontak || null);
  const teleponKontak = editedData?.teleponKontak !== undefined ? editedData.teleponKontak : (data.teleponKontak || null);
  const emailKontak = editedData?.emailKontak !== undefined ? editedData.emailKontak : (data.emailKontak || null);

  // Prefer original/edited registration link over direct eventkampus link
  const linkEksternal = editedData?.linkRegistrasi !== undefined 
    ? editedData.linkRegistrasi 
    : (data.linkRegistrasi || data.linkEksternal);

  // Pengecekan duplikasi sebelum memasukkan data ke tabel event
  if (linkEksternal) {
    const [existingEvent] = await db.select().from(event).where(eq(event.linkEksternal, linkEksternal)).limit(1);
    if (existingEvent) {
      return { success: false, error: "Event dengan URL ini sudah diterbitkan sebelumnya." };
    }
  }

  await db.insert(event).values({
    judul,
    slug: `${slugify(judul)}-${Math.floor(Math.random() * 1000)}`,
    linkEksternal,
    urlBanner,
    detailLokasi,
    tanggalMulai,
    tanggalSelesai,
    eventPolines: false,
    hasilScraping: true,
    status: 'published',
    websiteSumber: data.websiteSumber,
    jenisEvent,
    tipePlatform,
    kategoriId,
    kotaId,
    deskripsi,
    tipeHarga,
    harga,
    kuota,
    namaKontak,
    teleponKontak,
    emailKontak,
  });

  await db.update(rawScrapedData).set({ statusIntegrasi: true }).where(eq(rawScrapedData.id, rawId));
  return { success: true };
}

export async function bulkPublishRawEvents(ids: number[]) {
  await checkAdminAuth();
  const results = [];
  for (const id of ids) {
    const r = await publishRawEvent(id);
    results.push(r);
  }
  return { success: results.every(r => r.success), count: results.filter(r => r.success).length };
}

export async function bulkDeleteRawEvents(ids: number[]) {
  await checkAdminAuth();
  if (!ids.length) return { success: false, error: "Tidak ada data dipilih" };
  await db.delete(rawScrapedData).where(inArray(rawScrapedData.id, ids));
  return { success: true, count: ids.length };
}

export async function cleanRawDataAction(rawId: number) {
  await checkAdminAuth();
  return cleanRawData(rawId);
}

export async function bulkCleanRawData(ids: number[]) {
  await checkAdminAuth();
  let count = 0;
  for (const id of ids) {
    const r = await cleanRawData(id);
    if (r.success) count++;
  }
  return { success: true, count };
}

export async function getLogScraping(limit = 50) {
  await checkAdminAuth();
  return db.select().from(logScraping).orderBy(logScraping.mulaiPada).limit(limit);
}

export async function triggerScrapeAction() {
  await checkAdminAuth();
  const CRON_SECRET = process.env.CRON_SECRET || 'dev-secret';

  try {
    const res = await fetch(`${SITE.URL}/api/cron/scrape`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}: ${res.statusText}` };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error triggering scrape:", error);
    return { success: false, error: error instanceof Error ? error.message : "Terjadi kesalahan internal" };
  }
}

export async function publishAllAutoApproved() {
  await checkAdminAuth();

  try {
    const rawEvents = await db.select()
      .from(rawScrapedData)
      .where(and(
        eq(rawScrapedData.status, 'processed'),
        eq(rawScrapedData.statusIntegrasi, false)
      ));

    let count = 0;
    for (const raw of rawEvents) {
      const data = raw.data as any;
      if (data && data.autoApproved === true) {
        const res = await publishRawEvent(raw.id);
        if (res.success) {
          count++;
        }
      }
    }
    return { success: true, count };
  } catch (error) {
    console.error("Error publishing auto-approved events:", error);
    return { success: false, error: error instanceof Error ? error.message : "Terjadi kesalahan internal" };
  }
}
