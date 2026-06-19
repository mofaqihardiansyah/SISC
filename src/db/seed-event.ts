import { db } from "./index";
import { event, profilPenyelenggara, tag, eventTag, jadwalEvent, logAdmin, pembicara, infoPembayaran } from "./schema";
import { eq } from "drizzle-orm";
import { SEED } from "@/lib/constants";

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function futureDate(daysFromNow: number) {
  return new Date(Date.now() + daysFromNow * 86400000);
}

const DEFAULT_TERMS = `1. Peserta wajib melakukan registrasi melalui website SISC.
2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.
3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.
4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.
5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.
6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.
7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.
8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.`;

const eventsData = [
  // === SEMINARS (Professional) ===
  {
    id: 1, organizerId: 2, kategoriId: 1, kotaId: 2,
    judul: "Seminar Nasional Transformasi Digital di Era Industri 5.0", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: true, status: "published" as const, kuota: 300,
    urlBanner: "https://picsum.photos/seed/event1/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar nasional membahas strategi adaptasi industri dalam menyongsong revolusi industri 5.0 yang berfokus pada kolaborasi manusia-mesin.",
    detailLokasi: "Auditorium Utama, Polines, Semarang",
    tanggalMulai: futureDate(30), tanggalSelesai: futureDate(30), batasRegistrasi: futureDate(28),
    namaKontak: "Panitia Seminar", emailKontak: "seminar@polines.ac.id", teleponKontak: "024-7473417",
    jumlahTayangan: 1250, namaPembicara: "Dr. Eng. Ahmad Zaki", peranPembicara: "Industry 5.0 Specialist",
    urlFotoPembicara: "https://picsum.photos/seed/speaker1/400/400"
  },
  {
    id: 2, organizerId: 2, kategoriId: 4, kotaId: 11,
    judul: "Seminar Strategi Pemasaran Digital untuk UMKM Berdaya Saing", jenisEvent: "seminar" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "paid" as const, harga: 150000,
    eventPolines: false, status: "published" as const, kuota: 200,
    urlBanner: "https://picsum.photos/seed/event2/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar mendalam mengenai teknik pemasaran digital, optimasi media sosial, dan branding untuk meningkatkan skala bisnis UMKM.",
    detailLokasi: "Grand Ballroom, Jakarta",
    tanggalMulai: futureDate(45), tanggalSelesai: futureDate(45), batasRegistrasi: futureDate(40),
    namaKontak: "UMKM Center", emailKontak: "info@umkmcenter.id", teleponKontak: "021-5551234",
    jumlahTayangan: 2800, namaPembicara: "Denny Santoso", peranPembicara: "Digital Marketing Mentor",
    urlFotoPembicara: "https://picsum.photos/seed/speaker2/400/400"
  },
  {
    id: 3, organizerId: 2, kategoriId: 5, kotaId: 3,
    judul: "Seminar Global Health Summit: Health Tech Innovation", jenisEvent: "seminar" as const,
    tipePlatform: "online" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: false, status: "published" as const, kuota: 1000,
    urlBanner: "https://picsum.photos/seed/event3/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Membahas inovasi teknologi kesehatan terkini, mulai dari telemedicine hingga pemanfaatan AI dalam diagnosis medis.",
    detailLokasi: "Zoom Virtual Event",
    tanggalMulai: futureDate(60), tanggalSelesai: futureDate(60), batasRegistrasi: futureDate(58),
    namaKontak: "Global Health Alliance", emailKontak: "summit@health.org", teleponKontak: "031-8888999",
    jumlahTayangan: 4500, namaPembicara: "dr. Tirta", peranPembicara: "Health Influencer & Doctor",
    urlFotoPembicara: "https://picsum.photos/seed/speaker3/400/400"
  },

  // === CONFERENCES (Professional) ===
  {
    id: 4, organizerId: 2, kategoriId: 1, kotaId: 2,
    judul: "International Conference on Artificial Intelligence and Robotics 2026", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 500000,
    eventPolines: true, status: "published" as const, kuota: 500,
    urlBanner: "https://picsum.photos/seed/event4/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Konferensi internasional tahunan yang mengundang peneliti, akademisi, dan praktisi AI serta robotika dari seluruh dunia.",
    detailLokasi: "Gedung Pusat Informasi, Polines",
    tanggalMulai: futureDate(90), tanggalSelesai: futureDate(92), batasRegistrasi: futureDate(80),
    namaKontak: "Conference Chair", emailKontak: "conference@polines.ac.id", teleponKontak: "024-7473426",
    jumlahTayangan: 3200, namaPembicara: "Prof. Andrew Ng", peranPembicara: "AI Professor at Stanford",
    urlFotoPembicara: "https://picsum.photos/seed/speaker4/400/400"
  },
  {
    id: 5, organizerId: 2, kategoriId: 4, kotaId: 3,
    judul: "World Economic Forum: Future of Sustainable Finance", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 750000,
    eventPolines: false, status: "published" as const, kuota: 300,
    urlBanner: "https://picsum.photos/seed/event5/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Membahas masa depan keuangan berkelanjutan dan peran ESG (Environmental, Social, and Governance) dalam ekonomi global.",
    detailLokasi: "Shangri-La Hotel, Surabaya",
    tanggalMulai: futureDate(120), tanggalSelesai: futureDate(122), batasRegistrasi: futureDate(110),
    namaKontak: "Economic Board", emailKontak: "events@wef.org", teleponKontak: "031-77665544",
    jumlahTayangan: 5000, namaPembicara: "Sri Mulyani Indrawati", peranPembicara: "Minister of Finance RI",
    urlFotoPembicara: "https://picsum.photos/seed/speaker5/400/400"
  },
  {
    id: 6, organizerId: 2, kategoriId: 11, kotaId: 12,
    judul: "International Symposium on Renewable Energy and Climate Change", jenisEvent: "conference" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "paid" as const, harga: 300000,
    eventPolines: false, status: "published" as const, kuota: 400,
    urlBanner: "https://picsum.photos/seed/event6/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Symposium riset inovasi energi terbarukan dan mitigasi perubahan iklim global.",
    detailLokasi: "Menara BCA Grand Indonesia, Jakarta",
    tanggalMulai: futureDate(150), tanggalSelesai: futureDate(152), batasRegistrasi: futureDate(140),
    namaKontak: "Energy Institute", emailKontak: "symposium@energy.id", teleponKontak: "021-99887766",
    jumlahTayangan: 2100, namaPembicara: "Dr. Eng. Masribah", peranPembicara: "Renewable Energy Researcher",
    urlFotoPembicara: "https://picsum.photos/seed/speaker6/400/400"
  }
];

