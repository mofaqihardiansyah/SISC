"use server";

import { db } from "@/db";
import { paperSubmission, pendaftaran, event, users, profilPenyelenggara, penulisPaper } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export interface SubmittedPaper {
  id: number;
  judul: string;
  abstrak: string | null;
  kataKunci: string | null;
  track: string | null;
  penulis: {
    nama: string;
    email: string;
    afiliasi: string;
    isCorresponding: boolean;
  }[];
  urlFile: string;
  status: 'review' | 'accepted' | 'rejected' | null;
  komentarPenolakan: string | null;
  dibuatPada: Date | null;
  eventId: number;
  eventJudul: string;
}

const paperSchema = z.object({
  eventId: z.number(),
  judul: z.string().min(5),
  abstrak: z.string().min(10, "Abstrak minimal 10 karakter"),
  kataKunci: z.string().optional(),
  track: z.string().min(2, "Track/Topik harus diisi"),
  penulis: z.array(z.object({
    nama: z.string().min(3, "Nama penulis harus diisi"),
    email: z.string().email("Email penulis tidak valid").or(z.literal("")),
    afiliasi: z.string().min(3, "Afiliasi penulis harus diisi"),
    isCorresponding: z.boolean()
  })).min(1, "Minimal harus ada 1 penulis"),
  urlFile: z.string().min(1, "URL file tidak valid"),
});

export async function getSubmissionData() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };
    const userId = parseInt(session.user.id);

    // Mengambil daftar Event Conference yang didaftarkan oleh user ini dengan nama penyelenggara yang lengkap
    const registeredEvents = await db
      .select({
        id: event.id,
        judul: event.judul,
        penyelenggara: sql<string>`COALESCE(${profilPenyelenggara.namaInstansi}, ${event.penyelenggara}, ${users.namaLengkap}, '-')`,
        tanggalMulai: event.tanggalMulai,
      })
      .from(pendaftaran)
      .innerJoin(event, eq(pendaftaran.eventId, event.id))
      .leftJoin(users, eq(event.organizerId, users.id))
      .leftJoin(profilPenyelenggara, eq(users.id, profilPenyelenggara.userId))
      .where(
        and(
          eq(pendaftaran.userId, userId), 
          eq(event.jenisEvent, 'conference'),
          sql`${pendaftaran.status} IN ('terdaftar', 'hadir', 'lunas')`
        )
      );

    // Mengambil riwayat status paper yang pernah disubmit beserta penulis dan urlFile
    const submittedPapers = await db
      .select({
        id: paperSubmission.id,
        judul: paperSubmission.judul,
        abstrak: paperSubmission.abstrak,
        kataKunci: paperSubmission.kataKunci,
        track: paperSubmission.track,
        penulis: sql<{ nama: string; email: string; afiliasi: string; isCorresponding: boolean }[]>`COALESCE(
          (SELECT json_agg(
            json_build_object(
              'nama', p.nama,
              'email', COALESCE(p.email, ''),
              'afiliasi', COALESCE(p.institusi, ''),
              'isCorresponding', p.is_corresponding
            )
          ) FROM penulis_paper p WHERE p.paper_submission_id = paper_submission.id),
          '[]'::json
        )`,
        urlFile: paperSubmission.urlFile,
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

  return { 
    success: true, 
    registeredEvents, 
    submittedPapers: submittedPapers as unknown as SubmittedPaper[] 
  };
  } catch (error) {
    console.error("Error getting submission data:", error);
    return { success: false, error: String(error) };
  }
}

export async function submitNewPaper(data: z.infer<typeof paperSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = parseInt(session.user.id);

    // Validate input
    const result = paperSchema.safeParse(data);
    if (!result.success) {
      throw new Error(result.error.issues[0].message);
    }
    const validatedData = result.data;

    const { penulis, ...paperData } = validatedData;

    const approvedRegistration = await db
      .select()
      .from(pendaftaran)
      .where(and(
          eq(pendaftaran.eventId, validatedData.eventId),
          eq(pendaftaran.userId, userId),
          sql`${pendaftaran.status} IN ('terdaftar', 'hadir', 'lunas')`
        )
      )
      .limit(1);

    if (approvedRegistration.length === 0) {
      throw new Error("Pendaftaran event Anda belum disetujui. Anda hanya dapat mengirim paper jika status pendaftaran telah diverifikasi.");
    }

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
          ...paperData,
          status: 'review',
          komentarPenolakan: null,
          dibuatPada: new Date(),
        })
        .where(eq(paperSubmission.id, existing[0].id));

      await db.delete(penulisPaper).where(eq(penulisPaper.paperSubmissionId, existing[0].id));
      if (penulis && penulis.length > 0) {
        await db.insert(penulisPaper).values(
          penulis.map((p, index) => ({
            paperSubmissionId: existing[0].id,
            nama: p.nama,
            email: p.email,
            institusi: p.afiliasi,
            isCorresponding: p.isCorresponding,
            urutan: index + 1
          }))
        );
      }
    } else {
      // New submission
      const [newSubmission] = await db.insert(paperSubmission).values({ ...paperData, userId }).returning({ id: paperSubmission.id });

      if (penulis && penulis.length > 0) {
        await db.insert(penulisPaper).values(
          penulis.map((p, index) => ({
            paperSubmissionId: newSubmission.id,
            nama: p.nama,
            email: p.email,
            institusi: p.afiliasi,
            isCorresponding: p.isCorresponding,
            urutan: index + 1
          }))
        );
      }
    }

    revalidatePath('/profile/submit-paper');
  } catch (error) {
    console.error("Error submitting paper:", error);
    throw error;
  }
}