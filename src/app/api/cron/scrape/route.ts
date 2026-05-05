import { NextResponse } from 'next/server';
import { seminarCrawler } from '@/lib/scraper/engine';

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

    // Parse URL query parameters to get optional custom URLs
    const { searchParams } = new URL(request.url);
    const urlsParam = searchParams.get('urls');
    let urls: string[] = ["https://eventkampus.com/event/kategori/seminar"]; // default
    
    if (urlsParam) {
      // Split by comma and trim each URL
      urls = urlsParam.split(',').map(url => url.trim()).filter(url => url.length > 0);
    }

    console.log(`🚀 Memulai proses Scraping Event via Crawlee Engine for ${urls.length} URL(s)...`);
    
    // Jalankan crawler dengan URL yang diberikan (atau default)
    await seminarCrawler.run(urls);
    
    return NextResponse.json({ 
      success: true, 
      message: `Scraping selesai menggunakan Crawlee engine untuk ${urls.length} URL(s) - data tanggal diekstrak dengan benar` 
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