import { db } from "./index";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🧹 Membersihkan seluruh database (Agresif)...");

  try {
    // Menggunakan TRUNCATE dengan CASCADE untuk menghapus semua data dan relasinya sekaligus
    // Kita list tabel-tabel utamanya saja, CASCADE akan mengurus sisanya
    const tables = [
      'event', 
      'kota', 
      'kategori', 
      'provinsi', 
      'users', 
      'profil_penyelenggara',
      'sosial_media_user',
      'otp_codes',
      'tag',
      'event_tag',
      'sosial_media_event',
      'lampiran_event',
      'bookmark',
      'user_event',
      'notifikasi',
      'log_admin',
      'transaksi',
      'peserta',
      'rekening_event',
      'komentar_event',
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
    console.error("❌ Gagal membersihkan database secara agresif:", error);
    process.exit(1);
  }
}

main();
