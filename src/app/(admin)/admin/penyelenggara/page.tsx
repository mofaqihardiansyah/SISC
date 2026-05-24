"use client";

import { useState } from "react";
import { CheckCircle, Clock, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

type Status = "DISETUJUI" | "MENUNGGU" | "DITOLAK";

interface Penyelenggara {
  id: number;
  namaOrganisasi: string;
  email: string;
  noTelepon: string;
  status: Status;
}

const DUMMY: Penyelenggara[] = [
  { id: 1, namaOrganisasi: "BEM POLINES",  email: "bempolines@gmail.com",  noTelepon: "0812345678", status: "DISETUJUI" },
  { id: 2, namaOrganisasi: "HME POLINES",  email: "hmepolines@gmail.com",  noTelepon: "0812345678", status: "MENUNGGU"  },
  { id: 3, namaOrganisasi: "HMS POLINES",  email: "hmspolines@gmail.com",  noTelepon: "0812345678", status: "DITOLAK"   },
  { id: 4, namaOrganisasi: "BPM POLINES",  email: "bpmpolines@gmail.com",  noTelepon: "0812345678", status: "DISETUJUI" },
  { id: 5, namaOrganisasi: "POLINES",      email: "polines@polines.ac.id", noTelepon: "0812345678", status: "MENUNGGU"  },
  { id: 6, namaOrganisasi: "HMAB POLINES", email: "hmabpolines@gmail.com", noTelepon: "0812345678", status: "DISETUJUI" },
  { id: 7, namaOrganisasi: "BEM FT",       email: "bemft@gmail.com",       noTelepon: "0812345678", status: "MENUNGGU"  },
  { id: 8, namaOrganisasi: "HIMA TI",      email: "himati@gmail.com",      noTelepon: "0812345678", status: "DITOLAK"   },
];

const ITEMS_PER_PAGE = 6;

const STATUS_BADGE: Record<Status, string> = {
  DISETUJUI: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  MENUNGGU:  "bg-amber-50 text-amber-700 border border-amber-200/60",
  DITOLAK:   "bg-rose-50 text-rose-700 border border-rose-200/60",
};

export default function PenyelenggaraPage() {
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState("");

  const filtered   = DUMMY.filter((p) =>
    p.namaOrganisasi.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged      = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const fmtId      = (id: number) => String(id).padStart(5, "0");

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Persetujuan Hak Akses Penyelenggara
      </h1>
      <p className="text-sm text-gray-400 mb-7">
        Verifikasi Penyelenggara yang sudah meregistrasikan akun
      </p>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200/60">
            <tr>
              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider w-24">ID</th>
              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nama Organisasi</th>
              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider w-36">No. Telepon</th>
              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider w-36">Status</th>
              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider w-28">Validasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paged.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-16 text-sm text-gray-300">Tidak ada data.</td>
              </tr>
            )}
            {paged.map((item, i) => (
              <tr key={item.id} className={`hover:bg-slate-50/25 transition-colors ${i < paged.length - 1 ? "border-b border-slate-100" : ""}`}>
                <td className="px-6 py-3.5 font-mono text-xs text-gray-400">{fmtId(item.id)}</td>
                <td className="px-6 py-3.5 text-sm font-semibold text-gray-800">{item.namaOrganisasi}</td>
                <td className="px-6 py-3.5 text-xs text-gray-500">{item.email}</td>
                <td className="px-6 py-3.5 text-xs text-gray-500">{item.noTelepon}</td>
                <td className="px-6 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider whitespace-nowrap ${STATUS_BADGE[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  {item.status === "DISETUJUI" && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                  {item.status === "MENUNGGU"  && <Clock       className="w-5 h-5 text-amber-500" />}
                  {item.status === "DITOLAK"   && <XCircle     className="w-5 h-5 text-rose-500" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center gap-1.5 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition
              ${p === page ? "bg-[#0E215D] text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100"}`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}