"use server";

import { db } from "@/db";
import { paperSubmission, event, users } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export type Author = {
  nama: string;
  email: string;
  afiliasi: string;
  isCorresponding: boolean;
};

export type PaperData = {
  id: number;
  judul: string;
  kataKunci: string | null;
  track: string | null;
  penulis: Author[];
  fileUrl: string;
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

export type PapersResult = {
  success: boolean;
  data: PaperData[];
  events: EventData[];
  error?: string;
};

export async function getOrganizerPapers(): Promise<PapersResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized", data: [], events: [] };
  const userId = parseInt(session.user.id);
  const allEvents = await db
    .select({ id: event.id, judul: event.judul, tanggalSelesai: event.tanggalSelesai })
    .from(event)
    .where(eq(event.organizerId, userId));
  if (allEvents.length === 0) return { success: true, data: [], events: [] };
  const now = new Date();
  const activeEvents = allEvents
    .filter(e => !e.tanggalSelesai || e.tanggalSelesai > now)
    .map(({ id, judul }) => ({ id, judul }));
  const eventIds = allEvents.map(e => e.id);
  const papers = await db
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
      userNama: users.namaLengkap,
      userEmail: users.email,
    })
    .from(paperSubmission)
    .innerJoin(event, eq(paperSubmission.eventId, event.id))
    .innerJoin(users, eq(paperSubmission.userId, users.id))
    .where(inArray(paperSubmission.eventId, eventIds))
    .orderBy(desc(paperSubmission.dibuatPada));
  return { success: true, data: papers as unknown as PaperData[], events: activeEvents as EventData[] };
}

export async function updatePaperStatus(
  paperId: number,
  status: "accepted" | "rejected",
  komentarPenolakan?: string
): Promise<void> {
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
      komentarPenolakan: status === "rejected" ? (komentarPenolakan || null) : null,
      diperbaruiPada: new Date(),
    })
    .where(eq(paperSubmission.id, paperId));
  revalidatePath("/penyelenggara/review-papper");
}
