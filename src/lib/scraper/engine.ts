import { PlaywrightCrawler } from "@crawlee/playwright";
import { db } from "@/db";
import { rawScrapedData, logScraping } from "@/db/schema";
import { SCRAPER } from "@/lib/constants";
import { z } from "zod";

// Schema validasi untuk memastikan data scraping bersih
const ScrapedEventSchema = z.object({
  judul: z.string().min(3),
  linkEksternal: z.string().url(),
  urlBanner: z.string().optional(),
  detailLokasi: z.string().optional(),
  tanggalMentah: z.string(),
  websiteSumber: z.string().url(),
});

export const seminarCrawler = new PlaywrightCrawler({
  maxConcurrency: SCRAPER.MAX_CONCURRENCY,
  browserPoolOptions: { useFingerprints: true },
  requestHandlerTimeoutSecs: SCRAPER.TIMEOUT_SECONDS,
  
  async requestHandler({ page, request, log }) {
    log.info(`🕵️ Memproses: ${request.url}`);
    
    const startTime = new Date();
    let scrapedCount = 0;

    try {
      await page.waitForSelector('.col-md-4, .card', { timeout: SCRAPER.WAIT_TIMEOUT_MS });

      const results = await page.evaluate((targetUrl) => {
        const cards = document.querySelectorAll('.col-md-4, .card');
        const data: any[] = [];

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
            if (link.startsWith('/')) link = SCRAPER.BASE_URL + link;

            data.push({
              judul: titleEl.textContent?.trim() || "Tanpa Judul",
              linkEksternal: link,
              urlBanner: imageEl?.getAttribute('src') || "",
              detailLokasi: location,
              tanggalMentah: date,
              websiteSumber: targetUrl
            });
          }
        });
        return data;
      }, request.url);

      const validData = [];
      for (const item of results) {
        const parsed = ScrapedEventSchema.safeParse(item);
        if (parsed.success) {
          validData.push(parsed.data);
        } else {
          log.warning(`⚠️ Data tidak valid dilewati: ${item.judul}`, parsed.error);
        }
      }

      scrapedCount = validData.length;

      if (validData.length > 0) {
        await db.insert(rawScrapedData).values(validData.map(r => ({
          sumber: r.websiteSumber,
          urlTarget: r.linkEksternal,
          data: r as any,
          statusIntegrasi: false
        })));
      }

      await db.insert(logScraping).values({
        targetUrl: request.url,
        sumber: request.url,
        status: 'success',
        jumlahData: scrapedCount,
        mulaiPada: startTime,
        selesaiPada: new Date()
      });
    } catch (error) {
      await db.insert(logScraping).values({
        targetUrl: request.url,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        mulaiPada: startTime
      });
      throw error;
    }
  },

  failedRequestHandler({ request, log }) {
    log.error(`❌ Request ${request.url} gagal.`);
  },
});
