"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Calendar,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  Users,
  Edit3,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteEvent, updateEventStatus } from "@/actions/admin-event";
import { cn } from "@/lib/utils";
import DataEvent from "./DataEvent";
import EditEvent from "./EditEvent";

export type Event = {
  id: number;
  judul: string;
  penyelenggara: string | null;
  tanggalMulai: Date;
  tanggalSelesai: Date | null;
  status: "pending" | "published" | "rejected";
  bannerUrl: string | null;
  deskripsi: string | null;
  syaratDanKetentuan: string | null;
  detailLokasi: string | null;
  kuota: number | null;
  isEventPolines: boolean;
  jenisEvent: "seminar" | "conference" | null;
  tipePlatform: "online" | "offline" | "hybrid" | null;
  tipeHarga: "free" | "paid" | null;
  harga: number | null;
  participantCount?: number;
  namaPembicara: string | null;
  websiteSumber: string | null;
  emailKontak: string | null;
  teleponKontak: string | null;
};

export type Stats = {
  total: number;
  seminar: number;
  conference: number;
  published: number;
  polines: number;
  umum: number;
};

type ClientPageProps = {
  initialEvents: Event[];
  initialStats: Stats;
};

const ROWS_PER_PAGE = 5;

export default function ClientPage({ initialEvents: initialEventsData }: ClientPageProps) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEventsData);

  // Sync state with props when server data refreshes
  useEffect(() => {
    setEvents(initialEventsData);
  }, [initialEventsData]);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [statusTab, setStatusTab] = useState<"all" | "pending" | "published" | "rejected">("all");

  // Temporary inputs for search, category, and sort (manual "Terapkan" trigger)
  const [searchInput, setSearchInput] = useState("");
  const [typeInput, setTypeInput] = useState("all");
  const [sortInput, setSortInput] = useState("newest");
  
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Modals for confirmation
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Reset page to 1 when applied filters or status tab change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedRows([]);
  }, [searchTerm, typeFilter, sortBy, statusTab]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        e.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.penyelenggara && e.penyelenggara.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === "all" || e.jenisEvent === typeFilter;
      const matchesStatus = statusTab === "all" || e.status === statusTab;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [events, searchTerm, typeFilter, statusTab]);

  const sortedEvents = useMemo(() => {
    const sorted = [...filteredEvents];
    if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.tanggalMulai).getTime() - new Date(a.tanggalMulai).getTime());
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.tanggalMulai).getTime() - new Date(b.tanggalMulai).getTime());
    } else if (sortBy === "name_asc") {
      sorted.sort((a, b) => a.judul.localeCompare(b.judul));
    } else if (sortBy === "name_desc") {
      sorted.sort((a, b) => b.judul.localeCompare(a.judul));
    }
    return sorted;
  }, [filteredEvents, sortBy]);

  // Client-side pagination
  const totalPages = Math.ceil(sortedEvents.length / ROWS_PER_PAGE) || 1;
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return sortedEvents.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [sortedEvents, currentPage]);

  const pageIds = paginatedEvents.map((e) => e.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedRows.includes(id));
  const toggleAll = () =>
    allPageSelected
      ? setSelectedRows((p) => p.filter((id) => !pageIds.includes(id)))
      : setSelectedRows((p) => [...new Set([...p, ...pageIds])]);
  const toggleRow = (id: number) =>
    setSelectedRows((p) => (p.includes(id) ? p.filter((r) => r !== id) : [...p, id]));

  const handleApplyFilters = () => {
    setSearchTerm(searchInput);
    setTypeFilter(typeInput);
    setSortBy(sortInput);
  };

  const handleDelete = async (id: number) => {
    setDeleteLoading(true);
    try {
      const res = await deleteEvent(id);
      if (res.success) {
        toast.success(res.message || "Event berhasil dihapus");
        setEvents((prev) => prev.filter((e) => e.id !== id));
        setDeleteModal(null);
      } else {
        toast.error(res.error || "Gagal menghapus event");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    setDeleteLoading(true);
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedRows) {
      try {
        const res = await deleteEvent(id);
        if (res.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        console.error(err);
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} event berhasil dihapus`);
      setEvents((prev) => prev.filter((e) => !selectedRows.includes(e.id)));
      setSelectedRows([]);
      setBulkDeleteModal(false);
    }
    if (failCount > 0) {
      toast.error(`Gagal menghapus ${failCount} event`);
    }
    setDeleteLoading(false);
  };

  const handleStatusUpdate = async (id: number, status: "published" | "rejected") => {
    try {
      const res = await updateEventStatus(id, status);
      if (res.success) {
        toast.success(res.message || "Status berhasil diperbarui");
        setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
        if (selectedEvent && selectedEvent.id === id) {
          setSelectedEvent((prev) => (prev ? { ...prev, status } : null));
        }
      } else {
        toast.error(res.error || "Gagal update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan");
    }
  };

  const openDetail = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  const openEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditOpen(true);
  };

  const handleEditSuccess = () => {
    router.refresh();
  };

  const getPageButtons = (): (number | string)[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1, 2, 3];
    if (currentPage > 4) pages.push("...");
    if (currentPage > 3 && currentPage < totalPages - 1) pages.push(currentPage);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const showFrom = sortedEvents.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1;
  const showTo = Math.min(currentPage * ROWS_PER_PAGE, sortedEvents.length);

  return (
    <>
      <div className="flex-1 p-6 bg-gray-50 min-h-screen overflow-y-auto">
        {/* Header */}
        <h1 className="text-xl font-bold text-gray-800 mb-5">Manajemen Event</h1>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            {/* Status Tabs */}
            <div className="flex items-center border-b border-slate-100 gap-1">
              {[
                { id: "all", label: "Semua", count: events.length },
                { id: "pending", label: "Menunggu", count: events.filter((e) => e.status === "pending").length },
                { id: "published", label: "Disetujui", count: events.filter((e) => e.status === "published").length },
                { id: "rejected", label: "Ditolak", count: events.filter((e) => e.status === "rejected").length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusTab(tab.id as "all" | "pending" | "published" | "rejected")}
                  className={cn(
                    "px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5",
                    statusTab === tab.id
                      ? "border-slate-900 text-slate-900 font-bold"
                      : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-full text-[9px] font-bold",
                      statusTab === tab.id ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Bulk delete bar */}
            {selectedRows.length > 0 && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
                <span className="text-xs font-semibold text-red-600">{selectedRows.length} event dipilih</span>
                <button
                  onClick={() => setBulkDeleteModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                >
                  <Trash2 className="w-3 h-3" />
                  Hapus Massal
                </button>
                <button onClick={() => setSelectedRows([])} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-end mb-5">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Cari Event</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Judul atau penyelenggara..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-100 text-gray-700"
                />
              </div>
            </div>
            <div className="min-w-[140px]">
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Kategori</label>
              <select
                value={typeInput}
                onChange={(e) => setTypeInput(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-gray-50 focus:outline-none text-gray-700"
              >
                <option value="all">Semua Jenis</option>
                <option value="seminar">Seminar</option>
                <option value="conference">Conference</option>
              </select>
            </div>
            <div className="min-w-[140px]">
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Urutan</label>
              <select
                value={sortInput}
                onChange={(e) => setSortInput(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-gray-50 focus:outline-none text-gray-700"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="name_asc">Nama (A-Z)</option>
                <option value="name_desc">Nama (Z-A)</option>
              </select>
            </div>
            <div>
              <button
                type="button"
                onClick={handleApplyFilters}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm h-[30px] flex items-center justify-center"
              >
                Terapkan
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-hidden">
            <table className="w-full text-xs table-fixed">
              <thead className="bg-slate-50 border-b border-slate-200/60">
                <tr>
                  <th className="px-3 py-2.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={toggleAll}
                      className="accent-slate-900 cursor-pointer w-3.5 h-3.5"
                    />
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider w-[22%]">
                    Penyelenggara & Waktu
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider w-[22%]">
                    Kategori & Info
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider w-28">
                    Pendaftar / Kuota
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider w-20">
                    Status
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider w-28">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-2 border border-slate-100 shadow-inner">
                        <Search className="text-slate-300" size={16} />
                      </div>
                      Tidak ada data ditemukan
                    </td>
                  </tr>
                ) : (
                  paginatedEvents.map((event, index) => (
                    <tr
                      key={event.id}
                      className={cn(
                        "hover:bg-slate-50/25 transition-colors",
                        selectedRows.includes(event.id) && "bg-blue-50/30"
                      )}
                    >
                      <td className="px-3 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(event.id)}
                          onChange={() => toggleRow(event.id)}
                          className="accent-slate-900 cursor-pointer w-3.5 h-3.5"
                        />
                      </td>
                      <td className="px-3 py-2.5 overflow-hidden">
                        <div className="flex items-center gap-2.5 text-left w-full">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200/60">
                            {event.bannerUrl ? (
                              <img src={event.bannerUrl} alt={event.judul} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                                <Building2 size={14} />
                              </div>
                            )}
                          </div>
                          <div className="overflow-hidden flex-1 min-w-0">
                            <button
                              onClick={() => openDetail(event)}
                              className="font-semibold text-gray-800 text-[13px] hover:text-slate-700 transition-colors text-left block truncate w-full"
                              title={event.judul}
                            >
                              {event.judul}
                            </button>
                            <div className="text-[10px] text-gray-400 mt-0.5 truncate">
                              {event.isEventPolines ? "Internal Polines" : "Eksternal Umum"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 overflow-hidden">
                        <div className="font-semibold text-gray-700 truncate w-full">
                          {event.penyelenggara || "Institusi Polines"}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <Clock size={10} />
                          {format(new Date(event.tanggalMulai), "dd MMM yyyy", { locale: id })}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={cn(
                              "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold border tracking-wider whitespace-nowrap",
                              event.jenisEvent === "conference"
                                ? "bg-blue-50 text-blue-700 border-blue-200/60"
                                : "bg-indigo-50 text-indigo-700 border-indigo-200/60"
                            )}
                          >
                            {event.jenisEvent === "conference" ? "Konferensi" : "Seminar"}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                            {event.tipePlatform === "offline" ? "Luring" : event.tipePlatform === "online" ? "Daring" : "Hybrid"}
                            {" • "}
                            {event.tipeHarga === "free" ? "Gratis" : event.harga ? `Rp ${event.harga.toLocaleString("id-ID")}` : "Rp 0"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-50 text-slate-700 rounded-full text-xs font-semibold border border-slate-200/60">
                          <Users size={11} />
                          {event.participantCount || 0} / {event.kuota || "∞"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {event.status === "pending" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider bg-amber-50 text-amber-700 border-amber-200/60 whitespace-nowrap">
                            Menunggu
                          </span>
                        ) : event.status === "published" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200/60 whitespace-nowrap">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider bg-rose-50 text-rose-700 border-rose-200/60 whitespace-nowrap">
                            Ditolak
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => openDetail(event)}
                            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-all duration-200 hover:scale-110 active:scale-90 shadow-sm"
                            title="Lihat Detail"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEdit(event)}
                            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-all duration-200 hover:scale-110 active:scale-90 shadow-sm"
                            title="Edit Event"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteModal(event.id)}
                            className="w-6 h-6 rounded-lg bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-600 transition-all duration-200 hover:scale-110 active:scale-90 shadow-sm"
                            title="Hapus Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
            <span className="text-xs text-gray-400">
              Menampilkan <b className="text-gray-600">{showFrom}</b> – <b className="text-gray-600">{showTo}</b> dari{" "}
              <b className="text-gray-600">{sortedEvents.length.toLocaleString("id-ID")}</b> event
            </span>
            <div className="flex gap-1 items-center">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
              </button>
              {getPageButtons().map((p, i) =>
                p === "..." ? (
                  <span key={`d${i}`} className="text-gray-400 px-1 text-xs">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    className={cn(
                      "w-7 h-7 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95",
                      currentPage === p
                        ? "bg-slate-900 text-white shadow-sm"
                        : "border border-gray-200 bg-white text-slate-600 hover:bg-gray-50"
                    )}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEvent && (
        <DataEvent
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          event={selectedEvent}
          onUpdateStatus={handleStatusUpdate}
        />
      )}

      {/* Edit Modal */}
      {selectedEvent && (
        <EditEvent
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          event={selectedEvent}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Single Delete Modal */}
      {deleteModal !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-80 animate-in zoom-in-95 duration-200">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Hapus Event</h3>
            <p className="text-xs text-gray-500 mb-5">
              Apakah kamu yakin ingin menghapus event ini? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={deleteLoading}
                className="px-4 py-1.5 text-xs font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
                disabled={deleteLoading}
                className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {deleteLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {bulkDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-80 animate-in zoom-in-95 duration-200">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Hapus Massal</h3>
            <p className="text-xs text-gray-500 mb-5">
              Kamu akan menghapus <b>{selectedRows.length} event</b> sekaligus. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setBulkDeleteModal(false)}
                disabled={deleteLoading}
                className="px-4 py-1.5 text-xs font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={deleteLoading}
                className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {deleteLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                Hapus {selectedRows.length} Event
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
