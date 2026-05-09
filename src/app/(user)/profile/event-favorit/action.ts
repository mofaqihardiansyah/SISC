"use server";

import { db } from "@/db"; 
import { event, bookmark, kota, kategori } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { auth } from "@/auth";

export async function getEvents() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const userId = Number(session.user.id);

  try {
    const data = await db
      .select({
        id: event.id,
        judul: event.judul,
        bannerUrl: event.bannerUrl,
        harga: event.harga,
        tanggalMulai: event.tanggalMulai,
        jenisEvent: event.jenisEvent,
        penyelenggara: event.penyelenggara,
        namaKota: kota.nama,
        namaKategori: kategori.nama,
        isEventPolines: event.isEventPolines,
        tipePlatform: event.tipePlatform,
      })
      .from(bookmark)
      .innerJoin(event, eq(bookmark.eventId, event.id))
      .leftJoin(kota, eq(event.kotaId, kota.id))
      .leftJoin(kategori, eq(event.kategoriId, kategori.id))
      .where(
        and(
          eq(bookmark.userId, userId),
          isNull(event.dihapusPada),
          eq(event.status, 'published')
        )
      );

    console.log(`[FAVORIT] UserId: ${userId}, Data Found: ${data.length}`);
    return data;
  } catch (error) {
    console.error("Error fetching favorite events:", error);
    return [];
  }
}