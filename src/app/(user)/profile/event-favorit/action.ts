"use server";

import { db } from "@/db"; 
import { event, bookmark } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/auth";

export async function getEvents() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const userId = Number(session.user.id);

  const data = await db
    .select({
      id: event.id,
      judul: event.judul,
      bannerUrl: event.bannerUrl,
      harga: event.harga,
      tanggalMulai: event.tanggalMulai,
      jenisEvent: event.jenisEvent,
      penyelenggara: event.penyelenggara,
    })
    .from(bookmark)
    .innerJoin(event, eq(bookmark.eventId, event.id))
    .where(
      and(
        eq(bookmark.userId, userId),
        isNull(event.dihapusPada),
        eq(event.status, 'published')
      )
    );

  return data;
}