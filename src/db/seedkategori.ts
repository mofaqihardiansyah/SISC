import { db } from "./index";
import { kategori, tag } from "./schema";

export async function seedKategori() {
  const kategoriData = [
    { id: 1, nama: "Teknologi", slug: "teknologi", iconUrl: "/icon/Teknologi.png" },
    { id: 2, nama: "Sains & Matematika", slug: "sains-matematika", iconUrl: "/icon/Sains.png" },
    { id: 3, nama: "Teknik & Rekayasa", slug: "teknik-rekayasa", iconUrl: "/icon/Teknologi.png" },
    { id: 4, nama: "Bisnis & Ekonomi", slug: "bisnis-ekonomi", iconUrl: "/icon/Bisnis.png" },
    { id: 5, nama: "Kesehatan & Medis", slug: "kesehatan-medis", iconUrl: "/icon/Kesehatan.png" },
    { id: 6, nama: "Bahasa & Sastra", slug: "bahasa-sastra", iconUrl: "/icon/Pendidikan.png" },
    { id: 7, nama: "Seni & Budaya", slug: "seni-budaya", iconUrl: "/icon/Seni.png" },
    { id: 8, nama: "Sosial & Hukum", slug: "sosial-hukum", iconUrl: "/icon/Pendidikan.png" },
    { id: 9, nama: "Pertanian & Lingkungan", slug: "pertanian-lingkungan", iconUrl: "/icon/Sains.png" },
    { id: 10, nama: "Pendidikan", slug: "pendidikan", iconUrl: "/icon/Pendidikan.png" },
    { id: 11, nama: "Riset & Publikasi", slug: "riset-publikasi", iconUrl: "/icon/Sains.png" },
    { id: 12, nama: "Psikologi", slug: "psikologi", iconUrl: "/icon/Kesehatan.png" },
    { id: 13, nama: "Filsafat & Agama", slug: "filsafat-agama", iconUrl: "/icon/Seni.png" },
  ];

  console.log("🚀 Seeding 13 kategori akademik...");
  for (const item of kategoriData) {
    await db.insert(kategori).values(item).onConflictDoUpdate({
      target: kategori.id,
      set: item
    });
  }
  console.log("✅ Kategori updated!");

  const tagData = [
    // Teknologi
    { nama: "#ArtificialIntelligence" }, { nama: "#CyberSecurity" }, { nama: "#DataScience" }, 
    { nama: "#InternetOfThings" }, { nama: "#SoftwareEngineering" }, { nama: "#CloudComputing" },
    // Sains & Matematika
    { nama: "#Fisika" }, { nama: "#Kimia" }, { nama: "#Biologi" }, 
    { nama: "#MatematikaTerapan" }, { nama: "#Biotehnologi" }, { nama: "#Statistika" },
    // Teknik & Rekayasa
    { nama: "#TeknikSipil" }, { nama: "#TeknikMesin" }, { nama: "#TeknikElektro" }, 
    { nama: "#TeknikKimia" }, { nama: "#TeknikIndustri" },
    // Bisnis & Ekonomi
    { nama: "#Manajemen" }, { nama: "#Akuntansi" }, { nama: "#EkonomiPembangunan" }, 
    { nama: "#Keuangan" }, { nama: "#Kewirausahaan" }, { nama: "#PemasaranDigital" },
    // Kesehatan & Medis
    { nama: "#Kedokteran" }, { nama: "#Keperawatan" }, { nama: "#KesehatanMasyarakat" }, 
    { nama: "#Farmasi" }, { nama: "#Gizi" },
    // Bahasa & Sastra
    { nama: "#Linguistik" }, { nama: "#SastraIndonesia" }, { nama: "#SastraInggris" }, 
    { nama: "#PembelajaranBahasa" }, { nama: "#Penerjemahan" },
    // Seni & Budaya
    { nama: "#SeniRupa" }, { nama: "#DesainKomunikasiVisual" }, { nama: "#SeniMusik" }, 
    { nama: "#AntropologiBudaya" }, { nama: "#Sejarah" },
    // Sosial & Hukum
    { nama: "#Sosiologi" }, { nama: "#IlmuPolitik" }, { nama: "#HukumPerdata" }, 
    { nama: "#HukumPidana" }, { nama: "#HubunganInternasional" },
    // Pertanian & Lingkungan
    { nama: "#Agronomi" }, { nama: "#Kehutanan" }, { nama: "#TeknologiPangan" }, 
    { nama: "#PerubahanIklim" }, { nama: "#PembangunanBerkelanjutan" },
    // Pendidikan
    { nama: "#KurikulumMerdeka" }, { nama: "#MetodePembelajaran" }, { nama: "#ManajemenPendidikan" }, 
    { nama: "#PendidikanInklusi" }, { nama: "#PendidikanKarakter" }, { nama: "#AsesmenPembelajaran" },
    // Riset & Publikasi
    { nama: "#MetodologiPenelitian" }, { nama: "#PenulisanKaryaIlmiah" }, { nama: "#JurnalScopus" }, 
    { nama: "#JurnalSinta" }, { nama: "#Mendeley" },
    // Psikologi
    { nama: "#PsikologiKlinis" }, { nama: "#PsikologiPerkembangan" }, { nama: "#PsikologiPendidikan" }, 
    { nama: "#KesehatanMental" }, { nama: "#Konseling" },
    // Filsafat & Agama
    { nama: "#FilsafatIlmu" }, { nama: "#StudiKeagamaan" }, { nama: "#Etika" }, 
    { nama: "#PendidikanAgama" }
  ];

  console.log("🚀 Seeding tags...");
  for (const item of tagData) {
    await db.insert(tag).values(item).onConflictDoNothing();
  }
  console.log("✅ Tags updated!");
}