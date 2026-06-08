"use client";

import { useState, useEffect, useCallback } from "react";
import { ClipboardList } from "lucide-react";
import type { PendingEvent } from "@/actions/persetujuan-event";
import { getPendingEvents, updateEventStatus, getEventStats } from "@/actions/persetujuan-event";
import { PAGE_SIZE } from "@/constants/persetujuan";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StatCards, FilterBar, EventTable, Pagination, ReviewModal, ConfirmModal } from "./PersetujuanComponents";

type Props = {
  initialPendingCount: number;
  initialApprovedCount: number;
  initialRejectedCount: number;
};

export function PersetujuanClient({ initialPendingCount, initialApprovedCount, initialRejectedCount }: Props) {
  const [events, setEvents] = useState<PendingEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedEvent, setSelectedEvent] = useState<PendingEvent | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    id: number;
    status: "pending" | "published" | "rejected";
  } | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const [stats, setStats] = useState({
    pendingCount: initialPendingCount,
    approvedCount: initialApprovedCount,
    rejectedCount: initialRejectedCount,
  });

  const fetchPage = useCallback(async (page: number) => {
    setLoading(true);
    const result = await getPendingEvents(page, PAGE_SIZE);
    if (result.success) {
      setEvents(result.data);
      setTotal(result.total);
    }
    setLoading(false);
  }, []);

  const refreshStats = useCallback(async () => {
    const result = await getEventStats();
    if (result.success) {
      setStats({
        pendingCount: result.pendingCount,
        approvedCount: result.approvedCount,
        rejectedCount: result.rejectedCount,
      });
    }
  }, []);

  useEffect(() => {
    fetchPage(1);
    refreshStats();
  }, [fetchPage, refreshStats]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-status-dropdown]")) {
        setShowStatusDropdown(false);
      }
      setOpenDropdownId(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearchInput = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const selectSearchResult = useCallback((judul: string) => {
    setSearchQuery(judul);
  }, []);

  const handleStatusSelect = useCallback((status: string) => {
    setStatusFilter(status);
    setShowStatusDropdown(false);
  }, []);

  const handleStatusChange = useCallback(
    (id: number, status: "pending" | "published" | "rejected") => {
      setConfirmAction({ id, status });
      setOpenDropdownId(null);
    },
    []
  );

  const executeStatusChange = useCallback(async () => {
    if (!confirmAction) return;
    await updateEventStatus(confirmAction.id, confirmAction.status);
    setConfirmAction(null);
    fetchPage(currentPage);
    refreshStats();
  }, [confirmAction, currentPage, fetchPage, refreshStats]);

  // Client-side filter (applied on top of server pagination)
  const filtered = events.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (searchQuery && !e.judul.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const showFrom = total > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const showTo = Math.min(currentPage * PAGE_SIZE, total);

  return (
    <div className="space-y-10 pb-10">
      <section>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Validasi Pengajuan Baru</h1>
        <p className="text-gray-500 mt-2 font-medium">Tinjau dan kelola pendaftaran event baru dari penyelenggara.</p>
      </section>

      <StatCards
        pendingCount={stats.pendingCount}
        approvedCount={stats.approvedCount}
        rejectedCount={stats.rejectedCount}
      />

      <section className="bg-white rounded-[24px] shadow-sm border border-gray-50 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Daftar Registrasi Event</h2>
          <FilterBar
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            showStatusDropdown={showStatusDropdown}
            onSearchChange={handleSearchInput}
            onClearSearch={clearSearch}
            onSelectSearchResult={selectSearchResult}
            onStatusSelect={handleStatusSelect}
            onToggleStatusDropdown={() => setShowStatusDropdown((v) => !v)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4 text-slate-300">
              <ClipboardList size={48} />
            </div>
            <p className="text-gray-500 font-medium">Belum ada event.</p>
          </div>
        ) : (
          <div>
            <EventTable
              events={filtered}
              openDropdownId={openDropdownId}
              onPreview={setSelectedEvent}
              onToggleDropdown={(id) => setOpenDropdownId(openDropdownId === id ? null : id)}
              onStatusChange={handleStatusChange}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              showFrom={showFrom}
              showTo={showTo}
              totalItems={total}
              onChange={(page) => fetchPage(page)}
            />
          </div>
        )}
      </section>

      <ReviewModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRefresh={() => {
          fetchPage(currentPage);
          refreshStats();
        }}
      />

      <ConfirmModal
        isOpen={!!confirmAction}
        onConfirm={executeStatusChange}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
