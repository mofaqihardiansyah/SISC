'use client';

import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { StatusBadge } from '@/components/ui/status-badge';

type EventWithStatus = {
  id: number;
  judul: string;
  penyelenggara: string | null;
  tanggalMulai: Date;
  submissionStatus: string;
  rejectionReason?: string | null;
};

type EventListProps = {
  events: EventWithStatus[];
  onStartSubmit: (eventId: number) => void;
  onViewDetail: (eventId: number) => void;
};

function ActionButton({ status, onClick, onViewDetail }: { status: string; onClick: () => void; onViewDetail: () => void }) {
  if (status === 'belum_submit' || status === 'rejected') {
    return (
      <button
        onClick={onClick}
        className="px-2.5 py-1 bg-primary hover:bg-primary/95 text-white rounded text-[10px] font-bold active:scale-[0.97] transition-all whitespace-nowrap shadow-sm"
      >
        {status === 'rejected' ? 'Submit Ulang' : 'Submit Paper'}
      </button>
    );
  }
  return (
    <button
      onClick={onViewDetail}
      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-bold active:scale-[0.97] transition-all whitespace-nowrap"
    >
      Detail Paper
    </button>
  );
}

export function EventList({ events, onStartSubmit, onViewDetail }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-center shadow-sm">
        <p className="text-sm text-slate-500 mb-1">Tidak ada conference ditemukan.</p>
        <p className="text-xs text-slate-400">
          Pastikan Anda sudah mendaftar ke event conference melalui halaman registrasi event.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200">
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-12">No</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Conference</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Penyelenggara</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Mulai</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status Paper</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((event, index) => (
              <React.Fragment key={event.id}>
                <tr className="hover:bg-slate-50/25 transition-colors">
                  <td className="px-6 py-3.5 text-xs text-slate-400 tabular-nums">{index + 1}</td>
                  <td className="px-6 py-3.5">
                    <span className="font-semibold text-slate-800 text-[13px]">{event.judul}</span>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-slate-500">{event.penyelenggara || '-'}</td>
                  <td className="px-6 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                    {format(new Date(event.tanggalMulai), 'd MMMM yyyy', { locale: id })}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <StatusBadge status={event.submissionStatus} />
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <ActionButton status={event.submissionStatus} onClick={() => onStartSubmit(event.id)} onViewDetail={() => onViewDetail(event.id)} />
                  </td>
                </tr>
                {event.submissionStatus === 'rejected' && event.rejectionReason && (
                  <tr className="bg-rose-50/20">
                    <td colSpan={6} className="px-6 py-3">
                      <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 rounded-lg p-3 animate-in slide-in-from-top-1 duration-300">
                        <div className="mt-0.5 shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-rose-800 uppercase tracking-tight">Alasan Penolakan / Revisi:</p>
                          <p className="text-xs text-rose-700 leading-relaxed font-medium">{event.rejectionReason}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {events.map((event) => (
          <div key={event.id} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-medium text-slate-900 leading-snug">{event.judul}</h3>
              <StatusBadge status={event.submissionStatus} />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{event.penyelenggara || '-'}</span>
              <span>{format(new Date(event.tanggalMulai), 'd MMM yyyy', { locale: id })}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <ActionButton status={event.submissionStatus} onClick={() => onStartSubmit(event.id)} onViewDetail={() => onViewDetail(event.id)} />
            </div>
            {event.submissionStatus === 'rejected' && event.rejectionReason && (
              <div className="mt-3 bg-rose-50 border border-rose-100 rounded-lg p-2.5">
                <p className="text-[10px] font-bold text-rose-800 uppercase tracking-tight mb-1">Alasan Penolakan:</p>
                <p className="text-xs text-rose-700 leading-relaxed font-medium">{event.rejectionReason}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}