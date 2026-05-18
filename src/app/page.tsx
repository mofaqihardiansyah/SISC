import { db } from "@/db";
import { event, kategori, kota } from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import Footer from "@/components/shared/Footer";
import HeroSlider from "@/components/shared/HeroSlider";
import KategoriCarousel from "@/components/shared/KategoriCarousel";
import EventSection from "@/components/shared/EventSection";
import { auth } from "@/auth";

export default async function BerandaPage() {
<<<<<<< HEAD
  try {
    // Promise.all untuk mengambil semua data secara paralel agar cepat
    const [categories, heroEvents, eventPolines, eventUmum] = await Promise.all([
      // 1. Mengambil data kategori secara EKSPLISIT
      // Ini untuk memastikan Drizzle tidak bingung antara 'iconUrl' dan 'icon_url'
      db
        .select({
          id: kategori.id,
          nama: kategori.nama,
          slug: kategori.slug,
          iconUrl: kategori.iconUrl, // Pemetaan manual ke property skema
        })
        .from(kategori),
=======
  const [session, categories, heroEvents, eventPolines, eventUmum] = await Promise.all([
  auth(),
    db.select().from(kategori),
>>>>>>> ca5d8920bd5fda8cda19aa195e69ab08adf6d8d8

      // 2. Hero Slider (Event terpopuler)
      db
        .select({
          id: event.id,
          judul: event.judul,
          bannerUrl: event.bannerUrl,
          tanggalMulai: event.tanggalMulai,
          detailLokasi: event.detailLokasi,
        })
        .from(event)
        .where(and(isNull(event.dihapusPada), eq(event.status, "published")))
        .orderBy(desc(event.jumlahTayangan))
        .limit(5),

      // 3. Event Polines
      db
        .select({
          id: event.id,
          judul: event.judul,
          bannerUrl: event.bannerUrl,
          tanggalMulai: event.tanggalMulai,
          tipeHarga: event.tipeHarga,
          harga: event.harga,
          jenisEvent: event.jenisEvent,
          tipePlatform: event.tipePlatform,
          kotaNama: kota.nama,
          kategoriNama: kategori.nama,
        })
        .from(event)
        .leftJoin(kota, eq(event.kotaId, kota.id))
        .leftJoin(kategori, eq(event.kategoriId, kategori.id))
        .where(
          and(
            eq(event.isEventPolines, true),
            isNull(event.dihapusPada),
            eq(event.status, "published")
          )
        )
        .limit(8),

<<<<<<< HEAD
      // 4. Event Umum
      db
        .select({
          id: event.id,
          judul: event.judul,
          bannerUrl: event.bannerUrl,
          tanggalMulai: event.tanggalMulai,
          tipeHarga: event.tipeHarga,
          harga: event.harga,
          jenisEvent: event.jenisEvent,
          tipePlatform: event.tipePlatform,
          kotaNama: kota.nama,
          kategoriNama: kategori.nama,
        })
        .from(event)
        .leftJoin(kota, eq(event.kotaId, kota.id))
        .leftJoin(kategori, eq(event.kategoriId, kategori.id))
        .where(
          and(
            eq(event.isEventPolines, false),
            isNull(event.dihapusPada),
            eq(event.status, "published")
          )
        )
        .limit(8),
    ]);

    return (
      <div className="bg-gray-50 min-h-screen font-sans">
        {/* HERO */}
        <section className="px-4 sm:px-8 lg:px-16 mt-6">
          <HeroSlider events={heroEvents} />
        </section>

        <main className="px-4 sm:px-8 lg:px-16 py-10">
          {/* KATEGORI */}
          <div className="mb-10">
            <h2 className="text-2xl font-extrabold mb-5 text-slate-800">
              Kategori Event
            </h2>
            <KategoriCarousel categories={categories} />
          </div>

          {/* EVENT POLINES */}
          <EventSection
            title="Event Polines"
            viewAllHref="/jelajah?type=polines"
            events={eventPolines}
            type="POLINES"
            organizerLabel="Polines"
            emptyMessage="Belum ada event Polines saat ini."
          />

          {/* EVENT UMUM */}
          <EventSection
            title="Event Umum"
            viewAllHref="/jelajah?type=umum"
            events={eventUmum}
            type="UMUM"
            organizerLabel="Umum"
            emptyMessage="Belum ada event umum saat ini."
          />
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    // Jika masih ada error, ini akan menampilkan detail di terminal VS Code kamu
    console.error("DATABASE_ERROR_DI_BERANDA:", error);
    throw error;
  }
=======
    db
      .select({
        id: event.id,
        judul: event.judul,
        bannerUrl: event.bannerUrl,
        tanggalMulai: event.tanggalMulai,
        tipeHarga: event.tipeHarga,
        harga: event.harga,
        jenisEvent: event.jenisEvent,
        tipePlatform: event.tipePlatform,
        kotaNama: kota.nama,
        kategoriNama: kategori.nama,
      })
      .from(event)
      .leftJoin(kota, eq(event.kotaId, kota.id))
      .leftJoin(kategori, eq(event.kategoriId, kategori.id))
      .where(and(eq(event.isEventPolines, false), isNull(event.dihapusPada), eq(event.status, 'published')))
      .limit(8),
  ]);
  
const isLoggedIn = !!session?.user;
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* HERO */}
      <section className="px-4 sm:px-8 lg:px-16 mt-6 animate-in fade-in zoom-in-95 duration-1000">
        <HeroSlider events={heroEvents} />
      </section>

      <main className="px-4 sm:px-8 lg:px-16 py-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* KATEGORI */}
        <h2 className="text-2xl font-extrabold mb-5 text-slate-800">Kategori Event</h2>
        <KategoriCarousel categories={categories} />

        {/* EVENT POLINES */}
        <EventSection
          title="Event Polines"
          viewAllHref="/jelajah?type=polines"
          events={eventPolines}
          type="POLINES"
          organizerLabel="Polines"
          emptyMessage="Belum ada event Polines saat ini."
          isLoggedIn={isLoggedIn}
        />

        {/* EVENT UMUM */}
        <EventSection
          title="Event Umum"
          viewAllHref="/jelajah?type=umum"
          events={eventUmum}
          type="UMUM"
          organizerLabel="Umum"
          emptyMessage="Belum ada event umum saat ini."
          isLoggedIn={isLoggedIn}
        />
      </main>
      <Footer />
    </div>
  );
>>>>>>> ca5d8920bd5fda8cda19aa195e69ab08adf6d8d8
}