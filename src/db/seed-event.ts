import { db } from "./index";
import { event, profilPenyelenggara, pembicara, infoPembayaran } from "./schema";
import { eq, sql } from "drizzle-orm";

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function futureDate(daysFromNow: number) {
  return new Date(Date.now() + daysFromNow * 86400000);
}

const DEFAULT_TERMS = `1. Peserta wajib melakukan registrasi melalui website SISC.
2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.
3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.
4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.
5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.
6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.
7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.
8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.`;

const ORGANIZER_NAME = "Politeknik Negeri Semarang";

const eventsData = [
  // === SEMINARS (Professional) ===
  {
    id: 1, organizerId: 2, kategoriId: 1, kotaId: 2,
    judul: "Seminar Nasional Transformasi Digital di Era Industri 5.0", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: true, status: "published" as const, kuota: 300, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event1/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar nasional membahas strategi adaptasi industri dalam menyongsong revolusi industri 5.0 yang berfokus pada kolaborasi manusia-mesin.",
    detailLokasi: "Auditorium Utama, Polines, Semarang",
    tanggalMulai: futureDate(30), tanggalSelesai: futureDate(30), batasRegistrasi: futureDate(28),
    jumlahTayangan: 1250, namaPembicara: "Dr. Eng. Ahmad Zaki", peranPembicara: "Industry 5.0 Specialist",
    urlFotoPembicara: "https://picsum.photos/seed/speaker1/400/400"
  },
  {
    id: 2, organizerId: 2, kategoriId: 4, kotaId: 11,
    judul: "Seminar Strategi Pemasaran Digital untuk UMKM Berdaya Saing", jenisEvent: "seminar" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "paid" as const, harga: 150000,
    eventPolines: false, status: "published" as const, kuota: 200, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event2/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar mendalam mengenai teknik pemasaran digital, optimasi media sosial, dan branding untuk meningkatkan skala bisnis UMKM.",
    detailLokasi: "Grand Ballroom, Jakarta",
    tanggalMulai: futureDate(45), tanggalSelesai: futureDate(45), batasRegistrasi: futureDate(40),
    jumlahTayangan: 2800, namaPembicara: "Denny Santoso", peranPembicara: "Digital Marketing Mentor",
    urlFotoPembicara: "https://picsum.photos/seed/speaker2/400/400"
  },
  {
    id: 3, organizerId: 2, kategoriId: 5, kotaId: 3,
    judul: "Seminar Global Health Summit: Health Tech Innovation", jenisEvent: "seminar" as const,
    tipePlatform: "online" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: false, status: "published" as const, kuota: 1000, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event3/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Membahas inovasi teknologi kesehatan terkini, mulai dari telemedicine hingga pemanfaatan AI dalam diagnosis medis.",
    detailLokasi: "Zoom Virtual Event",
    tanggalMulai: futureDate(60), tanggalSelesai: futureDate(60), batasRegistrasi: futureDate(58),
    jumlahTayangan: 4500, namaPembicara: "dr. Tirta", peranPembicara: "Health Influencer & Doctor",
    urlFotoPembicara: "https://picsum.photos/seed/speaker3/400/400"
  },

  // === CONFERENCES (Professional) ===
  {
    id: 4, organizerId: 2, kategoriId: 1, kotaId: 2,
    judul: "International Conference on Artificial Intelligence and Robotics 2026", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 500000,
    eventPolines: true, status: "published" as const, kuota: 500, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event4/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Konferensi internasional tahunan yang mengundang peneliti, akademisi, dan praktisi AI serta robotika dari seluruh dunia.",
    detailLokasi: "Gedung Pusat Informasi, Polines",
    tanggalMulai: futureDate(90), tanggalSelesai: futureDate(92), batasRegistrasi: futureDate(80),
    jumlahTayangan: 3200, namaPembicara: "Prof. Andrew Ng", peranPembicara: "AI Professor at Stanford",
    urlFotoPembicara: "https://picsum.photos/seed/speaker4/400/400"
  },
  {
    id: 5, organizerId: 2, kategoriId: 4, kotaId: 3,
    judul: "World Economic Forum: Future of Sustainable Finance", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 750000,
    eventPolines: false, status: "published" as const, kuota: 300, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event5/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Membahas masa depan keuangan berkelanjutan dan peran ESG (Environmental, Social, and Governance) dalam ekonomi global.",
    detailLokasi: "Shangri-La Hotel, Surabaya",
    tanggalMulai: futureDate(120), tanggalSelesai: futureDate(122), batasRegistrasi: futureDate(110),
    jumlahTayangan: 5000, namaPembicara: "Sri Mulyani Indrawati", peranPembicara: "Minister of Finance RI",
    urlFotoPembicara: "https://picsum.photos/seed/speaker5/400/400"
  },
  {
    id: 6, organizerId: 2, kategoriId: 11, kotaId: 12,
    judul: "International Symposium on Renewable Energy and Climate Change", jenisEvent: "conference" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "paid" as const, harga: 300000,
    eventPolines: false, status: "published" as const, kuota: 400, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event6/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Symposium riset inovasi energi terbarukan dan mitigasi perubahan iklim global.",
    detailLokasi: "Menara BCA Grand Indonesia, Jakarta",
    tanggalMulai: futureDate(150), tanggalSelesai: futureDate(152), batasRegistrasi: futureDate(140),
    jumlahTayangan: 2100, namaPembicara: "Dr. Eng. Masribah", peranPembicara: "Renewable Energy Researcher",
    urlFotoPembicara: "https://picsum.photos/seed/speaker6/400/400"
  },
  
  // === NEW POLINES EVENTS ===
  {
    id: 7, organizerId: 2, kategoriId: 4, kotaId: 2,
    judul: "Workshop Nasional Cybersecurity: Ethical Hacking for Beginners", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 75000,
    eventPolines: true, status: "published" as const, kuota: 100, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event7/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Workshop intensif selama satu hari tentang dasar-dasar ethical hacking, penetration testing, dan cara mengamankan sistem.",
    detailLokasi: "Laboratorium Komputer, Gedung MST Polines",
    tanggalMulai: futureDate(15), tanggalSelesai: futureDate(15), batasRegistrasi: futureDate(13),
    jumlahTayangan: 850, namaPembicara: "Budi Santoso, CEH", peranPembicara: "Cybersecurity Analyst",
    urlFotoPembicara: "https://picsum.photos/seed/speaker7/400/400"
  },
  {
    id: 8, organizerId: 2, kategoriId: 1, kotaId: 2,
    judul: "Pelatihan UI/UX Design: From Wireframe to Prototype", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 50000,
    eventPolines: true, status: "published" as const, kuota: 150, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event8/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Pelatihan praktis desain UI/UX menggunakan Figma. Peserta akan diajarkan mulai dari research, wireframing, hingga interaktif prototype.",
    detailLokasi: "Ruang Serbaguna, Polines",
    tanggalMulai: futureDate(20), tanggalSelesai: futureDate(21), batasRegistrasi: futureDate(18),
    jumlahTayangan: 1120, namaPembicara: "Siti Aminah", peranPembicara: "Senior Product Designer",
    urlFotoPembicara: "https://picsum.photos/seed/speaker8/400/400"
  },
  {
    id: 9, organizerId: 2, kategoriId: 11, kotaId: 2,
    judul: "Seminar Technopreneurship: Membangun Startup dari Kampus", jenisEvent: "seminar" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "paid" as const, harga: 35000,
    eventPolines: true, status: "published" as const, kuota: 250, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event9/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Menggali potensi mahasiswa dalam membangun startup berbasis teknologi. Dibahas cara mencari ide, validasi, dan pitching ke investor.",
    detailLokasi: "Auditorium Tata Niaga, Polines",
    tanggalMulai: futureDate(40), tanggalSelesai: futureDate(40), batasRegistrasi: futureDate(35),
    jumlahTayangan: 940, namaPembicara: "Andi Wijaya", peranPembicara: "Startup Founder & CEO",
    urlFotoPembicara: "https://picsum.photos/seed/speaker9/400/400"
  },
  {
    id: 10, organizerId: 2, kategoriId: 4, kotaId: 2,
    judul: "Polines Career Fest 2026: Siap Kerja di Era Digital", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: true, status: "published" as const, kuota: 1000, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event10/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Festival karir terbesar di Polines yang menghadirkan puluhan perusahaan multinasional dan seminar persiapan karir.",
    detailLokasi: "Lapangan Utama, Polines",
    tanggalMulai: futureDate(60), tanggalSelesai: futureDate(62), batasRegistrasi: futureDate(55),
    jumlahTayangan: 5200, namaPembicara: "Diana Putri", peranPembicara: "HR Director Tech Co.",
    urlFotoPembicara: "https://picsum.photos/seed/speaker10/400/400"
  },

  // ========== TAMBAHAN 15 EVENT POLINES (id 11-25) ==========
  {
    id: 11, organizerId: 2, kategoriId: 3, kotaId: 229,
    judul: "Lomba Inovasi Alat Kontrol Berbasis IoT untuk Pertanian Cerdas", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 100000,
    eventPolines: true, status: "published" as const, kuota: 80, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event11/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Konferensi dan lomba inovasi alat kontrol berbasis IoT yang dirancang khusus untuk mendukung pertanian cerdas di Indonesia.",
    detailLokasi: "Gedung M-01, Jurusan Teknik Elektro, Polines",
    tanggalMulai: futureDate(35), tanggalSelesai: futureDate(36), batasRegistrasi: futureDate(30),
    jumlahTayangan: 1600, namaPembicara: "Ir. Haryanto, M.T.", peranPembicara: "IoT Researcher",
    urlFotoPembicara: "https://picsum.photos/seed/speaker11/400/400"
  },
  {
    id: 12, organizerId: 2, kategoriId: 2, kotaId: 229,
    judul: "Seminar Matematika Terapan: Pemodelan Data untuk Industri 4.0", jenisEvent: "seminar" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: true, status: "published" as const, kuota: 200, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event12/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar yang membahas penerapan matematika terapan dan pemodelan data dalam mendukung transformasi industri 4.0.",
    detailLokasi: "Aula Jurusan Teknik Sipil, Polines & Zoom",
    tanggalMulai: futureDate(50), tanggalSelesai: futureDate(50), batasRegistrasi: futureDate(45),
    jumlahTayangan: 720, namaPembicara: "Prof. Dr. Sutrisno, M.Sc.", peranPembicara: "Applied Mathematician",
    urlFotoPembicara: "https://picsum.photos/seed/speaker12/400/400"
  },
  {
    id: 13, organizerId: 2, kategoriId: 4, kotaId: 229,
    judul: "Pelatihan Akuntansi Digital dan Perpajakan untuk Mahasiswa", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 45000,
    eventPolines: true, status: "published" as const, kuota: 120, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event13/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Pelatihan akuntansi digital menggunakan software akuntansi terkini dan pemahaman perpajakan bagi mahasiswa akuntansi.",
    detailLokasi: "Lab Komputer Jurusan Akuntansi, Polines",
    tanggalMulai: futureDate(22), tanggalSelesai: futureDate(23), batasRegistrasi: futureDate(18),
    jumlahTayangan: 930, namaPembicara: "Rina Marlina, S.E., Ak.", peranPembicara: "Certified Accountant",
    urlFotoPembicara: "https://picsum.photos/seed/speaker13/400/400"
  },
  {
    id: 14, organizerId: 2, kategoriId: 7, kotaId: 229,
    judul: "Pameran Seni Mahasiswa: Ekspresi Budaya Nusantara", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: true, status: "published" as const, kuota: 500, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event14/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Pameran seni yang menampilkan karya-karya mahasiswa Polines dalam berbagai bentuk ekspresi budaya Nusantara.",
    detailLokasi: "Gedung Serbaguna, Polines",
    tanggalMulai: futureDate(70), tanggalSelesai: futureDate(73), batasRegistrasi: futureDate(68),
    jumlahTayangan: 2100, namaPembicara: "Eko Priyanto, S.Sn.", peranPembicara: "Curator & Artist",
    urlFotoPembicara: "https://picsum.photos/seed/speaker14/400/400"
  },
  {
    id: 15, organizerId: 2, kategoriId: 8, kotaId: 229,
    judul: "Seminar Hukum dan Sosial: Perlindungan Data Pribadi di Era Digital", jenisEvent: "seminar" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: true, status: "published" as const, kuota: 300, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event15/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar yang mengupas aspek hukum dan sosial terkait perlindungan data pribadi di tengah pesatnya transformasi digital.",
    detailLokasi: "Auditorium Teknik Kimia, Polines & Zoom",
    tanggalMulai: futureDate(55), tanggalSelesai: futureDate(55), batasRegistrasi: futureDate(50),
    jumlahTayangan: 1340, namaPembicara: "Dr. Yuliana Hapsari, S.H., M.H.", peranPembicara: "Legal Expert",
    urlFotoPembicara: "https://picsum.photos/seed/speaker15/400/400"
  },
  {
    id: 16, organizerId: 2, kategoriId: 9, kotaId: 229,
    judul: "Workshop Pertanian Vertikal: Solusi Pangan Perkotaan", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 30000,
    eventPolines: true, status: "published" as const, kuota: 60, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event16/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Workshop praktik pertanian vertikal (vertical farming) sebagai solusi ketahanan pangan di wilayah perkotaan.",
    detailLokasi: "Lahan Praktik Terpadu, Polines",
    tanggalMulai: futureDate(18), tanggalSelesai: futureDate(18), batasRegistrasi: futureDate(15),
    jumlahTayangan: 580, namaPembicara: "Ir. Slamet Riyadi", peranPembicara: "Agriculture Specialist",
    urlFotoPembicara: "https://picsum.photos/seed/speaker16/400/400"
  },
  {
    id: 17, organizerId: 2, kategoriId: 10, kotaId: 229,
    judul: "Conference Inovasi Pembelajaran Vokasi Berbasis Teknologi", jenisEvent: "conference" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "paid" as const, harga: 200000,
    eventPolines: true, status: "published" as const, kuota: 250, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event17/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Konferensi nasional yang menghadirkan praktisi pendidikan vokasi untuk berbagi inovasi pembelajaran berbasis teknologi.",
    detailLokasi: "Gedung Pusat Pembelajaran, Polines & Zoom",
    tanggalMulai: futureDate(95), tanggalSelesai: futureDate(97), batasRegistrasi: futureDate(85),
    jumlahTayangan: 3800, namaPembicara: "Prof. Dr. Eng. Agus Supriyanto", peranPembicara: "Vocational Education Expert",
    urlFotoPembicara: "https://picsum.photos/seed/speaker17/400/400"
  },
  {
    id: 18, organizerId: 2, kategoriId: 3, kotaId: 229,
    judul: "Lomba Rancang Bangun Robot Line Follower Polines 2026", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 75000,
    eventPolines: true, status: "published" as const, kuota: 40, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event18/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Kompetisi rancang bangun robot line follower antar mahasiswa se-Jawa Tengah sebagai ajang pengembangan talenta robotika.",
    detailLokasi: "GOR Polines",
    tanggalMulai: futureDate(110), tanggalSelesai: futureDate(111), batasRegistrasi: futureDate(100),
    jumlahTayangan: 2600, namaPembicara: "M. Fauzi, S.T., M.T.", peranPembicara: "Robotics Engineer",
    urlFotoPembicara: "https://picsum.photos/seed/speaker18/400/400"
  },
  {
    id: 19, organizerId: 2, kategoriId: 12, kotaId: 229,
    judul: "Seminar Kesehatan Mental untuk Mahasiswa: Stres Akademik dan Solusinya", jenisEvent: "seminar" as const,
    tipePlatform: "online" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: true, status: "published" as const, kuota: 500, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event19/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar online tentang manajemen stres akademik dan pentingnya menjaga kesehatan mental bagi mahasiswa di perkuliahan.",
    detailLokasi: "Zoom Webinar",
    tanggalMulai: futureDate(14), tanggalSelesai: futureDate(14), batasRegistrasi: futureDate(12),
    jumlahTayangan: 1900, namaPembicara: "dr. Ratna Dewi, Sp.KJ", peranPembicara: "Clinical Psychologist",
    urlFotoPembicara: "https://picsum.photos/seed/speaker19/400/400"
  },
  {
    id: 20, organizerId: 2, kategoriId: 1, kotaId: 229,
    judul: "Hackathon Pengembangan Aplikasi Smart Campus", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 50000,
    eventPolines: true, status: "published" as const, kuota: 100, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event20/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Hackathon 24 jam mengembangkan aplikasi smart campus berbasis mobile untuk meningkatkan layanan akademik dan non-akademik.",
    detailLokasi: "Lab Coding Terpadu, Polines",
    tanggalMulai: futureDate(80), tanggalSelesai: futureDate(81), batasRegistrasi: futureDate(75),
    jumlahTayangan: 3100, namaPembicara: "Dimas Ardianto", peranPembicara: "Full Stack Developer",
    urlFotoPembicara: "https://picsum.photos/seed/speaker20/400/400"
  },
  {
    id: 21, organizerId: 2, kategoriId: 13, kotaId: 229,
    judul: "Seminar Filsafat Sains: Antara Rasionalisme dan Empirisme", jenisEvent: "seminar" as const,
    tipePlatform: "online" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: true, status: "published" as const, kuota: 150, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event21/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar yang mengajak peserta merenungkan landasan filosofis sains melalui perdebatan antara rasionalisme dan empirisme.",
    detailLokasi: "Google Meet",
    tanggalMulai: futureDate(42), tanggalSelesai: futureDate(42), batasRegistrasi: futureDate(40),
    jumlahTayangan: 440, namaPembicara: "Dr. Ahmad Dahlan, M.Hum.", peranPembicara: "Philosophy Lecturer",
    urlFotoPembicara: "https://picsum.photos/seed/speaker21/400/400"
  },
  {
    id: 22, organizerId: 2, kategoriId: 6, kotaId: 229,
    judul: "Workshop Penulisan Karya Ilmiah Berbahasa Inggris", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 25000,
    eventPolines: true, status: "published" as const, kuota: 100, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event22/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Workshop teknik penulisan karya ilmiah dalam bahasa Inggris untuk publikasi jurnal internasional dan konferensi.",
    detailLokasi: "Ruang Seminar Jurusan Bahasa Inggris, Polines",
    tanggalMulai: futureDate(33), tanggalSelesai: futureDate(33), batasRegistrasi: futureDate(30),
    jumlahTayangan: 680, namaPembicara: "Dr. Nina Wulandari, M.Pd.", peranPembicara: "Academic Writing Specialist",
    urlFotoPembicara: "https://picsum.photos/seed/speaker22/400/400"
  },
  {
    id: 23, organizerId: 2, kategoriId: 5, kotaId: 229,
    judul: "Seminar Kesehatan Reproduksi Remaja untuk Mahasiswa Baru", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: true, status: "published" as const, kuota: 350, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event23/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar edukasi kesehatan reproduksi remaja yang ditujukan bagi mahasiswa baru sebagai bekal menjalani kehidupan kampus.",
    detailLokasi: "Auditorium Utama, Polines",
    tanggalMulai: futureDate(5), tanggalSelesai: futureDate(5), batasRegistrasi: futureDate(2),
    jumlahTayangan: 1200, namaPembicara: "dr. Citra Amelia, M.Kes.", peranPembicara: "Reproductive Health Specialist",
    urlFotoPembicara: "https://picsum.photos/seed/speaker23/400/400"
  },
  {
    id: 24, organizerId: 2, kategoriId: 11, kotaId: 229,
    judul: "Call for Paper: Riset Terapan Bidang Teknik dan Vokasi", jenisEvent: "conference" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "paid" as const, harga: 350000,
    eventPolines: true, status: "published" as const, kuota: 200, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event24/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Call for paper nasional bidang riset terapan teknik dan vokasi, hasil seleksi akan dipublikasikan di jurnal terakreditasi.",
    detailLokasi: "Gedung Pasca Sarjana, Polines & Zoom",
    tanggalMulai: futureDate(130), tanggalSelesai: futureDate(132), batasRegistrasi: futureDate(120),
    jumlahTayangan: 4200, namaPembicara: "Prof. Dr. Ir. Bambang Winardi, M.T.", peranPembicara: "Research Professor",
    urlFotoPembicara: "https://picsum.photos/seed/speaker24/400/400"
  },
  {
    id: 25, organizerId: 2, kategoriId: 7, kotaId: 229,
    judul: "Festival Musik dan Budaya Mahasiswa Polines 2026", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 20000,
    eventPolines: true, status: "published" as const, kuota: 1000, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event25/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Festival musik dan budaya tahunan mahasiswa Polines yang menampilkan bakat seni dari berbagai jurusan.",
    detailLokasi: "Lapangan Utama, Polines",
    tanggalMulai: futureDate(65), tanggalSelesai: futureDate(66), batasRegistrasi: futureDate(60),
    jumlahTayangan: 4800, namaPembicara: "Gita Savitar", peranPembicara: "Musician & Content Creator",
    urlFotoPembicara: "https://picsum.photos/seed/speaker25/400/400"
  },

  // ========== TAMBAHAN 15 EVENT UMUM (id 26-40) ==========
  {
    id: 26, organizerId: 2, kategoriId: 1, kotaId: 159,
    judul: "Jakarta AI Summit 2026: Masa Depan Kecerdasan Buatan", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 500000,
    eventPolines: false, status: "published" as const, kuota: 600, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event26/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Konferensi AI terbesar di Indonesia yang menghadirkan pembicara internasional dan lokal tentang perkembangan AI terkini.",
    detailLokasi: "Jakarta Convention Center, Jakarta Selatan",
    tanggalMulai: futureDate(100), tanggalSelesai: futureDate(102), batasRegistrasi: futureDate(90),
    jumlahTayangan: 8900, namaPembicara: "Dr. Yann LeCun (Keynote)", peranPembicara: "Chief AI Scientist, Meta",
    urlFotoPembicara: "https://picsum.photos/seed/speaker26/400/400"
  },
  {
    id: 27, organizerId: 2, kategoriId: 4, kotaId: 181,
    judul: "Bandung Creative Economy Festival 2026", jenisEvent: "seminar" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "paid" as const, harga: 150000,
    eventPolines: false, status: "published" as const, kuota: 400, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event27/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Festival ekonomi kreatif Bandung yang menghadirkan workshop, talkshow, dan pameran produk kreatif dari para pelaku industri.",
    detailLokasi: "Gedung Merdeka, Bandung & Zoom",
    tanggalMulai: futureDate(45), tanggalSelesai: futureDate(47), batasRegistrasi: futureDate(40),
    jumlahTayangan: 5600, namaPembicara: "Rudy Setiawan", peranPembicara: "Creative Economy Practitioner",
    urlFotoPembicara: "https://picsum.photos/seed/speaker27/400/400"
  },
  {
    id: 28, organizerId: 2, kategoriId: 5, kotaId: 183,
    judul: "Seminar Nasional Telemedicine dan Layanan Kesehatan Digital", jenisEvent: "seminar" as const,
    tipePlatform: "online" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: false, status: "published" as const, kuota: 1000, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event28/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar nasional tentang perkembangan telemedicine dan transformasi layanan kesehatan digital pasca pandemi.",
    detailLokasi: "Zoom Webinar",
    tanggalMulai: futureDate(25), tanggalSelesai: futureDate(25), batasRegistrasi: futureDate(22),
    jumlahTayangan: 3400, namaPembicara: "dr. Nadia Octavia, MARS", peranPembicara: "Digital Health Expert",
    urlFotoPembicara: "https://picsum.photos/seed/speaker28/400/400"
  },
  {
    id: 29, organizerId: 2, kategoriId: 10, kotaId: 216,
    judul: "Yogyakarta Educational Expo 2026", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: false, status: "published" as const, kuota: 2000, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event29/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Pameran pendidikan terbesar di Yogyakarta yang menampilkan berbagai program studi, beasiswa, dan peluang karir.",
    detailLokasi: "Jogja Expo Center, Yogyakarta",
    tanggalMulai: futureDate(85), tanggalSelesai: futureDate(87), batasRegistrasi: futureDate(80),
    jumlahTayangan: 7200, namaPembicara: "Prof. Dr. Ir. Muhammad Riza", peranPembicara: "Education Consultant",
    urlFotoPembicara: "https://picsum.photos/seed/speaker29/400/400"
  },
  {
    id: 30, organizerId: 2, kategoriId: 7, kotaId: 182,
    judul: "Festival Film Independen Indonesia 2026", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 50000,
    eventPolines: false, status: "published" as const, kuota: 300, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event30/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Festival tahunan yang memutar film-film independen terbaik Indonesia serta diskusi dengan sineas dan kritikus film.",
    detailLokasi: "CGV Grand Indonesia, Jakarta",
    tanggalMulai: futureDate(75), tanggalSelesai: futureDate(78), batasRegistrasi: futureDate(70),
    jumlahTayangan: 4500, namaPembicara: "Garin Nugroho", peranPembicara: "Filmmaker",
    urlFotoPembicara: "https://picsum.photos/seed/speaker30/400/400"
  },
  {
    id: 31, organizerId: 2, kategoriId: 9, kotaId: 188,
    judul: "Seminar Nasional Ketahanan Pangan dan Perubahan Iklim", jenisEvent: "conference" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "paid" as const, harga: 250000,
    eventPolines: false, status: "published" as const, kuota: 250, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event31/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Konferensi nasional yang membahas strategi ketahanan pangan di tengah dampak perubahan iklim global.",
    detailLokasi: "Hotel Santika, Semarang & Zoom",
    tanggalMulai: futureDate(115), tanggalSelesai: futureDate(116), batasRegistrasi: futureDate(105),
    jumlahTayangan: 2800, namaPembicara: "Dr. Ir. Hadi Susanto, M.Agr.", peranPembicara: "Food Security Expert",
    urlFotoPembicara: "https://picsum.photos/seed/speaker31/400/400"
  },
  {
    id: 32, organizerId: 2, kategoriId: 12, kotaId: 193,
    judul: "Workshop Mindfulness and Self Development for Professionals", jenisEvent: "seminar" as const,
    tipePlatform: "online" as const, tipeHarga: "paid" as const, harga: 99000,
    eventPolines: false, status: "published" as const, kuota: 100, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event32/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Workshop pengembangan diri dan mindfulness untuk para profesional yang ingin meningkatkan produktivitas dan keseimbangan hidup.",
    detailLokasi: "Google Meet",
    tanggalMulai: futureDate(12), tanggalSelesai: futureDate(12), batasRegistrasi: futureDate(10),
    jumlahTayangan: 820, namaPembicara: "Rangga Wirawan, M.Psi.", peranPembicara: "Life Coach & Psychologist",
    urlFotoPembicara: "https://picsum.photos/seed/speaker32/400/400"
  },
  {
    id: 33, organizerId: 2, kategoriId: 1, kotaId: 184,
    judul: "Seminar Startup Technology: Dari Ide hingga Exit Strategy", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 125000,
    eventPolines: false, status: "published" as const, kuota: 200, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event33/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar yang membahas perjalanan startup teknologi dari ide awal, pendanaan, pengembangan produk, hingga strategi exit.",
    detailLokasi: "Co-Working Space, BSD City",
    tanggalMulai: futureDate(38), tanggalSelesai: futureDate(38), batasRegistrasi: futureDate(35),
    jumlahTayangan: 2300, namaPembicara: "William Tanuwijaya", peranPembicara: "Founder & CEO Tech Startup",
    urlFotoPembicara: "https://picsum.photos/seed/speaker33/400/400"
  },
  {
    id: 34, organizerId: 2, kategoriId: 8, kotaId: 156,
    judul: "Simposium Nasional Anti Korupsi untuk Generasi Muda", jenisEvent: "conference" as const,
    tipePlatform: "offline" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: false, status: "published" as const, kuota: 400, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event34/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Simposium nasional yang mengajak generasi muda berperan aktif dalam gerakan anti korupsi dan transparansi publik.",
    detailLokasi: "Gedung KPK, Jakarta Pusat",
    tanggalMulai: futureDate(48), tanggalSelesai: futureDate(48), batasRegistrasi: futureDate(45),
    jumlahTayangan: 3600, namaPembicara: "Dr. Nurhayati, S.H., M.H.", peranPembicara: "Anti-Corruption Activist",
    urlFotoPembicara: "https://picsum.photos/seed/speaker34/400/400"
  },
  {
    id: 35, organizerId: 2, kategoriId: 4, kotaId: 176,
    judul: "Financial Planning Bootcamp: Kelola Keuangan di Usia Muda", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 85000,
    eventPolines: false, status: "published" as const, kuota: 80, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event35/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Bootcamp perencanaan keuangan intensif untuk anak muda: investasi, budgeting, dan persiapan pensiun sejak dini.",
    detailLokasi: "Hotel Harris, Surabaya",
    tanggalMulai: futureDate(28), tanggalSelesai: futureDate(29), batasRegistrasi: futureDate(25),
    jumlahTayangan: 1700, namaPembicara: "Ayu Lestari, CFP", peranPembicara: "Financial Planner",
    urlFotoPembicara: "https://picsum.photos/seed/speaker35/400/400"
  },
  {
    id: 36, organizerId: 2, kategoriId: 1, kotaId: 158,
    judul: "International Conference on Cybersecurity and Digital Forensics 2026", jenisEvent: "conference" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "paid" as const, harga: 450000,
    eventPolines: false, status: "published" as const, kuota: 350, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event36/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Konferensi internasional yang mempertemukan para ahli keamanan siber dan forensik digital dari berbagai negara.",
    detailLokasi: "Hotel Pullman, Jakarta Barat & Zoom",
    tanggalMulai: futureDate(140), tanggalSelesai: futureDate(143), batasRegistrasi: futureDate(130),
    jumlahTayangan: 6500, namaPembicara: "Prof. Eugene Kaspersky", peranPembicara: "Cybersecurity Expert",
    urlFotoPembicara: "https://picsum.photos/seed/speaker36/400/400"
  },
  {
    id: 37, organizerId: 2, kategoriId: 13, kotaId: 216,
    judul: "Seminar Moderasi Beragama di Era Digital", jenisEvent: "seminar" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "free" as const, harga: 0,
    eventPolines: false, status: "published" as const, kuota: 300, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event37/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Seminar yang mengupas pentingnya moderasi beragama dan toleransi di tengah derasnya arus informasi digital.",
    detailLokasi: "Gedung UIN Sunan Kalijaga, Yogyakarta & Zoom",
    tanggalMulai: futureDate(55), tanggalSelesai: futureDate(55), batasRegistrasi: futureDate(50),
    jumlahTayangan: 1500, namaPembicara: "Prof. Dr. Quraish Shihab", peranPembicara: "Islamic Scholar",
    urlFotoPembicara: "https://picsum.photos/seed/speaker37/400/400"
  },
  {
    id: 38, organizerId: 2, kategoriId: 2, kotaId: 186,
    judul: "Publikasi Ilmiah Bootcamp: Dari Riset ke Jurnal Scopus", jenisEvent: "seminar" as const,
    tipePlatform: "online" as const, tipeHarga: "paid" as const, harga: 199000,
    eventPolines: false, status: "published" as const, kuota: 150, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event38/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Bootcamp online intensif yang membimbing peneliti dan akademisi dalam mempublikasikan riset ke jurnal bereputasi Scopus.",
    detailLokasi: "Zoom Webinar",
    tanggalMulai: futureDate(20), tanggalSelesai: futureDate(22), batasRegistrasi: futureDate(15),
    jumlahTayangan: 2100, namaPembicara: "Prof. Dr. Siti Zubaidah, M.Pd.", peranPembicara: "Scopus Reviewer",
    urlFotoPembicara: "https://picsum.photos/seed/speaker38/400/400"
  },
  {
    id: 39, organizerId: 2, kategoriId: 3, kotaId: 181,
    judul: "Workshop Pemrograman Robot berbasis ROS untuk Pemula", jenisEvent: "seminar" as const,
    tipePlatform: "offline" as const, tipeHarga: "paid" as const, harga: 150000,
    eventPolines: false, status: "published" as const, kuota: 50, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event39/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Workshop hands-on pemrograman robot menggunakan Robot Operating System (ROS) untuk pemula di bidang robotika.",
    detailLokasi: "Lab Robotika ITB, Bandung",
    tanggalMulai: futureDate(68), tanggalSelesai: futureDate(69), batasRegistrasi: futureDate(65),
    jumlahTayangan: 1100, namaPembicara: "Fadhlur Rahman, S.T., M.T.", peranPembicara: "Robotics Researcher",
    urlFotoPembicara: "https://picsum.photos/seed/speaker39/400/400"
  },
  {
    id: 40, organizerId: 2, kategoriId: 6, kotaId: 153,
    judul: "International Conference on Linguistics and Language Teaching", jenisEvent: "conference" as const,
    tipePlatform: "hybrid" as const, tipeHarga: "paid" as const, harga: 300000,
    eventPolines: false, status: "published" as const, kuota: 200, penyelenggara: ORGANIZER_NAME,
    urlBanner: "https://picsum.photos/seed/event40/1200/600", syaratDanKetentuan: DEFAULT_TERMS,
    deskripsi: "Konferensi internasional bidang linguistik dan pengajaran bahasa yang menghadirkan peneliti dari Asia Tenggara.",
    detailLokasi: "Universitas Lampung, Bandar Lampung & Zoom",
    tanggalMulai: futureDate(105), tanggalSelesai: futureDate(107), batasRegistrasi: futureDate(95),
    jumlahTayangan: 2400, namaPembicara: "Prof. Dr. Jufrizal, M.Hum.", peranPembicara: "Linguistics Professor",
    urlFotoPembicara: "https://picsum.photos/seed/speaker40/400/400"
  }
];

