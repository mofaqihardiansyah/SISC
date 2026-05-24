'use client';

import React from 'react';
import { X, Calendar, MapPin, Users, Wallet, Building2, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

type DataEventProps = {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: number;
    judul: string;
    penyelenggara: string | null;
    tanggalMulai: Date;
    status: 'pending' | 'published' | 'rejected';
    bannerUrl: string | null;
    deskripsi: string | null;
    syaratDanKetentuan: string | null;
    detailLokasi: string | null;
    kuota: number | null;
    tipeHarga: string | null;
    harga: number | null;
    emailKontak: string | null;
    teleponKontak: string | null;
    participantCount?: number;
  };
  onUpdateStatus: (id: number, status: 'published' | 'rejected') => Promise<void>;
};

export default function DataEvent({ isOpen, onClose, event, onUpdateStatus }: DataEventProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        
        {/* Header with Banner */}
        <div className="relative h-48 sm:h-64 bg-[#0E215D] overflow-hidden shrink-0">
          {event.bannerUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={event.bannerUrl} alt={event.judul} className="w-full h-full object-cover opacity-50" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-20">
              <Building2 size={120} className="text-white" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#0E215D] to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md border border-white/10 transition-all z-20"
          >
            <X size={20} strokeWidth={3} />
          </button>

          <div className="absolute bottom-8 left-8 right-8 z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-400/20 text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border border-white/10 backdrop-blur-md">
                Event Detail
              </span>
              <span className={`
                ${event.status === 'published' ? 'bg-emerald-400/20 text-emerald-100 border-emerald-100/20' : ''}
                ${event.status === 'pending' ? 'bg-amber-400/20 text-amber-100 border-amber-100/20' : ''}
                ${event.status === 'rejected' ? 'bg-rose-400/20 text-rose-100 border-rose-100/20' : ''}
                text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border backdrop-blur-md
              `}>
                {event.status}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">{event.judul}</h2>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-10 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-[#0E215D] rounded-full"></div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Deskripsi Event</h3>
                </div>
                <div className="text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-6 rounded-3xl border border-slate-100 whitespace-pre-wrap text-sm">
                  {event.deskripsi || 'Tidak ada deskripsi tersedia.'}
                </div>
              </section>

              {/* Syarat & Ketentuan */}
              {event.syaratDanKetentuan && (
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-[#0E215D] rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Syarat & Ketentuan</h3>
                  </div>
                  <div className="text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-6 rounded-3xl border border-slate-100 whitespace-pre-wrap text-sm">
                    {event.syaratDanKetentuan}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Details */}
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-[2.5rem] p-6 border border-slate-100 space-y-6">
                <h4 className="text-[10px] font-black text-[#0E215D] uppercase tracking-[0.2em] mb-4 text-center">Informasi Lengkap</h4>
                
                <DetailItem 
                  icon={<Calendar size={18} className="text-[#0E215D]" />} 
                  label="Tanggal Mulai" 
                  value={format(new Date(event.tanggalMulai), 'dd MMMM yyyy', { locale: id })} 
                />
                
                <DetailItem 
                  icon={<MapPin size={18} className="text-[#0E215D]" />} 
                  label="Lokasi" 
                  value={event.detailLokasi || 'Online / Hybrid'} 
                />
                
                <DetailItem 
                  icon={<Users size={18} className="text-[#0E215D]" />} 
                  label="Kuota Peserta" 
                  value={`${event.kuota || 0} Orang`} 
                />
                
                <DetailItem 
                  icon={<Users size={18} className="text-[#0E215D]" />} 
                  label="Pendaftar" 
                  value={`${event.participantCount || 0} Orang`} 
                />
                
                <DetailItem 
                  icon={<Wallet size={18} className="text-[#0E215D]" />} 
                  label="Harga Tiket" 
                  value={event.tipeHarga === 'free' ? 'Gratis' : `Rp ${event.harga?.toLocaleString('id-ID')}`} 
                />

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Kontak Penyelenggara</p>
                  <div className="space-y-3">
                    <DetailItem icon={<Building2 size={14} />} label="" value={event.penyelenggara || '-'} compact />
                    <DetailItem icon={<Mail size={14} />} label="" value={event.emailKontak || '-'} compact />
                    <DetailItem icon={<Phone size={14} />} label="" value={event.teleponKontak || '-'} compact />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value, compact = false }: { icon: React.ReactNode, label: string, value: string, compact?: boolean }) {
  return (
    <div className={`flex items-start gap-4 ${compact ? 'items-center' : ''}`}>
      <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 overflow-hidden">
        {!compact && <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>}
        <p className={`${compact ? 'text-xs' : 'text-sm'} font-black text-slate-700 truncate`}>{value}</p>
      </div>
    </div>
  );
}
