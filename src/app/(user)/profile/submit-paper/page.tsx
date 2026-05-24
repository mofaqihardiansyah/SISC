import { getSubmissionData } from "@/actions/paper";
import ClientPage from "./ClientPage";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page() {
  const data = await getSubmissionData();

  if (!data.success) {
    redirect("/login");
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
