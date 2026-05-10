import { db } from './index';
import { favorit, pendaftaran } from './schema';

async function seedRelasi() {
  try {
    await db.insert(favorit).values([
      { userId: 1, eventId: 1 },
      { userId: 1, eventId: 2 }
    ]);

    await db.insert(pendaftaran).values([
      { userId: 1, eventId: 1, statusKehadiran: 'Terdaftar' }
    ]);

    console.log('Data relasi favorit dan pendaftaran berhasil dimasukkan');
  } catch (error) {
    console.error('Gagal mengisi data relasi database');
  }
}

seedRelasi();