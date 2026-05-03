import EventCard from "@/components/shared/EventCard";

const eventPolines = [
  {
    id: "1",
    title: "National Robotic Competition: Polines Circuit 2024",
    date: "SABTU, 24 OKT • 09:00",
    price: 50000,
    category: "Teknologi",
    organizer: "BEM Polines",
    type: "POLINES" as const,
  },
  {
    id: "2",
    title: "Future of UX/UI Design in AI Era: Global Perspectives",
    date: "MINGGU, 25 OKT • 10:00",
    price: null,
    category: "Desain",
    organizer: "Design Collective ID",
    type: "POLINES" as const,
  },
  {
    id: "3",
    title: "Symphony in Blue: Polines Annual Music Night",
    date: "JUMAT, 30 OKT • 19:00",
    price: 35000,
    category: "Seni",
    organizer: "UKM Musik",
    type: "POLINES" as const,
  },
  {
    id: "4",
    title: "Semarang Creative Hub: Weekend Night Market",
    date: "SABTU, 31 OKT • 16:00",
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
    price: 50000,
    category: "Teknologi",
    organizer: "BEM Polines",
    type: "UMUM" as const,
  },
  {
    id: "6",
    title: "Future of UX/UI Design in AI Era: Global Perspectives",
    date: "MINGGU, 25 OKT • 10:00",
    price: null,
    category: "Desain",
    organizer: "Design Collective ID",
    type: "UMUM" as const,
  },
  {
    id: "7",
    title: "Symphony in Blue: Polines Annual Music Night",
    date: "JUMAT, 30 OKT • 19:00",
    price: 35000,
    category: "Seni",
    organizer: "UKM Musik",
    type: "UMUM" as const,
  },
  {
    id: "8",
    title: "Semarang Creative Hub: Weekend Night Market",
    date: "SABTU, 31 OKT • 16:00",
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
    <div>
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 mt-6">
        <div className="relative h-[300px] rounded-2xl overflow-hidden">
          <img
            src="/placeholder-banner.png"
            alt="hero"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute bottom-8 left-8 text-white">
            <span className="bg-yellow-400 text-yellow-900 text-[11px] font-bold px-3 py-1 rounded-full uppercase">
              Paling Banyak Diminati
            </span>

            <h1 className="text-3xl font-black mt-2 leading-tight">
              Electro <br /> Tech 2024
            </h1>

            <div className="flex items-center gap-4 mt-3">
              <button className="bg-white text-slate-800 font-semibold px-5 py-2 rounded-lg hover:scale-105 transition">
                Daftar
              </button>
              <span className="text-sm opacity-80">
                📅 Sept 15-20 • GBK Arena
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* KATEGORI */}
        <h2 className="text-xl font-extrabold mb-5">Kategori Event</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
            >
              <div
                className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center text-2xl group-hover:-translate-y-1 transition`}
              >
                {cat.emoji}
              </div>
              <span className="text-[11px] text-gray-600 text-center w-16">
                {cat.label}
              </span>
            </div>
          ))}
        </div>

        {/* EVENT POLINES */}
        <div className="mt-10">
          <div className="flex justify-between mb-5">
            <h2 className="text-xl font-extrabold">Event Polines</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {eventPolines.map((ev) => (
              <EventCard key={ev.id} {...ev} />
            ))}
          </div>
        </div>

        {/* EVENT UMUM */}
        <div className="mt-10">
          <div className="flex justify-between mb-5">
            <h2 className="text-xl font-extrabold">Event Umum</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {eventUmum.map((ev) => (
              <EventCard key={ev.id} {...ev} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}