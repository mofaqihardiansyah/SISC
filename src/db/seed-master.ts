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
  console.log("🚀 Seeding kota (514 kabupaten/kota)...");
  // Data lengkap seluruh kabupaten/kota di Indonesia berdasarkan Kepmendagri
  const dataKota: { provinsiId: number; nama: string }[] = [
    // 1. Aceh
    { provinsiId: 1, nama: "Kabupaten Aceh Selatan" }, { provinsiId: 1, nama: "Kabupaten Aceh Tenggara" },
    { provinsiId: 1, nama: "Kabupaten Aceh Timur" }, { provinsiId: 1, nama: "Kabupaten Aceh Tengah" },
    { provinsiId: 1, nama: "Kabupaten Aceh Barat" }, { provinsiId: 1, nama: "Kabupaten Aceh Besar" },
    { provinsiId: 1, nama: "Kabupaten Pidie" }, { provinsiId: 1, nama: "Kabupaten Aceh Utara" },
    { provinsiId: 1, nama: "Kabupaten Simeulue" }, { provinsiId: 1, nama: "Kabupaten Aceh Singkil" },
    { provinsiId: 1, nama: "Kabupaten Bireuen" }, { provinsiId: 1, nama: "Kabupaten Aceh Barat Daya" },
    { provinsiId: 1, nama: "Kabupaten Gayo Lues" }, { provinsiId: 1, nama: "Kabupaten Aceh Jaya" },
    { provinsiId: 1, nama: "Kabupaten Nagan Raya" }, { provinsiId: 1, nama: "Kabupaten Aceh Tamiang" },
    { provinsiId: 1, nama: "Kabupaten Bener Meriah" }, { provinsiId: 1, nama: "Kabupaten Pidie Jaya" },
    { provinsiId: 1, nama: "Kota Banda Aceh" }, { provinsiId: 1, nama: "Kota Sabang" },
    { provinsiId: 1, nama: "Kota Lhokseumawe" }, { provinsiId: 1, nama: "Kota Langsa" },
    { provinsiId: 1, nama: "Kota Subulussalam" },
    // 2. Sumatera Utara
    { provinsiId: 2, nama: "Kabupaten Tapanuli Tengah" }, { provinsiId: 2, nama: "Kabupaten Tapanuli Utara" },
    { provinsiId: 2, nama: "Kabupaten Tapanuli Selatan" }, { provinsiId: 2, nama: "Kabupaten Nias" },
    { provinsiId: 2, nama: "Kabupaten Langkat" }, { provinsiId: 2, nama: "Kabupaten Karo" },
    { provinsiId: 2, nama: "Kabupaten Deli Serdang" }, { provinsiId: 2, nama: "Kabupaten Simalungun" },
    { provinsiId: 2, nama: "Kabupaten Asahan" }, { provinsiId: 2, nama: "Kabupaten Labuhanbatu" },
    { provinsiId: 2, nama: "Kabupaten Dairi" }, { provinsiId: 2, nama: "Kabupaten Toba" },
    { provinsiId: 2, nama: "Kabupaten Mandailing Natal" }, { provinsiId: 2, nama: "Kabupaten Nias Selatan" },
    { provinsiId: 2, nama: "Kabupaten Pakpak Bharat" }, { provinsiId: 2, nama: "Kabupaten Humbang Hasundutan" },
    { provinsiId: 2, nama: "Kabupaten Samosir" }, { provinsiId: 2, nama: "Kabupaten Serdang Bedagai" },
    { provinsiId: 2, nama: "Kabupaten Batu Bara" }, { provinsiId: 2, nama: "Kabupaten Padang Lawas Utara" },
    { provinsiId: 2, nama: "Kabupaten Padang Lawas" }, { provinsiId: 2, nama: "Kabupaten Labuhanbatu Selatan" },
    { provinsiId: 2, nama: "Kabupaten Labuhanbatu Utara" }, { provinsiId: 2, nama: "Kabupaten Nias Utara" },
    { provinsiId: 2, nama: "Kabupaten Nias Barat" },
    { provinsiId: 2, nama: "Kota Medan" }, { provinsiId: 2, nama: "Kota Pematangsiantar" },
    { provinsiId: 2, nama: "Kota Sibolga" }, { provinsiId: 2, nama: "Kota Tanjungbalai" },
    { provinsiId: 2, nama: "Kota Binjai" }, { provinsiId: 2, nama: "Kota Tebing Tinggi" },
    { provinsiId: 2, nama: "Kota Padangsidimpuan" }, { provinsiId: 2, nama: "Kota Gunungsitoli" },
    // 3. Sumatera Barat
    { provinsiId: 3, nama: "Kabupaten Pesisir Selatan" }, { provinsiId: 3, nama: "Kabupaten Solok" },
    { provinsiId: 3, nama: "Kabupaten Sijunjung" }, { provinsiId: 3, nama: "Kabupaten Tanah Datar" },
    { provinsiId: 3, nama: "Kabupaten Padang Pariaman" }, { provinsiId: 3, nama: "Kabupaten Agam" },
    { provinsiId: 3, nama: "Kabupaten Lima Puluh Kota" }, { provinsiId: 3, nama: "Kabupaten Pasaman" },
    { provinsiId: 3, nama: "Kabupaten Kepulauan Mentawai" }, { provinsiId: 3, nama: "Kabupaten Dharmasraya" },
    { provinsiId: 3, nama: "Kabupaten Solok Selatan" }, { provinsiId: 3, nama: "Kabupaten Pasaman Barat" },
    { provinsiId: 3, nama: "Kota Padang" }, { provinsiId: 3, nama: "Kota Solok" },
    { provinsiId: 3, nama: "Kota Sawahlunto" }, { provinsiId: 3, nama: "Kota Padang Panjang" },
    { provinsiId: 3, nama: "Kota Bukittinggi" }, { provinsiId: 3, nama: "Kota Payakumbuh" },
    { provinsiId: 3, nama: "Kota Pariaman" },
    // 4. Riau
    { provinsiId: 4, nama: "Kabupaten Kampar" }, { provinsiId: 4, nama: "Kabupaten Indragiri Hulu" },
    { provinsiId: 4, nama: "Kabupaten Bengkalis" }, { provinsiId: 4, nama: "Kabupaten Indragiri Hilir" },
    { provinsiId: 4, nama: "Kabupaten Pelalawan" }, { provinsiId: 4, nama: "Kabupaten Rokan Hulu" },
    { provinsiId: 4, nama: "Kabupaten Rokan Hilir" }, { provinsiId: 4, nama: "Kabupaten Siak" },
    { provinsiId: 4, nama: "Kabupaten Kuantan Singingi" }, { provinsiId: 4, nama: "Kabupaten Kepulauan Meranti" },
    { provinsiId: 4, nama: "Kota Pekanbaru" }, { provinsiId: 4, nama: "Kota Dumai" },
    // 5. Kepulauan Riau
    { provinsiId: 5, nama: "Kabupaten Bintan" }, { provinsiId: 5, nama: "Kabupaten Karimun" },
    { provinsiId: 5, nama: "Kabupaten Natuna" }, { provinsiId: 5, nama: "Kabupaten Lingga" },
    { provinsiId: 5, nama: "Kabupaten Kepulauan Anambas" },
    { provinsiId: 5, nama: "Kota Batam" }, { provinsiId: 5, nama: "Kota Tanjung Pinang" },
    // 6. Jambi
    { provinsiId: 6, nama: "Kabupaten Kerinci" }, { provinsiId: 6, nama: "Kabupaten Merangin" },
    { provinsiId: 6, nama: "Kabupaten Sarolangun" }, { provinsiId: 6, nama: "Kabupaten Batanghari" },
    { provinsiId: 6, nama: "Kabupaten Muaro Jambi" }, { provinsiId: 6, nama: "Kabupaten Tanjung Jabung Barat" },
    { provinsiId: 6, nama: "Kabupaten Tanjung Jabung Timur" }, { provinsiId: 6, nama: "Kabupaten Bungo" },
    { provinsiId: 6, nama: "Kabupaten Tebo" },
    { provinsiId: 6, nama: "Kota Jambi" }, { provinsiId: 6, nama: "Kota Sungai Penuh" },
    // 7. Sumatera Selatan
    { provinsiId: 7, nama: "Kabupaten Ogan Komering Ulu" }, { provinsiId: 7, nama: "Kabupaten Ogan Komering Ilir" },
    { provinsiId: 7, nama: "Kabupaten Muara Enim" }, { provinsiId: 7, nama: "Kabupaten Lahat" },
    { provinsiId: 7, nama: "Kabupaten Musi Rawas" }, { provinsiId: 7, nama: "Kabupaten Musi Banyuasin" },
    { provinsiId: 7, nama: "Kabupaten Banyuasin" }, { provinsiId: 7, nama: "Kabupaten Ogan Komering Ulu Timur" },
    { provinsiId: 7, nama: "Kabupaten Ogan Komering Ulu Selatan" }, { provinsiId: 7, nama: "Kabupaten Ogan Ilir" },
    { provinsiId: 7, nama: "Kabupaten Empat Lawang" }, { provinsiId: 7, nama: "Kabupaten Penukal Abab Lematang Ilir" },
    { provinsiId: 7, nama: "Kabupaten Musi Rawas Utara" },
    { provinsiId: 7, nama: "Kota Palembang" }, { provinsiId: 7, nama: "Kota Pagar Alam" },
    { provinsiId: 7, nama: "Kota Lubuk Linggau" }, { provinsiId: 7, nama: "Kota Prabumulih" },
    // 8. Kepulauan Bangka Belitung
    { provinsiId: 8, nama: "Kabupaten Bangka" }, { provinsiId: 8, nama: "Kabupaten Belitung" },
    { provinsiId: 8, nama: "Kabupaten Bangka Selatan" }, { provinsiId: 8, nama: "Kabupaten Bangka Tengah" },
    { provinsiId: 8, nama: "Kabupaten Bangka Barat" }, { provinsiId: 8, nama: "Kabupaten Belitung Timur" },
    { provinsiId: 8, nama: "Kota Pangkal Pinang" },
    // 9. Bengkulu
    { provinsiId: 9, nama: "Kabupaten Bengkulu Selatan" }, { provinsiId: 9, nama: "Kabupaten Rejang Lebong" },
    { provinsiId: 9, nama: "Kabupaten Bengkulu Utara" }, { provinsiId: 9, nama: "Kabupaten Kaur" },
    { provinsiId: 9, nama: "Kabupaten Seluma" }, { provinsiId: 9, nama: "Kabupaten Mukomuko" },
    { provinsiId: 9, nama: "Kabupaten Lebong" }, { provinsiId: 9, nama: "Kabupaten Kepahiang" },
    { provinsiId: 9, nama: "Kabupaten Bengkulu Tengah" },
    { provinsiId: 9, nama: "Kota Bengkulu" },
    // 10. Lampung
    { provinsiId: 10, nama: "Kabupaten Lampung Selatan" }, { provinsiId: 10, nama: "Kabupaten Lampung Tengah" },
    { provinsiId: 10, nama: "Kabupaten Lampung Utara" }, { provinsiId: 10, nama: "Kabupaten Lampung Barat" },
    { provinsiId: 10, nama: "Kabupaten Tulang Bawang" }, { provinsiId: 10, nama: "Kabupaten Tanggamus" },
    { provinsiId: 10, nama: "Kabupaten Lampung Timur" }, { provinsiId: 10, nama: "Kabupaten Way Kanan" },
    { provinsiId: 10, nama: "Kabupaten Pesawaran" }, { provinsiId: 10, nama: "Kabupaten Pringsewu" },
    { provinsiId: 10, nama: "Kabupaten Mesuji" }, { provinsiId: 10, nama: "Kabupaten Tulang Bawang Barat" },
    { provinsiId: 10, nama: "Kabupaten Pesisir Barat" },
    { provinsiId: 10, nama: "Kota Bandar Lampung" }, { provinsiId: 10, nama: "Kota Metro" },
    // 11. DKI Jakarta
    { provinsiId: 11, nama: "Kabupaten Administrasi Kepulauan Seribu" },
    { provinsiId: 11, nama: "Kota Administrasi Jakarta Pusat" },
    { provinsiId: 11, nama: "Kota Administrasi Jakarta Utara" },
    { provinsiId: 11, nama: "Kota Administrasi Jakarta Barat" },
    { provinsiId: 11, nama: "Kota Administrasi Jakarta Selatan" },
    { provinsiId: 11, nama: "Kota Administrasi Jakarta Timur" },
    // 12. Jawa Barat
    { provinsiId: 12, nama: "Kabupaten Bogor" }, { provinsiId: 12, nama: "Kabupaten Sukabumi" },
    { provinsiId: 12, nama: "Kabupaten Cianjur" }, { provinsiId: 12, nama: "Kabupaten Bandung" },
    { provinsiId: 12, nama: "Kabupaten Garut" }, { provinsiId: 12, nama: "Kabupaten Tasikmalaya" },
    { provinsiId: 12, nama: "Kabupaten Ciamis" }, { provinsiId: 12, nama: "Kabupaten Kuningan" },
    { provinsiId: 12, nama: "Kabupaten Cirebon" }, { provinsiId: 12, nama: "Kabupaten Majalengka" },
    { provinsiId: 12, nama: "Kabupaten Sumedang" }, { provinsiId: 12, nama: "Kabupaten Indramayu" },
    { provinsiId: 12, nama: "Kabupaten Subang" }, { provinsiId: 12, nama: "Kabupaten Purwakarta" },
    { provinsiId: 12, nama: "Kabupaten Karawang" }, { provinsiId: 12, nama: "Kabupaten Bekasi" },
    { provinsiId: 12, nama: "Kabupaten Bandung Barat" }, { provinsiId: 12, nama: "Kabupaten Pangandaran" },
    { provinsiId: 12, nama: "Kota Bogor" }, { provinsiId: 12, nama: "Kota Sukabumi" },
    { provinsiId: 12, nama: "Kota Bandung" }, { provinsiId: 12, nama: "Kota Cirebon" },
    { provinsiId: 12, nama: "Kota Bekasi" }, { provinsiId: 12, nama: "Kota Depok" },
    { provinsiId: 12, nama: "Kota Cimahi" }, { provinsiId: 12, nama: "Kota Tasikmalaya" },
    { provinsiId: 12, nama: "Kota Banjar" },
    // 13. Banten
    { provinsiId: 13, nama: "Kabupaten Pandeglang" }, { provinsiId: 13, nama: "Kabupaten Lebak" },
    { provinsiId: 13, nama: "Kabupaten Tangerang" }, { provinsiId: 13, nama: "Kabupaten Serang" },
    { provinsiId: 13, nama: "Kota Tangerang" }, { provinsiId: 13, nama: "Kota Cilegon" },
    { provinsiId: 13, nama: "Kota Serang" }, { provinsiId: 13, nama: "Kota Tangerang Selatan" },
    // 14. Jawa Tengah
    { provinsiId: 14, nama: "Kabupaten Cilacap" }, { provinsiId: 14, nama: "Kabupaten Banyumas" },
    { provinsiId: 14, nama: "Kabupaten Purbalingga" }, { provinsiId: 14, nama: "Kabupaten Banjarnegara" },
    { provinsiId: 14, nama: "Kabupaten Kebumen" }, { provinsiId: 14, nama: "Kabupaten Purworejo" },
    { provinsiId: 14, nama: "Kabupaten Wonosobo" }, { provinsiId: 14, nama: "Kabupaten Magelang" },
    { provinsiId: 14, nama: "Kabupaten Boyolali" }, { provinsiId: 14, nama: "Kabupaten Klaten" },
    { provinsiId: 14, nama: "Kabupaten Sukoharjo" }, { provinsiId: 14, nama: "Kabupaten Wonogiri" },
    { provinsiId: 14, nama: "Kabupaten Karanganyar" }, { provinsiId: 14, nama: "Kabupaten Sragen" },
    { provinsiId: 14, nama: "Kabupaten Grobogan" }, { provinsiId: 14, nama: "Kabupaten Blora" },
    { provinsiId: 14, nama: "Kabupaten Rembang" }, { provinsiId: 14, nama: "Kabupaten Pati" },
    { provinsiId: 14, nama: "Kabupaten Kudus" }, { provinsiId: 14, nama: "Kabupaten Jepara" },
    { provinsiId: 14, nama: "Kabupaten Demak" }, { provinsiId: 14, nama: "Kabupaten Semarang" },
    { provinsiId: 14, nama: "Kabupaten Temanggung" }, { provinsiId: 14, nama: "Kabupaten Kendal" },
    { provinsiId: 14, nama: "Kabupaten Batang" }, { provinsiId: 14, nama: "Kabupaten Pekalongan" },
    { provinsiId: 14, nama: "Kabupaten Pemalang" }, { provinsiId: 14, nama: "Kabupaten Tegal" },
    { provinsiId: 14, nama: "Kabupaten Brebes" },
    { provinsiId: 14, nama: "Kota Magelang" }, { provinsiId: 14, nama: "Kota Surakarta" },
    { provinsiId: 14, nama: "Kota Salatiga" }, { provinsiId: 14, nama: "Kota Semarang" },
    { provinsiId: 14, nama: "Kota Pekalongan" }, { provinsiId: 14, nama: "Kota Tegal" },
    // 15. DI Yogyakarta
    { provinsiId: 15, nama: "Kabupaten Kulon Progo" }, { provinsiId: 15, nama: "Kabupaten Bantul" },
    { provinsiId: 15, nama: "Kabupaten Gunungkidul" }, { provinsiId: 15, nama: "Kabupaten Sleman" },
    { provinsiId: 15, nama: "Kota Yogyakarta" },
    // 16. Jawa Timur
    { provinsiId: 16, nama: "Kabupaten Pacitan" }, { provinsiId: 16, nama: "Kabupaten Ponorogo" },
    { provinsiId: 16, nama: "Kabupaten Trenggalek" }, { provinsiId: 16, nama: "Kabupaten Tulungagung" },
    { provinsiId: 16, nama: "Kabupaten Blitar" }, { provinsiId: 16, nama: "Kabupaten Kediri" },
    { provinsiId: 16, nama: "Kabupaten Malang" }, { provinsiId: 16, nama: "Kabupaten Lumajang" },
    { provinsiId: 16, nama: "Kabupaten Jember" }, { provinsiId: 16, nama: "Kabupaten Banyuwangi" },
    { provinsiId: 16, nama: "Kabupaten Bondowoso" }, { provinsiId: 16, nama: "Kabupaten Situbondo" },
    { provinsiId: 16, nama: "Kabupaten Probolinggo" }, { provinsiId: 16, nama: "Kabupaten Pasuruan" },
    { provinsiId: 16, nama: "Kabupaten Sidoarjo" }, { provinsiId: 16, nama: "Kabupaten Mojokerto" },
    { provinsiId: 16, nama: "Kabupaten Jombang" }, { provinsiId: 16, nama: "Kabupaten Nganjuk" },
    { provinsiId: 16, nama: "Kabupaten Madiun" }, { provinsiId: 16, nama: "Kabupaten Magetan" },
    { provinsiId: 16, nama: "Kabupaten Ngawi" }, { provinsiId: 16, nama: "Kabupaten Bojonegoro" },
    { provinsiId: 16, nama: "Kabupaten Tuban" }, { provinsiId: 16, nama: "Kabupaten Lamongan" },
    { provinsiId: 16, nama: "Kabupaten Gresik" }, { provinsiId: 16, nama: "Kabupaten Bangkalan" },
    { provinsiId: 16, nama: "Kabupaten Sampang" }, { provinsiId: 16, nama: "Kabupaten Pamekasan" },
    { provinsiId: 16, nama: "Kabupaten Sumenep" },
    { provinsiId: 16, nama: "Kota Kediri" }, { provinsiId: 16, nama: "Kota Blitar" },
    { provinsiId: 16, nama: "Kota Malang" }, { provinsiId: 16, nama: "Kota Probolinggo" },
    { provinsiId: 16, nama: "Kota Pasuruan" }, { provinsiId: 16, nama: "Kota Mojokerto" },
    { provinsiId: 16, nama: "Kota Madiun" }, { provinsiId: 16, nama: "Kota Surabaya" },
    { provinsiId: 16, nama: "Kota Batu" },
    // 17. Bali
    { provinsiId: 17, nama: "Kabupaten Jembrana" }, { provinsiId: 17, nama: "Kabupaten Tabanan" },
    { provinsiId: 17, nama: "Kabupaten Badung" }, { provinsiId: 17, nama: "Kabupaten Gianyar" },
    { provinsiId: 17, nama: "Kabupaten Klungkung" }, { provinsiId: 17, nama: "Kabupaten Bangli" },
    { provinsiId: 17, nama: "Kabupaten Karangasem" }, { provinsiId: 17, nama: "Kabupaten Buleleng" },
    { provinsiId: 17, nama: "Kota Denpasar" },
    // 18. Nusa Tenggara Barat
    { provinsiId: 18, nama: "Kabupaten Lombok Barat" }, { provinsiId: 18, nama: "Kabupaten Lombok Tengah" },
    { provinsiId: 18, nama: "Kabupaten Lombok Timur" }, { provinsiId: 18, nama: "Kabupaten Sumbawa" },
    { provinsiId: 18, nama: "Kabupaten Dompu" }, { provinsiId: 18, nama: "Kabupaten Bima" },
    { provinsiId: 18, nama: "Kabupaten Sumbawa Barat" }, { provinsiId: 18, nama: "Kabupaten Lombok Utara" },
    { provinsiId: 18, nama: "Kota Mataram" }, { provinsiId: 18, nama: "Kota Bima" },
    // 19. Nusa Tenggara Timur
    { provinsiId: 19, nama: "Kabupaten Kupang" }, { provinsiId: 19, nama: "Kabupaten Timor Tengah Selatan" },
    { provinsiId: 19, nama: "Kabupaten Timor Tengah Utara" }, { provinsiId: 19, nama: "Kabupaten Belu" },
    { provinsiId: 19, nama: "Kabupaten Alor" }, { provinsiId: 19, nama: "Kabupaten Flores Timur" },
    { provinsiId: 19, nama: "Kabupaten Sikka" }, { provinsiId: 19, nama: "Kabupaten Ende" },
    { provinsiId: 19, nama: "Kabupaten Ngada" }, { provinsiId: 19, nama: "Kabupaten Manggarai" },
    { provinsiId: 19, nama: "Kabupaten Sumba Timur" }, { provinsiId: 19, nama: "Kabupaten Sumba Barat" },
    { provinsiId: 19, nama: "Kabupaten Lembata" }, { provinsiId: 19, nama: "Kabupaten Rote Ndao" },
    { provinsiId: 19, nama: "Kabupaten Manggarai Barat" }, { provinsiId: 19, nama: "Kabupaten Nagekeo" },
    { provinsiId: 19, nama: "Kabupaten Sumba Tengah" }, { provinsiId: 19, nama: "Kabupaten Sumba Barat Daya" },
    { provinsiId: 19, nama: "Kabupaten Manggarai Timur" }, { provinsiId: 19, nama: "Kabupaten Sabu Raijua" },
    { provinsiId: 19, nama: "Kabupaten Malaka" },
    { provinsiId: 19, nama: "Kota Kupang" },
    // 20. Kalimantan Barat
    { provinsiId: 20, nama: "Kabupaten Sambas" }, { provinsiId: 20, nama: "Kabupaten Mempawah" },
    { provinsiId: 20, nama: "Kabupaten Sanggau" }, { provinsiId: 20, nama: "Kabupaten Ketapang" },
    { provinsiId: 20, nama: "Kabupaten Sintang" }, { provinsiId: 20, nama: "Kabupaten Kapuas Hulu" },
    { provinsiId: 20, nama: "Kabupaten Bengkayang" }, { provinsiId: 20, nama: "Kabupaten Landak" },
    { provinsiId: 20, nama: "Kabupaten Sekadau" }, { provinsiId: 20, nama: "Kabupaten Melawi" },
    { provinsiId: 20, nama: "Kabupaten Kayong Utara" }, { provinsiId: 20, nama: "Kabupaten Kubu Raya" },
    { provinsiId: 20, nama: "Kota Pontianak" }, { provinsiId: 20, nama: "Kota Singkawang" },
    // 21. Kalimantan Tengah
    { provinsiId: 21, nama: "Kabupaten Kotawaringin Barat" }, { provinsiId: 21, nama: "Kabupaten Kotawaringin Timur" },
    { provinsiId: 21, nama: "Kabupaten Kapuas" }, { provinsiId: 21, nama: "Kabupaten Barito Selatan" },
    { provinsiId: 21, nama: "Kabupaten Barito Utara" }, { provinsiId: 21, nama: "Kabupaten Katingan" },
    { provinsiId: 21, nama: "Kabupaten Seruyan" }, { provinsiId: 21, nama: "Kabupaten Sukamara" },
    { provinsiId: 21, nama: "Kabupaten Lamandau" }, { provinsiId: 21, nama: "Kabupaten Gunung Mas" },
    { provinsiId: 21, nama: "Kabupaten Pulang Pisau" }, { provinsiId: 21, nama: "Kabupaten Murung Raya" },
    { provinsiId: 21, nama: "Kabupaten Barito Timur" },
    { provinsiId: 21, nama: "Kota Palangkaraya" },
    // 22. Kalimantan Selatan
    { provinsiId: 22, nama: "Kabupaten Tanah Laut" }, { provinsiId: 22, nama: "Kabupaten Kotabaru" },
    { provinsiId: 22, nama: "Kabupaten Banjar" }, { provinsiId: 22, nama: "Kabupaten Barito Kuala" },
    { provinsiId: 22, nama: "Kabupaten Tapin" }, { provinsiId: 22, nama: "Kabupaten Hulu Sungai Selatan" },
    { provinsiId: 22, nama: "Kabupaten Hulu Sungai Tengah" }, { provinsiId: 22, nama: "Kabupaten Hulu Sungai Utara" },
    { provinsiId: 22, nama: "Kabupaten Tabalong" }, { provinsiId: 22, nama: "Kabupaten Tanah Bumbu" },
    { provinsiId: 22, nama: "Kabupaten Balangan" },
    { provinsiId: 22, nama: "Kota Banjarmasin" }, { provinsiId: 22, nama: "Kota Banjarbaru" },
    // 23. Kalimantan Timur
    { provinsiId: 23, nama: "Kabupaten Paser" }, { provinsiId: 23, nama: "Kabupaten Kutai Kartanegara" },
    { provinsiId: 23, nama: "Kabupaten Berau" }, { provinsiId: 23, nama: "Kabupaten Kutai Barat" },
    { provinsiId: 23, nama: "Kabupaten Kutai Timur" }, { provinsiId: 23, nama: "Kabupaten Penajam Paser Utara" },
    { provinsiId: 23, nama: "Kabupaten Mahakam Ulu" },
    { provinsiId: 23, nama: "Kota Balikpapan" }, { provinsiId: 23, nama: "Kota Samarinda" },
    { provinsiId: 23, nama: "Kota Bontang" },
    // 24. Kalimantan Utara
    { provinsiId: 24, nama: "Kabupaten Bulungan" }, { provinsiId: 24, nama: "Kabupaten Malinau" },
    { provinsiId: 24, nama: "Kabupaten Nunukan" }, { provinsiId: 24, nama: "Kabupaten Tana Tidung" },
    { provinsiId: 24, nama: "Kota Tarakan" },
    // 25. Sulawesi Utara
    { provinsiId: 25, nama: "Kabupaten Bolaang Mongondow" }, { provinsiId: 25, nama: "Kabupaten Minahasa" },
    { provinsiId: 25, nama: "Kabupaten Kepulauan Sangihe" }, { provinsiId: 25, nama: "Kabupaten Kepulauan Talaud" },
    { provinsiId: 25, nama: "Kabupaten Minahasa Selatan" }, { provinsiId: 25, nama: "Kabupaten Minahasa Utara" },
    { provinsiId: 25, nama: "Kabupaten Minahasa Tenggara" }, { provinsiId: 25, nama: "Kabupaten Bolaang Mongondow Utara" },
    { provinsiId: 25, nama: "Kabupaten Kepulauan Siau Tagulandang Biaro" },
    { provinsiId: 25, nama: "Kabupaten Bolaang Mongondow Timur" }, { provinsiId: 25, nama: "Kabupaten Bolaang Mongondow Selatan" },
    { provinsiId: 25, nama: "Kota Manado" }, { provinsiId: 25, nama: "Kota Bitung" },
    { provinsiId: 25, nama: "Kota Tomohon" }, { provinsiId: 25, nama: "Kota Kotamobagu" },
    // 26. Sulawesi Tengah
    { provinsiId: 26, nama: "Kabupaten Banggai" }, { provinsiId: 26, nama: "Kabupaten Poso" },
    { provinsiId: 26, nama: "Kabupaten Donggala" }, { provinsiId: 26, nama: "Kabupaten Toli-Toli" },
    { provinsiId: 26, nama: "Kabupaten Buol" }, { provinsiId: 26, nama: "Kabupaten Morowali" },
    { provinsiId: 26, nama: "Kabupaten Banggai Kepulauan" }, { provinsiId: 26, nama: "Kabupaten Parigi Moutong" },
    { provinsiId: 26, nama: "Kabupaten Tojo Una Una" }, { provinsiId: 26, nama: "Kabupaten Sigi" },
    { provinsiId: 26, nama: "Kabupaten Banggai Laut" }, { provinsiId: 26, nama: "Kabupaten Morowali Utara" },
    { provinsiId: 26, nama: "Kota Palu" },
    // 27. Sulawesi Selatan
    { provinsiId: 27, nama: "Kabupaten Kepulauan Selayar" }, { provinsiId: 27, nama: "Kabupaten Bulukumba" },
    { provinsiId: 27, nama: "Kabupaten Bantaeng" }, { provinsiId: 27, nama: "Kabupaten Jeneponto" },
    { provinsiId: 27, nama: "Kabupaten Takalar" }, { provinsiId: 27, nama: "Kabupaten Gowa" },
    { provinsiId: 27, nama: "Kabupaten Sinjai" }, { provinsiId: 27, nama: "Kabupaten Bone" },
    { provinsiId: 27, nama: "Kabupaten Maros" }, { provinsiId: 27, nama: "Kabupaten Pangkajene dan Kepulauan" },
    { provinsiId: 27, nama: "Kabupaten Barru" }, { provinsiId: 27, nama: "Kabupaten Soppeng" },
    { provinsiId: 27, nama: "Kabupaten Wajo" }, { provinsiId: 27, nama: "Kabupaten Sidenreng Rappang" },
    { provinsiId: 27, nama: "Kabupaten Pinrang" }, { provinsiId: 27, nama: "Kabupaten Enrekang" },
    { provinsiId: 27, nama: "Kabupaten Luwu" }, { provinsiId: 27, nama: "Kabupaten Tana Toraja" },
    { provinsiId: 27, nama: "Kabupaten Luwu Utara" }, { provinsiId: 27, nama: "Kabupaten Luwu Timur" },
    { provinsiId: 27, nama: "Kabupaten Toraja Utara" },
    { provinsiId: 27, nama: "Kota Makassar" }, { provinsiId: 27, nama: "Kota Parepare" },
    { provinsiId: 27, nama: "Kota Palopo" },
    // 28. Sulawesi Tenggara
    { provinsiId: 28, nama: "Kabupaten Kolaka" }, { provinsiId: 28, nama: "Kabupaten Konawe" },
    { provinsiId: 28, nama: "Kabupaten Muna" }, { provinsiId: 28, nama: "Kabupaten Buton" },
    { provinsiId: 28, nama: "Kabupaten Konawe Selatan" }, { provinsiId: 28, nama: "Kabupaten Bombana" },
    { provinsiId: 28, nama: "Kabupaten Wakatobi" }, { provinsiId: 28, nama: "Kabupaten Kolaka Utara" },
    { provinsiId: 28, nama: "Kabupaten Konawe Utara" }, { provinsiId: 28, nama: "Kabupaten Buton Utara" },
    { provinsiId: 28, nama: "Kabupaten Kolaka Timur" }, { provinsiId: 28, nama: "Kabupaten Konawe Kepulauan" },
    { provinsiId: 28, nama: "Kabupaten Muna Barat" }, { provinsiId: 28, nama: "Kabupaten Buton Tengah" },
    { provinsiId: 28, nama: "Kabupaten Buton Selatan" },
    { provinsiId: 28, nama: "Kota Kendari" }, { provinsiId: 28, nama: "Kota Bau Bau" },
    // 29. Gorontalo
    { provinsiId: 29, nama: "Kabupaten Gorontalo" }, { provinsiId: 29, nama: "Kabupaten Boalemo" },
    { provinsiId: 29, nama: "Kabupaten Bone Bolango" }, { provinsiId: 29, nama: "Kabupaten Pohuwato" },
    { provinsiId: 29, nama: "Kabupaten Gorontalo Utara" },
    { provinsiId: 29, nama: "Kota Gorontalo" },
    // 30. Sulawesi Barat
    { provinsiId: 30, nama: "Kabupaten Pasangkayu" }, { provinsiId: 30, nama: "Kabupaten Mamuju" },
    { provinsiId: 30, nama: "Kabupaten Mamasa" }, { provinsiId: 30, nama: "Kabupaten Polewali Mandar" },
    { provinsiId: 30, nama: "Kabupaten Majene" }, { provinsiId: 30, nama: "Kabupaten Mamuju Tengah" },
    // 31. Maluku
    { provinsiId: 31, nama: "Kabupaten Maluku Tengah" }, { provinsiId: 31, nama: "Kabupaten Maluku Tenggara" },
    { provinsiId: 31, nama: "Kabupaten Kepulauan Tanimbar" }, { provinsiId: 31, nama: "Kabupaten Buru" },
    { provinsiId: 31, nama: "Kabupaten Seram Bagian Timur" }, { provinsiId: 31, nama: "Kabupaten Seram Bagian Barat" },
    { provinsiId: 31, nama: "Kabupaten Kepulauan Aru" }, { provinsiId: 31, nama: "Kabupaten Maluku Barat Daya" },
    { provinsiId: 31, nama: "Kabupaten Buru Selatan" },
    { provinsiId: 31, nama: "Kota Ambon" }, { provinsiId: 31, nama: "Kota Tual" },
    // 32. Maluku Utara
    { provinsiId: 32, nama: "Kabupaten Halmahera Barat" }, { provinsiId: 32, nama: "Kabupaten Halmahera Tengah" },
    { provinsiId: 32, nama: "Kabupaten Halmahera Utara" }, { provinsiId: 32, nama: "Kabupaten Halmahera Selatan" },
    { provinsiId: 32, nama: "Kabupaten Kepulauan Sula" }, { provinsiId: 32, nama: "Kabupaten Halmahera Timur" },
    { provinsiId: 32, nama: "Kabupaten Pulau Morotai" }, { provinsiId: 32, nama: "Kabupaten Pulau Taliabu" },
    { provinsiId: 32, nama: "Kota Ternate" }, { provinsiId: 32, nama: "Kota Tidore Kepulauan" },
    // 33. Papua
    { provinsiId: 33, nama: "Kabupaten Jayapura" }, { provinsiId: 33, nama: "Kabupaten Kepulauan Yapen" },
    { provinsiId: 33, nama: "Kabupaten Biak Numfor" }, { provinsiId: 33, nama: "Kabupaten Sarmi" },
    { provinsiId: 33, nama: "Kabupaten Keerom" }, { provinsiId: 33, nama: "Kabupaten Waropen" },
    { provinsiId: 33, nama: "Kabupaten Supiori" }, { provinsiId: 33, nama: "Kabupaten Mamberamo Raya" },
    { provinsiId: 33, nama: "Kota Jayapura" },
    // 34. Papua Barat
    { provinsiId: 34, nama: "Kabupaten Manokwari" }, { provinsiId: 34, nama: "Kabupaten Fak Fak" },
    { provinsiId: 34, nama: "Kabupaten Teluk Bintuni" }, { provinsiId: 34, nama: "Kabupaten Teluk Wondama" },
    { provinsiId: 34, nama: "Kabupaten Kaimana" }, { provinsiId: 34, nama: "Kabupaten Manokwari Selatan" },
    { provinsiId: 34, nama: "Kabupaten Pegunungan Arfak" },
    // 35. Papua Selatan
    { provinsiId: 35, nama: "Kabupaten Merauke" }, { provinsiId: 35, nama: "Kabupaten Boven Digoel" },
    { provinsiId: 35, nama: "Kabupaten Mappi" }, { provinsiId: 35, nama: "Kabupaten Asmat" },
    // 36. Papua Tengah
    { provinsiId: 36, nama: "Kabupaten Nabire" }, { provinsiId: 36, nama: "Kabupaten Puncak Jaya" },
    { provinsiId: 36, nama: "Kabupaten Paniai" }, { provinsiId: 36, nama: "Kabupaten Mimika" },
    { provinsiId: 36, nama: "Kabupaten Puncak" }, { provinsiId: 36, nama: "Kabupaten Dogiyai" },
    { provinsiId: 36, nama: "Kabupaten Intan Jaya" }, { provinsiId: 36, nama: "Kabupaten Deiyai" },
    // 37. Papua Pegunungan
    { provinsiId: 37, nama: "Kabupaten Jayawijaya" }, { provinsiId: 37, nama: "Kabupaten Pegunungan Bintang" },
    { provinsiId: 37, nama: "Kabupaten Yahukimo" }, { provinsiId: 37, nama: "Kabupaten Tolikara" },
    { provinsiId: 37, nama: "Kabupaten Mamberamo Tengah" }, { provinsiId: 37, nama: "Kabupaten Yalimo" },
    { provinsiId: 37, nama: "Kabupaten Lanny Jaya" }, { provinsiId: 37, nama: "Kabupaten Nduga" },
    // 38. Papua Barat Daya
    { provinsiId: 38, nama: "Kabupaten Sorong" }, { provinsiId: 38, nama: "Kabupaten Sorong Selatan" },
    { provinsiId: 38, nama: "Kabupaten Raja Ampat" }, { provinsiId: 38, nama: "Kabupaten Tambrauw" },
    { provinsiId: 38, nama: "Kabupaten Maybrat" },
    { provinsiId: 38, nama: "Kota Sorong" },
  ];

  // Insert batch 50 sekaligus untuk performa
  const BATCH_SIZE = 50;
  for (let i = 0; i < dataKota.length; i += BATCH_SIZE) {
    const batch = dataKota.slice(i, i + BATCH_SIZE).map((item, idx) => ({
      id: i + idx + 1,
      provinsiId: item.provinsiId,
      nama: item.nama,
    }));
    await db.insert(kota).values(batch).onConflictDoUpdate({ target: kota.id, set: { nama: sql`excluded.nama` } });
  }
  console.log(`✅ Kota seeded: ${dataKota.length} kabupaten/kota!`);
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
