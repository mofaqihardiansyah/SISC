import React from 'react';
import ScrapingClient from "./ScrapingClient";
import { getScrapingPageData } from "./shared";

export const dynamic = 'force-dynamic';

export default async function ScrapingPage() {
  const { initialData, initialLogs, cities, categories, sources, validationRules } = await getScrapingPageData();

  return (
    <ScrapingClient
      initialData={initialData}
      initialLogs={initialLogs}
      cities={cities}
      categories={categories}
      sources={sources}
      validationRules={validationRules}
    />
  );
}
