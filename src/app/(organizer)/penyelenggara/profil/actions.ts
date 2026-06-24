"use server";

import { db } from "@/db";
import { users, profilPenyelenggara, event } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProfilPenyelenggara(data: {
  urlAvatar: string;
  namaInstansi: string;
  deskripsiInstansi: string;
  urlWebsite: string;
  nomorTelepon: string;
  urlDokumenLegalitas: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    
    const userId = parseInt(session.user.id, 10);
    
    // Update users table for urlAvatar and nomorTelepon
    await db.update(users).set({
      urlAvatar: data.urlAvatar || "/uploads/avatars/fotodummy.jpg",
      nomorTelepon: data.nomorTelepon,
      diperbaruiPada: new Date(),
    }).where(eq(users.id, userId));
    
    // Check if profilPenyelenggara exists
    const [existingProfil] = await db.select().from(profilPenyelenggara).where(eq(profilPenyelenggara.userId, userId));
    
    if (existingProfil) {
      await db.update(profilPenyelenggara).set({
        namaInstansi: data.namaInstansi,
        deskripsiInstansi: data.deskripsiInstansi,
        urlWebsite: data.urlWebsite,
        urlDokumenLegalitas: data.urlDokumenLegalitas,
        diperbaruiPada: new Date(),
      }).where(eq(profilPenyelenggara.userId, userId));
    } else {
      await db.insert(profilPenyelenggara).values({
        userId: userId,
        namaInstansi: data.namaInstansi,
        deskripsiInstansi: data.deskripsiInstansi,
        urlWebsite: data.urlWebsite,
        urlDokumenLegalitas: data.urlDokumenLegalitas,
      });
    }

    // Sync event.penyelenggara for all events by this organizer
    await db.update(event)
      .set({ penyelenggara: data.namaInstansi })
      .where(eq(event.organizerId, userId));
    
    revalidatePath("/penyelenggara/profil");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Gagal menyimpan perubahan." };
  }
}
