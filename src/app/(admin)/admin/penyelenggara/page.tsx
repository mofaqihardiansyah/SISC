// Lokasi: src/app/(admin)/admin/penyelenggara/page.tsx

import { db } from '@/db';
import { users, profilPenyelenggara } from '@/db/schema';
import { eq, isNull, and } from 'drizzle-orm';
import { ValidasiAksesPenyelenggaraClient } from './ValidasiAksesPenyelenggaraClient';
import type { PenyelenggaraItem } from '@/types/penyelenggara';

async function fetchPenyelenggara(): Promise<PenyelenggaraItem[]> {
  const rows = await db
    .select({
      id: users.id,
      namaOrganisasi: profilPenyelenggara.namaInstansi,
      email: users.email,
      noTelepon: users.nomorTelepon,
      isApproved: users.isApproved,
      isSuspended: users.isSuspended,
      namaLengkap: users.namaLengkap,
      deskripsiInstansi: profilPenyelenggara.deskripsiInstansi,
      dokumenLegalitasUrl: profilPenyelenggara.dokumenLegalitasUrl,
      websiteUrl: profilPenyelenggara.websiteUrl,
      dibuatPada: users.dibuatPada,
    })
    .from(users)
    .leftJoin(profilPenyelenggara, eq(users.id, profilPenyelenggara.userId))
    .where(and(eq(users.role, 'organizer'), isNull(users.dihapusPada)))
    .orderBy(users.dibuatPada);

  return rows.map((row) => ({
    id: String(row.id).padStart(5, '0'),
    rawId: row.id,
    namaOrganisasi: row.namaOrganisasi ?? '-',
    email: row.email ?? '-',
    noTelepon: row.noTelepon ?? '-',
    status:
      row.isSuspended ? 'rejected' :
      row.isApproved  ? 'approved' :
      'pending',
    namaLengkap: row.namaLengkap ?? '-',
    deskripsiInstansi: row.deskripsiInstansi ?? null,
    dokumenLegalitasUrl: row.dokumenLegalitasUrl ?? null,
    websiteUrl: row.websiteUrl ?? null,
    dibuatPada: row.dibuatPada ? row.dibuatPada.toISOString() : null,
  }));
}

export default async function PenyelenggaraPage() {
  const data = await fetchPenyelenggara();
  return <ValidasiAksesPenyelenggaraClient initialData={data} />;
}