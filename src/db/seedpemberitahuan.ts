import { db } from './index';
import { pemberitahuan } from './schema';

async function seedPemberitahuan() {
  try {
    await db.insert(pemberitahuan).values([
      { 
        tag: 'Penting', 
        isi: 'Jangan lupa kumpulkan KRS sebelum tanggal 15 Mei!' 
      },
      { 
        tag: 'Info', 
        isi: 'Seminar Cloud Computing akan diadakan di Ruang Serba Guna.' 
      }
    ]);
    console.log("Data mading berhasil masuk!");
  } catch (error) {
    console.error("Gagal seeding mading:", error);
  } finally {
    process.exit(0);
  }
}

seedPemberitahuan();