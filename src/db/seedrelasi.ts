import { db } from './index';
import { favorit, pendaftaran } from './schema';

async function seedRelasi() {
  try {
    await db.insert(favorit).values([
      { userId: 1, eventId: 1 },
      { userId: 1, eventId: 2 }
    ]);
    console.log('Data favorit berhasil ditambahkan');

    await db.insert(pendaftaran).values([
      { 
        userId: 1, 
        eventId: 1, 
        status: 'terdaftar'
      }
    ]);
    console.log('Data pendaftaran berhasil ditambahkan');

  } catch (error) {
    console.error('Gagal menambahkan data relasi:', error);
  } finally {
    process.exit(0);
  }
}

seedRelasi();