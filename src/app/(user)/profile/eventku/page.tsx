import React from 'react';
import { Search, ChevronDown, X, CalendarDays, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUserEvents } from '@/actions/user-event';
import EventCard from '@/components/profile/EventCard';
import Link from 'next/link';

interface EventkuPageProps {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}

type EventStatus = 'all' | 'pending' | 'registered' | 'completed';

interface FilterSectionProps {
  currentSearch: string;
  currentStatus: EventStatus;
}

const statusLabels: Record<EventStatus, string> = {
  all: 'SEMUA EVENTKU',
  pending: 'MENUNGGU VERIFIKASI',
  registered: 'TERDAFTAR',
  completed: 'SELESAI',
};

const statusOptions = [
  { value: 'all', label: 'Semua Status' },
  { value: 'pending', label: 'Menunggu Verifikasi' },
  { value: 'registered', label: 'Terdaftar' },
  { value: 'completed', label: 'Selesai' },
];

export default async function EventkuPage({ searchParams }: EventkuPageProps) {
  const params = await searchParams;
  const searchQuery = params.q || '';
  const statusFilter = (params.status as EventStatus) || 'all';
  const currentPage = parseInt(params.page || '1', 10);

  const result = await getUserEvents(searchQuery, statusFilter);
  const events = result.data || [];

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const paginatedEvents = events.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const createPageURL = (pageNumber: number) => {
    const urlParams = new URLSearchParams();
    if (searchQuery) urlParams.set('q', searchQuery);
    if (statusFilter !== 'all') urlParams.set('status', statusFilter);
    urlParams.set('page', pageNumber.toString());
    return `/profile/eventku?${urlParams.toString()}`;
  };

  const getPageButtons = (): (number | string)[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1, 2, 3];
    if (currentPage > 4) pages.push("...");
    if (currentPage > 3 && currentPage < totalPages - 1) pages.push(currentPage);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const heading = statusLabels[statusFilter] || 'SEMUA EVENTKU';

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-500">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Eventku</h1>
        <p className="text-slate-500 mt-2">Kelola pendaftaran dan riwayat keikutsertaan event Anda</p>
      </div>

      <FilterSection currentSearch={searchQuery} currentStatus={statusFilter} />

      <div className="flex-1 flex flex-col mt-6">
        <h3 className="text-base font-extrabold text-slate-800 mb-4 uppercase tracking-tight flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
          <span className="w-1.5 h-6 bg-[#0E215D] rounded-full"></span>
          {heading}
        </h3>

        <div className="flex flex-col gap-4 flex-1">
          {paginatedEvents.length > 0 ? (
            paginatedEvents.map((event) => (
              <EventCard
                key={`${event.id}-${event.kodePendaftaran}`}
                {...event}
                image={event.image || undefined}
                variant="list"
              />
            ))
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 py-16 px-6 text-center">
              <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-5">
                <CalendarDays className="text-[#0E215D]/50" size={36} />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">
                {searchQuery ? 'Event Tidak Ditemukan' : 'Belum Ada Event'}
              </h4>
              <p className="text-slate-500 max-w-md mb-6 leading-relaxed text-sm">
                {searchQuery
                  ? `Kami tidak dapat menemukan event yang cocok dengan kata kunci "${searchQuery}". Coba gunakan kata kunci atau filter lain.`
                  : 'Kamu belum mendaftar ke event apapun. Yuk, jelajahi berbagai seminar dan konferensi menarik yang tersedia!'}
              </p>
              {!searchQuery && (
                <Link
                  href="/jelajah"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#0E215D] hover:bg-[#0a1845] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#0E215D]/20 active:scale-95 text-sm"
                >
                  <Compass size={18} />
                  Jelajahi Event Sekarang
                </Link>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 flex-wrap gap-3">
              <span className="text-xs text-slate-400 font-semibold">
                Menampilkan <span className="text-slate-700">{events.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</span> –{" "}
                <span className="text-slate-700">{Math.min(currentPage * ITEMS_PER_PAGE, events.length)}</span> dari{" "}
                <span className="text-slate-700 font-bold">{events.length}</span> eventku
              </span>
              <div className="flex gap-1 items-center">
                <Link
                  href={createPageURL(currentPage - 1)}
                  className={`w-7 h-7 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95 text-slate-500 ${currentPage <= 1 ? 'pointer-events-none opacity-40 bg-slate-50' : ''}`}
                >
                  <ChevronLeft size={14} className="text-slate-600" />
                </Link>
                {getPageButtons().map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="text-gray-400 px-1 text-xs font-semibold">
                      ...
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={createPageURL(p as number)}
                      className={`w-7 h-7 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center ${
                        currentPage === p
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'border border-gray-200 bg-white text-slate-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}
                <Link
                  href={createPageURL(currentPage + 1)}
                  className={`w-7 h-7 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95 text-slate-500 ${currentPage >= totalPages ? 'pointer-events-none opacity-40 bg-slate-50' : ''}`}
                >
                  <ChevronRight size={14} className="text-slate-600" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSection({ currentSearch, currentStatus }: FilterSectionProps) {
  return (
    <form
      method="GET"
      className="flex flex-wrap gap-3 items-end bg-slate-50/70 p-4 rounded-2xl border border-slate-200"
    >
      {/* Search input — grows to fill available space */}
      <div className="flex-1 min-w-[180px]">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
          Cari Nama Event
        </label>
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0E215D] transition-colors"
            size={16}
          />
          <input
            type="text"
            name="q"
            defaultValue={currentSearch}
            placeholder="Ketikkan sesuatu..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#0E215D]/10 focus:border-[#0E215D] outline-none text-sm transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Status dropdown — fixed but shrinkable */}
      <div className="w-[180px] shrink-0">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
          Status
        </label>
        <div className="relative">
          <select
            name="status"
            defaultValue={currentStatus}
            className="w-full appearance-none bg-white border border-slate-200 py-2.5 pl-3 pr-8 rounded-xl outline-none text-sm cursor-pointer shadow-sm focus:border-[#0E215D] transition-all"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={14}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 shrink-0">
        <button
          type="submit"
          className="bg-[#0E215D] hover:bg-[#0a1845] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#0E215D]/10 text-sm active:scale-95 whitespace-nowrap"
        >
          Terapkan
        </button>
        {(currentSearch || currentStatus !== 'all') && (
          <Link
            href="/profile/eventku"
            className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 rounded-xl transition-all shadow-sm"
            title="Reset Filter"
          >
            <X size={18} />
          </Link>
        )}
      </div>
    </form>
  );
}