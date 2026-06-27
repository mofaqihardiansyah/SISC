'use server';

import { db } from "@/db";
import { event, rawScrapedData, logScraping, scrapingSources } from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";
import { slugify } from "@/lib/utils";
import { auth } from "@/auth";
import { SITE, SCRAPER, UI_TEXT } from "@/lib/constants";
import { cleanRawData } from "@/lib/scraper/cleaner";
import { parseIndoDate, sanitizeHtml, isSafeUrl } from "@/lib/scraper/utils";
import { scrapeDetailPage } from "@/app/api/cron/scrape/route";
import * as cheerio from "cheerio";
import { chromium } from "playwright";
import type { Browser } from "playwright";

export interface ScrapedDataField {
  judul?: string; urlBanner?: string; detailLokasi?: string;
  tanggalMentah?: string; tanggalMulai?: string | null; tanggalSelesai?: string | null;
  jenisEvent?: 'seminar' | 'conference'; tipePlatform?: 'online' | 'offline' | 'hybrid' | null;
  kategoriId?: number | null; kotaId?: number | null;
  deskripsi?: string; tipeHarga?: 'free' | 'paid' | null; harga?: number; kuota?: number | null;
  linkRegistrasi?: string | null; linkEksternal?: string;
  websiteSumber?: string;
  [key: string]: unknown;
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
    return { success: false, error: "Tanggal mulai tidak valid. Harap edit tanggal secara manual." };
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

  const linkEksternal = editedData.linkEksternal || editedData.linkRegistrasi || "";
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

  const linkEksternal = data.linkEksternal || data.linkRegistrasi;

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

export async function bulkPublishRawEventsWithEdits(
  items: { id: number; editedData?: {
    judul?: string; tanggalMulai?: string | null; tanggalSelesai?: string | null;
    detailLokasi?: string; tipePlatform?: 'online' | 'offline' | 'hybrid' | null;
    kategoriId?: number | null; kotaId?: number | null; jenisEvent?: 'seminar' | 'conference';
    deskripsi?: string; tipeHarga?: 'free' | 'paid' | null; harga?: number;
    kuota?: number | null; linkRegistrasi?: string | null;
  }}[]
) {
  await checkAdminAuth();
  const results: { id: number; success: boolean; error?: string }[] = [];
  for (const item of items) {
    const r = await publishRawEvent(item.id, item.editedData);
    results.push({ id: item.id, success: r.success, error: r.error });
  }
  const succeeded = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  return {
    success: failed.length === 0,
    count: succeeded.length,
    failed: failed.map(f => ({ id: f.id, error: f.error })),
  };
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

export async function scrapeSourceAction(sourceId: number) {
  await checkAdminAuth();

  const [source] = await db.select().from(scrapingSources).where(eq(scrapingSources.id, sourceId));
  if (!source || !source.isActive) return { success: false, error: "Sumber tidak ditemukan atau tidak aktif" };

  const hostname = new URL(source.baseUrl).hostname;
  const maxResults = source.maxResultsPerRun ?? 100;
  const maxPages = 3;
  const startTime = new Date();

  // ponytail: Per-site extractor configs mirror engine.ts SOURCE_CONFIGS.
  // Add a new entry here when onboarding a new source site.
  type CardExtractor = ($: cheerio.CheerioAPI, el: cheerio.Cheerio<any>, sourceUrl: string) => ScrapedDataField | null;

  const siteExtractors: Record<string, { cardSelector: string; extract: CardExtractor }> = {
    'eventkampus.com': {
      cardSelector: '.col-md-4, .card',
      extract: ($, el, sourceUrl) => {
        const title = sanitizeHtml($(el).find('.card-title, h3, h4').first().text().trim());
        const linkEl = $(el).find('a').first();
        let link = linkEl.attr('href') || '';
        if (!link || !title) return null;
        if (link.startsWith('/')) link = new URL(sourceUrl).origin + link;
        let date = '';
        let location = '';
        $(el).find('i.material-icons').each((_, icon) => {
          const text = $(icon).text().trim();
          const parentText = $(icon).parent().text().replace(text, '').trim();
          if (text === 'date_range') date = sanitizeHtml(parentText);
          if (text === 'place') location = sanitizeHtml(parentText);
        });
        return {
          judul: title.slice(0, 100),
          linkEksternal: link,
          websiteSumber: sourceUrl,
          urlBanner: $(el).find('img').first().attr('src') || '',
          tanggalMentah: date,
          detailLokasi: location,
        };
      },
    },
    'infoseminar.id': {
      cardSelector: '.seminar-card',
      extract: ($, el, sourceUrl) => {
        const title = sanitizeHtml($(el).find('h3').first().text().trim());
        const linkEl = $(el).find('a').first();
        let link = linkEl.attr('href') || '';
        if (!link || !title) return null;
        if (link.startsWith('/')) link = new URL(sourceUrl).origin + link;
        let date = '';
        let location = '';
        $(el).find('.meta-row').each((_, row) => {
          const text = $(row).text().trim();
          if (/\d{1,2}\s+[A-Za-z]+\s+\d{4}/.test(text)) date = text;
          else if (!/Gratis|Rp/i.test(text) && text.length > 3) location = text;
        });
        return {
          judul: title.slice(0, 100),
          linkEksternal: link,
          websiteSumber: sourceUrl,
          urlBanner: $(el).find('.seminar-img img, img').first().attr('src') || '',
          tanggalMentah: date,
          detailLokasi: location,
        };
      },
    },
  };

  const matchedKey = Object.keys(siteExtractors).find(k => hostname.includes(k));
  const extractor = matchedKey ? siteExtractors[matchedKey] : null;

  const scrapedOnListing: ScrapedDataField[] = [];
  const extractedLinks: string[] = [];

  // Phase 1: Crawl listing pages
  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    if (scrapedOnListing.length >= maxResults) break;
    const pageUrl = pageNum === 1
      ? `${source.baseUrl}${source.urlPattern || ''}`
      : `${source.baseUrl}${source.urlPattern || ''}?page=${pageNum}`;

    try {
      const res = await fetch(pageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1',
        },
      });
      if (!res.ok) break;

      const html = await res.text();
      const $ = cheerio.load(html);

      if (extractor) {
        $(extractor.cardSelector).each((_, el) => {
          if (scrapedOnListing.length >= maxResults) return false;
          const item = extractor.extract($, $(el), source.baseUrl);
          if (item) {
            scrapedOnListing.push(item);
            if (item.linkEksternal) extractedLinks.push(item.linkEksternal);
          }
        });
      } else {
        // ponytail: Best-effort fallback for unknown sites.
        // Ceiling: may miss events with non-obvious selectors. Upgrade by adding a siteExtractors entry.
        $('a[href*="event"], a[href*="seminar"], a[href*="conference"], .card, article, [class*="event"]').each((_, el) => {
          if (scrapedOnListing.length >= maxResults) return false;
          const $el = $(el);
          const href = $el.is('a') ? $el.attr('href') : $el.find('a').first().attr('href');
          if (!href) return;
          const title = $el.is('a') ? $el.text().trim() : $el.find('h2, h3, h4, .title').first().text().trim();
          if (!title || title.length < 3) return;
          let fullLink = href.startsWith('http') ? href : `${source.baseUrl.replace(/\/+$/, '')}/${href.replace(/^\//, '')}`;
          if (extractedLinks.includes(fullLink)) return;
          scrapedOnListing.push({
            judul: title.slice(0, 100),
            linkEksternal: fullLink,
            websiteSumber: source.baseUrl,
            urlBanner: $el.find('img').first().attr('src') || '',
            tanggalMentah: $el.find('.date, .tanggal, time').first().text().trim(),
            detailLokasi: $el.find('.location, .lokasi, .place').first().text().trim(),
          });
          extractedLinks.push(fullLink);
        });
      }

      await new Promise(r => setTimeout(r, source.rateLimitDelayMs ?? 1000));
    } catch {
      break;
    }
  }

  // Phase 2: Skip duplicate check — let saveScrapedResultsAction handle it

  // Phase 3: Deep-scrape each event's detail page for richer data
  const finalResults: ScrapedDataField[] = [];
  for (const item of scrapedOnListing.slice(0, maxResults)) {
    if (!item.linkEksternal) { finalResults.push(item); continue; }
    try {
      const detail = await scrapeDetailPage(item.linkEksternal);
      finalResults.push({ ...item, ...detail });
    } catch {
      finalResults.push(item);
    }
  }

  await db.update(scrapingSources).set({
    lastScrapedAt: new Date(),
    lastSuccessfulCount: finalResults.length,
  }).where(eq(scrapingSources.id, sourceId));

  await db.insert(logScraping).values({
    targetUrl: source.baseUrl,
    sumber: source.baseUrl,
    status: 'success',
    jumlahData: finalResults.length,
    mulaiPada: startTime,
    selesaiPada: new Date(),
  });

  return { success: true, data: finalResults, count: finalResults.length };
}

