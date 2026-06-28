"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Search,
  Download,
  Loader2,
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
  AlertCircle,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// ============================================================
// TIPE DATA
// ============================================================
type StatusPendaftaran = "terdaftar" | "menunggu_verifikasi" | "lunas" | "dibatalkan" | "hadir";

interface PesertaData {
  pendaftaranId: number;
  kodePendaftaran: string;
  status: StatusPendaftaran;
  dibuatPada: string;
  buktiPembayaran: string | null;
  namaEvent: string;
  tipeHarga: "free" | "paid";
  urlAvatar?: string | null;
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
  if (status === "hadir" || status === "terdaftar" || status === "lunas") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-micro font-semibold border border-green-300 bg-green-50 text-green-600">
        <CheckCircle size={13} strokeWidth={2.5} />
        Disetujui
      </span>
    );
  }
  if (status === "menunggu_verifikasi") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-micro font-semibold border border-yellow-300 bg-yellow-50 text-yellow-600">
        <Clock size={13} strokeWidth={2.5} />
        Menunggu
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-micro font-semibold border border-red-300 bg-red-50 text-red-500">
      <UserX size={13} strokeWidth={2.5} />
      Ditolak
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
  if (status === "menunggu_verifikasi") {
    return (
      <div className="flex items-center gap-1.5">
        <Button
          onClick={onVerify}
          disabled={disabled}
          variant="success"
          size="icon"
          aria-label="Verifikasi"
        >
          <Check size={14} strokeWidth={2.5} />
        </Button>
        <Button
          onClick={onTolak}
          disabled={disabled}
          variant="destructive"
          size="icon"
          aria-label="Tolak"
        >
          <X size={14} strokeWidth={2.5} />
        </Button>
      </div>
    );
  }
  if (status === "dibatalkan") {
    return (
      <div className="flex items-center gap-1.5">
        <Button
          onClick={onDetail}
          disabled={disabled}
          variant="ghost"
          size="icon"
          aria-label="Detail"
        >
          <Info size={14} strokeWidth={2.5} />
        </Button>
        <Button
          onClick={onEdit}
          disabled={disabled}
          variant="ghost"
          size="icon"
          aria-label="Pulihkan"
        >
          <RotateCcw size={14} strokeWidth={2.5} />
        </Button>
      </div>
    );
  }
  // status === "hadir" (TERVERIFIKASI)
  return (
    <div className="flex items-center gap-1.5">
      <Button
        onClick={onEdit}
        disabled={disabled}
        variant="ghost"
        size="icon"
        aria-label="Ubah ke Menunggu"
      >
        <RotateCcw size={15} strokeWidth={2} />
      </Button>
      <Button
        onClick={onDelete}
        disabled={disabled}
        variant="destructive"
        size="icon"
        aria-label="Hapus/Tolak"
      >
        <Trash2 size={15} strokeWidth={2} />
      </Button>
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
  const isPdf = /\.pdf$/i.test(url);
  const hasImageExt = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(url);
  const isKnownImageHost = /picsum\.photos|unsplash\.com|images\.unsplash/i.test(url);
  const isImage = hasImageExt || (isKnownImageHost && !isPdf);

  return (
    <Modal open onClose={onClose} title="Lampiran Bukti Pembayaran" className="max-w-2xl">
      <p className="text-xs text-gray-400 mb-4">{nama}</p>
      <div className="flex items-center gap-2 mb-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2b4b] text-white text-xs font-medium rounded-lg hover:bg-sisc-med transition-colors"
        >
          <ExternalLink size={12} />
          Buka di Tab Baru
        </a>
      </div>
      <div
        className="bg-gray-50 rounded-xl flex items-center justify-center"
        style={{ minHeight: 320, maxHeight: "60vh", overflow: "auto" }}
      >
        {isImage ? (
          <div className="relative w-full rounded-xl shadow-md overflow-hidden" style={{ maxHeight: "55vh", minHeight: 200 }}>
            <Image
              src={url}
              alt={`Lampiran ${nama}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
              unoptimized
            />
          </div>
        ) : isPdf ? (
          <iframe
            src={url}
            className="w-full rounded-xl border-0"
            style={{ height: "55vh" }}
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
    </Modal>
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
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [lampiran, setLampiran] = useState<{ url: string; nama: string } | null>(null);
  const [exporting, setExporting] = useState(false);
  const [rejectModal, setRejectModal] = useState<{ pendaftaranId: number | null, reason: string }>({ pendaftaranId: null, reason: "" });

  const PER_PAGE = 10;

  //  Fetch data 
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        status: filterStatus,
        sort: sortBy,
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
  }, [search, filterStatus, sortBy, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset ke hal 1 saat filter/search berubah
  useEffect(() => {
    setPage(1);
  }, [search, filterStatus, sortBy]);

  // ── Update status ──────────────────────────────────────────────
  const updateStatus = async (pendaftaranId: number, newStatus: StatusPendaftaran, alasanPenolakan?: string) => {
    setActionLoading(pendaftaranId);
    try {
      const body: { pendaftaranId: number; status: StatusPendaftaran; alasanPenolakan?: string } = { pendaftaranId, status: newStatus };
      if (alasanPenolakan) {
        body.alasanPenolakan = alasanPenolakan;
      }

      const res = await fetch("/api/organizer/peserta", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(`Status berhasil diperbarui.`);
        await fetchData();
      } else {
        toast.error("Gagal memperbarui status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setActionLoading(null);
    }
  };

  //  Export Excel 
  const exportExcel = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams({
        search,
        status: filterStatus,
        sort: sortBy,
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
        "Status": (p.status === "hadir" || p.status === "terdaftar" || p.status === "lunas") ? "DISETUJUI" : p.status === "menunggu_verifikasi" ? "MENUNGGU" : "DITOLAK",
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

  //  Pagination logic 
  const totalPages = Math.ceil(totalData / PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Data & Validasi Peserta</h1>
        <p className="text-sm text-gray-500 mt-0.5">Validasi Peserta</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative min-w-[200px] sm:min-w-[300px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari peserta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-700 font-medium"
          />
        </div>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 flex-1 text-sm border border-gray-200 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-600 font-semibold cursor-pointer"
        >
          <option value="semua">Semua Status</option>
          <option value="hadir">Terverifikasi</option>
          <option value="menunggu_verifikasi">Menunggu</option>
          <option value="dibatalkan">Ditolak</option>
        </Select>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 flex-1 text-sm border border-gray-200 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-600 font-semibold cursor-pointer"
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="name_asc">Nama A-Z</option>
          <option value="name_desc">Nama Z-A</option>
        </Select>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-800 text-sm">
            Daftar Peserta{" "}
            <span className="text-gray-400 font-normal">({totalData} Total)</span>
          </p>
          <Button
            onClick={exportExcel}
            disabled={exporting}
            loading={exporting}
            variant="outline"
            size="sm"
          >
            <Download size={13} />
            Export Excel
          </Button>
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
                          {item.urlAvatar ? (
                            <Image
                              src={item.urlAvatar}
                              alt={nama}
                              width={36}
                              height={36}
                              className="w-9 h-9 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div
                              className={`w-9 h-9 rounded-full ${warnaBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}
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
                      <td className="px-5 py-3.5 text-center">
                        {item.tipeHarga === "free" ? (
                          <span className="text-gray-400 font-bold text-lg">-</span>
                        ) : item.buktiPembayaran ? (
                          <Button
                            onClick={() =>
                              setLampiran({ url: item.buktiPembayaran!, nama: nama })
                            }
                            variant="outline"
                            size="sm"
                            className="mx-auto"
                          >
                            <Paperclip size={12} />
                            Lihat File
                          </Button>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 text-rose-500">
                            <AlertCircle size={14} />
                            <span className="text-xs font-semibold">Belum Upload</span>
                          </div>
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
                          onTolak={() => setRejectModal({ pendaftaranId: item.pendaftaranId, reason: "" })}
                          onEdit={() => updateStatus(item.pendaftaranId, "menunggu_verifikasi")}
                          onDelete={() => setRejectModal({ pendaftaranId: item.pendaftaranId, reason: "" })}
                          onDetail={() =>
                            item.buktiPembayaran
                              ? setLampiran({ url: item.buktiPembayaran, nama: nama })
                              : toast.error("Bukti pembayaran tidak tersedia.")
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

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalData}
          itemsPerPage={PER_PAGE}
          onPageChange={setPage}
          itemLabel="peserta"
        />
      </div>

      {/* Popup Lampiran */}
      {lampiran && (
        <LampiranPopup
          url={lampiran.url}
          nama={lampiran.nama}
          onClose={() => setLampiran(null)}
        />
      )}

      {/* Reject Reason Modal */}
      {rejectModal.pendaftaranId !== null && (
        <Modal open onClose={() => setRejectModal({ pendaftaranId: null, reason: "" })} className="max-w-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-2">Tolak Pendaftaran Peserta</h3>
          <p className="text-xs text-gray-500 mb-4">Silakan tuliskan alasan penolakan agar peserta dapat mengetahuinya (misal: Bukti pembayaran tidak valid).</p>
          
          <Textarea
            value={rejectModal.reason}
            onChange={(e) => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
            placeholder="Misal: Bukti pembayaran buram / kurang jelas..."
            rows={3}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none mb-5"
          />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setRejectModal({ pendaftaranId: null, reason: "" })}>
              Batal
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => {
                if (!rejectModal.reason.trim()) {
                  toast.error("Alasan penolakan tidak boleh kosong.");
                  return;
                }
                updateStatus(rejectModal.pendaftaranId!, "dibatalkan", rejectModal.reason);
                setRejectModal({ pendaftaranId: null, reason: "" });
              }}
            >
              Kirim Penolakan
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
