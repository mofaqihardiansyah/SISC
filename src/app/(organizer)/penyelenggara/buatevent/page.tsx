import React from 'react';
import { db } from "@/db";
import { kategori, kota, provinsi } from "@/db/schema";
import BuatEventClient from "./BuatEventClient";

export const dynamic = 'force-dynamic';

export default async function BuatEventPage() {
  const [categories, cities, provinces] = await Promise.all([
    db.select().from(kategori).orderBy(kategori.nama),
    db.select().from(kota).orderBy(kota.nama),
    db.select().from(provinsi).orderBy(provinsi.nama),
  ]);

  return <BuatEventClient categories={categories} cities={cities} provinces={provinces} />;
}
