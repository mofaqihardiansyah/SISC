"use server";

import { db } from "@/db";
import { event } from "@/db/schema"; // Menggunakan 'event' sesuai skema asli
import { eq } from "drizzle-orm";

/**
 * Fungsi Server Action untuk mengambil semua daftar event khusus untuk UI Penyelenggara.
 * Data diambil langsung dari tabel 'event' PostgreSQL.
 */
export async function getDaftarEvent() {
  try {
    // Mengambil data menggunakan objek tabel 'event' yang valid
    const data = await db.select().from(event);
    
    return { 
      success: true, 
      data: data 
    };
  } catch (error) {
    console.error("🚨 Gagal mengambil data event dari database:", error);
    return { 
      success: false, 
      data: [],
      error: error instanceof Error ? error.message : "Unknown database error"
    };
  }
}

/**
 * Fungsi Server Action untuk memperbarui data event ke database berdasarkan ID.
 * Menggunakan eq() dari drizzle-orm untuk mencocokkan ID.
 */
export async function updateEventDatabase(id: number | string, data: any) {
  try {
    if (!id) throw new Error("ID Event tidak valid atau tidak ditemukan");

    // Eksekusi update ke PostgreSQL via Drizzle ORM
    await db.update(event)
      .set(data)
      .where(eq(event.id, id as any));

    return { 
      success: true 
    };
  } catch (error) {
    console.error("🚨 Gagal memperbarui data event di database:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown database error" 
    };
  }
}