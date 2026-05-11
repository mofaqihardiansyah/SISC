"use server";

import { db } from "@/db";
import { event, pendaftaran } from "@/db/schema";
import { eq, and, desc, sql, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAdminEvents(search?: string, status?: string) {
  try {
    const conditions = [];
    
    // Always exclude deleted ones if you have soft delete
    // conditions.push(sql`${event.dihapusPada} IS NULL`);

    if (search && search.trim()) {
      conditions.push(
        or(
          ilike(event.judul, `%${search}%`),
          ilike(event.penyelenggara, `%${search}%`)
        )
      );
    }

    if (status && status !== 'all') {
      conditions.push(eq(event.status, status as "pending" | "published" | "rejected"));
    }

    const results = await db
      .select({
        event: event,
        participantCount: sql<number>`count(${pendaftaran.id})`.mapWith(Number),
      })
      .from(event)
      .leftJoin(pendaftaran, eq(event.id, pendaftaran.eventId))
      .where(and(...conditions))
      .groupBy(event.id)
      .orderBy(desc(event.dibuatPada));

    // Flatten the result
    const flattened = results.map(r => ({
      ...r.event,
      participantCount: r.participantCount
    }));

    return { success: true, data: flattened };
  } catch (error) {
    console.error("[getAdminEvents] Error:", error);
    return { success: false, data: [], error: "Gagal mengambil data event" };
  }
}

export async function getAdminEventStats() {
  try {
    const stats = await db
      .select({
        status: event.status,
        count: sql<number>`count(*)`,
      })
      .from(event)
      .groupBy(event.status);

    const total = await db.select({ count: sql<number>`count(*)` }).from(event);

    return {
      success: true,
      data: {
        total: Number(total[0]?.count || 0),
        pending: Number(stats.find((s) => s.status === "pending")?.count || 0),
        published: Number(stats.find((s) => s.status === "published")?.count || 0),
        rejected: Number(stats.find((s) => s.status === "rejected")?.count || 0),
      },
    };
  } catch (error) {
    console.error("[getAdminEventStats] Error:", error);
    return { success: false, error: "Gagal mengambil statistik" };
  }
}

export async function updateEventStatus(id: number, status: "pending" | "published" | "rejected", reason?: string) {
  try {
    await db
      .update(event)
      .set({ 
        status, 
        alasanPenolakan: reason || null,
        diperbaruiPada: new Date() 
      })
      .where(eq(event.id, id));

    revalidatePath("/(admin)/admin/events", "page");
    return { success: true, message: `Status event berhasil diupdate ke ${status}` };
  } catch (error) {
    console.error("[updateEventStatus] Error:", error);
    return { success: false, error: "Gagal mengupdate status event" };
  }
}

export async function deleteEvent(id: number) {
  try {
    // Hard delete for now, or use soft delete if dihapusPada is preferred
    await db.delete(event).where(eq(event.id, id));
    
    revalidatePath("/(admin)/admin/events", "page");
    return { success: true, message: "Event berhasil dihapus" };
  } catch (error) {
    console.error("[deleteEvent] Error:", error);
    return { success: false, error: "Gagal menghapus event" };
  }
}

export async function updateEvent(id: number, data: Partial<typeof event.$inferInsert>) {
  try {
    await db
      .update(event)
      .set({
        ...data,
        diperbaruiPada: new Date()
      })
      .where(eq(event.id, id));

    revalidatePath("/(admin)/admin/events", "page");
    return { success: true, message: "Event berhasil diperbarui" };
  } catch (error) {
    console.error("[updateEvent] Error:", error);
    return { success: false, error: "Gagal memperbarui event" };
  }
}
