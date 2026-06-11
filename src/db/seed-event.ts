import { db } from "./index";
import { event, profilPenyelenggara, tag, eventTag, jadwalEvent, logAdmin, pembicara, infoPembayaran } from "./schema";
import { eq } from "drizzle-orm";
import { SEED } from "@/lib/constants";

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function futureDate(daysFromNow: number) {
  return new Date(Date.now() + daysFromNow * 86400000);
}

function eventTime(daysFromNow: number, hour: number) {
  const d = new Date(Date.now() + daysFromNow * 86400000);
  d.setHours(hour, 0, 0, 0);
  return d;
}

const DEFAULT_TERMS = `1. Peserta wajib melakukan registrasi melalui website SISC.
2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.
3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.
4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.
5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.
6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.
7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.
8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.`;

const eventsData = [
  // === SEMINARS + POLINES (6 Events) ===
  {
    id: 1, organizerId: 2, kategoriId: 1, kotaId: 2,
    judul: "Seminar Nasional AI & Big Data 2026", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: true, status: "published" as const, kuota: 200,
    urlBanner: "https://picsum.photos/seed/event1/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar nasional membahas perkembangan kecerdasan buatan dan pengolahan data skala besar di Indonesia.",
    detailLokasi: "Gedung Kuliah Bersama, Polines, Semarang",
    tanggalMulai: futureDate(30), tanggalSelesai: futureDate(30), batasRegistrasi: futureDate(28),
    namaKontak: "Panitia AI Polines", emailKontak: "ai@polines.ac.id", teleponKontak: "024-7473417",
    jumlahTayangan: 245, namaPembicara: "Dr. Eng. Ahmad Zaki", peranPembicara: "AI Researcher at Google",
    urlFotoPembicara: "https://picsum.photos/seed/speaker1/400/400"
  },
  {
    id: 11, organizerId: 2, kategoriId: 9, kotaId: 2,
    judul: "Seminar Manajemen E-Sports Polines", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 30000,
    eventPolines: true, status: "published" as const, kuota: 80,
    urlBanner: "https://picsum.photos/seed/event11/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar industri E-Sports mengenai taktik manajemen turnamen dan karir profesional di kampus.",
    detailLokasi: "GOR Polines, Semarang",
    tanggalMulai: futureDate(10), tanggalSelesai: futureDate(11), batasRegistrasi: futureDate(7),
    namaKontak: "UKM E-Sports", emailKontak: "esports@polines.ac.id", teleponKontak: "024-7473419",
    jumlahTayangan: 498, namaPembicara: "Jess No Limit", peranPembicara: "E-Sports Professional",
    urlFotoPembicara: "https://picsum.photos/seed/speaker11/400/400"
  },
  {
    id: 16, organizerId: 2, kategoriId: 3, kotaId: 2,
    judul: "Seminar Seni Digital & UI/UX Polines", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 40000,
    eventPolines: true, status: "published" as const, kuota: 150,
    urlBanner: "https://picsum.photos/seed/event16/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Integrasi seni digital dalam rancang bangun antarmuka pengguna yang estetik dan adaptif.",
    detailLokasi: "Gedung Sate Creative Hub Polines, Semarang",
    tanggalMulai: futureDate(25), tanggalSelesai: futureDate(27), batasRegistrasi: futureDate(22),
    namaKontak: "Creative Hub Polines", emailKontak: "creative@polines.ac.id", teleponKontak: "024-7473420",
    jumlahTayangan: 312, namaPembicara: "Rio Purba", peranPembicara: "UI/UX Designer & Mentor",
    urlFotoPembicara: "https://picsum.photos/seed/speaker16/400/400"
  },
  {
    id: 17, organizerId: 2, kategoriId: 1, kotaId: 2,
    judul: "Seminar Machine Learning Polines", jenisEvent: "seminar" as const,
    tipePlatform: "online" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: true, status: "published" as const, kuota: 500,
    urlBanner: "https://picsum.photos/seed/event17/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Pengenalan praktis dasar-dasar Machine Learning untuk mahasiswa dan dosen lingkungan Politeknik.",
    detailLokasi: "Live Streaming YouTube & Zoom Polines",
    tanggalMulai: futureDate(7), tanggalSelesai: futureDate(7), batasRegistrasi: futureDate(6),
    namaKontak: "ML Hub Polines", emailKontak: "ml@polines.ac.id", teleponKontak: "081999888777",
    jumlahTayangan: 721, namaPembicara: "Andrew Ng", peranPembicara: "AI Professor at Stanford",
    urlFotoPembicara: "https://picsum.photos/seed/speaker17/400/400"
  },
  {
    id: 19, organizerId: 2, kategoriId: 1, kotaId: 2,
    judul: "Seminar Riset Terapan Teknologi Elektro Polines", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: true, status: "published" as const, kuota: 120,
    urlBanner: "https://picsum.photos/seed/event1/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar ilmiah hasil riset terapan bidang sistem kendali pintar dan energi terbarukan di elektro.",
    detailLokasi: "Auditorium Direktorat Polines, Semarang",
    tanggalMulai: futureDate(15), tanggalSelesai: futureDate(15), batasRegistrasi: futureDate(12),
    namaKontak: "Himpunan Elektro", emailKontak: "hmte@polines.ac.id", teleponKontak: "024-7473421",
    jumlahTayangan: 180, namaPembicara: "Prof. Dr. Ir. Sunarno", peranPembicara: "Electrical Engineering Specialist",
    urlFotoPembicara: "https://picsum.photos/seed/speaker1/400/400"
  },
  {
    id: 20, organizerId: 2, kategoriId: 2, kotaId: 2,
    judul: "Seminar Kewirausahaan Mahasiswa Polines", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: true, status: "published" as const, kuota: 250,
    urlBanner: "https://picsum.photos/seed/event4/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Menanamkan mental wirausaha berbasis teknologi (technopreneurship) untuk mahasiswa vokasi.",
    detailLokasi: "Ruang Serbaguna Gedung C, Polines",
    tanggalMulai: futureDate(22), tanggalSelesai: futureDate(22), batasRegistrasi: futureDate(20),
    namaKontak: "Pusat Karir Polines", emailKontak: "pusatkarir@polines.ac.id", teleponKontak: "024-7473422",
    jumlahTayangan: 310, namaPembicara: "Dr. Sandiaga Uno", peranPembicara: "Entrepreneur & Advisor",
    urlFotoPembicara: "https://picsum.photos/seed/speaker4/400/400"
  },

  // === SEMINARS + UMUM (6 Events) ===
  {
    id: 4, organizerId: 2, kategoriId: 2, kotaId: null,
    judul: "Webinar Kewirausahaan Muda", jenisEvent: "seminar" as const,
    tipePlatform: "online" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: false, status: "published" as const, kuota: 1000,
    urlBanner: "https://picsum.photos/seed/event4/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Webinar interaktif gratis bagi wirausahawan muda yang ingin merintis bisnis dari nol.",
    detailLokasi: "Zoom Cloud Meetings & Youtube Live",
    tanggalMulai: futureDate(14), tanggalSelesai: futureDate(14), batasRegistrasi: futureDate(13),
    namaKontak: "Komunitas Wirausaha", emailKontak: "wirausaha@gmail.com", teleponKontak: "081234000111",
    jumlahTayangan: 567, linkEksternal: SEED.DEFAULT_TICKET_URL,
    namaPembicara: "Gibran Rakabuming", peranPembicara: "Entrepreneur & Mentor",
    urlFotoPembicara: "https://picsum.photos/seed/speaker4/400/400"
  },
  {
    id: 6, organizerId: 2, kategoriId: 6, kotaId: 5,
    judul: "Seminar Riset Pendidikan Inklusif", jenisEvent: "seminar" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "paid" as const, harga: 50000,
    eventPolines: false, status: "published" as const, kuota: 150,
    urlBanner: "https://picsum.photos/seed/event6/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar riset mendalam mengenai implementasi kurikulum inklusif di era pendidikan digital.",
    detailLokasi: "Auditorium UGM, Yogyakarta",
    tanggalMulai: futureDate(35), tanggalSelesai: futureDate(35), batasRegistrasi: futureDate(30),
    namaKontak: "Forum Pendidikan", emailKontak: "pendidikan@ugm.ac.id", teleponKontak: "0274-513096",
    jumlahTayangan: 120, namaPembicara: "Anies Baswedan", peranPembicara: "Education Consultant",
    urlFotoPembicara: "https://picsum.photos/seed/speaker6/400/400"
  },
  {
    id: 7, organizerId: 2, kategoriId: 7, kotaId: 5,
    judul: "Seminar Seni & Budaya Nusantara", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 25000,
    eventPolines: false, status: "published" as const, kuota: 300,
    urlBanner: "https://picsum.photos/seed/event7/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Eksplorasi warisan seni nusantara dan diskusi panel pelestarian budaya daerah tradisional.",
    detailLokasi: "Taman Budaya Yogyakarta",
    tanggalMulai: futureDate(50), tanggalSelesai: futureDate(52), batasRegistrasi: futureDate(48),
    namaKontak: "DKY Yogyakarta", emailKontak: "senibudaya@jogja.go.id", teleponKontak: "0274-523512",
    jumlahTayangan: 210, namaPembicara: "Didik Nini Thowok", peranPembicara: "Cultural Expert",
    urlFotoPembicara: "https://picsum.photos/seed/speaker7/400/400"
  },
  {
    id: 10, organizerId: 2, kategoriId: 8, kotaId: 10,
    judul: "Seminar Gaya Hidup Berkelanjutan", jenisEvent: "seminar" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: false, status: "published" as const, kuota: 200,
    urlBanner: "https://picsum.photos/seed/event10/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Gerakan zero waste dan aksi nyata menjaga ekosistem bumi dari kehidupan sehari-hari.",
    detailLokasi: "Bali Nusa Dua Convention Center",
    tanggalMulai: futureDate(55), tanggalSelesai: futureDate(55), batasRegistrasi: futureDate(50),
    namaKontak: "Green Foundation", emailKontak: "green@bali.org", teleponKontak: "0361-771234",
    jumlahTayangan: 267, namaPembicara: "Nadya Hutagalung", peranPembicara: "Environmental Activist",
    urlFotoPembicara: "https://picsum.photos/seed/speaker10/400/400"
  },
  {
    id: 13, organizerId: 2, kategoriId: 4, kotaId: 7,
    judul: "Seminar Pendidikan Vokasi Nasional", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: false, status: "published" as const, kuota: 300,
    urlBanner: "https://picsum.photos/seed/event13/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Kolaborasi antara perguruan tinggi vokasi dengan kebutuhan spesifik industri modern.",
    detailLokasi: "Hotel Claro Makassar",
    tanggalMulai: futureDate(70), tanggalSelesai: futureDate(72), batasRegistrasi: futureDate(65),
    namaKontak: "Forum Vokasi", emailKontak: "vokasi@makassar.id", teleponKontak: "0411-3621234",
    jumlahTayangan: 98, namaPembicara: "Nadiem Makarim", peranPembicara: "Minister of Education",
    urlFotoPembicara: "https://picsum.photos/seed/speaker13/400/400"
  },
  {
    id: 15, organizerId: 2, kategoriId: 5, kotaId: 8,
    judul: "Seminar Kesehatan Masyarakat Palembang", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: false, status: "published" as const, kuota: 100,
    urlBanner: "https://picsum.photos/seed/event15/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Penyuluhan berkala mengenai pentingnya hidup sehat dan deteksi dini penyakit kronis.",
    detailLokasi: "Puskesmas Kertapati, Palembang",
    tanggalMulai: futureDate(15), tanggalSelesai: futureDate(15), batasRegistrasi: futureDate(12),
    namaKontak: "Kesehatan Daerah", emailKontak: "kes@palembang.go.id", teleponKontak: "0711-3551234",
    jumlahTayangan: 114, namaPembicara: "dr. Tirta", peranPembicara: "Health Influencer & Doctor",
    urlFotoPembicara: "https://picsum.photos/seed/speaker15/400/400"
  },

  // === CONFERENCES + POLINES (6 Events) ===
  {
    id: 5, organizerId: 2, kategoriId: 1, kotaId: 2,
    judul: "Konferensi Smart Campus Polines", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: true, status: "published" as const, kuota: 100,
    urlBanner: "https://picsum.photos/seed/event5/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Konferensi hasil penelitian dan gagasan inovatif mengenai arsitektur sistem kampus cerdas terpadu.",
    detailLokasi: "Lab Komputer Gedung A, Polines",
    tanggalMulai: futureDate(21), tanggalSelesai: futureDate(23), batasRegistrasi: futureDate(18),
    namaKontak: "BEM Polines", emailKontak: "bem@polines.ac.id", teleponKontak: "024-7473418",
    jumlahTayangan: 234, namaPembicara: "Prof. Sujatmiko", peranPembicara: "IT Infrastructure Lead",
    urlFotoPembicara: "https://picsum.photos/seed/speaker5/400/400"
  },
  {
    id: 9, organizerId: 2, kategoriId: 4, kotaId: 2,
    judul: "Konferensi Sains & Teknologi Python Polines", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 75000,
    eventPolines: true, status: "published" as const, kuota: 60,
    urlBanner: "https://picsum.photos/seed/event9/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Pertemuan riset tingkat lanjut pemanfaatan ekosistem Python untuk sains komputasi dan matematika terapan.",
    detailLokasi: "Gedung Kuliah Bersama Lantai 4, Polines",
    tanggalMulai: futureDate(28), tanggalSelesai: futureDate(29), batasRegistrasi: futureDate(25),
    namaKontak: "Python Club Polines", emailKontak: "python@polines.ac.id", teleponKontak: "024-7473423",
    jumlahTayangan: 189, namaPembicara: "Guido van Rossum", peranPembicara: "Python Language Creator",
    urlFotoPembicara: "https://picsum.photos/seed/speaker9/400/400"
  },
  {
    id: 12, organizerId: 2, kategoriId: 2, kotaId: 2,
    judul: "Konferensi Digital Marketing Polines", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 50000,
    eventPolines: true, status: "published" as const, kuota: 120,
    urlBanner: "https://picsum.photos/seed/event12/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Konferensi riset taktis strategi pemasaran digital terapan bagi UMKM binaan Politeknik Negeri Semarang.",
    detailLokasi: "Aula Jurusan Administrasi Bisnis, Polines",
    tanggalMulai: futureDate(20), tanggalSelesai: futureDate(20), batasRegistrasi: futureDate(18),
    namaKontak: "Business Dept Polines", emailKontak: "bisnis@polines.ac.id", teleponKontak: "024-7473424",
    jumlahTayangan: 245, namaPembicara: "Denny Santoso", peranPembicara: "Digital Marketing Specialist",
    urlFotoPembicara: "https://picsum.photos/seed/speaker12/400/400"
  },
  {
    id: 14, organizerId: 2, kategoriId: 1, kotaId: 2,
    judul: "Konferensi Ethical Hacking Polines", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 90000,
    eventPolines: true, status: "published" as const, kuota: 80,
    urlBanner: "https://picsum.photos/seed/event14/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Konferensi dan sharing riset kerentanan siber untuk mewujudkan kedaulatan keamanan data nasional.",
    detailLokasi: "Lab Keamanan Jaringan Gedung C, Polines",
    tanggalMulai: futureDate(33), tanggalSelesai: futureDate(34), batasRegistrasi: futureDate(30),
    namaKontak: "Hacking Club Polines", emailKontak: "sec@polines.ac.id", teleponKontak: "024-7473425",
    jumlahTayangan: 312, namaPembicara: "Jim Geovedi", peranPembicara: "Ethical Hacking Specialist",
    urlFotoPembicara: "https://picsum.photos/seed/speaker14/400/400"
  },
  {
    id: 21, organizerId: 2, kategoriId: 1, kotaId: 2,
    judul: "Konferensi Nasional Teknologi Terapan Polines", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 50000,
    eventPolines: true, status: "published" as const, kuota: 150,
    urlBanner: "https://picsum.photos/seed/event2/1200/600",
    syaratDanKetentuan: DEFAULT_TERMS + "\n9. Paper wajib orisinal dan belum dipublikasikan.",
    deskripsi: "Konferensi nasional mempresentasikan hasil-hasil penelitian terapan terbaik dari perguruan tinggi vokasi di Indonesia.",
    detailLokasi: "Gedung Pusat Informasi Polines, Semarang",
    tanggalMulai: futureDate(42), tanggalSelesai: futureDate(43), batasRegistrasi: futureDate(38),
    namaKontak: "P3M Polines", emailKontak: "p3m@polines.ac.id", teleponKontak: "024-7473426",
    jumlahTayangan: 172, namaPembicara: "Prof. Ir. Totok Prasetyo", peranPembicara: "Director of Vocational Studies",
    urlFotoPembicara: "https://picsum.photos/seed/speaker2/400/400"
  },
  {
    id: 22, organizerId: 2, kategoriId: 4, kotaId: 2,
    judul: "Konferensi Riset Green Engineering & Energi Polines", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 35000,
    eventPolines: true, status: "published" as const, kuota: 100,
    urlBanner: "https://picsum.photos/seed/event5/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Konferensi ilmiah riset rekayasa hijau, manufaktur berkelanjutan, dan teknologi energi terbarukan di Polines.",
    detailLokasi: "Ruang Seminar Jurusan Teknik Mesin Polines",
    tanggalMulai: futureDate(48), tanggalSelesai: futureDate(49), batasRegistrasi: futureDate(44),
    namaKontak: "Mechanical Dept Polines", emailKontak: "mesin@polines.ac.id", teleponKontak: "024-7473427",
    jumlahTayangan: 145, namaPembicara: "Dr. Eng. Masribah", peranPembicara: "Renewable Energy Researcher",
    urlFotoPembicara: "https://picsum.photos/seed/speaker5/400/400"
  },

  // === CONFERENCES + UMUM (6 Events) ===
  {
    id: 2, organizerId: 2, kategoriId: 1, kotaId: 4,
    judul: "International Cybersecurity Conference 2026", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 75000,
    eventPolines: false, status: "published" as const, kuota: 50,
    urlBanner: "https://picsum.photos/seed/event2/1200/600",
    syaratDanKetentuan: DEFAULT_TERMS + "\n9. Membawa laptop pribadi dengan spesifikasi minimal RAM 8GB.",
    deskripsi: "Konferensi siber internasional intensif mengupas dasar keamanan digital dan ketahanan sistem cloud enterprise.",
    detailLokasi: "Bandung Digital Valley, Jl. Gegerkalong Hilir",
    tanggalMulai: futureDate(45), tanggalSelesai: futureDate(46), batasRegistrasi: futureDate(40),
    namaKontak: "Tim CyberSec", emailKontak: "cyber@event.id", teleponKontak: "022-1234567",
    jumlahTayangan: 198, namaPembicara: "Sarah Connor", peranPembicara: "Security Architect at Cyberdyne",
    urlFotoPembicara: "https://picsum.photos/seed/speaker2/400/400"
  },
  {
    id: 3, organizerId: 2, kategoriId: 5, kotaId: 11,
    judul: "Konferensi Kesehatan Digital Indonesia", jenisEvent: "conference" as const,
    tipePlatform: "online" as const, tipeHarga: "paid" as const, harga: 100000,
    eventPolines: false, status: "published" as const, kuota: 500,
    urlBanner: "https://picsum.photos/seed/event3/1200/600",
    syaratDanKetentuan: DEFAULT_TERMS + "\n9. Link Zoom akan dikirimkan H-1 melalui email terdaftar.",
    deskripsi: "Konferensi tahunan membahas pilar-pilar penting transformasi sistem rekam medis dan kesehatan digital.",
    detailLokasi: "Grand Ballroom Kempinski, Jakarta Pusat",
    tanggalMulai: futureDate(60), tanggalSelesai: futureDate(61), batasRegistrasi: futureDate(55),
    namaKontak: "Sekretariat KKDI", emailKontak: "info@kkdi.id", teleponKontak: "021-5551234",
    jumlahTayangan: 320, linkEksternal: SEED.DEFAULT_TICKET_URL,
    namaPembicara: "dr. Budi Santoso, Sp.KO", peranPembicara: "Chief Medical Officer",
    urlFotoPembicara: "https://picsum.photos/seed/speaker3/400/400"
  },
  {
    id: 8, organizerId: 2, kategoriId: 2, kotaId: 3,
    judul: "Career Conference 2026", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: false, status: "published" as const, kuota: 2000,
    urlBanner: "https://picsum.photos/seed/event8/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Konferensi karir terakreditasi nasional menghubungkan akademisi dengan narasumber andal berbagai industri global.",
    detailLokasi: "Grand City Convention, Surabaya",
    tanggalMulai: futureDate(40), tanggalSelesai: futureDate(42), batasRegistrasi: futureDate(38),
    namaKontak: "Panitia Career", emailKontak: "career@surabaya.id", teleponKontak: "031-8888999",
    jumlahTayangan: 890, namaPembicara: "Maudy Ayunda", peranPembicara: "Chief Career Officer at Zenius",
    urlFotoPembicara: "https://picsum.photos/seed/speaker8/400/400"
  },
  {
    id: 18, organizerId: 2, kategoriId: 7, kotaId: 1,
    judul: "Konferensi Musik Tradisional Aceh", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 35000,
    eventPolines: false, status: "published" as const, kuota: 500,
    urlBanner: "https://picsum.photos/seed/event18/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Konferensi riset ilmiah membedah struktur ritmik, sejarah perkembangan, dan orisinalitas alat musik adat Aceh.",
    detailLokasi: "Auditorium Unsyiah, Banda Aceh",
    tanggalMulai: futureDate(80), tanggalSelesai: futureDate(81), batasRegistrasi: futureDate(75),
    namaKontak: "Musik Unsyiah", emailKontak: "musik@unsyiah.ac.id", teleponKontak: "0651-7551174",
    jumlahTayangan: 120, namaPembicara: "Rafly Kande", peranPembicara: "Aceh Musician & Expert",
    urlFotoPembicara: "https://picsum.photos/seed/speaker18/400/400"
  },
  {
    id: 23, organizerId: 2, kategoriId: 1, kotaId: 12,
    judul: "International Web Development Conference 2026", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 150000,
    eventPolines: false, status: "published" as const, kuota: 400,
    urlBanner: "https://picsum.photos/seed/event9/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Konferensi riset inovasi dan teknik termutakhir seputar Next.js, React, compiler web, dan masa depan edge computing.",
    detailLokasi: "Menara BCA Grand Indonesia, Jakarta",
    tanggalMulai: futureDate(38), tanggalSelesai: futureDate(39), batasRegistrasi: futureDate(35),
    namaKontak: "Indo Web Community", emailKontak: "info@webdevconf.id", teleponKontak: "021-99887766",
    jumlahTayangan: 310, namaPembicara: "Dan Abramov", peranPembicara: "React Core Team Member",
    urlFotoPembicara: "https://picsum.photos/seed/speaker9/400/400"
  },
  {
    id: 24, organizerId: 2, kategoriId: 2, kotaId: 3,
    judul: "Asia-Pacific Business Strategy Conference", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 200000,
    eventPolines: false, status: "published" as const, kuota: 300,
    urlBanner: "https://picsum.photos/seed/event12/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Rapat riset dan kajian strategis model bisnis adaptif di pasar Asia-Pasifik menghadapi disrupsi teknologi berkelanjutan.",
    detailLokasi: "Shangri-La Hotel, Surabaya",
    tanggalMulai: futureDate(54), tanggalSelesai: futureDate(56), batasRegistrasi: futureDate(50),
    namaKontak: "AP Business Board", emailKontak: "ap@strategyboard.org", teleponKontak: "031-77665544",
    jumlahTayangan: 180, namaPembicara: "Eric Ries", peranPembicara: "Author of The Lean Startup",
    urlFotoPembicara: "https://picsum.photos/seed/speaker12/400/400"
  }
];

