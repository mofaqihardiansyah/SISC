'use client';

import React, { useState, useMemo } from 'react';
import { 
  publishRawEvent, 
  publishManualEvent,
  bulkPublishRawEvents, 
  bulkDeleteRawEvents, 
  cleanRawDataAction, 
  bulkCleanRawData, 
  getLogScraping, 
  scrapeSingleUrl,
  scrapeSourceAction,
  type ScrapedDataField
} from "@/actions/admin-scraping";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SCRAPER } from '@/lib/constants';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import BulkPublishModal from './BulkPublishModal';
import ScrapeResultModal from './ScrapeResultModal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { toast } from 'sonner';
import { 
  Search, 
  RefreshCw, 
  Check, 
  CheckCircle2,
  XCircle,
  AlertTriangle,
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
  FileText,
  Activity,
  Settings
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
  sources: { id: number; name: string; baseUrl: string; scraperType: 'cheerio' | 'crawlee_playwright' | null }[];
  validationRules: { id: number; fieldName: string; isRequired: boolean | null; minLength: number | null; maxLength: number | null; regexPattern: string | null; confidenceThreshold: number | null }[];
}

export default function ScrapingManagement({ initialData, initialLogs, cities, categories, sources, validationRules }: ScrapingManagementProps) {
  const [data, setData] = useState<ScrapedData[]>(initialData);
  const [logs, setLogs] = useState<LogScraping[]>(initialLogs);
  const [isScraping, setIsScraping] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");
  const [selectedSourceId, setSelectedSourceId] = useState<string>("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [previewItem, setPreviewItem] = useState<ScrapedData | null>(null);
  const [bulkModalItems, setBulkModalItems] = useState<ScrapedData[]>([]);
  const [scrapeResults, setScrapeResults] = useState<ScrapedDataField[] | null>(null);
  const [scrapeSourceName, setScrapeSourceName] = useState("");

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

  const isFieldRequired = (fieldName: string) => {
    const rule = validationRules.find(r => r.fieldName === fieldName);
    return rule?.isRequired ?? false;
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

  const handleTargetedScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim()) return toast.error("Masukkan URL terlebih dahulu");
    
    setIsScraping(true);
    try {
      // Source-based bulk scraping
      if (selectedSourceId) {
        const source = sources.find(s => s.id === Number(selectedSourceId));
        const res = await scrapeSourceAction(Number(selectedSourceId));
        if (res.success && res.data) {
          toast.success(`${res.count} event ditemukan dari ${source?.name || 'sumber'}!`);
          setScrapeSourceName(source?.name || 'Sumber');
          setScrapeResults(res.data as ScrapedDataField[]);
        } else {
          toast.error("Gagal scraping: " + res.error);
        }
      } else {
        // Manual URL scrape (single event)
        const res = await scrapeSingleUrl(targetUrl);
        if (res.success && res.data) {
          toast.success("Berhasil mengekstrak data! Silakan tinjau dan lengkapi.");
          const mockItem: ScrapedData = {
            id: 0,
            sumber: targetUrl,
            urlTarget: targetUrl,
            data: res.data as ScrapedData['data'],
            statusIntegrasi: false,
            status: 'processed',
            dibuatPada: new Date(),
          };
          handleOpenPreview(mockItem);
          setTargetUrl("");
        } else {
          toast.error("Gagal mengekstrak: " + res.error);
        }
      }
      } catch {
      toast.error("Terjadi kesalahan jaringan.");
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
      const payload = {
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
      };

      let res;
      if (id === 0) {
        // Targeted Manual Scrape
        res = await publishManualEvent({
          ...payload,
          urlBanner: previewItem?.data?.urlBanner,
          linkEksternal: previewItem?.data?.linkEksternal,
          websiteSumber: previewItem?.data?.websiteSumber,
        });
      } else {
        // From existing raw database
        res = await publishRawEvent(id, payload);
      }

      if (res.success) {
        toast.success("Event berhasil diterbitkan!");
        if (id !== 0) setData(data.filter(d => d.id !== id));
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6">
        <div className="max-w-xl">
          <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xxs font-bold text-teal-700 tracking-wider mb-3">SCRAPING</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-[1.1]">Scraping Event</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">Tempelkan URL detail event, validasi, lalu terbitkan langsung.</p>
          <a href="/admin/scraping/sources" className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-800 mt-2 transition-colors">
            <Settings className="w-3 h-3" /> Kelola Sumber & Aturan Validasi
          </a>
        </div>
        
        <form onSubmit={handleTargetedScrape} className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          {sources.length > 0 && (
            <Select 
              value={selectedSourceId} 
              onChange={(e) => {
                const id = e.target.value;
                setSelectedSourceId(id);
                if (id) {
                  const src = sources.find(s => s.id === Number(id));
                  if (src) setTargetUrl(src.baseUrl);
                }
              }}
              className="w-full sm:w-56 border-slate-200 bg-white/80 backdrop-blur-sm"
              disabled={isScraping}
            >
              <option value="">Pilih Sumber...</option>
              {sources.map(src => (
                <option key={src.id} value={src.id}>{src.name}</option>
              ))}
            </Select>
          )}
          <div className="relative flex-1 min-w-[320px]">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input 
              placeholder="https://example.com/event/..."
              className="w-full pl-10 border-slate-200 bg-white/80 backdrop-blur-sm focus:bg-white transition-all duration-200"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              disabled={isScraping}
            />
          </div>
          <Button 
            type="submit"
            loading={isScraping} 
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm active:scale-[0.97] transition-all duration-200"
          >
            {!isScraping && <Globe className="w-4 h-4 mr-2" />}
            Scraping
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
        <div className="sm:col-span-1 bg-white p-6 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xxs font-bold text-slate-400 tracking-wider block">Total Data Terkumpul</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-slate-900 tracking-tight">{data.length}</span>
              <span className="text-sm font-medium text-slate-400">event</span>
            </div>
            <p className="text-xs text-slate-400">Hasil scraping dari seluruh sumber</p>
          </div>
          <div className="p-3.5 bg-slate-50 text-slate-400 rounded-xl">
            <Globe className="w-5 h-5" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xxs font-bold text-slate-400 tracking-wider block">Siap Tinjau</span>
            <span className="text-4xl font-black text-emerald-600 tracking-tight">
              {data.filter(d => d.status === 'processed').length}
            </span>
            <p className="text-xs text-slate-400">Data sudah dibersihkan</p>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-500 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xxs font-bold text-slate-400 tracking-wider block">Perlu Dibersihkan</span>
            <span className="text-4xl font-black text-amber-500 tracking-tight">
              {data.filter(d => d.status !== 'processed').length}
            </span>
            <p className="text-xs text-slate-400">Data mentah perlu diproses</p>
          </div>
          <div className="p-3.5 bg-amber-50 text-amber-500 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="data" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl mb-4">
          <TabsTrigger value="data" className="rounded-lg px-4 py-2 text-sm font-semibold">
            Data Scraping
            <Badge variant="secondary" className="ml-2 bg-teal-50 text-teal-700 border-none font-bold">
              {data.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="logs" className="rounded-lg px-4 py-2 text-sm font-semibold">
            Log Aktivitas
            <Badge variant="secondary" className="ml-2 bg-slate-200 text-slate-700 border-none font-bold">
              {logs.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          {/* Filter Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 text-slate-400" />
                <Input 
                  placeholder="Cari event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-44"
              >
                <option value="all">Semua Status</option>
                <option value="processed">Processed (Bersih)</option>
                <option value="pending">Pending (Mentah)</option>
              </Select>
            </div>

            {selected.size > 0 && (
              <div className="flex items-center gap-2 bg-teal-50/60 p-1.5 rounded-lg w-full md:w-auto justify-end">
                <span className="text-xs font-semibold text-teal-700 px-2">{selected.size} Item Terpilih</span>
                <Button size="sm" variant="default" onClick={() => {
                  const items = data.filter(d => selected.has(d.id));
                  if (!items.length) return toast.error('Pilih data terlebih dahulu');
                  setBulkModalItems(items);
                }} className="active:scale-[0.97] transition-all duration-200">
                  <Eye className="w-3.5 h-3.5 mr-1" /> Review & Publish
                </Button>
                <Button size="sm" variant="default" onClick={handleBulkPublish} className="active:scale-[0.97] transition-all duration-200">
                  <Check className="w-3.5 h-3.5 mr-1" /> Terbitkan (Tanpa Edit)
                </Button>
                <Button size="sm" variant="success" onClick={handleBulkClean} className="active:scale-[0.97] transition-all duration-200">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Bersihkan
                </Button>
                <Button size="sm" variant="destructive-solid" onClick={handleBulkDelete} className="active:scale-[0.97] transition-all duration-200">
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
                </Button>
              </div>
            )}
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-semibold text-xxs tracking-wider">
                    <th className="p-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        checked={allSelected} 
                        onChange={toggleAll}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4 cursor-pointer"
                      />
                    </th>
                    <th className="p-4">Judul Event</th>
                    <th className="p-4 w-48">Sumber Halaman</th>
                    <th className="p-4 w-32">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {paginatedData.map((item) => {
                    const confidence = item.data.confidenceScore ?? 0;
                    let confidenceColor = "bg-rose-50 text-rose-700 border-rose-100";
                    let ConfidenceIcon = XCircle;
                    if (confidence >= 90) {
                      confidenceColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                      ConfidenceIcon = CheckCircle2;
                    } else if (confidence >= 75) {
                      confidenceColor = "bg-amber-50 text-amber-700 border-amber-100";
                      ConfidenceIcon = AlertTriangle;
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
                      <tr key={item.id} className="hover:bg-slate-50/60 border-b border-slate-100 transition-all duration-200">
                        <td className="p-4 text-center align-middle">
                          <input 
                            type="checkbox" 
                            checked={selected.has(item.id)} 
                            onChange={() => toggleOne(item.id)}
                            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4 cursor-pointer"
                          />
                        </td>
                        <td className="p-4 font-medium text-slate-800 align-middle">
                          <div className="flex flex-col items-start gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <button 
                                className="text-left font-bold text-slate-800 hover:text-teal-600 transition-all duration-200 line-clamp-2 text-sm sm:text-base active:text-teal-800" 
                                onClick={() => handleOpenPreview(item)}
                              >
                                {item.data.judul}
                              </button>
                              
                              {/* Confidence score badge */}
                              <span className={`inline-flex items-center gap-1 text-xxs font-bold px-1.5 py-0.5 rounded border ${confidenceColor}`}>
                                <ConfidenceIcon className="w-3 h-3" /> {confidence}%
                              </span>
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
                            <div className="flex gap-3.5 mt-2 text-slate-500">
                              <Button
                                variant="link"
                                size="xs"
                                onClick={() => handleOpenPreview(item)}
                                className="active:scale-[0.97] transition-all duration-200"
                              >
                                <Eye className="w-3 h-3" /> Detail & Terbit
                              </Button>
                              {item.status !== 'processed' && (
                                <Button
                                  variant="link"
                                  size="xs"
                                  onClick={() => handleClean(item.id)}
                                  className="active:scale-[0.97] transition-all duration-200"
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
                            {new URL(item.sumber || SCRAPER.DEFAULT_URL).hostname}
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge 
                            variant={item.status === 'processed' ? 'default' : 'secondary'}
                            className={`shadow-none font-bold uppercase tracking-wider text-xxs ${
                              item.status === 'processed' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {item.status === 'processed' ? 'processed' : 'pending'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2 py-4">
                          <AlertCircle className="w-8 h-8 text-slate-300" />
                          <p className="font-semibold text-slate-500">Tidak ada data scraping ditemukan</p>
                          <p className="text-xs text-slate-400">Gunakan form URL di atas untuk scraping data baru</p>
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
            <Button size="sm" variant="outline" onClick={refreshLogs} className="active:scale-[0.97] transition-all duration-200">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh Logs
            </Button>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-semibold text-xxs tracking-wider">
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
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2 py-4">
                          <Activity className="w-8 h-8 text-slate-300" />
                          <p className="font-semibold text-slate-500">Belum ada aktivitas scraping</p>
                          <p className="text-xs text-slate-400">Coba lakukan scraping terlebih dahulu, atau klik <span className="font-bold">Refresh Logs</span> di atas</p>
                        </div>
                      </td>
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
                <div className="p-5 rounded-2xl border bg-amber-50/40 border-amber-100 text-amber-950 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-slate-700">Skor Keyakinan Data (Confidence):</span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border shadow-sm bg-amber-100 text-amber-800 border-amber-200">
                        <AlertTriangle className="w-4 h-4" /> {previewItem.data.confidenceScore ?? 0} / 100
                      </span>
                    </div>
                  </div>

                  {/* Validation Warnings Checklist */}
                  {previewItem.data.confidenceScore !== undefined && previewItem.data.confidenceScore < 100 && (
                    <div className="bg-white/80 border border-amber-100 p-4 rounded-xl text-xs space-y-2 text-slate-700 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5 text-amber-800">
                          <AlertCircle className="w-4 h-4 text-amber-600" /> Rekomendasi Tindakan & Checklist Validasi:
                        </span>
                        <a href="/admin/scraping/sources#rules" className="text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1">
                          <Settings className="w-3 h-3" /> Ubah Aturan
                        </a>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 list-disc list-inside pl-1 text-slate-600 font-medium">
                        {validationRules.map(rule => {
                          const dataRecord = previewItem.data as Record<string, unknown>;
                          if (!(rule.fieldName in dataRecord)) return null;
                          const value = dataRecord[rule.fieldName];
                          const strValue = typeof value === 'string' ? value : String(value ?? '');
                          const numValue = typeof value === 'number' ? value : null;
                          
                          const fieldLabels: Record<string, string> = {
                            judul: 'Judul event',
                            tanggalMulai: 'Tanggal mulai',
                            tanggalSelesai: 'Tanggal selesai',
                            tipePlatform: 'Platform',
                            kotaId: 'Kota',
                            kategoriId: 'Kategori',
                            detailLokasi: 'Lokasi',
                            deskripsi: 'Deskripsi',
                            linkRegistrasi: 'Link registrasi',
                            namaKontak: 'Nama kontak',
                            teleponKontak: 'Telepon kontak',
                            emailKontak: 'Email kontak',
                            harga: 'Harga',
                            tipeHarga: 'Tipe harga',
                            kuota: 'Kuota',
                            jenisEvent: 'Jenis event',
                          };
                          const label = fieldLabels[rule.fieldName] || rule.fieldName;
                          
                          let isInvalid = false;
                          let message = '';
                          
                          if (rule.isRequired) {
                            if (numValue !== null) {
                              isInvalid = numValue === 0 || numValue === undefined;
                              message = `${label} wajib diisi`;
                            } else {
                              isInvalid = !strValue || strValue === 'null' || strValue === 'undefined';
                              message = `${label} wajib diisi`;
                            }
                          }
                          
                          if (!isInvalid && rule.minLength && strValue && strValue.length < rule.minLength) {
                            isInvalid = true;
                            message = `${label} minimal ${rule.minLength} karakter`;
                          }
                          
                          if (!isInvalid && rule.maxLength && strValue && strValue.length > rule.maxLength) {
                            isInvalid = true;
                            message = `${label} maksimal ${rule.maxLength} karakter`;
                          }
                          
                          if (!isInvalid && rule.regexPattern && strValue) {
                            try {
                              const regex = new RegExp(rule.regexPattern);
                              if (!regex.test(strValue)) {
                                isInvalid = true;
                                message = `${label} format tidak sesuai`;
                              }
                            } catch {}
                          }
                          
                          return isInvalid ? (
                            <li key={rule.id}>{message}</li>
                          ) : null;
                        })}
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
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <FileText className="w-4 h-4" /> 1. Informasi Utama Event
                    </h3>
                    
                    {/* Judul */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                        Judul Event {isFieldRequired('judul') && <span className="text-rose-500 ml-0.5">*</span>}
                        {renderConfidenceBadge(previewItem.data.fieldConfidence?.judul)}
                      </label>
                      <Input 
                        value={editJudul}
                        onChange={(e) => setEditJudul(e.target.value)}
                        placeholder="Judul seminar/conference"
                      />
                      <p className="text-xxs text-slate-400 mt-1">Judul resmi event yang akan dipublikasikan.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Tanggal Mulai */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> Tanggal Mulai {isFieldRequired('tanggalMulai') && <span className="text-rose-500 ml-0.5">*</span>}
                          {renderConfidenceBadge(previewItem.data.fieldConfidence?.tanggalMulai)}
                        </label>
                        <Input 
                          type="date" 
                          value={editTanggalMulai}
                          onChange={(e) => setEditTanggalMulai(e.target.value)}
                        />
                        <p className="text-xxs text-slate-400 mt-1">Format: DD/MM/YYYY. Tanggal dimulainya event.</p>
                      </div>
                      
                      {/* Tanggal Selesai */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> Tanggal Selesai (Opsional)
                        </label>
                        <Input 
                          type="date" 
                          value={editTanggalSelesai}
                          onChange={(e) => setEditTanggalSelesai(e.target.value)}
                        />
                        <p className="text-xxs text-slate-400 mt-1">Isi jika event berlangsung lebih dari satu hari.</p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: LOKASI & KLASIFIKASI */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <MapPin className="w-4 h-4" /> 2. Lokasi & Klasifikasi Event
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Platform */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                          Platform {isFieldRequired('tipePlatform') && <span className="text-rose-500 ml-0.5">*</span>}
                          {renderConfidenceBadge(previewItem.data.fieldConfidence?.tipePlatform)}
                        </label>
                        <Select 
                          value={editTipePlatform || ''} 
                          onChange={(e) => setEditTipePlatform((e.target.value || null) as 'online' | 'offline' | 'hybrid' | null)}
                        >
                          <option value="">Belum Ditentukan</option>
                          <option value="online">Online (Daring)</option>
                          <option value="offline">Offline (Luring)</option>
                          <option value="hybrid">Hybrid (Hibrida)</option>
                        </Select>
                        <p className="text-xxs text-slate-400 mt-1">Pilih metode pelaksanaan event.</p>
                      </div>

                      {/* Detail Lokasi */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          Detail Lokasi {isFieldRequired('detailLokasi') && <span className="text-rose-500 ml-0.5">*</span>}
                        </label>
                        <Input 
                          value={editDetailLokasi}
                          onChange={(e) => setEditDetailLokasi(e.target.value)}
                          placeholder="Gedung, Jalan, atau Meeting Link"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Nama tempat, alamat jalan, atau URL Zoom / link webinar.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Kota */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          Kota (Database) {isFieldRequired('kotaId') && <span className="text-rose-500 ml-0.5">*</span>}
                          {renderConfidenceBadge(previewItem.data.fieldConfidence?.kotaId)}
                        </label>
                        <Select 
                          value={editKotaId || ''} 
                          onChange={(e) => setEditKotaId(e.target.value ? Number(e.target.value) : null)}
                        >
                          <option value="">Pilih Kota...</option>
                          {cities.map((city) => (
                            <option key={city.id} value={city.id}>{city.nama}</option>
                          ))}
                        </Select>
                        <p className="text-xxs text-slate-400 mt-1">Harus dipetakan ke data kota terdaftar.</p>
                      </div>

                      {/* Kategori */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          Kategori (Database) {isFieldRequired('kategoriId') && <span className="text-rose-500 ml-0.5">*</span>}
                          {renderConfidenceBadge(previewItem.data.fieldConfidence?.kategoriId)}
                        </label>
                        <Select 
                          value={editKategoriId || ''} 
                          onChange={(e) => setEditKategoriId(e.target.value ? Number(e.target.value) : null)}
                        >
                          <option value="">Pilih Kategori...</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nama}</option>
                          ))}
                        </Select>
                        <p className="text-xxs text-slate-400 mt-1">Kelompok utama kategori event.</p>
                      </div>

                      {/* Jenis Event */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Jenis Event {isFieldRequired('jenisEvent') && <span className="text-rose-500 ml-0.5">*</span>}</label>
                        <Select 
                          value={editJenisEvent} 
                          onChange={(e) => setEditJenisEvent(e.target.value as 'seminar' | 'conference')}
                        >
                          <option value="seminar">Seminar</option>
                          <option value="conference">Conference</option>
                        </Select>
                        <p className="text-xxs text-slate-400 mt-1">Tipe format acara.</p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: HARGA & KUOTA */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <Coins className="w-4 h-4" /> 3. Harga & Kuota Tiket
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Tipe Harga */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Tipe Harga {isFieldRequired('tipeHarga') && <span className="text-rose-500 ml-0.5">*</span>}
                          {renderConfidenceBadge(previewItem.data.fieldConfidence?.harga)}
                        </label>
                        <Select
                          value={editTipeHarga}
                          onChange={(e) => {
                            const val = e.target.value as 'free' | 'paid';
                            setEditTipeHarga(val);
                            if (val === 'free') setEditHarga(0);
                          }}
                        >
                          <option value="free">Gratis (Free)</option>
                          <option value="paid">Berbayar (Paid)</option>
                        </Select>
                        <p className="text-xxs text-slate-400 mt-1">Status biaya registrasi.</p>
                      </div>

                      {/* Harga */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Harga (Rp) {isFieldRequired('harga') && <span className="text-rose-500 ml-0.5">*</span>}</label>
                        <Input
                          type="number"
                          value={editHarga}
                          onChange={(e) => setEditHarga(Number(e.target.value))}
                          disabled={editTipeHarga === 'free'}
                          placeholder="Contoh: 50000"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Nominal harga (dinonaktifkan jika Gratis).</p>
                      </div>

                      {/* Kuota */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Kuota Peserta {isFieldRequired('kuota') && <span className="text-rose-500 ml-0.5">*</span>}</label>
                        <Input
                          type="number"
                          value={editKuota}
                          onChange={(e) => setEditKuota(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="Kosongkan jika tak terbatas"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Batas kuota pendaftar (opsional).</p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: PENDAFTARAN & KONTAK PANITIA */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <User className="w-4 h-4" /> 4. Pendaftaran & Kontak Panitia
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Link Registrasi */}
                      <div className="space-y-1.5 sm:col-span-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Link Registrasi Asli {isFieldRequired('linkRegistrasi') && <span className="text-rose-500 ml-0.5">*</span>}
                          {renderConfidenceBadge(previewItem.data.fieldConfidence?.kontak)}
                        </label>
                        <Input
                          value={editLinkRegistrasi}
                          onChange={(e) => setEditLinkRegistrasi(e.target.value)}
                          placeholder="Google Form atau Link Pendaftaran"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Tautan pendaftaran eksternal.</p>
                      </div>

                      {/* Nama CP */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Nama Kontak (CP) {isFieldRequired('namaKontak') && <span className="text-rose-500 ml-0.5">*</span>}</label>
                        <Input
                          value={editNamaKontak}
                          onChange={(e) => setEditNamaKontak(e.target.value)}
                          placeholder="Nama Contact Person"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Nama narahubung panitia.</p>
                      </div>

                      {/* Telepon CP */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">No Telepon CP {isFieldRequired('teleponKontak') && <span className="text-rose-500 ml-0.5">*</span>}</label>
                        <Input
                          value={editTeleponKontak}
                          onChange={(e) => setEditTeleponKontak(e.target.value)}
                          placeholder="No Telp / WhatsApp CP"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Format bebas (disarankan format WA).</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 pt-2">
                      {/* Email CP */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Email CP (Opsional) {isFieldRequired('emailKontak') && <span className="text-rose-500 ml-0.5">*</span>}</label>
                        <Input
                          type="email"
                          value={editEmailKontak}
                          onChange={(e) => setEditEmailKontak(e.target.value)}
                          placeholder="panitia@domain.com"
                        />
                        <p className="text-xxs text-slate-400 mt-1">Surel resmi pendaftaran atau panitia.</p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: DESKRIPSI EVENT */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <FileText className="w-4 h-4" /> 5. Deskripsi Detail Event
                    </h3>

                    {/* Deskripsi */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                        Deskripsi Event (HTML/Teks) {isFieldRequired('deskripsi') && <span className="text-rose-500 ml-0.5">*</span>}
                        {renderConfidenceBadge(previewItem.data.fieldConfidence?.deskripsi)}
                      </label>
                      <Textarea
                        value={editDeskripsi}
                        onChange={(e) => setEditDeskripsi(e.target.value)}
                        rows={6}
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
                          <div>Link Reg: <span className="text-xs font-mono text-teal-600 block">{editLinkRegistrasi || '-'}</span></div>
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
                  className="active:scale-[0.97] transition-all duration-200"
                >
                  Batal
                </Button>
                <Button
                  onClick={() => handlePublish(previewItem.id)}
                  loading={isPublishing}
                  className="active:scale-[0.97] transition-all duration-200"
                >
                  <Check className="w-4 h-4 mr-2" /> Setujui & Terbitkan
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>

      <BulkPublishModal
        open={bulkModalItems.length > 0}
        onClose={() => setBulkModalItems([])}
        items={bulkModalItems}
        validationRules={validationRules}
        onPublished={(ids) => {
          setData(data.filter(d => !ids.includes(d.id)));
          setSelected(new Set());
          setBulkModalItems([]);
        }}
      />

      <ScrapeResultModal
        open={scrapeResults !== null}
        onClose={() => { setScrapeResults(null); setScrapeSourceName(""); }}
        results={scrapeResults ?? []}
        sourceName={scrapeSourceName}
        onSaved={() => window.location.reload()}
      />

    </div>
  );
}
