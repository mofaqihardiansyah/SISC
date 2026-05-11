import { getSubmissionData } from "@/actions/paper";
import ClientPage from "./ClientPage";
import { redirect } from "next/navigation";

export default async function Page() {
  const data = await getSubmissionData();

  if (!data.success) {
    redirect("/login");
  }

  return (
    <ClientPage 
      initialRegisteredEvents={data.registeredEvents || []} 
      initialSubmittedPapers={data.submittedPapers || []} 
    />
  );
}