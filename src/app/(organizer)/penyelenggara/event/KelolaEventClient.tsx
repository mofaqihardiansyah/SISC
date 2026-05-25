"use client";

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, ChevronLeft, Ban, X, Info, MapPin } from "lucide-react";
// Import getDaftarEvent dan updateEventDatabase dengan aman
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
  img: string;
  alasan?: string;
}

export default function KelolaEventClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [dbEvents, setDbEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ==========================================
  // STATE FILTER UTAMA (Terhubung ke Database)
  // ==========================================
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [tipeFilter, setTipeFilter] = useState("Semua Tipe");
  const [kategoriFilter, setKategoriFilter] = useState("Semua Kategori");
  const [hargaFilter, setHargaFilter] = useState("Semua Harga");

  // State Kontrol Form di Dalam Modal
  const [formData, setFormData] = useState<any>({
    tipeEvent: "Seminar",
    platform: "ONLINE",
    judul: "",
    kategori: "Teknologi & Informasi",
    venue: "",
    tipeTiket: "Free",
    harga: "0",
    deskripsi: ""
  });

  // Fungsi fetch data utama langsung dari database
  async function loadEvents() {
    setIsLoading(true);
    try {
      const result = await getDaftarEvent();
      if (result.success && result.data) {
        const mapped = result.data.map((ev: any) => {
          let uiStatus = "DRAFT";
          if (ev.status === "published") uiStatus = "DIPUBLIKASI";
          if (ev.status === "rejected") uiStatus = "DITOLAK";

          const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
          const tglString = ev.tanggalMulai ? new Date(ev.tanggalMulai).toLocaleDateString('id-ID', options) : "Belum diatur";

          return {
            id: ev.id, // ID dari database
            judul: ev.judul || "Untitled Event",
            status: uiStatus,
            kategori: ev.jenisEvent === "seminar" ? "Seminar" : "Conference",
            sub: ev.tipePlatform ? ev.tipePlatform.toUpperCase() : "ONLINE",
            peserta: ev.kuota ? ev.kuota.toLocaleString('id-ID') : "0",
            harga: ev.harga ? ev.harga.toLocaleString('id-ID') : "0",
            tanggal: tglString,
            rawTanggal: ev.tanggalMulai || "", 
            img: ev.bannerUrl || "https://images.unsplash.com/photo-1540575861501-7ce0e2204919?q=80&w=400",
            alasan: ev.alasanPenolakan || "Metadata gambar tidak sesuai panduan.",
            venue: ev.detailLokasi || "",
            deskripsi: ev.deskripsi || ""
          };
        });

        // LOCK POSISI CARD: Di-sorting berdasarkan ID Ascending agar posisi card tetap konsisten di tempatnya
        const sortedMapped = mapped.sort((a: any, b: any) => a.id - b.id);
        
        setDbEvents(sortedMapped);
      }
    } catch (err) {
      console.error("Gagal mengambil data dari database:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  // ==========================================
  // LOGIKA MULTI-FILTER DINAMIS DATABASE
  // ==========================================
  const filteredEvents = dbEvents.filter((ev) => {
    const cocokJudul = ev.judul.toLowerCase().includes(searchQuery.toLowerCase());
    const cocokStatus = statusFilter === "Semua Status" || ev.status === statusFilter;
    const cocokTipe = tipeFilter === "Semua Tipe" || ev.kategori === tipeFilter;
    
    const cocokKategori = kategoriFilter === "Semua Kategori" || 
                          ev.kategori.toLowerCase() === kategoriFilter.toLowerCase();

    let cocokHarga = true;
    if (hargaFilter === "Gratis") {
      cocokHarga = ev.harga === "0";
    } else if (hargaFilter === "Berbayar") {
      cocokHarga = ev.harga !== "0";
    }

    let cocokTanggal = true;
    if (dateFilter && ev.rawTanggal) {
      const tglEvent = new Date(ev.rawTanggal).toDateString();
      const tglPilihan = new Date(dateFilter).toDateString();
      cocokTanggal = tglEvent === tglPilihan;
    }

    return cocokJudul && cocokStatus && cocokTipe && cocokKategori && cocokHarga && cocokTanggal;
  });

  // Membuka modal dan melakukan auto-fill state form
  const openEditModal = (event: any) => {
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

  // ==========================================
  // FUNGSI SIMPAN PERUBAHAN KE DATABASE RESMI
  // ==========================================
  const handleSimpanPerubahan = async () => {
    if (!selectedEvent?.id) return;
    
    setIsSaving(true);
    try {
      const payload = {
        judul: formData.judul,
        jenisEvent: formData.tipeEvent.toLowerCase(),
        tipePlatform: formData.platform.toLowerCase(),
        detailLokasi: formData.venue,
        harga: formData.tipeTiket === "Free" ? 0 : parseInt(formData.harga || "0"),
        deskripsi: formData.deskripsi,
      };

      const res = await updateEventDatabase(selectedEvent.id, payload);
      
      if (!res?.success) {
        // Fallback update state lokal jika server action tidak mengembalikan response object terstruktur
        setDbEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? {
          ...ev,
          judul: formData.judul,
          kategori: formData.tipeEvent,
          sub: formData.platform.toUpperCase(),
          venue: formData.venue,
          harga: formData.tipeTiket === "Free" ? "0" : parseInt(formData.harga).toLocaleString('id-ID'),
          deskripsi: formData.deskripsi
        } : ev));
      }
      
      // Ambil data terbaru dan langsung tutup modal secara senyap (tanpa alert popup)
      await loadEvents(); 
      setIsModalOpen(false);
    } catch (error) {
      console.error("Gagal menyimpan ke database:", error);
    } finally {
      setIsSaving(false);
    }
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
        {/* BARIS ATAS: Search Bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama event..." 
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-blue-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* BARIS INPUT FILTER BAWAH */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700">Tanggal</label>
            <input 
              type="date" 
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-600 bg-white outline-none w-full cursor-pointer"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-600 bg-white outline-none w-full cursor-pointer"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="DIPUBLIKASI">Dipublikasi</option>
              <option value="DRAFT">Draft</option>
              <option value="DITOLAK">Ditolak</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700">Tipe</label>
            <select
              value={tipeFilter}
              onChange={(e) => setTipeFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-600 bg-white outline-none w-full cursor-pointer"
            >
              <option value="Semua Tipe">Semua Tipe</option>
              <option value="Seminar">Seminar</option>
              <option value="Conference">Conference</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-700">Kategori</label>
            <select
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-600 bg-white outline-none w-full cursor-pointer"
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
            <label className="text-[13px] font-bold text-slate-700">Harga</label>
            <select
              value={hargaFilter}
              onChange={(e) => setHargaFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] text-slate-600 bg-white outline-none w-full cursor-pointer"
            >
              <option value="Semua Harga">Semua Harga</option>
              <option value="Gratis">Free (Gratis)</option>
              <option value="Berbayar">Paid (Berbayar)</option>
            </select>
          </div>
        </div>
      </div>

      {/* EVENT LIST SECTION */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Memuat data dari database...</div>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((ev) => {
            const isDraft = ev.status === "DRAFT";
            const isRejected = ev.status === "DITOLAK";

            return (
              <div key={ev.id} className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center justify-between shadow-sm hover:border-blue-200 transition-all">
                
                {/* ================= SISI KIRI: GAMBAR & DETAIL INFO ================= */}
                <div className="flex gap-6 flex-1 min-w-0 pr-6">
                  <div className="relative w-[240px] h-[135px] rounded-[20px] overflow-hidden bg-slate-900 shrink-0">
                    <img src={ev.img} alt="" className={`w-full h-full object-cover ${isRejected ? 'opacity-40 grayscale' : 'opacity-80'}`} />
                    {isRejected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Ban size={32} className="text-white opacity-90" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-center min-w-0">
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
                    <h3 className="font-bold text-[#1E293B] text-xl leading-tight mb-1 truncate">{ev.judul}</h3>
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

                {/* ================= SISI TENGAH: PESERTA & HARGA ================= */}
                <div className="flex items-center gap-16 shrink-0 px-8 border-l border-slate-50">
                  <div className="w-[80px] text-left">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Peserta</p>
                    <p className="font-bold text-slate-700 text-base">{ev.peserta}</p>
                  </div>
                  
                  <div className="w-[120px] text-left">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Harga</p>
                    <p className="font-bold text-slate-700 text-base">
                      {ev.harga === "0" ? (
                        <span className="inline-block text-green-600 font-semibold bg-green-50 px-2.5 py-0.5 rounded-md text-xs border border-green-100">Gratis</span>
                      ) : (
                        `Rp ${ev.harga}`
                      )}
                    </p>
                  </div>
                </div>

                {/* ================= SISI KANAN: TOMBOL AKSI ================= */}
                <div className="shrink-0 pl-4">
                  <button 
                    onClick={() => !isRejected && openEditModal(ev)}
                    className={`min-w-[150px] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      isRejected ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-[#00478F] text-white hover:bg-[#00356B]'
                    }`}
                  >
                    {isDraft ? "Lanjutkan" : "Kelola Event"}
                    {!isRejected && <ChevronRight size={18} />}
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-[24px] border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <Search size={22} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#1E293B] text-base">Data Event Tidak Ditemukan</h4>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Coba periksa kembali kata kunci pencarian atau sesuaikan kombinasi parameter filter yang kamu pilih.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end items-center gap-2 mt-8 pb-10">
        <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-white transition-colors"><ChevronLeft size={18}/></button>
        <button className="w-9 h-9 flex items-center justify-center bg-[#1E293B] text-white rounded-lg font-bold text-sm">1</button>
        <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-600 font-bold text-sm hover:bg-white">2</button>
        <span className="px-1 text-slate-300">...</span>
        <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-white"><ChevronRight size={18}/></button>
      </div>

      {/* MODAL POP-UP EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-end bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-[#1E293B]">
                {selectedEvent?.status === "DRAFT" ? "Lanjutkan Draft Event" : "Edit Detail Event"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors" disabled={isSaving}>
                <X size={24}/>
              </button>
            </div>
            
            {/* Body Modal */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Tipe Event</label>
                  <select 
                    value={formData.tipeEvent}
                    onChange={(e) => setFormData({...formData, tipeEvent: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none bg-white focus:border-blue-400 text-sm"
                  >
                    <option value="Seminar">Seminar</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Platform</label>
                  <select 
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none bg-white focus:border-blue-400 text-sm"
                  >
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Judul Event</label>
                <input 
                  type="text" 
                  value={formData.judul}
                  onChange={(e) => setFormData({...formData, judul: e.target.value})}
                  placeholder="Masukkan judul event"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400 text-sm" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Kategori</label>
                <select 
                  value={formData.kategori}
                  onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none bg-white focus:border-blue-400 text-sm"
                >
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
                  <input 
                    type="text" 
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    placeholder="Masukkan lokasi venue" 
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue-400 text-sm" 
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Tipe Tiket</label>
                  <select 
                    value={formData.tipeTiket}
                    onChange={(e) => setFormData({...formData, tipeTiket: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none bg-white focus:border-blue-400 text-sm"
                  >
                    <option value="Paid">Paid (Berbayar)</option>
                    <option value="Free">Free (Gratis)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Biaya (Rp)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.tipeTiket === "Free" ? "0" : formData.harga}
                      onChange={(e) => setFormData({...formData, harga: e.target.value})}
                      disabled={formData.tipeTiket === "Free"}
                      placeholder="0" 
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue-400 text-sm disabled:bg-slate-50 disabled:text-slate-400" 
                    />
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
                  <textarea 
                    rows={4} 
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                    className="w-full p-4 outline-none resize-none text-sm" 
                    placeholder="Jelaskan detail event kamu..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50/50">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-white transition-all text-sm"
                disabled={isSaving}
              >
                Batal
              </button>
              <button 
                onClick={handleSimpanPerubahan}
                disabled={isSaving}
                className="flex-1 py-3 bg-[#00478F] text-white rounded-xl font-bold hover:bg-[#00356B] transition-all shadow-lg shadow-blue-900/10 text-sm flex items-center justify-center"
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
