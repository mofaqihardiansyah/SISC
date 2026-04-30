import 'dotenv/config';
import { db } from './index';
import { event } from './schema';

async function seedPolinesEvents() {
  console.log("Seeding dummy Event Polines...");
  
  const dummyEvents = [
    {
      judul: "National Robotic Competition: Polines Circuit 2024",
      slug: "national-robotic-competition-2024",
      deskripsi: "Kompetisi robotik tingkat nasional yang diselenggarakan di Polines.",
      bannerUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=2069&auto=format&fit=crop",
      tanggalMulai: new Date("2024-10-24T08:00:00Z"),
      isEventPolines: true,
      harga: 50000,
      tipeHarga: "paid",
      namaKontak: "BEM Polines",
      status: "published"
    },
    {
      judul: "Future of UX/UI Design in AI Era",
      slug: "future-ux-ui-ai-era",
      deskripsi: "Seminar membahas masa depan desain UI/UX di era kecerdasan buatan.",
      bannerUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
      tanggalMulai: new Date("2024-10-25T10:00:00Z"),
      isEventPolines: true,
      harga: 0,
      tipeHarga: "free",
      namaKontak: "Design Collective ID",
      status: "published"
    },
    {
      judul: "Symphony in Blue: Polines Annual Music Night",
      slug: "symphony-in-blue-music-night",
      deskripsi: "Malam puncak perayaan seni musik UKM Musik Polines.",
      bannerUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop",
      tanggalMulai: new Date("2024-10-30T19:00:00Z"),
      isEventPolines: true,
      harga: 35000,
      tipeHarga: "paid",
      namaKontak: "UKM Musik",
      status: "published"
    },
    {
      judul: "Semarang Creative Hub: Weekend Night Market",
      slug: "semarang-creative-hub-night-market",
      deskripsi: "Bazar malam yang penuh kreativitas di kampus.",
      bannerUrl: "https://images.unsplash.com/photo-1533174000265-e8bb626b5278?q=80&w=2069&auto=format&fit=crop",
      tanggalMulai: new Date("2024-10-31T16:00:00Z"),
      isEventPolines: true,
      harga: 0,
      tipeHarga: "free",
      namaKontak: "Kota Kreatif",
      status: "published"
    }
  ];

  for (const evt of dummyEvents) {
    await db.insert(event).values(evt).onConflictDoNothing({ target: event.slug });
  }

  console.log("Seeding selesai!");
  process.exit(0);
}

seedPolinesEvents().catch(err => {
  console.error("Error seeding:", err);
  process.exit(1);
});
