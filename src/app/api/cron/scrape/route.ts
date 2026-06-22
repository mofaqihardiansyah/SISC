import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { db } from '@/db';
import { rawScrapedData, logScraping, event } from '@/db/schema';
import { SCRAPER } from '@/lib/constants';
import { cleanRawData } from '@/lib/scraper/cleaner';

const CRON_SECRET = process.env.CRON_SECRET || 'dev-secret';

function sanitizeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

export async function scrapeDetailPage(url: string) {
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
  const articleContent = $('.article-content');
  
  // Clean description HTML from harmful tags, script, iframe, styles
  let deskripsi = articleContent.html() || '';
  deskripsi = deskripsi
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .trim();

  const descText = articleContent.text();

  // 1. WhatsApp / Phone contact extraction
  let teleponKontak: string | null = null;
  const phoneRegex = /(?:\+62|62|0)8[1-9][0-9]{1,2}[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4}/g;
  const phones = descText.match(phoneRegex);
  if (phones && phones.length > 0) {
    teleponKontak = phones[0].replace(/[-.\s]/g, '');
  }

  // 2. Name Contact Person extraction (heuristic from lines containing phone)
  let namaKontak: string | null = null;
  const lines = descText.split('\n');
  for (const line of lines) {
    if (phoneRegex.test(line)) {
      const cleanedLine = line
        .replace(phoneRegex, '')
        .replace(/CP|Hubungi|Contact|Person|WA|:|[\/\-]/gi, '')
        .trim();
      if (cleanedLine.length > 2 && cleanedLine.length < 35) {
        namaKontak = cleanedLine;
        break;
      }
    }
  }

  // 3. Extract registration links (Google Forms, bit.ly, zfrmz, WhatsApp direct)
  let linkRegistrasi: string | null = null;
  articleContent.find('a').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (/forms\.gle|docs\.google\.com\/forms|bit\.ly|zfrmz\.com|wa\.me|whatsapp\.com/i.test(href)) {
      linkRegistrasi = href;
      return false; // break cheerio
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
  let tipeHarga: 'free' | 'paid' = 'free';
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

  return {
    deskripsi,
    tipeHarga,
    harga,
    kuota,
    linkRegistrasi,
    namaKontak,
    teleponKontak
  };
}

export async function GET(request: Request) {
  const startTime = new Date();
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    console.log("🚀 Memulai proses Scraping Event (Pagination & Deep Scraping)...");
    const targetUrl = SCRAPER.DEFAULT_URL; 
    const maxPages = 3; // Crawl up to 3 pages
    
    const scrapedData: { judul: string; urlBanner: string; linkEksternal: string; detailLokasi: string; tanggalMentah: string; websiteSumber: string }[] = [];
    const extractedLinks: string[] = [];

    // 1. Crawl listing pages
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const pageUrl = pageNum === 1 ? targetUrl : `${targetUrl}?page=${pageNum}`;
      console.log(`🌐 Fetching listing page ${pageNum}: ${pageUrl}`);
      
      let response: Response | undefined;
      let retries = 3;
      while (retries > 0) {
        try {
          response = await fetch(pageUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          if (response.ok) break;
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        } catch (err) {
          retries--;
          console.warn(`Scraper retry remaining: ${retries} for page ${pageNum}. Error: ${err instanceof Error ? err.message : String(err)}`);
          if (retries === 0) throw err;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      if (!response || !response.ok) {
        console.error(`Gagal fetch page ${pageNum}.`);
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      
      $('.card').each((index, element) => {
        const rawJudul = $(element).find('.card-title, h3, h4').first().text().trim();
        const judul = sanitizeHtml(rawJudul);
        let linkSumber = $(element).find('a').first().attr('href') || '';
        const banner = $(element).find('img').attr('src') || '';
        
        if (linkSumber && linkSumber.startsWith('/')) {
          linkSumber = SCRAPER.BASE_URL + linkSumber;
        }

        let date = "";
        let location = "";
        $(element).find('i.material-icons').each((_, icon) => {
          const text = $(icon).text().trim();
          const parentText = $(icon).parent().text().replace(text || "", "").trim();
          if (text === 'date_range') date = sanitizeHtml(parentText);
          if (text === 'place') location = sanitizeHtml(parentText);
        });

        if (judul && linkSumber && linkSumber.includes('event')) {
          extractedLinks.push(linkSumber);
          scrapedData.push({
            judul: judul.substring(0, 100),
            urlBanner: banner,
            linkEksternal: linkSumber,
            detailLokasi: location,
            tanggalMentah: date,
            websiteSumber: pageUrl,
          });
        }
      });
    }

    // 2. Duplicate Prevention
    const existingEvents = await db.select({ url: event.linkEksternal }).from(event);
    const existingRaw = await db.select({ url: rawScrapedData.urlTarget }).from(rawScrapedData);

    const existingUrls = new Set([
      ...existingEvents.map(e => e.url).filter(Boolean),
      ...existingRaw.map(r => r.url).filter(Boolean)
    ]);

    const uniqueScrapedData = scrapedData.filter(d => d.linkEksternal && !existingUrls.has(d.linkEksternal));

    if (uniqueScrapedData.length === 0) {
      await db.insert(logScraping).values({
        targetUrl,
        sumber: targetUrl,
        status: 'success',
        jumlahData: 0,
        mulaiPada: startTime,
        selesaiPada: new Date()
      });
      return NextResponse.json({ 
        success: true, 
        message: "Scraping selesai. Semua event yang ditemukan merupakan duplikat.", 
        inserted: 0 
      });
    }

    // 3. Slicing to limit detail page fetches (prevent Vercel timeout)
    const limitedData = uniqueScrapedData.slice(0, 15);
    const finalDataToInsert: { judul: string; urlBanner: string; linkEksternal: string; detailLokasi: string; tanggalMentah: string; websiteSumber: string; deskripsi: string; tipeHarga: string | number; harga: number; kuota: number | null; linkRegistrasi: string | null; namaKontak: string | null; teleponKontak: string | null }[] = [];

    for (const item of limitedData) {
      console.log(`🔎 Scraping detail page: ${item.linkEksternal}`);
      try {
        const detail = await scrapeDetailPage(item.linkEksternal);
        finalDataToInsert.push({
          ...item,
          deskripsi: detail.deskripsi,
          tipeHarga: detail.tipeHarga,
          harga: detail.harga,
          kuota: detail.kuota,
          linkRegistrasi: detail.linkRegistrasi,
          namaKontak: detail.namaKontak,
          teleponKontak: detail.teleponKontak,
        });
      } catch (err) {
        console.error(`Gagal scrape detail page ${item.linkEksternal}:`, err);
        // Fallback to card-level data
        finalDataToInsert.push({
          ...item,
          deskripsi: '',
          tipeHarga: 'free',
          harga: 0,
          kuota: null,
          linkRegistrasi: null,
          namaKontak: null,
          teleponKontak: null,
        });
      }
    }

    const newDataToInsert = finalDataToInsert.map(data => ({
      sumber: targetUrl,
      urlTarget: data.linkEksternal,
      data: data,
      statusIntegrasi: false
    }));

    let insertedRows: { id: number }[] = [];
    if (newDataToInsert.length > 0) {
      insertedRows = await db.insert(rawScrapedData)
        .values(newDataToInsert)
        .returning({ id: rawScrapedData.id });
      
      // Auto-clean
      for (const row of insertedRows) {
        try {
          await cleanRawData(row.id);
        } catch (cleanError) {
          console.error(`Gagal membersihkan raw data ID ${row.id}:`, cleanError);
        }
      }
    }

    await db.insert(logScraping).values({
      targetUrl,
      sumber: targetUrl,
      status: 'success',
      jumlahData: insertedRows.length,
      mulaiPada: startTime,
      selesaiPada: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      message: `Scraping selesai. Menemukan ${scrapedData.length} event secara total. Berhasil memproses ${insertedRows.length} event baru dengan deep scraping.`,
      inserted: insertedRows.length,
      ids: insertedRows.map(r => r.id)
    });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    await db.insert(logScraping).values({
      targetUrl: SCRAPER.DEFAULT_URL,
      status: 'failed',
      errorMessage: errorMsg,
      mulaiPada: startTime,
      selesaiPada: new Date()
    });

    return NextResponse.json({ 
      success: false, 
      error: "Gagal menjalankan scraper",
      detail: errorMsg
    }, { status: 500 });
  }
}
