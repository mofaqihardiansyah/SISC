"use server";

import { db } from "@/db";
import { paperSubmission, pendaftaran, event } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

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
      eventJudul: event.judul,
    })
    .from(paperSubmission)
    .innerJoin(event, eq(paperSubmission.eventId, event.id))
    .where(eq(paperSubmission.userId, userId))
    .orderBy(desc(paperSubmission.dibuatPada));

  return { success: true, registeredEvents, submittedPapers };
}

export async function submitNewPaper(data: { eventId: number; judul: string; penulis: string; fileUrl: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = parseInt(session.user.id);

  await db.insert(paperSubmission).values({ ...data, userId });
  
  revalidatePath('/profile/submit-paper');
}