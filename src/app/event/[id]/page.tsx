import { db } from "@/db";
import { event, pendaftaran } from "@/db/schema"; 
import { eq, ne, desc, and } from "drizzle-orm"; 
import { notFound } from "next/navigation";
import DetailEvent from "@/components/event/DetailEvent";
import ViewTracker from "@/components/event/ViewTracker";
import { PAGINATION, UI_TEXT, DEFAULT_REGISTRATION_STEPS, DEFAULT_TERMS } from "@/lib/constants";
import { auth } from "@/auth"; 

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HalamanDetailEvent({ params }: PageProps) {
  const { id } = await params;
  const eventId = parseInt(id);
  if (isNaN(eventId)) notFound();

  // 1. Ambil session user yang sedang login saat ini
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id) : null;
  const isLoggedIn = !!userId;

  // 2. Ambil data event, event terkait, dan status pendaftaran user secara paralel
  const [eventData, eventTerkait, dataPendaftaran] = await Promise.all([
    db.query.event.findFirst({
      where: eq(event.id, eventId),
      with: {
        kategori: true,
        pembicara: true, // 👈 Mengambil data pembicara dari tabel relasi baru
        organizer: {
          with: {
            profilPenyelenggara: true,
          },
        },
        kota: {
          with: {
            provinsi: true,
          },
        },
      },
    }),

    db.query.event.findMany({
      where: ne(event.id, eventId),
      limit: PAGINATION.RELATED_EVENTS_LIMIT,
      orderBy: [desc(event.jumlahTayangan)],
      with: {
        organizer: true,
        kategori: true,
        kota: true,
      },
    }),

    // Cek apakah user ini sudah terdaftar di event ini (hanya jika sudah login)
    userId
      ? db.query.pendaftaran.findFirst({
          where: and(
            eq(pendaftaran.eventId, eventId),
            eq(pendaftaran.userId, userId),
            ne(pendaftaran.status, "dibatalkan") 
          ),
        })
      : null,
  ]);

  if (!eventData) notFound();

  // Tentukan apakah user sudah terdaftar atau belum
  const isRegistered = !!dataPendaftaran;

  // 👈 Memformat nama pembicara menggunakan array relasi tabel pembicara yang baru
  const pembicaraUtama = eventData.pembicara?.[0];
  const namaPembicara = pembicaraUtama
    ? `${pembicaraUtama.nama}${
        pembicaraUtama.peran ? ` (${pembicaraUtama.peran})` : ""
      }`
    : null;

  // Nama penyelenggara
  const namaPenyelenggara =
    eventData.organizer?.profilPenyelenggara?.namaInstansi ??
    eventData.organizer?.namaLengkap ??
    UI_TEXT.NO_ORGANIZER_FALLBACK;

  // Lokasi lengkap
  const lokasiLengkap =
    [
      eventData.detailLokasi,
      eventData.kota?.nama,
      eventData.kota?.provinsi?.nama,
    ]
      .filter(Boolean)
      .join(", ") || UI_TEXT.NO_LOCATION_FALLBACK;

  // Format data untuk komponen
  const eventFormatted = {
    id: eventData.id,
    nama: eventData.judul ?? UI_TEXT.NO_TITLE,
    lokasi: lokasiLengkap,
    tanggal: eventData.tanggalMulai,
    kategori: eventData.kategori?.nama ?? "Umum",
    deskripsi: eventData.deskripsi,
    pembicara: namaPembicara,
    harga: eventData.harga,
    penyelenggara: namaPenyelenggara,
    gambar: eventData.urlBanner ?? null,
    tipePlatform: eventData.tipePlatform ?? "offline",
    eventPolines: eventData.eventPolines,
    hasilScraping: eventData.hasilScraping,
    websiteSumber: eventData.websiteSumber,
    linkEksternal: eventData.linkEksternal,
    loket: [],
    langkahPendaftaran: [...DEFAULT_REGISTRATION_STEPS],
    syaratKetentuan: eventData.syaratDanKetentuan
      ? eventData.syaratDanKetentuan.split("\n").filter(Boolean)
      : [...DEFAULT_TERMS],
    eventTerkait: eventTerkait.map((ev) => ({
      id: ev.id.toString(),
      title: ev.judul ?? UI_TEXT.NO_TITLE,
      date: ev.tanggalMulai
        ? new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(ev.tanggalMulai))
        : "TBA",
      price: ev.harga,
      category: ev.kategori?.nama ?? "Umum",
      type: ev.eventPolines ? "POLINES" : ("UMUM" as "POLINES" | "UMUM"),
      imageUrl: ev.urlBanner ?? "",
      tipePlatform: ev.tipePlatform ?? "offline",
      kotaNama: ev.kota?.nama ?? UI_TEXT.NO_ORGANIZER_FALLBACK,
      kategoriNama: ev.kategori?.nama ?? "Umum",
    })),
  };

  return (
    <>
      <ViewTracker eventId={eventId} />
      <DetailEvent 
        event={eventFormatted} 
        isLoggedIn={isLoggedIn} 
        isRegistered={isRegistered} 
      />
    </>
  );
}