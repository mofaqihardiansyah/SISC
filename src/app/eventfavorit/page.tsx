"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  Ticket, 
  User, 
  Bookmark, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  CircleUser
} from "lucide-react";
import { getEvents } from "./action"; 

export default function EventFavoritPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredEvents = events.filter((data) => {
    const matchesSearch = data.judul?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || data.jenisEvent?.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex min-h-screen bg-white font-sans text-foreground">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0A1D37] text-white flex flex-col fixed h-full shadow-xl">
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-wider italic font-heading">POLIVENTS</h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem icon={<Search size={20} />} label="Jelajah Event" />
          <NavItem icon={<Ticket size={20} />} label="Tiket Saya" />
          <NavItem icon={<User size={20} />} label="Akun & Privasi" />
          <NavItem icon={<Bookmark size={20} />} label="Event Favorit" active />
          <NavItem icon={<HelpCircle size={20} />} label="Bantuan" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 flex flex-col">
        {/* HEADER */}
        <header className="bg-[#005697] text-white p-4 flex justify-between items-center px-10 shadow-md">
          <h2 className="text-xl font-semibold font-heading">Pengaturan Akun</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-slate-200">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Faqih" alt="profile" />
            </div>
            <p className="text-sm font-medium">Faqih Ardiansyah</p>
          </div>
        </header>

        <div className="p-10">
          <h3 className="text-2xl font-bold text-slate-800 mb-8 font-heading">Event Favorit</h3>

          <div className="relative mb-10">
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-slate-100"></div>
            <div className="flex flex-row justify-between items-end relative">
              
              <div className="pb-2 w-80 z-10">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text"
                    placeholder="Cari event favoritmu..."
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-1 focus:ring-[#005697] outline-none text-sm transition-all text-black"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-10 z-10">
                <TabBtn label="All" active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
                <TabBtn label="Seminar" active={activeTab === 'seminar'} onClick={() => setActiveTab('seminar')} />
                <TabBtn label="Conferences" active={activeTab === 'conference'} onClick={() => setActiveTab('conference')} />
              </div>

            </div>
          </div>

          {/* GRID EVENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((data) => (
              <EventCard key={data.id} data={data} />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-end mt-16 items-center gap-4 text-slate-400 font-medium">
             <ChevronLeft size={20} className="cursor-pointer hover:text-[#005697]" />
             <span className="bg-[#005697] text-white w-8 h-8 flex items-center justify-center rounded shadow-sm">1</span>
             <ChevronRight size={20} className="cursor-pointer hover:text-[#005697]" />
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Komponen Pendukung ---

function TabBtn({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`pb-4 text-xl font-bold transition-all relative ${active ? 'text-[#005697]' : 'text-slate-400 hover:text-slate-600'}`}>
      {label}
      {active && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#005697] rounded-t-full"></div>}
    </button>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
      active ? 'bg-white text-[#0A1D37] shadow-lg font-bold' : 'text-slate-400 hover:bg-white/10 hover:text-white'
    }`}>
      {icon} <span className="text-sm">{label}</span>
    </div>
  );
}

function EventCard({ data }: { data: any }) {
  const displayHarga = data.harga === 0 ? "FREE" : `Rp ${data.harga?.toLocaleString('id-ID')}`;

  // Fungsi format tanggal Indonesia
  const formatTanggal = (dateString: any) => {
    if (!dateString) return "Tanggal belum diatur";
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden transition-all hover:-translate-y-2 group">
      <div className="h-48 relative overflow-hidden bg-slate-100">
        <img 
          src={data.bannerUrl || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=500"} 
          alt={data.judul} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
      </div>

      <div className="p-6">
        {/* 1. NAMA EVENT (Atas) */}
        <h4 className="text-xl font-bold text-slate-800 line-clamp-1 font-heading">
          {data.judul || "Nama Event"}
        </h4>

        {/* 2. TANGGAL EVENT (Bawah judul, warna abu-abu) */}
        <p className="text-slate-400 text-sm font-medium mt-1">
          {formatTanggal(data.tanggalMulai)}
        </p>
        
        {/* 3. HARGA & BOOKMARK */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xl font-black text-slate-900">{displayHarga}</span>
          <Bookmark size={22} fill="currentColor" className="text-slate-900 cursor-pointer" />
        </div>

        {/* 4. NAMA PEMBUAT EVENT */}
        <div className="flex items-center gap-3 mt-4">
          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm text-slate-400">
            <CircleUser size={18} />
          </div>
          <span className="text-sm font-medium text-slate-600">
            {data.penyelenggara || "Polines Official"}
          </span>
        </div>
      </div>
    </div>
  );
}