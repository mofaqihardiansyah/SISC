"use client";

import { useEffect } from "react";

export default function ViewTracker({ eventId }: { eventId: number }) {
  useEffect(() => {
    fetch(`/api/events/${eventId}/view`, { method: "POST" }).catch(() => {});
  }, [eventId]);

  return null;
}
