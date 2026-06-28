"use client";

import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';

export default function DraftActions({ eventId }: { eventId: number }) {
  const router = useRouter();

  return (
    <div className="flex gap-3 mt-3">
      <Button onClick={() => router.push(`/penyelenggara/buatevent?edit=${eventId}`)} variant="default">
        Edit Event
      </Button>
      <Button onClick={() => router.push("/penyelenggara/event")} variant="outline">
        Kembali ke Daftar Event
      </Button>
    </div>
  );
}
