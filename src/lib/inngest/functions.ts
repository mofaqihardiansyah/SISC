import { inngest } from "./client";
import { seminarCrawler } from "../scraper/engine";

export const scrapeEvents = inngest.createFunction(
  { id: "scrape-events-task" },
  { event: "app/scrape.start" },
  async ({ event, step }) => {
    const { urls } = event.data;

    const result = await step.run("execute-scraping", async () => {
      // Menjalankan crawler dengan list URL yang diberikan
      await seminarCrawler.run(urls || ["https://eventkampus.com/event/kategori/seminar"]);
      return { success: true, processedUrls: urls };
    });

    return result;
  }
);
