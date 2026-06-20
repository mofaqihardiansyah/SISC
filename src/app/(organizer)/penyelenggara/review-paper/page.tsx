import React from 'react';
import { getOrganizerPapers } from "./actions";
import ReviewPaperClient from "./ReviewPaperClient";

export const dynamic = 'force-dynamic';

export default async function ReviewPaperPage() {
  const result = await getOrganizerPapers();

  if (!result.success) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-slate-600">{result.error || "Gagal memuat data review paper."}</p>
      </div>
    );
  }

  return (
    <ReviewPaperClient
      initialPapers={result.data}
      initialEvents={result.events}
    />
  );
}
