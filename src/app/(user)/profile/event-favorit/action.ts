"use server";

import { db } from "@/db"; 
import { event, kota, kategori } from "@/db/schema"; 
import { eq } from "drizzle-orm";

export const getEvents = async () => {
  try {
    const data = await db
      .select({
        id: event.id,
        judul: event.judul,
        harga: event.harga,
        bannerUrl: event.bannerUrl,
        tanggalMulai: event.tanggalMulai,
        jenisEvent: event.jenisEvent,
        penyelenggara: event.penyelenggara,
        // Ambil kolom nama dari tabel relasi
        // Jika di schema.ts kamu menulisnya 'namaKota', ganti kota.nama jadi kota.namaKota
        namaKota: kota.nama, 
        namaKategori: kategori.nama,
      })
      .from(event)
      // Sesuaikan nama field foreign key di schema.ts (biasanya kotaId atau kota_id)
      .leftJoin(kota, eq(event.kotaId, kota.id)) 
      .leftJoin(kategori, eq(event.kategoriId, kategori.id));

    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};