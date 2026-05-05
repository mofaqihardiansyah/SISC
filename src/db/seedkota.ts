import 'dotenv/config';
import { db } from './index';
import { kota, provinsi } from '@/db/schema';
import * as xlsx from 'xlsx';
import path from 'path';

interface KotaExcelRow {
  nama: string;
  provinsi: string;
}

async function main() {
  console.log("🚀 Seeding kota dari kota.xlsx...");

  try {
    const filePath = path.resolve(process.cwd(), 'kota.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rawData = xlsx.utils.sheet_to_json<KotaExcelRow>(worksheet);
    console.log(`📦 ${rawData.length} data ditemukan`);

    for (const row of rawData) {
      // Insert provinsi kalau belum ada
      await db.insert(provinsi).values({
        nama: row.provinsi,
      }).onConflictDoNothing();

      // Ambil id provinsi
      const prov = await db.select().from(provinsi)
        .then(res => res.find(p => p.nama === row.provinsi));

      if (prov) {
        await db.insert(kota).values({
          nama: row.nama,
          provinsiId: prov.id,
        }).onConflictDoNothing();
      }
    }

    console.log("✅ Seeding kota selesai!");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    process.exit(0);
  }
}

main();