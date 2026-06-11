import 'dotenv/config';
import { db } from "./index";
import { sql } from "drizzle-orm";
import { provinsi, kategori, tag, kota, users } from "./schema";
import bcrypt from 'bcryptjs';

async function seedReset() {
  console.log("🧹 Membersihkan seluruh database...");
  const tables = [
    'event', 'kota', 'kategori', 'provinsi', 'users', 'profil_penyelenggara',
    'otp_codes', 'tag', 'event_tag', 'lampiran_event', 'favorit',
    'pendaftaran', 'peserta', 'paper_submission', 'penulis_paper', 'log_admin', 'jadwal_event', 'pembicara', 'info_pembayaran'
  ];
  for (const table of tables) {
    await db.execute(sql.raw(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`));
  }
  console.log("✨ Database kosong dan bersih!");
}

async function seedProvinsi() {
  console.log("🚀 Seeding provinsi...");
  const dataProvinsi = [
    { id: 1, nama: "Aceh" }, { id: 2, nama: "Sumatera Utara" }, { id: 3, nama: "Sumatera Barat" },
    { id: 4, nama: "Riau" }, { id: 5, nama: "Kepulauan Riau" }, { id: 6, nama: "Jambi" },
    { id: 7, nama: "Sumatera Selatan" }, { id: 8, nama: "Kepulauan Bangka Belitung" },
    { id: 9, nama: "Bengkulu" }, { id: 10, nama: "Lampung" }, { id: 11, nama: "DKI Jakarta" },
    { id: 12, nama: "Jawa Barat" }, { id: 13, nama: "Banten" }, { id: 14, nama: "Jawa Tengah" },
    { id: 15, nama: "DI Yogyakarta" }, { id: 16, nama: "Jawa Timur" }, { id: 17, nama: "Bali" },
    { id: 18, nama: "Nusa Tenggara Barat" }, { id: 19, nama: "Nusa Tenggara Timur" },
    { id: 20, nama: "Kalimantan Barat" }, { id: 21, nama: "Kalimantan Tengah" },
    { id: 22, nama: "Kalimantan Selatan" }, { id: 23, nama: "Kalimantan Timur" },
    { id: 24, nama: "Kalimantan Utara" }, { id: 25, nama: "Sulawesi Utara" },
    { id: 26, nama: "Sulawesi Tengah" }, { id: 27, nama: "Sulawesi Selatan" },
    { id: 28, nama: "Sulawesi Tenggara" }, { id: 29, nama: "Gorontalo" },
    { id: 30, nama: "Sulawesi Barat" }, { id: 31, nama: "Maluku" }, { id: 32, nama: "Maluku Utara" },
    { id: 33, nama: "Papua" }, { id: 34, nama: "Papua Barat" }, { id: 35, nama: "Papua Selatan" },
    { id: 36, nama: "Papua Tengah" }, { id: 37, nama: "Papua Pegunungan" },
    { id: 38, nama: "Papua Barat Daya" },
  ];
  for (const p of dataProvinsi) {
    await db.insert(provinsi).values(p).onConflictDoUpdate({ target: provinsi.id, set: { nama: p.nama } });
  }
  console.log("✅ Provinsi seeded!");
}

async function seedKategori() {
  console.log("🚀 Seeding kategori & tags...");
  const kategoriData = [
    { id: 1, nama: "Teknologi", slug: "teknologi", urlIkon: "https://picsum.photos/seed/icon-teknologi/100/100" },
    { id: 2, nama: "Sains & Matematika", slug: "sains-matematika", urlIkon: "https://picsum.photos/seed/icon-sains/100/100" },
    { id: 3, nama: "Teknik & Rekayasa", slug: "teknik-rekayasa", urlIkon: "https://picsum.photos/seed/icon-teknologi/100/100" },
    { id: 4, nama: "Bisnis & Ekonomi", slug: "bisnis-ekonomi", urlIkon: "https://picsum.photos/seed/icon-bisnis/100/100" },
    { id: 5, nama: "Kesehatan & Medis", slug: "kesehatan-medis", urlIkon: "https://picsum.photos/seed/icon-kesehatan/100/100" },
    { id: 6, nama: "Bahasa & Sastra", slug: "bahasa-sastra", urlIkon: "https://picsum.photos/seed/icon-pendidikan/100/100" },
    { id: 7, nama: "Seni & Budaya", slug: "seni-budaya", urlIkon: "https://picsum.photos/seed/icon-seni/100/100" },
    { id: 8, nama: "Sosial & Hukum", slug: "sosial-hukum", urlIkon: "https://picsum.photos/seed/icon-pendidikan/100/100" },
    { id: 9, nama: "Pertanian & Lingkungan", slug: "pertanian-lingkungan", urlIkon: "https://picsum.photos/seed/icon-sains/100/100" },
    { id: 10, nama: "Pendidikan", slug: "pendidikan", urlIkon: "https://picsum.photos/seed/icon-pendidikan/100/100" },
    { id: 11, nama: "Riset & Publikasi", slug: "riset-publikasi", urlIkon: "https://picsum.photos/seed/icon-sains/100/100" },
    { id: 12, nama: "Psikologi", slug: "psikologi", urlIkon: "https://picsum.photos/seed/icon-kesehatan/100/100" },
    { id: 13, nama: "Filsafat & Agama", slug: "filsafat-agama", urlIkon: "https://picsum.photos/seed/icon-seni/100/100" },
  ];
  for (const item of kategoriData) {
    await db.insert(kategori).values(item).onConflictDoUpdate({ target: kategori.id, set: item });
  }

  const tagData = [
    { nama: "#ArtificialIntelligence" }, { nama: "#CyberSecurity" }, { nama: "#DataScience" },
    { nama: "#InternetOfThings" }, { nama: "#SoftwareEngineering" }, { nama: "#CloudComputing" },
    { nama: "#Fisika" }, { nama: "#Kimia" }, { nama: "#Biologi" },
    { nama: "#MatematikaTerapan" }, { nama: "#Biotehnologi" }, { nama: "#Statistika" },
    { nama: "#TeknikSipil" }, { nama: "#TeknikMesin" }, { nama: "#TeknikElektro" },
    { nama: "#TeknikKimia" }, { nama: "#TeknikIndustri" },
    { nama: "#Manajemen" }, { nama: "#Akuntansi" }, { nama: "#EkonomiPembangunan" },
    { nama: "#Keuangan" }, { nama: "#Kewirausahaan" }, { nama: "#PemasaranDigital" },
    { nama: "#Kedokteran" }, { nama: "#Keperawatan" }, { nama: "#KesehatanMasyarakat" },
    { nama: "#Farmasi" }, { nama: "#Gizi" },
    { nama: "#Linguistik" }, { nama: "#SastraIndonesia" }, { nama: "#SastraInggris" },
    { nama: "#PembelajaranBahasa" }, { nama: "#Penerjemahan" },
    { nama: "#SeniRupa" }, { nama: "#DesainKomunikasiVisual" }, { nama: "#SeniMusik" },
    { nama: "#AntropologiBudaya" }, { nama: "#Sejarah" },
    { nama: "#Sosiologi" }, { nama: "#IlmuPolitik" }, { nama: "#HukumPerdata" },
    { nama: "#HukumPidana" }, { nama: "#HubunganInternasional" },
    { nama: "#Agronomi" }, { nama: "#Kehutanan" }, { nama: "#TeknologiPangan" },
    { nama: "#PerubahanIklim" }, { nama: "#PembangunanBerkelanjutan" },
    { nama: "#KurikulumMerdeka" }, { nama: "#MetodePembelajaran" }, { nama: "#ManajemenPendidikan" },
    { nama: "#PendidikanInklusi" }, { nama: "#PendidikanKarakter" }, { nama: "#AsesmenPembelajaran" },
    { nama: "#MetodologiPenelitian" }, { nama: "#PenulisanKaryaIlmiah" }, { nama: "#JurnalScopus" },
    { nama: "#JurnalSinta" }, { nama: "#Mendeley" },
    { nama: "#PsikologiKlinis" }, { nama: "#PsikologiPerkembangan" }, { nama: "#PsikologiPendidikan" },
    { nama: "#KesehatanMental" }, { nama: "#Konseling" },
    { nama: "#FilsafatIlmu" }, { nama: "#StudiKeagamaan" }, { nama: "#Etika" },
    { nama: "#PendidikanAgama" }
  ];
  for (const item of tagData) {
    await db.insert(tag).values(item).onConflictDoNothing();
  }
  console.log("✅ Kategori & tags seeded!");
}

async function seedKota() {
  console.log("🚀 Seeding kota...");
  const dataKota = [
    { id: 1, provinsiId: 1, nama: "Banda Aceh" }, { id: 2, provinsiId: 14, nama: "Semarang" },
    { id: 3, provinsiId: 16, nama: "Surabaya" }, { id: 4, provinsiId: 12, nama: "Bandung" },
    { id: 5, provinsiId: 15, nama: "Yogyakarta" }, { id: 6, provinsiId: 2, nama: "Medan" },
    { id: 7, provinsiId: 27, nama: "Makassar" }, { id: 8, provinsiId: 7, nama: "Palembang" },
    { id: 9, provinsiId: 23, nama: "Balikpapan" }, { id: 10, provinsiId: 17, nama: "Denpasar" },
    { id: 11, provinsiId: 11, nama: "Jakarta Pusat" }, { id: 12, provinsiId: 11, nama: "Jakarta Selatan" },
    { id: 13, provinsiId: 11, nama: "Jakarta Timur" }, { id: 14, provinsiId: 11, nama: "Jakarta Barat" },
    { id: 15, provinsiId: 11, nama: "Jakarta Utara" }, { id: 16, provinsiId: 3, nama: "Padang" },
    { id: 17, provinsiId: 4, nama: "Pekanbaru" }, { id: 18, provinsiId: 5, nama: "Batam" },
    { id: 19, provinsiId: 6, nama: "Jambi" }, { id: 20, provinsiId: 8, nama: "Pangkalpinang" },
    { id: 21, provinsiId: 9, nama: "Bengkulu" }, { id: 22, provinsiId: 10, nama: "Bandar Lampung" },
    { id: 23, provinsiId: 12, nama: "Bekasi" }, { id: 24, provinsiId: 12, nama: "Depok" },
    { id: 25, provinsiId: 12, nama: "Bogor" }, { id: 26, provinsiId: 13, nama: "Serang" },
    { id: 27, provinsiId: 13, nama: "Tangerang" }, { id: 28, provinsiId: 14, nama: "Surakarta" },
    { id: 29, provinsiId: 16, nama: "Malang" }, { id: 30, provinsiId: 18, nama: "Mataram" },
    { id: 31, provinsiId: 19, nama: "Kupang" }, { id: 32, provinsiId: 20, nama: "Pontianak" },
    { id: 33, provinsiId: 21, nama: "Palangkaraya" }, { id: 34, provinsiId: 22, nama: "Banjarmasin" },
    { id: 35, provinsiId: 23, nama: "Samarinda" }, { id: 36, provinsiId: 24, nama: "Tarakan" },
    { id: 37, provinsiId: 25, nama: "Manado" }, { id: 38, provinsiId: 26, nama: "Palu" },
    { id: 39, provinsiId: 28, nama: "Kendari" }, { id: 40, provinsiId: 29, nama: "Gorontalo" },
    { id: 41, provinsiId: 30, nama: "Mamuju" }, { id: 42, provinsiId: 31, nama: "Ambon" },
    { id: 43, provinsiId: 32, nama: "Ternate" }, { id: 44, provinsiId: 33, nama: "Jayapura" },
    { id: 45, provinsiId: 34, nama: "Manokwari" }, { id: 46, provinsiId: 35, nama: "Merauke" },
    { id: 47, provinsiId: 36, nama: "Nabire" }, { id: 48, provinsiId: 37, nama: "Wamena" },
    { id: 49, provinsiId: 38, nama: "Sorong" }
  ];
  for (const item of dataKota) {
    await db.insert(kota).values(item).onConflictDoUpdate({ target: kota.id, set: item });
  }
  console.log("✅ Kota seeded!");
}

async function seedUsers() {
  console.log("🚀 Seeding users...");
  const userData = [
    { namaLengkap: "Admin", email: "poliventsofficial@gmail.com", password: "adminpassword123", role: 'admin' as const, nomorTelepon: "081234567890", institusi: "Politeknik Negeri Semarang" },
    { namaLengkap: "Penyelenggara", email: "organizer@gmail.com", password: "organizerpassword123", role: 'organizer' as const, nomorTelepon: "081234567891", institusi: "Politeknik Negeri Semarang" },
    { namaLengkap: "Pengunjung", email: "visitor@gmail.com", password: "visitorpassword123", role: 'visitor' as const, nomorTelepon: "081234567892", institusi: "Politeknik Negeri Semarang" },
    { namaLengkap: "Ahmad Rizki Pratama", email: "ahmad.rizki@gmail.com", password: "password123", role: 'visitor' as const, nomorTelepon: "082111222333", institusi: "Universitas Diponegoro", jenisKelamin: "Laki-laki" as const, pekerjaan: "Mahasiswa" },
    { namaLengkap: "Siti Nurhaliza", email: "siti.nurhaliza@gmail.com", password: "password123", role: 'visitor' as const, nomorTelepon: "082111222334", institusi: "Universitas Gadjah Mada", jenisKelamin: "Perempuan" as const, pekerjaan: "Mahasiswa" },
    { namaLengkap: "Budi Santoso", email: "budi.santoso@gmail.com", password: "password123", role: 'visitor' as const, nomorTelepon: "082111222335", institusi: "Institut Teknologi Bandung", jenisKelamin: "Laki-laki" as const, pekerjaan: "Mahasiswa" },
    { namaLengkap: "Dewi Anggraini", email: "dewi.anggraini@gmail.com", password: "password123", role: 'visitor' as const, nomorTelepon: "082111222336", institusi: "Universitas Indonesia", jenisKelamin: "Perempuan" as const, pekerjaan: "Mahasiswa" },
    { namaLengkap: "Fajar Setiawan", email: "fajar.setiawan@gmail.com", password: "password123", role: 'visitor' as const, nomorTelepon: "082111222337", institusi: "Universitas Brawijaya", jenisKelamin: "Laki-laki" as const, pekerjaan: "Dosen" },
  ];

  for (const user of userData) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await db.insert(users).values({
      namaLengkap: user.namaLengkap,
      email: user.email,
      password: hashedPassword,
      role: user.role,
      nomorTelepon: user.nomorTelepon,
      institusi: user.institusi,
      jenisKelamin: 'jenisKelamin' in user ? user.jenisKelamin : undefined,
      pekerjaan: 'pekerjaan' in user ? user.pekerjaan : undefined,
      disetujui: true,
      emailTerverifikasi: new Date(),
      urlAvatar: "https://picsum.photos/seed/avatar/200/200",
    }).onConflictDoUpdate({
      target: users.email,
      set: {
        namaLengkap: user.namaLengkap,
        password: hashedPassword,
        role: user.role,
        nomorTelepon: user.nomorTelepon,
        institusi: user.institusi,
        jenisKelamin: 'jenisKelamin' in user ? user.jenisKelamin : undefined,
        pekerjaan: 'pekerjaan' in user ? user.pekerjaan : undefined,
        disetujui: true,
        emailTerverifikasi: new Date(),
        urlAvatar: "https://picsum.photos/seed/avatar/200/200",
      }
    });
  }
  console.log("✅ Users seeded!");
}

export async function seedMaster() {
  const start = Date.now();
  console.log("📦 [MASTER] Resetting & seeding master data...\n");
  await seedReset();
  await seedProvinsi();
  await seedKategori();
  await seedKota();
  await seedUsers();
  console.log(`\n✅ [MASTER] Done in ${((Date.now() - start) / 1000).toFixed(2)}s`);
}
