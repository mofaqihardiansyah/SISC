import { db } from "@/db";
import { event, kategori, kota } from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import Footer from "@/components/shared/Footer";
import HeroSlider from "@/components/shared/HeroSlider";
import KategoriCarousel from "@/components/shared/KategoriCarousel";
import EventSection from "@/components/shared/EventSection";
import AuthStatus from "@/components/shared/AuthStatus";
import { EVENT_TYPES } from "@/lib/constants";

export const revalidate = 60;

export default async function BerandaPage() {
  const [categories, heroEvents, eventPolines, eventUmum] = await Promise.all([
    db.select().from(kategori).limit(20),

    db
      .select({
        id: event.id,
        judul: event.judul,
        urlBanner: event.urlBanner,
        tanggalMulai: event.tanggalMulai,
        detailLokasi: event.detailLokasi,
      })
      .from(event)
      .where(and(isNull(event.dihapusPada), eq(event.status, 'published')))
      .orderBy(desc(event.jumlahTayangan))
      .limit(5),

    db
      .select({
        id: event.id,
        judul: event.judul,
        urlBanner: event.urlBanner,
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
      .where(and(eq(event.eventPolines, true), isNull(event.dihapusPada), eq(event.status, 'published')))
      .limit(8),

    db
      .select({
        id: event.id,
        judul: event.judul,
        urlBanner: event.urlBanner,
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
      .where(and(eq(event.eventPolines, false), isNull(event.dihapusPada), eq(event.status, 'published')))
      .limit(8),
  ]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <AuthStatus />

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
          type={EVENT_TYPES.POLINES}
          organizerLabel="Polines"
          emptyMessage="Belum ada event Polines saat ini."
          isLoggedIn={false}
        />

        {/* EVENT UMUM */}
        <EventSection
          title="Event Umum"
          viewAllHref="/jelajah?type=umum"
          events={eventUmum}
          type={EVENT_TYPES.UMUM}
          organizerLabel="Umum"
          emptyMessage="Belum ada event umum saat ini."
          isLoggedIn={false}
        />
      </main>
      <Footer />
    </div>
  );
}
