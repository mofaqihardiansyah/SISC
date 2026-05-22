import { db } from "@/db";
import { event, tayanganLog } from "@/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = parseInt(session.user.id, 10);
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") ?? "bulan-ini";

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

  const rawData = await db
    .select({
      tanggal: sql<string>`TO_CHAR(${tayanganLog.tanggal}, '${sql.raw(formatSQL)}')`,
      jumlah: sql<number>`COUNT(*)`,
    })
    .from(tayanganLog)
    .innerJoin(event, eq(tayanganLog.eventId, event.id))
    .where(and(
      eq(event.organizerId, userId),
      gte(tayanganLog.tanggal, awal),
      lte(tayanganLog.tanggal, akhir),
    ))
    .groupBy(sql`TO_CHAR(${tayanganLog.tanggal}, '${sql.raw(formatSQL)}')`)
    .orderBy(sql`TO_CHAR(${tayanganLog.tanggal}, '${sql.raw(formatSQL)}')`);

  const dataMap = Object.fromEntries(rawData.map(r => [r.tanggal, Number(r.jumlah)]));

  const grafikData = generateLabels().map((d) => {
    const key = filter === "tahun-ini"
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      : d.toISOString().split("T")[0];
    return { tanggal: groupByLabel(d), jumlah: dataMap[key] ?? 0 };
  });

  return NextResponse.json(grafikData);
}