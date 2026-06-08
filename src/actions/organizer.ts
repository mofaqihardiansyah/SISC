'use server';

import { db } from "@/db"; 
import { profilPenyelenggara } from "@/db/schema"; // Menggunakan camelCase sesuai skema aslimu
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProfilAction(formData: FormData) {
  const id = formData.get("id") as string;
  const nama = formData.get("nama_instansi") as string;
  const deskripsi = formData.get("deskripsi_instansi") as string;
  const website = formData.get("website_url") as string;

  try {
    await db.update(profilPenyelenggara)
      .set({
        namaInstansi: nama,
        deskripsiInstansi: deskripsi,
        websiteUrl: website,
      })
      .where(eq(profilPenyelenggara.id, parseInt(id)));

    revalidatePath("/penyelenggara/profil");
  } catch (error) {
    console.error("Error pada server action:", error);
  }
}