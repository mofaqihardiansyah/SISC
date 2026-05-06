import { db } from "./index";
import { kota } from "./schema";

async function main() {
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
  { "id": 12, "provinsiId": 11, "nama": "Jakarta Selatan" }
];

  console.log("🚀 Seeding kota...");
  for (const item of data) {
    await db.insert(kota).values(item).onConflictDoUpdate({
      target: kota.id,
      set: item
    });
  }
  console.log("✅ Kota seeded!");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});