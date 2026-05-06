import { db } from "@/db";
import { event, kategori } from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import Footer from "@/components/shared/Footer";
import HeroSlider from "@/components/shared/HeroSlider";
import KategoriCarousel from "@/components/shared/KategoriCarousel";
import EventSection from "@/components/shared/EventSection";

export default async function BerandaPage() {
  const [categories, heroEvents, eventPolines, eventUmum] = await Promise.all([
    db.select().from(kategori),
    db.select().from(event).where(isNull(event.dihapusPada)).orderBy(desc(event.jumlahTayangan)).limit(5),
    db.select().from(event).where(and(eq(event.isEventPolines, true), isNull(event.dihapusPada))).limit(8),
    db.select().from(event).where(and(eq(event.isEventPolines, false), isNull(event.dihapusPada))).limit(8)
  ]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* HERO */}
      <section className="px-4 sm:px-8 lg:px-16 mt-6">
        <HeroSlider events={heroEvents} />
      </section>

      <main className="px-4 sm:px-8 lg:px-16 py-10">
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
}