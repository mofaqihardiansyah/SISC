import { db } from "@/db";
import { rawScrapedData, kota, kategori, scrapingAutoApprovalRules } from "@/db/schema";
import { eq, ilike, and } from "drizzle-orm";
import { parseIndoDate, sanitizeHtml, categorizeEvent, guessPlatform, extractCityFromLocation } from "./utils";

async function getAutoApprovalThreshold(): Promise<number> {
  const [rule] = await db.select({ threshold: scrapingAutoApprovalRules.thresholdValue })
    .from(scrapingAutoApprovalRules)
    .where(and(
      eq(scrapingAutoApprovalRules.conditionType, 'confidence_score'),
      eq(scrapingAutoApprovalRules.enabled, true),
    ))
    .limit(1);
  return rule?.threshold ?? 85;
}

export async function cleanRawData(rawId: number) {
  const [raw] = await db.select().from(rawScrapedData).where(eq(rawScrapedData.id, rawId));
  if (!raw) return { success: false, error: 'Data tidak ditemukan' };

  const d = raw.data as Record<string, unknown>;

  const judul = String(d.judul || '').trim().replace(/\s+/g, ' ');
  const tanggalMulai = parseIndoDate(String(d.tanggalMentah || ''));
  const tanggalSelesai = parseIndoDate(String(d.tanggalSelesai || d.tanggalMentah || ''));
  const jenisEvent = categorizeEvent(judul);

  let kotaId: number | null = null;
  const lokasi = String(d.detailLokasi || '');
  const cityGuess = extractCityFromLocation(lokasi);
  if (cityGuess) {
    const [matched] = await db.select({ id: kota.id }).from(kota)
      .where(ilike(kota.nama, `%${cityGuess}%`)).limit(1);
    if (matched) kotaId = matched.id;
  }

  let kategoriId: number | null = null;
  if (jenisEvent) {
    const catName = jenisEvent === 'conference' ? 'Conference' : 'Seminar';
    const [matched] = await db.select({ id: kategori.id }).from(kategori)
      .where(ilike(kategori.nama, catName)).limit(1);
    if (matched) kategoriId = matched.id;
  }

  const tipePlatform = guessPlatform(lokasi);

  const deskripsi = sanitizeHtml(String(d.deskripsi || ''));

  // ponytail: tipeHarga null = unknown, not 'free'. Only set 'free' if explicitly scraped as free.
  const tipeHarga = d.tipeHarga === 'paid' ? 'paid' as const
    : d.tipeHarga === 'free' ? 'free' as const
    : null;
  const harga = typeof d.harga === 'number' && d.harga > 0 ? d.harga : 0;
  const kuota = typeof d.kuota === 'number' && d.kuota > 0 ? d.kuota : null;
  const linkRegistrasi = String(d.linkRegistrasi || '') || null;
  const namaKontak = String(d.namaKontak || '') || null;
  const teleponKontak = String(d.teleponKontak || '') || null;

  const originalRaw = (d._raw ? d._raw : { ...d }) as Record<string, unknown>;

  const fieldConfidence = {
    judul: (judul && judul.length > 5) ? 10 : 0,
    tanggalMulai: tanggalMulai ? 10 : 0,
    tipePlatform: tipePlatform ? 15 : 0,
    kotaId: kotaId ? 15 : 0,
    kategoriId: kategoriId ? 10 : 0,
    deskripsi: (deskripsi && deskripsi.length > 20) ? 15 : 0,
    kontak: (linkRegistrasi || teleponKontak) ? 15 : 0,
    harga: (tipeHarga === 'free' || (tipeHarga === 'paid' && harga > 0)) ? 10 : 0,
  };

  const score = Object.values(fieldConfidence).reduce((a, b) => a + b, 0);

  const threshold = await getAutoApprovalThreshold();
  const autoApproved = score >= threshold;

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
    deskripsi,
    tipeHarga,
    harga,
    kuota,
    linkRegistrasi,
    namaKontak,
    teleponKontak,
    _raw: originalRaw,
    fieldConfidence,
    cleanedAt: new Date().toISOString(),
    confidenceScore: score,
    autoApproved,
  };

  await db.update(rawScrapedData).set({
    data: cleaned as never,
    status: 'processed',
  }).where(eq(rawScrapedData.id, rawId));

  return { success: true, cleaned };
}
