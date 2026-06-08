"use server";

import { db } from "@/db";
import { event, users, peserta, pendaftaran, transaksi } from "@/db/schema";
import { count, eq, and, gte, lte, sql } from "drizzle-orm";

export async function getDashboardStats() {
  try {
    // 1. Event Menunggu Persetujuan
    const [pendingEvents] = await db
      .select({ value: count() })
      .from(event)
      .where(eq(event.status, 'pending'));

    // 2. Total Penyelenggara Aktif
    const [activeOrganizers] = await db
      .select({ value: count() })
      .from(users)
      .where(eq(users.role, 'organizer'));

    // 3. Total Event Berjalan (Published)
    const [runningEvents] = await db
      .select({ value: count() })
      .from(event)
      .where(eq(event.status, 'published'));

    // 4. Total Tiket Terjual (Confirmed participants)
    const [ticketsSold] = await db
      .select({ value: count() })
      .from(peserta)
      .innerJoin(pendaftaran, eq(peserta.pendaftaranId, pendaftaran.id))
      .where(eq(pendaftaran.status, 'terdaftar'));

    // 5. Total Pengguna (Visitor)
    const [totalUsers] = await db
      .select({ value: count() })
      .from(users)
      .where(eq(users.role, 'visitor'));

    return {
      pendingApproval: pendingEvents.value,
      activeOrganizers: activeOrganizers.value,
      runningEvents: runningEvents.value,
      ticketsSold: ticketsSold.value,
      totalUsers: totalUsers.value,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      pendingApproval: 0,
      activeOrganizers: 0,
      runningEvents: 0,
      ticketsSold: 0,
      totalUsers: 0,
    };
  }
}

export async function getRecentEvents() {
  try {
    const data = await db.query.event.findMany({
      limit: 4,
      orderBy: (event, { desc }) => [desc(event.dibuatPada)],
    });

    return data;
  } catch (error) {
    console.error("Error fetching recent events:", error);
    return [];
  }
}

export async function getMonthlyGrowth() {
  try {
    // Ambil data 12 bulan terakhir
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);

    // 1. Data Event Baru per Bulan
    const eventData = await db
      .select({
        month: sql<string>`TO_CHAR(${event.dibuatPada}, 'Mon')`,
        monthNum: sql<number>`EXTRACT(MONTH FROM ${event.dibuatPada})`,
        count: count(),
      })
      .from(event)
      .where(gte(event.dibuatPada, twelveMonthsAgo))
      .groupBy(sql`TO_CHAR(${event.dibuatPada}, 'Mon')`, sql`EXTRACT(MONTH FROM ${event.dibuatPada})`)
      .orderBy(sql`EXTRACT(MONTH FROM ${event.dibuatPada})`);

    // 2. Data Pendaftaran Baru per Bulan
    const registrationData = await db
      .select({
        month: sql<string>`TO_CHAR(${pendaftaran.dibuatPada}, 'Mon')`,
        monthNum: sql<number>`EXTRACT(MONTH FROM ${pendaftaran.dibuatPada})`,
        count: count(),
      })
      .from(pendaftaran)
      .where(and(gte(pendaftaran.dibuatPada, twelveMonthsAgo), eq(pendaftaran.status, 'terdaftar')))
      .groupBy(sql`TO_CHAR(${pendaftaran.dibuatPada}, 'Mon')`, sql`EXTRACT(MONTH FROM ${pendaftaran.dibuatPada})`)
      .orderBy(sql`EXTRACT(MONTH FROM ${pendaftaran.dibuatPada})`);

    // 3. Data Pendapatan per Bulan
    const revenueData = await db
      .select({
        month: sql<string>`TO_CHAR(${transaksi.dibuatPada}, 'Mon')`,
        total: sql<number>`SUM(${transaksi.totalHarga})`,
      })
      .from(transaksi)
      .where(and(gte(transaksi.dibuatPada, twelveMonthsAgo), eq(transaksi.status, 'success')))
      .groupBy(sql`TO_CHAR(${transaksi.dibuatPada}, 'Mon')`);

    // Format data untuk Recharts - Mulai dari JAN sampai DES
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];
    const fullYear = [];
    
    for (let i = 0; i < 12; i++) {
      const mName = monthNames[i];
      
      const foundEvent = eventData.find((item: any) => {
        // Handle conversion from 'May' to 'MEI' etc if needed, but the query returns 'Mon'
        // For simplicity, we compare based on monthNum if available, but let's use the name mapping
        const dbMonth = item.month?.toUpperCase();
        const map: Record<string, string> = {
          'JAN': 'JAN', 'FEB': 'FEB', 'MAR': 'MAR', 'APR': 'APR', 'MAY': 'MEI', 'JUN': 'JUN',
          'JUL': 'JUL', 'AUG': 'AGU', 'SEP': 'SEP', 'OCT': 'OKT', 'NOV': 'NOV', 'DEC': 'DES'
        };
        return map[dbMonth] === mName || dbMonth === mName;
      });

      const foundReg = registrationData.find((item: any) => {
        const dbMonth = item.month?.toUpperCase();
        const map: Record<string, string> = {
          'JAN': 'JAN', 'FEB': 'FEB', 'MAR': 'MAR', 'APR': 'APR', 'MAY': 'MEI', 'JUN': 'JUN',
          'JUL': 'JUL', 'AUG': 'AGU', 'SEP': 'SEP', 'OCT': 'OKT', 'NOV': 'NOV', 'DEC': 'DES'
        };
        return map[dbMonth] === mName || dbMonth === mName;
      });

      const foundRev = revenueData.find((item: any) => {
        const dbMonth = item.month?.toUpperCase();
        const map: Record<string, string> = {
          'JAN': 'JAN', 'FEB': 'FEB', 'MAR': 'MAR', 'APR': 'APR', 'MAY': 'MEI', 'JUN': 'JUN',
          'JUL': 'JUL', 'AUG': 'AGU', 'SEP': 'SEP', 'OCT': 'OKT', 'NOV': 'NOV', 'DEC': 'DES'
        };
        return map[dbMonth] === mName || dbMonth === mName;
      });
      
      fullYear.push({
        name: mName,
        count: foundEvent ? Math.round(Number(foundEvent.count)) : 0,
        registrations: foundReg ? Math.round(Number(foundReg.count)) : 0,
        revenue: foundRev ? Math.round(Number(foundRev.total)) : 0,
        trend: foundEvent ? Math.round(Number(foundEvent.count) * 0.8) : 0,
      });
    }

    return fullYear;
  } catch (error) {
    console.error("Error fetching monthly growth:", error);
    return [];
  }
}