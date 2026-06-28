'use client';

import React from 'react';
import { ChevronLeft, FileText, Download, CheckCircle2, AlertTriangle, XCircle, Eye } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { SubmittedPaper } from '@/actions/paper';

type SubmissionDetailProps = {
  paper: SubmittedPaper | undefined;
  onBack: () => void;
};

export function SubmissionDetail({ paper, onBack }: SubmissionDetailProps) {
  if (!paper) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
        <p className="text-slate-500">Data paper tidak ditemukan.</p>
        <button onClick={onBack} className="mt-4 text-sm text-slate-900 font-bold hover:underline flex items-center gap-1 mx-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <ChevronLeft size={16} /> Kembali
        </button>
      </div>
    );
  }

  const status = paper.status || 'review';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full pb-12">
      {/* Back Header Nav */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <ChevronLeft size={14} /> Kembali ke Daftar Paper
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        {/* LEFT COLUMN: DOMINANT DATA SECTION (Span 2) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header Title with optimized Status position & size */}
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">CONFERENCE PAPER</span>
                <h2 className="text-base font-extrabold text-slate-900 line-clamp-1" title={paper.eventJudul}>
                  {paper.eventJudul}
                </h2>
              </div>
              <div className="shrink-0 scale-95 origin-right">
                <StatusBadge status={status} />
              </div>
            </div>

            {/* Track & Keywords */}
            {(paper.track || paper.kataKunci) && (
              <div className="grid grid-cols-2 gap-4">
                {paper.track && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Track / Topik
                    </h4>
                    <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {paper.track}
                    </p>
                  </div>
                )}
                {paper.kataKunci && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Kata Kunci
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {paper.kataKunci.split(',').map((k, i) => (
                        <span key={i} className="bg-primary/10 text-primary px-2 py-1 rounded text-micro font-bold">
                          {k.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Judul Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Judul Penelitian
              </h4>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {paper.judul}
              </p>
            </div>

            {/* Abstrak Section */}
            {paper.abstrak && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Abstrak
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
                  {paper.abstrak}
                </p>
              </div>
            )}

            {/* Penulis Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Daftar Penulis
              </h4>
              <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                {paper.penulis && Array.isArray(paper.penulis) ? paper.penulis.map((author, idx) => (
                  <div key={idx} className="flex flex-col bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{author.nama}</span>
                      {author.isCorresponding && (
                        <span className="bg-amber-100 text-amber-800 text-nano font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider">
                          Penulis Utama
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col text-micro text-slate-500 mt-1">
                      <span>{author.email}</span>
                      <span>{author.afiliasi}</span>
                    </div>
                  </div>
                )) : null}
              </div>
            </div>

            {/* Compact Feedback Section */}
            {status === 'review' && (
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3.5 flex gap-2.5">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-normal font-medium">
                  Paper sedang ditinjau oleh komite reviewer. Silakan pantau halaman ini secara berkala.
                </p>
              </div>
            )}

            {status === 'accepted' && (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 flex gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-800 leading-normal font-medium">
                  Paper Anda diterima untuk dipublikasikan pada conference ini. Panitia akan segera menghubungi Anda.
                </p>
              </div>
            )}

            {status === 'rejected' && (
              <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3.5 flex flex-col gap-2">
                <div className="flex gap-2.5">
                  <XCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-800 leading-normal font-bold">
                    Paper memerlukan revisi / ditolak.
                  </p>
                </div>
                {paper.komentarPenolakan && (
                  <div className="text-xs bg-white border border-rose-100 p-2.5 rounded-lg text-rose-700 font-medium leading-relaxed">
                    <span className="font-bold">Ulasan Reviewer:</span> {paper.komentarPenolakan}
                  </div>
                )}
              </div>
            )}

            {/* Timeline Section */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h4 className="text-xxs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Riwayat & Aktivitas Paper
              </h4>
              
              <div className="relative pl-6 border-l-2 border-slate-100 space-y-5 ml-1">
                {/* Step 1: Submission */}
                <div className="relative">
                  <div className="absolute -left-[29px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Paper Berhasil Dikirim</p>
                    <p className="text-xxs text-slate-400 mt-0.5">
                      {paper.dibuatPada ? format(new Date(paper.dibuatPada), 'd MMMM yyyy, HH:mm', { locale: id }) : '-'}
                    </p>
                  </div>
                </div>

                {/* Step 2: Under Review */}
                <div className="relative">
                  <div className={`absolute -left-[29px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                    status !== 'review' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                  }`} />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Proses Review Akademik</p>
                    <p className="text-xxs text-slate-500 mt-0.5">
                      {status !== 'review' ? 'Review selesai' : 'Reviewer sedang meninjau dokumen'}
                    </p>
                  </div>
                </div>

                {/* Step 3: Final Decision */}
                <div className="relative">
                  <div className={`absolute -left-[29px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                    status === 'accepted' ? 'bg-emerald-500' : status === 'rejected' ? 'bg-rose-500' : 'bg-slate-200'
                  }`} />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Keputusan Penyelenggara</p>
                    <p className="text-xxs text-slate-500 mt-0.5">
                      {status === 'accepted' ? 'Paper Diterima' : status === 'rejected' ? 'Revisi Diperlukan' : 'Menunggu keputusan'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row - Clean & Non-Redundant Download option */}
          <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <FileText size={16} className="text-slate-400" />
              <span className="font-medium truncate max-w-36" title={paper.judul}>Dokumen Paper (PDF)</span>
            </div>
            <a
              href={paper.urlFile}
              download
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-bold transition-colors"
            >
              Unduh Berkas
              <Download size={14} />
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: EXCLUSIVELY DEDICATED PDF VIEWER (Span 3) */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full min-h-[650px] lg:min-h-[700px]">
            {/* Viewer Toolbar Header */}
            <div className="bg-slate-50/75 border-b border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-slate-500" />
                <h3 className="text-xs font-bold text-slate-800">Pratinjau Langsung Paper</h3>
              </div>
              <span className="px-2 py-0.5 text-nano font-extrabold tracking-wider rounded-md border bg-red-50 text-red-700 border-red-200 uppercase">
                PDF FILE
              </span>
            </div>

            {/* Viewer IFrame Body */}
            <div className="flex-1 bg-slate-100 relative w-full h-full">
              <iframe
                src={`${paper.urlFile}#toolbar=0&navpanes=0`}
                className="absolute inset-0 w-full h-full border-none"
                title="PDF Document Viewer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}