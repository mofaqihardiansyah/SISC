import { db } from "./index";
import { kategori } from "./schema";

async function main() {
  const data = [
  {
    "id": 1,
    "nama": "IT & Software",
    "slug": "it-software",
    "iconUrl": "/icon/IT.png"
  },
  {
    "id": 2,
    "nama": "Bisnis",
    "slug": "bisnis",
    "iconUrl": "/icon/Bisnis.png"
  },
  {
    "id": 3,
    "nama": "Desain",
    "slug": "desain",
    "iconUrl": "/icon/Desain.png"
  },
  {
    "id": 4,
    "nama": "Kesehatan",
    "slug": "kesehatan",
    "iconUrl": "/icon/Kesehatan.png"
  },
  {
    "id": 5,
    "nama": "Seni & Budaya",
    "slug": "seni-budaya",
    "iconUrl": "/icon/Seni.png"
  },
  {
    "id": 6,
    "nama": "Pendidikan",
    "slug": "pendidikan",
    "iconUrl": "/icon/Pendidikan.png"
  },
  {
    "id": 7,
    "nama": "Gaya Hidup",
    "slug": "gaya-hidup",
    "iconUrl": "/icon/Gaya.png"
  },
  {
    "id": 8,
    "nama": "Teknologi",
    "slug": "teknologi",
    "iconUrl": "/icon/Teknologi.png"
  },
  {
    "id": 9,
    "nama": "Musik",
    "slug": "musik",
    "iconUrl": "/icon/Musik.png"
  },
  {
    "id": 10,
    "nama": "Olahraga",
    "slug": "olahraga",
    "iconUrl": "/icon/Olahraga.png"
  },
  {
    "id": 11,
    "nama": "Hiburan",
    "slug": "hiburan",
    "iconUrl": "/icon/Hiburan.png"
  },
  {
    "id": 12,
    "nama": "Sains",
    "slug": "sains",
    "iconUrl": "/icon/Sains.png"
  }
];

  console.log("🚀 Seeding kategori...");
  for (const item of data) {
    await db.insert(kategori).values(item).onConflictDoUpdate({
      target: kategori.slug,
      set: item
    });
  }
  console.log("✅ Kategori seeded!");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});