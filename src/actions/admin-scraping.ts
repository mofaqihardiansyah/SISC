'use server';

import { db } from "@/db";
import { event, rawScrapedData, logScraping } from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";
import { slugify } from "@/lib/utils";
import { auth } from "@/auth";
import { SITE, SCRAPER, UI_TEXT } from "@/lib/constants";
import { cleanRawData } from "@/lib/scraper/cleaner";
import { parseIndoDate, sanitizeHtml, isSafeUrl } from "@/lib/scraper/utils";
import * as cheerio from "cheerio";

interface ScrapedDataField {
  judul?: string; urlBanner?: string; detailLokasi?: string;
  tanggalMentah?: string; tanggalMulai?: string | null; tanggalSelesai?: string | null;
  jenisEvent?: 'seminar' | 'conference'; tipePlatform?: 'online' | 'offline' | 'hybrid' | null;
  kategoriId?: number | null; kotaId?: number | null;
  deskripsi?: string; tipeHarga?: 'free' | 'paid' | null; harga?: number; kuota?: number | null;
  linkRegistrasi?: string | null; linkEksternal?: string;
  websiteSumber?: string; autoApproved?: boolean;
}

const checkAdminAuth = async () => {
  const session = await auth();
  if (session?.user?.role !== 'admin' || !session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return parseInt(session.user.id);
};

export async function publishManualEvent(editedData: {
  judul?: string; urlBanner?: string; detailLokasi?: string;
  tanggalMulai?: string | null; tanggalSelesai?: string | null;
  jenisEvent?: string; tipePlatform?: string | null;
  kategoriId?: number | null; kotaId?: number | null;
  deskripsi?: string; tipeHarga?: string; harga?: number; kuota?: number | null;
  linkRegistrasi?: string; linkEksternal?: string;
  websiteSumber?: string;
}) {
  const adminId = await checkAdminAuth();

  const judul = editedData.judul || '';
  const urlBanner = editedData.urlBanner || '';
  const detailLokasi = editedData.detailLokasi || '';

  const tanggalMulai = editedData.tanggalMulai ? new Date(editedData.tanggalMulai) : null;
  if (!tanggalMulai) {
    return { success: false, error: "Tanggal mulai wajib diisi." };
  }
  const tanggalSelesai = editedData.tanggalSelesai ? new Date(editedData.tanggalSelesai) : null;

  const jenisEvent = (editedData.jenisEvent === 'conference' ? 'conference' : 'seminar') as 'seminar' | 'conference';
  const tipePlatform = (editedData.tipePlatform === 'online' || editedData.tipePlatform === 'offline' || editedData.tipePlatform === 'hybrid' ? editedData.tipePlatform : null);
  const kategoriId = editedData.kategoriId || null;
  const kotaId = editedData.kotaId || null;

  const deskripsi = editedData.deskripsi || "";
  const tipeHarga = (editedData.tipeHarga === 'paid' ? 'paid' : editedData.tipeHarga === 'free' ? 'free' : null) as 'free' | 'paid' | null;
  const harga = editedData.harga ?? 0;
  const kuota = editedData.kuota || null;

  const linkEksternal = editedData.linkRegistrasi || editedData.linkEksternal || "";
  const websiteSumber = editedData.websiteSumber || "";

  if (linkEksternal) {
    const [existingEvent] = await db.select().from(event).where(eq(event.linkEksternal, linkEksternal)).limit(1);
    if (existingEvent) {
      return { success: false, error: "Event dengan URL registrasi ini sudah diterbitkan sebelumnya." };
    }
  }

  await db.insert(event).values({
    organizerId: adminId,
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
    websiteSumber,
    jenisEvent,
    tipePlatform,
    kategoriId,
    kotaId,
    deskripsi,
    tipeHarga,
    harga,
    kuota,
  });

  return { success: true };
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
    tipeHarga?: 'free' | 'paid' | null;
    harga?: number;
    kuota?: number | null;
    linkRegistrasi?: string | null;
  }
) {
  const adminId = await checkAdminAuth();
  const [raw] = await db.select().from(rawScrapedData).where(eq(rawScrapedData.id, rawId));
  if (!raw || raw.statusIntegrasi) return { success: false, error: "Data tidak ditemukan atau sudah terintegrasi" };

  const data = raw.data as ScrapedDataField;

  const judul = (editedData?.judul !== undefined ? editedData.judul : data.judul) || '';
  const urlBanner = data.urlBanner;
  const detailLokasi = editedData?.detailLokasi !== undefined ? editedData.detailLokasi : data.detailLokasi;

  const tanggalMentah = data.tanggalMentah || '';
  const tanggalMulai = editedData?.tanggalMulai !== undefined
    ? (editedData.tanggalMulai ? new Date(editedData.tanggalMulai) : parseIndoDate(tanggalMentah))
    : (data.tanggalMulai ? new Date(data.tanggalMulai) : parseIndoDate(tanggalMentah));

  if (!tanggalMulai) {
    return { success: false, error: "Tanggal mulai tidak valid. Harap edit tanggal secara manual." };
  }

  const tanggalSelesai = editedData?.tanggalSelesai !== undefined
    ? (editedData.tanggalSelesai ? new Date(editedData.tanggalSelesai) : null)
    : (data.tanggalSelesai ? new Date(data.tanggalSelesai) : null);

  const jenisEvent = editedData?.jenisEvent !== undefined ? editedData.jenisEvent : (data.jenisEvent || 'seminar');
  const tipePlatform = editedData?.tipePlatform !== undefined ? editedData.tipePlatform : (data.tipePlatform || null);
  const kategoriId = editedData?.kategoriId !== undefined ? editedData.kategoriId : (data.kategoriId || null);
  const kotaId = editedData?.kotaId !== undefined ? editedData.kotaId : (data.kotaId || null);

  const deskripsi = editedData?.deskripsi !== undefined ? editedData.deskripsi : (data.deskripsi || "");
  const tipeHarga = editedData?.tipeHarga !== undefined ? editedData.tipeHarga : (data.tipeHarga ?? null);
  const harga = editedData?.harga !== undefined ? editedData.harga : (data.harga ?? 0);
  const kuota = editedData?.kuota !== undefined ? editedData.kuota : (data.kuota || null);

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
    organizerId: adminId,
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

  try {
    const res = await fetch(`${SITE.URL}/api/cron/scrape`, {
      method: 'GET',
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

export async function getScrapedItemsByIds(ids: number[]) {
  await checkAdminAuth();
  if (!ids.length) return { success: true, data: [] };
  const items = await db.select().from(rawScrapedData).where(inArray(rawScrapedData.id, ids));
  return { success: true, data: items };
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
      const data = raw.data as ScrapedDataField;
      if (data?.autoApproved === true) {
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

export async function scrapeSingleUrl(url: string) {
  await checkAdminAuth();

  if (!url || !isSafeUrl(url)) {
    return { success: false, error: "URL tidak valid atau tidak aman. Hanya URL publik yang diizinkan." };
  }

  try {
    let responseText = '';
    let retries = 3;
    while (retries > 0) {
      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        if (res.ok) {
          responseText = await res.text();
          break;
        }
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      } catch (err) {
        retries--;
        if (retries === 0) throw err;
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    const $ = cheerio.load(responseText);
    
    // Fallback extraction from Detail Page DOM
    const rawJudul = $('h1, .article-title, .title-event').first().text().trim() || $('title').text().replace('- EventKampus.com', '').trim();
    const judul = rawJudul.replace(/<[^>]*>/g, '').trim();
    
    let urlBanner = $('.article-image img, .event-banner img').attr('src') || $('meta[property="og:image"]').attr('content') || '';
    if (urlBanner && urlBanner.startsWith('/')) {
      urlBanner = SCRAPER.BASE_URL + urlBanner;
    }

    const articleContent = $('.article-content, .event-content, .description');
    
    let deskripsi = articleContent.html() || '';
    deskripsi = deskripsi
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .trim();

    const descText = articleContent.text() || $('body').text();

    // 1. Extract registration links
    let linkRegistrasi: string | null = null;
    $('a').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (/forms\.gle|docs\.google\.com\/forms|bit\.ly|zfrmz\.com|wa\.me|whatsapp\.com/i.test(href)) {
        linkRegistrasi = href;
        return false;
      }
    });

    if (!linkRegistrasi) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = descText.match(urlRegex);
      if (urls) {
        for (const u of urls) {
          if (/forms\.gle|docs\.google\.com\/forms|bit\.ly|zfrmz\.com|wa\.me|whatsapp\.com/i.test(u)) {
            linkRegistrasi = u;
            break;
          }
        }
      }
    }

    // 4. Ticket price (HTM) guessing
    let tipeHarga: 'free' | 'paid' | null = null;
    let harga = 0;
    const isPaid = /HTM|biaya|bayar|tiket|registrasi\s*:\s*Rp/i.test(descText) && !/FREE|gratis/i.test(descText);
    if (isPaid) {
      tipeHarga = 'paid';
      const priceRegex = /Rp\.?\s*(\d{1,3}(?:\.\d{3})+|\d+)/i;
      const priceMatch = descText.match(priceRegex);
      if (priceMatch) {
        harga = parseInt(priceMatch[1].replace(/\./g, ''), 10);
      }
    }

    // 5. Quota extraction
    let kuota: number | null = null;
    const quotaRegex = /(?:kuota|quota|kapasitas|limit)\s*(?:terbatas|hanya)?\s*:?\s*(\d+)/i;
    const quotaMatch = descText.match(quotaRegex);
    if (quotaMatch) {
      kuota = parseInt(quotaMatch[1], 10);
    }

    // Generate a basic "ScrapedData" structure so the frontend can reuse the validation modal
    const scrapedResult = {
      judul: judul || UI_TEXT.NO_TITLE,
      urlBanner: urlBanner,
      linkEksternal: url,
      websiteSumber: url,
      deskripsi: deskripsi || descText,
      tipeHarga,
      harga,
      kuota,
      linkRegistrasi,
      tanggalMentah: "",
      detailLokasi: "",
    };

    return { success: true, data: scrapedResult };
  } catch (error) {
    console.error("Error parsing URL:", error);
    return { success: false, error: error instanceof Error ? error.message : "Gagal mengekstrak data dari URL tersebut." };
  }
}
