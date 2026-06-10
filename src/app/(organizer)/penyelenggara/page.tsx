import { db } from "@/db";
import { event, peserta, pendaftaran, users, paperSubmission } from "@/db/schema";
import { count, eq, and, gte, sql, sum, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/penyelenggara/DashboardContent";
export const dynamic = 'force-dynamic';


export default async function PenyelenggaraDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = parseInt(session.user.id, 10);
  if (isNaN(userId)) redirect("/login");

  const [dbUser] = await db
    .select({ disetujui: users.disetujui })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const disetujui = dbUser?.disetujui || false;

  // Get all events for the filter dropdown
  const allEvents = await db
    .select({ 
      id: event.id, 
      judul: event.judul,
      urlBanner: event.urlBanner,
      tanggalMulai: event.tanggalMulai,
      status: event.status,
      tipePlatform: event.tipePlatform,
      harga: event.harga
    })
    .from(event)
    .where(eq(event.organizerId, userId))
    .orderBy(event.judul);

  const [totalPesertaResult] = await db
    .select({ total: count() })
    .from(peserta)
    .innerJoin(pendaftaran, eq(peserta.pendaftaranId, pendaftaran.id))
    .innerJoin(event, eq(pendaftaran.eventId, event.id))
    .where(eq(event.organizerId, userId));

  const [totalTayanganResult] = await db
    .select({ total: sum(event.jumlahTayangan) })
    .from(event)
    .where(eq(event.organizerId, userId));

  const [totalPendapatanResult] = await db
    .select({ total: sum(event.harga) })
    .from(pendaftaran)
    .innerJoin(event, eq(pendaftaran.eventId, event.id))
    .where(
      and(
        eq(event.organizerId, userId),
        eq(pendaftaran.status, "terdaftar")
      )
    );

  const today = new Date();
  const tahun = today.getFullYear();
  const bulan = today.getMonth();
  const jumlahHari = new Date(tahun, bulan + 1, 0).getDate();
  const awalBulan = new Date(tahun, bulan, 1);

  // Grafik Peserta
  const rawData = await db
    .select({
      tanggal: sql<string>`TO_CHAR(${pendaftaran.dibuatPada}, 'YYYY-MM-DD')`,
      jumlah: count(peserta.id),
    })
    .from(peserta)
    .innerJoin(pendaftaran, eq(peserta.pendaftaranId, pendaftaran.id))
    .innerJoin(event, eq(pendaftaran.eventId, event.id))
    .where(and(eq(event.organizerId, userId), gte(pendaftaran.dibuatPada, awalBulan)))
    .groupBy(sql`TO_CHAR(${pendaftaran.dibuatPada}, 'YYYY-MM-DD')`)
    .orderBy(sql`TO_CHAR(${pendaftaran.dibuatPada}, 'YYYY-MM-DD')`);

  const dataMap = Object.fromEntries(rawData.map((r) => [r.tanggal, r.jumlah]));

  const grafikData = Array.from({ length: jumlahHari }, (_, i) => {
    const d = new Date(tahun, bulan, i + 1);
    const key = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });

    return {
      tanggal: label,
      jumlah: dataMap[key] ?? 0,
    };
  });

  // Grafik Pendapatan
  const rawPendapatan = await db
    .select({
      tanggal: sql<string>`TO_CHAR(${pendaftaran.dibuatPada}, 'YYYY-MM-DD')`,
      jumlah: sum(event.harga),
    })
    .from(pendaftaran)
    .innerJoin(event, eq(pendaftaran.eventId, event.id))
    .where(
      and(
        eq(event.organizerId, userId),
        eq(pendaftaran.status, "terdaftar"),
        gte(pendaftaran.dibuatPada, awalBulan)
      )
    )
    .groupBy(sql`TO_CHAR(${pendaftaran.dibuatPada}, 'YYYY-MM-DD')`)
    .orderBy(sql`TO_CHAR(${pendaftaran.dibuatPada}, 'YYYY-MM-DD')`);

  const pendapatanMap = Object.fromEntries(
    rawPendapatan.map((r) => [r.tanggal, Number(r.jumlah ?? 0)])
  );

  const grafikPendapatan = Array.from({ length: jumlahHari }, (_, i) => {
    const d = new Date(tahun, bulan, i + 1);
    const key = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });

    return {
      tanggal: label,
      jumlah: pendapatanMap[key] ?? 0,
    };
  });

  // Fetch Recent Participants
  const recentParticipants = await db
    .select({
      id: peserta.id,
      namaLengkap: peserta.namaLengkap,
      email: peserta.email,
      eventJudul: event.judul,
      dibuatPada: pendaftaran.dibuatPada,
    })
    .from(peserta)
    .innerJoin(pendaftaran, eq(peserta.pendaftaranId, pendaftaran.id))
    .innerJoin(event, eq(pendaftaran.eventId, event.id))
    .where(eq(event.organizerId, userId))
    .orderBy(desc(pendaftaran.dibuatPada))
    .limit(5);

  // Fetch Recent Paper Submissions
  const recentPapers = await db
    .select({
      id: paperSubmission.id,
      judul: paperSubmission.judul,
      penulis: paperSubmission.penulis,
      status: paperSubmission.status,
      eventJudul: event.judul,
      dibuatPada: paperSubmission.dibuatPada,
    })
    .from(paperSubmission)
    .innerJoin(event, eq(paperSubmission.eventId, event.id))
    .where(eq(event.organizerId, userId))
    .orderBy(desc(paperSubmission.dibuatPada))
    .limit(5);

  return (
    <DashboardContent
      allEvents={allEvents}
      initialStats={{
        totalPeserta: Number(totalPesertaResult.total || 0),
        totalTayangan: Number(totalTayanganResult.total || 0),
        totalPendapatan: Number(totalPendapatanResult.total || 0),
      }}
      initialGrafikData={grafikData}
      initialGrafikPendapatan={grafikPendapatan}
      disetujui={disetujui}
      recentParticipants={recentParticipants}
      recentPapers={recentPapers}
    />
  );
}
