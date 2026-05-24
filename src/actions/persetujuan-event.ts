"use server";

import { db } from "@/db";
import { event, kategori } from "@/db/schema";
import { eq, desc, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
};

export async function getPendingEvents() {
  try {
    const results = await db
      .select({
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
        pembicara: event.namaPembicara,
        peranPembicara: event.peranPembicara,
        syaratKetentuan: event.syaratDanKetentuan,
        alasanPenolakan: event.alasanPenolakan,
      })
      .from(event)
      .leftJoin(kategori, eq(event.kategoriId, kategori.id))
      .where(isNull(event.dihapusPada))
      .orderBy(desc(event.dibuatPada));

    const mapped: PendingEvent[] = results.map((r) => {
      const tglMulai = r.tanggalMulai ? new Date(r.tanggalMulai) : null;
      const tglSelesai = r.tanggalSelesai ? new Date(r.tanggalSelesai) : null;
      const tglDibuat = r.dibuatPada ? new Date(r.dibuatPada) : new Date();

      const formatDate = (d: Date) =>
        d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

      const formatTime = (d: Date) =>
        d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });

      const jamMulai = tglMulai ? formatTime(tglMulai) : "-";
      const jamSelesai = tglSelesai ? formatTime(tglSelesai) : "-";

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
        tanggalMasuk: `${formatDate(tglDibuat)}, ${formatTime(tglDibuat)}`,
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
        icon: getEventIcon(r.kategoriNama, r.judul),
      };
    });

    return { success: true, data: mapped };
  } catch (error) {
    console.error("[getPendingEvents] Error:", error);
    return { success: false, data: [], error: "Gagal mengambil data event" };
  }
}

export async function approveEvent(id: number) {
  try {
    await db
      .update(event)
      .set({ status: "published", diperbaruiPada: new Date() })
      .where(eq(event.id, id));

    revalidatePath("/admin/persetujuan-event");
    return { success: true, message: "Event berhasil disetujui" };
  } catch (error) {
    console.error("[approveEvent] Error:", error);
    return { success: false, error: "Gagal menyetujui event" };
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

    revalidatePath("/admin/persetujuan-event");
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


