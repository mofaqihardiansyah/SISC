'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { RotateCcw, ChevronDown, Loader2, SearchX } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import EventCard from '@/components/shared/EventCard';
import EmptyState from '@/components/profile/EmptyState';

import { Event } from '@/types/event';

type EventType = Event;

type DropdownType = "Lokasi" | "Tipe Event" | "Kategori Event" | "Waktu" | "Harga";

function JelajahContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kotaList, setKotaList] = useState<string[]>([]);
  const [kategoriList, setKategoriList] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const eventsPerPage = 6;

  const [filters, setFilters] = useState({
    polines: false,
    price: "" as "" | "Gratis" | "Berbayar",
    location: "",
    type: "",
    category: searchParams.get("kategori") ?? "",
    time: "",
  });

  const [searchLocation, setSearchLocation] = useState("");
  const [openDropdown, setOpenDropdown] = useState<DropdownType | null>(searchParams.get("kategori") ? "Kategori Event" : null);

  // Cek Status Login Client-side
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => setIsLoggedIn(!!data?.user))
      .catch(() => setIsLoggedIn(false));

    fetch('/api/events?mode=kota')
      .then(res => res.json())
      .then(data => setKotaList(data.map((k: { nama: string }) => k.nama)))
      .catch(err => console.error("Gagal fetch kota:", err));

    fetch('/api/events?mode=kategori')
      .then(res => res.json())
      .then(data => setKategoriList(data.map((k: { nama: string }) => k.nama)))
      .catch(err => console.error("Gagal fetch kategori:", err));
  }, []);

  useEffect(() => {
    setFilters(prev => ({ ...prev, category: searchParams.get("kategori") ?? "" }));
    setSearchTerm(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: eventsPerPage.toString(),
          q: searchTerm,
          polines: filters.polines.toString(),
          price: filters.price,
          location: filters.location,
          type: filters.type,
          category: filters.category,
          time: filters.time,
        });

        const res = await fetch(`/api/events?${params.toString()}`);
        if (!res.ok) throw new Error('Gagal fetch');
        const data = await res.json();

        if (Array.isArray(data)) {
          setEvents(data);
          setTotalEvents(data.length);
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

  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  const resetFilter = () => {
    setFilters({ polines: false, price: "", location: "", type: "", category: "", time: "" });
    setSearchTerm("");
    router.push('/jelajah');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">

      {/* MAIN */}
      <div className="max-w-[1300px] mx-auto w-full px-10 py-10 flex gap-8">

        {/* SIDEBAR */}
        <aside className="w-1/4 animate-in fade-in slide-in-from-left-4 duration-500">
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
                    <Input
                      type="text"
                      placeholder="Cari kota..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <div className="max-h-48 overflow-y-auto space-y-2 mt-1">
                      {kotaList
                        .filter(loc => loc.toLowerCase().includes(searchLocation.toLowerCase()))
                        .map(loc => (
                          <div
                            key={loc}
                            onClick={() => {
                              setFilters({ ...filters, location: loc });
                              setOpenDropdown(null);
                            }}
                            className={`cursor-pointer hover:text-blue-600 py-0.5 ${filters.location === loc ? "text-blue-600 font-semibold" : ""}`}
                          >
                            {loc}
                          </div>
                        ))}
                    </div>
                    {filters.location && (
                      <div onClick={() => setFilters({ ...filters, location: "" })} className="text-xs text-gray-400 cursor-pointer hover:text-red-400">Reset</div>
                    )}
                  </div>
                )}

                {/* TIPE EVENT */}
                {openDropdown === item && item === "Tipe Event" && (
                  <div className="mt-3 space-y-2">
                    {["online", "offline", "hybrid"].map(type => (
                      <div
                        key={type}
                        onClick={() => {
                          setFilters({ ...filters, type });
                          setOpenDropdown(null);
                        }}
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
                  <div className="mt-3 space-y-2">
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      <div
                        onClick={() => {
                          setFilters({ ...filters, category: "" });
                          setOpenDropdown(null);
                        }}
                        className={`cursor-pointer hover:text-blue-600 py-0.5 ${filters.category === "" ? "text-blue-600 font-semibold" : "text-gray-400"}`}
                      >
                        Semua Kategori
                      </div>
                      {kategoriList.map(cat => (
                        <div
                          key={cat}
                          onClick={() => {
                            setFilters({ ...filters, category: cat });
                            setOpenDropdown(null);
                          }}
                          className={`cursor-pointer hover:text-blue-600 py-0.5 ${filters.category === cat ? "text-blue-600 font-semibold" : ""}`}
                        >
                          {cat}
                        </div>
                      ))}
                    </div>
                    {filters.category && (
                      <div onClick={() => setFilters({ ...filters, category: "" })} className="text-xs text-gray-400 cursor-pointer hover:text-red-400">Reset</div>
                    )}
                  </div>
                )}

                {/* WAKTU */}
                {openDropdown === item && item === "Waktu" && (
                  <div className="mt-3 space-y-2">
                    {timeOptions.map(t => (
                      <div
                        key={t}
                        onClick={() => {
                          setFilters({ ...filters, time: t });
                          setOpenDropdown(null);
                        }}
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
                        onClick={() => {
                          setFilters({ ...filters, price: p as "Gratis" | "Berbayar" });
                          setOpenDropdown(null);
                        }}
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
        <main className="w-3/4 animate-in fade-in slide-in-from-right-4 duration-500">

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
                {searchTerm && <span> untuk &ldquo;<b>{searchTerm}</b>&rdquo;</span>}
              </p>

              {events.length === 0 ? (
                <EmptyState
                  icon={<SearchX size={48} className="text-slate-300" />}
                  title="Tidak Ada Event"
                  description="Tidak ada event yang sesuai dengan filter atau kata kunci pencarian Anda. Coba ubah filter atau kata kunci."
                />
              ) : (
                <div className="grid grid-cols-3 gap-6">
                      {events.map((event) => (
                    <EventCard
                      key={event.id}
                      id={String(event.id)}
                      title={event.judul}
                      date={
                        event.tanggalMulai
                          ? new Date(event.tanggalMulai).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Tanggal belum diisi"
                      }
                      price={event.tipeHarga === "free" ? 0 : (event.harga ?? null)}
                      category={event.jenisEvent ?? ""}
                      type={event.eventPolines ? "POLINES" : "UMUM"}
                      imageUrl={event.urlBanner ?? undefined}
                      tipePlatform={event.tipePlatform ?? undefined}
                      kotaNama={undefined}
                      kategoriNama={undefined}
                      isLoggedIn={isLoggedIn}
                    />
                  ))}
                </div>
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalEvents}
                itemsPerPage={eventsPerPage}
                onPageChange={setCurrentPage}
                itemLabel="event"
              />
            </>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-brand-dark text-white py-12 px-12 mt-16">
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

export default function JelajahPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center gap-3 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Memuat halaman...</span>
      </div>
    }>
      <JelajahContent />
    </Suspense>
  );
}
