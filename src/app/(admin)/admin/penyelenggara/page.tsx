// Lokasi: src/app/(admin)/admin/penyelenggara/page.tsx

import { db } from '@/db';
import { users, profilPenyelenggara } from '@/db/schema';
import { eq, isNull, and } from 'drizzle-orm';
import { ValidasiAksesPenyelenggaraClient } from './ValidasiAksesPenyelenggaraClient';
import type { PenyelenggaraItem } from '@/types/penyelenggara';
export const dynamic = 'force-dynamic';


async function fetchPenyelenggara(): Promise<PenyelenggaraItem[]> {
  const rows = await db
    .select({
      id: users.id,
      namaOrganisasi: profilPenyelenggara.namaInstansi,
      email: users.email,
      noTelepon: users.nomorTelepon,
      disetujui: users.disetujui,
      namaLengkap: users.namaLengkap,
      deskripsiInstansi: profilPenyelenggara.deskripsiInstansi,
      urlDokumenLegalitas: profilPenyelenggara.urlDokumenLegalitas,
      urlWebsite: profilPenyelenggara.urlWebsite,
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
    status: row.disetujui ? 'approved' as const : 'pending' as const,
    namaLengkap: row.namaLengkap ?? '-',
    deskripsiInstansi: row.deskripsiInstansi ?? null,
    urlDokumenLegalitas: row.urlDokumenLegalitas ?? null,
    urlWebsite: row.urlWebsite ?? null,
    dibuatPada: row.dibuatPada ? row.dibuatPada.toISOString() : null,
  }));
}

export default async function PenyelenggaraPage() {
  const data = await fetchPenyelenggara();
  return <ValidasiAksesPenyelenggaraClient initialData={data} />;
}