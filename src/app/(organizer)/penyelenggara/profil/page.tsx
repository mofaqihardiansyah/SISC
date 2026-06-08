import React from 'react';
import { db } from "@/db";
import { profilPenyelenggara, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProfilForm from './profil-form';

export default async function ProfilPenyelenggaraPage() {
  // 1. Menggabungkan tabel profil_penyelenggara dengan tabel users berdasarkan user_id
  const rows = await db
    .select({
      id: profilPenyelenggara.id,
      userId: profilPenyelenggara.userId,
      namaInstansi: profilPenyelenggara.namaInstansi,
      deskripsiInstansi: profilPenyelenggara.deskripsiInstansi,
      websiteUrl: profilPenyelenggara.websiteUrl,
      dokumenLegalitasUrl: profilPenyelenggara.dokumenLegalitasUrl,
      // Data dari tabel users:
      namaLengkap: users.namaLengkap,
      email: users.email,
      nomorTelepon: users.nomorTelepon,
      avatarUrl: users.avatarUrl,
    })
    .from(profilPenyelenggara)
    .innerJoin(users, eq(profilPenyelenggara.userId, users.id))
    .where(eq(profilPenyelenggara.id, 1))
    .limit(1);

  // Ambil data baris gabungan pertama
  const dataProfil = rows[0];

  const initialData = {
    avatarUrl: dataProfil?.avatarUrl || null,
    namaInstansi: dataProfil?.namaInstansi || null,
    deskripsiInstansi: dataProfil?.deskripsiInstansi || null,
    websiteUrl: dataProfil?.websiteUrl || null,
    email: dataProfil?.email || null,
    nomorTelepon: dataProfil?.nomorTelepon || null,
    dokumenLegalitasUrl: dataProfil?.dokumenLegalitasUrl || null,
    isApproved: true,
  };

  return <ProfilForm initialData={initialData} />;
}