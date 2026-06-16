import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { db } from '@/db';
import { event } from '@/db/schema';
import { inArray } from 'drizzle-orm';
import { SCRAPER } from '@/lib/constants';

// Mengamankan API route ini agar tidak bisa ditembak sembarangan oleh user
// Vercel Cron akan mengirimkan header rahasia
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  try {
    // PROTEKSI: Aktifkan baris di bawah saat deploy ke production
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    console.log("🚀 Memulai proses Scraping Event...");

    // 1. Tentukan Website Target (Contoh: EventKampus)
    const targetUrl = SCRAPER.DEFAULT_URL; 
    
    // Melakukan fetch ke website asli
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Gagal fetch website. Status: ${response.status}`);
    }

    const html = await response.text();

    // 2. Masukkan HTML mentah ke dalam Cheerio
    const $ = cheerio.load(html);
    
    // Perbaikan TypeScript: Definisi tipe data secara eksplisit
    type ScrapedEvent = typeof event.$inferInsert;
    const scrapedData: ScrapedEvent[] = [];
    const extractedLinks: string[] = [];

    // 3. Ekstraksi Data dari EventKampus
    // EventKampus biasanya menggunakan div dengan class yang mengandung col-md-3 atau .card
    $('.card').each((index, element) => {
      // Menarik data dari dalam struktur Card
      const judul = $(element).find('.card-title, h3, h4').first().text().trim();
      let linkSumber = $(element).find('a').first().attr('href') || '';
      const banner = $(element).find('img').attr('src') || '';
      
      // Rapikan link jika bentuknya relatif (/event/123)
      if (linkSumber && linkSumber.startsWith('/')) {
        linkSumber = SCRAPER.BASE_URL + linkSumber;
      }

      if (judul && linkSumber && linkSumber.includes('event')) {
        extractedLinks.push(linkSumber);
        scrapedData.push({
          judul: judul.substring(0, 100), // Memastikan judul tidak terlalu panjang
          urlBanner: banner,
          linkEksternal: linkSumber,
          eventPolines: false, 
          hasilScraping: true,   
          status: 'published',   
          websiteSumber: targetUrl,
          tanggalMulai: new Date(), // Untuk target riil, kita set ke tanggal scraping sebagai default
          jenisEvent: 'seminar', 
        });
      }
    });

    if (scrapedData.length === 0) {
      return NextResponse.json({ message: "Tidak ada data event ditemukan." });
    }

    // 4. Mencegah Duplikasi (Penyaringan)
    // Kita cari di database apakah link_eksternal tersebut sudah pernah di-save
    const existingEvents = await db.select({ linkEksternal: event.linkEksternal })
      .from(event)
      .where(inArray(event.linkEksternal, extractedLinks));
    
    // Ekstrak hanya URL-nya ke dalam array untuk mempermudah pengecekan
    const existingLinksArray = existingEvents.map(e => e.linkEksternal || '');

    // Filter array scrapedData: Hanya simpan yang link-nya BELUM ADA di database
    const newDataToInsert = scrapedData.filter(
      (data) => !existingLinksArray.includes(data.linkEksternal || '')
    );

    // 5. Simpan ke Database
    if (newDataToInsert.length > 0) {
      await db.insert(event).values(newDataToInsert);
      if (process.env.NODE_ENV !== 'production') console.log(`✅ Berhasil menyimpan ${newDataToInsert.length} event baru!`);
    } else {
      console.log(`⚠️ Semua ${scrapedData.length} event yang di-scrape sudah ada di database (Skip).`);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Scraping selesai. Menemukan ${scrapedData.length} event, menyimpan ${newDataToInsert.length} event baru.`,
      inserted: newDataToInsert.length
    });

  } catch (error: unknown) {
    console.error("❌ Scraping Error:", error);
    
    // Mengeluarkan pesan error asli ke layar agar mudah di-debug
    return NextResponse.json({ 
      success: false, 
      error: "Gagal menjalankan scraper",
      detail: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
