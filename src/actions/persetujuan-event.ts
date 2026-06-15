"use server";

import { db } from "@/db";
import { event, kategori } from "@/db/schema";
import { eq, asc, desc, isNull, ilike, count, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { PAGINATION } from "@/lib/constants";

export type PendingEvent = {
  id: number;
  judul: string;
  slug: string | null;
  kategori: string | null;
  platform: string | null;
  harga: string;
  tanggalMasuk: string;
  status: "pending" | "published" | "rejected";
  deskripsi: string | null;
  penyelenggara: string | null;
  tanggalMulai: Date | null;
  tanggalSelesai: Date | null;
  jamMulai: string;
  jamSelesai: string;
  lokasi: string | null;
  kuota: number | null;
  tipeHarga: string | null;
  hargaNominal: number | null;
  kontakEmail: string | null;
  kontakTelepon: string | null;
  linkEksternal: string | null;
  jenisEvent: string | null;
  pembicara: string | null;
  peranPembicara: string | null;
  syaratKetentuan: string | null;
  batasRegistrasi: Date | null;
  alasanPenolakan: string | null;
  icon: string;
  urlBanner: string | null;
};

const baseEventSelect = {
  id: event.id,
  judul: event.judul,
  slug: event.slug,
  kategoriNama: kategori.nama,
  platform: event.tipePlatform,
  tipeHarga: event.tipeHarga,
  harga: event.harga,
  status: event.status,
  dibuatPada: event.dibuatPada,
  deskripsi: event.deskripsi,
  penyelenggara: event.penyelenggara,
  tanggalMulai: event.tanggalMulai,
  tanggalSelesai: event.tanggalSelesai,
  batasRegistrasi: event.batasRegistrasi,
  lokasi: event.detailLokasi,
  kuota: event.kuota,
  kontakEmail: event.emailKontak,
  kontakTelepon: event.teleponKontak,
  linkEksternal: event.linkEksternal,
  jenisEvent: event.jenisEvent,
  pembicara: sql<string>`(SELECT string_agg(nama, ', ') FROM pembicara WHERE event_id = event.id)`,
  peranPembicara: sql<string>`(SELECT string_agg(peran, ', ') FROM pembicara WHERE event_id = event.id)`,
  syaratKetentuan: event.syaratDanKetentuan,
  alasanPenolakan: event.alasanPenolakan,
  urlBanner: event.urlBanner,
};

type EventRow = {
  id: number;
  judul: string;
  slug: string | null;
  kategoriNama: string | null;
  platform: string | null;
  tipeHarga: string | null;
  harga: number | null;
  status: string | null;
  dibuatPada: Date | null;
  deskripsi: string | null;
  penyelenggara: string | null;
  tanggalMulai: Date | null;
  tanggalSelesai: Date | null;
  batasRegistrasi: Date | null;
  lokasi: string | null;
  kuota: number | null;
  kontakEmail: string | null;
  kontakTelepon: string | null;
  linkEksternal: string | null;
  jenisEvent: string | null;
  pembicara: string | null;
  peranPembicara: string | null;
  syaratKetentuan: string | null;
  alasanPenolakan: string | null;
  urlBanner: string | null;
};

const baseWhere = isNull(event.dihapusPada);

function mapEvent(r: EventRow): PendingEvent {
  const tglMulai = r.tanggalMulai ? new Date(r.tanggalMulai) : null;
  const tglSelesai = r.tanggalSelesai ? new Date(r.tanggalSelesai) : null;
  const tglDibuat = r.dibuatPada ? new Date(r.dibuatPada) : new Date();

  const fmtDate = (d: Date) =>
    d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const fmtTime = (d: Date) =>
    d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });

  const jamMulai = tglMulai ? fmtTime(tglMulai) : "-";
  const jamSelesai = tglSelesai ? fmtTime(tglSelesai) : "-";

  const hargaStr =
    r.tipeHarga === "free"
      ? "Gratis"
      : `Rp ${(r.harga ?? 0).toLocaleString("id-ID")}`;

  return {
    id: r.id,
    judul: r.judul,
    slug: r.slug,
    kategori: r.kategoriNama,
    platform: r.platform === "offline" ? "Offline" : r.platform === "online" ? "Online" : r.platform === "hybrid" ? "Hybrid" : null,
    harga: hargaStr,
    tanggalMasuk: `${fmtDate(tglDibuat)}, ${fmtTime(tglDibuat)}`,
    status: (r.status || "pending") as "pending" | "published" | "rejected",
    deskripsi: r.deskripsi,
    penyelenggara: r.penyelenggara,
    tanggalMulai: tglMulai,
    tanggalSelesai: tglSelesai,
    jamMulai,
    jamSelesai,
    lokasi: r.lokasi,
    kuota: r.kuota,
    tipeHarga: r.tipeHarga,
    hargaNominal: r.harga,
    kontakEmail: r.kontakEmail,
    kontakTelepon: r.kontakTelepon,
    linkEksternal: r.linkEksternal,
    jenisEvent: r.jenisEvent === "seminar" ? "Seminar" : r.jenisEvent === "conference" ? "Conference" : null,
    pembicara: r.pembicara,
    peranPembicara: r.peranPembicara,
    syaratKetentuan: r.syaratKetentuan,
    batasRegistrasi: r.batasRegistrasi,
    alasanPenolakan: r.alasanPenolakan,
    urlBanner: r.urlBanner,
    icon: getEventIcon(r.kategoriNama, r.judul),
  };
}

