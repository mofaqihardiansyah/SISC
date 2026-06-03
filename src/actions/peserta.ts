"use server";

import { db } from "@/db";
import { peserta, pendaftaran, event } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";

// Tambahkan field bukti_pembayaran di interface agar lolos validasi tipe data
interface RegistrationData {
  nama_lengkap: string;
  email: string;
  nomor_telepon: string;
  jenis_kelamin: string;
  bukti_pembayaran?: string; // Tipe string untuk menampung nama file
}

export async function daftarEvent(formData: RegistrationData, eventId: number) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: "Anda harus masuk terlebih dahulu" };
    }

    const idEvent = Number(eventId);
    const idUser = Number(session.user.id);

    // Optimasi 1: Jalankan pengecekan event dan status pendaftaran secara paralel (Promise.all)
    const [dataEvent, existing] = await Promise.all([
      db.query.event.findFirst({
        where: eq(event.id, idEvent),
      }),
      db.select()
        .from(pendaftaran)
        .where(and(eq(pendaftaran.eventId, idEvent), eq(pendaftaran.userId, idUser)))
        .limit(1)
    ]);

    if (!dataEvent) {
      return { success: false, error: "Event tidak ditemukan" };
    }
    if (existing.length > 0) {
      return { success: false, error: "Anda sudah terdaftar di event ini" };
    }

    // Optimasi 2: Gunakan Database Transaction agar proses insert atomic
    await db.transaction(async (tx) => {
      // 1. Buat data pendaftaran terlebih dahulu
      const kodePendaftaran = `REG-${idEvent}-${idUser}-${Date.now()}`;
      
      const [newPendaftaran] = await tx.insert(pendaftaran).values({
        eventId: idEvent,
        userId: idUser,
        kodePendaftaran: kodePendaftaran,
        status: 'terdaftar',
        buktiPembayaran: formData.bukti_pembayaran,
        dibuatPada: new Date(),
      }).returning({ id: pendaftaran.id });

      if (!newPendaftaran) {
        throw new Error("Gagal membuat data pendaftaran");
      }

      // 2. Gunakan ID pendaftaran yang baru dibuat untuk mendaftarkan peserta
      await tx.insert(peserta).values({
        namaLengkap: formData.nama_lengkap, 
        email: formData.email,
        nomorTelepon: formData.nomor_telepon,
        jenisKelamin: formData.jenis_kelamin as "Laki-laki" | "Perempuan", 
        pendaftaranId: newPendaftaran.id, 
        kodePeserta: `PES-${idEvent}-${idUser}-${Math.floor(Math.random() * 1000)}`,
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Gagal simpan ke database:", error);
    return { success: false, error: "Terjadi kesalahan saat menyimpan data" };
  }
}