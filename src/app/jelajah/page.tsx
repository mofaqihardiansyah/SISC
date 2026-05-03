'use client';

import React, { useState } from 'react';
import { Search, RotateCcw, Bookmark, ChevronDown } from 'lucide-react';

// TYPE
type EventType = {
  id: number;
  title: string;
  date: string;
  price: number | 0;
  creator: string;
  location: string;
  type: "Online" | "Offline" | "Hybrid";
  category: string;
  bookmarked: boolean;
};

// DATA
const events: EventType[] = [
  { id: 1, title: "Workshop UI/UX", date: "1 Mei 2026", price: 0, creator: "polines", location: "Semarang", type: "Offline", category: "Sains & Teknologi", bookmarked: false },
  { id: 2, title: "Seminar Kesehatan Mental", date: "2 Mei 2026", price: 25000, creator: "umum", location: "Jakarta", type: "Online", category: "Kesehatan", bookmarked: false },
  { id: 3, title: "Pelatihan Bisnis Startup", date: "3 Mei 2026", price: 100000, creator: "umum", location: "Kudus", type: "Hybrid", category: "Bisnis & Keuangan", bookmarked: false },
  { id: 4, title: "Kajian Islami", date: "4 Mei 2026", price: 0, creator: "polines", location: "Kebumen", type: "Offline", category: "Agama", bookmarked: false },
  { id: 5, title: "Turnamen Futsal", date: "5 Mei 2026", price: 50000, creator: "umum", location: "Sragen", type: "Offline", category: "Olahraga & Kebugaran", bookmarked: false },
  { id: 6, title: "Pameran Seni", date: "6 Mei 2026", price: 0, creator: "polines", location: "Semarang", type: "Hybrid", category: "Seni & Budaya", bookmarked: false },

  { id: 7, title: "Seminar AI", date: "7 Mei 2026", price: 75000, creator: "bem_polines", location: "Jakarta", type: "Online", category: "Sains & Teknologi", bookmarked: false },
  { id: 8, title: "Workshop Public Speaking", date: "8 Mei 2026", price: 0, creator: "polines", location: "Kudus", type: "Offline", category: "Pendidikan", bookmarked: false },
  { id: 9, title: "Seminar Investasi", date: "9 Mei 2026", price: 120000, creator: "umum", location: "Semarang", type: "Hybrid", category: "Bisnis & Keuangan", bookmarked: false },
  { id: 10, title: "Pelatihan Otomotif", date: "10 Mei 2026", price: 60000, creator: "umum", location: "Kebumen", type: "Offline", category: "Otomotif", bookmarked: false },
  { id: 11, title: "Workshop Fotografi", date: "11 Mei 2026", price: 0, creator: "polines", location: "Sragen", type: "Online", category: "Seni & Budaya", bookmarked: false },
  { id: 12, title: "Seminar Pendidikan", date: "12 Mei 2026", price: 30000, creator: "bem_polines", location: "Semarang", type: "Hybrid", category: "Pendidikan", bookmarked: false },

  { id: 13, title: "Yoga Class", date: "13 Mei 2026", price: 0, creator: "umum", location: "Jakarta", type: "Offline", category: "Olahraga & Kebugaran", bookmarked: false },
  { id: 14, title: "Seminar Cyber Security", date: "14 Mei 2026", price: 150000, creator: "polines", location: "Kudus", type: "Online", category: "Sains & Teknologi", bookmarked: false },
  { id: 15, title: "Festival Budaya", date: "15 Mei 2026", price: 0, creator: "umum", location: "Semarang", type: "Offline", category: "Seni & Budaya", bookmarked: false },
];


// DROPDOWN TYPE
type DropdownType = "Lokasi" | "Tipe Event" | "Kategori Event" | "Waktu" | "Harga";

