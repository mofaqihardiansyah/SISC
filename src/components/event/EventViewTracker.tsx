"use client";

import { useEffect } from "react";

export default function EventViewTracker({
  eventId,
}: {
  eventId: number;
}) {
  useEffect(() => {
    if (!eventId) return;

    const key = `event-view-${eventId}`;
    const alreadyViewed = sessionStorage.getItem(key);

    if (alreadyViewed) {
      return;
    }

    fetch(`/api/events/${eventId}/view`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gagal mencatat tayangan");
        }

        sessionStorage.setItem(key, "true");
      })
      .catch((error) => {
        console.error("Gagal mencatat tayangan:", error);
      });
  }, [eventId]);

  return null;
}