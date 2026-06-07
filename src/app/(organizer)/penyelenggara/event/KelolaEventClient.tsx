"use client";

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, ChevronLeft, Ban, X, Info, MapPin, Image as ImageIcon, Calendar, Edit3 } from "lucide-react";
import { getDaftarEvent, updateEventDatabase } from '@/actions/organizer-event'; 

interface EventData {
  id: number;
  judul: string;
  status: string;
  kategori: string;
  sub: string;
  peserta: string;
  harga: string;
  tanggal: string;
  rawTanggal?: string | Date;
  img: string;
  alasan?: string;
  venue?: string;
  deskripsi?: string;
}

interface EventFormData {
  tipeEvent: string;
  platform: string;
  judul: string;
  kategori: string;
  venue: string;
  tipeTiket: string;
  harga: string;
  deskripsi: string;
}

interface KelolaEventClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialEvents: any[];
}

export default function KelolaEventClient({ initialEvents }: KelolaEventClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [tipeFilter, setTipeFilter] = useState("Semua Tipe");
  const [kategoriFilter, setKategoriFilter] = useState("Semua Kategori");
  const [hargaFilter, setHargaFilter] = useState("Semua Harga");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState<EventFormData>({
    tipeEvent: "Seminar",
    platform: "ONLINE",
    judul: "",
    kategori: "Teknologi & Informasi",
    venue: "",
    tipeTiket: "Free",
    harga: "0",
    deskripsi: ""
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDbData = (rawData: any[]) => {
    if (!rawData || rawData.length === 0) return [];
    
    return rawData.map((ev) => {
      let uiStatus = "DRAFT";
      if (ev.status === "published" || ev.status === "DIPUBLIKASI") uiStatus = "DIPUBLIKASI";
      if (ev.status === "rejected" || ev.status === "DITOLAK") uiStatus = "DITOLAK";

      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      const tglString = ev.tanggalMulai ? new Date(ev.tanggalMulai).toLocaleDateString('id-ID', options) : "Belum diatur";

      return {
        id: ev.id,
        judul: ev.judul || "Untitled Event",
        status: uiStatus,
        kategori: ev.jenisEvent === "seminar" ? "Seminar" : "Conference",
        sub: ev.tipePlatform ? ev.tipePlatform.toUpperCase() : "ONLINE",
        peserta: ev.kuota ? ev.kuota.toLocaleString('id-ID') : "0",
        harga: ev.harga ? ev.harga.toLocaleString('id-ID') : "0",
        tanggal: tglString,
        rawTanggal: ev.tanggalMulai || "", 
        img: ev.bannerUrl || "",
        alasan: ev.alasanPenolakan || "Tidak ada alasan spesifik.",
        venue: ev.detailLokasi || "",
        deskripsi: ev.deskripsi || ""
      };
    });
  };

  const [dbEvents, setDbEvents] = useState<EventData[]>(() => 
    formatDbData(initialEvents).sort((a, b) => b.id - a.id)
  );

  async function loadEvents() {
    setIsLoading(true);
    try {
      const result = await getDaftarEvent();
      if (result.success && result.data) {
        setDbEvents(formatDbData(result.data).sort((a, b) => b.id - a.id));
      }
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setDbEvents(formatDbData(initialEvents).sort((a, b) => b.id - a.id));
  }, [initialEvents]);

  // Hitung data statistik riil
  const totalEventsCount = dbEvents.length;
  const aktifEventsCount = dbEvents.filter(ev => ev.status === "DIPUBLIKASI").length;
  const pendingEventsCount = dbEvents.filter(ev => ev.status === "DRAFT").length;

  const filteredEvents = dbEvents.filter((ev) => {
    const cocokJudul = ev.judul.toLowerCase().includes(searchQuery.toLowerCase());
    const cocokStatus = statusFilter === "Semua Status" || ev.status === statusFilter;
    const cocokTipe = tipeFilter === "Semua Tipe" || ev.kategori === tipeFilter;
    const cocokKategori = kategoriFilter === "Semua Kategori" || ev.kategori.toLowerCase() === kategoriFilter.toLowerCase();

    let cocokHarga = true;
    if (hargaFilter === "Gratis") cocokHarga = ev.harga === "0";
    else if (hargaFilter === "Berbayar") cocokHarga = ev.harga !== "0";

    let cocokTanggal = true;
    if (dateFilter && ev.rawTanggal) {
      const tglEvent = new Date(ev.rawTanggal).toDateString();
      const tglPilihan = new Date(dateFilter).toDateString();
      cocokTanggal = tglEvent === tglPilihan;
    }

    return cocokJudul && cocokStatus && cocokTipe && cocokKategori && cocokHarga && cocokTanggal;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, tipeFilter, kategoriFilter, hargaFilter, dateFilter]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const currentEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openEditModal = (event: EventData) => {
    setSelectedEvent(event);
    setFormData({
      tipeEvent: event.kategori || "Seminar",
      platform: event.sub || "ONLINE",
      judul: event.judul || "",
      kategori: event.sub || "Teknologi & Informasi",
      venue: event.venue || "",
      tipeTiket: event.harga && event.harga !== "0" ? "Paid" : "Free",
      harga: event.harga ? event.harga.replace(/\./g, '') : "0", 
      deskripsi: event.deskripsi || ""
    });
    setIsModalOpen(true);
  };

  const handleSimpanPerubahan = async () => {
    if (!selectedEvent?.id) return;
    setIsSaving(true);
    try {
      const hargaStr = String(formData.harga).replace(/\./g, '').replace(/,/g, '');
      const payload = {
        judul: formData.judul,
        jenisEvent: formData.tipeEvent.toLowerCase(),
        tipePlatform: formData.platform.toLowerCase(),
        detailLokasi: formData.venue,
        harga: formData.tipeTiket === "Free" ? 0 : parseInt(hargaStr || "0", 10),
        deskripsi: formData.deskripsi,
      };

      const res = await updateEventDatabase(selectedEvent.id, payload);
      if (!res?.success) {
        alert("Gagal menyimpan perubahan: " + (res?.error || "Terjadi kesalahan"));
        return;
      }
      await loadEvents(); 
      setIsModalOpen(false);
    } catch (error) {
      console.error("Gagal menyimpan:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER HALAMAN */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#1E293B]">Kelola Event</h1>
        <p className="text-slate-400 text-sm">Manajemen dan pantau event Anda di sini</p>
      </div>

      {/* STATS AREA - UKURAN & PADDING TETAP P-8, WARNA DISESUAIKAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* CARD TOTAL EVENT */}
        <div className="bg-white p-8 rounded-[24px] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
          {/* Icon Abu-Abu */}
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
          </div>
          {/* Judul Hitam Pekat */}
          <p className="text-[11px] font-extrabold text-[#1E293B] uppercase tracking-wider mb-1">Total Event</p>
          {/* Angka Abu-Abu */}
          <h3 className="text-[26px] font-semibold text-slate-400 leading-none">{isLoading ? "..." : totalEventsCount}</h3>
        </div>

        {/* CARD EVENT AKTIF */}
        <div className="bg-white p-8 rounded-[24px] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
          {/* Icon Abu-Abu */}
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M9 16l2 2 4-4"/></svg>
          </div>
          {/* Judul Hitam Pekat */}
          <p className="text-[11px] font-extrabold text-[#1E293B] uppercase tracking-wider mb-1">Event Aktif</p>
          {/* Angka Abu-Abu */}
          <h3 className="text-[26px] font-semibold text-slate-400 Perkalian leading-none">{isLoading ? "..." : aktifEventsCount}</h3>
        </div>

        {/* CARD EVENT PENDING */}
        <div className="bg-white p-8 rounded-[24px] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
          {/* Icon Abu-Abu */}
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-clock"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.5"/><path d="M16 2v2"/><path d="M8 2v2"/><path d="M3 10h18"/><path d="M18 22a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-5h-1.5V15"/></svg>
          </div>
          {/* Judul Hitam Pekat */}
          <p className="text-[11px] font-extrabold text-[#1E293B] uppercase tracking-wider mb-1">Event Pending</p>
          {/* Angka Abu-Abu */}
          <h3 className="text-[26px] font-semibold text-slate-400 leading-none">{isLoading ? "..." : pendingEventsCount}</h3>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 mb-8">
        {/* BARIS ATAS: Search Bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama event..." 
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-500">Tanggal</label>
            <input 
              type="date" 
              className="border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-[13px] text-slate-600 outline-none w-full cursor-pointer"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-500">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-[13px] text-slate-600 outline-none w-full cursor-pointer"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="DIPUBLIKASI">Dipublikasi</option>
              <option value="DRAFT">Draft</option>
              <option value="DITOLAK">Ditolak</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-500">Tipe</label>
            <select
              value={tipeFilter}
              onChange={(e) => setTipeFilter(e.target.value)}
              className="border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-[13px] text-slate-600 outline-none w-full cursor-pointer"
            >
              <option value="Semua Tipe">Semua Tipe</option>
              <option value="Seminar">Seminar</option>
              <option value="Conference">Conference</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-500">Kategori</label>
            <select
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
              className="border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-[13px] text-slate-600 outline-none w-full cursor-pointer"
            >
              <option value="Semua Kategori">Semua Kategori</option>
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

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-500">Harga</label>
            <select
              value={hargaFilter}
              onChange={(e) => setHargaFilter(e.target.value)}
              className="border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-[13px] text-slate-600 outline-none w-full cursor-pointer"
            >
              <option value="Semua Harga">Semua Harga</option>
              <option value="Gratis">Free (Gratis)</option>
              <option value="Berbayar">Paid (Berbayar)</option>
            </select>
          </div>
        </div>
      </div>

      {/* EVENTS CONTAINER */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Memuat data...</div>
        ) : currentEvents.length > 0 ? (
          currentEvents.map((ev) => {
            const isDraft = ev.status === "DRAFT";
            const isRejected = ev.status === "DITOLAK";

            return (
              <div key={ev.id} className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center justify-between shadow-sm hover:border-slate-300 transition-all">
                
                {/* ================= SISI KIRI: GAMBAR & DETAIL INFO ================= */}
                <div className="flex gap-6 flex-1 min-w-0 pr-6">
                  <div className="relative w-[240px] h-[135px] rounded-[20px] overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                    {ev.img ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={ev.img} alt="" className={`w-full h-full object-cover ${isRejected ? 'opacity-40 grayscale' : ''}`} />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                        <ImageIcon size={28} className="mb-1" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">No Banner</span>
                      </div>
                    )}
                    {isRejected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10">
                        <Ban size={28} className="text-red-500 opacity-80" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider">
                      <span className={`px-2 py-0.5 rounded-md border ${
                        isDraft ? 'bg-yellow-50 text-yellow-500 border-yellow-100' : 
                        isRejected ? 'bg-red-50 text-red-400 border-red-100' : 
                        'bg-green-50 text-green-500 border-green-100'
                      }`}>
                        {ev.status}
                      </span>
                      <span className="text-slate-300">• {ev.sub}</span>
                    </div>
                    <h3 className="font-bold text-[#1E293B] text-xl leading-tight mb-1 truncate">{ev.judul}</h3>
                    <div className="text-[12px] text-slate-400 flex items-center gap-1.5">
                      {isDraft ? <Edit3 size={12} className="shrink-0" /> : <Calendar size={12} className="shrink-0" />} <span>{ev.tanggal}</span>
                    </div>
                    {isRejected && (
                      <div className="flex items-center gap-1 mt-2 text-red-400">
                        <Info size={12} />
                        <p className="text-[11px] font-medium italic text-slate-400">Alasan: {ev.alasan}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-16 shrink-0 px-8 border-l border-slate-50">
                  <div className="w-[80px]">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Peserta</p>
                    <p className="font-bold text-slate-700 text-base">{ev.peserta}</p>
                  </div>
                  <div className="w-[120px]">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Harga</p>
                    <p className="font-bold text-slate-700 text-base">
                      {ev.harga === "0" ? (
                        <span className="inline-block text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md text-xs border border-green-100">Gratis</span>
                      ) : (
                        `Rp ${ev.harga}`
                      )}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-4">
                  <button 
                    onClick={() => !isRejected && openEditModal(ev)}
                    className={`min-w-[150px] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                      isRejected ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {isDraft ? "Lanjutkan" : "Kelola Event"}
                    {!isRejected && <ChevronRight size={16} />}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-[24px] border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <Search size={18} />
            </div>
            <div>
              <h4 className="font-bold text-[#1E293B] text-base">Data Event Tidak Ditemukan</h4>
              <p className="text-slate-400 text-sm max-w-sm mx-auto mt-0.5">
                Coba periksa kembali kata kunci pencarian atau gunakan parameter filter lainnya.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* PAGINATION SECTION */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-1.5 mt-6">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16}/>
          </button>
          
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button 
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
                  currentPage === pageNum 
                    ? 'bg-slate-900 text-white' 
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16}/>
          </button>
        </div>
      )}

      {/* MODAL EDIT FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-end bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl h-full flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-50">
              <h2 className="text-lg font-bold text-[#1E293B]">
                {selectedEvent?.status === "DRAFT" ? "Lanjutkan Draft Event" : "Edit Detail Event"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-all duration-200 hover:scale-110 active:scale-90" disabled={isSaving}>
                <X size={24}/>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Tipe Event</label>
                  <select value={formData.tipeEvent} onChange={(e) => setFormData({...formData, tipeEvent: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white outline-none">
                    <option value="Seminar">Seminar</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Platform</label>
                  <select value={formData.platform} onChange={(e) => setFormData({...formData, platform: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white outline-none">
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Judul Event</label>
                <input type="text" value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Kategori</label>
                <select value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white outline-none">
                  <option>Teknologi & Informasi</option>
                  <option>Bisnis & Ekonomi</option>
                  <option>Kreatif & Desain</option>
                  <option>Sains & Akademik</option>
                  <option>Kesehatan & Medis</option>
                  <option>Umum</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Lokasi / Venue</label>
                <div className="relative">
                  <input type="text" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm outline-none" />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Tipe Tiket</label>
                  <select value={formData.tipeTiket} onChange={(e) => setFormData({...formData, tipeTiket: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white outline-none">
                    <option value="Paid">Paid (Berbayar)</option>
                    <option value="Free">Free (Gratis)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Biaya (Rp)</label>
                  <div className="relative">
                    <input type="text" value={formData.tipeTiket === "Free" ? "0" : formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} disabled={formData.tipeTiket === "Free"} className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-sm outline-none disabled:bg-slate-50" />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">Rp</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Deskripsi Event</label>
                <textarea rows={4} value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none resize-none"></textarea>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50/50">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md text-sm"
                disabled={isSaving}
              >
                Batal
              </button>
              <button 
                onClick={handleSimpanPerubahan}
                disabled={isSaving}
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-sm flex items-center justify-center"
              >
                {isSaving ? "Menyimpan..." : (selectedEvent?.status === "DRAFT" ? "Simpan Draft" : "Simpan Perubahan")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}