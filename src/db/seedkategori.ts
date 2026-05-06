import { db } from "./index";
import { kategori } from "./schema";

async function main() {
  const data = [
    {
      "id": 1,
      "nama": "Teknologi & Informasi",
      "slug": "teknologi-informasi",
      "iconUrl": "/icon/Teknologi.png"
    },
    {
      "id": 2,
      "nama": "Bisnis & Ekonomi",
      "slug": "bisnis-ekonomi",
      "iconUrl": "/icon/Bisnis.png"
    },
    {
      "id": 3,
      "nama": "Kreatif & Desain",
      "slug": "kreatif-desain",
      "iconUrl": "/icon/Desain.png"
    },
    {
      "id": 4,
      "nama": "Sains & Akademik",
      "slug": "sains-akademik",
      "iconUrl": "/icon/Sains.png"
    },
    {
      "id": 5,
      "nama": "Kesehatan & Medis",
      "slug": "kesehatan-medis",
      "iconUrl": "/icon/Kesehatan.png"
    },
    {
      "id": 6,
      "nama": "Sosial & Humaniora",
      "slug": "sosial-humaniora",
      "iconUrl": "/icon/Pendidikan.png"
    },
    {
      "id": 7,
      "nama": "Seni, Musik & Budaya",
      "slug": "seni-musik-budaya",
      "iconUrl": "/icon/Seni.png"
    },
    {
      "id": 8,
      "nama": "Hiburan & Gaya Hidup",
      "slug": "hiburan-gaya-hidup",
      "iconUrl": "/icon/Gaya.png"
    },
    {
      "id": 9,
      "nama": "Olahraga & Kebugaran",
      "slug": "olahraga-kebugaran",
      "iconUrl": "/icon/Olahraga.png"
    },
    {
      "id": 10,
      "nama": "Umum",
      "slug": "umum",
      "iconUrl": "/icon/Hiburan.png"
    }
  ];

  console.log("🚀 Seeding 10 kategori baru...");
  for (const item of data) {
    await db.insert(kategori).values(item).onConflictDoUpdate({
      target: kategori.slug,
      set: item
    });
  }
  console.log("✅ 10 Kategori seeded!");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});