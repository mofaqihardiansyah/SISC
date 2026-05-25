"use server";

import { db } from "@/db";
import { pendaftaran, event } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
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
  
  // Selama dia terdaftar/hadir (bukan dibatalkan)
  if (pendaftaranStatus === 'terdaftar' || pendaftaranStatus === 'hadir') {
     if (tanggalSelesai && tanggalSelesai < now) return 'completed';
     if (tanggalMulai > now) return 'pending';
     return 'registered'; // Sedang berlangsung hari ini
  }
  
  if (tanggalMulai > now) {
    return 'pending';
  }
  
  return 'completed';
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
        eventBannerUrl: event.bannerUrl,
        eventPenyelenggara: event.penyelenggara,
        eventDetailLokasi: event.detailLokasi,
        eventTanggalMulai: event.tanggalMulai,
        eventTanggalSelesai: event.tanggalSelesai,
      })
      .from(pendaftaran)
      .innerJoin(event, eq(pendaftaran.eventId, event.id))
      .where(eq(pendaftaran.userId, userId))
      .orderBy(desc(pendaftaran.dibuatPada));
    
    let events: UserEventItem[] = pendaftarans.map((t) => {
      const eventStatus = determineEventStatus(
        t.status,
        t.eventTanggalMulai,
        t.eventTanggalSelesai
      );
      
      return {
        id: t.eventId,
        title: t.eventTitle,
        date: formatDate(t.eventTanggalMulai),
        location: t.eventDetailLokasi || "Lokasi tidak tersedia",
        organizer: t.eventPenyelenggara || "Penyelenggara tidak tersedia",
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