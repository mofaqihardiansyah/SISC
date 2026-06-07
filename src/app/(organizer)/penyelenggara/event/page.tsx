import React from 'react';
import { db } from "@/db";
import { users, event } from "@/db/schema"; // Diubah dari 'events' menjadi 'event'
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import KelolaEventClient from "./KelolaEventClient";
import { BlockedOrganizerState } from "@/components/penyelenggara/BlockedOrganizerState";

export const dynamic = 'force-dynamic';

export default async function KelolaEventPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = parseInt(session.user.id, 10);
  if (isNaN(userId)) redirect("/login");

  // Ambil status verifikasi user
  const [user] = await db
    .select({ isApproved: users.isApproved })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user?.isApproved) {
    return (
      <BlockedOrganizerState 
        title="Kelola Event Terkunci" 
        description="Anda belum dapat membuat atau mengelola event karena akun penyelenggara Anda saat ini sedang dalam antrean persetujuan verifikasi Admin. Silakan lengkapi profil dan unggah dokumen legalitas Anda." 
      />
    );
  }

  // Ambil daftar event milik penyelenggara dari tabel 'event'
  const initialEventsData = await db
    .select()
    .from(event) // Menggunakan 'event'
    .where(eq(event.organizerId, userId));

  // Berikan tipe any[] sementara ke props untuk menghindari konflik tipe schema Drizzle vs UI state
  return <KelolaEventClient initialEvents={initialEventsData as any[]} />;
}