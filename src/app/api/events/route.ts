import { db } from '@/db';
import { event, kategori, kota } from '@/db/schema';
import { eq, isNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const events = await db
      .select({
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
      .where(eq(event.status, 'published'));

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}