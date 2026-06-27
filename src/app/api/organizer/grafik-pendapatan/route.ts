import { db } from "@/db";
import { event, pendaftaran } from "@/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = parseInt(session.user.id, 10);
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") ?? "bulan-ini";
    const eventId = searchParams.get("eventId");

    const today = new Date();
    let awal: Date, akhir: Date, formatSQL: string;
    let generateLabels: () => Date[];
    let groupByLabel: (d: Date) => string;

    if (filter === "tahun-ini") {
      awal = new Date(today.getFullYear(), 0, 1);
      akhir = new Date(today.getFullYear(), 11, 31, 23, 59, 59);
      formatSQL = "YYYY-MM";
      generateLabels = () => Array.from({ length: 12 }, (_, i) => new Date(today.getFullYear(), i, 1));
      groupByLabel = (d) => d.toLocaleDateString("id-ID", { month: "long" });
    } else if (filter === "bulan-lalu") {
      awal = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      akhir = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
      formatSQL = "YYYY-MM-DD";
      const jumlahHari = akhir.getDate();
      generateLabels = () => Array.from({ length: jumlahHari }, (_, i) => new Date(awal.getFullYear(), awal.getMonth(), i + 1));
      groupByLabel = (d) => d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    } else {
      awal = new Date(today.getFullYear(), today.getMonth(), 1);
      akhir = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
      formatSQL = "YYYY-MM-DD";
      const jumlahHari = akhir.getDate();
      generateLabels = () => Array.from({ length: jumlahHari }, (_, i) => new Date(today.getFullYear(), today.getMonth(), i + 1));
      groupByLabel = (d) => d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    }

    const conditions = [
      eq(event.organizerId, userId),
      gte(pendaftaran.dibuatPada, awal),
      lte(pendaftaran.dibuatPada, akhir),
    ];

    if (eventId && eventId !== "all") {
      conditions.push(eq(event.id, parseInt(eventId, 10)));
    }

    // Pendapatan = jumlah pendaftaran × harga event
    const rawData = await db
      .select({
        tanggal: sql<string>`TO_CHAR(${pendaftaran.dibuatPada}, '${sql.raw(formatSQL)}')`,
        jumlah: sql<number>`SUM(${event.harga})`,
      })
      .from(pendaftaran)
      .innerJoin(event, eq(pendaftaran.eventId, event.id))
      .where(and(...conditions))
      .groupBy(sql`TO_CHAR(${pendaftaran.dibuatPada}, '${sql.raw(formatSQL)}')`)
      .orderBy(sql`TO_CHAR(${pendaftaran.dibuatPada}, '${sql.raw(formatSQL)}')`);

    const dataMap = Object.fromEntries(rawData.map(r => [r.tanggal, Number(r.jumlah)]));

    const grafikData = generateLabels().map((d) => {
      const key = filter === "tahun-ini"
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        : d.toISOString().split("T")[0];
      return { tanggal: groupByLabel(d), jumlah: dataMap[key] ?? 0 };
    });

    return NextResponse.json(grafikData);
  } catch (error) {
    console.error("[grafik-pendapatan] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}