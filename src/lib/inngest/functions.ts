import { inngest } from "./client";
import { seminarCrawler } from "../scraper/engine";
import { db } from "@/db";
import { scrapingSources } from "@/db/schema";
import { eq } from "drizzle-orm";

export const scrapeEvents = inngest.createFunction(
  { 
    id: "scrape-events-task", 
    name: "Scrape Events Task",
    triggers: [{ event: "app/scrape.start" }]
  },
  async ({ event, step }) => {
    const { urls } = event.data;

    const result = await step.run("execute-scraping", async () => {
      let targetUrls = urls;
      if (!targetUrls || targetUrls.length === 0) {
        const sources = await db.select().from(scrapingSources).where(eq(scrapingSources.isActive, true));
        targetUrls = sources.map(s => {
          const base = s.baseUrl.replace(/\/$/, '');
          return s.urlPattern ? `${base}${s.urlPattern}` : base;
        });
      }
      await seminarCrawler.run(targetUrls);
      return { success: true, processedUrls: targetUrls };
    });

    return result;
  }
);
