"use server";

import { db } from "@/db";
import { transaksi, event } from "@/db/schema";
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
  status: 'upcoming' | 'registered' | 'completed' | 'favorited';
  kodeBooking: string | null;
  transactionStatus: string | null;
  tanggalMulai: Date;
  tanggalSelesai: Date | null;
}

export interface GetUserEventsResult {
  success: boolean;
  data: UserEventItem[];
  error?: string;
}

export type EventStatusFilter = 'all' | 'upcoming' | 'registered' | 'completed';

function determineEventStatus(
  transactionStatus: string | null,
  tanggalMulai: Date,
  tanggalSelesai: Date | null
): 'upcoming' | 'registered' | 'completed' {
  const now = new Date();
  
  if (transactionStatus === 'success') {
    if (tanggalSelesai && tanggalSelesai < now) {
      return 'completed';
    }
    if (tanggalMulai > now) {
      return 'upcoming';
    }
    return 'registered';
  }
  
  if (tanggalMulai > now) {
    return 'upcoming';
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
    
    const transactions = await db
      .select({
        id: transaksi.id,
        kodeBooking: transaksi.kodeBooking,
        status: transaksi.status,
        eventId: event.id,
        eventTitle: event.judul,
        eventBannerUrl: event.bannerUrl,
        eventPenyelenggara: event.penyelenggara,
        eventDetailLokasi: event.detailLokasi,
        eventTanggalMulai: event.tanggalMulai,
        eventTanggalSelesai: event.tanggalSelesai,
      })
      .from(transaksi)
      .innerJoin(event, eq(transaksi.eventId, event.id))
      .where(eq(transaksi.userId, userId))
      .orderBy(desc(transaksi.dibuatPada));
    
    let events: UserEventItem[] = transactions.map((t) => {
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
        kodeBooking: t.kodeBooking,
        transactionStatus: t.status,
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