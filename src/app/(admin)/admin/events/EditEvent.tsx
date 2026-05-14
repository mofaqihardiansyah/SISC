'use client';

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { updateEvent } from '@/actions/admin-event';
import { toast } from 'react-hot-toast';
import type { Event } from './ClientPage';

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
        judul: event.judul,
        penyelenggara: event.penyelenggara,
        deskripsi: event.deskripsi,
        detailLokasi: event.detailLokasi,
        kuota: event.kuota,
        harga: event.harga,
        emailKontak: event.emailKontak,
        teleponKontak: event.teleponKontak,
      });
    }
  }, [event]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateEvent(event.id, formData);
      if (res.success) {
        toast.success('Event berhasil diperbarui');
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || 'Gagal memperbarui event');
      }
    } catch (err) {
      console.error("[EditEvent] Submit error:", err);
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      toast.error(message);
    } finally {

      setIsSubmitting(false);
    }

  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-[#0E215D] text-white">
          <h2 className="text-xl font-black uppercase tracking-widest">Edit Data Event</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Judul Event</label>
              <input 
                type="text" 
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0E215D]/20 font-semibold text-slate-700"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Penyelenggara</label>
                <input 
                  type="text" 
                  name="penyelenggara"
                  value={formData.penyelenggara || ''}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0E215D]/20 font-semibold text-slate-700"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Lokasi</label>
                <input 
                  type="text" 
                  name="detailLokasi"
                  value={formData.detailLokasi || ''}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0E215D]/20 font-semibold text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Deskripsi</label>
              <textarea 
                name="deskripsi"
                value={formData.deskripsi || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0E215D]/20 font-semibold text-slate-700 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Kuota</label>
                <input 
                  type="number" 
                  name="kuota"
                  value={formData.kuota || 0}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0E215D]/20 font-semibold text-slate-700"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Harga</label>
                <input 
                  type="number" 
                  name="harga"
                  value={formData.harga || 0}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0E215D]/20 font-semibold text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Email Kontak</label>
                <input 
                  type="email" 
                  name="emailKontak"
                  value={formData.emailKontak || ''}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0E215D]/20 font-semibold text-slate-700"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Telepon Kontak</label>
                <input 
                  type="text" 
                  name="teleponKontak"
                  value={formData.teleponKontak || ''}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0E215D]/20 font-semibold text-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-4 bg-[#0E215D] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#0E215D]/20 hover:bg-[#1a3280] transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Menyimpan...' : <><Save size={16} /> Simpan Perubahan</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
