import 'dotenv/config';
import { db } from './index';
import { kategori } from '@/db/schema';
import * as xlsx from 'xlsx';
import path from 'path';

interface KategoriExcelRow {
  nama: string;
  slug?: string;
  icon_url?: string;
}

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

async function main() {
  console.log("🚀 Seeding kategori...");

  try {
    const filePath = path.resolve(process.cwd(), 'kategori.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rawData = xlsx.utils.sheet_to_json<KategoriExcelRow>(worksheet);

    console.log(`📦 ${rawData.length} data ditemukan`);

    for (const row of rawData) {
      const slug = row.slug || generateSlug(row.nama);

      await db.insert(kategori).values({
        nama: row.nama,
        slug: slug,
        iconUrl: row.icon_url || null, // SESUAI schema kamu
      }).onConflictDoUpdate({
        target: kategori.slug,
        set: {
          nama: row.nama,
          iconUrl: row.icon_url || null,
        },
      });
    }

    console.log("✅ Berhasil seed kategori!");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    process.exit(0);
  }
}

main();