import 'dotenv/config';
import { db } from './index';
import { scrapingSources, scrapingValidationRules, scrapingAutoApprovalRules } from './schema';

async function seedScrapingSources() {
  console.log(" Seeding scraping sources...");
  const sources = [
    {
      name: "Eventkampus - Seminar",
      baseUrl: "https://eventkampus.com",
      urlPattern: "/event/kategori/seminar",
      scraperType: "crawlee_playwright" as const,
      cronSchedule: "0 */6 * * *",
      maxResultsPerRun: 100,
      rateLimitDelayMs: 1000,
      maxConcurrentRequests: 2,
      isActive: true,
    },
    {
      name: "Eventkampus - Conference",
      baseUrl: "https://eventkampus.com",
      urlPattern: "/event/kategori/conference",
      scraperType: "crawlee_playwright" as const,
      cronSchedule: "0 */6 * * *",
      maxResultsPerRun: 50,
      rateLimitDelayMs: 1500,
      maxConcurrentRequests: 2,
      isActive: true,
    },
    {
      name: "InfoSeminar - Beranda",
      baseUrl: "https://infoseminar.id",
      urlPattern: null,
      scraperType: "crawlee_playwright" as const,
      cronSchedule: "0 */12 * * *",
      maxResultsPerRun: 100,
      rateLimitDelayMs: 2000,
      maxConcurrentRequests: 2,
      isActive: true,
    },
  ];
  for (const source of sources) {
    await db.insert(scrapingSources).values(source).onConflictDoNothing();
  }
  console.log(" Scraping sources seeded!");
}

async function seedValidationRules() {
  console.log(" Seeding validation rules...");
  const rules = [
    { fieldName: "judul", isRequired: true, minLength: 3, maxLength: 255, confidenceThreshold: 10 },
    { fieldName: "linkEksternal", isRequired: true, confidenceThreshold: 10 },
    { fieldName: "tanggalMentah", isRequired: true, confidenceThreshold: 10 },
    { fieldName: "detailLokasi", isRequired: false, maxLength: 500, confidenceThreshold: 15 },
    { fieldName: "urlBanner", isRequired: false, confidenceThreshold: 0 },
    { fieldName: "deskripsi", isRequired: false, minLength: 20, confidenceThreshold: 15 },
  ];
  for (const rule of rules) {
    await db.insert(scrapingValidationRules).values(rule).onConflictDoNothing();
  }
  console.log(" Validation rules seeded!");
}

async function seedAutoApprovalRules() {
  console.log(" Seeding auto-approval rules...");
  const rules = [
    {
      ruleName: "High Confidence Auto-Publish",
      conditionType: "confidence_score",
      thresholdValue: 90,
      autoPublish: true,
      enabled: true,
    },
    {
      ruleName: "Medium Confidence Manual Review",
      conditionType: "confidence_score",
      thresholdValue: 70,
      autoPublish: false,
      enabled: true,
    },
  ];
  for (const rule of rules) {
    await db.insert(scrapingAutoApprovalRules).values(rule).onConflictDoNothing();
  }
  console.log(" Auto-approval rules seeded!");
}

export async function seedScraping() {
  const start = Date.now();
  console.log(" [SCRAPING] Seeding scraping configuration...\n");
  await seedScrapingSources();
  await seedValidationRules();
  await seedAutoApprovalRules();
  console.log(`\n [SCRAPING] Done in ${((Date.now() - start) / 1000).toFixed(2)}s`);
}

async function main() {
  const start = Date.now();
  console.log(" Scraping Configuration Seed...\n");
  try {
    await seedScraping();
    console.log(`\n Done in ${((Date.now() - start) / 1000).toFixed(2)}s`);
    process.exit(0);
  } catch (error) {
    console.error(" Failed:", error);
    process.exit(1);
  }
}

if (require.main === module) main();
