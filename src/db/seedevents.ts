import 'dotenv/config';
import { db } from './index'; // Sesuaikan path ke db config kamu
import { event } from '@/db/schema'; // Sesuaikan path ke schema kamu
import * as xlsx from 'xlsx';
import path from 'path';

// 1. Definisikan interface sesuai kolom excel
interface EventExcelRow {
  judul: string;
  slug: string;
  deskripsi?: string;
  syarat_dan_ketentuan?: string;
  banner_url?: string;
  tanggal_mulai: string | Date;
  tanggal_selesai?: string | Date;
  batas_registrasi?: string | Date;
  is_event_polines: boolean | string | number;
  tipe_platform?: string;
  tipe_harga?: string;
  detail_lokasi?: string;
  link_eksternal?: string;
  nama_kontak?: string;
  email_kontak?: string;
  telepon_kontak?: string;
  status: string;
  jenis_event: string;
  harga: number;
  kuota?: number;
  // Tambahkan kolom baru agar terbaca dari Excel
  organizer_id?: number;
  kategori_id?: number;
  kota_id?: number;
}

async function main() {
  console.log("🚀 Memulai proses seeding dari event.xlsx...");

  try {
    // 2. Baca file Excel
    const filePath = path.resolve(process.cwd(), 'event.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Parse ke JSON
    const rawData = xlsx.utils.sheet_to_json(worksheet) as EventExcelRow[];

    console.log(`📦 Terdeteksi ${rawData.length} baris data.`);

    // 3. Iterasi dan Insert Data
    for (const row of rawData) {
      // Helper untuk handle boolean/null dari excel
      const parseBoolean = (val: boolean | string | number | undefined | null) => {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string') return val.toLowerCase() === 'true';
        if (typeof val === 'number') return val === 1;
        return false;
      };

      const parseDate = (val: string | Date | number | undefined | null) => {
        return val ? new Date(val) : null;
      };

      const eventData = {
        judul: row.judul || "Tanpa Judul",
        slug: row.slug || `event-${Date.now()}-${Math.random()}`,
        deskripsi: row.deskripsi || null,
        syaratDanKetentuan: row.syarat_dan_ketentuan || null,
        bannerUrl: row.banner_url || null,
        tanggalMulai: parseDate(row.tanggal_mulai) || new Date(),
        tanggalSelesai: parseDate(row.tanggal_selesai),
        batasRegistrasi: parseDate(row.batas_registrasi),
        isEventPolines: parseBoolean(row.is_event_polines),
        tipePlatform: row.tipe_platform || null,
        tipeHarga: row.tipe_harga || null,
        detailLokasi: row.detail_lokasi || null,
        linkEksternal: row.link_eksternal || null,
        namaKontak: row.nama_kontak || null,
        emailKontak: row.email_kontak || null,
        teleponKontak: row.telepon_kontak || null,
        status: row.status || 'draft',
        jenisEvent: row.jenis_event || 'lainnya',
        harga: Number(row.harga) || 0,
        kuota: row.kuota ? Number(row.kuota) : null,
        organizerId: row.organizer_id || null,
        kategoriId: row.kategori_id || null,
        kotaId: row.kota_id || null,
      };

      await db.insert(event).values(eventData).onConflictDoUpdate({
        target: event.slug,
        set: { 
            ...eventData,
            diperbaruiPada: new Date()
        }
      });
    }

    console.log("✅ Seeding selesai dengan sukses!");
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat seeding:", error);
  } finally {
    process.exit(0);
  }
}

main();