import React from 'react';
import { db } from "@/db";
import { scrapingSources, scrapingValidationRules } from "@/db/schema";
import { desc } from "drizzle-orm";
import SourcesClient from "./SourcesClient";

export const dynamic = 'force-dynamic';

export default async function ScrapingSourcesPage() {
  const sources = await db.select().from(scrapingSources).orderBy(desc(scrapingSources.createdAt));
  const rules = await db.select().from(scrapingValidationRules);

  return (
    <SourcesClient
      initialSources={sources}
      initialRules={rules}
    />
  );
}