async function seedEventsTable() {
  console.log("🚀 Seeding 24 events...");
  for (const e of eventsData) {
    const s = slug(e.judul);
    
    const { namaPembicara, peranPembicara, urlFotoPembicara, ...eventDataRaw } = e;
    const linkEksternal = 'linkEksternal' in e ? e.linkEksternal : null;

    const values = {
      ...eventDataRaw,
      linkEksternal,
      slug: s,
      satuAkunSatuTransaksi: false,
      hasilScraping: false,
      dibuatPada: new Date(),
    };

    await db.insert(event).values(values).onConflictDoUpdate({
      target: event.slug,
      set: {
        judul: e.judul,
        status: e.status,
        harga: e.harga,
        urlBanner: e.urlBanner,
        syaratDanKetentuan: e.syaratDanKetentuan,
        jenisEvent: e.jenisEvent,
        kategoriId: e.kategoriId,
        jumlahTayangan: e.jumlahTayangan,
        linkEksternal,
        dibuatPada: new Date(),
      }
    });

    await db.delete(pembicara).where(eq(pembicara.eventId, e.id));
    await db.insert(pembicara).values({
      eventId: e.id,
      nama: namaPembicara,
      peran: peranPembicara,
      urlFoto: urlFotoPembicara,
    });
  }
  console.log("✅ 24 events seeded!");
}

