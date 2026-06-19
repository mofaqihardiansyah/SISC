import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { db } from '@/db';
import { rawScrapedData, logScraping } from '@/db/schema';
import { SCRAPER } from '@/lib/constants';

const CRON_SECRET = process.env.CRON_SECRET || 'dev-secret';

export async function GET(request: Request) {
  const startTime = new Date();
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    console.log("🚀 Memulai proses Scraping Event...");
    const targetUrl = SCRAPER.DEFAULT_URL; 
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Gagal fetch website. Status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const scrapedData: any[] = [];
    const extractedLinks: string[] = [];

    $('.card').each((index, element) => {
      const judul = $(element).find('.card-title, h3, h4').first().text().trim();
      let linkSumber = $(element).find('a').first().attr('href') || '';
      const banner = $(element).find('img').attr('src') || '';
      
      if (linkSumber && linkSumber.startsWith('/')) {
        linkSumber = SCRAPER.BASE_URL + linkSumber;
      }

      if (judul && linkSumber && linkSumber.includes('event')) {
        extractedLinks.push(linkSumber);
        scrapedData.push({
          judul: judul.substring(0, 100),
          urlBanner: banner,
          linkEksternal: linkSumber,
          tanggalMentah: new Date().toISOString(),
          websiteSumber: targetUrl,
        });
      }
    });

    if (scrapedData.length === 0) {
      await db.insert(logScraping).values({
        targetUrl,
        sumber: targetUrl,
        status: 'success',
        jumlahData: 0,
        mulaiPada: startTime,
        selesaiPada: new Date()
      });
      return NextResponse.json({ message: "Tidak ada data event ditemukan." });
    }

    const newDataToInsert = scrapedData.map(data => ({
      sumber: targetUrl,
      urlTarget: data.linkEksternal,
      data: data,
      statusIntegrasi: false
    }));

    if (newDataToInsert.length > 0) {
      await db.insert(rawScrapedData).values(newDataToInsert);
    }

    await db.insert(logScraping).values({
      targetUrl,
      sumber: targetUrl,
      status: 'success',
      jumlahData: newDataToInsert.length,
      mulaiPada: startTime,
      selesaiPada: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      message: `Scraping selesai. Menemukan ${scrapedData.length} event.`,
      inserted: newDataToInsert.length
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
