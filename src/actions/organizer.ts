'use server';

import { db } from "@/db"; 
import { profilPenyelenggara } from "@/db/schema"; 
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function updateProfilAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const nama = formData.get("nama_instansi") as string;
  const deskripsi = formData.get("deskripsi_instansi") as string;
  const website = formData.get("website_url") as string;

  try {
    // Only allow updating if the profile belongs to the logged-in user
    const profil = await db.query.profilPenyelenggara.findFirst({
      where: eq(profilPenyelenggara.id, parseInt(id))
    });

    if (!profil || profil.userId?.toString() !== session.user.id) {
      throw new Error("Unauthorized: Anda tidak dapat mengedit profil ini");
    }

    await db.update(profilPenyelenggara)
      .set({
        namaInstansi: nama,
        deskripsiInstansi: deskripsi,
        urlWebsite: website,
        diperbaruiPada: new Date()
      })
      .where(eq(profilPenyelenggara.id, parseInt(id)));

    revalidatePath("/penyelenggara/profil");
  } catch (error) {
    console.error("Error pada server action:", error);
    throw error;
  }
}