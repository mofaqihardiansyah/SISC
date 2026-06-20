import 'dotenv/config';
import { seedMaster } from './seed-master';
import { seedEvent } from './seed-event';
import { seedDemo } from './seed-demo';
import { seedScraping } from './seed-scraping';

async function main() {
  const start = Date.now();
  console.log("🛠️  Unified Seeding Process Started...");
  console.log("--------------------------------------");

  try {
    await seedMaster();
    console.log("--------------------------------------");
    await seedEvent();
    console.log("--------------------------------------");
    await seedDemo();
    console.log("--------------------------------------");
    await seedScraping();
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