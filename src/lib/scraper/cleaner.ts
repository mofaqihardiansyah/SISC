import { db } from "@/db";
import { rawScrapedData, kota, kategori } from "@/db/schema";
import { eq, ilike } from "drizzle-orm";
import { parseIndoDate, sanitizeHtml, categorizeEvent, guessPlatform, extractCityFromLocation } from "./utils";

export async function cleanRawData(rawId: number) {
  const [raw] = await db.select().from(rawScrapedData).where(eq(rawScrapedData.id, rawId));
  if (!raw) return { success: false, error: 'Data tidak ditemukan' };

  const d = raw.data as Record<string, unknown>;
  const descText = String(d.deskripsi || '');

  // ponytail: Extract fields from description when primary field is empty.
  // Many sites pack structured data into a single description block.
  const fromDesc = (() => {
    const phoneRegex = /(?:\+62|62|0)8[1-9][0-9]{1,2}[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4}/g;
    const phoneMatch = descText.match(phoneRegex);
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const urls = descText.match(linkRegex) || [];

    return {
      teleponKontak: phoneMatch?.[0]?.replace(/[-.\s]/g, '') || null,
      linkRegistrasi: urls.find(u => /forms\.gle|docs\.google\.com\/forms|bit\.ly|zfrmz\.com|wa\.me|whatsapp\.com/i.test(u)) || null,
      tanggalMentah: parseIndoDate(descText) || null,
      tipeHarga: /HTM|biaya|bayar|tiket|registrasi\s*:\s*Rp/i.test(descText) && !/FREE|gratis/i.test(descText) ? 'paid' as const : null,
      harga: (() => {
        const m = descText.match(/Rp\.?\s*(\d{1,3}(?:\.\d{3})+|\d+)/i);
        return m ? parseInt(m[1].replace(/\./g, ''), 10) : 0;
      })(),
      kuota: (() => {
        const m = descText.match(/(?:kuota|quota|kapasitas|limit)\s*(?:terbatas|hanya)?\s*:?\s*(\d+)/i);
        return m ? parseInt(m[1], 10) : null;
      })(),
      namaKontak: (() => {
        if (!phoneMatch) return null;
        for (const line of descText.split('\n')) {
          if (phoneRegex.test(line)) {
            const cleaned = line.replace(phoneRegex, '').replace(/CP|Hubungi|Contact|Person|WA|:|[\/\-]/gi, '').trim();
            if (cleaned.length > 2 && cleaned.length < 35) return cleaned;
          }
        }
        return null;
      })(),
    };
  })();

  const judul = String(d.judul || '').trim().replace(/\s+/g, ' ');
  const tanggalMulai = parseIndoDate(String(d.tanggalMentah || '')) || fromDesc.tanggalMentah;
  const tanggalSelesai = parseIndoDate(String(d.tanggalSelesai || d.tanggalMentah || '')) || tanggalMulai;
  const jenisEvent = categorizeEvent(judul);

  let kotaId: number | null = null;
  const lokasi = String(d.detailLokasi || '') || extractCityFromLocation(descText) || '';
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

  const deskripsi = sanitizeHtml(descText);

  const tipeHarga = d.tipeHarga === 'paid' ? 'paid' as const
    : d.tipeHarga === 'free' ? 'free' as const
    : fromDesc.tipeHarga;
  const harga = typeof d.harga === 'number' && d.harga > 0 ? d.harga
    : fromDesc.tipeHarga === 'paid' ? fromDesc.harga
    : 0;
  const kuota = typeof d.kuota === 'number' && d.kuota > 0 ? d.kuota
    : fromDesc.kuota;
  const linkRegistrasi = String(d.linkRegistrasi || '') || fromDesc.linkRegistrasi;
  const namaKontak = String(d.namaKontak || '') || fromDesc.namaKontak;
  const teleponKontak = String(d.teleponKontak || '') || fromDesc.teleponKontak;

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
  };

  await db.update(rawScrapedData).set({
    data: cleaned as never,
    status: 'processed',
  }).where(eq(rawScrapedData.id, rawId));

  return { success: true, cleaned };
}
