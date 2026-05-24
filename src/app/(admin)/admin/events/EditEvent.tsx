'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Type, 
  MapPin, 
  AlignLeft, 
  Users, 
  Ticket, 
  Image as ImageIcon,
  Layout,
  Tag,
  Globe,
  Clock,
  Mic,
  ShieldCheck
} from 'lucide-react';
import { updateEvent } from '@/actions/admin-event';
import { toast } from 'react-hot-toast';
import type { Event } from './ClientPage';
import { cn } from "@/lib/utils";

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
        // Ensure values are safe for inputs
        namaPembicara: event.namaPembicara || '',
        websiteSumber: event.websiteSumber || '',
        tipePlatform: event.tipePlatform || 'offline',
        tipeHarga: event.tipeHarga || 'free',
        isEventPolines: event.isEventPolines ?? false,
      });
    }
  }, [event]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => prev ? ({ ...prev, [name]: finalValue }) : null);
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => prev ? ({ ...prev, [name]: new Date(value) }) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateEvent(event.id, formData as Record<string, unknown>);
      if (res.success) {
        toast.success('Event berhasil diperbarui');
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || 'Gagal memperbarui event');
      }
    } catch (err) {
      console.error("[EditEvent] Submit error:", err);
      toast.error('Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0E215D]/40 focus:bg-white transition-all font-semibold text-slate-700 placeholder:text-slate-300";
  const labelClasses = "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block flex items-center gap-2";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0E215D]/40 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-[#0E215D] text-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Layout size={24} className="text-blue-200" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest leading-none">Edit Data Event</h2>
              <p className="text-[10px] text-blue-200 font-bold uppercase tracking-tighter mt-1">Kelola data event dan simpan perubahannya!</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-10 space-y-10 overflow-y-auto custom-scrollbar flex-1">
          {/* Section 1: Poster & Banner */}
          <div className="space-y-4">
             <label className={labelClasses}><ImageIcon size={12} /> Poster / Banner Event</label>
             <div className="relative h-64 w-full rounded-[2.5rem] bg-slate-100 overflow-hidden group border-4 border-slate-50 shadow-inner">
                {formData.bannerUrl ? (
                   <img src={formData.bannerUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                      <ImageIcon size={48} strokeWidth={1} />
                      <p className="text-xs font-bold uppercase tracking-wider">No Poster Uploaded</p>
                   </div>
                )}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm duration-500">
                    <div className="w-3/4 space-y-3 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <label className="text-[10px] text-white font-black uppercase tracking-widest block">Update URL Poster</label>
                        <input 
                            type="text" 
                            name="bannerUrl"
                            value={formData.bannerUrl || ''}
                            onChange={handleChange}
                            placeholder="https://link-gambar.com/poster.jpg"
                            className="w-full px-6 py-4 bg-white rounded-2xl text-sm font-bold outline-none shadow-2xl focus:ring-4 ring-blue-500/20"
                        />
                    </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {/* --- BAGIAN 1: TIPE & JENIS --- */}
            <div className="md:col-span-2 flex items-center gap-3 pb-2 border-b border-slate-100">
               <div className="w-2 h-6 bg-[#0E215D] rounded-full"></div>
               <h3 className="font-black text-[#0E215D] uppercase tracking-wider text-sm">1. Klasifikasi Event</h3>
            </div>

            <div>
              <label className={labelClasses}><Layout size={12} /> Tipe Event (Seminar/Conference)</label>
              <div className="relative">
                <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select name="jenisEvent" value={formData.jenisEvent || ''} onChange={handleChange} className={cn(inputClasses, "appearance-none")}>
                  <option value="seminar">Seminar</option>
                  <option value="conference">Conference</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClasses}><Tag size={12} /> Jenis Event (Polines/Umum)</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
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
            <div className="md:col-span-2 flex items-center gap-3 pt-4 pb-2 border-b border-slate-100">
               <div className="w-2 h-6 bg-[#0E215D] rounded-full"></div>
               <h3 className="font-black text-[#0E215D] uppercase tracking-wider text-sm">2. Detail Umum</h3>
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}><Type size={12} /> Judul Event</label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" name="judul" value={formData.judul} onChange={handleChange} className={inputClasses} required />
              </div>
            </div>

            <div>
              <label className={labelClasses}><Globe size={12} /> Tipe Platform</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
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
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" name="detailLokasi" value={formData.detailLokasi || ''} onChange={handleChange} className={inputClasses} placeholder="Alamat atau Link Zoom/GMeet" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}><Mic size={12} /> Pembicara / Pemateri</label>
              <div className="relative">
                <Mic className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" name="namaPembicara" value={formData.namaPembicara || ''} onChange={handleChange} className={inputClasses} placeholder="Nama pembicara (pisahkan dengan koma)" />
              </div>
            </div>

            <div>
              <label className={labelClasses}><Ticket size={12} /> Status Biaya</label>
              <div className="relative">
                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select name="tipeHarga" value={formData.tipeHarga || 'free'} onChange={handleChange} className={cn(inputClasses, "appearance-none")}>
                  <option value="free">Gratis</option>
                  <option value="paid">Berbayar</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClasses}><Ticket size={12} /> Nominal Biaya (IDR)</label>
              <div className="relative">
                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="number" name="harga" value={formData.harga || 0} onChange={handleChange} className={inputClasses} disabled={formData.tipeHarga === 'free'} />
              </div>
            </div>

            {/* --- BAGIAN 3: JADWAL & KUOTA --- */}
            <div className="md:col-span-2 flex items-center gap-3 pt-4 pb-2 border-b border-slate-100">
               <div className="w-2 h-6 bg-[#0E215D] rounded-full"></div>
               <h3 className="font-black text-[#0E215D] uppercase tracking-wider text-sm">3. Jadwal & Kuota</h3>
            </div>

            <div>
              <label className={labelClasses}><Clock size={12} /> Tanggal & Waktu Mulai</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="datetime-local" name="tanggalMulai" value={formData.tanggalMulai ? new Date(formData.tanggalMulai).toISOString().slice(0, 16) : ''} onChange={(e) => handleDateChange('tanggalMulai', e.target.value)} className={inputClasses} />
              </div>
            </div>

            <div>
              <label className={labelClasses}><Clock size={12} /> Tanggal & Waktu Selesai</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="datetime-local" name="tanggalSelesai" value={formData.tanggalSelesai ? new Date(formData.tanggalSelesai).toISOString().slice(0, 16) : ''} onChange={(e) => handleDateChange('tanggalSelesai', e.target.value)} className={inputClasses} />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}><Users size={12} /> Batas Kuota Peserta</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="number" name="kuota" value={formData.kuota || 0} onChange={handleChange} className={inputClasses} />
              </div>
            </div>

            {/* --- BAGIAN 4: LINK & DESKRIPSI --- */}
            <div className="md:col-span-2 flex items-center gap-3 pt-4 pb-2 border-b border-slate-100">
               <div className="w-2 h-6 bg-[#0E215D] rounded-full"></div>
               <h3 className="font-black text-[#0E215D] uppercase tracking-wider text-sm">4. Registrasi & Konten</h3>
            </div>

            {/* Conditional Field: Web Sumber (Only for Umum) */}
            {!formData.isEventPolines && (
              <div className="md:col-span-2 animate-in slide-in-from-top-2 duration-300">
                <label className={labelClasses}><Globe size={12} /> Link Sumber / Web Sumber (Khusus Event Umum)</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0E215D]" size={20} />
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
              <textarea name="deskripsi" value={formData.deskripsi || ''} onChange={handleChange} rows={5} className={cn(inputClasses, "pl-6 pt-4 resize-none")} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}><ShieldCheck size={12} /> Syarat & Ketentuan</label>
              <textarea name="syaratDanKetentuan" value={formData.syaratDanKetentuan || ''} onChange={handleChange} rows={5} className={cn(inputClasses, "pl-6 pt-4 resize-none")} />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4 shrink-0">
          <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Batal</button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex-2 py-4 bg-[#0E215D] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#0E215D]/20 hover:bg-[#1a3280] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
            {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Menyimpan...</> : <><Save size={18} /> Simpan Perubahan</>}
          </button>
        </div>
      </div>
    </div>
  );
}
