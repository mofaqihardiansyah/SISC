import { db } from "@/db";
import { event } from "@/db/schema";
import { eq, ne, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import DetailEvent from "@/components/event/DetailEvent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HalamanDetailEvent({ params }: PageProps) {
  const { id } = await params;
  const eventId = parseInt(id);
  if (isNaN(eventId)) notFound();

  // Ambil data event beserta relasinya
  const eventData = await db.query.event.findFirst({
    where: eq(event.id, eventId),
    with: {
      kategori: true,
      organizer: {
        with: {
          profilPenyelenggara: true,
        },
      },
      pembicara: true,
      kota: {
        with: {
          provinsi: true,
        },
      },
    },
  });

  if (!eventData) notFound();

  // Ambil event terkait
  const eventTerkait = await db.query.event.findMany({
    where: ne(event.id, eventId),
    limit: 3,
    orderBy: [desc(event.jumlahTayangan)],
    with: {
      organizer: true,
      kategori: true,
    },
  });

  // Nama pembicara
  const namaPembicara =
    eventData.pembicara.length > 0
      ? eventData.pembicara.map((p) => `${p.nama} (${p.peran})`).join(", ")
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
    gambar: eventData.bannerUrl ?? null,
    tipePlatform: eventData.tipePlatform ?? "offline",
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
      id: ev.id,
      nama: ev.judul ?? "Tanpa Judul",
      tanggal: ev.tanggalMulai
        ? new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(ev.tanggalMulai))
        : "TBA",
      harga: ev.harga,
      penyelenggara: ev.organizer?.namaLengkap ?? "Panitia",
      gambar: ev.bannerUrl ?? "",
    })),
  };

 return <DetailEvent event={eventFormatted} />;
}
