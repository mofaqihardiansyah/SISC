import React from 'react';
import { db } from "@/db";
import { kategori, kota } from "@/db/schema";
import BuatEventClient from "./BuatEventClient";

export const dynamic = 'force-dynamic';

export default async function BuatEventPage() {
  const [categories, cities] = await Promise.all([
    db.select().from(kategori).orderBy(kategori.nama),
    db.select().from(kota).orderBy(kota.nama),
  ]);

  return <BuatEventClient categories={categories} cities={cities} />;
}
