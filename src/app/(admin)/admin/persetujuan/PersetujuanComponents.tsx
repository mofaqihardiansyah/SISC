"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  FileCheck, CheckCircle, X, Eye, MoreVertical, Check, XCircle,
  ChevronLeft, ChevronRight, Search, ChevronDown, Calendar, MapPin,
  Clock, Tag, Monitor, Users as UsersIcon, Wallet, Building2, Phone,
  Mail, Globe, ClipboardList,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { searchEventTitles, approveEvent, rejectEvent } from "@/actions/persetujuan-event";
import type { PendingEvent } from "@/actions/persetujuan-event";
import {
  statusOptions, statusLabel, getPlatformColor, getStatusColor,
  formatDateDisplay, formatPlatform, DEBOUNCE_MS, SEARCH_MIN_LENGTH,
} from "@/constants/persetujuan";

/* ───────────── StatCards ───────────── */

export function StatCards({
  pendingCount, approvedCount, rejectedCount,
}: {
  pendingCount: number; approvedCount: number; rejectedCount: number;
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard label="Menunggu" value={pendingCount} icon={FileCheck} color="blue" />
      <StatCard label="Disetujui" value={approvedCount} icon={CheckCircle} color="yellow" />
      <StatCard label="Ditolak" value={rejectedCount} icon={X} color="red" />
    </section>
  );
}

/* ───────────── FilterBar ───────────── */

