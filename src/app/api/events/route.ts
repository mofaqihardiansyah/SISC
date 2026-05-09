import { NextResponse } from 'next/server';
import { db } from '@/db';
import { event, kategori, kota } from '@/db/schema';
import { eq, and, ilike, desc, isNull, sql } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Params Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const offset = (page - 1) * limit;

    // Params Filter
    const q = searchParams.get('q');
    const polines = searchParams.get('polines');
    const price = searchParams.get('price');
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const cat = searchParams.get('category');

    // 1. Bangun kondisi pencarian query
    const conditions = [
      isNull(event.dihapusPada),
      // Hanya tampilkan event yang valid (bukan pending/rejected)
      eq(event.status, 'published') 
    ];

    if (q) conditions.push(ilike(event.judul, `%${q}%`));
    if (polines === 'true') conditions.push(eq(event.isEventPolines, true));
    if (price === 'Gratis') conditions.push(eq(event.tipeHarga, 'free'));
    if (price === 'Berbayar') conditions.push(eq(event.tipeHarga, 'paid'));
    if (type) conditions.push(eq(event.tipePlatform, type as any));
    if (location) conditions.push(eq(kota.nama, location));
    if (cat) conditions.push(eq(kategori.nama, cat));

    // 2. Hitung Total Data (Untuk logika Tombol Page 1, 2, 3... di Client)
    const totalQuery = await db.select({ count: sql<number>`count(*)` })
      .from(event)
      .leftJoin(kota, eq(event.kotaId, kota.id))
      .leftJoin(kategori, eq(event.kategoriId, kategori.id))
      .where(and(...conditions));
      
    const total = Number(totalQuery[0].count);

    // 3. Ambil sebagian data event sesuai OFFSET & LIMIT
    const events = await db.select({
      id: event.id,
      judul: event.judul,
      bannerUrl: event.bannerUrl,
      harga: event.harga,
      tipeHarga: event.tipeHarga,
      tipePlatform: event.tipePlatform,
      isEventPolines: event.isEventPolines,
      tanggalMulai: event.tanggalMulai,
      tanggalSelesai: event.tanggalSelesai,
      status: event.status,
      kategoriNama: kategori.nama,
      kotaNama: kota.nama,
    })
    .from(event)
    .leftJoin(kategori, eq(event.kategoriId, kategori.id))
    .leftJoin(kota, eq(event.kotaId, kota.id))
    .where(and(...conditions))
    .orderBy(desc(event.dibuatPada))
    .limit(limit)
    .offset(offset);

    // Kembalikan Response berserta total event agar UI tahu sisa page
    return NextResponse.json({
      events,
      total
    });

  } catch (error) {
    console.error("API Event Error:", error);
    return NextResponse.json({ error: "Gagal memuat event" }, { status: 500 });
  }
}