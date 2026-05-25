"use client";

// ─── ValidasiAksesPenyelenggaraClient.tsx (Client Component) ─────────────────
// Lokasi: src/app/(admin)/admin/penyelenggara/ValidasiAksesPenyelenggaraClient.tsx

import { useState, useMemo, useTransition, useEffect, ComponentType } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  FileText,
  ExternalLink,
  ArrowUpDown,
  SlidersHorizontal,
  Loader2,
  Users,
  Clock,
  UserX,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Building2,
  Globe,
  CornerDownRight,
  MoreHorizontal,
} from "lucide-react";
import type { PenyelenggaraItem, StatusValidasi } from "@/types/penyelenggara";

const PAGE_SIZE = 6;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: StatusValidasi }) {
  const config: Record<StatusValidasi, { label: string; className: string; icon: ComponentType<{ className?: string }> }> = {
    approved: {
      label: "DISETUJUI",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    },
    pending: {
      label: "MENUNGGU",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock,
    },
    rejected: {
      label: "DITOLAK",
      className: "bg-rose-50 text-rose-700 border-rose-200",
      icon: UserX,
    },
  };
  const { label, className, icon: Icon } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide shadow-sm transition-all duration-300 ${className}`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {label}
    </span>
  );
}

// ─── ValidationButtons ────────────────────────────────────────────────────────

function ValidationButtons({
  currentStatus,
  isLoading,
  onChangeStatus,
}: {
  currentStatus: StatusValidasi;
  isLoading: boolean;
  onChangeStatus: (status: StatusValidasi) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {/* Jika pending, tampilkan kedua opsi centang dan silang */}
      {currentStatus === "pending" && (
        <>
          <button
            onClick={() => onChangeStatus("approved")}
            disabled={isLoading}
            title="Setujui Hak Akses"
            aria-label="Setujui"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
          >
            <Check className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => onChangeStatus("rejected")}
            disabled={isLoading}
            title="Tolak Hak Akses"
            aria-label="Tolak"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Jika approved (sudah disetujui), hanya tampilkan tombol "Tolak Akses" */}
      {currentStatus === "approved" && (
        <button
          onClick={() => onChangeStatus("rejected")}
          disabled={isLoading}
          title="Tolak / Cabut Hak Akses"
          aria-label="Tolak Akses"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all duration-200 text-[10px] font-extrabold tracking-wide shadow-sm disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap"
        >
          <X className="h-3 w-3" strokeWidth={2.5} />
          Tolak Akses
        </button>
      )}

      {/* Jika rejected (ditolak), hanya tampilkan tombol "Setujui Akses" */}
      {currentStatus === "rejected" && (
        <button
          onClick={() => onChangeStatus("approved")}
          disabled={isLoading}
          title="Setujui Kembali Hak Akses"
          aria-label="Setujui Akses"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all duration-200 text-[10px] font-extrabold tracking-wide shadow-sm disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap"
        >
          <Check className="h-3 w-3" strokeWidth={2.5} />
          Setujui Akses
        </button>
      )}
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function ValidasiAksesPenyelenggaraClient({
  initialData,
}: {
  initialData: PenyelenggaraItem[];
}) {
  const [data, setData] = useState<PenyelenggaraItem[]>(initialData);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<"all" | StatusValidasi>("all");
  const [sortBy, setSortBy] = useState<"id-asc" | "id-desc" | "name-asc" | "name-desc" | "date-desc" | "date-asc">("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Selection / Bulk Actions States
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // Detail Drawer States
  const [detailItem, setDetailItem] = useState<PenyelenggaraItem | null>(null);
  
  // Loading & Feedback states
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [, startTransition] = useTransition();

  // Dropdown menu state
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Reset success/error messages after 5 seconds
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
        setErrorMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  // ─── Dynamic Counts (Real-time Stats) ───────────────────────────────────────
  const stats = useMemo(() => {
    const total = data.length;
    const pending = data.filter((d) => d.status === "pending").length;
    const approved = data.filter((d) => d.status === "approved").length;
    const rejected = data.filter((d) => d.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [data]);

  // ─── Filter & Sort Logic ───────────────────────────────────────────────────

  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Search filter
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (d) =>
          d.id.includes(q) ||
          d.namaOrganisasi.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.noTelepon.includes(q) ||
          d.namaLengkap.toLowerCase().includes(q)
      );
    }

    // 2. Status tab filter
    if (statusTab !== "all") {
      result = result.filter((d) => d.status === statusTab);
    }

    // 3. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "id-asc":
          return a.id.localeCompare(b.id);
        case "id-desc":
          return b.id.localeCompare(a.id);
        case "name-asc":
          return a.namaOrganisasi.localeCompare(b.namaOrganisasi);
        case "name-desc":
          return b.namaOrganisasi.localeCompare(a.namaOrganisasi);
        case "date-asc":
          return (a.dibuatPada || "").localeCompare(b.dibuatPada || "");
        case "date-desc":
        default:
          return (b.dibuatPada || "").localeCompare(a.dibuatPada || "");
      }
    });

    return result;
  }, [data, search, statusTab, sortBy]);

  // ─── Pagination ────────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(processedData.length / PAGE_SIZE));
  
  // Adjust current page if it exceeds total pages after filtering
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const pageItems = useMemo(() => {
    return processedData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [processedData, currentPage]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  const goPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ─── Selection Logic ────────────────────────────────────────────────────────

  const pageRowIds = useMemo(() => pageItems.map((item) => item.rawId), [pageItems]);
  
  const isAllPageSelected = useMemo(() => {
    return pageRowIds.length > 0 && pageRowIds.every((id) => selectedIds.includes(id));
  }, [pageRowIds, selectedIds]);

  const toggleSelectAllPage = () => {
    if (isAllPageSelected) {
      // Unselect all row IDs on the current page
      setSelectedIds((prev) => prev.filter((id) => !pageRowIds.includes(id)));
    } else {
      // Select all row IDs on the current page
      setSelectedIds((prev) => [...new Set([...prev, ...pageRowIds])]);
    }
  };

  const toggleSelectRow = (rawId: number) => {
    setSelectedIds((prev) =>
      prev.includes(rawId) ? prev.filter((id) => id !== rawId) : [...prev, rawId]
    );
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // ─── Update Status via API ────────────────────────────────────────────────

  const handleChangeStatus = (rawId: number, status: StatusValidasi, skipToast = false) => {
    const prevStatus = data.find((d) => d.rawId === rawId)?.status;

    // Optimistic UI update
    setData((prev) =>
      prev.map((item) => (item.rawId === rawId ? { ...item, status } : item))
    );
    
    // Update active drawer if it matches the item
    if (detailItem && detailItem.rawId === rawId) {
      setDetailItem((prev) => (prev ? { ...prev, status } : null));
    }

    setLoadingId(rawId);
    setErrorMsg(null);

    return new Promise<boolean>((resolve) => {
      startTransition(async () => {
        try {
          const res = await fetch("/api/admin/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: rawId, status }),
          });

          const result = await res.json();

          if (!res.ok || !result.success) {
            // Rollback on failure
            setData((prev) =>
              prev.map((item) =>
                item.rawId === rawId && prevStatus
                  ? { ...item, status: prevStatus }
                  : item
              )
            );
            if (detailItem && detailItem.rawId === rawId && prevStatus) {
              setDetailItem((prev) => (prev ? { ...prev, status: prevStatus } : null));
            }
            if (!skipToast) {
              setErrorMsg(result.message ?? "Gagal memperbarui status.");
            }
            resolve(false);
          } else {
            if (!skipToast) {
              setSuccessMsg(`Status penyelenggara #${String(rawId).padStart(5, "0")} berhasil diubah.`);
            }
            resolve(true);
          }
        } catch {
          // Rollback on network error
          setData((prev) =>
            prev.map((item) =>
              item.rawId === rawId && prevStatus
                ? { ...item, status: prevStatus }
                : item
            )
          );
          if (detailItem && detailItem.rawId === rawId && prevStatus) {
            setDetailItem((prev) => (prev ? { ...prev, status: prevStatus } : null));
          }
          if (!skipToast) {
            setErrorMsg("Terjadi kesalahan jaringan. Silakan coba lagi.");
          }
          resolve(false);
        } finally {
          setLoadingId(null);
        }
      });
    });
  };

  // ─── Bulk Action Logic ──────────────────────────────────────────────────────

  const handleBulkChangeStatus = async (status: StatusValidasi) => {
    if (selectedIds.length === 0) return;
    
    const count = selectedIds.length;
    const actionText = status === "approved" ? "menyetujui" : "menolak";
    const confirm = window.confirm(`Apakah Anda yakin ingin ${actionText} akses untuk ${count} penyelenggara terpilih secara massal?`);
    if (!confirm) return;

    setBulkLoading(true);
    setBulkProgress({ current: 0, total: count });
    setErrorMsg(null);
    setSuccessMsg(null);

    let successes = 0;
    const idsToProcess = [...selectedIds];

    for (let i = 0; i < idsToProcess.length; i++) {
      const rawId = idsToProcess[i];
      setBulkProgress({ current: i + 1, total: count });
      const ok = await handleChangeStatus(rawId, status, true);
      if (ok) {
        successes++;
      }
    }

    setBulkLoading(false);
    setSelectedIds([]);
    
    if (successes === count) {
      setSuccessMsg(`Berhasil memperbarui status ${successes} penyelenggara secara massal.`);
    } else {
      setErrorMsg(`Selesai memproses. ${successes} berhasil diperbarui, ${count - successes} gagal.`);
    }
  };

  return (
    <div className="flex flex-col gap-6 relative min-h-[calc(100vh-80px)] pb-24">
      
      {/* ── Alerts Banner ── */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-xs font-semibold text-rose-700 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <div className="flex-1">{errorMsg}</div>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-rose-400 hover:text-rose-700 transition-colors p-1"
            aria-label="Tutup pesan error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      

      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-xs font-semibold text-emerald-700 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
          <div className="flex-1">{successMsg}</div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-400 hover:text-emerald-700 transition-colors p-1"
            aria-label="Tutup pesan sukses"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Bulk Actions Progress Overlay ── */}
      {bulkLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center max-w-sm w-full text-center border border-slate-100 animate-in zoom-in-95 duration-200">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
            <h3 className="text-sm font-bold text-gray-800 mb-1">Memproses Akses Penyelenggara...</h3>
            <p className="text-xs text-gray-500 mb-4">Mohon tunggu sebentar, sistem sedang melakukan pembaruan massal.</p>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-extrabold text-indigo-600 tracking-wider">
              {bulkProgress.current} dari {bulkProgress.total} Selesai
            </span>
          </div>
        </div>
      )}

      {/* ── Main Data Card Container ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
        
        {/* Header Title inside card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-base font-bold text-gray-800">Daftar Pengajuan Akses</h2>
            <p className="text-xs text-gray-400 mt-0.5">Kelola verifikasi dan status persetujuan akun penyelenggara secara detail.</p>
          </div>
        </div>

        {/* Filters and Search Control Panel */}
        {/* Filters and Search Control Panel */}
        <div className="flex flex-col gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          
          {/* Baris Atas: Search & Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari instansi, email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-8 py-2 border border-slate-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-100 hover:border-slate-300 transition-colors shadow-sm"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 shrink-0 bg-white border border-slate-200 p-2 rounded-xl shadow-sm hover:border-slate-300 transition-colors w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400 font-medium sm:hidden">Urutkan:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer pr-1"
              >
                <option value="date-desc">Registrasi: Terbaru</option>
                <option value="date-asc">Registrasi: Terlama</option>
                <option value="name-asc">Nama Instansi: A - Z</option>
                <option value="name-desc">Nama Instansi: Z - A</option>
              </select>
            </div>
          </div>

          {/* Garis Pembatas Tipis */}
          <div className="h-px bg-slate-200/50" />

          {/* Baris Bawah: Status Tabs Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-1 shrink-0">Filter Status:</span>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: "all", label: "Semua", count: stats.total, activeClass: "bg-gray-800 text-white border-gray-800" },
                  { id: "pending", label: "Menunggu", count: stats.pending, activeClass: "bg-amber-600 text-white border-amber-600" },
                  { id: "approved", label: "Disetujui", count: stats.approved, activeClass: "bg-emerald-600 text-white border-emerald-600" },
                  { id: "rejected", label: "Ditolak", count: stats.rejected, activeClass: "bg-rose-600 text-white border-rose-600" },
                ] as const
              ).map((tab) => {
                const isActive = statusTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setStatusTab(tab.id);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-300 flex items-center gap-1.5 shadow-sm
                      ${
                        isActive
                          ? tab.activeClass
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                  >
                    {tab.label}
                    <span
                      className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[10px] font-extrabold shadow-inner
                        ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Table Area ── */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm">
          <table className="w-full text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100">
              <tr>
                {/* Checkbox Column */}
                <th className="px-5 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllPageSelected}
                    onChange={toggleSelectAllPage}
                    className="accent-indigo-600 cursor-pointer w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                
                {["No.", "Nama Organisasi", "Email", "No. Telepon", "Status", "Aksi"].map(
                  (col, idx) => (
                    <th
                      key={col}
                      className={`px-5 py-4 font-bold uppercase tracking-wider text-slate-400 text-[10px]
                        ${idx === 0 ? "w-16 text-center" : "text-left"}`}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400 font-medium">
                    <div className="flex flex-col items-center gap-2">
                      <SlidersHorizontal className="w-8 h-8 text-slate-300" />
                      Tidak ada data penyelenggara yang sesuai dengan filter pencarian.
                    </div>
                  </td>
                </tr>
              ) : (
                pageItems.map((item, idx) => {
                  const isSelected = selectedIds.includes(item.rawId);
                  const isLoading = loadingId === item.rawId;
                  
                  return (
                    <tr
                      key={item.rawId}
                      className={`transition-all duration-150 group/row hover:bg-slate-50/40
                        ${isSelected ? "bg-indigo-50/20" : ""}
                        ${isLoading ? "opacity-65 pointer-events-none" : ""}`}
                    >
                      {/* Checkbox Row Selection */}
                      <td className="px-5 py-3 text-center">
                        <input
                           type="checkbox"
                           checked={isSelected}
                           onChange={() => toggleSelectRow(item.rawId)}
                           className="accent-indigo-600 cursor-pointer w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Display No. */}
                      <td className="px-5 py-3 text-slate-500 font-mono text-[11px] font-bold text-center">
                        {(currentPage - 1) * PAGE_SIZE + idx + 1}
                      </td>

                      {/* Nama Organisasi */}
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setDetailItem(item)}
                          className="text-left font-bold text-slate-800 text-[13px] hover:text-indigo-600 transition-colors group-hover/row:translate-x-0.5 transform duration-200"
                        >
                          {item.namaOrganisasi}
                        </button>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3 text-slate-500 font-medium select-all">
                        {item.email}
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-3 text-slate-600 font-semibold">
                        {item.noTelepon}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Validation Actions / Three Dots Menu */}
                      <td className="px-5 py-3 relative" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-start gap-2">
                          {isLoading ? (
                            <div className="flex items-center justify-center h-8 w-8">
                              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                            </div>
                          ) : (
                            <>
                              {/* Tombol Tinjau Detail Langsung */}
                              <button
                                onClick={() => setDetailItem(item)}
                                className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 flex items-center justify-center border border-slate-200/50 shadow-sm transition-all hover:scale-105 active:scale-95"
                                title="Tinjau Detail"
                              >
                                <FileText className="w-4 h-4" />
                              </button>

                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(openMenuId === item.rawId ? null : item.rawId);
                                  }}
                                  className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200/50 shadow-sm transition-all hover:scale-105 active:scale-95"
                                  title="Buka menu aksi"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>

                                {/* Dropdown Menu Portal */}
                                {openMenuId === item.rawId && (
                                  <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl border border-slate-200/80 shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                                    {item.status !== "approved" && (
                                      <button
                                        onClick={() => {
                                          handleChangeStatus(item.rawId, "approved");
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full px-3.5 py-2 text-left text-emerald-600 hover:bg-emerald-50/50 font-bold text-xs flex items-center gap-2.5 transition-colors"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        Setujui Akses
                                      </button>
                                    )}

                                    {item.status !== "rejected" && (
                                      <button
                                        onClick={() => {
                                          handleChangeStatus(item.rawId, "rejected");
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full px-3.5 py-2 text-left text-rose-600 hover:bg-rose-50/50 font-bold text-xs flex items-center gap-2.5 transition-colors border-t border-slate-100 first:border-t-0"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                        Tolak Akses
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Area ── */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-3 pt-5 border-t border-slate-100 gap-3">
          <span className="text-xs text-slate-400 font-semibold">
            Menampilkan <span className="text-slate-700">{processedData.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0}</span> –{" "}
            <span className="text-slate-700">
              {Math.min(currentPage * PAGE_SIZE, processedData.length)}
            </span>{" "}
            dari <span className="text-slate-700 font-bold">{processedData.length}</span> penyelenggara
          </span>
          
          <div className="flex gap-1 items-center">
            <button
              onClick={() => goPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Halaman sebelumnya"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => goPage(page)}
                aria-label={`Halaman ${page}`}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-all shadow-sm
                  ${
                    page === currentPage
                      ? "border-slate-800 bg-slate-800 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Halaman berikutnya"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ── Floating Bulk Action Bar ── */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 border border-slate-200 shadow-2xl rounded-3xl p-4 flex items-center justify-between gap-6 max-w-lg w-[90%] backdrop-blur-md animate-in slide-in-from-bottom-8 fade-in-40 duration-300">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
              {selectedIds.length}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Aksi Massal</h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Kelola status massal.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkChangeStatus("approved")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
            >
              <Check className="w-3.5 h-3.5" />
              Setujui
            </button>
            <button
              onClick={() => handleBulkChangeStatus("rejected")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-xl transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              Tolak
            </button>
            
            <div className="w-px h-6 bg-slate-200 mx-1" />

            <button
              onClick={handleClearSelection}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors px-2 py-1"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* ── Premium Detail Side-Drawer ── */}
      {detailItem !== null && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop with elegant blur */}
            <div
              onClick={() => setDetailItem(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              {/* Sliding Card Panel */}
              <div className="pointer-events-auto w-screen max-w-md transform transition duration-300 translate-x-0 bg-white shadow-2xl h-screen flex flex-col justify-between animate-in slide-in-from-right">
                
                {/* Drawer Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-600 font-mono text-[10px] font-extrabold px-2 py-1 rounded-md border border-slate-200">
                      ID: {detailItem.id}
                    </span>
                    <h3 className="text-sm font-extrabold text-gray-800" id="slide-over-title">
                      Tinjau Profil Lengkap
                    </h3>
                  </div>
                  <button
                    onClick={() => setDetailItem(null)}
                    className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Content Area (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Instansi Title Card */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-3 shadow-inner relative z-10">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-800 leading-snug relative z-10">
                      {detailItem.namaOrganisasi}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 relative z-10">
                      Instansi Penyelenggara
                    </p>
                    
                    {/* Status badge in detail card */}
                    <div className="mt-4 relative z-10">
                      <StatusBadge status={detailItem.status} />
                    </div>
                  </div>

                  {/* Deskripsi Instansi */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                      Tentang / Deskripsi
                    </h5>
                    <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-inner-sm text-xs text-slate-600 leading-relaxed min-h-[80px]">
                      {detailItem.deskripsiInstansi || "Tidak ada deskripsi profil instansi yang ditulis oleh penyelenggara."}
                    </div>
                  </div>

                  {/* Legal Document Attachment */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                      Dokumen Legalitas Penyelenggara
                    </h5>
                    {detailItem.dokumenLegalitasUrl ? (
                      <div className="flex items-center justify-between p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h6 className="text-xs font-bold text-slate-800">Berkas Dokumen Legalitas</h6>
                            <p className="text-[10px] text-slate-400 font-semibold">Dokumen pendukung verifikasi (.pdf/.jpg)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={detailItem.dokumenLegalitasUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Buka Dokumen di Tab Baru"
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 text-indigo-600 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl text-xs font-medium text-amber-700">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                        Penyelenggara belum mengunggah dokumen legalitas.
                      </div>
                    )}
                  </div>

                  {/* Profile Details Rows */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-3">
                      Informasi Narahubung & Detail
                    </h5>

                    {/* Penanggung Jawab */}
                    <div className="flex items-start gap-4 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                      <Users className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nama Penyelenggara</span>
                        <span className="text-xs font-semibold text-slate-700">{detailItem.namaOrganisasi}</span>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Akun</span>
                        <span className="text-xs font-semibold text-slate-700 select-all">{detailItem.email}</span>
                      </div>
                    </div>

                    {/* No Telepon */}
                    <div className="flex items-start gap-4 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nomor Telepon</span>
                        <span className="text-xs font-semibold text-slate-700 select-all">{detailItem.noTelepon}</span>
                      </div>
                    </div>

                    {/* Website Instansi */}
                    <div className="flex items-start gap-4 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                      <Globe className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Website</span>
                        {detailItem.websiteUrl ? (
                          <a
                            href={detailItem.websiteUrl.startsWith("http") ? detailItem.websiteUrl : `https://${detailItem.websiteUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            {detailItem.websiteUrl}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500 font-semibold">-</span>
                        )}
                      </div>
                    </div>

                    {/* Tanggal Registrasi */}
                    <div className="flex items-start gap-4 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tanggal Pendaftaran</span>
                        <span className="text-xs font-semibold text-slate-700">{formatDate(detailItem.dibuatPada)}</span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Drawer Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
                  <div className="text-[10px] font-semibold text-slate-400">
                    ID Transaksi: #{detailItem.rawId}
                  </div>

                  <div className="flex items-center gap-2">
                    {loadingId === detailItem.rawId ? (
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 px-4 py-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Mengupdate...
                      </div>
                    ) : (
                      <>
                        {/* Jika pending, tampilkan kedua tombol */}
                        {detailItem.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleChangeStatus(detailItem.rawId, "approved")}
                              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all duration-200 active:scale-95 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Setujui Akses
                            </button>
                            <button
                              onClick={() => handleChangeStatus(detailItem.rawId, "rejected")}
                              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all duration-200 active:scale-95 bg-rose-600 hover:bg-rose-700 text-white shadow-rose-100"
                            >
                              <X className="w-3.5 h-3.5" />
                              Tolak Akses
                            </button>
                          </>
                        )}

                        {/* Jika approved, hanya tampilkan tombol Tolak Akses */}
                        {detailItem.status === "approved" && (
                          <button
                            onClick={() => handleChangeStatus(detailItem.rawId, "rejected")}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all duration-200 active:scale-95 bg-rose-600 hover:bg-rose-700 text-white shadow-rose-100"
                          >
                            <X className="w-3.5 h-3.5" />
                            Tolak Akses
                          </button>
                        )}

                        {/* Jika rejected, hanya tampilkan tombol Setujui Akses */}
                        {detailItem.status === "rejected" && (
                          <button
                            onClick={() => handleChangeStatus(detailItem.rawId, "approved")}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all duration-200 active:scale-95 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Setujui Akses
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}