'use client';

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, Ticket, CalendarDays, Bookmark, 
  User, HelpCircle, Search, ChevronDown 
} from 'lucide-react';
import Navbar from '@/components/layout/navbar';
import NavbarWrapper from '@/components/layout/navbar-wrapper';
import { auth } from '@/auth';

// --- DATA LENGKAP (Semua status ada di sini) ---
const allEvents = [
  { id: 1, title: 'Seminar PPKS', date: '11 April 2026', location: 'Auditorium Utama Polines', organizer: 'bem_polines', type: 'Seminar', status: 'Selesai' },
  { id: 2, title: 'Seminar Kebangsaan', date: '15 April 2026', location: 'Ruang Serbaguna', organizer: 'ukm_seni', type: 'Seminar', status: 'Sedang Berlangsung' },
  { id: 3, title: 'Workshop Coding Dasar', date: '20 April 2026', location: 'Lab Terpadu', organizer: 'hmte_polines', type: 'Workshop', status: 'Belum Dimulai' },
  { id: 4, title: 'Festival Budaya 2026', date: '25 April 2026', location: 'Lapangan Hijau', organizer: 'bem_polines', type: 'Festival', status: 'Sedang Berlangsung' },
  { id: 5, title: 'Talkshow Karir', date: '01 Mei 2026', location: 'Online Zoom', organizer: 'ukm_it', type: 'Seminar', status: 'Belum Dimulai' },
];

export default function EventkuPage() {
  // States untuk input filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua Tipe'); // Default semua tipe biar nggak ilang datanya
  const [statusFilter, setStatusFilter] = useState('Semua Status'); // Default semua status
  
  // State yang bener-bener diterapin ke list
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    type: 'Semua Tipe',
    status: 'Semua Status'
  });

  // Logika Filter Gabungan
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchSearch = event.title.toLowerCase().includes(appliedFilters.search.toLowerCase());
      const matchType = appliedFilters.type === 'Semua Tipe' || event.type === appliedFilters.type;
      const matchStatus = appliedFilters.status === 'Semua Status' || event.status === appliedFilters.status;
      return matchSearch && matchType && matchStatus;
    });
  }, [appliedFilters]);

  const handleApplyFilter = () => {
    setAppliedFilters({ search: searchQuery, type: typeFilter, status: statusFilter });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0F172A] text-white hidden md:flex flex-col fixed h-full shadow-2xl">
        <div className="p-8"><h1 className="text-2xl font-bold tracking-tight">POLIVENTS</h1></div>
        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarItem icon={<Ticket size={20} />} label="Tiket Saya" />
          <SidebarItem icon={<CalendarDays size={20} />} label="Eventku" active />
          <SidebarItem icon={<Bookmark size={20} />} label="Event Favorit" />
          <SidebarItem icon={<User size={20} />} label="Akun & Privasi" />
          <SidebarItem icon={<HelpCircle size={20} />} label="Bantuan" />
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-[#0E215D] flex items-center justify-between px-8 text-white sticky top-0 z-20 shadow-lg">
          <h2 className="font-semibold text-lg uppercase tracking-wider">Eventku</h2>
          <div className="flex items-center gap-4">
            <div className="opacity-60 cursor-pointer hover:opacity-100 transition-opacity">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Faqih Ardi..</span>
              <div className="w-9 h-9 bg-slate-300 rounded-full border-2 border-white/20 overflow-hidden"><img src="https://ui-avatars.com/api/?name=Faqih+Ardi" alt="p" /></div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl w-full mx-auto">
          {/* --- FILTER SECTION --- */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 flex flex-wrap lg:flex-nowrap gap-4 items-end mb-10 shadow-sm transition-all hover:shadow-md">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cari Event</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Masukkan nama event..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tipe Event</label>
              <div className="relative">
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full appearance-none bg-[#F8FAFC] border border-slate-200 p-2.5 rounded-md outline-none text-sm">
                  <option>Semua Tipe</option>
                  <option>Seminar</option>
                  <option>Workshop</option>
                  <option>Festival</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="w-full lg:w-48">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status Event</label>
              <div className="relative">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full appearance-none bg-[#F8FAFC] border border-slate-200 p-2.5 rounded-md outline-none text-sm">
                  <option>Semua Status</option>
                  <option>Sedang Berlangsung</option>
                  <option>Belum Dimulai</option>
                  <option>Selesai</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>

            <button onClick={handleApplyFilter} className="w-full lg:w-auto bg-[#1D4ED8] hover:bg-blue-700 text-white px-8 py-2.5 rounded-md font-bold transition-all shadow-md text-sm active:scale-95">
              Terapkan Filter
            </button>
          </section>

          {/* --- RESULTS --- */}
          <h3 className="text-xl font-bold text-slate-800 mb-6 transition-all">
            {appliedFilters.status === 'Semua Status' ? 'Semua Eventku' : appliedFilters.status}
          </h3>
          
          <div className="flex flex-col gap-5">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white">
                <p className="text-slate-400 font-medium">Wah, datanya nggak ketemu...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 px-6 py-3 cursor-pointer transition-all ${
      active ? 'bg-white text-[#0F172A] font-bold rounded-l-full ml-2 shadow-inner' : 'text-slate-400 hover:text-white'
    }`}>
      {icon} <span className="text-sm">{label}</span>
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  const isSelesai = event.status === 'Selesai';
  const isBelumDimulai = event.status === 'Belum Dimulai';

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row border border-slate-100 hover:border-blue-200 transition-all hover:shadow-lg group">
      <div className="md:w-64 h-44 bg-slate-200 relative overflow-hidden flex-shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=500" 
          alt="banner" 
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isSelesai ? 'grayscale opacity-70' : ''}`}
        />
      </div>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="space-y-1.5">
          <h4 className="text-xl font-bold text-slate-800 tracking-tight">{event.title}</h4>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-1"><CalendarDays size={14} className="text-blue-600" /> {event.date}</div>
            <div className="flex items-center gap-1"><span className="w-1 h-1 bg-slate-300 rounded-full"></span> {event.location}</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
               <img src={`https://ui-avatars.com/api/?name=${event.organizer}&background=0F172A&color=fff&size=24`} alt="org" />
            </div>
            <span className="text-xs font-bold text-slate-600">{event.organizer}</span>
          </div>

          {/* LOGIKA TOMBOL BERDASARKAN STATUS */}
          {event.status === 'Sedang Berlangsung' && (
            <button className="bg-[#1D4ED8] hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg text-xs font-bold shadow-lg shadow-blue-200 transform active:scale-95">Sedang Berlangsung</button>
          )}
          {isBelumDimulai && (
            <div className="bg-[#0F172A] text-white px-5 py-2.5 rounded-lg flex flex-col items-center min-w-[150px] shadow-xl border border-slate-700">
              <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 mb-0.5">Dimulai Dalam</span>
              <div className="flex items-center font-mono text-sm font-black gap-1">
                <span>01h</span><span className="text-slate-500">:</span><span>30m</span><span className="text-slate-500">:</span><span>40s</span>
              </div>
            </div>
          )}
          {isSelesai && (
            <button disabled className="bg-[#C4C4C4] text-white px-12 py-2.5 rounded-lg text-xs font-bold cursor-not-allowed">Selesai</button>
          )}
        </div>
      </div>
    </div>
  );
}