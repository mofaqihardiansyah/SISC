"use client";

// ─── ValidasiAksesPenyelenggaraClient.tsx (Client Component) ─────────────────
// Lokasi: src/app/(admin)/ValidasiAksesPenyelenggara/ValidasiAksesPenyelenggaraClient.tsx

import { useState, useMemo, useTransition } from "react";
import { Search, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import type { PenyelenggaraItem, StatusValidasi } from "@/types/penyelenggara";

const PAGE_SIZE = 6;

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: StatusValidasi }) {
  const config: Record<StatusValidasi, { label: string; className: string }> = {
    approved: { label: "DISETUJUI", className: "bg-teal-100 text-teal-700" },
    pending:  { label: "MENUNGGU",  className: "bg-violet-100 text-violet-700" },
    rejected: { label: "DITOLAK",   className: "bg-red-100 text-red-600" },
  };
  const { label, className } = config[status];
  return (
    <span className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-semibold tracking-wide ${className}`}>
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
    <div className="flex items-center gap-2">
      {/* Setujui */}
      <button
        onClick={() => onChangeStatus("approved")}
        disabled={isLoading}
        title="Setujui"
        aria-label="Setujui"
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150 active:scale-90 disabled:cursor-not-allowed disabled:opacity-50
          ${currentStatus === "approved"
            ? "bg-teal-500 ring-2 ring-teal-300 ring-offset-1"
            : "bg-teal-500 opacity-70 hover:opacity-100"
          }`}
      >
        <Check className="h-4 w-4 text-white" strokeWidth={2.5} />
      </button>

      {/* Tolak */}
      <button
        onClick={() => onChangeStatus("rejected")}
        disabled={isLoading}
        title="Tolak"
        aria-label="Tolak"
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150 active:scale-90 disabled:cursor-not-allowed disabled:opacity-50
          ${currentStatus === "rejected"
            ? "bg-red-500 ring-2 ring-red-300 ring-offset-1"
            : "bg-red-500 opacity-70 hover:opacity-100"
          }`}
      >
        <X className="h-4 w-4 text-white" strokeWidth={2.5} />
      </button>
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
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // ─── Filter ──────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return data;
    return data.filter(
      (d) =>
        d.id.includes(q) ||
        d.namaOrganisasi.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.noTelepon.includes(q)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const goPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ─── Update Status via API ────────────────────────────────────────────────

  const handleChangeStatus = (rawId: number, status: StatusValidasi) => {
    // Simpan status lama untuk rollback jika gagal
    const prevStatus = data.find((d) => d.rawId === rawId)?.status;

    // Optimistic update — UI langsung berubah
    setData((prev) =>
      prev.map((item) => (item.rawId === rawId ? { ...item, status } : item))
    );
    setLoadingId(rawId);
    setErrorMsg(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: rawId, status }),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          // Rollback jika gagal
          setData((prev) =>
            prev.map((item) =>
              item.rawId === rawId && prevStatus
                ? { ...item, status: prevStatus }
                : item
            )
          );
          setErrorMsg(result.message ?? "Gagal memperbarui status.");
        }
      } catch {
        // Rollback jika network error
        setData((prev) =>
          prev.map((item) =>
            item.rawId === rawId && prevStatus
              ? { ...item, status: prevStatus }
              : item
          )
        );
        setErrorMsg("Terjadi kesalahan jaringan. Silakan coba lagi.");
      } finally {
        setLoadingId(null);
      }
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Persetujuan Hak Akses Penyelenggara
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Verifikasi Penyelenggara yang sudah meregistrasikan akun
        </p>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <X className="h-4 w-4 shrink-0" />
          {errorMsg}
          <button
            onClick={() => setErrorMsg(null)}
            className="ml-auto text-red-400 hover:text-red-600"
            aria-label="Tutup pesan error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-5 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
        <Search className="h-4 w-4 shrink-0 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Cari nama organisasi, email, atau ID..."
          className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
        />
        {search && (
          <button
            onClick={() => handleSearch("")}
            className="shrink-0 text-gray-400 hover:text-gray-600"
            aria-label="Hapus pencarian"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              {["ID", "Nama Organisasi", "Email", "No. Telepon", "Status", "Validasi"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
                  Tidak ada data yang sesuai dengan pencarian.
                </td>
              </tr>
            ) : (
              pageItems.map((item) => (
                <tr
                  key={item.rawId}
                  className={`transition-colors duration-100 hover:bg-gray-50 ${
                    loadingId === item.rawId ? "opacity-60" : ""
                  }`}
                >
                  <td className="px-6 py-4 text-gray-500">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.namaOrganisasi}</td>
                  <td className="px-6 py-4 text-gray-500">{item.email}</td>
                  <td className="px-6 py-4 text-gray-700">{item.noTelepon}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4">
                    <ValidationButtons
                      currentStatus={item.status}
                      isLoading={loadingId === item.rawId}
                      onChangeStatus={(status) => handleChangeStatus(item.rawId, status)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-5 flex items-center justify-end gap-1.5">
        <button
          onClick={() => goPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Halaman sebelumnya"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => goPage(page)}
            aria-label={`Halaman ${page}`}
            className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm font-medium transition-colors
              ${page === currentPage
                ? "border-gray-800 bg-gray-800 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => goPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Halaman berikutnya"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}