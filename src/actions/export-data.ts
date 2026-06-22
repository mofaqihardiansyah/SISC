'use server';

import { db } from "@/db";
import { event, users, profilPenyelenggara, pendaftaran, peserta, paperSubmission, kategori } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { auth } from "@/auth";

export async function getAdminExportData() {
  const session = await auth();
  if (session?.user?.role !== 'admin') throw new Error("Unauthorized");

  const [totalEvents, totalUsers, totalOrganizers, totalRegistrations] = await Promise.all([
    db.select({ value: count() }).from(event),
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(profilPenyelenggara),
    db.select({ value: count() }).from(pendaftaran),
  ]);

  const eventsByStatus = await db.select({ status: event.status, count: count() }).from(event).groupBy(event.status);
  const usersByRole = await db.select({ role: users.role, count: count() }).from(users).groupBy(users.role);

  const allEvents = await db.select().from(event).orderBy(desc(event.tanggalMulai)).limit(1000);
  const allUsers = await db.select().from(users).orderBy(desc(users.dibuatPada)).limit(1000);
  const allPendaftaran = await db.select().from(pendaftaran).orderBy(desc(pendaftaran.dibuatPada)).limit(1000);
  const allKategori = await db.select().from(kategori);

  return {
    stats: {
      totalEvents: totalEvents[0]?.value ?? 0,
      totalUsers: totalUsers[0]?.value ?? 0,
      totalOrganizers: totalOrganizers[0]?.value ?? 0,
      totalRegistrations: totalRegistrations[0]?.value ?? 0,
    },
    eventsByStatus,
    usersByRole,
    allEvents,
    allUsers,
    allPendaftaran,
    allKategori,
  };
}

export async function getOrganizerExportData() {
  const session = await auth();
  if (session?.user?.role !== 'organizer') throw new Error("Unauthorized");
  const userId = parseInt(session.user.id!);

  const [myEvents, myPendaftaran, myPeserta, myPapers] = await Promise.all([
    db.select().from(event).where(eq(event.organizerId, userId)).orderBy(desc(event.tanggalMulai)).limit(1000),
    db.select({
      p: pendaftaran,
      e: { judul: event.judul },
    }).from(pendaftaran).innerJoin(event, eq(pendaftaran.eventId, event.id)).where(eq(event.organizerId, userId)).orderBy(desc(pendaftaran.dibuatPada)).limit(1000),
    db.select({
      p: peserta,
      e: { judul: event.judul },
    }).from(peserta).innerJoin(pendaftaran, eq(peserta.pendaftaranId, pendaftaran.id)).innerJoin(event, eq(pendaftaran.eventId, event.id)).where(eq(event.organizerId, userId)).orderBy(desc(peserta.dibuatPada)).limit(1000),
    db.select().from(paperSubmission).innerJoin(event, eq(paperSubmission.eventId, event.id)).where(eq(event.organizerId, userId)).limit(500),
  ]);

  return { myEvents, myPendaftaran, myPeserta, myPapers };
}
