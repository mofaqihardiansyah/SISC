import EventCard from "@/components/profile/EventCard";
import Link from "next/link";

const eventPolines = [
  {
    id: "1",
    title: "National Robotic Competition: Polines Circuit 2024",
    date: "SABTU, 24 OKT • 09:00",
    location: "Auditorium Utama Polines",
    price: 50000,
    category: "Teknologi",
    organizer: "BEM Polines",
    type: "POLINES" as const,
  },
  {
    id: "2",
    title: "Future of UX/UI Design in AI Era: Global Perspectives",
    date: "MINGGU, 25 OKT • 10:00",
    location: "Gedung Kerjasama Polines",
    price: null,
    category: "Desain",
    organizer: "Design Collective ID",
    type: "POLINES" as const,
  },
  {
    id: "3",
    title: "Symphony in Blue: Polines Annual Music Night",
    date: "JUMAT, 30 OKT • 19:00",
    location: "Lapangan Upnormal Polines",
    price: 35000,
    category: "Seni",
    organizer: "UKM Musik",
    type: "POLINES" as const,
  },
  {
    id: "4",
    title: "Semarang Creative Hub: Weekend Night Market",
    date: "SABTU, 31 OKT • 16:00",
    location: "Waterfront Polines",
    price: null,
    category: "Seni",
    organizer: "Hima Polines",
    type: "POLINES" as const,
  },
];

const eventUmum = [
  {
    id: "5",
    title: "National Robotic Competition: Polines Circuit 2024",
    date: "SABTU, 24 OKT • 09:00",
    location: "Semarang Convention Hall",
    price: 50000,
    category: "Teknologi",
    organizer: "BEM Polines",
    type: "UMUM" as const,
  },
  {
    id: "6",
    title: "Future of UX/UI Design in AI Era: Global Perspectives",
    date: "MINGGU, 25 OKT • 10:00",
    location: "Taman Kuliner Semarang",
    price: null,
    category: "Desain",
    organizer: "Design Collective ID",
    type: "UMUM" as const,
  },
  {
    id: "7",
    title: "Symphony in Blue: Polines Annual Music Night",
    date: "JUMAT, 30 OKT • 19:00",
    location: "Stadion Letjen Soeprapto",
    price: 35000,
    category: "Seni",
    organizer: "UKM Musik",
    type: "UMUM" as const,
  },
  {
    id: "8",
    title: "Semarang Creative Hub: Weekend Night Market",
    date: "SABTU, 31 OKT • 16:00",
    location: "Pandanaran Square",
    price: null,
    category: "Seni",
    organizer: "Hima Polines",
    type: "UMUM" as const,
  },
];

const categories = [
  { label: "Teknologi", emoji: "💻", color: "bg-orange-500" },
  { label: "Bisnis", emoji: "📊", color: "bg-blue-600" },
  { label: "Otomotif", emoji: "🚗", color: "bg-yellow-400" },
  { label: "Ekonomi", emoji: "✏️", color: "bg-teal-500" },
  { label: "Seni", emoji: "🎭", color: "bg-purple-600" },
  { label: "Artificial Intelligence", emoji: "🤖", color: "bg-red-500" },
  { label: "Bahasa", emoji: "🗣️", color: "bg-pink-500" },
  { label: "Pendidikan", emoji: "🏆", color: "bg-yellow-500" },
];

export default function BerandaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <div className="relative h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-orange-400 via-yellow-500 to-orange-600">
            <img
              src="/placeholder-banner.png"
              alt="hero"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 text-white">
              <span className="inline-block bg-yellow-300 text-yellow-900 text-xs sm:text-sm font-bold px-3 py-1 rounded-full uppercase">
                Paling Banyak Diminati
              </span>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mt-2 sm:mt-3 leading-tight">
                Electro <br /> Tech 2024
              </h1>

              <div className="flex items-center gap-3 mt-3 sm:mt-4">
                <button className="bg-white text-slate-800 font-semibold px-4 sm:px-5 py-2 rounded-lg hover:bg-gray-100 transition text-sm">
                  Daftar
                </button>
                <span className="text-xs sm:text-sm opacity-90">
                  📅 Sept 15-20 • GBK Arena
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* KATEGORI */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2 className="text-lg sm:text-xl font-bold mb-6 text-slate-900">Kategori Event</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link key={cat.label} href="#" className="flex flex-col items-center gap-2 group">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${cat.color} flex items-center justify-center text-xl sm:text-2xl group-hover:shadow-lg transition-all transform group-hover:scale-105`}
                >
                  {cat.emoji}
                </div>
                <span className="text-xs text-slate-600 text-center font-medium">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* EVENT POLINES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Event Polines</h2>
            <Link href="/explore" className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold">
              Lihat semuanya →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {eventPolines.map((ev) => (
              <div key={ev.id} className="h-full">
                <EventCard {...ev} variant="grid" />
              </div>
            ))}
          </div>
        </section>

        {/* EVENT UMUM */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Event Umum</h2>
            <Link href="/explore" className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold">
              Lihat semuanya →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {eventUmum.map((ev) => (
              <div key={ev.id} className="h-full">
                <EventCard {...ev} variant="grid" />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">POLIVENTS</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Hubungkan koneksi anda dan tambah wawasan anda melalui seminar dan conference
              </p>
            </div>

            {/* Bantuan */}
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wide">Bantuan</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>

            {/* Jelajahi Event */}
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wide">Jelajahi Event</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/explore" className="text-gray-400 hover:text-white transition-colors">
                    Jelajah
                  </Link>
                </li>
                <li>
                  <Link href="/explore" className="text-gray-400 hover:text-white transition-colors">
                    Event Polines
                  </Link>
                </li>
                <li>
                  <Link href="/explore" className="text-gray-400 hover:text-white transition-colors">
                    Event Umum
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div className="text-right">
              <p className="text-gray-400 text-sm">© 2026 POLIVENTS.</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700" />
        </div>
      </footer>
    </div>
  );
}
