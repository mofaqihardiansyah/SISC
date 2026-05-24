'use client';

import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { StatusBadge } from '@/components/ui/status-badge';

type Paper = {
  id: number;
  judul: string;
  status: 'review' | 'accepted' | 'rejected' | null;
  komentarPenolakan?: string | null;
  dibuatPada: Date | null;
  eventJudul: string;
};

interface SubmissionTimelineProps {
  papers: Paper[];
  onViewDetail: (paperId: number) => void;
}

function formatDate(date: Date | null) {
  if (!date) return '-';
  return format(new Date(date), 'd MMM yyyy', { locale: id });
}

export function SubmissionTimeline({ papers, onViewDetail }: SubmissionTimelineProps) {
  if (papers.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Riwayat Pengiriman Paper</h3>
        <span className="text-xs text-slate-400">{papers.length} paper</span>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200">
              <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-12">No</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Judul Paper</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conference</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Tanggal Submit</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {papers.map((paper, index) => {
              const status = paper.status || 'review';
              return (
                <React.Fragment key={paper.id}>
                  <tr className="hover:bg-slate-50/25 transition-colors">
                    <td className="px-4 py-2 text-xs text-slate-400 tabular-nums">{index + 1}</td>
                    <td className="px-4 py-2">
                      <span className="font-semibold text-slate-800 text-[13px] line-clamp-1">{paper.judul}</span>
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-500">{paper.eventJudul}</td>
                    <td className="px-4 py-2 text-center">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-4 py-2 text-right text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(paper.dibuatPada)}
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <button
                        onClick={() => onViewDetail(paper.id)}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-bold active:scale-[0.97] transition-all whitespace-nowrap"
                      >
                        Detail Paper
                      </button>
                    </td>
                  </tr>
                  {status === 'rejected' && paper.komentarPenolakan && (
                    <tr>
                      <td colSpan={6} className="px-4 py-2 bg-rose-50/10">
                        <div className="ml-8 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                          <p className="text-xs text-red-700">
                            <span className="font-semibold">Alasan penolakan:</span> {paper.komentarPenolakan}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {papers.map((paper) => {
          const status = paper.status || 'review';
          return (
            <div key={paper.id} className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-medium text-slate-900 leading-snug line-clamp-2">{paper.judul}</h4>
                <StatusBadge status={status} />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{paper.eventJudul}</span>
                <span className="whitespace-nowrap ml-2">{formatDate(paper.dibuatPada)}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] text-slate-400">ID: {paper.id}</span>
                <button
                  onClick={() => onViewDetail(paper.id)}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Detail Paper
                </button>
              </div>
              {status === 'rejected' && paper.komentarPenolakan && (
                <div className="bg-red-50 border border-red-100 rounded px-3 py-2 mt-1">
                  <p className="text-xs text-red-700">
                    <span className="font-semibold">Alasan penolakan:</span> {paper.komentarPenolakan}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}