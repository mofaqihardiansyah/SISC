'use client';

import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Building2, Clock, CheckCircle, AlertCircle, ChevronRight, Search } from 'lucide-react';

type EventWithStatus = {
  id: number;
  judul: string;
  penyelenggara: string | null;
  tanggalMulai: Date;
  submissionStatus: string;
};

type EventListProps = {
  events: EventWithStatus[];
  onStartSubmit: (eventId: number) => void;
};

export function EventList({ events, onStartSubmit }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white border border-slate-200/60 rounded-[3rem] p-32 text-center shadow-sm">
        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-inner">
          <Search className="text-slate-300" size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Data Tidak Ditemukan</h3>
        <p className="text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
          Kami tidak dapat menemukan conference yang sesuai dengan filter atau pencarian Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div 
          key={event.id} 
          className="bg-white border border-slate-200/60 hover:border-[#0E215D]/20 rounded-[2.5rem] p-5 lg:p-8 transition-all duration-300 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 group relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
            {/* Info Column */}
            <div className="lg:col-span-5 flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#0E215D] group-hover:rotate-6 transition-all duration-500 shadow-inner">
                <Building2 className="text-slate-400 group-hover:text-white transition-colors" size={28} />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-blue-100/50">Conference</span>
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
                    <Clock size={12} className="text-slate-300" /> 
                    {format(new Date(event.tanggalMulai), 'dd MMM yyyy', { locale: id })}
                  </span>
                </div>
                <h4 className="font-black text-slate-900 group-hover:text-[#0E215D] transition-colors truncate text-lg leading-tight">{event.judul}</h4>
              </div>
            </div>

            {/* Penyelenggara */}
            <div className="hidden lg:flex lg:col-span-3 items-center justify-center">
              <div className="text-center bg-slate-50/50 px-6 py-3 rounded-2xl border border-slate-100 w-full group-hover:bg-white transition-colors">
                <p className="text-sm font-black text-slate-700 truncate">{event.penyelenggara || 'Institusi Polines'}</p>
                <p className="text-[10px] text-[#0E215D] font-bold mt-0.5 opacity-60">Penyelenggara Utama</p>
              </div>
            </div>

            {/* Status */}
            <div className="lg:col-span-2 flex justify-center">
              {event.submissionStatus === 'belum_submit' ? (
                <div className="px-5 py-2.5 bg-slate-50 text-slate-400 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-slate-100 shadow-sm">Belum Ada Paper</div>
              ) : event.submissionStatus === 'review' ? (
                <div className="px-5 py-2.5 bg-blue-50 text-[#0E215D] rounded-2xl text-[9px] font-black uppercase tracking-widest border border-blue-200/50 flex items-center gap-2 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-[#0E215D] rounded-full animate-ping"></span> Sedang Review
                </div>
              ) : event.submissionStatus === 'accepted' ? (
                <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-emerald-200/50 flex items-center gap-2 shadow-sm">
                  <CheckCircle size={14} strokeWidth={3} /> Diterima
                </div>
              ) : (
                <div className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-rose-200/50 flex items-center gap-2 shadow-sm">
                  <AlertCircle size={14} strokeWidth={3} /> Ditolak
                </div>
              )}
            </div>

            {/* Action */}
            <div className="lg:col-span-2 flex justify-end">
              {event.submissionStatus === 'belum_submit' || event.submissionStatus === 'rejected' ? (
                <button 
                  onClick={() => onStartSubmit(event.id)}
                  className="w-full lg:w-auto px-10 py-4 bg-[#0E215D] text-white rounded-[1.25rem] text-[10px] font-black tracking-widest uppercase transition-all shadow-xl shadow-[#0E215D]/20 active:scale-95 flex items-center justify-center gap-2 hover:bg-[#1a3280] hover:shadow-2xl hover:shadow-[#0E215D]/30"
                >
                  {event.submissionStatus === 'rejected' ? 'Submit Ulang' : 'Submit Sekarang'} <ChevronRight size={14} strokeWidth={3} />
                </button>
              ) : (
                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50/50 px-8 py-4 rounded-[1.25rem] border border-emerald-100 cursor-default shadow-sm">
                  <CheckCircle size={14} strokeWidth={3} /> Terkirim
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}