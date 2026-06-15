import { db } from "@/db";
import { event, pendaftaran, peserta, paperSubmission } from "@/db/schema";
import { count, eq, and, sum, desc, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = parseInt(session.user.id, 10);
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  const conditions = [eq(event.organizerId, userId)];
  if (eventId && eventId !== "all") {
    conditions.push(eq(event.id, parseInt(eventId, 10)));
  }

  const [totalPesertaResult] = await db
    .select({ total: count() })
    .from(peserta)
    .innerJoin(pendaftaran, eq(peserta.pendaftaranId, pendaftaran.id))
    .innerJoin(event, eq(pendaftaran.eventId, event.id))
    .where(and(...conditions));

  const [totalTayanganResult] = await db
    .select({ total: sum(event.jumlahTayangan) })
    .from(event)
    .where(and(...conditions));

  const [totalPendapatanResult] = await db
    .select({ total: sum(event.harga) })
    .from(pendaftaran)
    .innerJoin(event, eq(pendaftaran.eventId, event.id))
    .where(
      and(
        ...conditions,
        eq(pendaftaran.status, "terdaftar")
      )
    );

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
    .where(and(...conditions))
    .orderBy(desc(pendaftaran.dibuatPada))
    .limit(5);

  // Fetch Recent Paper Submissions
  const recentPapers = await db
    .select({
      id: paperSubmission.id,
      judul: paperSubmission.judul,
      penulis: sql<string>`COALESCE((SELECT string_agg(nama, ', ') FROM penulis_paper WHERE paper_submission_id = paper_submission.id), 'Unknown')`,
      status: paperSubmission.status,
      eventJudul: event.judul,
      dibuatPada: paperSubmission.dibuatPada,
    })
    .from(paperSubmission)
    .innerJoin(event, eq(paperSubmission.eventId, event.id))
    .where(and(...conditions))
    .orderBy(desc(paperSubmission.dibuatPada))
    .limit(5);

  return NextResponse.json({
    totalPeserta: Number(totalPesertaResult.total || 0),
    totalTayangan: Number(totalTayanganResult.total || 0),
    totalPendapatan: Number(totalPendapatanResult.total || 0),
    recentParticipants,
    recentPapers,
  });
}
