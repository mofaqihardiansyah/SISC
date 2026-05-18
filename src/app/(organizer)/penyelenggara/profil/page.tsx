import React from 'react';
import { db } from "@/db";
import { users, profilPenyelenggara } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ProfilForm from './profil-form';

export const dynamic = 'force-dynamic';

export default async function ProfilPenyelenggaraPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  
  const userId = parseInt(session.user.id, 10);
  
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) redirect("/login");
  
  const [profil] = await db.select().from(profilPenyelenggara).where(eq(profilPenyelenggara.userId, userId));
  
  const initialData = {
    avatarUrl: user.avatarUrl,
    namaInstansi: profil?.namaInstansi || user.institution || "",
    deskripsiInstansi: profil?.deskripsiInstansi || "",
    websiteUrl: profil?.websiteUrl || "",
    email: user.email,
    nomorTelepon: user.nomorTelepon || "",
    dokumenLegalitasUrl: profil?.dokumenLegalitasUrl || "",
    isTerverifikasi: user.isTerverifikasi || false,
  };

  return <ProfilForm initialData={initialData} />;
}