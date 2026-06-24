"use server";

import { db } from "@/db"; 
import { event, favorit, kota, kategori, users, profilPenyelenggara } from "@/db/schema";
import { eq, and, isNull, sql } from "drizzle-orm";
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
        urlBanner: event.urlBanner,
        harga: event.harga,
        tanggalMulai: event.tanggalMulai,
        jenisEvent: event.jenisEvent,
        penyelenggara: sql<string>`COALESCE(${profilPenyelenggara.namaInstansi}, ${event.penyelenggara}, '-')`,
        namaKota: kota.nama,
        namaKategori: kategori.nama,
        eventPolines: event.eventPolines,
        tipePlatform: event.tipePlatform,
      })
      .from(favorit)
      .innerJoin(event, eq(favorit.eventId, event.id))
      .leftJoin(kota, eq(event.kotaId, kota.id))
      .leftJoin(kategori, eq(event.kategoriId, kategori.id))
      .leftJoin(users, eq(event.organizerId, users.id))
      .leftJoin(profilPenyelenggara, eq(users.id, profilPenyelenggara.userId))
      .where(
        and(
          eq(favorit.userId, userId),
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