import React from 'react';
import { db } from "@/db";
import { provinsi, kota } from "@/db/schema"; 
import { eq } from "drizzle-orm";
import LocationClient from './LocationClient';
import { SITE } from "@/lib/constants";

export const dynamic = 'force-dynamic';



export const metadata = {
  title: `Master Wilayah | Admin Dashboard`,
  description: `Kelola cakupan wilayah operasional provinsi dan kota pelaksanaan event ${SITE.NAME}.`,
};

export default async function MasterLocationsPage() {
  const dataProvinsi = await db.select().from(provinsi) || [];

  const dataKota = await db
    .select({
      id: kota.id,
      namaKota: kota.nama,
      provinsiId: kota.provinsiId,
      namaProvinsi: provinsi.nama,
    })
    .from(kota)
    .leftJoin(provinsi, eq(kota.provinsiId, provinsi.id)) || [];

  return (
    <LocationClient 
      initialProvinsi={dataProvinsi}
      initialKota={dataKota}
    />
  );
}