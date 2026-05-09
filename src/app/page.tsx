import EventCard from "@/components/shared/EventCard";
import { db } from "@/db";
import { event, kategori } from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import Footer from "@/components/shared/Footer";
import HeroSlider from "@/components/shared/HeroSlider";
import KategoriCarousel from "@/components/shared/KategoriCarousel";

const categoryColors: Record<string, string> = {
  teknologi:                 "bg-orange-500",
  bisnis:                    "bg-blue-600",
  otomotif:                  "bg-yellow-400",
  ekonomi:                   "bg-teal-500",
  seni:                      "bg-purple-600",
  "artificial-intelligence": "bg-red-500",
  bahasa:                    "bg-pink-500",
  pendidikan:                "bg-yellow-500",
};

export default async function BerandaPage() {
  const categories = await db.select().from(kategori).catch(() => []);

  const heroEvents = await db
    .select()
    .from(event)
    .where(isNull(event.dihapusPada))
    .orderBy(desc(event.jumlahTayangan))
    .limit(5)
    .catch(() => []);

  const eventPolines = await db
    .select()
    .from(event)
    .where(and(eq(event.isEventPolines, true), isNull(event.dihapusPada)))
    .limit(8)
    .catch(() => []);

  const eventUmum = await db
    .select()
    .from(event)
    .where(and(eq(event.isEventPolines, false), isNull(event.dihapusPada)))
    .limit(8)
    .catch(() => []);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <section className="px-4 sm:px-8 lg:px-16 mt-6">
        <HeroSlider events={heroEvents} />
      </section>

      <main className="px-4 sm:px-8 lg:px-16 py-10">

        {/* KATEGORI */}
        <h2 className="text-2xl font-extrabold mb-5">Kategori Event</h2>
        <KategoriCarousel categories={categories} />

        {/* EVENT POLINES */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-extrabold">Event Polines</h2>
            <a href="/jelajah?type=polines" className="text-sm text-blue-600 hover:underline font-medium">
              Lihat Selengkapnya →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {eventPolines.length === 0 ? (
              <p className="text-gray-400 col-span-4">Belum ada event Polines.</p>
            ) : (
              eventPolines.map((ev) => (
                <EventCard
                  key={ev.id}
                  id={String(ev.id)}
                  title={ev.judul ?? "Tanpa Judul"}
                  date={
                    ev.tanggalMulai
                      ? ev.tanggalMulai.toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Tanggal belum diisi"
                  }
                  price={ev.tipeHarga === "free" ? 0 : (ev.harga ?? null)}
                  category={ev.jenisEvent ?? "Kategori"}
                  organizer={"Polines"}
                  type="POLINES"
                  imageUrl={ev.bannerUrl || "/placeholder-banner.png"}
                />
              ))
            )}
          </div>
        </div>

        {/* EVENT UMUM */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-extrabold">Event Umum</h2>
            <a href="/jelajah?type=umum" className="text-sm text-blue-600 hover:underline font-medium">
              Lihat Selengkapnya →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {eventUmum.length === 0 ? (
              <p className="text-gray-400 col-span-4">Belum ada event umum.</p>
            ) : (
              eventUmum.map((ev) => (
                <EventCard
                  key={ev.id}
                  id={String(ev.id)}
                  title={ev.judul ?? "Tanpa Judul"}
                  date={
                    ev.tanggalMulai
                      ? ev.tanggalMulai.toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Tanggal belum diisi"
                  }
                  price={ev.tipeHarga === "free" ? 0 : (ev.harga ?? null)}
                  category={ev.jenisEvent ?? "Kategori"}
                  organizer={"Umum"}
                  type="UMUM"
                  imageUrl={ev.bannerUrl || "/placeholder-banner.png"}
                />
              ))
            )}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}