import { db } from "@/db";
import { event, tayanganLog } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const eventId = Number(resolvedParams.id);

  if (isNaN(eventId)) {
    return NextResponse.json(
      { error: "ID event tidak valid" },
      { status: 400 }
    );
  }

  await db.transaction(async (tx) => {
    await tx
      .update(event)
      .set({
        jumlahTayangan: sql`${event.jumlahTayangan} + 1`,
      })
      .where(
        and(
          eq(event.id, eventId),
          eq(event.status, "published")
        )
      );

    await tx.insert(tayanganLog).values({
      eventId,
      tanggal: new Date(),
    });
  });

  return NextResponse.json({
    success: true,
    message: "Tayangan berhasil dicatat",
  });
}