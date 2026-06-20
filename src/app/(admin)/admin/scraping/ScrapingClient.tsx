'use client';

import React, { useState, useMemo } from 'react';
import { 
  publishRawEvent, 
  bulkPublishRawEvents, 
  bulkDeleteRawEvents, 
  cleanRawDataAction, 
  bulkCleanRawData, 
  getLogScraping, 
  triggerScrapeAction,
  publishAllAutoApproved
} from "@/actions/admin-scraping";
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { toast } from 'sonner';
import { 
  Search, 
  RefreshCw, 
  Check, 
  Trash2, 
  Eye, 
  Sparkles, 
  Globe, 
  Calendar, 
  MapPin,
  Tag,
  AlertCircle,
  Coins,
  User,
  FileText
} from 'lucide-react';

export interface RawScrapedObject {
  judul?: string;
  tanggalMentah?: string;
  tanggalSelesai?: string;
  detailLokasi?: string;
  tipeHarga?: string;
  harga?: number;
  kuota?: number | string;
  linkRegistrasi?: string;
  namaKontak?: string;
  teleponKontak?: string;
  [key: string]: unknown;
}

export interface ScrapedData {
  id: number;
  sumber: string;
  urlTarget: string | null;
  data: {
    judul: string;
    linkEksternal: string;
    urlBanner?: string;
    detailLokasi?: string;
    tanggalMentah: string;
    websiteSumber: string;
    tanggalMulai?: string | null;
    tanggalSelesai?: string | null;
    jenisEvent?: 'seminar' | 'conference';
    tipePlatform?: 'online' | 'offline' | 'hybrid' | null;
    kategoriId?: number | null;
    kotaId?: number | null;
    cleanedAt?: string;
    confidenceScore?: number;
    autoApproved?: boolean;
    deskripsi?: string;
    tipeHarga?: 'free' | 'paid';
    harga?: number;
    kuota?: number | null;
    linkRegistrasi?: string | null;
    namaKontak?: string | null;
    teleponKontak?: string | null;
    emailKontak?: string | null;
    _raw?: RawScrapedObject | null;
    fieldConfidence?: {
      judul: number;
      tanggalMulai: number;
      tipePlatform: number;
      kotaId: number;
      kategoriId: number;
      deskripsi: number;
      kontak: number;
      harga: number;
    };
  };
  statusIntegrasi: boolean | null;
  status: string | null;
  dibuatPada: Date | null;
}

export interface LogScraping {
  id: number;
  targetUrl: string | null;
  sumber: string | null;
  status: 'pending' | 'processing' | 'success' | 'failed' | null;
  jumlahData: number | null;
  errorMessage: string | null;
  mulaiPada: Date | null;
  selesaiPada: Date | null;
}

interface ScrapingManagementProps {
  initialData: ScrapedData[];
  initialLogs: LogScraping[];
  cities: { id: number; nama: string | null }[];
  categories: { id: number; nama: string | null; slug: string | null; urlIkon: string | null }[];
}

