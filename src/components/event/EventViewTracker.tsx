"use client";

import { useEffect } from "react";
import { ERROR_MESSAGES } from "@/lib/constants";

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
          throw new Error(ERROR_MESSAGES.TRACK_VIEW);
        }

        sessionStorage.setItem(key, "true");
      })
      .catch((error) => {
        console.error(ERROR_MESSAGES.TRACK_VIEW, error);
      });
  }, [eventId]);

  return null;
}