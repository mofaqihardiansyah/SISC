import 'dotenv/config';
import { db } from './index';
import {
  profilPenyelenggara, tag, eventTag, 
  lampiranEvent, bookmark, userEvent, logAdmin,
  pembicaraEvent, jadwalEvent,
} from './schema';

async function main() {
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
    { id: 1, nama: "#AI" },
    { id: 2, nama: "#BigData" },
    { id: 3, nama: "#NextJS" },
    { id: 4, nama: "#CyberSecurity" },
    { id: 5, nama: "#Webinar" },
    { id: 6, nama: "#Workshop" },
    { id: 7, nama: "#Figma" },
    { id: 8, nama: "#ReactJS" },
    { id: 9, nama: "#Vokasi" },
    { id: 10, nama: "#HealthTech" },
  ];
  for (const t of tags) {
    await db.insert(tag).values(t).onConflictDoUpdate({ target: tag.nama, set: { nama: t.nama } });
  }

  // 3. EVENT-TAG
  console.log("  📦 Event-Tag...");
  const eventTags = [
    { eventId: 1, tagId: 1 }, { eventId: 1, tagId: 2 },
    { id: 14, eventId: 14, tagId: 4 },
    { eventId: 17, tagId: 5 },
    { eventId: 2, tagId: 6 },
    { eventId: 16, tagId: 7 },
  ];
  for (const et of eventTags) {
    await db.insert(eventTag).values(et).onConflictDoUpdate({
      target: [eventTag.eventId, eventTag.tagId],
      set: { tagId: et.tagId }
    });
  }

  // 4. PEMBICARA EVENT
  console.log("  📦 Pembicara Event...");
  const pembicara = [
    { eventId: 1, nama: "Dr. Bambang Riyanto", peran: "Keynote Speaker" },
    { eventId: 3, nama: "dr. Andi Pratama, Sp.PD", peran: "Keynote Speaker" },
    { eventId: 17, nama: "Dr. Eka Putra", peran: "Main Speaker" },
  ];
  for (const p of pembicara) {
    await db.insert(pembicaraEvent).values(p);
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
    await db.insert(jadwalEvent).values(j);
  }

  // 6. BOOKMARK
  console.log("  📦 Bookmark...");
  const bookmarks = [
    { userId: 3, eventId: 1 }, { userId: 3, eventId: 17 },
    { userId: 4, eventId: 1 }, { userId: 4, eventId: 14 },
  ];
  for (const b of bookmarks) {
    await db.insert(bookmark).values(b);
  }

  // 7. LOG ADMIN
  console.log("  📦 Log Admin...");
  const logs = [
    { adminId: 1, eventId: 1, aksi: "approved", dataSebelumnya: { status: "pending" } },
    { adminId: 1, eventId: 18, aksi: "approved", dataSebelumnya: { status: "pending" } },
  ];
  for (const l of logs) {
    await db.insert(logAdmin).values(l);
  }

  console.log("✅ Data dummy berhasil disesuaikan dengan struktur baru!");
  process.exit(0);
}

main().catch(err => { console.error("❌ Error:", err); process.exit(1); });
