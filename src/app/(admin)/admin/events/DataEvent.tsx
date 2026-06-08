"use client";

import React from "react";
import { X, Calendar, MapPin, Users, Wallet, Building2, Phone, Mail, Clock } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type DataEventProps = {
  isOpen: boolean;
  onClose: () => void;
  event: {
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
    tipeHarga: string | null;
    harga: number | null;
    emailKontak: string | null;
    teleponKontak: string | null;
    jenisEvent: "seminar" | "conference" | null;
    tipePlatform: "online" | "offline" | "hybrid" | null;
    participantCount?: number;
  };
  onUpdateStatus: (id: number, status: "published" | "rejected") => Promise<void>;
};

function StatusBadge({ status }: { status: "pending" | "published" | "rejected" }) {
  if (status === "pending")
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider bg-amber-50 text-amber-700 border-amber-200/60 whitespace-nowrap">
        Menunggu
      </span>
    );
  if (status === "published")
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200/60 whitespace-nowrap">
        Aktif
      </span>
    );
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider bg-rose-50 text-rose-700 border-rose-200/60 whitespace-nowrap">
      Ditolak
    </span>
  );
}

export default function DataEvent({ isOpen, onClose, event, onUpdateStatus }: DataEventProps) {
  if (!isOpen) return null;

  const rows = [
    {
      label: "Kategori",
      value: event.jenisEvent === "conference" ? "Konferensi" : event.jenisEvent === "seminar" ? "Seminar" : "Event",
    },
    {
      label: "Tanggal Mulai",
      value: format(new Date(event.tanggalMulai), "dd MMMM yyyy, HH:mm", { locale: id }),
    },
    {
      label: "Tanggal Selesai",
      value: event.tanggalSelesai
        ? format(new Date(event.tanggalSelesai), "dd MMMM yyyy, HH:mm", { locale: id })
        : "-",
    },
    {
      label: "Platform / Tipe",
      value: event.tipePlatform
        ? event.tipePlatform.toUpperCase()
        : "-",
    },
    {
      label: "Lokasi / Link",
      value: event.detailLokasi || "-",
    },
    {
      label: "Kuota Peserta",
      value: event.kuota ? `${event.kuota} Orang` : "-",
    },
    {
      label: "Jumlah Pendaftar",
      value: event.participantCount !== undefined ? `${event.participantCount} Orang` : "-",
    },
    {
      label: "Harga Tiket",
      value: event.tipeHarga === "free" ? "Gratis" : event.harga ? `Rp ${event.harga.toLocaleString("id-ID")}` : "-",
    },
    {
      label: "Email Kontak",
      value: event.emailKontak || "-",
    },
    {
      label: "Telepon Kontak",
      value: event.teleponKontak || "-",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-800">Detail Event</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {/* Poster + Judul + Status */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-16 h-20 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
              {event.bannerUrl ? (
                <img src={event.bannerUrl} alt={event.judul} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-gray-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-800 text-sm break-words leading-tight mb-1">{event.judul}</div>
              <div className="text-xs text-gray-400 mb-2 truncate">{event.penyelenggara || "Institusi Polines"}</div>
              <StatusBadge status={event.status} />
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-3">
            {rows.map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4">
                <span className="text-[11px] text-gray-400 font-medium shrink-0 w-32">{label}</span>
                <span className="text-[11px] text-gray-700 text-right font-medium break-all">{value}</span>
              </div>
            ))}
          </div>

          {/* Description Section */}
          {event.deskripsi && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1.5 block">
                Deskripsi Event
              </span>
              <div className="text-[11px] text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-100/80 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
                {event.deskripsi}
              </div>
            </div>
          )}

          {/* Terms Section */}
          {event.syaratDanKetentuan && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1.5 block">
                Syarat & Ketentuan
              </span>
              <div className="text-[11px] text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-100/80 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
                {event.syaratDanKetentuan}
              </div>
            </div>
          )}

          {/* Moderation Buttons (only shown for pending status) */}
          {event.status === "pending" && (
            <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
              <button
                onClick={() => onUpdateStatus(event.id, "rejected")}
                className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold transition-all text-center"
              >
                Tolak Event
              </button>
              <button
                onClick={() => onUpdateStatus(event.id, "published")}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all text-center"
              >
                Setujui Event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

