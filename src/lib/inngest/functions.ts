import { inngest } from "./client";
import { seminarCrawler } from "../scraper/engine";
import { SCRAPER } from "@/lib/constants";

export const scrapeEvents = inngest.createFunction(
  { 
    id: "scrape-events-task", 
    name: "Scrape Events Task",
    triggers: [{ event: "app/scrape.start" }]
  },
  async ({ event, step }) => {
    const { urls } = event.data;

    const result = await step.run("execute-scraping", async () => {
      // Menjalankan crawler dengan list URL yang diberikan
      await seminarCrawler.run(urls || [SCRAPER.DEFAULT_URL]);
      return { success: true, processedUrls: urls };
    });

    return result;
  }
);
