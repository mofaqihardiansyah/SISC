import React from 'react';
import { db } from "@/db";
import { kategori, tag } from "@/db/schema"; 
import CategoryClient from './CategoryClient';

export const dynamic = 'force-dynamic';



export const metadata = {
  title: 'Master Kategori & Tag | Admin Dashboard',
  description: 'Kelola data kategori dan tag klasifikasi event POLIVENTS.',
};

export default async function MasterCategoriesPage() {
  const [dataKategori, dataTag] = await Promise.all([
    db.select().from(kategori),
    db.select().from(tag)
  ]);

  return (
    <CategoryClient 
      initialKategori={dataKategori}
      initialTag={dataTag}
    />
  );
}