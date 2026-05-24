"use server";

import { db } from "@/db";
import { paperSubmission, pendaftaran, event } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const paperSchema = z.object({
  eventId: z.number(),
  judul: z.string().min(5, "Judul minimal 5 karakter"),
  penulis: z.string().min(3, "Penulis harus diisi"),
  fileUrl: z.string().min(1, "URL file tidak valid"),
});

export async function getSubmissionData() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  const userId = parseInt(session.user.id);

  // Mengambil daftar Event Conference yang didaftarkan oleh user ini
  const registeredEvents = await db
    .select({
      id: event.id,
      judul: event.judul,
      penyelenggara: event.penyelenggara,
      tanggalMulai: event.tanggalMulai,
    })
    .from(pendaftaran)
    .innerJoin(event, eq(pendaftaran.eventId, event.id))
    .where(and(eq(pendaftaran.userId, userId), eq(event.jenisEvent, 'conference')));

  // Mengambil riwayat status paper yang pernah disubmit
  const submittedPapers = await db
    .select({
      id: paperSubmission.id,
      judul: paperSubmission.judul,
      status: paperSubmission.status,
      komentarPenolakan: paperSubmission.komentarPenolakan,
      dibuatPada: paperSubmission.dibuatPada,
      eventId: paperSubmission.eventId,
      eventJudul: event.judul,
    })
    .from(paperSubmission)
    .innerJoin(event, eq(paperSubmission.eventId, event.id))
    .where(eq(paperSubmission.userId, userId))
    .orderBy(desc(paperSubmission.dibuatPada));

  return { success: true, registeredEvents, submittedPapers };
}

export async function submitNewPaper(data: z.infer<typeof paperSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = parseInt(session.user.id);

  // Validate input
  const validatedData = paperSchema.parse(data);

  // Check for existing submission for this event by this user
  const existing = await db
    .select()
    .from(paperSubmission)
    .where(
      and(
        eq(paperSubmission.eventId, validatedData.eventId),
        eq(paperSubmission.userId, userId)
      )
    )
    .limit(1);

  if (existing.length > 0 && existing[0].status !== 'rejected') {
    throw new Error("Anda sudah mengirimkan paper untuk event ini dan sedang dalam proses review.");
  }

  if (existing.length > 0 && existing[0].status === 'rejected') {
    // Update existing submission if it was rejected
    await db
      .update(paperSubmission)
      .set({
        ...validatedData,
        status: 'review',
        komentarPenolakan: null,
        dibuatPada: new Date(),
      })
      .where(eq(paperSubmission.id, existing[0].id));
  } else {
    // New submission
    await db.insert(paperSubmission).values({ ...validatedData, userId });
  }

  revalidatePath('/profile/submit-paper');
}
