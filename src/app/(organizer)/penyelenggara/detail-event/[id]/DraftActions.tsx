"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitDraftToAdmin } from "@/actions/organizer-event";
import { Button } from '@/components/ui/button';

export default function DraftActions({ eventId }: { eventId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await submitDraftToAdmin(eventId);
    if (res.success) {
      toast.success("Event berhasil diajukan ke admin untuk direview!");
      router.refresh();
    } else {
      toast.error(res.error || "Gagal mengajukan event.");
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-3 mt-3">
      <Button onClick={handleSubmit} loading={loading} variant="default">
        Ajukan ke Admin
      </Button>
      <Button onClick={() => router.push("/penyelenggara/event")} variant="outline">
        Kembali ke Daftar Event
      </Button>
    </div>
  );
}
