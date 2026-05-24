"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bookmark } from "lucide-react";
import { getEvents } from "./action"; 
import EventCard from "@/components/shared/EventCard"; 

interface EventData {
  id: number;
  judul: string | null;
  bannerUrl: string | null;
  harga: number | null;
  tanggalMulai: Date | null;
  jenisEvent: string | null;
  penyelenggara: string | null;
  namaKota: string | null;
  namaKategori: string | null;
  isEventPolines: boolean | null;
  tipePlatform: string | null;
}

export default function EventFavoritPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fungsi hapus visual saat un-bookmark
  const handleRemoveVisual = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id.toString() !== id));
  };

  const filteredEvents = events.filter((item) => {
    const matchesSearch = item.judul?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || item.jenisEvent?.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  return (
    <div className="w-full px-2">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 font-heading">Event Favorit</h1>

      {/* SEARCH & FILTER */}
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

      {/* GRID EVENT FAVORIT */}
      {loading ? (
        <div className="flex justify-center py-20 text-slate-400">Memuat favorit...</div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((item) => {
            
            // --- LOGIKA DETEKSI POLINES ---
            const isPolines = 
              item.isEventPolines === true || 
              item.judul?.toUpperCase().includes("POLINES");

            return (
              <EventCard 
                key={item.id}
                id={item.id.toString()}
                title={item.judul ?? ''}
                imageUrl={item.bannerUrl ?? undefined}
                date={item.tanggalMulai
                  ? new Date(item.tanggalMulai).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })
                  : 'Tanggal belum ditentukan'}
                price={item.harga ?? 0}
                category={item.jenisEvent || "Seminar"}
                
                // Menerapkan logika deteksi
                type={isPolines ? "POLINES" : "UMUM"}
                
                tipePlatform={item.tipePlatform || "Offline"}
                kotaNama={item.namaKota ?? undefined}
                kategoriNama={item.namaKategori ?? undefined}
                isLoggedIn={true}
                isBookmarked={true}
                onRemove={() => handleRemoveVisual(item.id.toString())}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
             <Bookmark size={40} className="text-slate-200" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Belum ada favorit</h3>
          <p className="text-slate-500 text-sm">Daftar favoritmu kosong.</p>
        </div>
      )}
    </div>
  );
}