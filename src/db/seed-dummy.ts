import 'dotenv/config';
import { db } from './index';
import {
  profilPenyelenggara, tag, eventTag, 
  bookmark, logAdmin,
  jadwalEvent, pendaftaran, peserta
} from './schema';
import { eq } from 'drizzle-orm';

export async function seedDummy() {
  console.log("🚀 Seeding data dummy yang dirampingkan (profil, tag, pembicara, jadwal, bookmark, log)...");

  // 1. PROFIL PENYELENGGARA
  console.log("  📦 Profil Penyelenggara...");
  await db.insert(profilPenyelenggara).values({
    userId: 2,
    namaInstansi: "Politeknik Negeri Semarang",
    deskripsiInstansi: "Politeknik Negeri Semarang (Polines) adalah perguruan tinggi vokasi negeri yang fokus pada pendidikan terapan.",
    websiteUrl: "https://polines.ac.id",
  }).onConflictDoUpdate({
    target: profilPenyelenggara.userId,
    set: { namaInstansi: "Politeknik Negeri Semarang" }
  });

  // 2. TAGS (Label Spesifik)
  console.log("  📦 Tags (Labels)...");
  const tags = [
    { nama: "#AI" },
    { nama: "#BigData" },
    { nama: "#NextJS" },
    { nama: "#CyberSecurity" },
    { nama: "#Webinar" },
    { nama: "#Workshop" },
    { nama: "#Figma" },
    { nama: "#ReactJS" },
    { nama: "#Vokasi" },
    { nama: "#HealthTech" },
  ];
  for (const t of tags) {
    await db.insert(tag).values(t).onConflictDoUpdate({ target: tag.nama, set: { nama: t.nama } });
  }

  // 3. EVENT-TAG
  console.log("  📦 Event-Tag...");
  const eventTags = [
    { eventId: 1, tagId: 1 }, { eventId: 1, tagId: 2 },
    { eventId: 14, tagId: 4 },
    { eventId: 17, tagId: 5 },
    { eventId: 2, tagId: 6 },
    { eventId: 16, tagId: 7 },
  ];
  for (const et of eventTags) {
    await db.insert(eventTag).values(et).onConflictDoNothing();
  }

  // 5. JADWAL EVENT
  console.log("  📦 Jadwal Event...");
  function eventTime(daysFromNow: number, hour: number) {
    const d = new Date(Date.now() + daysFromNow * 86400000);
    d.setHours(hour, 0, 0, 0);
    return d;
  }
  const jadwal = [
    { eventId: 1, waktuMulai: eventTime(30, 9), waktuSelesai: eventTime(30, 12), deskripsi: "Sesi Utama: Masa Depan AI" },
    { eventId: 17, waktuMulai: eventTime(7, 19), waktuSelesai: eventTime(7, 21), deskripsi: "Intro to Machine Learning" },
  ];
  for (const j of jadwal) {
    await db.insert(jadwalEvent).values(j).onConflictDoNothing();
  }

  // 6. BOOKMARK
  console.log("  📦 Bookmark...");
  const bookmarks = [
    { userId: 3, eventId: 1 }, { userId: 3, eventId: 17 },
    { userId: 4, eventId: 1 }, { userId: 4, eventId: 14 },
  ];
  for (const b of bookmarks) {
    await db.insert(bookmark).values(b).onConflictDoNothing();
  }

  // 7. LOG ADMIN
  console.log(" Log Admin...");
  const logs = [
    { adminId: 1, eventId: 1, aksi: "approved", dataSebelumnya: { status: "pending" } },
    { adminId: 1, eventId: 18, aksi: "approved", dataSebelumnya: { status: "pending" } },
  ];
  for (const l of logs) {
    await db.insert(logAdmin).values(l);
  }

  // 8. PENDAFTARAN & PESERTA
  console.log("  📦 Pendaftaran & Peserta...");
  const pendaftarans = [
    { eventId: 1, userId: 4, kodePendaftaran: "REG-1-001", status: "terdaftar" as const, namaLengkap: "Dewi Anggraini", email: "dewi.anggraini@gmail.com", nomorTelepon: "082111222336", jenisKelamin: "Perempuan" as const, kodePeserta: "P-1-001" },
    { eventId: 1, userId: 5, kodePendaftaran: "REG-1-002", status: "hadir" as const, namaLengkap: "Fajar Setiawan", email: "fajar.setiawan@gmail.com", nomorTelepon: "082111222337", jenisKelamin: "Laki-laki" as const, kodePeserta: "P-1-002" },
  ];

  for (const p of pendaftarans) {
    const existing = await db.query.pendaftaran.findFirst({
      where: eq(pendaftaran.kodePendaftaran, p.kodePendaftaran)
    });

    if (!existing) {
      await db.insert(pendaftaran).values({
        eventId: p.eventId,
        userId: p.userId,
        kodePendaftaran: p.kodePendaftaran,
        status: p.status,
      }).returning();

      await db.insert(peserta).values({
        kodePeserta: p.kodePeserta,
        namaLengkap: p.namaLengkap,
        email: p.email,
        nomorTelepon: p.nomorTelepon,
        jenisKelamin: p.jenisKelamin as "Laki-laki" | "Perempuan",
      });
    }
  }

  console.log("✅ Data dummy berhasil disesuaikan dengan struktur baru!");
}

