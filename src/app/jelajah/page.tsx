'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { RotateCcw, ChevronDown, Loader2, SearchX, ArrowUpDown } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import EventCard from '@/components/shared/EventCard';
import Footer from '@/components/shared/Footer';
import EmptyState from '@/components/profile/EmptyState';

import { EventsApiResponse, EventCardItem } from '@/types/event';
import { UI_TEXT } from '@/lib/constants';

type DropdownType = "Lokasi" | "Platform" | "Jenis Event" | "Kategori Event" | "Waktu" | "Harga";

const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "cheapest", label: "Harga Terendah" },
  { value: "expensive", label: "Harga Tertinggi" },
  { value: "nearest", label: "Terdekat" },
  { value: "popular", label: "Terpopuler" },
] as const;

function JelajahContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState<EventCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kotaList, setKotaList] = useState<string[]>([]);
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [provinsiList, setProvinsiList] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const eventsPerPage = 6;

  const [filters, setFilters] = useState({
    polines: "",
    price: "" as "" | "Gratis" | "Berbayar",
    provinsi: "",
    location: "",
    platform: "",
    jenisEvent: "",
    category: searchParams.get("kategori") ?? "",
    time: "",
  });
  const [sortBy, setSortBy] = useState("newest");

  const [searchLocation, setSearchLocation] = useState("");
  const [openDropdown, setOpenDropdown] = useState<DropdownType | null>(searchParams.get("kategori") ? "Kategori Event" : null);

  const fetchKotaList = useCallback(async (provinsi: string) => {
    try {
      const url = provinsi
        ? `/api/events?mode=kota&provinsi=${encodeURIComponent(provinsi)}`
        : '/api/events?mode=kota';
      const res = await fetch(url);
      const data = await res.json();
      setKotaList(data.map((k: { nama: string }) => k.nama));
    } catch {}
  }, []);

  // Fetch master data
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => setIsLoggedIn(!!data?.user))
      .catch(() => setIsLoggedIn(false));

    fetchKotaList("");

    fetch('/api/events?mode=kategori')
      .then(res => res.json())
      .then(data => setKategoriList(data.map((k: { nama: string }) => k.nama)))
      .catch(() => {});

    fetch('/api/events?mode=provinsi')
      .then(res => res.json())
      .then(data => setProvinsiList(data.map((p: { nama: string }) => p.nama)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setFilters(prev => ({ ...prev, category: searchParams.get("kategori") ?? "" }));
    setSearchTerm(searchParams.get("q") ?? "");
    const type = searchParams.get("type");
    if (type === "polines") setFilters(prev => ({ ...prev, polines: "true" }));
    else if (type === "umum") setFilters(prev => ({ ...prev, polines: "false" }));
  }, [searchParams]);

  useEffect(() => {
    fetchKotaList(filters.provinsi);
  }, [filters.provinsi, fetchKotaList]);

  // Fetch events
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: eventsPerPage.toString(),
        q: searchTerm,
        polines: filters.polines.toString(),
        price: filters.price,
        provinsi: filters.provinsi,
        location: filters.location,
        platform: filters.platform,
        jenisEvent: filters.jenisEvent,
        category: filters.category,
        time: filters.time,
        sort: sortBy,
      });

      const res = await fetch(`/api/events?${params.toString()}`);
      if (!res.ok) throw new Error('Gagal fetch');
      const data: EventsApiResponse = await res.json();

      setEvents(data.events || []);
      setTotalEvents(data.total || 0);
    } catch (err) {
      setError('Gagal memuat data event.');
      console.error(err);
    }
    setLoading(false);
  }, [currentPage, filters, searchTerm, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm, sortBy]);

  const timeOptions = [
    "Hari Ini", "Besok", "Akhir Pekan",
    "Minggu Ini", "Minggu Depan", "Bulan Ini", "Bulan Depan"
  ];

  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  const resetFilter = () => {
    setFilters({ polines: "", price: "", provinsi: "", location: "", platform: "", jenisEvent: "", category: "", time: "" });
    setSortBy("newest");
    setSearchTerm("");
    router.push('/jelajah');
  };

  const activeFilterCount = [
    filters.polines,
    filters.price,
    filters.provinsi,
    filters.location,
    filters.platform,
    filters.jenisEvent,
    filters.category,
    filters.time,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">

      {/* MAIN */}
      <div className="max-w-[1300px] mx-auto w-full px-10 py-10 flex gap-8">

        {/* SIDEBAR */}
        <aside className="w-1/4 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-blue-700 font-semibold text-lg">Filter Pencarian</h2>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    {activeFilterCount} aktif
                  </span>
                )}
                <RotateCcw onClick={resetFilter} className="w-4 h-4 text-blue-700 cursor-pointer hover:text-blue-900" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-6">Sesuaikan Penemuan Event</p>

            {/* SORT */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Urutkan</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-9 appearance-none border border-slate-200 rounded-lg px-3 pr-8 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="border-t pt-4 mb-4" />

            {/* TARGET EVENT: Polines / Umum */}
            <div className="mb-6">
              <span className="font-medium text-sm">Target Event</span>
              <div className="flex gap-2 mt-2">
                {(["", "true", "false"] as const).map(val => (
                  <button
                    key={val}
                    onClick={() => setFilters({ ...filters, polines: val })}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                      filters.polines === val
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {val === "" ? "Semua" : val === "true" ? "Polines" : "Umum"}
                  </button>
                ))}
              </div>
            </div>

            {(["Lokasi", "Platform", "Jenis Event", "Kategori Event", "Waktu", "Harga"] as DropdownType[]).map((item) => (
              <div key={item} className="border-t py-4 text-sm">
                <div
                  onClick={() => setOpenDropdown(openDropdown === item ? null : item)}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    {item}
                    {((item === "Lokasi" && (filters.provinsi || filters.location)) ||
                      (item === "Platform" && filters.platform) ||
                      (item === "Jenis Event" && filters.jenisEvent) ||
                      (item === "Kategori Event" && filters.category) ||
                      (item === "Waktu" && filters.time) ||
                      (item === "Harga" && filters.price))
                      ? <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> : null}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item ? "rotate-180" : ""}`} />
                </div>

                {/* LOKASI — Cascading: Provinsi → Kota */}
                {openDropdown === item && item === "Lokasi" && (
                  <div className="mt-3 space-y-3">
                    {/* Provinsi */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Provinsi</label>
                      <select
                        value={filters.provinsi}
                        onChange={(e) => { setFilters({ ...filters, provinsi: e.target.value, location: "" }); setSearchLocation(""); }}
                        className="w-full h-8 appearance-none border border-slate-200 rounded-lg px-2 text-xs text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                      >
                        <option value="">Semua Provinsi</option>
                        {provinsiList.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    {/* Kota (filtered by provinsi) */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Kota / Kabupaten</label>
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
                    </div>
                    {(filters.provinsi || filters.location) && (
                      <div onClick={() => setFilters({ ...filters, provinsi: "", location: "" })} className="text-xs text-gray-400 cursor-pointer hover:text-red-400">Reset Lokasi</div>
                    )}
                  </div>
                )}

                {/* PLATFORM */}
                {openDropdown === item && item === "Platform" && (
                  <div className="mt-3 space-y-2">
                    {["online", "offline", "hybrid"].map(p => (
                      <div
                        key={p}
                        onClick={() => {
                          setFilters({ ...filters, platform: p });
                          setOpenDropdown(null);
                        }}
                        className={`cursor-pointer hover:text-blue-600 capitalize ${filters.platform === p ? "text-blue-600 font-semibold" : ""}`}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </div>
                    ))}
                    <div onClick={() => setFilters({ ...filters, platform: "" })} className="text-xs text-gray-400 cursor-pointer hover:text-red-400">Reset</div>
                  </div>
                )}

                {/* JENIS EVENT */}
                {openDropdown === item && item === "Jenis Event" && (
                  <div className="mt-3 space-y-2">
                    <div
                      onClick={() => {
                        setFilters({ ...filters, jenisEvent: "" });
                        setOpenDropdown(null);
                      }}
                      className={`cursor-pointer hover:text-blue-600 ${filters.jenisEvent === "" ? "text-blue-600 font-semibold" : "text-gray-400"}`}
                    >
                      Seminar / Conference
                    </div>
                    {["seminar", "conference"].map(j => (
                      <div
                        key={j}
                        onClick={() => {
                          setFilters({ ...filters, jenisEvent: j });
                          setOpenDropdown(null);
                        }}
                        className={`cursor-pointer hover:text-blue-600 capitalize ${filters.jenisEvent === j ? "text-blue-600 font-semibold" : ""}`}
                      >
                        {j.charAt(0).toUpperCase() + j.slice(1)}
                      </div>
                    ))}
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
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 text-sm flex flex-col items-center gap-3">
              <p>{error}</p>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
              >
                Coba Lagi
              </button>
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
                          : UI_TEXT.NO_DATE_SHORT
                      }
                      price={event.tipeHarga === "free" ? 0 : (event.harga ?? null)}
                      category={event.jenisEvent ?? ""}
                      type={event.eventPolines ? "POLINES" : "UMUM"}
                      imageUrl={event.urlBanner ?? undefined}
                      tipePlatform={event.tipePlatform ?? undefined}
                      kotaNama={event.kotaNama ?? undefined}
                      kategoriNama={event.kategoriNama ?? undefined}
                      penyelenggara={event.penyelenggara}
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

      <Footer />
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
