import { db } from "@/db";
import { event } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 👈 1. Bungkus tipe data params dengan Promise
) {
  try {
    // 👈 2. Lakukan await pada params sebelum membaca properti id
    const resolvedParams = await params; 
    const eventId = parseInt(resolvedParams.id);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: "ID Event tidak valid" }, { status: 400 });
    }

    // Naikkan jumlah tayangan langsung di kolom jumlahTayangan tabel event
    await db
      .update(event)
      .set({
        jumlahTayangan: sql`${event.jumlahTayangan} + 1`,
      })
      .where(eq(event.id, eventId));

    return NextResponse.json({ success: true, message: "Jumlah tayangan berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating view count:", error);
    return NextResponse.json({ error: "Gagal memperbarui tayangan" }, { status: 500 });
  }
}