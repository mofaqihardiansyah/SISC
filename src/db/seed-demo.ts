import 'dotenv/config';
import { db } from './index';
import { users, favorit, pendaftaran, peserta, paperSubmission, penulisPaper } from './schema';
import { eq } from 'drizzle-orm';

async function seedBookmarks() {
  console.log("📦 Seeding favorit...");
  const visitor = await db.query.users.findFirst({
    where: eq(users.email, "visitor@gmail.com")
  });
  if (visitor) {
    for (const eventId of [1, 2, 3]) {
      await db.insert(favorit).values({ userId: visitor.id, eventId }).onConflictDoNothing();
    }
  }

  console.log("✅ Favorit seeded!");
}

async function seedRegistrations() {
  console.log("📦 Seeding pendaftaran & peserta...");

  const dummyPendaftarans = [
    {
      eventId: 1, userId: 4, kodePendaftaran: "REG-1-001", status: "terdaftar" as const,
      namaLengkap: "Dewi Anggraini", email: "dewi.anggraini@gmail.com",
      nomorTelepon: "082111222337", jenisKelamin: "Perempuan" as const, kodePeserta: "P-1-001",
      buktiPembayaran: "https://picsum.photos/seed/payment1/800/600"
    },
    {
      eventId: 1, userId: 5, kodePendaftaran: "REG-1-002", status: "hadir" as const,
      namaLengkap: "Fajar Setiawan", email: "fajar.setiawan@gmail.com",
      nomorTelepon: "082111222337", jenisKelamin: "Laki-laki" as const, kodePeserta: "P-1-002",
      buktiPembayaran: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
  ];

  for (const p of dummyPendaftarans) {
    const existing = await db.query.pendaftaran.findFirst({
      where: eq(pendaftaran.kodePendaftaran, p.kodePendaftaran)
    });
    if (!existing) {
      const newReg = await db.insert(pendaftaran).values({
        eventId: p.eventId, userId: p.userId,
        kodePendaftaran: p.kodePendaftaran, status: p.status,
        buktiPembayaran: p.buktiPembayaran,
      }).returning({ id: pendaftaran.id });

      await db.insert(peserta).values({
        pendaftaranId: newReg[0].id,
        kodePeserta: p.kodePeserta, namaLengkap: p.namaLengkap, email: p.email,
        nomorTelepon: p.nomorTelepon, jenisKelamin: p.jenisKelamin,
      });
    }
  }

  const visitor = await db.query.users.findFirst({
    where: eq(users.email, "visitor@gmail.com")
  });
  if (visitor) {
    const registrationEvents = [
      { id: 4, kode: 'REG-SC-001' }, { id: 5, kode: 'REG-CS-002' }, { id: 6, kode: 'REG-EH-003' }
    ];
    for (const reg of registrationEvents) {
      const existingReg = await db.query.pendaftaran.findFirst({
        where: (p, { and, eq }) => and(eq(p.userId, visitor.id), eq(p.eventId, reg.id))
      });
      if (!existingReg) {
        const newReg = await db.insert(pendaftaran).values({
          userId: visitor.id, eventId: reg.id,
          kodePendaftaran: reg.kode, status: 'terdaftar',
          buktiPembayaran: "https://picsum.photos/seed/payment_reg/800/600",
        }).returning({ id: pendaftaran.id });
        
        await db.insert(peserta).values({
          pendaftaranId: newReg[0].id,
          kodePeserta: `PS-${reg.kode}`,
          namaLengkap: visitor.namaLengkap,
          email: visitor.email,
          nomorTelepon: visitor.nomorTelepon,
          jenisKelamin: visitor.jenisKelamin || 'Laki-laki',
        });
      }
    }
  }

  console.log("✅ Pendaftaran & peserta seeded!");
}

async function seedPapers() {
  console.log("📦 Seeding paper submissions...");
  const visitor = await db.query.users.findFirst({
    where: eq(users.email, "visitor@gmail.com")
  });
  if (!visitor) {
    console.warn("⚠️ visitor@gmail.com not found, skipping paper submissions");
    return;
  }

  const papers = [
    {
      eventId: 4,
      judul: "Implementasi Edge Computing untuk Deteksi Kepadatan Parkir Real-time di Kampus",
      penulis: "Ahmad Rizki, Dr. Sujatmiko, Sarah Amelia",
      urlFile: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      status: "accepted" as const,
      komentarPenolakan: null as string | null
    },
    {
      eventId: 5,
      judul: "Analisis Forensik Digital pada Serangan Ransomware di Infrastruktur Cloud",
      penulis: "Ahmad Rizki, Prof. Budi Santoso",
      urlFile: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      status: "review" as const,
      komentarPenolakan: null as string | null
    },
    {
      eventId: 6,
      judul: "Pemanfaatan Blockchain untuk Keamanan Data Rekam Medis di Puskesmas",
      penulis: "Ahmad Rizki, dr. Tirta",
      urlFile: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      status: "rejected" as const,
      komentarPenolakan: "Metodologi penelitian pada bagian konsensus blockchain kurang mendalam untuk skala Puskesmas. Mohon perbaiki landasan teori."
    }
  ];

  await db.delete(paperSubmission).where(eq(paperSubmission.userId, visitor.id));

  for (const p of papers) {
    const [inserted] = await db.insert(paperSubmission).values({
      userId: visitor.id,
      eventId: p.eventId,
      judul: p.judul,
      urlFile: p.urlFile,
      status: p.status,
      komentarPenolakan: p.komentarPenolakan,
    }).returning({ id: paperSubmission.id });

    const penulisList = p.penulis.split(',').map(s => s.trim());
    for (let i = 0; i < penulisList.length; i++) {
      await db.insert(penulisPaper).values({
        paperSubmissionId: inserted.id,
        nama: penulisList[i],
        email: `penulis${i+1}@example.com`,
        institusi: "Politeknik Negeri Semarang",
        urutan: i + 1
      });
    }
  }

  console.log("✅ Paper submissions seeded!");
}

export async function seedDemo() {
  const start = Date.now();
  console.log("📦 [DEMO] Seeding demo data...\n");
  await seedBookmarks();
  await seedRegistrations();
  await seedPapers();
  console.log(`\n✅ [DEMO] Done in ${((Date.now() - start) / 1000).toFixed(2)}s`);
}
