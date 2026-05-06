"use server";

import { db } from "@/db";
import { peserta } from "@/db/schema";

export async function daftarEvent(data: { nama_lengkap: string; email: string; nomor_telepon: string }) {
  try {
    await db.insert(peserta).values({
      namaLengkap: data.nama_lengkap,
      email: data.email,
      nomorTelepon: data.nomor_telepon,
      // tambahkan kolom lain jika perlu sesuai schema
    });
    return { success: true };
  } catch (error) {
    console.error("Gagal simpan ke database:", error);
    return { success: false };
  }
}