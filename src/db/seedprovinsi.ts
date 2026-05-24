import 'dotenv/config';
import { db } from "./index";
import { provinsi } from "./schema";

export async function seedProvinsi() {
  console.log("🚀 Seeding provinsi...");

  const dataProvinsi = [
    { id: 1, nama: "Aceh" },
    { id: 2, nama: "Sumatera Utara" },
    { id: 3, nama: "Sumatera Barat" },
    { id: 4, nama: "Riau" },
    { id: 5, nama: "Kepulauan Riau" },
    { id: 6, nama: "Jambi" },
    { id: 7, nama: "Sumatera Selatan" },
    { id: 8, nama: "Kepulauan Bangka Belitung" },
    { id: 9, nama: "Bengkulu" },
    { id: 10, nama: "Lampung" },
    { id: 11, nama: "DKI Jakarta" },
    { id: 12, nama: "Jawa Barat" },
    { id: 13, nama: "Banten" },
    { id: 14, nama: "Jawa Tengah" },
    { id: 15, nama: "DI Yogyakarta" },
    { id: 16, nama: "Jawa Timur" },
    { id: 17, nama: "Bali" },
    { id: 18, nama: "Nusa Tenggara Barat" },
    { id: 19, nama: "Nusa Tenggara Timur" },
    { id: 20, nama: "Kalimantan Barat" },
    { id: 21, nama: "Kalimantan Tengah" },
    { id: 22, nama: "Kalimantan Selatan" },
    { id: 23, nama: "Kalimantan Timur" },
    { id: 24, nama: "Kalimantan Utara" },
    { id: 25, nama: "Sulawesi Utara" },
    { id: 26, nama: "Sulawesi Tengah" },
    { id: 27, nama: "Sulawesi Selatan" },
    { id: 28, nama: "Sulawesi Tenggara" },
    { id: 29, nama: "Gorontalo" },
    { id: 30, nama: "Sulawesi Barat" },
    { id: 31, nama: "Maluku" },
    { id: 32, nama: "Maluku Utara" },
    { id: 33, nama: "Papua" },
    { id: 34, nama: "Papua Barat" },
    { id: 35, nama: "Papua Selatan" },
    { id: 36, nama: "Papua Tengah" },
    { id: 37, nama: "Papua Pegunungan" },
    { id: 38, nama: "Papua Barat Daya" },
  ];

  for (const p of dataProvinsi) {
    await db.insert(provinsi).values(p).onConflictDoUpdate({
        target: provinsi.id,
        set: { nama: p.nama }
    });
  }

  console.log("✅ Berhasil seed provinsi!");
}