export function FilterBar({
  searchQuery, statusFilter, showStatusDropdown,
  onSearchChange, onClearSearch, onSelectSearchResult,
  onStatusSelect, onToggleStatusDropdown,
}: {
  searchQuery: string;
  statusFilter: string;
  showStatusDropdown: boolean;
  onSearchChange: (v: string) => void;
  onClearSearch: () => void;
  onSelectSearchResult: (judul: string) => void;
  onStatusSelect: (status: string) => void;
  onToggleStatusDropdown: () => void;
}) {
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [results, setResults] = useState<{ id: number; judul: string }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleInput = useCallback(
    (value: string) => {
      onSearchChange(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (value.trim().length < SEARCH_MIN_LENGTH) {
        setResults([]);
        setShowDropdown(false);
        return;
      }
      debounceRef.current = setTimeout(async () => {
        setSearching(true);
        const res = await searchEventTitles(value.trim());
        setSearching(false);
        if (res.success) {
          setResults(res.data);
          setShowDropdown(res.data.length > 0);
        }
      }, DEBOUNCE_MS);
    },
    [onSearchChange],
  );

  const handleSelect = (judul: string) => {
    onSelectSearchResult(judul);
    setShowDropdown(false);
    setResults([]);
  };

  return (
    <div className="flex items-center gap-3">
      <div ref={searchRef} className="relative">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg focus-within:border-blue-400 transition-colors">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari event..."
            value={searchQuery}
            onChange={(e) => handleInput(e.target.value)}
            className="w-48 text-xs font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          {searching && <LoadingSpinner className="w-3 h-3" />}
          {searchQuery && !searching && (
            <button onClick={onClearSearch}>
              <X size={14} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        {showDropdown && results.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelect(r.judul)}
                className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0"
              >
                {r.judul}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative" data-status-dropdown>
        <button
          onClick={onToggleStatusDropdown}
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
        >
          {statusOptions.find((o) => o.value === statusFilter)?.label || "Semua Status"}
          <ChevronDown size={14} className={`transition-transform ${showStatusDropdown ? "rotate-180" : ""}`} />
        </button>
        {showStatusDropdown && (
          <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onStatusSelect(opt.value)}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === opt.value ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-slate-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────── EventTable ───────────── */

export function EventTable({
  events, openDropdownId, onPreview, onToggleDropdown, onStatusChange,
}: {
  events: PendingEvent[];
  openDropdownId: number | null;
  onPreview: (e: PendingEvent) => void;
  onToggleDropdown: (id: number) => void;
  onStatusChange: (id: number, status: "pending" | "published" | "rejected") => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200/60">
          <tr>
            <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-left">ID</th>
            <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-left">Nama Event</th>
            <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-left">Kategori</th>
            <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-left">Platform</th>
            <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-right">Harga</th>
            <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-left">Tanggal Masuk</th>
            <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-left">Status</th>
            <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-slate-50/25 transition-colors">
              <td className="px-6 py-3.5">
                <span className="text-xs text-gray-400 font-mono">{event.id}</span>
              </td>
              <td className="px-6 py-3.5">
                <button onClick={() => onPreview(event)} className="text-left">
                  <span className="font-semibold text-gray-900 text-[13px] hover:text-slate-700 transition-colors">
                    {event.judul}
                  </span>
                </button>
              </td>
              <td className="px-6 py-3.5">
                <span className="text-xs text-gray-500">{event.kategori || "-"}</span>
              </td>
              <td className="px-6 py-3.5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider whitespace-nowrap ${getPlatformColor(event.platform)}`}>
                  {formatPlatform(event.platform)}
                </span>
              </td>
              <td className="px-6 py-3.5 text-right whitespace-nowrap">
                <span className="text-xs font-semibold text-gray-800 tabular-nums">{event.harga}</span>
              </td>
              <td className="px-6 py-3.5">
                <span className="text-xs text-gray-500">{event.tanggalMasuk}</span>
              </td>
              <td className="px-6 py-3.5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider whitespace-nowrap ${getStatusColor(event.status)}`}>
                  {statusLabel[event.status] || event.status}
                </span>
              </td>
              <td className="px-6 py-3.5">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onPreview(event)}
                    className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 flex items-center justify-center border border-slate-200/50 shadow-sm transition-all hover:scale-105 active:scale-95"
                    title="Preview Event"
                  >
                    <Eye size={16} />
                  </button>
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleDropdown(event.id); }}
                      className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200/50 shadow-sm transition-all hover:scale-105 active:scale-95"
                      title="Opsi Lainnya"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openDropdownId === event.id && (
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 overflow-hidden">
                        <div className="px-3 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                          Ubah Status
                        </div>
                        {event.status !== "published" && (
                          <button onClick={(e) => { e.stopPropagation(); onStatusChange(event.id, "published"); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <Check size={12} /> Setujui
                          </button>
                        )}
                        {event.status !== "pending" && (
                          <button onClick={(e) => { e.stopPropagation(); onStatusChange(event.id, "pending"); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors"
                          >
                            <XCircle size={12} /> Pending
                          </button>
                        )}
                        {event.status !== "rejected" && (
                          <button onClick={(e) => { e.stopPropagation(); onStatusChange(event.id, "rejected"); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <X size={12} /> Tolak
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ───────────── Pagination ───────────── */

function getPageButtons(currentPage: number, totalPages: number): (number | "...")[] {
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }
  return pages;
}

export function Pagination({
  currentPage, totalPages, showFrom, showTo, totalItems, onChange,
}: {
  currentPage: number; totalPages: number; showFrom: number; showTo: number; totalItems: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-slate-100 gap-3">
      <span className="text-xs text-slate-400 font-semibold">
        Menampilkan <span className="text-slate-700">{showFrom}</span> –{" "}
        <span className="text-slate-700">{showTo}</span> dari{" "}
        <span className="text-slate-700 font-bold">{totalItems}</span> event
      </span>
      <div className="flex gap-1 items-center">
        <button onClick={() => onChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {getPageButtons(currentPage, totalPages).map((p, i) =>
          p === "..." ? (
            <span key={`d${i}`} className="text-slate-400 px-1 text-xs">...</span>
          ) : (
            <button key={p} onClick={() => onChange(p as number)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-all shadow-sm ${
                currentPage === p
                  ? "border-slate-800 bg-slate-800 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ───────────── ReviewModal ───────────── */

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 bg-white rounded-lg flex items-center justify-center border border-slate-100 text-slate-900 shrink-0">
        {icon}
      </div>
      <span className="text-[10px] text-slate-400 font-semibold w-16 shrink-0">{label}</span>
      <span className="text-xs font-semibold text-slate-700 truncate">{value}</span>
    </div>
  );
}

export function ReviewModal({
  event, isOpen, onClose, onRefresh,
}: {
  event: PendingEvent | null; isOpen: boolean; onClose: () => void; onRefresh: () => void;
}) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<"approve" | "reject" | null>(null);

  if (!isOpen || !event) return null;

  const handleApprove = async () => {
    setActionLoading("approve");
    await approveEvent(event.id);
    setActionLoading(null);
    onRefresh();
    onClose();
  };

  const handleReject = async () => {
    setActionLoading("reject");
    await rejectEvent(event.id, rejectReason);
    setActionLoading(null);
    onRefresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-900 px-5 py-2.5 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">ID {event.id}</span>
              <span className="text-[9px] font-bold text-slate-500">•</span>
              {event.jenisEvent && (
                <><span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">{event.jenisEvent}</span><span className="text-[9px] font-bold text-slate-300">•</span></>
              )}
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">{formatPlatform(event.platform)}</span>
              <span className="text-[9px] font-bold text-slate-300">•</span>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${event.status === "pending" ? "text-amber-300" : event.status === "published" ? "text-emerald-300" : "text-rose-300"}`}>
                {statusLabel[event.status]}
              </span>
            </div>
            <h2 className="text-base font-bold text-white truncate">{event.judul}</h2>
            <p className="text-xs text-slate-300">oleh {event.penyelenggara || "-"}</p>
          </div>
          <button onClick={onClose} className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 ml-3">
            <X size={16} />
          </button>
        </div>

        {event.bannerUrl && (
          <div className="relative w-full">
            <img src={event.bannerUrl} alt={event.judul} className="w-full h-48 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-4 gap-1.5 mb-2.5">
            {[
              { label: "Kategori", value: event.kategori || "-" },
              { label: "Tanggal", value: formatDateDisplay(event.tanggalMulai) },
              { label: "Jam", value: `${event.jamMulai} - ${event.jamSelesai}` },
              { label: "Harga", value: event.harga },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-1.5 border border-slate-100">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                <p className="text-[11px] font-bold text-slate-800 truncate">{item.value}</p>
              </div>
            ))}
          </div>

          {event.status === "rejected" && event.alasanPenolakan && (
            <div className="mb-2">
              <h3 className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1">Alasan Penolakan</h3>
              <div className="bg-rose-50 rounded-xl p-2.5 border border-rose-200">
                <p className="text-xs text-rose-700 font-medium">{event.alasanPenolakan}</p>
              </div>
            </div>
          )}

          <div className="mb-2">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Deskripsi</h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-2.5 border border-slate-100 whitespace-pre-wrap">
              {event.deskripsi || "Tidak ada deskripsi."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <div className="space-y-1">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Waktu & Lokasi</h3>
              <InfoRow icon={<Calendar size={12} />} label="Mulai" value={formatDateDisplay(event.tanggalMulai)} />
              <InfoRow icon={<Calendar size={12} />} label="Selesai" value={formatDateDisplay(event.tanggalSelesai)} />
              <InfoRow icon={<Clock size={12} />} label="Jam" value={`${event.jamMulai} - ${event.jamSelesai}`} />
              <InfoRow icon={<Clock size={12} />} label="Batas Daftar" value={formatDateDisplay(event.batasRegistrasi)} />
              <InfoRow icon={<MapPin size={12} />} label="Lokasi" value={event.lokasi || "-"} />
            </div>
            <div className="space-y-1">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Detail Event</h3>
              <InfoRow icon={<Tag size={12} />} label="Kategori" value={event.kategori || "-"} />
              <InfoRow icon={<Monitor size={12} />} label="Platform" value={formatPlatform(event.platform)} />
              <InfoRow icon={<UsersIcon size={12} />} label="Kuota" value={event.kuota ? `${event.kuota.toLocaleString("id-ID")} orang` : "-"} />
              <InfoRow icon={<Wallet size={12} />} label="Harga" value={event.harga} />
              <InfoRow icon={<Globe size={12} />} label="Link" value={event.linkEksternal || "-"} />
            </div>
          </div>

          {event.pembicara && (
            <div className="mb-2">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pembicara</h3>
              <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {event.pembicara.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{event.pembicara}</p>
                  <p className="text-[11px] text-slate-500">{event.peranPembicara || "-"}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-2">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kontak Penyelenggara</h3>
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
              <InfoRow icon={<Building2 size={14} />} label="Penyelenggara" value={event.penyelenggara || "-"} />
              <InfoRow icon={<Mail size={14} />} label="Email" value={event.kontakEmail || "-"} />
              <InfoRow icon={<Phone size={14} />} label="Telepon" value={event.kontakTelepon || "-"} />
            </div>
          </div>

          {event.status === "pending" && !showRejectForm && (
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button onClick={handleApprove} disabled={actionLoading !== null}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm text-xs flex items-center justify-center gap-1.5"
              >
                {actionLoading === "approve" ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "✓ Setujui"}
              </button>
              <button onClick={() => setShowRejectForm(true)} disabled={actionLoading !== null}
                className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm text-xs flex items-center justify-center gap-1.5"
              >
                ✗ Tolak
              </button>
            </div>
          )}

          {event.status === "pending" && showRejectForm && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Alasan penolakan..." rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none"
              />
              <div className="flex items-center gap-2">
                <button onClick={handleReject} disabled={actionLoading !== null}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm text-xs flex items-center justify-center gap-1.5"
                >
                  {actionLoading === "reject" ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Konfirmasi Tolak"}
                </button>
                <button onClick={() => { setShowRejectForm(false); setRejectReason(""); }} disabled={actionLoading !== null}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────── ConfirmModal ───────────── */

export function ConfirmModal({
  isOpen, onConfirm, onCancel,
}: {
  isOpen: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Konfirmasi</h3>
        <p className="text-sm text-gray-600 mb-6">Apakah Anda yakin ingin mengubah status event ini?</p>
        <div className="flex items-center gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
          >
            Batal
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            Ya, Ubah
          </button>
        </div>
      </div>
    </div>
  );
}
