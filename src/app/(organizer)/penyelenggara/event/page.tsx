import React from 'react';
import { db } from "@/db";
import { users, event, pendaftaran } from "@/db/schema";
import { auth } from "@/auth";
import { eq, count } from "drizzle-orm";
import { redirect } from "next/navigation";
import KelolaEventClient from "./KelolaEventClient";
import { BlockedOrganizerState } from "@/components/penyelenggara/BlockedOrganizerState";

export const dynamic = 'force-dynamic';

export default async function KelolaEventPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = parseInt(session.user.id, 10);
  if (isNaN(userId)) redirect("/login");

  const [user] = await db
    .select({ disetujui: users.disetujui })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user?.disetujui) {
    return (
      <BlockedOrganizerState 
        title="Kelola Event Terkunci" 
        description="Anda belum dapat membuat atau mengelola event karena akun penyelenggara Anda saat ini sedang dalam antrean persetujuan verifikasi Admin. Silakan lengkapi profil dan unggah dokumen legalitas Anda." 
      />
    );
  }

  const initialEventsData = await db
    .select({
      id: event.id,
      judul: event.judul,
      status: event.status,
      jenisEvent: event.jenisEvent,
      tipePlatform: event.tipePlatform,
      kuota: event.kuota,
      harga: event.harga,
      tanggalMulai: event.tanggalMulai,
      urlBanner: event.urlBanner,
      alasanPenolakan: event.alasanPenolakan,
      detailLokasi: event.detailLokasi,
      deskripsi: event.deskripsi,
      participantCount: count(pendaftaran.id),
    })
    .from(event)
    .leftJoin(pendaftaran, eq(event.id, pendaftaran.eventId))
    .where(eq(event.organizerId, userId))
    .groupBy(event.id);

  const formattedEvents = initialEventsData.map(ev => ({
    ...ev,
    participantCount: Number(ev.participantCount || 0)
  }));

  return <KelolaEventClient initialEvents={formattedEvents as any} />;
}