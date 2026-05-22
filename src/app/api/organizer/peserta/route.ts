import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pendaftaran, peserta, event, users } from "@/db/schema";
import { eq, and, or, ilike, sql } from "drizzle-orm";
import { auth } from "@/auth";

// ── GET: Ambil daftar peserta milik organizer yang login ──────
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizerId = parseInt(session.user.id);
    const { searchParams } = new URL(req.url);
    const search   = searchParams.get("search") ?? "";
    const status   = searchParams.get("status") ?? "semua";
    const page     = parseInt(searchParams.get("page") ?? "1");
    const perPage  = parseInt(searchParams.get("perPage") ?? "10");
    const offset   = (page - 1) * perPage;

    // Ambil semua event milik organizer ini
    const eventOrganizer = await db
      .select({ id: event.id, judul: event.judul })
      .from(event)
      .where(eq(event.organizerId, organizerId));

    if (eventOrganizer.length === 0) {
      return NextResponse.json({ data: [], total: 0 });
    }

    const eventIds = eventOrganizer.map((e) => e.id);
    const eventMap = Object.fromEntries(eventOrganizer.map((e) => [e.id, e.judul]));

    // Build kondisi status
    const statusCondition =
      status === "semua"
        ? undefined
        : eq(pendaftaran.status, status as "terdaftar" | "hadir" | "dibatalkan");

    // Build kondisi event (IN)
    const eventCondition = sql`${pendaftaran.eventId} = ANY(ARRAY[${sql.join(
      eventIds.map((id) => sql`${id}`),
      sql`, `
    )}]::int[])`;

    // Ambil data dengan join peserta
    const allPendaftaran = await db.query.pendaftaran.findMany({
      where: statusCondition
        ? and(eventCondition, statusCondition)
        : eventCondition,
      with: {
        peserta: true,
      },
      orderBy: (p, { desc }) => [desc(p.dibuatPada)],
    });

    // Filter search di sisi aplikasi (untuk fleksibilitas)
    const filtered = search
      ? allPendaftaran.filter((p) => {
          const pesertaItem = p.peserta?.[0];
          const q = search.toLowerCase();
          return (
            pesertaItem?.namaLengkap?.toLowerCase().includes(q) ||
            pesertaItem?.email?.toLowerCase().includes(q) ||
            pesertaItem?.nomorTelepon?.includes(q)
          );
        })
      : allPendaftaran;

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + perPage);

    const data = paginated.map((p) => ({
      pendaftaranId: p.id,
      kodePendaftaran: p.kodePendaftaran,
      status: p.status,
      dibuatPada: p.dibuatPada,
      namaEvent: eventMap[p.eventId ?? 0] ?? "Event",
      peserta: p.peserta?.[0]
        ? {
            id: p.peserta[0].id,
            namaLengkap: p.peserta[0].namaLengkap,
            email: p.peserta[0].email,
            nomorTelepon: p.peserta[0].nomorTelepon,
            jenisKelamin: p.peserta[0].jenisKelamin,
          }
        : null,
    }));

    return NextResponse.json({ data, total });
  } catch (err) {
    console.error("[GET /api/organizer/peserta]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ── PATCH: Update status pendaftaran ─────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizerId = parseInt(session.user.id);
    const body = await req.json();
    const { pendaftaranId, status } = body;

    if (!pendaftaranId || !status) {
      return NextResponse.json({ error: "pendaftaranId dan status wajib diisi" }, { status: 400 });
    }

    // Pastikan pendaftaran ini milik event organizer yg login
    const data = await db.query.pendaftaran.findFirst({
      where: eq(pendaftaran.id, pendaftaranId),
      with: { event: { columns: { organizerId: true } } },
    });

    if (!data || data.event?.organizerId !== organizerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db
      .update(pendaftaran)
      .set({
        status: status as "terdaftar" | "hadir" | "dibatalkan",
        diperbaruiPada: new Date(),
      })
      .where(eq(pendaftaran.id, pendaftaranId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PATCH /api/organizer/peserta]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
