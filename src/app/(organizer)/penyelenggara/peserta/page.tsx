import React from 'react';
import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import InformasiPesertaClient from "./InformasiPesertaClient";
import { BlockedOrganizerState } from "@/components/penyelenggara/BlockedOrganizerState";

export const dynamic = 'force-dynamic';

export default async function InformasiPesertaPage() {
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
        title="Validasi Peserta Terkunci" 
        description="Anda belum dapat memvalidasi data peserta karena akun penyelenggara Anda saat ini sedang dalam antrean persetujuan verifikasi Admin. Silakan lengkapi profil dan unggah dokumen legalitas Anda." 
      />
    );
  }

  return <InformasiPesertaClient />;
}
