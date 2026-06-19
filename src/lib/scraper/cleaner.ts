import { db } from "@/db";
import { rawScrapedData, kota, kategori } from "@/db/schema";
import { eq, ilike } from "drizzle-orm";

const MONTH_MAP: Record<string, number> = {
  'jan': 0, 'januari': 0,
  'feb': 1, 'februari': 1,
  'mar': 2, 'maret': 2,
  'apr': 3, 'april': 3,
  'mei': 4,
  'jun': 5, 'juni': 5,
  'jul': 6, 'juli': 6,
  'agu': 7, 'agustus': 7,
  'sep': 8, 'september': 8,
  'okt': 9, 'oktober': 9,
  'nov': 10, 'nopember': 10,
  'des': 11, 'desember': 11,
};

function parseIndoDate(str: string): Date | null {
  if (!str) return null;
  const cleaned = str.replace(/,/g, '').trim();

  // "12 Jan 2025" or "12 Januari 2025"
  const dmy = cleaned.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (dmy) {
    const month = MONTH_MAP[dmy[2].toLowerCase()];
    if (month !== undefined) return new Date(+dmy[3], month, +dmy[1]);
  }

  // ISO
  const iso = Date.parse(cleaned);
  if (!isNaN(iso)) return new Date(iso);

  return null;
}

function categorizeEvent(judul: string): 'seminar' | 'conference' {
  const kw: [RegExp, 'seminar' | 'conference'][] = [
    [/konferensi|conference|call\s*for\s*paper|cfp/i, 'conference'],
  ];
  for (const [re, cat] of kw) {
    if (re.test(judul)) return cat;
  }
  return 'seminar'; // ponytail: anything else → seminar
}

function guessPlatform(detailLokasi: string | null): string | null {
  if (!detailLokasi) return null;
  const lower = detailLokasi.toLowerCase();
  if (/online|zoom|meet|daring/i.test(lower)) return 'online';
  if (/offline|luring/i.test(lower)) return 'offline';
  return null;
}

export async function cleanRawData(rawId: number) {
  const [raw] = await db.select().from(rawScrapedData).where(eq(rawScrapedData.id, rawId));
  if (!raw) return { success: false, error: 'Data tidak ditemukan' };

  const d = raw.data as Record<string, any>;

  const judul = (d.judul || '').trim().replace(/\s+/g, ' ');
  const tanggalMulai = parseIndoDate(d.tanggalMentah);
  const tanggalSelesai = parseIndoDate(d.tanggalSelesai || d.tanggalMentah);
  const jenisEvent = (d.jenisEvent || categorizeEvent(judul) || 'seminar') as any;

  let kotaId: number | null = null;
  const lokasi = d.detailLokasi || '';
  if (lokasi) {
    const [matched] = await db.select({ id: kota.id }).from(kota)
      .where(ilike(kota.nama, `%${lokasi.split(',')[0].trim()}%`)).limit(1);
    if (matched) kotaId = matched.id;
  }

  let kategoriId: number | null = null;
  if (jenisEvent) {
    const catName = jenisEvent === 'conference' ? 'Conference' : 'Seminar';
    const [matched] = await db.select({ id: kategori.id }).from(kategori)
      .where(ilike(kategori.nama, catName)).limit(1);
    if (matched) kategoriId = matched.id;
  }

  const tipePlatform = d.tipePlatform || guessPlatform(lokasi) || null;

  const cleaned = {
    ...d,
    judul,
    tanggalMulai: tanggalMulai?.toISOString() || null,
    tanggalSelesai: tanggalSelesai?.toISOString() || null,
    jenisEvent,
    tipePlatform,
    detailLokasi: lokasi,
    kategoriId,
    kotaId,
    cleanedAt: new Date().toISOString(),
  };

  await db.update(rawScrapedData).set({
    data: cleaned as any,
    status: 'processed',
  }).where(eq(rawScrapedData.id, rawId));

  return { success: true, cleaned };
}
