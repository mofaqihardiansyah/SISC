"use client";
import { useState, useMemo, useTransition, useEffect, ComponentType } from "react";
import Portal from "@/components/ui/Portal";
import {
  Search,
  ChevronLeft, 
  ChevronRight,
  Check,
  X,
  Eye,
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
  MoreHorizontal,
} from "lucide-react";
import type { PenyelenggaraItem, StatusValidasi } from "@/types/penyelenggara";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 6;

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

// â”€â”€â”€ StatusBadge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function StatusBadge({ status }: { status: StatusValidasi }) {
  const config: Record<StatusValidasi, { label: string; className: string; icon: ComponentType<{ className?: string }> }> = {
    approved: {
      label: "Disetujui",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    },
    pending: {
      label: "Menunggu",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock,
    },
    rejected: {
      label: "Ditolak",
      className: "bg-rose-50 text-rose-700 border-rose-200",
      icon: UserX,
    },
  };
  const { label, className, icon: Icon } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xxs font-bold tracking-wide shadow-sm transition-all duration-300 ${className}`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {label}
    </span>
  );
}

// â”€â”€â”€ Main Client Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

  // â”€â”€â”€ Dynamic Counts (Real-time Stats) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const stats = useMemo(() => {
    const total = data.length;
    const pending = data.filter((d) => d.status === "pending").length;
    const approved = data.filter((d) => d.status === "approved").length;
    const rejected = data.filter((d) => d.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [data]);

  // â”€â”€â”€ Filter & Sort Logic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

  // â”€â”€â”€ Pagination â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

  const getPageButtons = (): (number | string)[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1, 2, 3];
    if (currentPage > 4) pages.push("...");
    if (currentPage > 3 && currentPage < totalPages - 1) pages.push(currentPage);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const goPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // â”€â”€â”€ Selection Logic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

  // â”€â”€â”€ Update Status via API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

  // â”€â”€â”€ Bulk Action Logic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
      
      {/* â”€â”€ Alerts Banner â”€â”€ */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-xs font-semibold text-rose-700 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <div className="flex-1">{errorMsg}</div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setErrorMsg(null)}
            aria-label="Tutup pesan error"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      

      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-xs font-semibold text-emerald-700 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
          <div className="flex-1">{successMsg}</div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setSuccessMsg(null)}
            aria-label="Tutup pesan sukses"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* â”€â”€ Bulk Actions Progress Overlay â”€â”€ */}
      {bulkLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" />
          <div className="relative bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center max-w-sm w-full text-center border border-slate-100 animate-in zoom-in-95 duration-300">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
            <h3 className="text-sm font-bold text-gray-800 mb-1">Memproses Akses Penyelenggara...</h3>
            <p className="text-xs text-gray-500 mb-4">Mohon tunggu sebentar, sistem sedang melakukan pembaruan massal.</p>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
              />
            </div>
            <span className="text-micro font-extrabold text-indigo-600 tracking-wider">
              {bulkProgress.current} dari {bulkProgress.total} Selesai
            </span>
          </div>
        </div>
      )}

      {/* â”€â”€ Main Data Card Container â”€â”€ */}
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
              <Input
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
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
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
            <span className="text-xxs font-extrabold text-slate-400 uppercase tracking-wider mr-1 shrink-0">Filter Status:</span>
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
                  <Button
                    key={tab.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setStatusTab(tab.id);
                      setCurrentPage(1);
                    }}
                    className={isActive ? tab.activeClass : ""}
                  >
                    {tab.label}
                    <span
                      className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-xxs font-extrabold shadow-inner
                        ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                    >
                      {tab.count}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* â”€â”€ Table Area â”€â”€ */}
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
                      className={`px-5 py-4 font-bold uppercase tracking-wider text-slate-400 text-xxs
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
                      <td className="px-5 py-3 text-slate-500 font-mono text-micro font-bold text-center">
                        {(currentPage - 1) * PAGE_SIZE + idx + 1}
                      </td>

                      {/* Nama Organisasi */}
                      <td className="px-5 py-3">
                        <Button
                          variant="ghost"
                          onClick={() => setDetailItem(item)}
                          className="text-left font-bold text-slate-800 text-sm2 hover:text-indigo-600"
                        >
                          {item.namaOrganisasi}
                        </Button>
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
                              {/* Tombol Preview Detail */}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDetailItem(item)}
                                aria-label="Preview Detail"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>

                              <div className="relative">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(openMenuId === item.rawId ? null : item.rawId);
                                  }}
                                  aria-label="Buka menu aksi"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>

                                {/* Dropdown Menu Portal */}
                                {openMenuId === item.rawId && (
                                  <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl border border-slate-200/80 shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                                    {item.status !== "approved" && (
                                      <Button
                                        variant="ghost"
                                        onClick={() => {
                                          handleChangeStatus(item.rawId, "approved");
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full justify-start text-xs font-bold text-emerald-600 hover:bg-emerald-50/50"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        Setujui Akses
                                      </Button>
                                    )}

                                    {item.status !== "rejected" && (
                                      <Button
                                        variant="ghost"
                                        onClick={() => {
                                          handleChangeStatus(item.rawId, "rejected");
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full justify-start text-xs font-bold text-rose-600 hover:bg-rose-50/50"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                        Tolak Akses
                                      </Button>
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

        {/* â”€â”€ Pagination Area â”€â”€ */}
        <div className="flex justify-between items-center mt-3 pt-5 border-t border-slate-100 flex-wrap gap-3">
          <span className="text-xs text-slate-400 font-semibold">
            Menampilkan <span className="text-slate-700">{processedData.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0}</span> â€“{" "}
            <span className="text-slate-700">
              {Math.min(currentPage * PAGE_SIZE, processedData.length)}
            </span>{" "}
            dari <span className="text-slate-700 font-bold">{processedData.length}</span> penyelenggara
          </span>
          
          <div className="flex gap-1 items-center">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => goPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>

            {getPageButtons().map((page, idx) =>
              page === "..." ? (
                <span key={`dots-${idx}`} className="text-gray-400 px-1 text-xs font-semibold">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="icon-xs"
                  onClick={() => goPage(page as number)}
                  aria-label={`Halaman ${page}`}
                >
                  {page}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => goPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

      </div>

      {/* â”€â”€ Floating Bulk Action Bar â”€â”€ */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 border border-slate-200 shadow-2xl rounded-3xl p-4 flex items-center justify-between gap-6 max-w-lg w-[90%] backdrop-blur-md animate-in slide-in-from-bottom-8 fade-in-40 duration-300">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
              {selectedIds.length}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Aksi Massal</h4>
              <p className="text-xxs text-slate-400 font-semibold mt-0.5">Kelola status massal.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="success"
              size="sm"
              onClick={() => handleBulkChangeStatus("approved")}
            >
              <Check className="w-3.5 h-3.5" />
              Setujui
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleBulkChangeStatus("rejected")}
            >
              <X className="w-3.5 h-3.5" />
              Tolak
            </Button>
            
            <div className="w-px h-6 bg-slate-200 mx-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSelection}
            >
              Batal
            </Button>
          </div>
        </div>
      )}

      {/* â”€â”€ Premium Detail Modal â”€â”€ */}
      {detailItem !== null && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
              onClick={() => setDetailItem(null)} 
            />
            <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
                
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-sisc-navy text-white">
              <div className="flex items-center gap-2">
                <span className="bg-white/10 text-white font-mono text-xxs font-extrabold px-2 py-1 rounded-md border border-white/20">
                  ID: {detailItem.id}
                </span>
                <h3 className="text-sm font-extrabold text-white" id="slide-over-title">
                  Tinjau Profil Lengkap
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDetailItem(null)}
                className="hover:bg-white/10 text-slate-300 hover:text-white"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Instansi Title Card */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-3 shadow-inner relative z-10">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-800 leading-snug relative z-10">
                      {detailItem.namaOrganisasi}
                    </h4>
                    <p className="text-xxs text-slate-400 font-bold uppercase tracking-wider mt-1 relative z-10">
                      Instansi Penyelenggara
                    </p>
                    
                    {/* Status badge in detail card */}
                    <div className="mt-4 relative z-10">
                      <StatusBadge status={detailItem.status} />
                    </div>
                  </div>

                  {/* Deskripsi Instansi */}
                  <div className="space-y-2">
                    <h5 className="text-xxs font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                      Tentang / Deskripsi
                    </h5>
                    <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-inner-sm text-xs text-slate-600 leading-relaxed min-h-20">
                      {detailItem.deskripsiInstansi || "Tidak ada deskripsi profil instansi yang ditulis oleh penyelenggara."}
                    </div>
                  </div>

                  {/* Legal Document Attachment */}
                  <div className="space-y-2">
                    <h5 className="text-xxs font-extrabold text-slate-400 uppercase tracking-widest leading-none">
                      Dokumen Legalitas Penyelenggara
                    </h5>
                    {detailItem.urlDokumenLegalitas ? (
                      <div className="flex items-center justify-between p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h6 className="text-xs font-bold text-slate-800">Berkas Dokumen Legalitas</h6>
                            <p className="text-xxs text-slate-400 font-semibold">Dokumen pendukung verifikasi (.pdf/.jpg)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={detailItem.urlDokumenLegalitas}
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
                    <h5 className="text-xxs font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-3">
                      Informasi Narahubung & Detail
                    </h5>

                    {/* Penanggung Jawab */}
                    <div className="flex items-start gap-4 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                      <Users className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="block text-xxs text-slate-400 font-bold uppercase tracking-wider">Nama Penyelenggara</span>
                        <span className="text-xs font-semibold text-slate-700">{detailItem.namaOrganisasi}</span>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="block text-xxs text-slate-400 font-bold uppercase tracking-wider">Email Akun</span>
                        <span className="text-xs font-semibold text-slate-700 select-all">{detailItem.email}</span>
                      </div>
                    </div>

                    {/* No Telepon */}
                    <div className="flex items-start gap-4 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="block text-xxs text-slate-400 font-bold uppercase tracking-wider">Nomor Telepon</span>
                        <span className="text-xs font-semibold text-slate-700 select-all">{detailItem.noTelepon}</span>
                      </div>
                    </div>

                    {/* Website Instansi */}
                    <div className="flex items-start gap-4 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                      <Globe className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="block text-xxs text-slate-400 font-bold uppercase tracking-wider">Website</span>
                        {detailItem.urlWebsite ? (
                          <a
                            href={detailItem.urlWebsite.startsWith("http") ? detailItem.urlWebsite : `https://${detailItem.urlWebsite}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            {detailItem.urlWebsite}
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
                        <span className="block text-xxs text-slate-400 font-bold uppercase tracking-wider">Tanggal Pendaftaran</span>
                        <span className="text-xs font-semibold text-slate-700">{formatDate(detailItem.dibuatPada)}</span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Drawer Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
                  <div className="text-xxs font-semibold text-slate-400">
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
                            <Button
                              variant="success"
                              onClick={() => handleChangeStatus(detailItem.rawId, "approved")}
                            >
                              <Check className="w-3.5 h-3.5" />
                              Setujui Akses
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleChangeStatus(detailItem.rawId, "rejected")}
                            >
                              <X className="w-3.5 h-3.5" />
                              Tolak Akses
                            </Button>
                          </>
                        )}

                        {/* Jika approved, hanya tampilkan tombol Tolak Akses */}
                        {detailItem.status === "approved" && (
                          <Button
                            variant="destructive"
                            onClick={() => handleChangeStatus(detailItem.rawId, "rejected")}
                          >
                            <X className="w-3.5 h-3.5" />
                            Tolak Akses
                          </Button>
                        )}

                        {/* Jika rejected, hanya tampilkan tombol Setujui Akses */}
                        {detailItem.status === "rejected" && (
                          <Button
                            variant="success"
                            onClick={() => handleChangeStatus(detailItem.rawId, "approved")}
                          >
                            <Check className="w-3.5 h-3.5" />
                            Setujui Akses
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
        </Portal>
      )}
    </div>
  );
}
