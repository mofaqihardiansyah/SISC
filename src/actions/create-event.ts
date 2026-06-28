"use server";

import { db } from "@/db";
import { event, pembicara, profilPenyelenggara } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";

// ── Hapus qrisImageBase64, qrisImageExt, qrisPreview ──
export type MetodePembayaranInput = {
  jenis: "bank_transfer" | "e_wallet";   // <-- qris dihapus
  namaPenyedia: string;
  nomorAkun?: string;
  atasNama?: string;
};

function parseMetodePembayaran(formData: FormData): MetodePembayaranInput[] {
  const raw = formData.get("metodePembayaran") as string;
  try {
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function parseBatasRegistrasi(raw: string | null): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

export async function createEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = parseInt(session.user.id, 10);
  if (isNaN(userId)) redirect("/login");

  // ── Field utama ─────────────────────────────────────────────────
  const judul = (formData.get("judul") as string)?.trim();
  const jenisEvent = formData.get("jenisEvent") as "seminar" | "conference";
  const eventPolines = formData.get("eventPolines") === "true";
  const tipePlatform = formData.get("tipePlatform") as "online" | "offline" | "hybrid";
  const tipeHarga = formData.get("tipeHarga") as "free" | "paid";
  const harga = parseInt(formData.get("harga") as string) || 0;
  const detailLokasi = (formData.get("detailLokasi") as string)?.trim() || null;
  const namaPembicara = (formData.get("namaPembicara") as string)?.trim() || null;
  const deskripsi = (formData.get("deskripsi") as string)?.trim() || null;
  const syaratDanKetentuan = (formData.get("syaratDanKetentuan") as string)?.trim() || null;
  const tanggalMulaiRaw = formData.get("tanggalMulai") as string;
  const tanggalSelesaiRaw = formData.get("tanggalSelesai") as string;
  const batasRegistrasiRaw = formData.get("batasRegistrasi") as string;
  const kuota = parseInt(formData.get("kuota") as string) || null;
  const linkEksternal = (formData.get("linkEksternal") as string)?.trim() || null;
  const kategoriId = parseInt(formData.get("kategoriId") as string) || null;
  const kotaId = parseInt(formData.get("kotaId") as string) || null;
  const isDraft = formData.get("isDraft") === "true";
  const bannerFile = formData.get("banner") as File | null;

  // ── Ambil nama penyelenggara dari profil organizer ────────────────
  const [profil] = await db.select().from(profilPenyelenggara)
    .where(eq(profilPenyelenggara.userId, userId)).limit(1);
  const penyelenggara = profil?.namaInstansi || null;

  // ── Parse metode pembayaran ──────────────────────────────────────
  const metodePembayaranList = parseMetodePembayaran(formData);

  // ── Validasi ─────────────────────────────────────────────────────
  if (!judul) return { error: "Judul event wajib diisi." };
  if (!tanggalMulaiRaw) return { error: "Tanggal mulai wajib diisi." };

  const tanggalMulai = new Date(tanggalMulaiRaw);
  const tanggalSelesai = tanggalSelesaiRaw ? new Date(tanggalSelesaiRaw) : null;
  const batasRegistrasi = parseBatasRegistrasi(batasRegistrasiRaw);
  if (isNaN(tanggalMulai.getTime())) return { error: "Format tanggal mulai tidak valid." };

  // ── Upload banner ─────────────────────────────────────────────────
  let urlBanner: string | null = null;
  if (bannerFile && bannerFile.size > 0) {
    if (bannerFile.size > 5 * 1024 * 1024) return { error: "Ukuran banner maksimal 5MB." };
    const ext = bannerFile.name.split(".").pop() ?? "jpg";
    const fileName = `uploads/banners/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const blob = await put(fileName, bannerFile, { access: 'public', addRandomSuffix: false });
    urlBanner = blob.url;
  }

  // ── Generate slug ─────────────────────────────────────────────────
  const baseSlug = judul
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  const slug = `${baseSlug}-${Date.now()}`;

  // ── Insert ke database ────────────────────────────────────────────
  try {
    const [newEvent] = await db.insert(event).values({
      organizerId: userId,
      judul,
      slug,
      jenisEvent,
      eventPolines,
      tipePlatform,
      tipeHarga,
      harga,
      detailLokasi,
      deskripsi,
      syaratDanKetentuan,
      tanggalMulai,
      tanggalSelesai: tanggalSelesai ?? undefined,
      batasRegistrasi: batasRegistrasi ?? undefined,
      kuota,
      linkEksternal,
      kategoriId,
      kotaId,
      penyelenggara,
      metodePembayaran: metodePembayaranList.length > 0 ? metodePembayaranList : null,
      urlBanner,
      status: isDraft ? "draft" : "pending",
    }).returning({ id: event.id });

    if (namaPembicara) {
      await db.insert(pembicara).values({
        eventId: newEvent.id,
        nama: namaPembicara,
      });
    }

    return { success: true };
  } catch (err) {
    console.error("[CREATE_EVENT_ERROR]", err);
    return { error: "Terjadi kesalahan saat menyimpan event. Coba lagi." };
  }
}

export async function updateEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = parseInt(session.user.id, 10);
  if (isNaN(userId)) redirect("/login");

  const eventId = parseInt(formData.get("eventId") as string);
  if (!eventId) return { error: "ID event tidak valid." };

  // ── Pastikan event milik user ini ──────────────────────────────────
  const [existing] = await db
    .select({ id: event.id, organizerId: event.organizerId, urlBanner: event.urlBanner })
    .from(event)
    .where(eq(event.id, eventId))
    .limit(1);

  if (!existing) return { error: "Event tidak ditemukan." };
  if (existing.organizerId !== userId) return { error: "Forbidden." };

  // ── Field utama ─────────────────────────────────────────────────
  const judul = (formData.get("judul") as string)?.trim();
  const jenisEvent = formData.get("jenisEvent") as "seminar" | "conference";
  const eventPolines = formData.get("eventPolines") === "true";
  const tipePlatform = formData.get("tipePlatform") as "online" | "offline" | "hybrid";
  const tipeHarga = formData.get("tipeHarga") as "free" | "paid";
  const harga = parseInt(formData.get("harga") as string) || 0;
  const detailLokasi = (formData.get("detailLokasi") as string)?.trim() || null;
  const namaPembicara = (formData.get("namaPembicara") as string)?.trim() || null;
  const deskripsi = (formData.get("deskripsi") as string)?.trim() || null;
  const syaratDanKetentuan = (formData.get("syaratDanKetentuan") as string)?.trim() || null;
  const tanggalMulaiRaw = formData.get("tanggalMulai") as string;
  const tanggalSelesaiRaw = formData.get("tanggalSelesai") as string;
  const batasRegistrasiRaw = formData.get("batasRegistrasi") as string;
  const kuota = parseInt(formData.get("kuota") as string) || null;
  const linkEksternal = (formData.get("linkEksternal") as string)?.trim() || null;
  const kategoriId = parseInt(formData.get("kategoriId") as string) || null;
  const kotaId = parseInt(formData.get("kotaId") as string) || null;
  const isDraft = formData.get("isDraft") === "true";
  const bannerFile = formData.get("banner") as File | null;

  // ── Parse metode pembayaran ──────────────────────────────────────
  const metodePembayaranList = parseMetodePembayaran(formData);

  // ── Validasi ─────────────────────────────────────────────────────
  if (!judul) return { error: "Judul event wajib diisi." };
  if (!tanggalMulaiRaw) return { error: "Tanggal mulai wajib diisi." };

  const tanggalMulai = new Date(tanggalMulaiRaw);
  const tanggalSelesai = tanggalSelesaiRaw ? new Date(tanggalSelesaiRaw) : null;
  const batasRegistrasi = parseBatasRegistrasi(batasRegistrasiRaw);
  if (isNaN(tanggalMulai.getTime())) return { error: "Format tanggal mulai tidak valid." };

  // ── Upload banner (hanya jika ada file baru) ──────────────────────
  let urlBanner = existing.urlBanner;
  if (bannerFile && bannerFile.size > 0) {
    if (bannerFile.size > 5 * 1024 * 1024) return { error: "Ukuran banner maksimal 5MB." };
    const ext = bannerFile.name.split(".").pop() ?? "jpg";
    const fileName = `uploads/banners/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const blob = await put(fileName, bannerFile, { access: 'public', addRandomSuffix: false });
    urlBanner = blob.url;
  }

  // ── Update ke database ────────────────────────────────────────────
  try {
    await db.update(event)
      .set({
        judul,
        jenisEvent,
        eventPolines,
        tipePlatform,
        tipeHarga,
        harga,
        detailLokasi,
        deskripsi,
        syaratDanKetentuan,
        tanggalMulai,
        tanggalSelesai: tanggalSelesai ?? undefined,
        batasRegistrasi: batasRegistrasi ?? undefined,
        kuota,
        linkEksternal,
        kategoriId,
        kotaId,
        metodePembayaran: metodePembayaranList.length > 0 ? metodePembayaranList : null,
        urlBanner,
        status: isDraft ? "draft" : "pending",
        diperbaruiPada: new Date(),
      })
      .where(eq(event.id, eventId));

    // ── Update pembicara (delete all then re-insert) ────────────────
    await db.delete(pembicara).where(eq(pembicara.eventId, eventId));
    if (namaPembicara) {
      await db.insert(pembicara).values({
        eventId,
        nama: namaPembicara,
      });
    }

    return { success: true };
  } catch (err) {
    console.error("[UPDATE_EVENT_ERROR]", err);
    return { error: "Terjadi kesalahan saat menyimpan event. Coba lagi." };
  }
}