async function seedEventsTable() {
  console.log("🚀 Seeding professional events...");
  for (const e of eventsData) {
    const s = slug(e.judul);
    
    const { namaPembicara, peranPembicara, urlFotoPembicara, ...eventDataRaw } = e;

    const values = {
      ...eventDataRaw,
      slug: s,
      satuAkunSatuTransaksi: false,
      hasilScraping: false,
      dibuatPada: new Date(),
    };

    await db.insert(event).values(values).onConflictDoUpdate({
      target: event.slug,
      set: {
        judul: e.judul,
        status: e.status,
        harga: e.harga,
        urlBanner: e.urlBanner,
        syaratDanKetentuan: e.syaratDanKetentuan,
        jenisEvent: e.jenisEvent,
        kategoriId: e.kategoriId,
        kuota: e.kuota,
      }
    });

    await db.delete(pembicara).where(eq(pembicara.eventId, e.id));
    await db.insert(pembicara).values({
      eventId: e.id,
      nama: namaPembicara,
      peran: peranPembicara,
      urlFoto: urlFotoPembicara,
    });
  }
  console.log("✅ Professional events seeded!");
}

async function seedAuxiliary() {
  console.log("🚀 Seeding auxiliary event data...");
  await db.delete(infoPembayaran);
  await db.insert(infoPembayaran).values([
    { id: 1, tipe: 'bank_transfer', namaBank: 'Bank Mandiri', nomorRekening: '132-000-1234-567', pemilikRekening: 'Panitia POLIVENTS' },
    { id: 2, tipe: 'qris', urlGambarQris: 'https://picsum.photos/seed/qris/400/400' }
  ]);

  await db.insert(profilPenyelenggara).values({
    userId: 2, namaInstansi: "Politeknik Negeri Semarang", deskripsiInstansi: "Perguruan tinggi vokasi terkemuka.",
  }).onConflictDoUpdate({
    target: profilPenyelenggara.userId,
    set: { namaInstansi: "Politeknik Negeri Semarang" }
  });
}

export async function seedEvent() {
  const start = Date.now();
  console.log("📦 [EVENT] Seeding events...\n");
  await seedEventsTable();
  await seedAuxiliary();
  console.log(`\n✅ [EVENT] Done in ${((Date.now() - start) / 1000).toFixed(2)}s`);
}
