import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pendaftaran, peserta, event } from "@/db/schema";
import { eq, and, sql, ilike, or, desc, count } from "drizzle-orm";
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

    // Build kondisi status
    const statusCondition =
      status === "semua"
        ? undefined
        : eq(pendaftaran.status, status as "terdaftar" | "hadir" | "dibatalkan");

    // Build kondisi search
    const searchCondition = search
      ? or(
          ilike(peserta.namaLengkap, `%${search}%`),
          ilike(peserta.email, `%${search}%`),
          ilike(peserta.nomorTelepon, `%${search}%`)
        )
      : undefined;

    // Build combined WHERE conditions
    const whereCondition = and(
      eq(event.organizerId, organizerId),
      statusCondition,
      searchCondition
    );

    // Ambil data menggunakan Query Builder dengan limit & offset
    const rawData = await db
      .select({
        pendaftaranId: pendaftaran.id,
        kodePendaftaran: pendaftaran.kodePendaftaran,
        status: pendaftaran.status,
        dibuatPada: pendaftaran.dibuatPada,
        buktiPembayaran: pendaftaran.buktiPembayaran,
        namaEvent: event.judul,
        peserta: {
          id: peserta.id,
          namaLengkap: peserta.namaLengkap,
          email: peserta.email,
          nomorTelepon: peserta.nomorTelepon,
          jenisKelamin: peserta.jenisKelamin,
        },
        pendaftarAvatar: sql<string>`users.avatar_url`,
      })
      .from(pendaftaran)
      .innerJoin(event, eq(pendaftaran.eventId, event.id))
      .leftJoin(peserta, eq(pendaftaran.id, peserta.pendaftaranId))
      .leftJoin(sql`users`, eq(pendaftaran.userId, sql`users.id`))
      .where(whereCondition)
      .orderBy(desc(pendaftaran.dibuatPada))
      .limit(perPage)
      .offset(offset);

    // Ambil total count secara paralel
    const [countResult] = await db
      .select({ value: count() })
      .from(pendaftaran)
      .innerJoin(event, eq(pendaftaran.eventId, event.id))
      .leftJoin(peserta, eq(pendaftaran.id, peserta.pendaftaranId))
      .where(whereCondition);

    const total = countResult.value;

    const data = rawData.map((row) => ({
      pendaftaranId: row.pendaftaranId,
      kodePendaftaran: row.kodePendaftaran,
      status: row.status,
      dibuatPada: row.dibuatPada,
      buktiPembayaran: row.buktiPembayaran,
      namaEvent: row.namaEvent,
      avatarUrl: row.pendaftarAvatar === "/uploads/avatars/fotodummy.jpg" ? null : row.pendaftarAvatar,
      peserta: row.peserta?.id ? row.peserta : null,
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

    // Validasi nilai status
    const validStatuses = ["terdaftar", "hadir", "dibatalkan"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status tidak valid. Gunakan: terdaftar, hadir, atau dibatalkan" }, { status: 400 });
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
