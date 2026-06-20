import { PlaywrightCrawler } from "@crawlee/playwright";
import { db } from "@/db";
import { rawScrapedData, logScraping, event } from "@/db/schema";
import { SCRAPER } from "@/lib/constants";
import { z } from "zod";
import { cleanRawData } from "./cleaner";

const ScrapedEventSchema = z.object({
  judul: z.string().min(3),
  linkEksternal: z.string().url(),
  urlBanner: z.string().optional(),
  detailLokasi: z.string().optional(),
  tanggalMentah: z.string(),
  websiteSumber: z.string().url(),
});

function sanitizeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

// ponytail: evaluate fns run in browser — must be self-contained, no closure vars.
// targetUrl is passed as argument from the Node.js side.
const SOURCE_CONFIGS: Record<string, { waitFor: string; evaluate: (targetUrl: string) => Array<Record<string, string>> }> = {
  'eventkampus.com': {
    waitFor: '.col-md-4, .card',
    evaluate: (targetUrl: string) => {
      const cards = document.querySelectorAll('.col-md-4, .card');
      const data: Array<Record<string, string>> = [];
      cards.forEach((card) => {
        const titleEl = card.querySelector('h3, h4, .card-title');
        const linkEl = card.querySelector('a');
        const imageEl = card.querySelector('img');
        let date = "";
        let location = "";
        const icons = card.querySelectorAll('i.material-icons');
        icons.forEach(icon => {
          const text = icon.textContent?.trim();
          const parentText = icon.parentElement?.textContent?.replace(text || "", "").trim();
          if (text === 'date_range') date = parentText || "";
          if (text === 'place') location = parentText || "";
        });
        if (titleEl && linkEl) {
          let link = linkEl.getAttribute('href') || "";
          if (link.startsWith('/')) link = new URL(targetUrl).origin + link;
          data.push({
            judul: titleEl.textContent?.trim() || "Tanpa Judul",
            linkEksternal: link,
            urlBanner: imageEl?.getAttribute('src') || "",
            detailLokasi: location,
            tanggalMentah: date,
            websiteSumber: targetUrl,
          });
        }
      });
      return data;
    },
  },
  'infoseminar.id': {
    waitFor: '.seminar-card',
    evaluate: (targetUrl: string) => {
      const cards = document.querySelectorAll('.seminar-card');
      return Array.from(cards).map(card => {
        const titleEl = card.querySelector('h3');
        const linkEl = card.querySelector('a');
        const imageEl = card.querySelector('.seminar-img');
        const metaRows = card.querySelectorAll('.meta-row');
        let date = '';
        let location = '';
        metaRows.forEach(row => {
          const text = row.textContent?.trim() || '';
          if (/\d{1,2}\s+[A-Za-z]+\s+\d{4}/.test(text)) date = text;
          else if (!text.includes('Gratis') && !text.includes('Rp') && text.length > 3) location = text;
        });
        let link = linkEl?.getAttribute('href') || '';
        if (link.startsWith('/')) link = new URL(targetUrl).origin + link;
        return {
          judul: titleEl?.textContent?.trim() || "Tanpa Judul",
          linkEksternal: link || targetUrl,
          urlBanner: imageEl?.getAttribute('src') || '',
          detailLokasi: location,
          tanggalMentah: date,
          websiteSumber: targetUrl,
        };
      });
    },
  },
};

function getConfig(hostname: string) {
  for (const [key, config] of Object.entries(SOURCE_CONFIGS)) {
    if (hostname.includes(key)) return config;
  }
  return null;
}

export const seminarCrawler = new PlaywrightCrawler({
  maxConcurrency: SCRAPER.MAX_CONCURRENCY,
  browserPoolOptions: { useFingerprints: true },
  requestHandlerTimeoutSecs: SCRAPER.TIMEOUT_SECONDS,

  async requestHandler({ page, request, log }) {
    log.info(`Memproses: ${request.url}`);
    const startTime = new Date();
    let scrapedCount = 0;

    try {
      const hostname = new URL(request.url).hostname;
      const config = getConfig(hostname);
      if (!config) throw new Error(`No scraper config for: ${hostname}`);

      await page.waitForSelector(config.waitFor, { timeout: SCRAPER.WAIT_TIMEOUT_MS });
      const results = await page.evaluate(config.evaluate, request.url);

      const validData = [];
      for (const item of results) {
        item.judul = sanitizeHtml(item.judul);
        if (item.detailLokasi) item.detailLokasi = sanitizeHtml(item.detailLokasi);
        const parsed = ScrapedEventSchema.safeParse(item);
        if (parsed.success) {
          validData.push(parsed.data);
        } else {
          log.warning(`Data tidak valid: ${item.judul}`, parsed.error);
        }
      }

      const existingEvents = await db.select({ url: event.linkEksternal }).from(event);
      const existingRaw = await db.select({ url: rawScrapedData.urlTarget }).from(rawScrapedData);
      const existingUrls = new Set([
        ...existingEvents.map(e => e.url).filter(Boolean),
        ...existingRaw.map(r => r.url).filter(Boolean),
      ]);

      const uniqueValidData = validData.filter(d => d.linkEksternal && !existingUrls.has(d.linkEksternal));
      scrapedCount = uniqueValidData.length;

      if (uniqueValidData.length > 0) {
        const insertedRows = await db.insert(rawScrapedData)
          .values(uniqueValidData.map(r => ({
            sumber: r.websiteSumber,
            urlTarget: r.linkEksternal,
            data: r as any, // ponytail: jsonb column, legit any
            statusIntegrasi: false,
          })))
          .returning({ id: rawScrapedData.id });

        for (const row of insertedRows) {
          try {
            await cleanRawData(row.id);
          } catch (cleanError) {
            log.error(`Gagal membersihkan raw data ID ${row.id}: ${cleanError instanceof Error ? cleanError.message : String(cleanError)}`);
          }
        }
      }

      await db.insert(logScraping).values({
        targetUrl: request.url,
        sumber: request.url,
        status: 'success',
        jumlahData: scrapedCount,
        mulaiPada: startTime,
        selesaiPada: new Date(),
      });
    } catch (error) {
      await db.insert(logScraping).values({
        targetUrl: request.url,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        mulaiPada: startTime,
      });
      throw error;
    }
  },

  failedRequestHandler({ request, log }) {
    log.error(`Request ${request.url} gagal.`);
  },
});
