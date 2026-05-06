import { db } from "./index";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🧹 Membersihkan seluruh database (Struktur Baru)...");

  try {
    // Tabel-tabel aktif sesuai schema terbaru
    const tables = [
      'event', 
      'kota', 
      'kategori', 
      'provinsi', 
      'users', 
      'profil_penyelenggara',
      'otp_codes',
      'tag',
      'event_tag',
      'lampiran_event',
      'bookmark',
      'user_event',
      'log_admin',
      'transaksi',
      'peserta',
      'pembicara_event',
      'jadwal_event'
    ];

    for (const table of tables) {
      console.log(`🗑️ Truncating table: ${table}...`);
      await db.execute(sql.raw(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`));
    }

    console.log("✨ Database sekarang benar-benar kosong dan bersih!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Gagal membersihkan database:", error);
    process.exit(1);
  }
}

main();
