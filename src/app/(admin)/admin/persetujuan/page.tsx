import { getEventStats } from "@/actions/persetujuan-event";
import { PersetujuanClient } from "./PersetujuanClient";

export default async function PersetujuanEventPage() {
  const stats = await getEventStats();

  if (!stats.success) return null;

  return (
    <PersetujuanClient
      initialPendingCount={stats.pendingCount}
      initialApprovedCount={stats.approvedCount}
      initialRejectedCount={stats.rejectedCount}
    />
  );
}