async function seedEventsTable() {
  console.log("🚀 Seeding professional events...");
  for (const e of eventsData) {
    const s = slug(e.judul);
    
    const { namaPembicara, peranPembicara, urlFotoPembicara, ...eventDataRaw } = e;

    const values = {
      ...eventDataRaw,
      slug: s,
      hasilScraping: false,
      dibuatPada: new Date(),
      metodePembayaran: e.tipeHarga === 'paid' ? [
        {
          jenis: "bank_transfer",
          namaPenyedia: "BCA",
          nomorAkun: "8273645192",
          atasNama: `Panitia ${e.judul.substring(0, 15)}`
        },
        {
          jenis: "e_wallet",
          namaPenyedia: "Gopay",
          nomorAkun: "081234567890",
          atasNama: `Panitia ${e.judul.substring(0, 15)}`
        }
      ] : null
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
        kuota: e.kuota,
        penyelenggara: ORGANIZER_NAME,
        metodePembayaran: values.metodePembayaran,
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
  console.log("✅ Professional events seeded!");
}

async function seedAuxiliary() {
  console.log("🚀 Seeding auxiliary event data...");
  await db.delete(infoPembayaran);
  await db.insert(infoPembayaran).values([
    { id: 1, tipe: 'bank_transfer', namaBank: 'Bank Mandiri', nomorRekening: '132-000-1234-567', pemilikRekening: 'Panitia POLIVENTS' },
    { id: 2, tipe: 'qris', urlGambarQris: 'https://picsum.photos/seed/qris/400/400' }
  ]);

  await db.insert(profilPenyelenggara).values({
    userId: 2, namaInstansi: "Politeknik Negeri Semarang", deskripsiInstansi: "Perguruan tinggi vokasi terkemuka.",
  }).onConflictDoUpdate({
    target: profilPenyelenggara.userId,
    set: { namaInstansi: "Politeknik Negeri Semarang" }
  });
}

export async function seedEvent() {
  const start = Date.now();
  console.log("📦 [EVENT] Seeding events...\n");
  await seedEventsTable();
  await seedAuxiliary();
  await db.execute(sql`SELECT setval('event_id_seq', COALESCE((SELECT MAX(id) FROM event), 0) + 1, false)`);
  console.log(`\n✅ [EVENT] Done in ${((Date.now() - start) / 1000).toFixed(2)}s`);
}
