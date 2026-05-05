"use server";

import { db } from "@/db";
import { event, users, peserta, transaksi } from "@/db/schema";
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
      .innerJoin(transaksi, eq(peserta.transaksiId, transaksi.id))
      .where(eq(transaksi.status, 'confirmed'));

    return {
      pendingApproval: pendingEvents.value,
      activeOrganizers: activeOrganizers.value,
      runningEvents: runningEvents.value,
      ticketsSold: ticketsSold.value,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      pendingApproval: 0,
      activeOrganizers: 0,
      runningEvents: 0,
      ticketsSold: 0,
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
    // Ambil data 6 bulan terakhir
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const data = await db
      .select({
        month: sql<string>`TO_CHAR(${event.dibuatPada}, 'Mon')`,
        monthNum: sql<number>`EXTRACT(MONTH FROM ${event.dibuatPada})`,
        count: count(),
      })
      .from(event)
      .where(gte(event.dibuatPada, sixMonthsAgo))
      .groupBy(sql`TO_CHAR(${event.dibuatPada}, 'Mon')`, sql`EXTRACT(MONTH FROM ${event.dibuatPada})`)
      .orderBy(sql`EXTRACT(MONTH FROM ${event.dibuatPada})`);

    // Format data untuk Recharts
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mName = monthNames[d.getMonth()];
      const found = data.find(item => item.month.toUpperCase() === mName);
      
      last6Months.push({
        name: mName,
        count: found ? Number(found.count) : 0,
        trend: found ? Number(found.count) * 0.8 : 0, // Mock trend line based on data
      });
    }

    return last6Months;
  } catch (error) {
    console.error("Error fetching monthly growth:", error);
    return [];
  }
}