export default function ScrapingManagement({ initialData, initialLogs, cities, categories }: ScrapingManagementProps) {
  const [data, setData] = useState<ScrapedData[]>(initialData);
  const [logs, setLogs] = useState<LogScraping[]>(initialLogs);
  const [isScraping, setIsScraping] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [previewItem, setPreviewItem] = useState<ScrapedData | null>(null);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Form states for edit/publish modal
  const [editJudul, setEditJudul] = useState("");
  const [editTanggalMulai, setEditTanggalMulai] = useState("");
  const [editTanggalSelesai, setEditTanggalSelesai] = useState("");
  const [editDetailLokasi, setEditDetailLokasi] = useState("");
  const [editTipePlatform, setEditTipePlatform] = useState<'online' | 'offline' | 'hybrid' | null>(null);
  const [editKategoriId, setEditKategoriId] = useState<number | null>(null);
  const [editKotaId, setEditKotaId] = useState<number | null>(null);
  const [editJenisEvent, setEditJenisEvent] = useState<'seminar' | 'conference'>('seminar');
  const [editDeskripsi, setEditDeskripsi] = useState("");
  const [editTipeHarga, setEditTipeHarga] = useState<'free' | 'paid'>('free');
  const [editHarga, setEditHarga] = useState<number>(0);
  const [editKuota, setEditKuota] = useState<number | "">("");
  const [editLinkRegistrasi, setEditLinkRegistrasi] = useState("");
  const [editNamaKontak, setEditNamaKontak] = useState("");
  const [editTeleponKontak, setEditTeleponKontak] = useState("");
  const [editEmailKontak, setEditEmailKontak] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isAutoPublishing, setIsAutoPublishing] = useState(false);

  const handlePublishAutoApproved = async () => {
    setIsAutoPublishing(true);
    try {
      const res = await publishAllAutoApproved();
      if (res.success) {
        toast.success(`Berhasil menerbitkan ${res.count} event yang berstatus Auto-Approved!`);
        setData(data.filter(d => !(d.status === 'processed' && d.data.autoApproved === true)));
      } else {
        toast.error(res.error || "Gagal menerbitkan event Auto-Approved");
      }
    } finally {
      setIsAutoPublishing(false);
    }
  };

  const allSelected = data.length > 0 && selected.size === data.length;

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(data.map(d => d.id)));
  };

  const toggleOne = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const triggerScrape = async () => {
    setIsScraping(true);
    try {
      const res = await triggerScrapeAction();
      if (res.success) {
        toast.success(res.data?.message || "Scraping selesai!");
        // Refresh data page/state is handled through local refresh manually or re-trigger
        // Let's reload logs and show the toast
        await refreshLogs();
      } else {
        toast.error("Gagal: " + res.error);
      }
    } finally {
      setIsScraping(false);
    }
  };

  const handleOpenPreview = (item: ScrapedData) => {
    setPreviewItem(item);
    setEditJudul(item.data.judul || "");
    setEditDetailLokasi(item.data.detailLokasi || "");
    setEditTipePlatform(item.data.tipePlatform || null);
    setEditKategoriId(item.data.kategoriId || null);
    setEditKotaId(item.data.kotaId || null);
    setEditJenisEvent(item.data.jenisEvent || 'seminar');
    setEditDeskripsi(item.data.deskripsi || "");
    setEditTipeHarga(item.data.tipeHarga || 'free');
    setEditHarga(item.data.harga || 0);
    setEditKuota(item.data.kuota !== undefined && item.data.kuota !== null ? item.data.kuota : "");
    setEditLinkRegistrasi(item.data.linkRegistrasi || item.data.linkEksternal || "");
    setEditNamaKontak(item.data.namaKontak || "");
    setEditTeleponKontak(item.data.teleponKontak || "");
    setEditEmailKontak(item.data.emailKontak || "");

    const formatDate = (isoStr?: string | null) => {
      if (!isoStr) return "";
      try {
        return new Date(isoStr).toISOString().split('T')[0];
      } catch {
        return "";
      }
    };
    setEditTanggalMulai(formatDate(item.data.tanggalMulai));
    setEditTanggalSelesai(formatDate(item.data.tanggalSelesai));
  };

  const handlePublish = async (id: number) => {
    setIsPublishing(true);
    try {
      const res = await publishRawEvent(id, {
        judul: editJudul,
        tanggalMulai: editTanggalMulai || null,
        tanggalSelesai: editTanggalSelesai || null,
        detailLokasi: editDetailLokasi,
        tipePlatform: editTipePlatform,
        kategoriId: editKategoriId,
        kotaId: editKotaId,
        jenisEvent: editJenisEvent,
        deskripsi: editDeskripsi,
        tipeHarga: editTipeHarga,
        harga: editHarga,
        kuota: editKuota === "" ? null : Number(editKuota),
        linkRegistrasi: editLinkRegistrasi,
        namaKontak: editNamaKontak,
        teleponKontak: editTeleponKontak,
        emailKontak: editEmailKontak || null,
      });

      if (res.success) {
        toast.success("Event berhasil diterbitkan!");
        setData(data.filter(d => d.id !== id));
        setPreviewItem(null);
      } else {
        toast.error(res.error || "Gagal menerbitkan event");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleBulkPublish = async () => {
    const ids = [...selected];
    if (!ids.length) return toast.error("Pilih data terlebih dahulu");
    const res = await bulkPublishRawEvents(ids);
    if (res.success) {
      toast.success(`${res.count} event dipublikasikan!`);
      setData(data.filter(d => !selected.has(d.id)));
      setSelected(new Set());
    } else {
      toast.error("Terjadi masalah saat menerbitkan beberapa event");
    }
  };

  const handleBulkDelete = async () => {
    const ids = [...selected];
    if (!ids.length) return toast.error("Pilih data terlebih dahulu");
    const res = await bulkDeleteRawEvents(ids);
    if (res.success) {
      toast.success(`${res.count} data dihapus!`);
      setData(data.filter(d => !selected.has(d.id)));
      setSelected(new Set());
    }
  };

  const handleClean = async (id: number) => {
    const res = await cleanRawDataAction(id);
    if (res.success && res.cleaned) {
      toast.success("Data dibersihkan!");
      setData(data.map(d => d.id === id ? { ...d, data: res.cleaned as unknown as ScrapedData['data'], status: 'processed' } : d));
    } else {
      toast.error(res.error || "Gagal membersihkan data");
    }
  };

  const handleBulkClean = async () => {
    const ids = [...selected];
    if (!ids.length) return toast.error("Pilih data terlebih dahulu");
    const res = await bulkCleanRawData(ids);
    toast.success(`${res.count} data dibersihkan!`);
    // Refresh local dataset
    const freshData = data.map(d => {
      if (selected.has(d.id)) {
        return { ...d, status: 'processed' };
      }
      return d;
    });
    setData(freshData);
    setSelected(new Set());
  };

  const refreshLogs = async () => {
    const fresh = await getLogScraping();
    setLogs(fresh);
  };

  // Search and filter logic
  const filteredData = data.filter(item => {
    const matchesSearch = item.data.judul?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.sumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Reset page when filters change
  const prevFilteredLength = React.useRef(filteredData.length);
  if (prevFilteredLength.current !== filteredData.length) {
    prevFilteredLength.current = filteredData.length;
    if (currentPage > totalPages) setCurrentPage(1);
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-slate-50/50 min-h-screen rounded-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Manajemen Scraping</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau, sunting, dan publikasikan event otomatis dari eventkampus.com</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handlePublishAutoApproved}
            loading={isAutoPublishing}
            variant="success"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Publish Auto-Approved
          </Button>
          <Button
            onClick={triggerScrape}
            loading={isScraping}
          >
            {!isScraping && <RefreshCw className="w-4 h-4 mr-2" />}
            Mulai Scraping Baru
          </Button>
        </div>
      </div>

      {/* 📊 Ringkasan Kartu Metrik (Executive Dashboard Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
        {/* Card 1: Total Data Terkumpul */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Data Terkumpul</span>
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{data.length}</span>
          </div>
          <div className="p-3 bg-indigo-50/80 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors">
            <Globe className="w-6 h-6" />
          </div>
        </div>
        
        {/* Card 2: Auto-Approved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Siap Terbit (Auto-Approved)</span>
            <span className="text-3xl font-extrabold text-emerald-600 tracking-tight group-hover:text-emerald-700 transition-colors">
              {data.filter(d => d.data.autoApproved).length}
            </span>
          </div>
          <div className="p-3 bg-emerald-50/80 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
            <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
          </div>
        </div>

        {/* Card 3: Perlu Tinjauan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Perlu Tinjauan</span>
            <span className="text-3xl font-extrabold text-amber-500 tracking-tight group-hover:text-amber-600 transition-colors">
              {data.filter(d => !d.data.autoApproved).length}
            </span>
          </div>
          <div className="p-3 bg-amber-50/80 text-amber-500 rounded-xl group-hover:bg-amber-100 transition-colors">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="data" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl mb-4">
          <TabsTrigger value="data" className="rounded-lg px-4 py-2 text-sm font-semibold">
            Data Scraping
            <Badge variant="secondary" className="ml-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none font-bold">
              {data.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="logs" onClick={refreshLogs} className="rounded-lg px-4 py-2 text-sm font-semibold">
            Log Aktivitas
            <Badge variant="secondary" className="ml-2 bg-slate-200 text-slate-700 border-none font-bold">
              {logs.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          {/* Filter Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300 transition-all duration-150"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-44 py-2 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300 transition-all duration-150"
              >
                <option value="all">Semua Status</option>
                <option value="processed">Processed (Bersih)</option>
                <option value="pending">Pending (Mentah)</option>
              </select>
            </div>

            {selected.size > 0 && (
              <div className="flex items-center gap-2 bg-indigo-50/50 p-1.5 rounded-lg border border-indigo-100 w-full md:w-auto justify-end shadow-sm">
                <span className="text-xs font-semibold text-indigo-700 px-2">{selected.size} Item Terpilih</span>
                <Button size="sm" variant="default" onClick={handleBulkPublish}>
                  <Check className="w-3.5 h-3.5 mr-1" /> Terbitkan
                </Button>
                <Button size="sm" variant="success" onClick={handleBulkClean}>
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Bersihkan
                </Button>
                <Button size="sm" variant="destructive-solid" onClick={handleBulkDelete}>
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
                </Button>
              </div>
            )}
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                    <th className="p-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        checked={allSelected} 
                        onChange={toggleAll}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                      />
                    </th>
                    <th className="p-4">Judul Event</th>
                    <th className="p-4 w-48">Sumber Halaman</th>
                    <th className="p-4 w-32">Status</th>
                    <th className="p-4 w-48 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {paginatedData.map((item) => {
                    const confidence = item.data.confidenceScore ?? 0;
                    let confidenceColor = "bg-rose-50 text-rose-700 border-rose-100";
                    let confidenceIcon = "❌";
                    if (confidence >= 90) {
                      confidenceColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                      confidenceIcon = "✅";
                    } else if (confidence >= 75) {
                      confidenceColor = "bg-amber-50 text-amber-700 border-amber-100";
                      confidenceIcon = "⚠️";
                    }

                    // Metadata
                    const categoryName = categories.find(c => c.id === item.data.kategoriId)?.nama || item.data.jenisEvent || 'Event';
                    const cityName = cities.find(c => c.id === item.data.kotaId)?.nama || 'Lokasi tidak ditentukan';
                    const dateStr = item.data.tanggalMulai ? new Date(item.data.tanggalMulai).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) : 'Tanggal belum ditentukan';

                    return (
                      <tr key={item.id} className="hover:bg-indigo-50/15 border-b border-slate-100 transition-all duration-150 group">
                        <td className="p-4 text-center align-middle">
                          <input 
                            type="checkbox" 
                            checked={selected.has(item.id)} 
                            onChange={() => toggleOne(item.id)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                          />
                        </td>
                        <td className="p-4 font-medium text-slate-800 align-middle">
                          <div className="flex flex-col items-start gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <button 
                                className="text-left font-bold text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer group-hover:underline line-clamp-2 text-sm sm:text-base" 
                                onClick={() => handleOpenPreview(item)}
                              >
                                {item.data.judul}
                              </button>
                              
                              {/* Confidence score badge */}
                              <span className={`inline-flex items-center gap-0.5 text-xxs font-bold px-1.5 py-0.5 rounded border ${confidenceColor}`}>
                                {confidenceIcon} {confidence}%
                              </span>

                              {item.data.autoApproved && (
                                <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-xxs font-bold px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Auto-Approved
                                </span>
                              )}
                            </div>

                            {/* Metadata Subtitle */}
                            <div className="text-xs text-slate-400 font-medium flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold uppercase tracking-tight text-xxs">
                                <Tag className="w-2.5 h-2.5" />
                                {categoryName}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {cityName}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="flex items-center gap-0.5">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {dateStr}
                              </span>
                            </div>

                            {/* Inline Quick Actions */}
                            <div className="flex gap-3.5 mt-2 text-slate-500 opacity-60 group-hover:opacity-100 transition-opacity duration-150">
                              <Button
                                variant="link"
                                size="xs"
                                onClick={() => handleOpenPreview(item)}
                              >
                                <Eye className="w-3 h-3" /> Detail & Terbit
                              </Button>
                              {item.status !== 'processed' && (
                                <Button
                                  variant="link"
                                  size="xs"
                                  onClick={() => handleClean(item.id)}
                                >
                                  <Sparkles className="w-3 h-3" /> Bersihkan Data
                                </Button>
                              )}
                              {item.data.linkEksternal && (
                                <a 
                                  href={item.data.linkEksternal}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-bold text-slate-500 hover:text-slate-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Globe className="w-3 h-3" /> Buka Event Asli ↗
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500 max-w-[200px] truncate align-middle">
                          <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-xs">
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            {new URL(item.sumber || 'https://eventkampus.com').hostname}
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge 
                            variant={item.status === 'processed' ? 'default' : 'secondary'}
                            className={`shadow-none font-bold uppercase tracking-wider text-xxs ${
                              item.status === 'processed' 
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200' 
                                : 'bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200'
                            }`}
                          >
                            {item.status === 'processed' ? 'processed' : 'pending'}
                          </Badge>
                        </td>
                        <td className="p-4 text-right align-middle">
                          <div className="flex gap-1.5 justify-end">
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => handleOpenPreview(item)}
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" /> Detail & Terbit
                            </Button>
                            {item.status !== 'processed' && (
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => handleClean(item.id)}
                              >
                                <Sparkles className="w-3.5 h-3.5 mr-1" /> Clean
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2 py-4">
                          <AlertCircle className="w-8 h-8 text-slate-300" />
                          <p className="font-semibold text-slate-500">Tidak ada data scraping ditemukan</p>
                          <p className="text-xs text-slate-400">Gunakan tombol Mulai Scraping Baru di atas untuk menarik data</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            itemLabel="data"
          />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={refreshLogs}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh Logs
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                    <th className="p-4">Waktu Eksekusi</th>
                    <th className="p-4">Target Scraper</th>
                    <th className="p-4 w-32">Status</th>
                    <th className="p-4 w-28">Jumlah Data</th>
                    <th className="p-4">Keterangan / Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-slate-600 font-medium">
                        {log.mulaiPada ? new Date(log.mulaiPada).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'}
                      </td>
                      <td className="p-4 text-xs font-mono text-slate-500 max-w-[250px] truncate" title={log.targetUrl || undefined}>
                        {log.targetUrl}
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={log.status === 'success' ? 'default' : 'destructive'}
                          className={`shadow-none font-bold uppercase tracking-wider text-xxs ${
                            log.status === 'success' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="p-4 font-bold text-slate-800">{log.jumlahData ?? 0}</td>
                      <td className="p-4 text-xs max-w-[300px] truncate" title={log.errorMessage || undefined}>
                        {log.errorMessage ? (
                          <span className="text-rose-600 font-medium">{log.errorMessage}</span>
                        ) : (
                          <span className="text-slate-400">Scraping sukses</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">Belum ada riwayat aktivitas log scraping.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Interactive Form & Preview Modal */}
      <Modal 
        open={!!previewItem} 
        onClose={() => setPreviewItem(null)} 
        title="Validasi & Publikasi Event" 
        className="max-w-4xl rounded-2xl shadow-2xl border-0 overflow-hidden"
      >
        {previewItem && (() => {
          const renderConfidenceBadge = (val: number | undefined) => {
            if (val === undefined) return null;
            let colorClass = "bg-rose-50 text-rose-700 border-rose-100";
            if (val >= 90) colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
            else if (val >= 75) colorClass = "bg-amber-50 text-amber-700 border-amber-100";
            
            return (
              <span className={`ml-2 inline-flex items-center text-xxs font-bold px-1.5 py-0.5 rounded border ${colorClass}`}>
                Skor: {val}%
              </span>
            );
          };

          return (
            <div className="space-y-4 pt-3 text-slate-700">
              {previewItem.data.urlBanner && (
                <div className="relative h-44 w-full bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-100 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={previewItem.data.urlBanner} 
                    alt="Banner Event" 
                    className="object-cover w-full h-full opacity-90"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xxs font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 border border-white/10">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Scraped Image
                  </div>
                </div>
              )}

              {/* Confidence Summary & Warning Alerts */}
              {previewItem.status === 'processed' && (
                <div className={`p-5 rounded-2xl border ${
                  previewItem.data.autoApproved
                    ? 'bg-emerald-50/40 border-emerald-100 text-emerald-950'
                    : 'bg-amber-50/40 border-amber-100 text-amber-950'
                } space-y-3`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-slate-700">Skor Keyakinan Data (Confidence):</span>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border shadow-sm ${
                        previewItem.data.autoApproved
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {previewItem.data.autoApproved ? '✅' : '⚠️'} {previewItem.data.confidenceScore ?? 0} / 100
                      </span>
                    </div>
                    {previewItem.data.autoApproved && (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Auto-Approved
                      </span>
                    )}
                  </div>

                  {/* Validation Warnings Checklist */}
                  {previewItem.data.confidenceScore !== undefined && previewItem.data.confidenceScore < 100 && (
                    <div className="bg-white/80 border border-amber-100 p-4 rounded-xl text-xs space-y-2 text-slate-700 shadow-sm">
                      <span className="font-bold flex items-center gap-1.5 text-amber-800">
                        <AlertCircle className="w-4 h-4 text-amber-600" /> Rekomendasi Tindakan & Checklist Validasi:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 list-disc list-inside pl-1 text-slate-600 font-medium">
                        {(!previewItem.data.judul || previewItem.data.judul.length <= 5) && (
                          <li>Judul event terlalu pendek / kosong</li>
                        )}
                        {!previewItem.data.tanggalMulai && (
                          <li>Tanggal mulai event tidak terdeteksi otomatis</li>
                        )}
                        {!previewItem.data.tipePlatform && (
                          <li>Platform event (Online/Offline) gagal dipetakan</li>
                        )}
                        {!previewItem.data.kotaId && (
                          <li>Kota asal tidak cocok dengan database</li>
                        )}
                        {!previewItem.data.kategoriId && (
                          <li>Kategori event gagal dipetakan</li>
                        )}
                        {(!previewItem.data.deskripsi || previewItem.data.deskripsi.length <= 20) && (
                          <li>Deskripsi event kosong atau terlalu ringkas</li>
                        )}
                        {!previewItem.data.linkRegistrasi && !previewItem.data.teleponKontak && (
                          <li>Link registrasi & nomor kontak CP kosong</li>
                        )}
                        {previewItem.data.tipeHarga === 'paid' && !previewItem.data.harga && (
                          <li>Harga tiket bernilai Rp 0 (padahal Event Berbayar)</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="bg-slate-100 p-1 rounded-xl w-full sm:w-auto grid grid-cols-3 mb-4 border border-slate-200/50">
                  <TabsTrigger value="edit" className="rounded-lg text-xs sm:text-sm font-semibold">
                    Formulir Edit
                  </TabsTrigger>
                  <TabsTrigger value="compare" className="rounded-lg text-xs sm:text-sm font-semibold">
                    Perbandingan Data
                  </TabsTrigger>
                  <TabsTrigger value="raw" className="rounded-lg text-xs sm:text-sm font-semibold">
                    JSON Mentah
                  </TabsTrigger>
                </TabsList>

                {/* TAB 1: FORM EDIT */}
                <TabsContent value="edit" className="space-y-6 pt-1">
                  
                  {/* SECTION 1: INFORMASI UTAMA */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <FileText className="w-4 h-4" /> 1. Informasi Utama Event
                    </h3>
                    
                    {/* Judul */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                        Judul Event <span className="text-rose-500 ml-0.5">*</span>
                        {renderConfidenceBadge(previewItem.data.fieldConfidence?.judul)}
                      </label>
                      <input 
                        type="text" 
                        value={editJudul}
                        onChange={(e) => setEditJudul(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium"
                        placeholder="Judul seminar/conference"
                      />
                      <p className="text-xxs text-slate-400 mt-1">Judul resmi event yang akan dipublikasikan.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Tanggal Mulai */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> Tanggal Mulai <span className="text-rose-500 ml-0.5">*</span>
                          {renderConfidenceBadge(previewItem.data.fieldConfidence?.tanggalMulai)}
                        </label>
                        <input 
                          type="date" 
                          value={editTanggalMulai}
                          onChange={(e) => setEditTanggalMulai(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Format: DD/MM/YYYY. Tanggal dimulainya event.</p>
                      </div>
                      
                      {/* Tanggal Selesai */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> Tanggal Selesai (Opsional)
                        </label>
                        <input 
                          type="date" 
                          value={editTanggalSelesai}
                          onChange={(e) => setEditTanggalSelesai(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Isi jika event berlangsung lebih dari satu hari.</p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: LOKASI & KLASIFIKASI */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <MapPin className="w-4 h-4" /> 2. Lokasi & Klasifikasi Event
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Platform */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                          Platform <span className="text-rose-500 ml-0.5">*</span>
                          {renderConfidenceBadge(previewItem.data.fieldConfidence?.tipePlatform)}
                        </label>
                        <select 
                          value={editTipePlatform || ''} 
                          onChange={(e) => setEditTipePlatform((e.target.value || null) as 'online' | 'offline' | 'hybrid' | null)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium"
                        >
                          <option value="">Belum Ditentukan</option>
                          <option value="online">Online (Daring)</option>
                          <option value="offline">Offline (Luring)</option>
                          <option value="hybrid">Hybrid (Hibrida)</option>
                        </select>
                        <p className="text-xxs text-slate-400 mt-1">Pilih metode pelaksanaan event.</p>
                      </div>

                      {/* Detail Lokasi */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          Detail Lokasi <span className="text-rose-500 ml-0.5">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={editDetailLokasi}
                          onChange={(e) => setEditDetailLokasi(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium"
                          placeholder="Gedung, Jalan, atau Meeting Link"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Nama tempat, alamat jalan, atau URL Zoom / link webinar.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Kota */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          Kota (Database) <span className="text-rose-500 ml-0.5">*</span>
                          {renderConfidenceBadge(previewItem.data.fieldConfidence?.kotaId)}
                        </label>
                        <select 
                          value={editKotaId || ''} 
                          onChange={(e) => setEditKotaId(e.target.value ? Number(e.target.value) : null)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium"
                        >
                          <option value="">Pilih Kota...</option>
                          {cities.map((city) => (
                            <option key={city.id} value={city.id}>{city.nama}</option>
                          ))}
                        </select>
                        <p className="text-xxs text-slate-400 mt-1">Harus dipetakan ke data kota terdaftar.</p>
                      </div>

                      {/* Kategori */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          Kategori (Database) <span className="text-rose-500 ml-0.5">*</span>
                          {renderConfidenceBadge(previewItem.data.fieldConfidence?.kategoriId)}
                        </label>
                        <select 
                          value={editKategoriId || ''} 
                          onChange={(e) => setEditKategoriId(e.target.value ? Number(e.target.value) : null)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium"
                        >
                          <option value="">Pilih Kategori...</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nama}</option>
                          ))}
                        </select>
                        <p className="text-xxs text-slate-400 mt-1">Kelompok utama kategori event.</p>
                      </div>

                      {/* Jenis Event */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Jenis Event <span className="text-rose-500 ml-0.5">*</span></label>
                        <select 
                          value={editJenisEvent} 
                          onChange={(e) => setEditJenisEvent(e.target.value as 'seminar' | 'conference')}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium"
                        >
                          <option value="seminar">Seminar</option>
                          <option value="conference">Conference</option>
                        </select>
                        <p className="text-xxs text-slate-400 mt-1">Tipe format acara.</p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: HARGA & KUOTA */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <Coins className="w-4 h-4" /> 3. Harga & Kuota Tiket
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Tipe Harga */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Tipe Harga <span className="text-rose-500 ml-0.5">*</span>
                          {renderConfidenceBadge(previewItem.data.fieldConfidence?.harga)}
                        </label>
                        <select
                          value={editTipeHarga}
                          onChange={(e) => {
                            const val = e.target.value as 'free' | 'paid';
                            setEditTipeHarga(val);
                            if (val === 'free') setEditHarga(0);
                          }}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium"
                        >
                          <option value="free">Gratis (Free)</option>
                          <option value="paid">Berbayar (Paid)</option>
                        </select>
                        <p className="text-xxs text-slate-400 mt-1">Status biaya registrasi.</p>
                      </div>

                      {/* Harga */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Harga (Rp)</label>
                        <input
                          type="number"
                          value={editHarga}
                          onChange={(e) => setEditHarga(Number(e.target.value))}
                          disabled={editTipeHarga === 'free'}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100"
                          placeholder="Contoh: 50000"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Nominal harga (dinonaktifkan jika Gratis).</p>
                      </div>

                      {/* Kuota */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Kuota Peserta</label>
                        <input
                          type="number"
                          value={editKuota}
                          onChange={(e) => setEditKuota(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium"
                          placeholder="Kosongkan jika tak terbatas"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Batas kuota pendaftar (opsional).</p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: PENDAFTARAN & KONTAK PANITIA */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <User className="w-4 h-4" /> 4. Pendaftaran & Kontak Panitia
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Link Registrasi */}
                      <div className="space-y-1.5 sm:col-span-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Link Registrasi Asli <span className="text-rose-500 ml-0.5">*</span>
                          {renderConfidenceBadge(previewItem.data.fieldConfidence?.kontak)}
                        </label>
                        <input
                          type="text"
                          value={editLinkRegistrasi}
                          onChange={(e) => setEditLinkRegistrasi(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium"
                          placeholder="Google Form atau Link Pendaftaran"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Tautan pendaftaran eksternal.</p>
                      </div>

                      {/* Nama CP */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Nama Kontak (CP)</label>
                        <input
                          type="text"
                          value={editNamaKontak}
                          onChange={(e) => setEditNamaKontak(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium"
                          placeholder="Nama Contact Person"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Nama narahubung panitia.</p>
                      </div>

                      {/* Telepon CP */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">No Telepon CP</label>
                        <input
                          type="text"
                          value={editTeleponKontak}
                          onChange={(e) => setEditTeleponKontak(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium"
                          placeholder="No Telp / WhatsApp CP"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Format bebas (disarankan format WA).</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 pt-2">
                      {/* Email CP */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Email CP (Opsional)</label>
                        <input
                          type="email"
                          value={editEmailKontak}
                          onChange={(e) => setEditEmailKontak(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium"
                          placeholder="panitia@domain.com"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Surel resmi pendaftaran atau panitia.</p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: DESKRIPSI EVENT */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <FileText className="w-4 h-4" /> 5. Deskripsi Detail Event
                    </h3>

                    {/* Deskripsi */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                        Deskripsi Event (HTML/Teks)
                        {renderConfidenceBadge(previewItem.data.fieldConfidence?.deskripsi)}
                      </label>
                      <textarea
                        value={editDeskripsi}
                        onChange={(e) => setEditDeskripsi(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150 bg-white text-slate-800 font-medium resize-y"
                        placeholder="Deskripsi event..."
                      />
                      <div className="flex justify-between items-center text-xxs text-slate-400 mt-1">
                        <span>Masukkan deskripsi lengkap, jadwal/rundown, pembicara, dsb.</span>
                        <span>{editDeskripsi.length} karakter digunakan</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 2: COMPARISON VIEW */}
                <TabsContent value="compare" className="space-y-4 pt-1">
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200 font-semibold text-xs text-slate-500 uppercase tracking-wider p-3">
                      <div>Data Mentah Asli (Original Scraped)</div>
                      <div className="border-l border-slate-200 pl-4">Data Hasil Normalisasi (Cleaned)</div>
                    </div>
                    <div className="divide-y divide-slate-100 text-sm">
                      {/* Judul */}
                      <div className="grid grid-cols-2 p-3.5 gap-4">
                        <div className="text-slate-500 font-mono text-xs break-all">
                          {previewItem.data._raw?.judul || previewItem.data.judul || '-'}
                        </div>
                        <div className="border-l border-slate-100 pl-4 font-semibold text-slate-800 break-all">
                          {editJudul || '-'}
                        </div>
                      </div>
                      {/* Tanggal */}
                      <div className="grid grid-cols-2 p-3.5 gap-4">
                        <div className="text-slate-500 font-mono text-xs">
                          <div>Tanggal Mentah: {previewItem.data._raw?.tanggalMentah || previewItem.data.tanggalMentah || '-'}</div>
                          {previewItem.data._raw?.tanggalSelesai && (
                            <div>Selesai Mentah: {previewItem.data._raw?.tanggalSelesai}</div>
                          )}
                        </div>
                        <div className="border-l border-slate-100 pl-4 text-slate-800">
                          <div>Mulai: {editTanggalMulai || '-'}</div>
                          {editTanggalSelesai && <div>Selesai: {editTanggalSelesai}</div>}
                        </div>
                      </div>
                      {/* Lokasi */}
                      <div className="grid grid-cols-2 p-3.5 gap-4">
                        <div className="text-slate-500 font-mono text-xs break-all">
                          {previewItem.data._raw?.detailLokasi || previewItem.data.detailLokasi || '-'}
                        </div>
                        <div className="border-l border-slate-100 pl-4 text-slate-800 space-y-1">
                          <div>Lokasi: {editDetailLokasi || '-'}</div>
                          <div>
                            Platform: <Badge variant="secondary" className="capitalize text-xxs font-bold shadow-none py-0 px-1.5 border border-slate-200">
                              {editTipePlatform || 'Belum ditentukan'}
                            </Badge>
                          </div>
                          <div className="text-slate-500 text-xs">
                            Kota: {cities.find(c => c.id === editKotaId)?.nama || 'Belum dipilih'} (ID: {editKotaId || '-'})
                          </div>
                        </div>
                      </div>
                      {/* Harga / Kuota */}
                      <div className="grid grid-cols-2 p-3.5 gap-4">
                        <div className="text-slate-500 font-mono text-xs">
                          <div>Harga Mentah: {previewItem.data._raw?.tipeHarga || '-'} {previewItem.data._raw?.harga !== undefined ? `(Rp ${previewItem.data._raw.harga})` : ''}</div>
                          <div>Kuota Mentah: {previewItem.data._raw?.kuota ?? '-'}</div>
                        </div>
                        <div className="border-l border-slate-100 pl-4 text-slate-800">
                          <div>Harga: {editTipeHarga === 'free' ? 'Gratis' : `Rp ${editHarga.toLocaleString('id-ID')}`}</div>
                          <div>Kuota: {editKuota || 'Tak terbatas'}</div>
                        </div>
                      </div>
                      {/* Kontak & Registrasi */}
                      <div className="grid grid-cols-2 p-3.5 gap-4">
                        <div className="text-slate-500 font-mono text-xs break-all">
                          <div>Link Reg Mentah: {previewItem.data._raw?.linkRegistrasi || '-'}</div>
                          <div>Kontak Mentah: {previewItem.data._raw?.namaKontak || '-'} ({previewItem.data._raw?.teleponKontak || '-'})</div>
                        </div>
                        <div className="border-l border-slate-100 pl-4 text-slate-800 space-y-1 break-all">
                          <div>Link Reg: <span className="text-xs font-mono text-indigo-600 block">{editLinkRegistrasi || '-'}</span></div>
                          <div>CP: {editNamaKontak || '-'} ({editTeleponKontak || '-'})</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 3: RAW JSON */}
                <TabsContent value="raw" className="space-y-4 pt-1">
                  <div className="bg-slate-900 text-slate-200 p-4 rounded-xl border border-slate-800 shadow-inner font-mono text-xs overflow-x-auto max-h-[400px]">
                    <pre>{JSON.stringify(previewItem.data._raw || previewItem.data, null, 2)}</pre>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-5 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setPreviewItem(null)}
                >
                  Batal
                </Button>
                <Button
                  onClick={() => handlePublish(previewItem.id)}
                  loading={isPublishing}
                >
                  <Check className="w-4 h-4 mr-2" /> Setujui & Terbitkan
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
