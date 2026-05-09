import 'dotenv/config';
import { db } from './index';
import { users, bookmark, pendaftaran, peserta, paperSubmission, event } from './schema';
import { eq } from 'drizzle-orm';

async function seedProfileDemo() {
  console.log("🚀 Memulai proses seeding data demo profil...");

  // 1. Cari User "Pengunjung"
  const visitor = await db.query.users.findFirst({
    where: eq(users.email, "visitor@gmail.com")
  });

  if (!visitor) {
    console.error("❌ User 'visitor@gmail.com' tidak ditemukan. Jalankan seed-users.ts dulu!");
    process.exit(1);
  }

  const userId = visitor.id;
  console.log(`👤 Menemukan User: ${visitor.namaLengkap} (ID: ${userId})`);

  // 2. SEED BOOKMARKS (Event Favorit)
  // Kita ambil event ID 1, 3, dan 8
  const favoriteEventIds = [1, 3, 8];
  console.log("⭐ Seeding Bookmarks...");
  for (const eventId of favoriteEventIds) {
    await db.insert(bookmark).values({
      userId,
      eventId,
    }).onConflictDoNothing();
  }

  // 3. SEED PENDAFTARAN (Eventku)
  // Kita daftarkan ke Event ID 5 (Smart Campus) dan 11 (E-Sports)
  const registrationEvents = [
    { id: 5, kode: 'REG-SC-001' },
    { id: 11, kode: 'REG-ES-002' }
  ];

  console.log("🎟️ Seeding Pendaftaran & Peserta...");
  for (const reg of registrationEvents) {
    // Cek dulu apakah sudah terdaftar
    const existingReg = await db.query.pendaftaran.findFirst({
      where: (p, { and, eq }) => and(eq(p.userId, userId), eq(p.eventId, reg.id))
    });

    let pendaftaranId: number;

    if (!existingReg) {
      const newReg = await db.insert(pendaftaran).values({
        userId,
        eventId: reg.id,
        kodePendaftaran: reg.kode,
        status: 'terdaftar',
      }).returning({ id: pendaftaran.id });
      pendaftaranId = newReg[0].id;

      // Tambahkan detail peserta
      await db.insert(peserta).values({
        pendaftaranId,
        kodePeserta: `PS-${reg.kode}`,
        namaLengkap: visitor.namaLengkap,
        email: visitor.email,
        nomorTelepon: visitor.nomorTelepon,
        jenisKelamin: visitor.jenisKelamin || 'Laki-laki',
      });
    }
  }

  // 4. SEED PAPER SUBMISSIONS (Submit Paper)
  const papers = [
    {
      eventId: 5, // Smart Campus (Conference)
      judul: "Implementasi IoT untuk Monitoring Parkir Cerdas di Area Kampus Polines",
      penulis: "Ahmad Rizki, Siti Nurhaliza, Budi Santoso",
      fileUrl: "/uploads/papers/paper-iot-campus.pdf",
      status: "accepted"
    },
    {
      eventId: 2, // Cybersecurity (Conference)
      judul: "Analisis Kerentanan SQL Injection pada Aplikasi Web Berbasis Node.js",
      penulis: "Ahmad Rizki, Sarah Connor",
      fileUrl: "/uploads/papers/paper-cybersec.pdf",
      status: "review"
    },
    {
      eventId: 14, // Ethical Hacking (Conference)
      judul: "Metodologi Penetration Testing pada Infrastruktur Cloud Hybrid",
      penulis: "Ahmad Rizki, Jim Geovedi",
      fileUrl: "/uploads/papers/paper-hacking.pdf",
      status: "rejected",
      komentarPenolakan: "Metodologi yang diajukan kurang detail pada bagian mitigasi risiko. Silakan perbaiki dan submit kembali di event berikutnya."
    }
  ];

  console.log("📝 Seeding Paper Submissions...");
  for (const p of papers) {
    // Cek apakah sudah ada paper dengan judul yang sama untuk user ini
    const existingPaper = await db.query.paperSubmission.findFirst({
      where: (ps, { and, eq }) => and(eq(ps.userId, userId), eq(ps.judul, p.judul))
    });

    if (!existingPaper) {
      await db.insert(paperSubmission).values({
        userId,
        ...p
      });
    }
  }

  console.log("✅ Berhasil seeding data demo profil!");
  process.exit(0);
}

seedProfileDemo().catch(err => {
  console.error("❌ Error seeding profile demo:", err);
  process.exit(1);
});
