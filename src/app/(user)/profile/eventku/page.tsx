import React from 'react';
import { Search, ChevronDown, X, CalendarDays, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUserEvents } from '@/actions/user-event';
import EventCard from '@/components/profile/EventCard';
import Link from 'next/link';

interface EventkuPageProps {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}

type EventStatus = 'all' | 'upcoming' | 'registered' | 'completed';

interface FilterSectionProps {
  currentSearch: string;
  currentStatus: EventStatus;
}

const statusLabels: Record<EventStatus, string> = {
  all: 'SEMUA EVENTKU',
  upcoming: 'MENDATANG',
  registered: 'TERDAFTAR',
  completed: 'SELESAI',
};

const statusOptions = [
  { value: 'all', label: 'Semua Status' },
  { value: 'upcoming', label: 'Mendatang' },
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

  // Logika Paginasi (Membatasi jumlah data per halaman)
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

  const heading = statusLabels[statusFilter] || 'SEMUA EVENTKU';

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-500">
      
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Eventku</h1>
        <p className="text-slate-500 mt-2">Kelola pendaftaran dan riwayat keikutsertaan event Anda</p>
      </div>

      <FilterSection currentSearch={searchQuery} currentStatus={statusFilter} />

      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-extrabold text-slate-800 mb-6 uppercase tracking-tight flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
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
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 py-20 px-6 text-center">
              <div className="w-24 h-24 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-6">
                <CalendarDays className="text-[#0E215D]/50" size={40} />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">
                {searchQuery ? 'Event Tidak Ditemukan' : 'Belum Ada Event'}
              </h4>
              <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
                {searchQuery
                  ? `Kami tidak dapat menemukan event yang cocok dengan kata kunci "${searchQuery}". Coba gunakan kata kunci atau filter lain.`
                  : 'Kamu belum mendaftar ke event apapun. Yuk, jelajahi berbagai seminar dan konferensi menarik yang tersedia dan mulai kembangkan wawasanmu!'}
              </p>
              {!searchQuery && (
                <Link
                  href="/jelajah"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0E215D] hover:bg-[#0a1845] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#0E215D]/20 active:scale-95"
                >
                  <Compass size={20} />
                  Jelajahi Event Sekarang
                </Link>
              )}
            </div>
          )}

          {/* Navigasi Paginasi */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Link
                href={createPageURL(currentPage - 1)}
                className={`p-2 rounded-lg border border-slate-200 transition-colors ${currentPage <= 1 ? 'pointer-events-none opacity-50 bg-slate-50' : 'hover:bg-slate-50 bg-white'}`}
              >
                <ChevronLeft size={20} className="text-slate-600" />
              </Link>
              <span className="text-sm font-medium text-slate-600 px-4">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Link
                href={createPageURL(currentPage + 1)}
                className={`p-2 rounded-lg border border-slate-200 transition-colors ${currentPage >= totalPages ? 'pointer-events-none opacity-50 bg-slate-50' : 'hover:bg-slate-50 bg-white'}`}
              >
                <ChevronRight size={20} className="text-slate-600" />
              </Link>
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
      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50/70 p-6 rounded-2xl border border-slate-200"
    >
      <div className="md:col-span-6 lg:col-span-7">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
          Cari Nama Event
        </label>
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0E215D] transition-colors"
            size={18}
          />
          <input
            type="text"
            name="q"
            defaultValue={currentSearch}
            placeholder="Ketikkan sesuatu..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#0E215D]/10 focus:border-[#0E215D] outline-none text-sm transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="md:col-span-3 lg:col-span-3">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">
          Status
        </label>
        <div className="relative">
          <select
            name="status"
            defaultValue={currentStatus}
            className="w-full appearance-none bg-white border border-slate-200 p-3 px-4 rounded-xl outline-none text-sm cursor-pointer shadow-sm focus:border-[#0E215D] transition-all"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      <div className="md:col-span-3 lg:col-span-2 flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-[#0E215D] hover:bg-[#0a1845] text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#0E215D]/10 text-sm active:scale-95"
        >
          Terapkan
        </button>
        {(currentSearch || currentStatus !== 'all') && (
          <Link
            href="/profile/eventku"
            className="flex items-center justify-center aspect-square bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 rounded-xl transition-all shadow-sm"
            title="Reset Filter"
          >
            <X size={20} />
          </Link>
        )}
      </div>
    </form>
  );
}