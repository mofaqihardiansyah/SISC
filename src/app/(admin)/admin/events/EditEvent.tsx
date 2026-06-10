"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Save, Image as ImageIcon, Layout, Tag, Type, Globe, MapPin, Mic, Ticket, Clock, Users, AlignLeft, ShieldCheck } from "lucide-react";
import { updateEvent } from "@/actions/admin-event";
import { toast } from "react-hot-toast";
import type { Event } from "./ClientPage";
import { cn } from "@/lib/utils";
import Portal from "@/components/ui/Portal";

type EditEventProps = {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onSuccess: () => void;
};

export default function EditEvent({ isOpen, onClose, event, onSuccess }: EditEventProps) {
  const [formData, setFormData] = useState<Partial<Event> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        namaPembicara: event.namaPembicara || "",
        websiteSumber: event.websiteSumber || "",
        tipePlatform: event.tipePlatform || "offline",
        tipeHarga: event.tipeHarga || "free",
        isEventPolines: event.isEventPolines ?? false,
        penyelenggara: event.penyelenggara || "",
        emailKontak: event.emailKontak || "",
        teleponKontak: event.teleponKontak || "",
      });
    }
  }, [event]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => (prev ? { ...prev, [name]: finalValue } : null));
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [name]: value ? new Date(value) : null } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateEvent(event.id, formData as Record<string, unknown>);
      if (res.success) {
        toast.success("Event berhasil diperbarui");
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || "Gagal memperbarui event");
      }
    } catch (err) {
      console.error("[EditEvent] Submit error:", err);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-100 text-slate-700 font-medium";
  const labelClasses = "text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1 block flex items-center gap-1.5";

  return (
    <Portal>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white text-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider leading-none">Edit Data Event</h2>
              <p className="text-nano text-slate-400 font-medium tracking-normal mt-1">Kelola data event dan simpan perubahannya!</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors cursor-pointer">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Section 1: Poster & Banner */}
          <div className="space-y-3">
             <label className={labelClasses}><ImageIcon size={12} /> Poster / Banner Event</label>
             <div className="relative h-48 w-full rounded-xl bg-slate-100 overflow-hidden group border border-slate-200 shadow-sm">
                {formData.bannerUrl ? (
                   <Image src={formData.bannerUrl} alt="Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="100vw" />
                ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1">
                      <ImageIcon size={32} strokeWidth={1} />
                      <p className="text-xxs font-bold uppercase tracking-wider">No Poster Uploaded</p>
                   </div>
                )}
                <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-xs duration-300">
                    <div className="w-4/5 space-y-2 text-center">
                        <label className="text-xxs text-white font-bold uppercase tracking-wider block">Update URL Poster</label>
                        <input 
                            type="text" 
                            name="bannerUrl"
                            value={formData.bannerUrl || ''}
                            onChange={handleChange}
                            placeholder="https://link-gambar.com/poster.jpg"
                            className="w-full px-3 py-1.5 bg-white rounded-xl text-xs outline-none border border-slate-200 focus:ring-2 focus:ring-slate-100 text-slate-700 font-semibold"
                        />
                    </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* --- BAGIAN 1: TIPE & JENIS --- */}
            <div className="md:col-span-2 flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
               <div className="w-1 h-4 bg-slate-900 rounded-full"></div>
               <h3 className="font-bold text-slate-800 uppercase tracking-wider text-micro">1. Klasifikasi Event</h3>
            </div>

            <div>
              <label className={labelClasses}><Layout size={12} /> Tipe Event (Seminar/Conference)</label>
              <div className="relative">
                <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select name="jenisEvent" value={formData.jenisEvent || ''} onChange={handleChange} className={cn(inputClasses, "appearance-none")}>
                  <option value="seminar">Seminar</option>
                  <option value="conference">Conference</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClasses}><Tag size={12} /> Jenis Event (Polines/Umum)</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select 
                   name="isEventPolines" 
                   value={formData.isEventPolines ? "true" : "false"} 
                   onChange={(e) => setFormData(prev => prev ? ({ ...prev, isEventPolines: e.target.value === "true" }) : null)} 
                   className={cn(inputClasses, "appearance-none")}
                >
                  <option value="true">Polines (Internal)</option>
                  <option value="false">Umum (Eksternal)</option>
                </select>
              </div>
            </div>

            {/* --- BAGIAN 2: DETAIL UMUM --- */}
            <div className="md:col-span-2 flex items-center gap-2 pt-2 pb-1.5 border-b border-slate-200/60">
               <div className="w-1 h-4 bg-slate-900 rounded-full"></div>
               <h3 className="font-bold text-slate-800 uppercase tracking-wider text-micro">2. Detail Umum</h3>
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}><Type size={12} /> Judul Event</label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="text" name="judul" value={formData.judul} onChange={handleChange} className={inputClasses} required />
              </div>
            </div>

            <div>
              <label className={labelClasses}><Globe size={12} /> Tipe Platform</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select name="tipePlatform" value={formData.tipePlatform || 'offline'} onChange={handleChange} className={cn(inputClasses, "appearance-none")}>
                  <option value="offline">Luring (Offline)</option>
                  <option value="online">Daring (Online)</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClasses}><MapPin size={12} /> Lokasi / Link Platform</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="text" name="detailLokasi" value={formData.detailLokasi || ''} onChange={handleChange} className={inputClasses} placeholder="Alamat atau Link Zoom/GMeet" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}><Mic size={12} /> Pembicara / Pemateri</label>
              <div className="relative">
                <Mic className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="text" name="namaPembicara" value={formData.namaPembicara || ''} onChange={handleChange} className={inputClasses} placeholder="Nama pembicara (pisahkan dengan koma)" />
              </div>
            </div>

            <div>
              <label className={labelClasses}><Ticket size={12} /> Status Biaya</label>
              <div className="relative">
                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select name="tipeHarga" value={formData.tipeHarga || 'free'} onChange={handleChange} className={cn(inputClasses, "appearance-none")}>
                  <option value="free">Gratis</option>
                  <option value="paid">Berbayar</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClasses}><Ticket size={12} /> Nominal Biaya (IDR)</label>
              <div className="relative">
                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="number" name="harga" value={formData.harga || 0} onChange={handleChange} className={inputClasses} disabled={formData.tipeHarga === 'free'} />
              </div>
            </div>

            {/* --- BAGIAN 3: JADWAL & KUOTA --- */}
            <div className="md:col-span-2 flex items-center gap-2 pt-2 pb-1.5 border-b border-slate-200/60">
               <div className="w-1 h-4 bg-slate-900 rounded-full"></div>
               <h3 className="font-bold text-slate-800 uppercase tracking-wider text-micro">3. Jadwal & Kuota</h3>
            </div>

            <div>
              <label className={labelClasses}><Clock size={12} /> Tanggal & Waktu Mulai</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="datetime-local" name="tanggalMulai" value={formData.tanggalMulai ? new Date(formData.tanggalMulai).toISOString().slice(0, 16) : ''} onChange={(e) => handleDateChange('tanggalMulai', e.target.value)} className={inputClasses} />
              </div>
            </div>

            <div>
              <label className={labelClasses}><Clock size={12} /> Tanggal & Waktu Selesai</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="datetime-local" name="tanggalSelesai" value={formData.tanggalSelesai ? new Date(formData.tanggalSelesai).toISOString().slice(0, 16) : ''} onChange={(e) => handleDateChange('tanggalSelesai', e.target.value)} className={inputClasses} />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}><Users size={12} /> Batas Kuota Peserta</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="number" name="kuota" value={formData.kuota || 0} onChange={handleChange} className={inputClasses} />
              </div>
            </div>

            {/* --- BAGIAN 4: LINK & DESKRIPSI --- */}
            <div className="md:col-span-2 flex items-center gap-2 pt-2 pb-1.5 border-b border-slate-200/60">
               <div className="w-1 h-4 bg-slate-900 rounded-full"></div>
               <h3 className="font-bold text-slate-800 uppercase tracking-wider text-micro">4. Registrasi & Konten</h3>
            </div>

            {!formData.isEventPolines && (
              <div className="md:col-span-2 animate-in slide-in-from-top-2 duration-300">
                <label className={labelClasses}><Globe size={12} /> Link Sumber / Web Sumber (Khusus Event Umum)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    name="websiteSumber" 
                    value={formData.websiteSumber || ''} 
                    onChange={handleChange} 
                    className={cn(inputClasses, "border-blue-100 bg-blue-50/30")} 
                    placeholder="Contoh: https://eventbanget.com/detail-event" 
                  />
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <label className={labelClasses}><AlignLeft size={12} /> Deskripsi Lengkap Event</label>
              <textarea name="deskripsi" value={formData.deskripsi || ''} onChange={handleChange} rows={3} className={cn(inputClasses, "pl-4 pt-2 resize-none")} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}><ShieldCheck size={12} /> Syarat & Ketentuan</label>
              <textarea name="syaratDanKetentuan" value={formData.syaratDanKetentuan || ''} onChange={handleChange} rows={3} className={cn(inputClasses, "pl-4 pt-2 resize-none")} />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3 justify-end shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 cursor-pointer animate-all duration-200 active:scale-95"
          >
            Batal
          </button>
          <button 
            type="button" 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer animate-all duration-200 active:scale-95 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={14} />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}
