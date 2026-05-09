"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  MapPin 
} from "lucide-react";
import { getEvents } from "./action"; 

export default function EventFavoritPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEvents();
      setEvents(data);
    };
    fetchData();
  }, []);

  const handleRemoveFavorite = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const filteredEvents = events.filter((data) => {
    const matchesSearch = data.judul?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || data.jenisEvent?.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  return (
    <div className="w-full px-2">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Event Favorit</h1>

      {/* FILTER & SEARCH */}
      <div className="relative mb-10">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-slate-100"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative">
          <div className="pb-2 w-full md:w-80 z-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text"
                placeholder="Cari event favoritmu..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none text-sm text-black"
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
                className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
                  activeTab === tab ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
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
            <EventCard 
              key={data.id} 
              data={data} 
              onUnfavorite={() => handleRemoveFavorite(data.id)} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bookmark size={40} className="text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Belum ada favorit</h3>
        </div>
      )}
    </div>
  );
}

function EventCard({ data, onUnfavorite }: { data: any, onUnfavorite: () => void }) {
  const displayHarga = data.harga === 0 || !data.harga ? "Rp 0" : `Rp ${data.harga?.toLocaleString('id-ID')}`;
  
  const isPolines = 
    data.penyelenggara?.toLowerCase().includes("polines") || 
    data.judul?.toLowerCase().includes("polines");

  const formatTanggal = (dateString: any) => {
    if (!dateString) return "Tanggal belum diatur";
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-[1.5rem] shadow-lg border border-slate-100 overflow-hidden flex flex-col h-full group">
      
      {/* IMAGE SECTION */}
      <div className="h-44 relative overflow-hidden bg-slate-100">
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-lg font-bold text-[9px] uppercase shadow-sm border border-slate-50">
            {isPolines ? "POLINES" : "UMUM"}
          </span>
        </div>
        <img 
          src={data.bannerUrl || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=500"} 
          alt={data.judul} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* JENIS EVENT */}
        <div className="mb-3">
          <span className="px-3 py-1 rounded-md bg-slate-50 text-slate-400 text-[9px] font-bold border border-slate-100 uppercase">
            {data.jenisEvent || "event"}
          </span>
        </div>

        {/* JUDUL */}
        <h4 className="text-base font-bold text-slate-800 line-clamp-2 leading-tight mb-1">
          {data.judul}
        </h4>
        
        {/* TANGGAL (Ditambahkan kembali) */}
        <p className="text-slate-400 text-[11px] font-medium mb-4">
          {formatTanggal(data.tanggalMulai)}
        </p>
        
        {/* HARGA & FAVORITE */}
        <div className="mt-auto pt-4 flex justify-between items-center">
          <span className="text-xl font-black text-slate-900">
            {displayHarga}
          </span>
          <Bookmark 
            size={22} 
            fill="currentColor" 
            className="text-slate-900 cursor-pointer hover:text-slate-400 transition-colors"
            onClick={onUnfavorite}
          />
        </div>

        {/* FOOTER - KOTA & KATEGORI */}
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-2 text-slate-400 text-[10px] font-bold">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-rose-500" />
            <span>{data.namaKota || "Semarang"}</span>
          </div>
          <span className="text-slate-200">•</span>
          <div className="truncate">
            {data.namaKategori || "Umum"}
          </div>
        </div>
      </div>
    </div>
  );
}