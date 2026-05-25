"use client";

import { useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  X,
  ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "TERVERIFIKASI" | "MENUNGGU" | "DITOLAK";

interface Peserta {
  id: number;
  nama: string;
  event: string;
  email: string;
  noHp: string;
  status: Status;
  inisial: string;
  warnaBg: string;
  lampiranUrl?: string | null;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const DUMMY_DATA: Peserta[] = [
  { id: 1, nama: "Andi Pratama",   event: "Marathon Jakarta 2024",  email: "andi.p@gmail.com",     noHp: "+62 812-3456-7890", status: "TERVERIFIKASI", inisial: "AP", warnaBg: "bg-orange-500", lampiranUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png" },
  { id: 2, nama: "Siti Kusuma",    event: "Digital Summit Asia",    email: "siti.kus@company.id",  noHp: "+62 856-7890-1234", status: "MENUNGGU",     inisial: "SK", warnaBg: "bg-purple-500", lampiranUrl: null },
  { id: 3, nama: "Budi Nugraha",   event: "Tech Conference 2024",   email: "budi_n@outlook.com",   noHp: "+62 811-2233-4455", status: "DITOLAK",      inisial: "BN", warnaBg: "bg-teal-600",   lampiranUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png" },
  { id: 4, nama: "Rina Amelia",    event: "Marathon Jakarta 2024",  email: "rina.amel@gmail.com",  noHp: "+62 822-4455-6677", status: "TERVERIFIKASI", inisial: "RA", warnaBg: "bg-blue-500",   lampiranUrl: null },
  { id: 5, nama: "Doni Setiawan",  event: "Webinar Design 2024",    email: "doni.s@gmail.com",     noHp: "+62 813-9988-7766", status: "MENUNGGU",     inisial: "DS", warnaBg: "bg-green-600",  lampiranUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png" },
  { id: 6, nama: "Citra Lestari",  event: "Tech Conference 2024",   email: "citra.l@yahoo.com",    noHp: "+62 877-1122-3344", status: "TERVERIFIKASI", inisial: "CL", warnaBg: "bg-pink-500",   lampiranUrl: null },
  { id: 7, nama: "Fajar Ramadhan", event: "Marathon Jakarta 2024",  email: "fajar.r@gmail.com",    noHp: "+62 821-5544-3322", status: "DITOLAK",      inisial: "FR", warnaBg: "bg-yellow-600", lampiranUrl: null },
  { id: 8, nama: "Hana Wijaya",    event: "Digital Summit Asia",    email: "hana.w@company.id",    noHp: "+62 819-6677-8899", status: "TERVERIFIKASI", inisial: "HW", warnaBg: "bg-indigo-500", lampiranUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png" },
  { id: 9, nama: "Irfan Maulana",  event: "Webinar Design 2024",    email: "irfan.m@gmail.com",    noHp: "+62 812-0011-2233", status: "MENUNGGU",     inisial: "IM", warnaBg: "bg-red-500",    lampiranUrl: null },
  { id: 10, nama: "Juliana Putri", event: "Tech Conference 2024",   email: "julia.p@outlook.com",  noHp: "+62 857-3344-5566", status: "TERVERIFIKASI", inisial: "JP", warnaBg: "bg-cyan-600",   lampiranUrl: null },
];

const TOTAL = 124;
const PER_PAGE = 10;
const TOTAL_PAGES = Math.ceil(TOTAL / PER_PAGE);

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  if (status === "TERVERIFIKASI") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border border-green-300 bg-green-50 text-green-600">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        DISETUJUI
      </span>
    );
  }
  if (status === "MENUNGGU") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border border-yellow-300 bg-yellow-50 text-yellow-600">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        MENUNGGU
      </span>
    );
  }
  // DITOLAK
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border border-red-300 bg-red-50 text-red-500">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="17" y1="8" x2="23" y2="14"/>
        <line x1="23" y1="8" x2="17" y2="14"/>
      </svg>
      DITOLAK
    </span>
  );
}

// ─── Action Buttons ───────────────────────────────────────────────────────────

