import { getSubmissionData } from "@/actions/paper";
import ClientPage from "./ClientPage";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page() {
  const data = await getSubmissionData();

  if (!data.success) {
    console.error("Failed to load submission data:", data.error);
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-slate-600">{data.error || "Failed to load submission data"}</p>
        <p className="text-sm text-slate-500 mt-4">
          Please try again later or contact support if the problem persists.
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}>
      <ClientPage 
        initialRegisteredEvents={data.registeredEvents || []} 
        initialSubmittedPapers={data.submittedPapers || []} 
      />
    </Suspense>
  );
}
