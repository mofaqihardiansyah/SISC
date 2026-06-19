import React from 'react';
import { db } from "@/db";
import { rawScrapedData, logScraping } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import ScrapingClient from "./ScrapingClient";

export const dynamic = 'force-dynamic';

export default async function ScrapingPage() {
  const data = await db.select().from(rawScrapedData).where(eq(rawScrapedData.statusIntegrasi, false));
  const logs = await db.select().from(logScraping).orderBy(desc(logScraping.mulaiPada)).limit(50);
  return <ScrapingClient initialData={data} initialLogs={logs} />;
}
