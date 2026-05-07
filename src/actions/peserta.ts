"use server";

import { db } from "@/db";
import { peserta, transaksi } from "@/db/schema";
import { auth } from "@/auth";

interface RegistrationData {
  nama_lengkap: string;
  email: string;
  nomor_telepon: string;
  jenis_kelamin: string;
}

export async function daftarEvent(formData: RegistrationData, eventId: number) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: "Anda harus masuk terlebih dahulu" };
    }

    const idEvent = Number(eventId);
    const idUser = Number(session.user.id);

    // 1. Buat data transaksi terlebih dahulu
    const [newTransaksi] = await db.insert(transaksi).values({
      eventId: idEvent,
      userId: idUser,
      status: 'pending',
      totalHarga: 0, // Default 0 untuk pendaftaran awal
      dibuatPada: new Date(),
    }).returning({ id: transaksi.id });

    if (!newTransaksi) {
      throw new Error("Gagal membuat data transaksi");
    }

    // 2. Gunakan ID transaksi yang baru dibuat untuk mendaftarkan peserta
    await db.insert(peserta).values({
      namaLengkap: formData.nama_lengkap, 
      email: formData.email,
      nomorTelepon: formData.nomor_telepon,
      jenisKelamin: formData.jenis_kelamin, 
      transaksiId: newTransaksi.id, 
      kodePeserta: `REG-${idEvent}-${Date.now()}`, 
    });

    return { success: true };
  } catch (error) {
    console.error("Gagal simpan ke database:", error);
    return { success: false, error: "Terjadi kesalahan saat menyimpan data" };
  }
}