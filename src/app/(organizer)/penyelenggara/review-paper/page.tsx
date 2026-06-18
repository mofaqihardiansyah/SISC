"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  BookText,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getOrganizerPapers, updatePaperStatus } from "./actions";
import type { PaperData, EventData } from "./actions";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
export const dynamic = 'force-dynamic';


const STATUS_CFG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  review: { label: "Sedang Direview", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  accepted: { label: "Diterima", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  rejected: { label: "Ditolak", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

function StatusBadge({ status }: { status: string | null }) {
  const cfg = STATUS_CFG[status || "review"] || STATUS_CFG.review;
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xxs font-bold rounded-md border tracking-wide whitespace-nowrap ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {cfg.label}
    </span>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-indigo-600", "bg-sky-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500", "bg-violet-500", "bg-pink-500",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function ReviewPaperPage() {
  const [papers, setPapers] = useState<PaperData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  // Detail modal
  const [selectedPaper, setSelectedPaper] = useState<PaperData | null>(null);

  // Action state
  const [actionLoading, setActionLoading] = useState<{ id: number; type: string } | null>(null);

  // Reject modal
  const [rejectPaper, setRejectPaper] = useState<PaperData | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Notification
  const [notif, setNotif] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotif = (type: "success" | "error", message: string) => {
    setNotif({ type, message });
    setTimeout(() => setNotif(null), 4000);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await getOrganizerPapers();
        setPapers(result.data);
        setEvents(result.events);
      } catch { setEvents([]); setPapers([]); }
      setLoading(false);
    })();
  }, []);

  // Filter logic
  const filteredPapers = useMemo(() => {
    let result = [...papers];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.judul.toLowerCase().includes(q) || (Array.isArray(p.penulis) && p.penulis.some(a => a.nama.toLowerCase().includes(q)))
      );
    }
    if (eventFilter !== "all") result = result.filter(p => p.eventId === eventFilter);
    if (statusFilter !== "all") result = result.filter(p => (p.status || "review") === statusFilter);
    return result;
  }, [papers, searchQuery, eventFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = papers.length;
    const review = papers.filter(p => (p.status || "review") === "review").length;
    const accepted = papers.filter(p => p.status === "accepted").length;
    const rejected = papers.filter(p => p.status === "rejected").length;
    return { total, review, accepted, rejected };
  }, [papers]);

  // Pagination
  const totalPages = Math.ceil(filteredPapers.length / PER_PAGE);
  const paginatedPapers = filteredPapers.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => { setPage(1); }, [searchQuery, eventFilter, statusFilter]);

  // Actions
  const handleAccept = async (paper: PaperData) => {
    if (!confirm(`Terima paper "${paper.judul}"?`)) return;
    setActionLoading({ id: paper.id, type: "accept" });
    try {
      await updatePaperStatus(paper.id, "accepted");
      showNotif("success", `Paper "${paper.judul}" berhasil diterima`);
      setPapers(prev => prev.map(p => p.id === paper.id ? { ...p, status: "accepted", komentarPenolakan: null } : p));
      setSelectedPaper(null);
    } catch (err: unknown) {
      showNotif("error", err instanceof Error ? err.message : "Gagal menerima paper");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectPaper) return;
    if (!rejectReason.trim()) { showNotif("error", "Harap isi alasan penolakan"); return; }
    setActionLoading({ id: rejectPaper.id, type: "reject" });
    try {
      await updatePaperStatus(rejectPaper.id, "rejected", rejectReason.trim());
      showNotif("success", `Paper "${rejectPaper.judul}" ditolak`);
      setPapers(prev => prev.map(p => p.id === rejectPaper.id ? { ...p, status: "rejected", komentarPenolakan: rejectReason.trim() } : p));
      setRejectPaper(null);
      setSelectedPaper(null);
    } catch (err: unknown) {
      showNotif("error", err instanceof Error ? err.message : "Gagal menolak paper");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return format(new Date(date), "d MMM yyyy, HH:mm", { locale: id });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Notification */}
      {notif && (
        <div
          className={`fixed top-4 right-4 z-[9999] px-5 py-3 rounded-xl shadow-lg border text-sm font-bold flex items-center gap-3 animate-in slide-in-from-right-2 duration-300 ${
            notif.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {notif.type === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {notif.message}
        </div>
      )}

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Review Paper</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola dan review paper yang disubmit ke event anda</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-micro font-bold text-slate-400 uppercase tracking-wider">Total Paper</p>
          <p className="text-2xl font-bold text-sisc-slate mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
          <p className="text-micro font-bold text-amber-500 uppercase tracking-wider">Perlu Direview</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.review}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
          <p className="text-micro font-bold text-emerald-500 uppercase tracking-wider">Diterima</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.accepted}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
          <p className="text-micro font-bold text-rose-500 uppercase tracking-wider">Ditolak</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{stats.rejected}</p>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <Input
              type="text"
              placeholder="Cari judul atau penulis paper..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none text-sm focus:border-blue-400"
            />
          </div>
          <select
            value={eventFilter === "all" ? "all" : eventFilter}
            onChange={(e) => setEventFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="px-4 py-2.5 border border-slate-200 rounded-xl outline-none text-sm bg-white text-slate-600 cursor-pointer min-w-44"
          >
            <option value="all">Semua Event</option>
            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.judul}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl outline-none text-sm bg-white text-slate-600 cursor-pointer min-w-40"
          >
            <option value="all">Semua Status</option>
            <option value="review">Perlu Direview</option>
            <option value="accepted">Diterima</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
      </div>

      {/* PAPER LIST */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {papers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-4">
              <BookText size={28} />
            </div>
            <h4 className="font-bold text-sisc-slate text-base mb-1">
              {events.length === 0 ? "Belum Ada Event" : "Belum Ada Paper"}
            </h4>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              {events.length === 0
                ? "Buat event conference terlebih dahulu untuk mulai menerima submission paper."
                : "Belum ada paper yang disubmit ke event anda."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-5 py-3.5 text-xxs font-bold text-slate-400 uppercase tracking-wider text-center w-12">No</th>
                    <th className="px-5 py-3.5 text-xxs font-bold text-slate-400 uppercase tracking-wider">Judul Paper</th>
                    <th className="px-5 py-3.5 text-xxs font-bold text-slate-400 uppercase tracking-wider">Penulis</th>
                    <th className="px-5 py-3.5 text-xxs font-bold text-slate-400 uppercase tracking-wider">Event</th>
                    <th className="px-5 py-3.5 text-xxs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                    <th className="px-5 py-3.5 text-xxs font-bold text-slate-400 uppercase tracking-wider text-right">Tanggal Submit</th>
                    <th className="px-5 py-3.5 text-xxs font-bold text-slate-400 uppercase tracking-wider text-right w-44">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedPapers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm italic">
                        Tidak ada paper yang sesuai dengan filter.
                      </td>
                    </tr>
                  ) : (
                    paginatedPapers.map((paper, index) => {
                      const status = paper.status || "review";
                      const isActionLoading = actionLoading?.id === paper.id;
                      return (
                        <tr key={paper.id} className="hover:bg-slate-50/60 transition-colors cursor-pointer" onClick={() => setSelectedPaper(paper)}>
                          <td className="px-5 py-4 text-center">
                            <span className="text-xs font-semibold text-slate-400">{(page - 1) * PER_PAGE + index + 1}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-semibold text-slate-800 text-sm2 line-clamp-1">{paper.judul}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs text-slate-500 line-clamp-1">{Array.isArray(paper.penulis) ? paper.penulis.map(a => a.nama).join(', ') : ''}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs text-slate-500">{paper.eventJudul || "-"}</span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <StatusBadge status={status} />
                          </td>
                          <td className="px-5 py-4 text-right text-xs text-slate-500 whitespace-nowrap">
                            {formatDate(paper.dibuatPada)}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                              {status === "review" ? (
                                <>
                                  <Button
                                    onClick={() => handleAccept(paper)}
                                    disabled={!!isActionLoading}
                                    variant="success"
                                    size="icon"
                                    aria-label="Terima Paper"
                                  >
                                    <ThumbsUp size={14} />
                                  </Button>
                                  <Button
                                    onClick={() => { setRejectPaper(paper); setRejectReason(""); }}
                                    disabled={!!isActionLoading}
                                    variant="destructive"
                                    size="icon"
                                    aria-label="Tolak Paper"
                                  >
                                    <ThumbsDown size={14} />
                                  </Button>
                                </>
                              ) : (
                                <span className={`text-xxs font-bold px-2.5 py-1 rounded-md border ${
                                  status === "accepted"
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                    : "bg-rose-50 text-rose-600 border-rose-200"
                                }`}>
                                  {status === "accepted" ? "Diterima" : "Ditolak"}
                                </span>
                              )}
                              <Button
                                onClick={() => setSelectedPaper(paper)}
                                variant="ghost"
                                size="icon"
                                aria-label="Detail Paper"
                              >
                                <Eye size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3 p-4">
              {paginatedPapers.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm italic">Tidak ada paper yang sesuai dengan filter.</div>
              ) : (
                paginatedPapers.map(paper => {
                  const status = paper.status || "review";
                  return (
                    <div key={paper.id} className="bg-white border border-slate-100 rounded-xl p-4 space-y-3 shadow-sm cursor-pointer hover:border-blue-200 transition-all" onClick={() => setSelectedPaper(paper)}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-800 text-sm line-clamp-2">{paper.judul}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{Array.isArray(paper.penulis) ? paper.penulis.map(a => a.nama).join(', ') : ''}</p>
                        </div>
                        <StatusBadge status={status} />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{paper.eventJudul}</span>
                        <span>{formatDate(paper.dibuatPada)}</span>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50" onClick={(e) => e.stopPropagation()}>
                        {status === "review" && (
                          <>
                            <Button onClick={() => handleAccept(paper)} disabled={actionLoading?.id === paper.id}
                              variant="success" size="sm">Terima</Button>
                            <Button onClick={() => { setRejectPaper(paper); setRejectReason(""); }} disabled={actionLoading?.id === paper.id}
                              variant="destructive" size="sm">Tolak</Button>
                          </>
                        )}
                        <Button onClick={() => setSelectedPaper(paper)}
                          variant="ghost" size="sm">Detail</Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Pagination */}
        {filteredPapers.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 flex-wrap gap-2">
            <p className="text-xs text-slate-400">
              Menampilkan {(page - 1) * PER_PAGE + 1} - {Math.min(page * PER_PAGE, filteredPapers.length)} dari {filteredPapers.length} paper
            </p>
            <div className="flex items-center gap-1">
              <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                variant="ghost" size="icon" aria-label="Halaman sebelumnya">
                <ChevronLeft size={13} />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                <Button key={pg} onClick={() => setPage(pg)}
                  variant={page === pg ? "default" : "outline"}
                  size="icon-xs"
                  className={page === pg ? "" : "border-slate-200"}
                >{pg}</Button>
              ))}
              <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                variant="ghost" size="icon" aria-label="Halaman selanjutnya">
                <ChevronRight size={13} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL (slide-in) */}
      {selectedPaper && (
        <Modal
          open={!!selectedPaper}
          onClose={() => setSelectedPaper(null)}
          variant="side"
          className="max-w-5xl"
          title="Detail Paper"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-slate-400">Review dan kelola submission paper</p>
            <StatusBadge status={selectedPaper.status} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 h-full">
            {/* LEFT: Info */}
            <div className="lg:col-span-2 space-y-6 border-r border-slate-100 pr-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1">Event</p>
                <p className="font-bold text-slate-800 text-sm">{selectedPaper.eventJudul || "-"}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookText size={12} /> Judul Penelitian
                </p>
                <p className="text-sm font-semibold text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedPaper.judul}
                </p>
              </div>
              {(selectedPaper.track || selectedPaper.kataKunci) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedPaper.track && (
                    <div className="space-y-1.5">
                      <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        Track / Topik
                      </p>
                      <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {selectedPaper.track}
                      </p>
                    </div>
                  )}
                  {selectedPaper.kataKunci && (
                    <div className="space-y-1.5">
                      <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        Kata Kunci
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPaper.kataKunci.split(',').map((k, i) => (
                          <span key={i} className="bg-slate-800 text-white px-2 py-1 rounded text-micro font-bold">
                            {k.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-1.5">
                <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={12} /> Daftar Penulis
                </p>
                <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {Array.isArray(selectedPaper.penulis) ? selectedPaper.penulis.map((author, idx) => (
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
              <div className="space-y-1.5">
                <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={12} /> Disubmit Oleh
                </p>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className={`w-9 h-9 rounded-full ${getAvatarColor(selectedPaper.userNama || "")} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {getInitials(selectedPaper.userNama || "?")}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{selectedPaper.userNama || "-"}</p>
                    <p className="text-xs text-slate-400">{selectedPaper.userEmail || "-"}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={12} /> Tanggal Submit
                </p>
                <p className="text-sm font-medium text-slate-700">{formatDate(selectedPaper.dibuatPada)}</p>
              </div>

              {selectedPaper.status === "review" && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex gap-2.5">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 font-medium">Paper ini menunggu keputusan review dari anda.</p>
                </div>
              )}
              {selectedPaper.status === "accepted" && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-800 font-medium">Paper telah diterima dan akan dipublikasikan pada conference.</p>
                </div>
              )}
              {selectedPaper.status === "rejected" && selectedPaper.komentarPenolakan && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 space-y-2">
                  <div className="flex gap-2.5">
                    <XCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-800 font-bold">Paper ditolak dengan alasan:</p>
                  </div>
                  <div className="text-xs bg-white border border-rose-100 p-2.5 rounded-lg text-rose-700 font-medium leading-relaxed">
                    {selectedPaper.komentarPenolakan}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                <FileText size={16} className="text-slate-400 shrink-0" />
                <span className="text-xs text-slate-500 truncate">Dokumen Paper (PDF)</span>
                <a href={selectedPaper.urlFile} download
                  className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  <Download size={13} /> Unduh
                </a>
              </div>
            </div>

            {/* RIGHT: PDF + Actions */}
            <div className="lg:col-span-3 flex flex-col h-full">
              <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px] lg:min-h-0">
                <div className="bg-slate-50/75 border-b border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-slate-500" />
                    <h3 className="text-xs font-bold text-slate-800">Pratinjau Langsung Paper</h3>
                  </div>
                  <span className="px-2 py-0.5 text-nano font-extrabold tracking-wider rounded-md border bg-red-50 text-red-700 border-red-200 uppercase">PDF FILE</span>
                </div>
                <div className="flex-1 bg-slate-100 relative w-full">
                  <iframe src={`${selectedPaper.urlFile}#toolbar=0&navpanes=0`} className="absolute inset-0 w-full h-full border-none" title="PDF Document Viewer" />
                </div>
              </div>

              <div className="bg-white border-t border-slate-200 px-6 py-4 shrink-0">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-slate-400">
                    {selectedPaper.status === "review" ? "Tentukan keputusan untuk paper ini" :
                     selectedPaper.status === "accepted" ? "Paper telah diterima" : "Paper telah ditolak"}
                  </p>
                  <div className="flex items-center gap-3">
                    {selectedPaper.status === "review" && (
                      <>
                        <Button
                          onClick={() => { setSelectedPaper(null); setRejectPaper(selectedPaper); setRejectReason(""); }}
                          disabled={actionLoading?.id === selectedPaper.id}
                          variant="destructive"
                          loading={actionLoading?.id === selectedPaper.id && actionLoading.type === "reject"}
                        >
                          <ThumbsDown size={14} />
                          Tolak
                        </Button>
                        <Button
                          onClick={() => handleAccept(selectedPaper)}
                          disabled={actionLoading?.id === selectedPaper.id}
                          variant="success"
                          loading={actionLoading?.id === selectedPaper.id && actionLoading.type === "accept"}
                        >
                          <ThumbsUp size={14} />
                          Terima Paper
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* REJECT MODAL */}
      <Modal
        open={!!rejectPaper}
        onClose={() => setRejectPaper(null)}
        title="Tolak Paper"
      >
        <p className="text-xs text-slate-400 mb-4">
          Berikan alasan penolakan untuk paper <span className="font-bold text-slate-600">&ldquo;{rejectPaper?.judul}&rdquo;</span>
        </p>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Alasan Penolakan</label>
          <textarea rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Jelaskan alasan penolakan atau revisi yang diperlukan..."
            className="w-full border border-slate-200 rounded-xl p-3.5 outline-none text-sm resize-none focus:border-rose-400 transition-colors" />
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button onClick={() => setRejectPaper(null)}
            variant="outline"
            disabled={!!actionLoading}>Batal</Button>
          <Button onClick={handleReject} disabled={actionLoading?.id === rejectPaper?.id || !rejectReason.trim()}
            variant="destructive"
            loading={actionLoading?.id === rejectPaper?.id}>
            <XCircle size={14} />
            Tolak Paper
          </Button>
        </div>
      </Modal>
    </div>
  );
}