"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bookmark, 
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
    <div className="w-full">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Event Favorit</h1>

      <div className="relative mb-10">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-slate-100"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative">
          
          <div className="pb-2 w-full md:w-80 z-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text"
                placeholder="Cari event favoritmu..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-1 focus:ring-blue-600 outline-none text-sm transition-all text-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row gap-8 relative z-10">
            {["all", "seminar", "conference"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium transition-all relative ${
                  activeTab === tab ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID EVENT */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((data) => (
            <EventCard key={data.id} data={data} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Bookmark size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Belum ada favorit</h3>
          <p className="text-slate-500 mt-2">Jelajahi event menarik dan tambahkan ke favoritmu!</p>
        </div>
      )}

      {/* PAGINATION */}
      {filteredEvents.length > 0 && (
        <div className="flex justify-end mt-16 items-center gap-4 text-slate-400 font-medium">
          <ChevronLeft size={20} className="cursor-pointer hover:text-blue-600" />
          <span className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded shadow-sm">1</span>
          <ChevronRight size={20} className="cursor-pointer hover:text-blue-600" />
        </div>
      )}
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