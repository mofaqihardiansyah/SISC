// src/actions/peserta.ts
"use server";

import { db } from "@/db";
import { peserta } from "@/db/schema";

export async function daftarEvent(formData: any, eventId: number) {
  try {
    // Pastikan eventId yang masuk adalah angka (number)
    const idEvent = Number(eventId);

    await db.insert(peserta).values({
      // Sisi kiri (kunci) adalah nama variabel di schema.ts
      // Sisi kanan adalah data yang dikirim dari FormRegistrasi.tsx
      namaLengkap: formData.nama_lengkap, 
      email: formData.email,
      nomorTelepon: formData.nomor_telepon,
      jenisKelamin: formData.jenis_kelamin, 
      
      // Menggunakan transaksiId sebagai penghubung (sementara)
      transaksiId: idEvent, 
      
      // Membuat kode unik untuk QR Code check-in nanti
      kodePeserta: `REG-${idEvent}-${Date.now()}`, 
    });

    return { success: true };
  } catch (error) {
    console.error("Gagal simpan ke database:", error);
    return { success: false, error: "Terjadi kesalahan saat menyimpan data" };
  }
}