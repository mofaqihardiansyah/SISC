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
        // Tips: Pastikan di schema.ts nama kolomnya 'nama'. 
        // Kalau di Drizzle Studio munculnya 'nama', maka tetap kota.nama
        namaKota: kota.nama, 
        namaKategori: kategori.nama,
      })
      .from(event)
      // Cek apakah di schema.ts kamu pakai 'kotaId' atau 'id_kota'
      .leftJoin(kota, eq(event.kotaId, kota.id)) 
      .leftJoin(kategori, eq(event.kategoriId, kategori.id));

    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};