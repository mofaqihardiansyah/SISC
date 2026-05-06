import 'dotenv/config';
import { db } from './index';
import { kota, provinsi } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import * as xlsx from 'xlsx';
import path from 'path';

interface KotaExcelRow {
  nama: string;
  provinsi?: string;
  provinsi_id?: number;
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
      let finalProvinsiId = row.provinsi_id;

      // Jika ada nama provinsi, pastikan ada di DB dan ambil ID-nya
      if (row.provinsi) {
        await db.insert(provinsi).values({
          nama: row.provinsi,
        }).onConflictDoUpdate({
          target: provinsi.nama,
          set: { nama: row.provinsi }
        });

        const prov = await db.query.provinsi.findFirst({
            where: eq(provinsi.nama, row.provinsi)
        });
        
        if (prov) finalProvinsiId = prov.id;
      }

      if (finalProvinsiId) {
        const existingKota = await db.query.kota.findFirst({
          where: and(eq(kota.nama, row.nama), eq(kota.provinsiId, finalProvinsiId))
        });

        if (!existingKota) {
          await db.insert(kota).values({
            nama: row.nama,
            provinsiId: finalProvinsiId,
          });
        } else {
          // Update if needed
          await db.update(kota).set({
            provinsiId: finalProvinsiId,
          }).where(eq(kota.id, existingKota.id));
        }
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