"use server";

import { db } from "@/db";
import { paperSubmission, pendaftaran, event, users, profilPenyelenggara } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const paperSchema = z.object({
  eventId: z.number(),
  judul: z.string().min(5),
  kataKunci: z.string().optional(),
  track: z.string().optional(),
  penulis: z.array(z.object({
    nama: z.string().min(3, "Nama penulis harus diisi"),
    email: z.string().email("Email penulis tidak valid"),
    afiliasi: z.string().min(3, "Afiliasi penulis harus diisi"),
    isCorresponding: z.boolean()
  })).min(1, "Minimal harus ada 1 penulis"),
  fileUrl: z.string().min(1, "URL file tidak valid"),
});

export async function getSubmissionData() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  const userId = parseInt(session.user.id);

  // Mengambil daftar Event Conference yang didaftarkan oleh user ini dengan nama penyelenggara yang lengkap
  const registeredEvents = await db
    .select({
      id: event.id,
      judul: event.judul,
      penyelenggara: sql<string>`COALESCE(${event.penyelenggara}, ${profilPenyelenggara.namaInstansi}, ${users.namaLengkap}, '-')`,
      tanggalMulai: event.tanggalMulai,
    })
    .from(pendaftaran)
    .innerJoin(event, eq(pendaftaran.eventId, event.id))
    .leftJoin(users, eq(event.organizerId, users.id))
    .leftJoin(profilPenyelenggara, eq(users.id, profilPenyelenggara.userId))
    .where(and(eq(pendaftaran.userId, userId), eq(event.jenisEvent, 'conference')));

  // Mengambil riwayat status paper yang pernah disubmit beserta penulis dan fileUrl
  const submittedPapers = await db
    .select({
      id: paperSubmission.id,
      judul: paperSubmission.judul,
      kataKunci: paperSubmission.kataKunci,
      track: paperSubmission.track,
      penulis: paperSubmission.penulis,
      fileUrl: paperSubmission.fileUrl,
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
  const result = paperSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }
  const validatedData = result.data;

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
