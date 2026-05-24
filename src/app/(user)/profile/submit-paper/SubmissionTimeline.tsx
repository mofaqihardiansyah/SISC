'use client';

import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CheckCircle2, Clock, XCircle, FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Paper = {
  id: number;
  judul: string;
  status: 'review' | 'accepted' | 'rejected' | null;
  dibuatPada: Date | null;
  eventJudul: string;
};

interface SubmissionTimelineProps {
  papers: Paper[];
}

export function SubmissionTimeline({ papers }: SubmissionTimelineProps) {
  if (papers.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Riwayat Pengiriman</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">{papers.length} Total</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted Paper Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Progress</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {papers.map((paper) => {
                const status = paper.status || 'review';
                
                return (
                  <tr key={paper.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors truncate max-w-md">
                          {paper.judul}
                        </span>
                        <div className="flex items-center gap-2">
                          <FileText size={10} className="text-slate-400" />
                          <span className="text-[10px] text-slate-500 font-bold truncate max-w-[250px]">{paper.eventJudul}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {status === 'accepted' ? <CheckCircle2 size={12} className="text-emerald-500" /> :
                         status === 'rejected' ? <XCircle size={12} className="text-rose-500" /> :
                         <Clock size={12} className="text-blue-500 animate-pulse" />}
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          status === 'accepted' ? "text-emerald-600" :
                          status === 'rejected' ? "text-rose-600" :
                          "text-blue-600"
                        )}>
                          {status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {[1, 2, 3].map((step) => {
                          let isDone = false;
                          let isSpecial = false;
                          let isCurrent = false;

                          if (step === 1) isDone = true;
                          else if (step === 2) {
                            if (status === 'accepted' || status === 'rejected') isDone = true;
                            if (status === 'review') isCurrent = true;
                          } else if (step === 3) {
                            if (status === 'accepted') isDone = true;
                            if (status === 'rejected') { isDone = true; isSpecial = true; }
                          }

                          return (
                            <div 
                              key={step}
                              className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all",
                                isCurrent ? "bg-blue-500 ring-2 ring-blue-100" :
                                isDone ? (isSpecial ? "bg-rose-500" : "bg-emerald-500") : 
                                "bg-slate-200"
                              )} 
                            />
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {paper.dibuatPada ? format(new Date(paper.dibuatPada), 'dd/MM/yy') : '-'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}