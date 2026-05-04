import EventCard from "@/components/shared/EventCard";
import { db } from "@/db";
import { event, kategori } from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import Footer from "@/components/shared/Footer";

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
  const categories = await db.select().from(kategori);

  const heroEvent = await db
    .select()
    .from(event)
    .where(isNull(event.dihapusPada))
    .orderBy(desc(event.jumlahTayangan))
    .limit(1)
    .then((res) => res[0] ?? null);

  const eventPolines = await db
    .select()
    .from(event)
    .where(and(eq(event.isEventPolines, true), isNull(event.dihapusPada)));

  const eventUmum = await db
    .select()
    .from(event)
    .where(and(eq(event.isEventPolines, false), isNull(event.dihapusPada)));

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <section className="px-4 sm:px-8 lg:px-16 mt-6">
        <div className="relative h-[300px] rounded-2xl overflow-hidden">
          <img
            src={heroEvent?.bannerUrl || "/placeholder-banner.png"}
            alt="hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <span className="bg-yellow-400 text-yellow-900 text-[11px] font-bold px-3 py-1 rounded-full uppercase">
              Paling Banyak Diminati
            </span>
            <h1 className="text-3xl font-black mt-2 leading-tight">
              {heroEvent?.judul ?? "Electro Tech 2024"}
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <a href={heroEvent ? `/event/${heroEvent.id}` : "#"}>
                <button className="bg-white text-slate-800 font-semibold px-5 py-2 rounded-lg hover:scale-105 transition">
                  Daftar
                </button>
              </a>
              <span className="text-sm opacity-80">
                📅{" "}
                {heroEvent?.tanggalMulai
                  ? heroEvent.tanggalMulai.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Sept 15-20"}{" "}
                • {heroEvent?.detailLokasi ?? "GBK Arena"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="px-4 sm:px-8 lg:px-16 py-10">

        {/* KATEGORI */}
        <h2 className="text-xl font-extrabold mb-5">Kategori Event</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <a key={cat.id} href={`/jelajah?kategori=${cat.slug}`} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${categoryColors[cat.slug ?? ""] ?? "bg-gray-400"} flex items-center justify-center text-2xl group-hover:-translate-y-1 transition`}>
                {cat.iconUrl}
              </div>
              <span className="text-[10px] sm:text-[11px] text-gray-600 text-center leading-tight">
                {cat.nama}
              </span>
            </a>
          ))}
        </div>

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