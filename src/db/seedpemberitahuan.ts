import { db } from './index';
import { pemberitahuan } from './schema';

async function runSeed() {
  await db.insert(pemberitahuan).values([
    { tag: 'Penting', isi: 'Jangan lupa kumpulkan KRS sebelum tanggal 15 Mei!' },
    { tag: 'Info', isi: 'Seminar Cloud Computing akan diadakan di Ruang Serba Guna.' }
  ]);
  console.log("Data mading berhasil masuk!");
}
runSeed();