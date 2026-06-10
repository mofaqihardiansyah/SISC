import { db } from "@/db";
import { event } from "@/db/schema";
import { eq, ne, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import DetailEvent from "@/components/event/DetailEvent";
import ViewTracker from "@/components/event/ViewTracker";
import { PAGINATION } from "@/lib/constants";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HalamanDetailEvent({ params }: PageProps) {
  const { id } = await params;
  const eventId = parseInt(id);
  if (isNaN(eventId)) notFound();

  const [eventData, eventTerkait] = await Promise.all([
    db.query.event.findFirst({
      where: eq(event.id, eventId),
      with: {
        kategori: true,
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
  ]);

  if (!eventData) notFound();

  // Nama pembicara
  const namaPembicara = eventData.namaPembicara
    ? `${eventData.namaPembicara}${
        eventData.peranPembicara ? ` (${eventData.peranPembicara})` : ""
      }`
    : null;

  // Nama penyelenggara
  const namaPenyelenggara =
    eventData.organizer?.profilPenyelenggara?.namaInstansi ??
    eventData.organizer?.namaLengkap ??
    "Panitia";

  // Lokasi lengkap
  const lokasiLengkap =
    [
      eventData.detailLokasi,
      eventData.kota?.nama,
      eventData.kota?.provinsi?.nama,
    ]
      .filter(Boolean)
      .join(", ") || "Lokasi belum ditentukan";

  // Format data untuk komponen
  const eventFormatted = {
    id: eventData.id,
    nama: eventData.judul ?? "Tanpa Judul",
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
    langkahPendaftaran: [
      "Klik <strong>Daftar</strong> untuk mengisi data diri awal",
      "Anda akan diarahkan ke formulir pendaftaran eksternal (GForm)",
      "Isi data yang dibutuhkan pada formulir tersebut hingga selesai",
      "Kembali ke tab sebelumnya dan klik <strong>Simpan dan Selesai</strong>",
      "Selamat, pendaftaran Anda telah tercatat!",
    ],
    syaratKetentuan: eventData.syaratDanKetentuan
      ? eventData.syaratDanKetentuan.split("\n").filter(Boolean)
      : [
          "Kegiatan bersifat offline yang dilaksanakan di Politeknik Negeri Semarang.",
          "Mohon mengecek kembali kebenaran dan kesesuaian data pemesan sebelum check out.",
          "Nama lengkap yang tercantum di data pemesan akan dijadikan acuan penulisan nama pada e-certificate.",
          "E-certificate akan dikirimkan paling lambat H+7 hari pelaksanaan kegiatan.",
          "Dengan melakukan registrasi ini, peserta sudah dianggap memahami seluruh syarat dan ketentuan.",
        ],
    eventTerkait: eventTerkait.map((ev) => ({
      id: ev.id.toString(),
      title: ev.judul ?? "Tanpa Judul",
      date: ev.tanggalMulai
        ? new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(ev.tanggalMulai))
        : "TBA",
      price: ev.harga,
      category: ev.kategori?.nama ?? "Umum",
      type: ev.eventPolines ? "POLINES" : "UMUM" as "POLINES" | "UMUM",
      imageUrl: ev.urlBanner ?? "",
      tipePlatform: ev.tipePlatform ?? "offline",
      kotaNama: ev.kota?.nama ?? "-",
      kategoriNama: ev.kategori?.nama ?? "Umum",
    })),
  };

  return (
    <>
      <ViewTracker eventId={eventId} />
      <DetailEvent event={eventFormatted} isLoggedIn={false} />
    </>
  );
}
