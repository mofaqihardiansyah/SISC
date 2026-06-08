import { db } from "./index";
import { kota } from "./schema";

export async function seedKota() {
  const data = [
    { "id": 1, "provinsiId": 1, "nama": "Banda Aceh" },
    { "id": 2, "provinsiId": 14, "nama": "Semarang" },
    { "id": 3, "provinsiId": 16, "nama": "Surabaya" },
    { "id": 4, "provinsiId": 12, "nama": "Bandung" },
    { "id": 5, "provinsiId": 15, "nama": "Yogyakarta" },
    { "id": 6, "provinsiId": 2, "nama": "Medan" },
    { "id": 7, "provinsiId": 27, "nama": "Makassar" },
    { "id": 8, "provinsiId": 7, "nama": "Palembang" },
    { "id": 9, "provinsiId": 23, "nama": "Balikpapan" },
    { "id": 10, "provinsiId": 17, "nama": "Denpasar" },
    { "id": 11, "provinsiId": 11, "nama": "Jakarta Pusat" },
    { "id": 12, "provinsiId": 11, "nama": "Jakarta Selatan" },
    { "id": 13, "provinsiId": 11, "nama": "Jakarta Timur" },
    { "id": 14, "provinsiId": 11, "nama": "Jakarta Barat" },
    { "id": 15, "provinsiId": 11, "nama": "Jakarta Utara" },
    { "id": 16, "provinsiId": 3, "nama": "Padang" },
    { "id": 17, "provinsiId": 4, "nama": "Pekanbaru" },
    { "id": 18, "provinsiId": 5, "nama": "Batam" },
    { "id": 19, "provinsiId": 6, "nama": "Jambi" },
    { "id": 20, "provinsiId": 8, "nama": "Pangkalpinang" },
    { "id": 21, "provinsiId": 9, "nama": "Bengkulu" },
    { "id": 22, "provinsiId": 10, "nama": "Bandar Lampung" },
    { "id": 23, "provinsiId": 12, "nama": "Bekasi" },
    { "id": 24, "provinsiId": 12, "nama": "Depok" },
    { "id": 25, "provinsiId": 12, "nama": "Bogor" },
    { "id": 26, "provinsiId": 13, "nama": "Serang" },
    { "id": 27, "provinsiId": 13, "nama": "Tangerang" },
    { "id": 28, "provinsiId": 14, "nama": "Surakarta" },
    { "id": 29, "provinsiId": 16, "nama": "Malang" },
    { "id": 30, "provinsiId": 18, "nama": "Mataram" },
    { "id": 31, "provinsiId": 19, "nama": "Kupang" },
    { "id": 32, "provinsiId": 20, "nama": "Pontianak" },
    { "id": 33, "provinsiId": 21, "nama": "Palangkaraya" },
    { "id": 34, "provinsiId": 22, "nama": "Banjarmasin" },
    { "id": 35, "provinsiId": 23, "nama": "Samarinda" },
    { "id": 36, "provinsiId": 24, "nama": "Tarakan" },
    { "id": 37, "provinsiId": 25, "nama": "Manado" },
    { "id": 38, "provinsiId": 26, "nama": "Palu" },
    { "id": 39, "provinsiId": 28, "nama": "Kendari" },
    { "id": 40, "provinsiId": 29, "nama": "Gorontalo" },
    { "id": 41, "provinsiId": 30, "nama": "Mamuju" },
    { "id": 42, "provinsiId": 31, "nama": "Ambon" },
    { "id": 43, "provinsiId": 32, "nama": "Ternate" },
    { "id": 44, "provinsiId": 33, "nama": "Jayapura" },
    { "id": 45, "provinsiId": 34, "nama": "Manokwari" },
    { "id": 46, "provinsiId": 35, "nama": "Merauke" },
    { "id": 47, "provinsiId": 36, "nama": "Nabire" },
    { "id": 48, "provinsiId": 37, "nama": "Wamena" },
    { "id": 49, "provinsiId": 38, "nama": "Sorong" }
  ];

  console.log("🚀 Seeding kota...");
  for (const item of data) {
    await db.insert(kota).values(item).onConflictDoUpdate({
      target: kota.id,
      set: item
    });
  }
  console.log("✅ Kota seeded!");
}