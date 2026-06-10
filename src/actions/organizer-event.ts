"use server";

import { db } from "@/db";
import { event, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";

/**
 * Fungsi Server Action untuk mengambil daftar event khusus milik penyelenggara yang sedang login.
 * Data diambil langsung dari tabel 'event' PostgreSQL.
 */
export async function getDaftarEvent() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { 
        success: false, 
        data: [], 
        error: "Sesi Anda telah berakhir, silakan login kembali." 
      };
    }

    const userId = parseInt(session.user.id, 10);
    if (isNaN(userId)) {
      return { 
        success: false, 
        data: [], 
        error: "ID Pengguna tidak valid." 
      };
    }

    // Mengambil data event milik penyelenggara ini saja
    const data = await db.select().from(event).where(eq(event.organizerId, userId));
    
    return { 
      success: true, 
      data: data 
    };
  } catch (error) {
    console.error("🚨 Gagal mengambil data event dari database:", error);
    return { 
      success: false, 
      data: [],
      error: error instanceof Error ? error.message : "Terjadi kesalahan database yang tidak diketahui"
    };
  }
}

/**
 * Fungsi Server Action untuk memperbarui data event ke database berdasarkan ID.
 * Menggunakan eq() dari drizzle-orm untuk mencocokkan ID.
 * Memeriksa apakah penyelenggara telah disetujui (disetujui) terlebih dahulu.
 */
export async function updateEventDatabase(id: number | string, data: Partial<typeof event.$inferInsert>) {
  try {
    if (!id) throw new Error("ID Event tidak valid atau tidak ditemukan");

    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Sesi Anda telah berakhir, silakan login kembali.");
    }

    const userId = parseInt(session.user.id, 10);
    if (isNaN(userId)) {
      throw new Error("ID Pengguna tidak valid.");
    }

    // Periksa apakah akun penyelenggara sudah disetujui oleh admin
    const [user] = await db
      .select({ disetujui: users.disetujui })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user?.disetujui) {
      throw new Error("Akun Anda belum disetujui oleh Admin. Anda belum dapat mengelola event.");
    }

    // Eksekusi update ke PostgreSQL via Drizzle ORM
    const eventId = Number(id);
    await db.update(event)
      .set(data)
      .where(and(eq(event.id, eventId), eq(event.organizerId, userId)));

    return { 
      success: true 
    };
  } catch (error) {
    console.error("🚨 Gagal memperbarui data event di database:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Terjadi kesalahan database yang tidak diketahui" 
    };
  }
}