"use server";

import { db } from "@/db";
import { event } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Updates the banner URL of an event.
 * @param eventId The ID of the event to update.
 * @param urlBanner The new banner URL (usually from Uploadthing).
 */
export async function updateEventBanner(eventId: number, urlBanner: string) {
  try {
    await db.update(event)
      .set({ 
        urlBanner,
        diperbaruiPada: new Date()
      })
      .where(eq(event.id, eventId));
    
    // Revalidate the pages that show this event
    revalidatePath("/");
    revalidatePath(`/event/${eventId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update event banner:", error);
    return { success: false, error: "Gagal memperbarui banner di database." };
  }
}
