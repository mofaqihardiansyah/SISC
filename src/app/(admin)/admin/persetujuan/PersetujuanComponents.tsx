"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  FileCheck, CheckCircle, X, Eye, MoreVertical, Check, XCircle,
  Search, ChevronDown, Calendar, MapPin,
  Clock, Tag, Monitor, Users as UsersIcon, Wallet, Building2, Phone,
  Mail, Globe,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { searchEventTitles, approveEvent, rejectEvent } from "@/actions/persetujuan-event";
import type { PendingEvent } from "@/actions/persetujuan-event";
import {
  statusOptions, statusLabel, getPlatformColor, getStatusColor,
  formatDateDisplay, formatPlatform, DEBOUNCE_MS, SEARCH_MIN_LENGTH,
} from "@/constants/persetujuan";
import { Modal } from "@/components/ui/modal";
import { ConfirmationModal } from "@/components/feedback/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea'

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
            <Button variant="ghost" size="icon-xs" onClick={onClearSearch} aria-label="Hapus pencarian">
              <X size={14} />
            </Button>
          )}
        </div>
        {showDropdown && results.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
            {results.map((r) => (
              <Button
                key={r.id}
                variant="ghost"
                onClick={() => handleSelect(r.judul)}
                className="w-full justify-start text-xs font-medium text-gray-700"
              >
                {r.judul}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="relative" data-status-dropdown>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleStatusDropdown}
        >
          {statusOptions.find((o) => o.value === statusFilter)?.label || "Semua Status"}
          <ChevronDown size={14} className={`transition-transform ${showStatusDropdown ? "rotate-180" : ""}`} />
        </Button>
        {showStatusDropdown && (
          <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
            {statusOptions.map((opt) => (
              <Button
                key={opt.value}
                variant="ghost"
                onClick={() => onStatusSelect(opt.value)}
                className={`w-full justify-start text-xs font-medium ${
                  statusFilter === opt.value ? "bg-blue-50 text-blue-700" : "text-gray-600"
                }`}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
            <th className="text-xxs font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-left">ID</th>
            <th className="text-xxs font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-left">Nama Event</th>
            <th className="text-xxs font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-left">Kategori</th>
            <th className="text-xxs font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-left">Platform</th>
            <th className="text-xxs font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-right">Harga</th>
            <th className="text-xxs font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-left">Tanggal Masuk</th>
            <th className="text-xxs font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-left">Status</th>
            <th className="text-xxs font-bold text-gray-400 uppercase tracking-wider px-6 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-slate-50/25 transition-colors">
              <td className="px-6 py-3.5">
                <span className="text-xs text-gray-400 font-mono">{event.id}</span>
              </td>
              <td className="px-6 py-3.5">
                <Button variant="ghost" onClick={() => onPreview(event)} className="text-left font-semibold text-gray-900 text-sm2 hover:text-slate-700">
                  {event.judul}
                </Button>
              </td>
              <td className="px-6 py-3.5">
                <span className="text-xs text-gray-500">{event.kategori || "-"}</span>
              </td>
              <td className="px-6 py-3.5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold border tracking-wider whitespace-nowrap ${getPlatformColor(event.platform)}`}>
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
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold border tracking-wider whitespace-nowrap ${getStatusColor(event.status)}`}>
                  {statusLabel[event.status] || event.status}
                </span>
              </td>
              <td className="px-6 py-3.5">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPreview(event)}
                    aria-label="Preview Event"
                  >
                    <Eye size={16} />
                  </Button>
                  <div className="relative" data-action-dropdown>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); onToggleDropdown(event.id); }}
                      aria-label="Opsi Lainnya"
                    >
                      <MoreVertical size={16} />
                    </Button>
                    {openDropdownId === event.id && (
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 overflow-hidden">
                        <div className="px-3 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                          Ubah Status
                        </div>
                        {event.status !== "published" && (
                          <Button variant="ghost" onClick={(e) => { e.stopPropagation(); onStatusChange(event.id, "published"); }}
                            className="w-full justify-start text-xs font-bold text-emerald-600 hover:bg-emerald-50"
                          >
                            <Check size={12} /> Setujui
                          </Button>
                        )}
                        {event.status !== "pending" && (
                          <Button variant="ghost" onClick={(e) => { e.stopPropagation(); onStatusChange(event.id, "pending"); }}
                            className="w-full justify-start text-xs font-bold text-amber-600 hover:bg-amber-50"
                          >
                            <XCircle size={12} /> Pending
                          </Button>
                        )}
                        {event.status !== "rejected" && (
                          <Button variant="ghost" onClick={(e) => { e.stopPropagation(); onStatusChange(event.id, "rejected"); }}
                            className="w-full justify-start text-xs font-bold text-rose-600 hover:bg-rose-50"
                          >
                            <X size={12} /> Tolak
                          </Button>
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

export { Pagination } from "@/components/ui/pagination";

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 bg-white rounded-lg flex items-center justify-center border border-slate-100 text-slate-900 shrink-0">
        {icon}
      </div>
      <span className="text-xxs text-slate-400 font-semibold w-16 shrink-0">{label}</span>
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
    <Modal open onClose={onClose} className="max-w-2xl">
      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
        <span className="text-nano font-bold text-slate-400 uppercase tracking-wider">ID {event.id}</span>
        <span className="text-nano font-bold text-slate-300">&bull;</span>
        {event.jenisEvent && (
          <><span className="text-nano font-bold text-slate-400 uppercase tracking-wider">{event.jenisEvent}</span><span className="text-nano font-bold text-slate-300">&bull;</span></>
        )}
        <span className="text-nano font-bold text-slate-400 uppercase tracking-wider">{formatPlatform(event.platform)}</span>
        <span className="text-nano font-bold text-slate-300">&bull;</span>
        <span className={`text-nano font-bold uppercase tracking-wider ${event.status === "pending" ? "text-amber-600" : event.status === "published" ? "text-emerald-600" : "text-rose-600"}`}>
          {statusLabel[event.status]}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-4">oleh {event.penyelenggara || "-"}</p>

      {event.urlBanner && (
        <div className="relative w-full mb-4 rounded-xl overflow-hidden">
          <Image src={event.urlBanner} alt={event.judul} className="w-full h-48 object-cover" width={800} height={192} />
        </div>
      )}

      <div className="grid grid-cols-4 gap-1.5 mb-2.5">
        {[
          { label: "Kategori", value: event.kategori || "-" },
          { label: "Tanggal", value: formatDateDisplay(event.tanggalMulai) },
          { label: "Jam", value: `${event.jamMulai} - ${event.jamSelesai}` },
          { label: "Harga", value: event.harga },
        ].map((item) => (
          <div key={item.label} className="bg-slate-50 rounded-xl p-1.5 border border-slate-100">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
            <p className="text-micro font-bold text-slate-800 truncate">{item.value}</p>
          </div>
        ))}
      </div>

      {event.status === "rejected" && event.alasanPenolakan && (
        <div className="mb-2">
          <h3 className="text-xxs font-bold text-rose-600 uppercase tracking-wider mb-1">Alasan Penolakan</h3>
          <div className="bg-rose-50 rounded-xl p-2.5 border border-rose-200">
            <p className="text-xs text-rose-700 font-medium">{event.alasanPenolakan}</p>
          </div>
        </div>
      )}

      <div className="mb-2">
        <h3 className="text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Deskripsi</h3>
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-2.5 border border-slate-100 whitespace-pre-wrap">
          {event.deskripsi || "Tidak ada deskripsi."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
        <div className="space-y-1">
          <h3 className="text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Waktu & Lokasi</h3>
          <InfoRow icon={<Calendar size={12} />} label="Mulai" value={formatDateDisplay(event.tanggalMulai)} />
          <InfoRow icon={<Calendar size={12} />} label="Selesai" value={formatDateDisplay(event.tanggalSelesai)} />
          <InfoRow icon={<Clock size={12} />} label="Jam" value={`${event.jamMulai} - ${event.jamSelesai}`} />
          <InfoRow icon={<Clock size={12} />} label="Batas Daftar" value={formatDateDisplay(event.batasRegistrasi)} />
          <InfoRow icon={<MapPin size={12} />} label="Lokasi" value={event.lokasi || "-"} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Detail Event</h3>
          <InfoRow icon={<Tag size={12} />} label="Kategori" value={event.kategori || "-"} />
          <InfoRow icon={<Monitor size={12} />} label="Platform" value={formatPlatform(event.platform)} />
          <InfoRow icon={<UsersIcon size={12} />} label="Kuota" value={event.kuota ? `${event.kuota.toLocaleString("id-ID")} orang` : "-"} />
          <InfoRow icon={<Wallet size={12} />} label="Harga" value={event.harga} />
          <InfoRow icon={<Globe size={12} />} label="Link" value={event.linkEksternal || "-"} />
        </div>
      </div>

      {event.pembicara && (
        <div className="mb-2">
          <h3 className="text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Pembicara</h3>
          <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
              {event.pembicara.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{event.pembicara}</p>
              <p className="text-micro text-slate-500">{event.peranPembicara || "-"}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-2">
        <h3 className="text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Kontak Penyelenggara</h3>
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
          <InfoRow icon={<Building2 size={14} />} label="Penyelenggara" value={event.penyelenggara || "-"} />
          <InfoRow icon={<Mail size={14} />} label="Email" value={event.kontakEmail || "-"} />
          <InfoRow icon={<Phone size={14} />} label="Telepon" value={event.kontakTelepon || "-"} />
        </div>
      </div>

      {event.status === "pending" && !showRejectForm && (
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <Button variant="success" onClick={handleApprove} disabled={actionLoading !== null} className="flex-1">
            {actionLoading === "approve" ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "\u2713 Setujui"}
          </Button>
          <Button variant="destructive" onClick={() => setShowRejectForm(true)} disabled={actionLoading !== null} className="flex-1">
            {"\u2717"} Tolak
          </Button>
        </div>
      )}

      {event.status === "pending" && showRejectForm && (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Alasan penolakan..." rows={2}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none"
          />
          <div className="flex items-center gap-2">
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading !== null} className="flex-1">
              {actionLoading === "reject" ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Konfirmasi Tolak"}
            </Button>
            <Button variant="outline" onClick={() => { setShowRejectForm(false); setRejectReason(""); }} disabled={actionLoading !== null}>
              Batal
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export function ConfirmModal({
  isOpen, onConfirm, onCancel,
}: {
  isOpen: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <ConfirmationModal
      open={isOpen}
      title="Konfirmasi"
      message="Apakah Anda yakin ingin mengubah status event ini?"
      confirmLabel="Ya, Ubah"
      variant="danger"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
