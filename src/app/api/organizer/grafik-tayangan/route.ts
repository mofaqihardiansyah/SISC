import { db } from "@/db";
import { event } from "@/db/schema";
import { eq, and, gte, lte, sql, count } from "drizzle-orm";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") ?? "bulan-ini";
    const eventId = searchParams.get("eventId");

    const today = new Date();

    let awal: Date;
    let akhir: Date;
    let labels: { key: string; tanggal: string; jumlah: number }[];
    let formatSQL: "YYYY-MM-DD" | "YYYY-MM";

    if (filter === "tahun-ini") {
      const tahun = today.getFullYear();

      awal = new Date(tahun, 0, 1);
      akhir = new Date(tahun, 11, 31, 23, 59, 59);
      formatSQL = "YYYY-MM";

      labels = Array.from({ length: 12 }, (_, i) => {
        const key = `${tahun}-${String(i + 1).padStart(2, "0")}`;

        return {
          key,
          tanggal: new Date(tahun, i, 1).toLocaleDateString("id-ID", {
            month: "long",
          }),
          jumlah: 0,
        };
      });
    } else {
      const bulanOffset = filter === "bulan-lalu" ? -1 : 0;
      const refDate = new Date(today.getFullYear(), today.getMonth() + bulanOffset, 1);
      const tahun = refDate.getFullYear();
      const bulan = refDate.getMonth();

      const jumlahHari = new Date(tahun, bulan + 1, 0).getDate();

      awal = new Date(tahun, bulan, 1);
      akhir = new Date(tahun, bulan + 1, 0, 23, 59, 59);
      formatSQL = "YYYY-MM-DD";

      labels = Array.from({ length: jumlahHari }, (_, i) => {
        const d = new Date(tahun, bulan, i + 1);

        const key = [
          d.getFullYear(),
          String(d.getMonth() + 1).padStart(2, "0"),
          String(d.getDate()).padStart(2, "0"),
        ].join("-");

        return {
          key,
          tanggal: d.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          }),
          jumlah: 0,
        };
      });
    }

    const fmt = sql.raw(`'${formatSQL}'`);

    const conditions = [
      eq(event.organizerId, userId),
      gte(event.tanggalMulai, awal),
      lte(event.tanggalSelesai, akhir),
    ];

    if (eventId && eventId !== "all") {
      conditions.push(eq(event.id, parseInt(eventId, 10)));
    }

    const rawData = await db
      .select({
        tanggal: sql<string>`TO_CHAR(${event.tanggalMulai}, ${fmt})`,
        jumlah: count(event.id),
      })
      .from(event)
      .where(and(...conditions))
      .groupBy(sql`TO_CHAR(${event.tanggalMulai}, ${fmt})`)
      .orderBy(sql`TO_CHAR(${event.tanggalMulai}, ${fmt})`);

    const dataMap = Object.fromEntries(
      rawData.map((r) => [r.tanggal, Number(r.jumlah ?? 0)])
    );

    const result = labels.map((item) => ({
      tanggal: item.tanggal,
      jumlah: dataMap[item.key] ?? 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[grafik-tayangan] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}