"use client";

import { useState, useEffect, useMemo } from "react";
import { StatCard } from "@/components/penyelenggara/StatCard";
import { EventChart } from "@/components/penyelenggara/EventChart";
import { ViewChart } from "@/components/penyelenggara/ViewChart";
import { PendapatanChart } from "@/components/penyelenggara/PendapatanChart";
import { Users, Eye, Coins, Clock, Ticket, Search, ChevronDown, Check, FileText, User, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from '@/components/ui/input';
import OrganizerExportSection from './OrganizerExportWrapper';

interface DashboardContentProps {
  allEvents: { 
    id: number; 
    judul: string | null;
    urlBanner: string | null;
    tanggalMulai: Date | null;
    status: string | null;
    tipePlatform: string | null;
    harga: number | null;
  }[];
  initialStats: {
    totalPeserta: number;
    totalTayangan: number;
    totalPendapatan: number;
  };
  initialGrafikData: { tanggal: string; jumlah: number }[];
  initialGrafikPendapatan: { tanggal: string; jumlah: number }[];
  disetujui: boolean;
  alasanPenolakan?: string | null;
  recentParticipants: { id: number; namaLengkap: string | null; email: string | null; eventJudul: string | null; dibuatPada: Date | null }[];
  recentPapers: { id: number; judul: string | null; penulis: unknown; status: string | null; eventJudul: string | null; dibuatPada: Date | null }[];
}

export function DashboardContent({
  allEvents,
  initialStats,
  initialGrafikData,
  initialGrafikPendapatan,
  disetujui,
  alasanPenolakan,
  recentParticipants: initialParticipants,
  recentPapers: initialPapers,
}: DashboardContentProps) {
  const computedTrend = useMemo(() => {
    if (initialGrafikData.length < 2) return "+0%";
    const half = Math.floor(initialGrafikData.length / 2);
    const firstHalf = initialGrafikData.slice(0, half).reduce((sum, d) => sum + d.jumlah, 0);
    const secondHalf = initialGrafikData.slice(half).reduce((sum, d) => sum + d.jumlah, 0);
    if (firstHalf === 0) return "+0%";
    const pct = ((secondHalf - firstHalf) / firstHalf) * 100;
    return pct >= 0 ? `+${Math.round(pct)}%` : `${Math.round(pct)}%`;
  }, [initialGrafikData]);

  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [stats, setStats] = useState(initialStats);
  const [recentParticipants, setRecentParticipants] = useState(initialParticipants);
  const [recentPapers, setRecentPapers] = useState(initialPapers);

  const displayStats = selectedEventId === "all" ? initialStats : stats;
  const displayParticipants = selectedEventId === "all" ? initialParticipants : recentParticipants;
  const displayPapers = selectedEventId === "all" ? initialPapers : recentPapers;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) =>
      (ev.judul || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allEvents, searchQuery]);

  const selectedEvent = useMemo(() => {
    if (selectedEventId === "all") return null;
    return allEvents.find((ev) => ev.id.toString() === selectedEventId);
  }, [allEvents, selectedEventId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".event-filter-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    if (selectedEventId === "all") {
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/organizer/stats?eventId=${selectedEventId}`);
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalPeserta: data.totalPeserta,
            totalTayangan: data.totalTayangan,
            totalPendapatan: data.totalPendapatan,
          });
          setRecentParticipants(data.recentParticipants);
          setRecentPapers(data.recentPapers);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [selectedEventId, initialStats, initialParticipants, initialPapers]);

  return (
    <div className="space-y-8">
      {!disetujui && alasanPenolakan && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <X className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-rose-800">
                Pengajuan Akses Penyelenggara Ditolak
              </h3>
              <div className="text-sm text-rose-700/80 mt-1 leading-relaxed bg-rose-100/50 p-3 rounded-xl border border-rose-200/50 mt-3 font-medium">
                <span className="font-bold">Alasan Penolakan:</span> {alasanPenolakan}
              </div>
              <p className="text-xs text-rose-600/80 mt-3 font-medium">
                Silakan perbaiki profil dan dokumen legalitas di menu{" "}
                <Link href="/penyelenggara/profil" className="underline hover:text-rose-800 font-bold transition-colors">
                  Profil Akun
                </Link>{" "}
                sesuai alasan penolakan untuk ditinjau kembali.
              </p>
            </div>
          </div>
        </div>
      )}

      {!disetujui && !alasanPenolakan && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 animate-pulse">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-amber-800">
                Akun Menunggu Persetujuan Admin
              </h3>
              <p className="text-sm text-amber-700/80 mt-1 leading-relaxed">
                Akun penyelenggara Anda saat ini sedang dalam antrean verifikasi oleh tim verifikator kami. 
                Fitur pembuatan dan pengelolaan event saat ini dinonaktifkan. Silakan lengkapi profil organisasi 
                dan unggah dokumen legalitas Anda di menu{" "}
                <Link href="/penyelenggara/profil" className="underline hover:text-amber-900 font-bold transition-colors">
                  Profil Akun
                </Link>{" "}
                untuk mempercepat proses persetujuan.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1 w-full relative event-filter-dropdown">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari event..."
                value={isDropdownOpen ? searchQuery : (selectedEventId === "all" ? "" : selectedEvent?.judul || "")}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/20 outline-none transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {selectedEventId !== "all" && !isDropdownOpen && (
                  <button 
                    onClick={() => setSelectedEventId("all")}
                    className="text-xxs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md transition-colors"
                  >
                    RESET
                  </button>
                )}
                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isDropdownOpen && "rotate-180")} />
              </div>
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-h-72 overflow-y-auto p-2">
                  <button
                    onClick={() => {
                      setSelectedEventId("all");
                      setIsDropdownOpen(false);
                      setSearchQuery("");
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition-colors mb-1",
                      selectedEventId === "all" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    Semua Event (Akumulasi Data)
                    {selectedEventId === "all" && <Check className="w-4 h-4" />}
                  </button>
                  
                  <div className="px-4 py-2">
                    <p className="text-xxs font-bold text-gray-400 uppercase tracking-wider">Daftar Event</p>
                  </div>

                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => {
                          setSelectedEventId(ev.id.toString());
                          setIsDropdownOpen(false);
                          setSearchQuery("");
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition-colors",
                          selectedEventId === ev.id.toString() ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <span className="truncate">{ev.judul}</span>
                        {selectedEventId === ev.id.toString() && <Check className="w-4 h-4" />}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-10 text-center">
                      <Ticket className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">Event tidak ditemukan</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="relative w-32 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-50">
                {selectedEvent.urlBanner ? (
                  <Image
                    src={selectedEvent.urlBanner}
                    alt={selectedEvent.judul || ""}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Ticket className="w-8 h-8" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-xxs font-bold uppercase tracking-wider",
                    selectedEvent.status === "published" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                  )}>
                    {selectedEvent.status}
                  </span>
                  <span className="text-xxs font-bold text-gray-300 uppercase tracking-wider">•</span>
                  <span className="text-xxs font-bold text-gray-400 uppercase tracking-wider">
                    {selectedEvent.tipePlatform}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 truncate mb-1">
                  {selectedEvent.judul}
                </h3>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">
                    {selectedEvent.tanggalMulai
                      ? new Date(selectedEvent.tanggalMulai).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
              <div className="flex flex-col items-center min-w-16">
                <span className="text-xxs font-bold text-gray-400 uppercase tracking-wider mb-1">Peserta</span>
                <span className="text-xl font-black text-gray-900">{displayStats.totalPeserta}</span>
              </div>
              <div className="w-px h-10 bg-gray-100 hidden md:block" />
              <div className="flex flex-col items-center min-w-20">
                <span className="text-xxs font-bold text-gray-400 uppercase tracking-wider mb-1">Harga</span>
                <span className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-bold",
                  selectedEvent.harga === 0 ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                )}>
                  {selectedEvent.harga === 0 ? "Gratis" : `Rp ${selectedEvent.harga?.toLocaleString("id-ID")}`}
                </span>
              </div>
              <Link
                href={`/penyelenggara/detail-event/${selectedEvent.id}`}
                className="ml-auto md:ml-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                Detail Event
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <StatCard
          title="Total Peserta"
          value={displayStats.totalPeserta.toLocaleString()}
          trend={computedTrend}
          icon={Users}
          className="h-full"
        />
        <StatCard
          title="Total Tayangan"
          value={displayStats.totalTayangan.toLocaleString("id-ID")}
          icon={Eye}
          className="h-full"
        />
        <StatCard
          title="Total Pendapatan"
          value={`Rp ${displayStats.totalPendapatan.toLocaleString("id-ID")}`}
          icon={Coins}
          className="h-full"
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <EventChart initialData={initialGrafikData} selectedEventId={selectedEventId} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <PendapatanChart initialData={initialGrafikPendapatan} selectedEventId={selectedEventId} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <ViewChart selectedEventId={selectedEventId} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-gray-900">
              Peserta Terbaru
            </h3>
            <Link 
              href="/penyelenggara/peserta"
              className="text-xxs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors uppercase tracking-wider"
            >
              Lihat Semua
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {displayParticipants.length > 0 ? (
              displayParticipants.map((p) => (
                <Link
                  key={p.id}
                  href="/penyelenggara/peserta"
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-100 transition-colors">
                      <User className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {p.namaLengkap}
                      </h4>
                      <p className="text-xxs text-gray-400 font-medium uppercase tracking-wider line-clamp-1">
                        {p.eventJudul}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-xxs font-bold text-gray-400 uppercase">
                      {p.dibuatPada
                        ? new Date(p.dibuatPada).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })
                        : "-"}
                    </p>
                    <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Belum ada peserta baru.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-gray-900">
              Paper Terbaru
            </h3>
            <Link 
              href="/penyelenggara/review-paper"
              className="text-xxs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors uppercase tracking-wider"
            >
              Lihat Semua
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {displayPapers.length > 0 ? (
              displayPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 group-hover:bg-amber-100 transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {paper.judul}
                      </h4>
                      <p className="text-xxs text-gray-400 font-medium uppercase tracking-wider line-clamp-1">
                        {String(paper.penulis || "Unknown")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xxs font-bold uppercase",
                      paper.status === "accepted" ? "bg-green-50 text-green-600" : 
                      paper.status === "rejected" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {paper.status}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Belum ada paper baru.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <OrganizerExportSection />
    </div>
  );
}