export default function JelajahPage() {
    const [currentPage, setCurrentPage] = useState(1);
const eventsPerPage = 6;

  const [filters, setFilters] = useState({
    polines: false,
    price: "" as "" | "Gratis" | "Berbayar",
    location: "",
    type: "" as "" | "Online" | "Offline" | "Hybrid",
    category: "",
    time: "" as string,
  });

  const [searchLocation, setSearchLocation] = useState("");
  const [openDropdown, setOpenDropdown] = useState<DropdownType | null>(null);
React.useEffect(() => {
  setCurrentPage(1);
}, [filters]);

  const locations = ["Semarang", "Jakarta", "Kebumen", "Kudus", "Sragen"];

  const categories = [
    "Agama",
    "Olahraga & Kebugaran",
    "Kesehatan",
    "Pendidikan",
    "Bisnis & Keuangan",
    "Otomotif",
    "Sains & Teknologi",
    "Seni & Budaya",
    "Lainnya"
  ];

  const timeOptions = [
    "Hari Ini",
    "Besok",
    "Akhir Pekan",
    "Minggu Ini",
    "Minggu Depan",
    "Bulan Ini",
    "Bulan Depan"
  ];

  const monthMap: Record<string, number> = {
    Januari: 0, Februari: 1, Maret: 2, April: 3, Mei: 4, Juni: 5,
    Juli: 6, Agustus: 7, September: 8, Oktober: 9, November: 10, Desember: 11,
  };

  const parseDate = (dateStr: string) => {
    if (dateStr === "Tanggal Event") return null;
    const [day, monthStr, year] = dateStr.split(" ");
    return new Date(Number(year), monthMap[monthStr], Number(day));
  };

  // FILTER LOGIC
  // FILTER LOGIC
const filteredEvents = events.filter((event) => {
  const eventDate = parseDate(event.date);

  if (filters.polines && !event.creator.includes("polines")) return false;
  if (filters.price === "Gratis" && event.price !== 0) return false;
  if (filters.price === "Berbayar" && event.price === 0) return false;
  if (filters.location && event.location !== filters.location) return false;
  if (filters.type && event.type !== filters.type) return false;
  if (filters.category && event.category !== filters.category) return false;

  // FILTER WAKTU
  if (filters.time && eventDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDay = new Date(eventDate);
    eventDay.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const nextWeekStart = new Date(endOfWeek);
    nextWeekStart.setDate(endOfWeek.getDate() + 1);

    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

    if (filters.time === "Hari Ini" && eventDay.getTime() !== today.getTime()) return false;
    if (filters.time === "Besok" && eventDay.getTime() !== tomorrow.getTime()) return false;
    if (filters.time === "Akhir Pekan" && eventDay.getDay() !== 6 && eventDay.getDay() !== 0) return false;
    if (filters.time === "Minggu Ini" && (eventDay < startOfWeek || eventDay > endOfWeek)) return false;
    if (filters.time === "Minggu Depan" && (eventDay < nextWeekStart || eventDay > nextWeekEnd)) return false;

    if (filters.time === "Bulan Ini" &&
      (eventDay.getMonth() !== today.getMonth() ||
       eventDay.getFullYear() !== today.getFullYear())) return false;

    if (filters.time === "Bulan Depan") {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      if (eventDay.getMonth() !== nextMonth.getMonth() ||
          eventDay.getFullYear() !== nextMonth.getFullYear()) return false;
    }
  }

  return true;
});

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

const startIndex = (currentPage - 1) * eventsPerPage;

const paginatedEvents = filteredEvents.slice(
  startIndex,
  startIndex + eventsPerPage
);


  const resetFilter = () => {
    setFilters({
      polines: false,
      price: "",
      location: "",
      type: "",
      category: "",
      time: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8fafc]">

      {/* HEADER */}
      <header className="bg-[#0f172a] text-white px-12 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">POLIVENTS</h1>

        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="cari seminar..."
            className="w-full rounded-full py-2 px-5 text-sm text-black bg-white"
          />
          <Search className="absolute right-4 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        <nav className="flex items-center gap-6 text-sm">
          <a href="#">Beranda</a>
          <a href="#" className="font-bold border-b-2 border-white pb-1">Jelajah</a>
          <a href="#">Bantuan</a>
          <a href="#">Daftar</a>
          <button className="bg-white text-[#0f172a] px-4 py-1.5 rounded-md font-semibold">
            Masuk
          </button>
        </nav>
      </header>

      {/* MAIN */}
      <div className="max-w-[1300px] mx-auto w-full px-10 py-10 flex gap-8">

        {/* SIDEBAR */}
        <aside className="w-1/4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

            <div className="flex justify-between items-center mb-2">
              <h2 className="text-blue-700 font-semibold text-lg">
                Filter Pencarian
              </h2>
              <RotateCcw onClick={resetFilter} className="w-4 h-4 text-blue-700 cursor-pointer" />
            </div>

            <p className="text-xs text-gray-400 mb-6">
              Sesuaikan Penemuan Seminar
            </p>

            {/* TOGGLE POLINES */}
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium text-sm">Polines</span>
              <div
                onClick={() =>
                  setFilters({ ...filters, polines: !filters.polines })
                }
                className={`w-9 h-5 rounded-full p-1 cursor-pointer ${
                  filters.polines ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full transition ${
                    filters.polines ? "translate-x-4" : ""
                  }`}
                />
              </div>
            </div>

            {/* FILTER LIST */}
            {(["Lokasi", "Tipe Event", "Kategori Event", "Waktu", "Harga"] as DropdownType[]).map((item) => (
              <div key={item} className="border-t py-4 text-sm">

                <div
                  onClick={() =>
                    setOpenDropdown(openDropdown === item ? null : item)
                  }
                  
                  className="flex justify-between items-center cursor-pointer"
                >
                  <span>{item}</span>
                  <ChevronDown className={`w-4 h-4 ${openDropdown === item ? "rotate-180" : ""}`} />
                </div>

                {/* LOKASI */}
                {openDropdown === item && item === "Lokasi" && (
                  <div className="mt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Semua Lokasi"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />

                    {locations
                      .filter((loc) =>
                        loc.toLowerCase().includes(searchLocation.toLowerCase())
                      )
                      .map((loc) => (
                        <div
                          key={loc}
                          onClick={() =>
                            setFilters({ ...filters, location: loc })
                          }
                          className="cursor-pointer hover:text-blue-600"
                        >
                          {loc}
                        </div>
                      ))}

                    <div onClick={() => setFilters({ ...filters, location: "" })} className="text-xs text-gray-400 cursor-pointer">
                      Reset
                    </div>
                  </div>
                )}

                {/* TIPE EVENT */}
                {openDropdown === item && item === "Tipe Event" && (
                  <div className="mt-3 space-y-2">
                    {["Online", "Offline", "Hybrid"].map((type) => (
                      <div
                        key={type}
                        onClick={() =>
                          setFilters({ ...filters, type: type as any })
                        }
                        className="cursor-pointer hover:text-blue-600"
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}

                {/* KATEGORI */}
                {openDropdown === item && item === "Kategori Event" && (
                  <div className="mt-3 space-y-2">
                    <div
                      onClick={() =>
                        setFilters({ ...filters, category: "" })
                      }
                      className="text-gray-400 cursor-pointer"
                    >
                      Semua Kategori
                    </div>

                    {categories.map((cat) => (
                      <div
                        key={cat}
                        onClick={() =>
                          setFilters({ ...filters, category: cat })
                        }
                        className="cursor-pointer hover:text-blue-600"
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}

                {/* WAKTU */}
                {openDropdown === item && item === "Waktu" && (
                  <div className="mt-3 space-y-2">
                    {timeOptions.map((t) => (
                      <div
                        key={t}
                        onClick={() =>
                          setFilters({ ...filters, time: t })
                        }
                        className="cursor-pointer hover:text-blue-600"
                      >
                        {t}
                      </div>
                    ))}
                    <div
                      onClick={() => setFilters({ ...filters, time: "" })}
                      className="text-xs text-gray-400 cursor-pointer"
                    >
                      Reset
                    </div>
                  </div>
                )}

                {/* HARGA */}
                {openDropdown === item && item === "Harga" && (
                  <div className="mt-3 space-y-2">
                    <div onClick={() => setFilters({ ...filters, price: "Gratis" })}>Gratis</div>
                    <div onClick={() => setFilters({ ...filters, price: "Berbayar" })}>Berbayar</div>
                  </div>
                )}

              </div>
            ))}
          </div>
        </aside>

        {/* CONTENT */}
        <main className="w-3/4">
          <p className="text-sm text-gray-500 mb-6">
            Menampilkan <b>{filteredEvents.length}</b> event
          </p>

          <div className="grid grid-cols-3 gap-6">
            {paginatedEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="h-36 bg-gray-200">
                  <img src="/api/placeholder/400/220" className="w-full h-full object-cover" />
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold">{event.title}</h3>
                  <p className="text-xs text-gray-400">{event.date}</p>

                  <div className="flex justify-between mt-3">
                    <span className={`text-sm font-medium ${event.price === 0 ? "text-green-600" : "text-black"}`}>
  {event.price === 0 
    ? "Gratis" 
    : `Rp ${event.price.toLocaleString("id-ID")}`}
</span>

                    <Bookmark className="w-5 h-5 text-gray-300" />
                  </div>
                </div>

                <div className="px-4 py-3 border-t flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                    👤
                  </div>
                  <span className="text-xs">{event.creator}</span>
                </div>
              </div>
            ))}
            
          </div>
                 <div className="flex justify-end mt-8 gap-2">
  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      onClick={() => setCurrentPage(i + 1)}
      className={`px-4 py-2 rounded-md text-sm ${
        currentPage === i + 1
          ? "bg-blue-600 text-white"
          : "bg-white border text-gray-600"
      }`}
    >
      {i + 1}
    </button>
  ))}
</div>

        </main>
      </div>

     {/* ================= FOOTER ================= */}
      <footer className="bg-[#0f172a] text-white py-12 px-12 mt-16">
        <div className="max-w-[1300px] mx-auto grid grid-cols-4 gap-10">

          <div>
            <h2 className="font-bold mb-4">POLIVENTS</h2>
            <p className="text-gray-400 text-sm">
              Hubungkan koneksi anda dan tambah wawasan anda melalui seminar dan conference
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">BANTUAN</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>FAQ</li>
              <li>Kontak</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">JELAJAH EVENT</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>Jelajah</li>
              <li>Event Polines</li>
              <li>Event Umum</li>
            </ul>
          </div>

          <div className="text-right text-gray-400 text-sm flex items-end justify-end">
            © 2026 POLIVENTS
          </div>

        </div>
      </footer>

    </div>
  );
}
