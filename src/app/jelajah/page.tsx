'use client';

import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Bookmark, ChevronDown, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

type EventType = {
  id: number;
  judul: string;
  bannerUrl?: string;
  harga: number;
  tipeHarga: string;
  tipePlatform: string;
  isEventPolines: boolean;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: string;
  kategoriNama?: string;
  kotaNama?: string;
};

type DropdownType = "Lokasi" | "Tipe Event" | "Kategori Event" | "Waktu" | "Harga";

export default function JelajahPage() {
  const searchParams = useSearchParams();
  const queryQ = searchParams.get('q') || '';

  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kotaList, setKotaList] = useState<string[]>([]);
  const [kategoriList, setKategoriList] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState(queryQ);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const eventsPerPage = 6;

  const [filters, setFilters] = useState({
    polines: false,
    price: "" as "" | "Gratis" | "Berbayar",
    location: "",
    type: "",
    category: "",
    time: "",
  });

  const [searchLocation, setSearchLocation] = useState("");
  const [openDropdown, setOpenDropdown] = useState<DropdownType | null>(null);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Susun parameter URL berdasarkan kombinasi filter
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: eventsPerPage.toString(),
          q: searchTerm,
          polines: filters.polines.toString(),
          price: filters.price,
          location: filters.location,
          type: filters.type,
          category: filters.category,
          time: filters.time
        });

        const res = await fetch(`/api/events?${params.toString()}`);
        if (!res.ok) throw new Error('Gagal fetch');
        const data = await res.json();

        // Mode Kompatibilitas: Antisipasi respon raw array atau object pagination
        if (Array.isArray(data)) {
          setEvents(data);
          setTotalEvents(data.length);
          const kotaUnik = [...new Set(data.map((e: any) => e.kotaNama).filter(Boolean))] as string[];
          setKotaList(kotaUnik);
          const kategoriUnik = [...new Set(data.map((e: any) => e.kategoriNama).filter(Boolean))] as string[];
          setKategoriList(kategoriUnik);
        } else {
          setEvents(data.events || []);
          setTotalEvents(data.total || 0);
        }
      } catch (err) {
        setError('Gagal memuat data event.');
        console.error(err);
      }
      setLoading(false);
    };
    
    // Menggunakan timeout Debounce agar database tidak dispam setiap input diketik
    const timer = setTimeout(() => {
      fetchData();
    }, 300); 

    return () => clearTimeout(timer);
  }, [currentPage, filters, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm]);

  const timeOptions = [
    "Hari Ini", "Besok", "Akhir Pekan",
    "Minggu Ini", "Minggu Depan", "Bulan Ini", "Bulan Depan"
  ];

  // Mengsinkronisasi pencarian jika URL berubah sewaktu-waktu di halaman yang sama
  useEffect(() => {
    setSearchTerm(queryQ);
  }, [queryQ]);

  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  const resetFilter = () => {
    setFilters({ polines: false, price: "", location: "", type: "", category: "", time: "" });
  };

  const formatTanggal = (iso: string) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8fafc]">

     

      {/* MAIN */}
      <div className="max-w-[1300px] mx-auto w-full px-10 py-10 flex gap-8">

        {/* SIDEBAR */}
        <aside className="w-1/4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-blue-700 font-semibold text-lg">Filter Pencarian</h2>
              <RotateCcw onClick={resetFilter} className="w-4 h-4 text-blue-700 cursor-pointer" />
            </div>
            <p className="text-xs text-gray-400 mb-6">Sesuaikan Penemuan Event</p>

            {/* TOGGLE POLINES */}
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium text-sm">Polines</span>
              <div
                onClick={() => setFilters({ ...filters, polines: !filters.polines })}
                className={`w-9 h-5 rounded-full p-1 cursor-pointer transition-colors ${filters.polines ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${filters.polines ? "translate-x-4" : ""}`} />
              </div>
            </div>

            {(["Lokasi", "Tipe Event", "Kategori Event", "Waktu", "Harga"] as DropdownType[]).map((item) => (
              <div key={item} className="border-t py-4 text-sm">
                <div
                  onClick={() => setOpenDropdown(openDropdown === item ? null : item)}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    {item}
                    {((item === "Lokasi" && filters.location) ||
                      (item === "Tipe Event" && filters.type) ||
                      (item === "Kategori Event" && filters.category) ||
                      (item === "Waktu" && filters.time) ||
                      (item === "Harga" && filters.price))
                      ? <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> : null}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item ? "rotate-180" : ""}`} />
                </div>

                {/* LOKASI */}
                {openDropdown === item && item === "Lokasi" && (
                  <div className="mt-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Cari kota..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                    {kotaList
                      .filter(loc => loc.toLowerCase().includes(searchLocation.toLowerCase()))
                      .map(loc => (
                        <div
                          key={loc}
                          onClick={() => setFilters({ ...filters, location: loc })}
                          className={`cursor-pointer hover:text-blue-600 ${filters.location === loc ? "text-blue-600 font-semibold" : ""}`}
                        >
                          {loc}
                        </div>
                      ))}
                    <div onClick={() => setFilters({ ...filters, location: "" })} className="text-xs text-gray-400 cursor-pointer hover:text-red-400">Reset</div>
                  </div>
                )}

                {/* TIPE EVENT */}
                {openDropdown === item && item === "Tipe Event" && (
                  <div className="mt-3 space-y-2">
                    {["online", "offline", "hybrid"].map(type => (
                      <div
                        key={type}
                        onClick={() => setFilters({ ...filters, type })}
                        className={`cursor-pointer hover:text-blue-600 capitalize ${filters.type === type ? "text-blue-600 font-semibold" : ""}`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </div>
                    ))}
                    <div onClick={() => setFilters({ ...filters, type: "" })} className="text-xs text-gray-400 cursor-pointer hover:text-red-400">Reset</div>
                  </div>
                )}

                {/* KATEGORI */}
                {openDropdown === item && item === "Kategori Event" && (
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                    <div onClick={() => setFilters({ ...filters, category: "" })} className="text-gray-400 cursor-pointer hover:text-blue-600">Semua Kategori</div>
                    {kategoriList.map(cat => (
                      <div
                        key={cat}
                        onClick={() => setFilters({ ...filters, category: cat })}
                        className={`cursor-pointer hover:text-blue-600 ${filters.category === cat ? "text-blue-600 font-semibold" : ""}`}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}

                {/* WAKTU */}
                {openDropdown === item && item === "Waktu" && (
                  <div className="mt-3 space-y-2">
                    {timeOptions.map(t => (
                      <div
                        key={t}
                        onClick={() => setFilters({ ...filters, time: t })}
                        className={`cursor-pointer hover:text-blue-600 ${filters.time === t ? "text-blue-600 font-semibold" : ""}`}
                      >
                        {t}
                      </div>
                    ))}
                    <div onClick={() => setFilters({ ...filters, time: "" })} className="text-xs text-gray-400 cursor-pointer hover:text-red-400">Reset</div>
                  </div>
                )}

                {/* HARGA */}
                {openDropdown === item && item === "Harga" && (
                  <div className="mt-3 space-y-2">
                    {["Gratis", "Berbayar"].map(p => (
                      <div
                        key={p}
                        onClick={() => setFilters({ ...filters, price: p as "Gratis" | "Berbayar" })}
                        className={`cursor-pointer hover:text-blue-600 ${filters.price === p ? "text-blue-600 font-semibold" : ""}`}
                      >
                        {p}
                      </div>
                    ))}
                    <div onClick={() => setFilters({ ...filters, price: "" })} className="text-xs text-gray-400 cursor-pointer hover:text-red-400">Reset</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* CONTENT */}
        <main className="w-3/4">

          {loading && (
            <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Memuat event...</span>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <p className="text-sm text-gray-500 mb-6">
                Menampilkan <b>{totalEvents}</b> event
              </p>

              {events.length === 0 ? (
                <div className="text-center text-gray-400 py-20">
                  Tidak ada event yang sesuai filter.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6">
              {events.map((event, index) => (
                    <div key={event.id} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-36 bg-gray-200">
                        <Image
                          src={event.bannerUrl || "/api/placeholder/400/220"}
                          alt={event.judul}
                          fill
                      priority={index < 3}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex gap-1 mb-2">
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full capitalize">
                            {event.tipePlatform}
                          </span>
                          {event.isEventPolines && (
                            <span className="text-[10px] bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full">
                              Polines
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold line-clamp-2">{event.judul}</h3>
                        <p className="text-xs text-gray-400 mt-1">{formatTanggal(event.tanggalMulai)}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className={`text-sm font-medium ${event.tipeHarga === 'free' ? "text-green-600" : "text-black"}`}>
                            {event.tipeHarga === 'free' ? "Gratis" : `Rp ${event.harga?.toLocaleString("id-ID")}`}
                          </span>
                          <Bookmark className="w-5 h-5 text-gray-300 cursor-pointer hover:text-blue-500" />
                        </div>
                      </div>
                      <div className="px-4 py-3 border-t flex items-center gap-2">
                        <span className="text-xs text-gray-500">📍 {event.kotaNama ?? "-"}</span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{event.kategoriNama ?? "-"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-end mt-8 gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-md text-sm ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#0f172a] text-white py-12 px-12 mt-16">
        <div className="max-w-[1300px] mx-auto grid grid-cols-4 gap-10">
          <div>
            <h2 className="font-bold mb-4">POLIVENTS</h2>
            <p className="text-gray-400 text-sm">Hubungkan koneksi anda dan tambah wawasan anda melalui seminar dan conference</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">BANTUAN</h3>
            <ul className="text-gray-400 text-sm space-y-2"><li>FAQ</li><li>Kontak</li></ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">JELAJAH EVENT</h3>
            <ul className="text-gray-400 text-sm space-y-2"><li>Jelajah</li><li>Event Polines</li><li>Event Umum</li></ul>
          </div>
          <div className="text-right text-gray-400 text-sm flex items-end justify-end">© 2026 POLIVENTS</div>
        </div>
      </footer>
    </div>
  );
}