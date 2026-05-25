"use server";

import { db } from "@/db";
import { event } from "@/db/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function createEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = parseInt(session.user.id, 10);
  if (isNaN(userId)) redirect("/login");

  const judul = (formData.get("judul") as string)?.trim();
  const jenisEvent = formData.get("jenisEvent") as "seminar" | "conference";
  const isEventPolines = formData.get("isEventPolines") === "true";
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

  // Validasi wajib
  if (!judul) return { error: "Judul event wajib diisi." };
  if (!tanggalMulaiRaw) return { error: "Tanggal mulai wajib diisi." };

  const tanggalMulai = new Date(tanggalMulaiRaw);
  const tanggalSelesai = tanggalSelesaiRaw ? new Date(tanggalSelesaiRaw) : null;

  if (isNaN(tanggalMulai.getTime())) return { error: "Format tanggal mulai tidak valid." };

  // Upload banner (opsional)
  let bannerUrl: string | null = null;
  if (bannerFile && bannerFile.size > 0) {
    if (bannerFile.size > 5 * 1024 * 1024) {
      return { error: "Ukuran banner maksimal 5MB." };
    }

    const bytes = await bannerFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = bannerFile.name.split(".").pop() ?? "jpg";
    const fileName = `${uuidv4()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "banners");

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);

    bannerUrl = `/uploads/banners/${fileName}`;
  }

  // Generate slug
  const baseSlug = judul
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  const slug = `${baseSlug}-${Date.now()}`;

  // Insert ke database
  try {
    await db.insert(event).values({
      organizerId: userId,
      judul,
      slug,
      jenisEvent,
      isEventPolines,
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
      bannerUrl,
      status: isDraft ? "draft" : "pending", // ✅ sudah benar
    });

    return { success: true };
  } catch (err) {
    console.error("[CREATE_EVENT_ERROR]", err);
    return { error: "Terjadi kesalahan saat menyimpan event. Coba lagi." };
  }
}