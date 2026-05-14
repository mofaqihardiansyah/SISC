import 'dotenv/config';
import { db } from './index';
import { users, bookmark, pendaftaran, peserta, paperSubmission, event } from './schema';
import { eq } from 'drizzle-orm';

export async function seedProfileDemo() {
  console.log("🚀 Memulai proses seeding data demo profil...");

  // 1. Cari User "Pengunjung"
  const visitor = await db.query.users.findFirst({
    where: eq(users.email, "visitor@gmail.com")
  });

  if (!visitor) {
    console.error("❌ User 'visitor@gmail.com' tidak ditemukan. Jalankan seed-users.ts dulu!");
    throw new Error("User visitor@gmail.com not found");
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
  // Kita daftarkan ke Event ID 5, 2, dan 14 agar muncul di list Submit Paper
  const registrationEvents = [
    { id: 5, kode: 'REG-SC-001' },
    { id: 2, kode: 'REG-CS-002' },
    { id: 14, kode: 'REG-EH-003' }
  ];

  console.log("🎟️ Seeding Pendaftaran & Peserta untuk Demo...");
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
        jenisKelamin: (visitor.jenisKelamin as any) || 'Laki-laki',
      });
    }
  }


  // 4. SEED PAPER SUBMISSIONS (Submit Paper)
  const papers = [
    {
      eventId: 5, // Konferensi Smart Campus Polines
      judul: "Implementasi Edge Computing untuk Deteksi Kepadatan Parkir Real-time di Kampus",
      penulis: "Ahmad Rizki, Dr. Sujatmiko, Sarah Amelia",
      fileUrl: "/uploads/papers/paper-edge-computing.pdf",
      status: "accepted",
      komentarPenolakan: null
    },
    {
      eventId: 2, // Workshop Cybersecurity Fundamentals
      judul: "Analisis Forensik Digital pada Serangan Ransomware di Infrastruktur Cloud",
      penulis: "Ahmad Rizki, Prof. Budi Santoso",
      fileUrl: "/uploads/papers/paper-cyber-forensics.pdf",
      status: "review",
      komentarPenolakan: null
    },
    {
      eventId: 14, // Konferensi Ethical Hacking Indonesia
      judul: "Pemanfaatan Blockchain untuk Keamanan Data Rekam Medis di Puskesmas",
      penulis: "Ahmad Rizki, dr. Tirta",
      fileUrl: "/uploads/papers/paper-blockchain-health.pdf",
      status: "rejected",
      komentarPenolakan: "Metodologi penelitian pada bagian konsensus blockchain kurang mendalam untuk skala Puskesmas. Mohon perbaiki landasan teori dan analisis skalabilitas sebelum submit kembali."
    }
  ];

  console.log("📝 Seeding Paper Submissions for Demo...");
  // Bersihkan dulu paper lama untuk user ini agar fresh
  await db.delete(paperSubmission).where(eq(paperSubmission.userId, userId));

  for (const p of papers) {
    await db.insert(paperSubmission).values({
      userId,
      ...p
    });
  }

  console.log("✅ Berhasil seeding data demo profil (Bookmarks, Pendaftaran, & Paper Submissions)!");
}


