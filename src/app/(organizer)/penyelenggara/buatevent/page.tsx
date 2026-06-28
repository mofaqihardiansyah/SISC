import React from 'react';
import { db } from "@/db";
import { event, kategori, kota, provinsi } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import BuatEventClient from "./BuatEventClient";

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ edit?: string }>;
};

export default async function BuatEventPage({ searchParams }: Props) {
  const [categories, cities, provinces] = await Promise.all([
    db.select().from(kategori).orderBy(kategori.nama),
    db.select().from(kota).orderBy(kota.nama),
    db.select().from(provinsi).orderBy(provinsi.nama),
  ]);

  const { edit } = await searchParams;
  let initialData = null;

  if (edit) {
    const editId = Number(edit);
    if (!isNaN(editId)) {
      const detailEvent = await db.query.event.findFirst({
        where: eq(event.id, editId),
        with: { kota: true, pembicara: true },
      });
      if (detailEvent && detailEvent.status === "draft") {
        initialData = detailEvent;
      } else if (!detailEvent) {
        notFound();
      }
    }
  }

  return <BuatEventClient categories={categories} cities={cities} provinces={provinces} initialData={initialData} />;
}
