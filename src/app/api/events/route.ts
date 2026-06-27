import { NextResponse } from 'next/server';
import { db } from '@/db';
import { event, kategori, kota, provinsi, users, profilPenyelenggara } from '@/db/schema';
import { eq, and, ilike, desc, isNull, sql, asc, gte, lte, or } from 'drizzle-orm';

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');

    // Mode khusus: return semua kota
    if (mode === 'kota') {
      const kotaList = await db.select({ id: kota.id, nama: kota.nama })
        .from(kota)
        .orderBy(asc(kota.nama));
      return NextResponse.json(kotaList);
    }

    // Mode khusus: return semua provinsi
    if (mode === 'provinsi') {
      const provinsiList = await db.select({ id: provinsi.id, nama: provinsi.nama })
        .from(provinsi)
        .orderBy(asc(provinsi.nama));
      return NextResponse.json(provinsiList);
    }

    // Mode khusus: return semua kategori
    if (mode === 'kategori') {
      const kategoriList = await db.select({ id: kategori.id, nama: kategori.nama })
        .from(kategori)
        .orderBy(asc(kategori.nama));
      return NextResponse.json(kategoriList);
    }

    // Params Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const offset = (page - 1) * limit;

    // Params Filter
    const q = searchParams.get('q');
    const polines = searchParams.get('polines');
    const price = searchParams.get('price');
    const location = searchParams.get('location');
    const provinsiFilter = searchParams.get('provinsi');
    const platform = searchParams.get('platform');
    const jenisEvent = searchParams.get('jenisEvent');
    const cat = searchParams.get('category');
    const time = searchParams.get('time');
    const sort = searchParams.get('sort') || 'newest';

    // 1. Bangun kondisi pencarian query
    const conditions = [
      isNull(event.dihapusPada),
      eq(event.status, 'published')
    ];

    if (q) conditions.push(or(ilike(event.judul, `%${q}%`), ilike(profilPenyelenggara.namaInstansi, `%${q}%`))!);
    if (polines === 'true') conditions.push(eq(event.eventPolines, true));
    if (price === 'Gratis') conditions.push(eq(event.tipeHarga, 'free'));
    if (price === 'Berbayar') conditions.push(eq(event.tipeHarga, 'paid'));
    if (platform) conditions.push(eq(event.tipePlatform, platform as 'online' | 'offline' | 'hybrid'));
    if (jenisEvent) conditions.push(eq(event.jenisEvent, jenisEvent as 'seminar' | 'conference'));
    if (location) conditions.push(eq(kota.nama, location));
    if (provinsiFilter) conditions.push(eq(provinsi.nama, provinsiFilter));
    if (cat) conditions.push(eq(kategori.nama, cat));

    // Filter Waktu
    if (time) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dayOfWeek = today.getDay();

      if (time === 'Hari Ini') {
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        conditions.push(gte(event.tanggalMulai, today));
        conditions.push(lte(event.tanggalMulai, endOfDay));

      } else if (time === 'Besok') {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const endOfTomorrow = new Date(tomorrow);
        endOfTomorrow.setHours(23, 59, 59, 999);
        conditions.push(gte(event.tanggalMulai, tomorrow));
        conditions.push(lte(event.tanggalMulai, endOfTomorrow));

      } else if (time === 'Akhir Pekan') {
        const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
        const saturday = new Date(today);
        saturday.setDate(today.getDate() + daysUntilSaturday);
        const sunday = new Date(saturday);
        sunday.setDate(saturday.getDate() + 1);
        sunday.setHours(23, 59, 59, 999);
        conditions.push(gte(event.tanggalMulai, saturday));
        conditions.push(lte(event.tanggalMulai, sunday));

      } else if (time === 'Minggu Ini') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        conditions.push(gte(event.tanggalMulai, startOfWeek));
        conditions.push(lte(event.tanggalMulai, endOfWeek));

      } else if (time === 'Minggu Depan') {
        const startOfNextWeek = new Date(today);
        startOfNextWeek.setDate(today.getDate() - dayOfWeek + 7);
        const endOfNextWeek = new Date(startOfNextWeek);
        endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
        endOfNextWeek.setHours(23, 59, 59, 999);
        conditions.push(gte(event.tanggalMulai, startOfNextWeek));
        conditions.push(lte(event.tanggalMulai, endOfNextWeek));

      } else if (time === 'Bulan Ini') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        conditions.push(gte(event.tanggalMulai, startOfMonth));
        conditions.push(lte(event.tanggalMulai, endOfMonth));

      } else if (time === 'Bulan Depan') {
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);
        conditions.push(gte(event.tanggalMulai, startOfNextMonth));
        conditions.push(lte(event.tanggalMulai, endOfNextMonth));
      }
    }

    // 2. Hitung Total Data
    const totalQuery = await db.select({ count: sql<number>`count(*)` })
      .from(event)
      .leftJoin(kota, eq(event.kotaId, kota.id))
      .leftJoin(provinsi, eq(kota.provinsiId, provinsi.id))
      .leftJoin(kategori, eq(event.kategoriId, kategori.id))
      .leftJoin(users, eq(event.organizerId, users.id))
      .leftJoin(profilPenyelenggara, eq(users.id, profilPenyelenggara.userId))
      .where(and(...conditions));

    const total = Number(totalQuery[0].count);

    // 3. Sorting
    const orderClause = sort === 'oldest' ? asc(event.dibuatPada)
      : sort === 'cheapest' ? asc(event.harga)
      : sort === 'expensive' ? desc(event.harga)
      : sort === 'nearest' ? asc(event.tanggalMulai)
      : sort === 'popular' ? desc(event.jumlahTayangan)
      : desc(event.dibuatPada); // default: newest

    // 4. Ambil sebagian data event sesuai OFFSET & LIMIT
    const events = await db.select({
      id: event.id,
      judul: event.judul,
      urlBanner: event.urlBanner,
      harga: event.harga,
      tipeHarga: event.tipeHarga,
      tipePlatform: event.tipePlatform,
      jenisEvent: event.jenisEvent,
      eventPolines: event.eventPolines,
      tanggalMulai: event.tanggalMulai,
      status: event.status,
      penyelenggara: sql<string>`COALESCE(${profilPenyelenggara.namaInstansi}, ${event.penyelenggara}, '-')`,
      kategoriNama: kategori.nama,
      kotaNama: kota.nama,
    })
    .from(event)
    .leftJoin(kategori, eq(event.kategoriId, kategori.id))
    .leftJoin(kota, eq(event.kotaId, kota.id))
    .leftJoin(provinsi, eq(kota.provinsiId, provinsi.id))
    .leftJoin(users, eq(event.organizerId, users.id))
    .leftJoin(profilPenyelenggara, eq(users.id, profilPenyelenggara.userId))
    .where(and(...conditions))
    .orderBy(orderClause)
    .limit(limit)
    .offset(offset);

    return NextResponse.json({ events, total });

  } catch (error) {
    console.error("API Event Error:", error);
    return NextResponse.json({ error: "Gagal memuat event" }, { status: 500 });
  }
}