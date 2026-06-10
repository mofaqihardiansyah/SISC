import React from 'react';
import { db } from "@/db";
import { profilPenyelenggara, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProfilForm from './profil-form';
export const dynamic = 'force-dynamic';


export default async function ProfilPenyelenggaraPage() {
  // 1. Menggabungkan tabel profil_penyelenggara dengan tabel users berdasarkan user_id
  const rows = await db
    .select({
      id: profilPenyelenggara.id,
      userId: profilPenyelenggara.userId,
      namaInstansi: profilPenyelenggara.namaInstansi,
      deskripsiInstansi: profilPenyelenggara.deskripsiInstansi,
      urlWebsite: profilPenyelenggara.urlWebsite,
      urlDokumenLegalitas: profilPenyelenggara.urlDokumenLegalitas,
      // Data dari tabel users:
      namaLengkap: users.namaLengkap,
      email: users.email,
      nomorTelepon: users.nomorTelepon,
      urlAvatar: users.urlAvatar,
    })
    .from(profilPenyelenggara)
    .innerJoin(users, eq(profilPenyelenggara.userId, users.id))
    .where(eq(profilPenyelenggara.id, 1))
    .limit(1);

  // Ambil data baris gabungan pertama
  const dataProfil = rows[0];

  const initialData = {
    urlAvatar: dataProfil?.urlAvatar || null,
    namaInstansi: dataProfil?.namaInstansi || null,
    deskripsiInstansi: dataProfil?.deskripsiInstansi || null,
    urlWebsite: dataProfil?.urlWebsite || null,
    email: dataProfil?.email || null,
    nomorTelepon: dataProfil?.nomorTelepon || null,
    urlDokumenLegalitas: dataProfil?.urlDokumenLegalitas || null,
    disetujui: true,
  };

  return <ProfilForm initialData={initialData} />;
}