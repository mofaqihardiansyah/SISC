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
};

type EventListProps = {
  events: EventWithStatus[];
  onStartSubmit: (eventId: number) => void;
};

function ActionButton({ status, onClick }: { status: string; onClick: () => void }) {
  if (status === 'belum_submit' || status === 'rejected') {
    return (
      <button
        onClick={onClick}
        className="px-3.5 py-1.5 bg-primary text-white rounded text-xs font-medium hover:bg-primary/90 active:scale-[0.97] transition-all"
      >
        {status === 'rejected' ? 'Submit Ulang' : 'Submit Paper'}
      </button>
    );
  }
  if (status === 'review') {
    return <span className="text-xs text-slate-400">Menunggu review</span>;
  }
  return <span className="text-xs text-emerald-600 font-medium">Sudah diterima</span>;
}

export function EventList({ events, onStartSubmit }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
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
      <div className="hidden md:block bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 w-12">No</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500">Nama Conference</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500">Penyelenggara</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500">Tanggal Mulai</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 text-center">Status Paper</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((event, index) => (
              <tr key={event.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-xs text-slate-400 tabular-nums">{index + 1}</td>
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900 text-sm">{event.judul}</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{event.penyelenggara || '-'}</td>
                <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                  {format(new Date(event.tanggalMulai), 'd MMMM yyyy', { locale: id })}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={event.submissionStatus} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ActionButton status={event.submissionStatus} onClick={() => onStartSubmit(event.id)} />
                </td>
              </tr>
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
              <ActionButton status={event.submissionStatus} onClick={() => onStartSubmit(event.id)} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}