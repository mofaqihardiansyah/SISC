"use server";

import { db } from "@/db";
import { event, pendaftaran, users, peserta } from "@/db/schema";
import { eq, and, desc, sql, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAdminEvents(search?: string, type?: string) {
  try {
    const conditions = [];
    
    if (search && search.trim()) {
      conditions.push(
        or(
          ilike(event.judul, `%${search}%`),
          ilike(event.penyelenggara, `%${search}%`)
        )
      );
    }

    if (type && type !== 'all') {
      conditions.push(eq(event.jenisEvent, type as "seminar" | "conference"));
    }

    const results = await db
      .select({
        event: event,
        participantCount: sql<number>`count(${pendaftaran.id})`.mapWith(Number),
      })
      .from(event)
      .leftJoin(pendaftaran, eq(event.id, pendaftaran.eventId))
      .where(and(...conditions))
      .groupBy(event.id)
      .orderBy(desc(event.dibuatPada));

    // Flatten the result
    const flattened = results.map(r => ({
      ...r.event,
      participantCount: r.participantCount
    }));

    return { success: true, data: flattened };
  } catch (error) {
    console.error("[getAdminEvents] Error:", error);
    return { success: false, data: [], error: "Gagal mengambil data event" };
  }
}

export async function getAdminEventStats() {
  try {
    const total = await db.select({ count: sql<number>`count(*)` }).from(event);
    
    const seminar = await db
      .select({ count: sql<number>`count(*)` })
      .from(event)
      .where(eq(event.jenisEvent, 'seminar'));

    const conference = await db
      .select({ count: sql<number>`count(*)` })
      .from(event)
      .where(eq(event.jenisEvent, 'conference'));

    const published = await db
      .select({ count: sql<number>`count(*)` })
      .from(event)
      .where(eq(event.status, 'published'));

    const polines = await db
      .select({ count: sql<number>`count(*)` })
      .from(event)
      .where(eq(event.isEventPolines, true));

    const umum = await db
      .select({ count: sql<number>`count(*)` })
      .from(event)
      .where(eq(event.isEventPolines, false));

    return {
      success: true,
      data: {
        total: Number(total[0]?.count || 0),
        seminar: Number(seminar[0]?.count || 0),
        conference: Number(conference[0]?.count || 0),
        published: Number(published[0]?.count || 0),
        polines: Number(polines[0]?.count || 0),
        umum: Number(umum[0]?.count || 0),
      },
    };

  } catch (error) {
    console.error("[getAdminEventStats] Error:", error);
    return { success: false, error: "Gagal mengambil statistik" };
  }
}


export async function updateEventStatus(id: number, status: "pending" | "published" | "rejected", reason?: string) {
  try {
    await db
      .update(event)
      .set({ 
        status, 
        alasanPenolakan: reason || null,
        diperbaruiPada: new Date() 
      })
      .where(eq(event.id, id));

    revalidatePath("/admin/events");
    return { success: true, message: `Status event berhasil diupdate ke ${status}` };
  } catch (error) {
    console.error("[updateEventStatus] Error:", error);
    return { success: false, error: "Gagal mengupdate status event" };
  }
}

export async function deleteEvent(id: number) {
  try {
    // Hard delete for now, or use soft delete if dihapusPada is preferred
    await db.delete(event).where(eq(event.id, id));
    
    revalidatePath("/admin/events");
    return { success: true, message: "Event berhasil dihapus" };
  } catch (error) {
    console.error("[deleteEvent] Error:", error);
    return { success: false, error: "Gagal menghapus event" };
  }
}

export async function updateEvent(id: number, data: Record<string, unknown>) {
  console.log("[updateEvent] Request for ID:", id, "Data:", data);
  try {
    if (!id) throw new Error("ID event tidak ditemukan");

    // Sanitize data: only allow valid columns and ensure numbers are numbers
    const sanitizedData: Record<string, unknown> = {};
    const validFields = [
      'judul', 'penyelenggara', 'deskripsi', 'syaratDanKetentuan', 
      'tanggalMulai', 'tanggalSelesai', 'batasRegistrasi', 
      'jenisEvent', 'tipePlatform', 'tipeHarga', 'harga', 
      'detailLokasi', 'linkEksternal', 'namaKontak', 'emailKontak', 
      'teleponKontak', 'kuota', 'maksTiketPerTransaksi', 
      'satuAkunSatuTransaksi', 'status', 'namaPembicara', 
      'peranPembicara', 'fotoPembicaraUrl', 'bannerUrl',
      'isEventPolines', 'websiteSumber'
    ];

    Object.keys(data).forEach(key => {
      if (validFields.includes(key)) {
        let value = data[key];
        
        // Convert boolean fields
        if (['isEventPolines', 'satuAkunSatuTransaksi'].includes(key)) {
          if (typeof value === 'string') {
            value = value === 'true';
          }
        }
        
        // Convert to number if it should be an integer
        if (['harga', 'kuota', 'maksTiketPerTransaksi'].includes(key)) {
          if (value === null || value === undefined || value === '') {
            value = 0;
          } else {
            const parsed = parseInt(value.toString());
            value = isNaN(parsed) ? 0 : parsed;
          }
        }
        
        if (value !== undefined) {
          sanitizedData[key] = value;
        }
      }
    });

    console.log("[updateEvent] Sanitized Data to update:", sanitizedData);

    // Use a simpler update call to avoid complex object serialization issues
    await db
      .update(event)
      .set({
        ...sanitizedData,
        diperbaruiPada: new Date()
      })
      .where(eq(event.id, id));

    console.log("[updateEvent] Database update successful for ID:", id);

    revalidatePath("/admin/events");
    
    // Return a very simple object to ensure successful serialization
    return { 
      success: true, 
      message: "Event berhasil diperbarui" 
    };
  } catch (error) {
    console.error("[updateEvent] Server Action Error:", error);
    
    let errorMessage = "Gagal memperbarui event";
    if (error instanceof Error) {
      errorMessage = error.message;
      // Log stack trace for deeper debugging in terminal
      console.error(error.stack);
    }
    
    return { success: false, error: errorMessage };
  }
}

export async function getAdminParticipants() {
  try {
    const results = await db
      .select({
        id: pendaftaran.id,
        kodePendaftaran: pendaftaran.kodePendaftaran,
        status: pendaftaran.status,
        dibuatPada: pendaftaran.dibuatPada,
        eventTitle: event.judul,
        participantName: peserta.namaLengkap,
        participantEmail: peserta.email,
        userName: users.namaLengkap,
        userEmail: users.email,
      })
      .from(pendaftaran)
      .innerJoin(event, eq(pendaftaran.eventId, event.id))
      .innerJoin(peserta, eq(pendaftaran.id, peserta.pendaftaranId))
      .innerJoin(users, eq(pendaftaran.userId, users.id))
      .orderBy(desc(pendaftaran.dibuatPada));

    return { success: true, data: results };
  } catch (error) {
    console.error("[getAdminParticipants] Error:", error);
    return { success: false, error: "Gagal mengambil data peserta" };
  }
}




