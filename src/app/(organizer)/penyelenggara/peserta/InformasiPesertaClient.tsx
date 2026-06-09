"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  X,
  ExternalLink,
  CheckCircle,
  Clock,
  UserX,
  Check,
  Info,
  RotateCcw,
  Trash2,
} from "lucide-react";
import * as XLSX from "xlsx";
import Portal from "@/components/ui/Portal";

// ============================================================
// TIPE DATA
// ============================================================
type StatusPendaftaran = "terdaftar" | "dibatalkan" | "hadir";

interface PesertaData {
  pendaftaranId: number;
  kodePendaftaran: string;
  status: StatusPendaftaran;
  dibuatPada: string;
  buktiPembayaran: string | null;
  namaEvent: string;
  avatarUrl?: string | null;
  peserta: {
    id: number;
    namaLengkap: string;
    email: string;
    nomorTelepon: string;
    jenisKelamin: string | null;
  } | null;
}

// ============================================================
// HELPERS
// ============================================================
const getInisial = (nama: string) => {
  const parts = nama.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : nama.slice(0, 2).toUpperCase();
};

const getBgColorClass = (nama: string) => {
  const colors = [
    "bg-indigo-600",
    "bg-sky-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-violet-500",
    "bg-pink-500",
  ];
  let hash = 0;
  for (let i = 0; i < nama.length; i++) hash = nama.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

// ============================================================
// KOMPONEN STATUS BADGE (Sesuai Desain Asli)
// ============================================================
function StatusBadge({ status }: { status: StatusPendaftaran }) {
  if (status === "hadir") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border border-green-300 bg-green-50 text-green-600">
        <CheckCircle size={13} strokeWidth={2.5} />
        DISETUJUI
      </span>
    );
  }
  if (status === "terdaftar") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border border-yellow-300 bg-yellow-50 text-yellow-600">
        <Clock size={13} strokeWidth={2.5} />
        MENUNGGU
      </span>
    );
  }
  // dibatalkan
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border border-red-300 bg-red-50 text-red-500">
      <UserX size={13} strokeWidth={2.5} />
      DITOLAK
    </span>
  );
}

// ============================================================
// KOMPONEN ACTION BUTTONS (Sesuai Desain Asli)
// ============================================================
function ActionButtons({
  status,
  onVerify,
  onTolak,
  onEdit,
  onDelete,
  onDetail,
  disabled,
}: {
  status: StatusPendaftaran;
  onVerify: () => void;
  onTolak: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDetail: () => void;
  disabled: boolean;
}) {
  if (status === "terdaftar") {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={onVerify}
          disabled={disabled}
          title="Verifikasi"
          className="w-7 h-7 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check size={14} strokeWidth={2.5} />
        </button>
        <button
          onClick={onTolak}
          disabled={disabled}
          title="Tolak"
          className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>
    );
  }
  if (status === "dibatalkan") {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={onDetail}
          disabled={disabled}
          title="Detail"
          className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Info size={14} strokeWidth={2.5} />
        </button>
        <button
          onClick={onEdit}
          disabled={disabled}
          title="Pulihkan"
          className="w-7 h-7 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw size={14} strokeWidth={2.5} />
        </button>
      </div>
    );
  }
  // status === "hadir" (TERVERIFIKASI)
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onEdit}
        disabled={disabled}
        title="Ubah ke Menunggu"
        className="text-gray-400 hover:text-blue-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RotateCcw size={15} strokeWidth={2} />
      </button>
      <button
        onClick={onDelete}
        disabled={disabled}
        title="Hapus/Tolak"
        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 size={15} strokeWidth={2} />
      </button>
    </div>
  );
}