async function seedAuxiliary() {
  console.log("🚀 Seeding auxiliary event data...");

  // Info Pembayaran (global)
  await db.delete(infoPembayaran);
  await db.insert(infoPembayaran).values([
    {
      id: 1,
      tipe: 'bank_transfer',
      namaBank: 'Bank Mandiri',
      nomorRekening: '132-000-1234-567',
      pemilikRekening: 'Panitia POLIVENTS',
    },
    {
      id: 2,
      tipe: 'qris',
      urlGambarQris: 'https://picsum.photos/seed/qris/400/400',
    }
  ]);

  // Profil Penyelenggara
  await db.insert(profilPenyelenggara).values({
    userId: 2,
    namaInstansi: "Politeknik Negeri Semarang",
    deskripsiInstansi: "Politeknik Negeri Semarang (Polines) adalah perguruan tinggi vokasi negeri yang fokus pada pendidikan terapan.",
    urlWebsite: SEED.DEFAULT_WEBSITE,
  }).onConflictDoUpdate({
    target: profilPenyelenggara.userId,
    set: { namaInstansi: "Politeknik Negeri Semarang" }
  });

  // Tags tambahan
  const extraTags = [
    { nama: "#AI" }, { nama: "#BigData" }, { nama: "#NextJS" },
    { nama: "#CyberSecurity" }, { nama: "#Webinar" }, { nama: "#Workshop" },
    { nama: "#Figma" }, { nama: "#ReactJS" }, { nama: "#Vokasi" }, { nama: "#HealthTech" },
  ];
  for (const t of extraTags) {
    await db.insert(tag).values(t).onConflictDoUpdate({ target: tag.nama, set: { nama: t.nama } });
  }

  // Event-Tag relations
  const eventTags = [
    { eventId: 1, tagId: 1 }, { eventId: 1, tagId: 2 },
    { eventId: 14, tagId: 4 }, { eventId: 17, tagId: 5 },
    { eventId: 2, tagId: 6 }, { eventId: 16, tagId: 7 },
  ];
  for (const et of eventTags) {
    await db.insert(eventTag).values(et).onConflictDoNothing();
  }

  // Jadwal Event
  const jadwal = [
    { eventId: 1, waktuMulai: eventTime(30, 9), waktuSelesai: eventTime(30, 12), deskripsi: "Sesi Utama: Masa Depan AI" },
    { eventId: 17, waktuMulai: eventTime(7, 19), waktuSelesai: eventTime(7, 21), deskripsi: "Intro to Machine Learning" },
  ];
  for (const j of jadwal) {
    await db.insert(jadwalEvent).values(j).onConflictDoNothing();
  }

  // Log Admin
  const logs = [
    { adminId: 1, eventId: 1, aksi: "approved", dataSebelumnya: { status: "pending" } },
    { adminId: 1, eventId: 18, aksi: "approved", dataSebelumnya: { status: "pending" } },
  ];
  for (const l of logs) {
    await db.insert(logAdmin).values(l);
  }

  console.log("✅ Auxiliary event data seeded!");
}

export async function seedEvent() {
  const start = Date.now();
  console.log("📦 [EVENT] Seeding events & related data...\n");
  await seedEventsTable();
  await seedAuxiliary();
  console.log(`\n✅ [EVENT] Done in ${((Date.now() - start) / 1000).toFixed(2)}s`);
}
