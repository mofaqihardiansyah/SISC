"use server";

import { db } from "@/db";
import { paperSubmission, event, users } from "@/db/schema";
import { eq, desc, inArray, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export type PaperData = {
  id: number;
  judul: string;
  penulis: string;
  urlFile: string;
  status: string | null;
  komentarPenolakan: string | null;
  dibuatPada: Date | null;
  eventId: number;
  eventJudul: string | null;
  userNama: string | null;
  userEmail: string | null;
};

export type EventData = {
  id: number;
  judul: string | null;
};

export async function getOrganizerPapers() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized", data: [], events: [] };
  const userId = parseInt(session.user.id);

  const myEvents = await db
    .select({ id: event.id, judul: event.judul })
    .from(event)
    .where(eq(event.organizerId, userId));

  if (myEvents.length === 0) return { success: true, data: [], events: [] };

  const eventIds = myEvents.map(e => e.id);

  const papers = await db
    .select({
      id: paperSubmission.id,
      judul: paperSubmission.judul,
      penulis: sql<string>`COALESCE((SELECT string_agg(nama, ', ') FROM penulis_paper WHERE paper_submission_id = paper_submission.id), 'Unknown')`,
      urlFile: paperSubmission.urlFile,
      status: paperSubmission.status,
      komentarPenolakan: paperSubmission.komentarPenolakan,
      dibuatPada: paperSubmission.dibuatPada,
      eventId: paperSubmission.eventId,
      eventJudul: event.judul,
      userNama: users.namaLengkap,
      userEmail: users.email,
    })
    .from(paperSubmission)
    .innerJoin(event, eq(paperSubmission.eventId, event.id))
    .innerJoin(users, eq(paperSubmission.userId, users.id))
    .where(inArray(paperSubmission.eventId, eventIds))
    .orderBy(desc(paperSubmission.dibuatPada));

  return { success: true, data: papers as PaperData[], events: myEvents as EventData[] };
}

export async function updatePaperStatus(
  paperId: number,
  status: 'accepted' | 'rejected',
  komentarPenolakan?: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = parseInt(session.user.id);

  const paper = await db
    .select({ eventId: paperSubmission.eventId })
    .from(paperSubmission)
    .where(eq(paperSubmission.id, paperId))
    .limit(1);

  if (paper.length === 0) throw new Error("Paper tidak ditemukan");

  const eventOwner = await db
    .select({ organizerId: event.organizerId })
    .from(event)
    .where(eq(event.id, paper[0].eventId))
    .limit(1);

  if (eventOwner.length === 0 || eventOwner[0].organizerId !== userId) {
    throw new Error("Anda tidak memiliki akses untuk mereview paper ini.");
  }

  await db
    .update(paperSubmission)
    .set({
      status,
      komentarPenolakan: status === 'rejected' ? (komentarPenolakan || null) : null,
      diperbaruiPada: new Date(),
    })
    .where(eq(paperSubmission.id, paperId));

  revalidatePath('/penyelenggara/review-paper');
}