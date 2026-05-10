"use client";

import React, { useState } from 'react';
import { Search, ChevronRight, ChevronLeft, Ban, X, Info, MapPin, Calendar as CalendarIcon, DollarSign } from "lucide-react";

export default function KelolaEventPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Data Dummy untuk testing UI
  const events = [
    { 
      id: 1, 
      judul: "Global Tech Innovators Summit 2024", 
      status: "DIPUBLIKASI", 
      kategori: "Conference", 
      sub: "Teknologi & Informasi", 
      peserta: "1,240", 
      harga: "0", 
      tanggal: "24 Okt 2024, 09:00 WIB",
      img: "https://images.unsplash.com/photo-1540575861501-7ce0e2204919?q=80&w=400"
    },
    { 
      id: 2, 
      judul: "Strategi Bisnis Pasca Pandemi", 
      status: "DITOLAK", 
      kategori: "Seminar", 
      sub: "Bisnis & Ekonomi", 
      peserta: "0", 
      harga: "150.000", 
      tanggal: "20 Okt 2024", 
      alasan: "Metadata gambar tidak sesuai panduan.",
      img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400"
    },
    { 
      id: 3, 
      judul: "Workshop Fotografi Studio Modern", 
      status: "DRAFT", 
      kategori: "Workshop", 
      sub: "Kreatif & Desain", 
      peserta: "--", 
      harga: "50.000", 
      tanggal: "Terakhir diubah: Kemarin, 14:20 WIB",
      img: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=400"
    },
  ];

  const openEditModal = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* JUDUL HALAMAN */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1E293B]">Kelola Event</h1>
        <p className="text-slate-500 text-sm mt-1">Manajemen dan pantau event Anda di sini</p>
      </div>

      {/* FILTER SECTION */}
      <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 mb-8">
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama event..." 
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-blue-400"
            />
          </div>
          <select className="border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white min-w-[160px] text-slate-600 outline-none">
            <option>Semua Status</option>
            <option>Dipublikasi</option>
            <option>Draft</option>
            <option>Ditolak</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          {["Tanggal", "Status", "Tipe", "Kategori", "Harga"].map((label) => (
            <div key={label} className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-700">{label}</label>
              <input 
                type="text" 
                placeholder={label === "Tanggal" ? "mm/dd/yyyy" : `Semua ${label}`} 
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-400 bg-white outline-none" 
              />
            </div>
          ))}
        </div>
      </div>

      {/* EVENT LIST */}
      <div className="space-y-6">
        {events.map((ev) => {
          const isDraft = ev.status === "DRAFT";
          const isRejected = ev.status === "DITOLAK";

          return (
            <div key={ev.id} className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center justify-between shadow-sm hover:border-blue-200 transition-all">
              <div className="flex gap-6">
                <div className="relative w-[240px] h-[135px] rounded-[20px] overflow-hidden bg-slate-900 shrink-0">
                  <img src={ev.img} alt="" className={`w-full h-full object-cover ${isRejected ? 'opacity-40 grayscale' : 'opacity-80'}`} />
                  {isRejected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Ban size={32} className="text-white opacity-90" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase">
                    <span className={`px-2.5 py-1 rounded-md border ${
                      isDraft ? 'bg-yellow-50 text-yellow-500 border-yellow-100' : 
                      isRejected ? 'bg-red-50 text-red-400 border-red-100' : 
                      'bg-green-50 text-green-500 border-green-100'
                    }`}>
                      {ev.status}
                    </span>
                    <span className="text-slate-300">• {ev.sub}</span>
                  </div>
                  <h3 className="font-bold text-[#1E293B] text-xl leading-tight mb-1">{ev.judul}</h3>
                  <p className="text-[12px] text-slate-400 flex items-center gap-1.5">
                    {isDraft ? "✎" : "🗓️"} {ev.tanggal}
                  </p>
                  {isRejected && (
                    <div className="flex items-center gap-1.5 mt-2.5 text-red-400">
                      <Info size={14} />
                      <p className="text-[11px] font-medium italic text-slate-400">Alasan: {ev.alasan}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-14 pr-4">
                <div className="text-center">
                  <p className="text-[10px] text-slate-300 uppercase font-bold tracking-widest mb-1">Peserta</p>
                  <p className="font-bold text-slate-600 text-lg">{ev.peserta}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-300 uppercase font-bold tracking-widest mb-1">Harga</p>
                  <p className="font-bold text-slate-600 text-lg">Rp {ev.harga}</p>
                </div>
                <button 
                  onClick={() => !isRejected && openEditModal(ev)}
                  className={`min-w-[170px] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    isRejected ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-[#00478F] text-white hover:bg-[#00356B]'
                  }`}
                >
                  {isDraft ? "Lanjutkan Draft" : "Kelola Event"}
                  {!isRejected && <ChevronRight size={18} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end items-center gap-2 mt-8 pb-10">
        <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-white transition-colors"><ChevronLeft size={18}/></button>
        <button className="w-9 h-9 flex items-center justify-center bg-[#1E293B] text-white rounded-lg font-bold text-sm">1</button>
        <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-600 font-bold text-sm hover:bg-white">2</button>
        <span className="px-1 text-slate-300">...</span>
        <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-white"><ChevronRight size={18}/></button>
      </div>

      {/* MODAL POP-UP (Berlaku untuk Kelola Event & Draft) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-end bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-[#1E293B]">
                {selectedEvent?.status === "DRAFT" ? "Lanjutkan Draft Event" : "Edit Detail Event"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                <X size={24}/>
              </button>
            </div>
            
            {/* Body Modal (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* 1. Tipe Event */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Tipe Event</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none bg-white focus:border-blue-400 text-sm">
                    <option value="Seminar">Seminar</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>
                {/* 2. Platform */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Platform</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none bg-white focus:border-blue-400 text-sm">
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Judul Event</label>
                <input 
                  type="text" 
                  defaultValue={selectedEvent?.judul} 
                  placeholder="Masukkan judul event"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400 text-sm" 
                />
              </div>

              {/* 4. Kategori (10 Opsi) */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Kategori</label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none bg-white focus:border-blue-400 text-sm">
                  <option>Teknologi & Informasi</option>
                  <option>Bisnis & Ekonomi</option>
                  <option>Kreatif & Desain</option>
                  <option>Sains & Akademik</option>
                  <option>Kesehatan & Medis</option>
                  <option>Sosial & Humaniora</option>
                  <option>Seni, Musik & Budaya</option>
                  <option>Hiburan & Gaya Hidup</option>
                  <option>Olahraga & Kebugaran</option>
                  <option>Umum</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Lokasi / Venue</label>
                <div className="relative">
                  <input type="text" placeholder="Masukkan lokasi venue" className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue-400 text-sm" />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 3. Tipe Tiket */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Tipe Tiket</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none bg-white focus:border-blue-400 text-sm">
                    <option value="Paid">Paid (Berbayar)</option>
                    <option value="Free">Free (Gratis)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Biaya (Rp)</label>
                  <div className="relative">
                    <input type="text" defaultValue={selectedEvent?.harga} placeholder="0" className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue-400 text-sm" />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Deskripsi Event</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-400">
                  <div className="bg-slate-50 p-2 border-b border-slate-100 flex gap-2">
                    <button className="px-2 py-1 font-bold text-slate-500 hover:bg-slate-200 rounded text-xs">B</button>
                    <button className="px-2 py-1 italic text-slate-500 hover:bg-slate-200 rounded text-xs">I</button>
                    <button className="px-2 py-1 underline text-slate-500 hover:bg-slate-200 rounded text-xs">U</button>
                  </div>
                  <textarea rows={4} className="w-full p-4 outline-none resize-none text-sm" placeholder="Jelaskan detail event kamu..."></textarea>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50/50">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-white transition-all text-sm"
              >
                Batal
              </button>
              <button className="flex-1 py-3 bg-[#00478F] text-white rounded-xl font-bold hover:bg-[#00356B] transition-all shadow-lg shadow-blue-900/10 text-sm">
                {selectedEvent?.status === "DRAFT" ? "Simpan Draft" : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}