function ActionButtons({ status, onVerify, onTolak, onEdit, onDelete, onDetail }: {
  status: Status;
  onVerify: () => void;
  onTolak: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDetail: () => void;
}) {
  if (status === "MENUNGGU") {
    return (
      <div className="flex items-center gap-1.5">
        <button onClick={onVerify} title="Verifikasi" className="w-7 h-7 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors">
          <CheckCircle size={14} />
        </button>
        <button onClick={onTolak} title="Tolak" className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors">
          <XCircle size={14} />
        </button>
      </div>
    );
  }
  if (status === "DITOLAK") {
    return (
      <div className="flex items-center gap-1.5">
        <button onClick={onDetail} title="Detail" className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors">
          <Info size={14} />
        </button>
        <button onClick={onEdit} title="Edit" className="w-7 h-7 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors">
          <Pencil size={14} />
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={onEdit} title="Edit" className="text-gray-400 hover:text-blue-500 transition-colors">
        <Pencil size={15} />
      </button>
      <button onClick={onDelete} title="Hapus" className="text-gray-400 hover:text-red-500 transition-colors">
        <Trash2 size={15} />
      </button>
    </div>
  );
}

// ─── Lampiran Popup ───────────────────────────────────────────────────────────

function LampiranPopup({ url, nama, onClose }: { url: string; nama: string; onClose: () => void }) {
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isPdf   = /\.pdf$/i.test(url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-bold text-gray-800">Lampiran Peserta</p>
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
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Konten */}
        <div className="p-5 bg-gray-50 flex items-center justify-center" style={{ minHeight: 320, maxHeight: "70vh", overflow: "auto" }}>
          {isImage ? (
            <img
              src={url}
              alt={`Lampiran ${nama}`}
              className="max-w-full rounded-xl shadow-md object-contain"
              style={{ maxHeight: "60vh" }}
            />
          ) : isPdf ? (
            <iframe src={url} className="w-full rounded-xl border-0" style={{ height: "60vh" }} title="PDF Lampiran" />
          ) : (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">📎</div>
              <p className="text-sm text-gray-500 mb-3">File tidak dapat dipreview</p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">Download file</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InformasiPesertaPage() {
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [currentPage, setCurrentPage]   = useState(1);
  const [data, setData]                 = useState<Peserta[]>(DUMMY_DATA);
  const [lampiran, setLampiran]         = useState<{ url: string; nama: string } | null>(null);

  // Filter
  const filtered = data.filter((p) => {
    const matchSearch =
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.noHp.includes(search);
    const matchStatus = filterStatus === "semua" || p.status === filterStatus.toUpperCase();
    return matchSearch && matchStatus;
  });

  // Actions
  const handleVerify = (id: number) => setData((prev) => prev.map((p) => p.id === id ? { ...p, status: "TERVERIFIKASI" } : p));
  const handleTolak  = (id: number) => setData((prev) => prev.map((p) => p.id === id ? { ...p, status: "DITOLAK" } : p));
  const handleDelete = (id: number) => setData((prev) => prev.filter((p) => p.id !== id));

  // Pagination
  const pages = () => {
    const arr: (number | "...")[] = [];
    if (TOTAL_PAGES <= 6) { for (let i = 1; i <= TOTAL_PAGES; i++) arr.push(i); }
    else { arr.push(1, 2, 3, "...", TOTAL_PAGES); }
    return arr;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Data & Validasi Peserta</h1>
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
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
        >
          <option value="semua">Semua Status</option>
          <option value="TERVERIFIKASI">Terverifikasi</option>
          <option value="MENUNGGU">Menunggu</option>
          <option value="DITOLAK">Ditolak</option>
        </select>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="font-semibold text-gray-800 text-sm">
            Daftar Peserta{" "}
            <span className="text-gray-400 font-normal">({filtered.length} Total)</span>
          </p>
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-400 text-sm">
                    Tidak ada data peserta ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((peserta, index) => (
                  <tr key={peserta.id} className="hover:bg-gray-50/60 transition-colors">

                    {/* No */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-xs font-semibold text-gray-400">
                        {(currentPage - 1) * PER_PAGE + index + 1}
                      </span>
                    </td>

                    {/* Peserta & Event */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${peserta.warnaBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {peserta.inisial}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{peserta.nama}</p>
                          <p className="text-xs text-gray-400">{peserta.event}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5 text-gray-600 text-sm">{peserta.email}</td>

                    {/* No HP */}
                    <td className="px-5 py-3.5 text-gray-600 text-sm">{peserta.noHp}</td>

                    {/* Lampiran */}
                    <td className="px-5 py-3.5">
                      {peserta.lampiranUrl ? (
                        <button
                          onClick={() => setLampiran({ url: peserta.lampiranUrl!, nama: peserta.nama })}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
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
                      <StatusBadge status={peserta.status} />
                    </td>

                    {/* Aksi */}
                    <td className="px-5 py-3.5">
                      <ActionButtons
                        status={peserta.status}
                        onVerify={() => handleVerify(peserta.id)}
                        onTolak={() => handleTolak(peserta.id)}
                        onEdit={() => alert(`Edit: ${peserta.nama}`)}
                        onDelete={() => handleDelete(peserta.id)}
                        onDetail={() => alert(`Detail: ${peserta.nama}`)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Menampilkan 1 - {Math.min(PER_PAGE, filtered.length)} dari {filtered.length} peserta
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={13} />
            </button>
            {pages().map((pg, idx) =>
              pg === "..." ? (
                <span key={idx} className="px-1 text-gray-400 text-sm">...</span>
              ) : (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(pg as number)}
                  className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium border transition-colors ${
                    currentPage === pg
                      ? "bg-[#1a2b4b] text-white border-[#1a2b4b]"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {pg}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              disabled={currentPage === TOTAL_PAGES}
              className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
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
