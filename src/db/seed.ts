import 'dotenv/config';
import { seedReset } from './seedreset';
import { seedProvinsi } from './seedprovinsi';
import { seedKota } from './seedkota';
import { seedKategori } from './seedkategori';
import { seedUsers } from './seed-users';
import { seedEvents } from './seedevents';
import { seedDummy } from './seed-dummy';
import { seedProfileDemo } from './seed-profile-demo';

async function main() {
  const start = Date.now();
  console.log("🛠️  Unified Seeding Process Started...");
  console.log("--------------------------------------");

  try {
    // 1. Reset Database
    await seedReset();

    // 2. Master Data (No dependencies)
    await seedProvinsi();
    await seedKategori();

    // 3. Data with dependencies
    await seedKota(); // Needs Provinsi
    await seedUsers(); // Base users
    await seedEvents(); // Needs Kategori, Kota, Organizer (User)
    
    // 4. Dummy & Demo Data
    await seedDummy(); // Needs Events, Users
    await seedProfileDemo(); // Needs Users, Events

    console.log("--------------------------------------");
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`✅ ALL SEEDING TASKS COMPLETED SUCCESSFULLY in ${duration}s! ✨`);
    process.exit(0);
  } catch (error) {
    console.error("--------------------------------------");
    console.error("❌ CRITICAL ERROR DURING SEEDING:");
    console.error(error);
    process.exit(1);
  }
}

main();