export async function getPendingEvents(page = 1, pageSize = PAGINATION.PAGE_SIZE) {
  try {
    const offset = (page - 1) * pageSize;

    const [rows, totalRows] = await Promise.all([
      db
        .select(baseEventSelect)
        .from(event)
        .leftJoin(kategori, eq(event.kategoriId, kategori.id))
        .where(baseWhere)
        .orderBy(desc(event.dibuatPada))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ total: count() })
        .from(event)
        .where(baseWhere)
        .then((r) => Number(r[0]?.total ?? 0)),
    ]);

    return { success: true, data: rows.map(mapEvent), total: totalRows };
  } catch (error) {
    console.error("[getPendingEvents] Error:", error);
    return { success: false, data: [], total: 0, error: "Gagal mengambil data event" };
  }
}

export async function getEventStats() {
  try {
    const rows = await db
      .select({
        status: event.status,
        value: count(),
      })
      .from(event)
      .where(baseWhere)
      .groupBy(event.status);

    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    for (const r of rows) {
      if (r.status === "pending") pendingCount = Number(r.value);
      else if (r.status === "published") approvedCount = Number(r.value);
      else if (r.status === "rejected") rejectedCount = Number(r.value);
    }

    return { success: true, pendingCount, approvedCount, rejectedCount };
  } catch (error) {
    console.error("[getEventStats] Error:", error);
    return { success: false, pendingCount: 0, approvedCount: 0, rejectedCount: 0, error: "Gagal mengambil statistik" };
  }
}

export async function approveEvent(id: number) {
  try {
    await db
      .update(event)
      .set({ status: "published", diperbaruiPada: new Date() })
      .where(eq(event.id, id));

    revalidatePath("/admin/persetujuan");
    return { success: true, message: "Event berhasil disetujui" };
  } catch (error) {
    console.error("[approveEvent] Error:", error);
    return { success: false, error: "Gagal menyetujui event" };
  }
}

export async function updateEventStatus(id: number, newStatus: "pending" | "published" | "rejected") {
  try {
    await db
      .update(event)
      .set({ status: newStatus, diperbaruiPada: new Date() })
      .where(eq(event.id, id));

    revalidatePath("/admin/persetujuan");
    return { success: true, message: "Status event berhasil diubah" };
  } catch (error) {
    console.error("[updateEventStatus] Error:", error);
    return { success: false, error: "Gagal mengubah status event" };
  }
}

export async function rejectEvent(id: number, reason?: string) {
  try {
    await db
      .update(event)
      .set({
        status: "rejected",
        alasanPenolakan: reason || null,
        diperbaruiPada: new Date(),
      })
      .where(eq(event.id, id));

    revalidatePath("/admin/persetujuan");
    return { success: true, message: "Event berhasil ditolak" };
  } catch (error) {
    console.error("[rejectEvent] Error:", error);
    return { success: false, error: "Gagal menolak event" };
  }
}

function getEventIcon(kategori: string | null, judul: string): string {
  const k = (kategori || "").toLowerCase();
  const j = judul.toLowerCase();
  if (k.includes("teknologi") || k.includes("tech") || j.includes("tech") || j.includes("komputer") || j.includes("digital"))
    return "💻";
  if (k.includes("seni") || k.includes("budaya") || k.includes("musik") || k.includes("art"))
    return "🎭";
  if (k.includes("pendidikan") || k.includes("edukasi") || k.includes("edu") || k.includes("workshop") || j.includes("masterclass") || j.includes("course"))
    return "📚";
  if (k.includes("bisnis") || k.includes("business") || k.includes("startup") || k.includes("entrepreneur"))
    return "💼";
  if (k.includes("kesehatan") || k.includes("health") || k.includes("medis"))
    return "🏥";
  if (k.includes("olahraga") || k.includes("sport") || k.includes("fitness"))
    return "⚽";
  if (k.includes("musik") || k.includes("music") || k.includes("konser"))
    return "🎵";
  if (k.includes("makanan") || k.includes("food") || k.includes("kuliner"))
    return "🍽️";
  return "📅";
}

export async function searchEventTitles(query: string) {
  if (!query || query.trim().length === 0) return { success: true, data: [] };
  try {
    const results = await db
      .select({ id: event.id, judul: event.judul })
      .from(event)
      .where(ilike(event.judul, `%${query.trim()}%`))
      .limit(10);

    return { success: true, data: results };
  } catch (error) {
    console.error("[searchEventTitles] Error:", error);
    return { success: false, data: [], error: "Gagal mencari event" };
  }
}
