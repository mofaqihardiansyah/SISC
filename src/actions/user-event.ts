"use server";

import { db } from "@/db";
import { pendaftaran, event, users, profilPenyelenggara } from "@/db/schema";
import { eq, desc, and, ne } from "drizzle-orm";
import { auth } from "@/auth";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export interface UserEventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  organizer: string;
  image: string | null;
  status: 'pending' | 'registered' | 'completed' | 'favorited';
  kodePendaftaran: string | null;
  pendaftaranStatus: string | null;
  tanggalMulai: Date;
  tanggalSelesai: Date | null;
}

export interface GetUserEventsResult {
  success: boolean;
  data: UserEventItem[];
  error?: string;
}

export type EventStatusFilter = 'all' | 'pending' | 'registered' | 'completed';

function determineEventStatus(
  pendaftaranStatus: string | null,
  tanggalMulai: Date,
  tanggalSelesai: Date | null
): 'pending' | 'registered' | 'completed' {
  const now = new Date();
  
  if (pendaftaranStatus === 'menunggu_verifikasi') {
    return 'pending';
  }
  
  // Jika sudah diverifikasi (terdaftar, lunas, hadir)
  if (pendaftaranStatus === 'terdaftar' || pendaftaranStatus === 'lunas' || pendaftaranStatus === 'hadir') {
     // Jika event sudah selesai
     if (tanggalSelesai && tanggalSelesai < now) return 'completed';
     // Jika event tidak punya tanggalSelesai dan tanggalMulai sudah lewat jauh, mungkin bisa dianggap completed, tapi amannya kita anggap:
     if (!tanggalSelesai && tanggalMulai < now) {
       // Misal event berlalu > 1 hari
       const oneDayAfter = new Date(tanggalMulai.getTime() + 24 * 60 * 60 * 1000);
       if (oneDayAfter < now) return 'completed';
     }
     // Jika masih di masa depan atau sedang berlangsung
     return 'registered'; 
  }
  
  return 'completed'; // Fallback
}

function formatDate(date: Date): string {
  return format(date, "dd MMMM yyyy", { locale: id });
}

export async function getUserEvents(
  search?: string,
  status?: EventStatusFilter
): Promise<GetUserEventsResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, data: [], error: "Unauthorized" };
    }
    
    const userId = parseInt(session.user.id);
    
    const pendaftarans = await db
      .select({
        id: pendaftaran.id,
        kodePendaftaran: pendaftaran.kodePendaftaran,
        status: pendaftaran.status,
        eventId: event.id,
        eventTitle: event.judul,
        eventBannerUrl: event.urlBanner,
        eventPenyelenggara: event.penyelenggara,
        namaInstansi: profilPenyelenggara.namaInstansi,
        namaLengkapPenyelenggara: users.namaLengkap,
        eventDetailLokasi: event.detailLokasi,
        eventTanggalMulai: event.tanggalMulai,
        eventTanggalSelesai: event.tanggalSelesai,
      })
      .from(pendaftaran)
      .innerJoin(event, eq(pendaftaran.eventId, event.id))
      .leftJoin(users, eq(event.organizerId, users.id))
      .leftJoin(profilPenyelenggara, eq(users.id, profilPenyelenggara.userId))
      .where(
        and(
          eq(pendaftaran.userId, userId),
          ne(pendaftaran.status, 'dibatalkan')
        )
      )
      .orderBy(desc(pendaftaran.dibuatPada));
    
    let events: UserEventItem[] = pendaftarans.map((t) => {
      const eventStatus = determineEventStatus(
        t.status,
        t.eventTanggalMulai,
        t.eventTanggalSelesai
      );
      
      const realPenyelenggara = t.eventPenyelenggara || t.namaInstansi || t.namaLengkapPenyelenggara;

      return {
        id: t.eventId,
        title: t.eventTitle,
        date: formatDate(t.eventTanggalMulai),
        location: t.eventDetailLokasi || "Lokasi tidak tersedia",
        organizer: realPenyelenggara || "Penyelenggara tidak tersedia",
        image: t.eventBannerUrl,
        status: eventStatus,
        kodePendaftaran: t.kodePendaftaran,
        pendaftaranStatus: t.status,
        tanggalMulai: t.eventTanggalMulai,
        tanggalSelesai: t.eventTanggalSelesai,
      };
    });
    
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      events = events.filter((e) =>
        e.title.toLowerCase().includes(searchLower) ||
        e.organizer.toLowerCase().includes(searchLower) ||
        e.location.toLowerCase().includes(searchLower)
      );
    }
    
    if (status && status !== 'all') {
      events = events.filter((e) => e.status === status);
    }
    
    return { success: true, data: events };
  } catch (error) {
    console.error("[getUserEvents] Error:", error);
    return { success: false, data: [], error: "Failed to fetch events" };
  }
}