// ============================================================
// KOMPONEN LAMPIRAN POPUP (Sesuai Desain Asli)
// ============================================================
function LampiranPopup({
  url,
  nama,
  onClose,
}: {
  url: string;
  nama: string;
  onClose: () => void;
}) {
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isPdf = /\.pdf$/i.test(url);

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-5 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
      <div
        className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-bold text-gray-800">Lampiran Bukti Pembayaran</p>
            <p className="text-xs text-gray-400 mt-0.5">{nama}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2b4b] text-white text-xs font-medium rounded-lg hover:bg-[#243560] transition-colors"
            >
              <ExternalLink size={12} />
              Buka di Tab Baru
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Konten */}
        <div
          className="p-5 bg-gray-50 flex items-center justify-center"
          style={{ minHeight: 320, maxHeight: "70vh", overflow: "auto" }}
        >
          {isImage ? (
            <img
              src={url}
              alt={`Lampiran ${nama}`}
              className="max-w-full rounded-xl shadow-md object-contain"
              style={{ maxHeight: "60vh" }}
            />
          ) : isPdf ? (
            <iframe
              src={url}
              className="w-full rounded-xl border-0"
              style={{ height: "60vh" }}
              title="PDF Lampiran"
            />
          ) : (
            <div className="text-center py-10">
              <div className="flex justify-center mb-3 text-slate-300">
                <Paperclip size={48} />
              </div>
              <p className="text-sm text-slate-500 mb-3">Berkas tidak dapat dipreview</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-900 hover:text-slate-700 hover:underline font-bold"
              >
                Unduh Berkas
              </a>
            </div>
          )}
        </div>
      </div>
      </div>
    </Portal>
  );
}

