import 'dotenv/config';
import { seminarCrawler } from '../src/lib/scraper/engine';

async function test() {
  console.log("🚀 Testing Scraper...");
  await seminarCrawler.run(["https://eventkampus.com/event/kategori/seminar"]);
  console.log("✅ Scraper Test Finished.");
  process.exit(0);
}

test().catch(err => {
  console.error("❌ Test Failed:", err);
  process.exit(1);
});