export async function saveScrapedResultsAction(results: ScrapedDataField[]) {
  await checkAdminAuth();
  const inserted: { id: number; judul: string }[] = [];

  for (const r of results) {
    const [row] = await db.insert(rawScrapedData).values({
      sumber: r.websiteSumber || 'manual',
      data: r as never,
      status: 'pending',
      urlTarget: r.linkEksternal || null,
    }).returning({ id: rawScrapedData.id });
    inserted.push({ id: row.id, judul: r.judul || '' });
  }

  return { success: true, count: inserted.length, items: inserted };
}

// ponytail: Singleton browser instance for Playwright fallback.
// Ceiling: browser stays alive process-wide. If it crashes, next call re-launches.
let _playwrightBrowser: Browser | null = null;
async function getPlaywrightBrowser(): Promise<Browser> {
  if (_playwrightBrowser?.isConnected()) return _playwrightBrowser;
  _playwrightBrowser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  return _playwrightBrowser;
}

async function fetchWithPlaywrightFallback(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      }
    });
    if (res.ok) return await res.text();
    // 4xx/5xx → fall back to Playwright below
  } catch {
    // network error → fall back to Playwright below
  }

  const browser = await getPlaywrightBrowser();
  const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36' });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    return await page.content();
  } finally {
    await context.close();
  }
}

export async function scrapeSingleUrl(url: string) {
  await checkAdminAuth();

  if (!url || !isSafeUrl(url)) {
    return { success: false, error: "URL tidak valid atau tidak aman. Hanya URL publik yang diizinkan." };
  }

  try {
    let responseText = '';
    let retries = 2;
    while (retries > 0) {
      try {
        responseText = await fetchWithPlaywrightFallback(url);
        break;
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
