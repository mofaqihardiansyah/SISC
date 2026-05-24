'use client';

import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Trophy, Clock, CheckCircle, AlertCircle, ChevronRight, Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <div className="bg-white border border-slate-200 rounded-2xl p-20 text-center shadow-sm">
        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
          <Search className="text-slate-300" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Tidak ada conference ditemukan</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">
          Coba ubah kata kunci pencarian atau filter status untuk melihat data lainnya.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">No</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Conference Info</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organizer</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((event, index) => (
              <tr key={event.id} className="group hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-xs font-mono text-slate-400">{(index + 1).toString().padStart(2, '0')}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors truncate max-w-md">
                      {event.judul}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Academic Conference</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                      <Trophy size={12} className="text-slate-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-600 truncate max-w-[150px]">
                      {event.penyelenggara || 'Polines'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                    {format(new Date(event.tanggalMulai), 'dd/MM/yyyy')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    {event.submissionStatus === 'belum_submit' ? (
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-wider border border-slate-200/50">
                        Available
                      </span>
                    ) : event.submissionStatus === 'review' ? (
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-blue-200/50">
                        Review
                      </span>
                    ) : event.submissionStatus === 'accepted' ? (
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1 border border-emerald-200/50">
                        Accepted
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1 border border-rose-200/50">
                        Rejected
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {event.submissionStatus === 'belum_submit' || event.submissionStatus === 'rejected' ? (
                    <button 
                      onClick={() => onStartSubmit(event.id)}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded text-[10px] font-black tracking-widest uppercase transition-all hover:bg-primary active:scale-95 shadow-sm"
                    >
                      {event.submissionStatus === 'rejected' ? 'Retry' : 'Submit'}
                    </button>
                  ) : (
                    <span className="text-emerald-500 font-black text-[9px] uppercase tracking-widest">
                      Sent
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}