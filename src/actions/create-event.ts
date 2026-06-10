"use server";

import { db } from "@/db";
import { event } from "@/db/schema";
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
  const kuota = parseInt(formData.get("kuota") as string) || null;
  const linkEksternal = (formData.get("linkEksternal") as string)?.trim() || null;
  const kategoriId = parseInt(formData.get("kategoriId") as string) || null;
  const isDraft = formData.get("isDraft") === "true";
  const bannerFile = formData.get("banner") as File | null;

  // ── Parse metode pembayaran ──────────────────────────────────────
  const metodePembayaranRaw = formData.get("metodePembayaran") as string;
  let metodePembayaranList: MetodePembayaranInput[] = [];
  try {
    if (metodePembayaranRaw) metodePembayaranList = JSON.parse(metodePembayaranRaw);
  } catch {
    metodePembayaranList = [];
  }

  // ── Validasi ─────────────────────────────────────────────────────
  if (!judul) return { error: "Judul event wajib diisi." };
  if (!tanggalMulaiRaw) return { error: "Tanggal mulai wajib diisi." };

  const tanggalMulai = new Date(tanggalMulaiRaw);
  const tanggalSelesai = tanggalSelesaiRaw ? new Date(tanggalSelesaiRaw) : null;
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

  // ── Proses metode pembayaran ──────────────────────────────────────
  const bankTransfers = metodePembayaranList.filter((m) => m.jenis === "bank_transfer");
  const eWallets = metodePembayaranList.filter((m) => m.jenis === "e_wallet");

  const namaBank = bankTransfers[0]?.namaPenyedia || null;
  const nomorRekening = bankTransfers[0]?.nomorAkun || null;
  const pemilikRekening = bankTransfers[0]?.atasNama || null;
  const namaBankAlternatif = bankTransfers[1]?.namaPenyedia || null;
  const nomorRekeningAlternatif = bankTransfers[1]?.nomorAkun || null;
  const pemilikRekeningAlternatif = bankTransfers[1]?.atasNama || null;

  const namaEwallet = eWallets[0]?.namaPenyedia || null;
  const nomorEwallet = eWallets[0]?.nomorAkun || null;
  const pemilikEwallet = eWallets[0]?.atasNama || null;

  // ── Generate slug ─────────────────────────────────────────────────
  const baseSlug = judul
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  const slug = `${baseSlug}-${Date.now()}`;

  // ── Insert ke database ────────────────────────────────────────────
  try {
    await db.insert(event).values({
      organizerId: userId,
      judul,
      slug,
      jenisEvent,
      eventPolines,
      tipePlatform,
      tipeHarga,
      harga,
      detailLokasi,
      namaPembicara,
      deskripsi,
      syaratDanKetentuan,
      tanggalMulai,
      tanggalSelesai: tanggalSelesai ?? undefined,
      kuota,
      linkEksternal,
      kategoriId,
      urlBanner,
      status: isDraft ? "draft" : "pending",
      namaBank,
      nomorRekening,
      pemilikRekening,
      namaBankAlternatif,
      nomorRekeningAlternatif,
      pemilikRekeningAlternatif,
      namaEwallet,
      nomorEwallet,
      pemilikEwallet,
      // urlGambarQris dihapus — tidak diisi
    });

    return { success: true };
  } catch (err) {
    console.error("[CREATE_EVENT_ERROR]", err);
    return { error: "Terjadi kesalahan saat menyimpan event. Coba lagi." };
  }
}