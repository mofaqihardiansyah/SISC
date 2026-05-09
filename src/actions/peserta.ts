"use server";

import { db } from "@/db";
import { peserta, transaksi, event } from "@/db/schema";
import { eq, and } from "drizzle-orm";
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

    // Cek apakah event ada
    const dataEvent = await db.query.event.findFirst({
      where: eq(event.id, idEvent),
    });

    if (!dataEvent) {
      return { success: false, error: "Event tidak ditemukan" };
    }

    // Cek sudah terdaftar
    const existing = await db
      .select()
      .from(transaksi)
      .where(
        and(
          eq(transaksi.eventId, idEvent),
          eq(transaksi.userId, idUser)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: "Anda sudah terdaftar di event ini" };
    }

    // 1. Buat data transaksi terlebih dahulu
    const [newTransaksi] = await db.insert(transaksi).values({
      eventId: idEvent,
      userId: idUser,
      status: 'pending',
      totalHarga: 0,
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
      sudahCheckIn: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Gagal simpan ke database:", error);
    return { success: false, error: "Terjadi kesalahan saat menyimpan data" };
  }
}