// ============================================================
// KOMPONEN UTAMA
// ============================================================
export default function InformasiPesertaClient() {
  const [pesertaList, setPesertaList] = useState<PesertaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [lampiran, setLampiran] = useState<{ url: string; nama: string } | null>(null);
  const [exporting, setExporting] = useState(false);

  const PER_PAGE = 10;

  // ── Fetch data ──────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        status: filterStatus,
        page: String(page),
        perPage: String(PER_PAGE),
      });
      const res = await fetch(`/api/organizer/peserta?${params}`);
      const json = await res.json();
      setPesertaList(json.data ?? []);
      setTotalData(json.total ?? 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset ke hal 1 saat filter/search berubah
  useEffect(() => {
    setPage(1);
  }, [search, filterStatus]);

  // ── Update status ────────────────────────────────────────────
  const updateStatus = async (pendaftaranId: number, newStatus: StatusPendaftaran) => {
    setActionLoading(pendaftaranId);
    try {
      await fetch("/api/organizer/peserta", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendaftaranId, status: newStatus }),
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Export Excel ───────────────────────────────────────────────
  const exportExcel = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams({
        search,
        status: filterStatus,
        page: "1",
        perPage: "99999",
      });
      const res = await fetch(`/api/organizer/peserta?${params}`);
      const json = await res.json();
      const allData: PesertaData[] = json.data ?? [];

      const excelData = allData.map((p, i) => ({
        "No.": i + 1,
        "Peserta": p.peserta?.namaLengkap ?? "-",
        "Event": p.namaEvent,
        "Email": p.peserta?.email ?? "-",
        "Nomor HP": p.peserta?.nomorTelepon ?? "-",
        "Status": p.status === "hadir" ? "DISETUJUI" : p.status === "terdaftar" ? "MENUNGGU" : "DITOLAK",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Peserta");
      XLSX.writeFile(workbook, `Peserta_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error("Export Excel gagal:", err);
    } finally {
      setExporting(false);
    }
  };

  // ── Pagination logic ─────────────────────────────────────────
  const totalPages = Math.ceil(totalData / PER_PAGE);
  const startItem = totalData === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const endItem = Math.min(page * PER_PAGE, totalData);

  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1, 2, 3];
    if (page > 4) pages.push("...");
    if (page > 3 && page < totalPages - 1) pages.push(page);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 font-heading">Data & Validasi Peserta</h1>
        <p className="text-sm text-gray-500 mt-0.5">Validasi Peserta</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama peserta, email, atau nomor telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-700 font-medium"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-w-[160px] text-slate-600 font-semibold cursor-pointer"
        >
          <option value="semua">Semua Status</option>
          <option value="hadir">Terverifikasi</option>
          <option value="terdaftar">Menunggu</option>
          <option value="dibatalkan">Ditolak</option>
        </select>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-800 text-sm">
            Daftar Peserta{" "}
            <span className="text-gray-400 font-normal">({totalData} Total)</span>
          </p>
          <button
            onClick={exportExcel}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Download size={13} />
            )}
            {exporting ? "Mengekspor..." : "Export Excel"}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3 text-center font-semibold w-12">No.</th>
                <th className="px-5 py-3 text-left font-semibold">Peserta & Event</th>
                <th className="px-5 py-3 text-left font-semibold">Email</th>
                <th className="px-5 py-3 text-left font-semibold">Nomor HP</th>
                <th className="px-5 py-3 text-left font-semibold">Lampiran</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin text-slate-400" size={24} />
                      <span className="text-xs font-medium">Memuat data peserta...</span>
                    </div>
                  </td>
                </tr>
              ) : pesertaList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm italic">
                    Tidak ada data peserta ditemukan.
                  </td>
                </tr>
              ) : (
                pesertaList.map((item, index) => {
                  const nama = item.peserta?.namaLengkap ?? "Peserta";
                  const event = item.namaEvent;
                  const email = item.peserta?.email ?? "-";
                  const noHp = item.peserta?.nomorTelepon ?? "-";
                  const inisial = getInisial(nama);
                  const warnaBg = getBgColorClass(nama);
                  const isActionLoading = actionLoading === item.pendaftaranId;

                  return (
                    <tr key={item.pendaftaranId} className="hover:bg-gray-50/60 transition-colors">
                      {/* No */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-xs font-semibold text-gray-400">
                          {(page - 1) * PER_PAGE + index + 1}
                        </span>
                      </td>

                      {/* Peserta & Event */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {item.avatarUrl ? (
                            <img
                              src={item.avatarUrl}
                              alt={nama}
                              className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div
                              className={`w-9 h-9 rounded-full ${warnaBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                            >
                              {inisial}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{nama}</p>
                            <p className="text-xs text-gray-400">{event}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3.5 text-gray-600 text-sm">{email}</td>

                      {/* No HP */}
                      <td className="px-5 py-3.5 text-gray-600 text-sm">{noHp}</td>

                      {/* Lampiran */}
                      <td className="px-5 py-3.5">
                        {item.buktiPembayaran ? (
                          <button
                            onClick={() =>
                              setLampiran({ url: item.buktiPembayaran!, nama: nama })
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Paperclip size={12} />
                            Lihat File
                          </button>
                        ) : (
                          <span className="text-gray-300 text-sm">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-3.5">
                        <ActionButtons
                          status={item.status}
                          onVerify={() => updateStatus(item.pendaftaranId, "hadir")}
                          onTolak={() => updateStatus(item.pendaftaranId, "dibatalkan")}
                          onEdit={() => updateStatus(item.pendaftaranId, "terdaftar")}
                          onDelete={() => updateStatus(item.pendaftaranId, "dibatalkan")}
                          onDetail={() =>
                            item.buktiPembayaran
                              ? setLampiran({ url: item.buktiPembayaran, nama: nama })
                              : alert("Bukti pembayaran tidak tersedia.")
                          }
                          disabled={isActionLoading}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalData > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 flex-wrap gap-3">
            <span className="text-xs text-slate-400 font-semibold">
              Menampilkan <span className="text-slate-700">{startItem}</span> – <span className="text-slate-700">{endItem}</span> dari <span className="text-slate-700 font-bold">{totalData}</span> peserta
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-all duration-200 hover:scale-105 active:scale-95 text-slate-500"
              >
                <ChevronLeft size={13} />
              </button>
              {getPageNumbers().map((pg, idx) =>
                pg === "..." ? (
                  <span key={`dots-${idx}`} className="text-gray-400 px-1 text-xs font-semibold">
                    ...
                  </span>
                ) : (
                  <button
                    key={pg}
                    onClick={() => setPage(pg as number)}
                    className={`w-7 h-7 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center ${
                      page === pg
                        ? "bg-slate-900 text-white shadow-sm"
                        : "border border-gray-200 bg-white text-slate-600 hover:bg-gray-50"
                    }`}
                  >
                    {pg}
                  </button>
                )
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-all duration-200 hover:scale-105 active:scale-95 text-slate-500"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Popup Lampiran */}
      {lampiran && (
        <LampiranPopup
          url={lampiran.url}
          nama={lampiran.nama}
          onClose={() => setLampiran(null)}
        />
      )}
    </div>
  );
}
