import { PlaywrightCrawler } from "@crawlee/playwright";
import { db } from "@/db";
import { event } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { inArray } from "drizzle-orm";

interface ScrapedEvent {
  judul: string;
  linkEksternal: string;
  bannerUrl: string;
  detailLokasi: string;
  tanggalMentah: string;
  websiteSumber: string;
}

export const seminarCrawler = new PlaywrightCrawler({
  maxConcurrency: 2, // Menjaga penggunaan RAM tetap aman (cocok untuk RAM 8GB)
  browserPoolOptions: {
    useFingerprints: true, // Membantu menghindari deteksi bot
  },
  // Waktu tunggu maksimal untuk tiap request
  requestHandlerTimeoutSecs: 60,
  
  async requestHandler({ page, request, log }) {
    log.info(`🕵️ Memproses: ${request.url}`);

    // Menunggu kartu event muncul
    await page.waitForSelector('.col-md-4, .card', { timeout: 15000 });

    const results = await page.evaluate((targetUrl) => {
      const cards = document.querySelectorAll('.col-md-4, .card');
      const data: ScrapedEvent[] = [];

      cards.forEach((card) => {
        const titleEl = card.querySelector('h3, h4, .card-title');
        const linkEl = card.querySelector('a');
        const imageEl = card.querySelector('img');
        
        // Ekstraksi Metadata menggunakan Icon sebagai penanda
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
          if (link.startsWith('/')) link = 'https://eventkampus.com' + link;

          data.push({
            judul: titleEl.textContent?.trim() || "Tanpa Judul",
            linkEksternal: link,
            bannerUrl: imageEl?.getAttribute('src') || "",
            detailLokasi: location,
            tanggalMentah: date, // Akan diolah di luar evaluate
            websiteSumber: targetUrl
          });
        }
      });

      return data;
    }, request.url);

    log.info(`✅ Menemukan ${results.length} event dari ${request.url}`);

    const parseIndoDate = (dateStr: string) => {
      const months: { [key: string]: number } = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
        'Jul': 6, 'Agu': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11
      };
      
      const parts = dateStr.split(' ');
      if (parts.length >= 3) {
        const day = parseInt(parts[0]);
        const month = months[parts[1].substring(0, 3)];
        const year = parseInt(parts[2]);
        if (!isNaN(day) && month !== undefined && !isNaN(year)) {
          return new Date(year, month, day);
        }
      }
      return new Date();
    };

    if (results.length > 0) {
      const extractedLinks = results.map(r => r.linkEksternal);
      
      // Cek duplikasi di DB
      const existingEvents = await db.select({ linkEksternal: event.linkEksternal })
        .from(event)
        .where(inArray(event.linkEksternal, extractedLinks));
      
      const existingLinks = new Set(existingEvents.map(e => e.linkEksternal));

      const newData = results
        .filter(r => !existingLinks.has(r.linkEksternal))
        .map(r => ({
          judul: r.judul,
          slug: `${slugify(r.judul)}-${Math.floor(Math.random() * 1000)}`,
          linkEksternal: r.linkEksternal,
          bannerUrl: r.bannerUrl,
          detailLokasi: r.detailLokasi,
          isEventPolines: false,
          hasilScraping: true,
          status: 'published',
          websiteSumber: r.websiteSumber,
          tanggalMulai: parseIndoDate(r.tanggalMentah),
          jenisEvent: 'seminar',
        }));

      if (newData.length > 0) {
        await db.insert(event).values(newData);
        log.info(`📦 Berhasil menyimpan ${newData.length} event baru ke database.`);
      } else {
        log.info(`ℹ️ Semua event dari halaman ini sudah ada di database.`);
      }
    }
  },

  failedRequestHandler({ request, log }) {
    log.error(`❌ Request ${request.url} gagal setelah beberapa kali percobaan.`);
  },
});
