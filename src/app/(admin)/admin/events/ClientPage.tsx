'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Eye, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { deleteEvent, updateEventStatus } from '@/actions/admin-event';
import { cn } from "@/lib/utils";
import { EVENT_TARGET_LABELS } from "@/lib/constants";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DataEvent from './DataEvent';
import { ConfirmationModal } from "@/components/feedback/ConfirmationModal";
import { Select } from '@/components/ui/select'

export type Event = {
  id: number;
  judul: string;
  penyelenggara: string | null;
  tanggalMulai: Date;
  tanggalSelesai: Date | null;
  batasRegistrasi: Date | null;
  status: 'pending' | 'published' | 'rejected';
  urlBanner: string | null;
  deskripsi: string | null;
  syaratDanKetentuan: string | null;
  detailLokasi: string | null;
  kuota: number | null;
  eventPolines: boolean;
  jenisEvent: 'seminar' | 'conference' | null;
  tipePlatform: 'online' | 'offline' | 'hybrid' | null;
  tipeHarga: 'free' | 'paid' | null;
  harga: number | null;
  participantCount?: number;
  namaPembicara: string | null;
  websiteSumber: string | null;
  kategoriId: number | null;
  kotaId: number | null;
  metodePembayaran: unknown;
  kotaNama?: string | null;
  provinsiNama?: string | null;
  kategoriNama?: string | null;
};

export type Stats = {
  total: number;
  seminar: number;
  conference: number;
  published: number;
  polines: number;
  umum: number;
};

type ClientPageProps = {
  initialEvents: Event[];
  initialStats: Stats;
};

export default function ClientPage({ initialEvents: initialEventsData }: ClientPageProps) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEventsData);

  useEffect(() => {
    setEvents(initialEventsData);
  }, [initialEventsData]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [targetFilter, setTargetFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [statusTab, setStatusTab] = useState<'all' | 'pending' | 'published' | 'rejected'>('all');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, targetFilter, platformFilter, priceFilter, sortBy, statusTab]);
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, type: 'single' | 'bulk' | null, eventId: number | null }>({ isOpen: false, type: null, eventId: null });

  const isFilterActive = useMemo(() => {
    return searchTerm !== '' || 
      typeFilter !== 'all' || 
      targetFilter !== 'all' || 
      platformFilter !== 'all' || 
      priceFilter !== 'all' || 
      sortBy !== 'newest' || 
      statusTab !== 'all';
  }, [searchTerm, typeFilter, targetFilter, platformFilter, priceFilter, sortBy, statusTab]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setTargetFilter('all');
    setPlatformFilter('all');
    setPriceFilter('all');
    setSortBy('newest');
    setStatusTab('all');
  };

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.judul.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (e.penyelenggara && e.penyelenggara.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === 'all' || e.jenisEvent === typeFilter;
      const matchesStatus = statusTab === 'all' || e.status === statusTab;
      
      const matchesTarget = targetFilter === 'all' || 
        (targetFilter === 'polines' && e.eventPolines) || 
        (targetFilter === 'umum' && !e.eventPolines);
        
      const matchesPlatform = platformFilter === 'all' || e.tipePlatform === platformFilter;
      const matchesPrice = priceFilter === 'all' || e.tipeHarga === priceFilter;

      return matchesSearch && matchesType && matchesStatus && matchesTarget && matchesPlatform && matchesPrice;
    });
  }, [events, searchTerm, typeFilter, statusTab, targetFilter, platformFilter, priceFilter]);

  const sortedEvents = useMemo(() => {
    const sorted = [...filteredEvents];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.tanggalMulai).getTime() - new Date(a.tanggalMulai).getTime());
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.tanggalMulai).getTime() - new Date(b.tanggalMulai).getTime());
    } else if (sortBy === 'name_asc') {
      sorted.sort((a, b) => a.judul.localeCompare(b.judul));
    } else if (sortBy === 'name_desc') {
      sorted.sort((a, b) => b.judul.localeCompare(a.judul));
    }
    return sorted;
  }, [filteredEvents, sortBy]);

  const totalPages = Math.ceil(sortedEvents.length / EVENTS_PER_PAGE) || 1;
  const startIdx = (currentPage - 1) * EVENTS_PER_PAGE;
  const paginatedEvents = sortedEvents.slice(startIdx, startIdx + EVENTS_PER_PAGE);

  const handleDelete = async (id: number) => {
    setConfirmModal({ isOpen: true, type: 'single', eventId: id });
  };

  const executeDelete = async (id: number) => {
    try {
      const res = await deleteEvent(id);
      if (res.success) {
        toast.success(res.message || 'Event berhasil dihapus');
        setEvents(events.filter(e => e.id !== id));
      } else {
        toast.error(res.error || 'Gagal menghapus event');
      }
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan');
    }
  };

  const handleBulkDelete = async () => {
    setConfirmModal({ isOpen: true, type: 'bulk', eventId: null });
  };

  const executeBulkDelete = async () => {
    const idsArray = Array.from(selectedRowIds);
    let successCount = 0;

    const loadingToast = toast.loading('Menghapus event terpilih...');
    try {
      for (const id of idsArray) {
        const res = await deleteEvent(id);
        if (res.success) {
          successCount++;
        }
      }
      toast.dismiss(loadingToast);
      
      if (successCount > 0) {
        toast.success(`${successCount} event berhasil dihapus`);
        setEvents(prev => prev.filter(e => !selectedRowIds.has(e.id)));
        setSelectedRowIds(new Set());
      } else {
        toast.error('Gagal menghapus event terpilih');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error('Terjadi kesalahan saat menghapus massal');
    }
  };

  const handleConfirmExecute = () => {
    if (confirmModal.type === 'single' && confirmModal.eventId) {
      executeDelete(confirmModal.eventId);
    } else if (confirmModal.type === 'bulk') {
      executeBulkDelete();
    }
    setConfirmModal({ isOpen: false, type: null, eventId: null });
  };

  const handleStatusUpdate = async (id: number, status: 'published' | 'rejected', reason?: string) => {
    try {
      const res = await updateEventStatus(id, status, reason);
      if (res.success) {
        toast.success(res.message || 'Status berhasil diperbarui');
        setEvents(events.map(e => e.id === id ? { ...e, status } : e));
      } else {
        toast.error(res.error || 'Gagal update status');
      }
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan');
    }
  };

  const openDetail = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  const handleEditSuccess = () => {
    router.refresh(); 
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.size === sortedEvents.length && sortedEvents.length > 0) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(sortedEvents.map(e => e.id)));
    }
  };

  const toggleSelectRow = (id: number) => {
    const newSelected = new Set(selectedRowIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRowIds(newSelected);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-1 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manajemen Event</h1>
        <p className="text-slate-500 font-medium text-sm max-w-2xl">
          Kelola event yang didaftarkan oleh penyelenggara di platform.
        </p>
      </div>

      {/* Unified Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
        
        {/* Control Bar inside Grid */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-200/60 space-y-4">
          {/* Top Row: Search Bar (Full Width) & Reset Button */}
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={15} />
              <Input 
                type="text" 
                placeholder="Cari event..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-slate-900/30 focus:ring-2 focus:ring-slate-100 transition-all shadow-xs" 
              />
            </div>
            {isFilterActive && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleResetFilters}
              >
                <RotateCcw size={13} /> Reset Filter
              </Button>
            )}
          </div>

          {/* Bottom Row: Grid of Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
            {/* Status Dropdown */}
            <div>
              <label className="block text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status Verifikasi</label>
              <div className="relative">
                <Select 
                  value={statusTab}
                  onChange={(e) => setStatusTab(e.target.value as 'all' | 'pending' | 'published' | 'rejected')}
                  className="w-full appearance-none bg-white border border-slate-200 text-slate-700 pl-3 pr-8 py-1.5 rounded-xl outline-none text-xs font-medium cursor-pointer focus:border-slate-900/30 focus:ring-2 focus:ring-slate-100 transition-all shadow-xs"
                >
                  <option value="all">Semua ({events.length})</option>
                  <option value="pending">Menunggu ({events.filter(e => e.status === 'pending').length})</option>
                  <option value="published">Published ({events.filter(e => e.status === 'published').length})</option>
                  <option value="rejected">Ditolak ({events.filter(e => e.status === 'rejected').length})</option>
                </Select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Jenis Event</label>
              <div className="relative">
                <Select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 text-slate-700 pl-3 pr-8 py-1.5 rounded-xl outline-none text-xs font-medium cursor-pointer focus:border-slate-900/30 focus:ring-2 focus:ring-slate-100 transition-all shadow-xs"
                >
                  <option value="all">Semua Jenis</option>
                  <option value="seminar">Seminar</option>
                  <option value="conference">Conference</option>
                </Select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>

            {/* Target Penyelenggara Filter */}
            <div>
              <label className="block text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Peserta</label>
              <div className="relative">
                <Select 
                  value={targetFilter}
                  onChange={(e) => setTargetFilter(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 text-slate-700 pl-3 pr-8 py-1.5 rounded-xl outline-none text-xs font-medium cursor-pointer focus:border-slate-900/30 focus:ring-2 focus:ring-slate-100 transition-all shadow-xs"
                >
                  <option value="all">Semua Target</option>
                  <option value="polines">{EVENT_TARGET_LABELS.polines}</option>
                  <option value="umum">{EVENT_TARGET_LABELS.umum}</option>
                </Select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="block text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Platform</label>
              <div className="relative">
                <Select 
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 text-slate-700 pl-3 pr-8 py-1.5 rounded-xl outline-none text-xs font-medium cursor-pointer focus:border-slate-900/30 focus:ring-2 focus:ring-slate-100 transition-all shadow-xs"
                >
                  <option value="all">Semua Platform</option>
                  <option value="offline">Offline (Luring)</option>
                  <option value="online">Online (Daring)</option>
                  <option value="hybrid">Hybrid</option>
                </Select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status Biaya</label>
              <div className="relative">
                <Select 
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 text-slate-700 pl-3 pr-8 py-1.5 rounded-xl outline-none text-xs font-medium cursor-pointer focus:border-slate-900/30 focus:ring-2 focus:ring-slate-100 transition-all shadow-xs"
                >
                  <option value="all">Semua Status</option>
                  <option value="free">Gratis</option>
                  <option value="paid">Berbayar</option>
                </Select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Urutkan</label>
              <div className="relative">
                <Select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 text-slate-700 pl-3 pr-8 py-1.5 rounded-xl outline-none text-xs font-medium cursor-pointer focus:border-slate-900/30 focus:ring-2 focus:ring-slate-100 transition-all shadow-xs"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="name_asc">Nama (A-Z)</option>
                  <option value="name_desc">Nama (Z-A)</option>
                </Select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          {/* Action Row: Bulk Selection Actions */}
          {selectedRowIds.size > 0 && (
            <div className="flex justify-end pt-2 border-t border-slate-100/50 mt-1">
              <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-100 rounded-xl h-9">
                <span className="text-xs font-bold text-rose-600">{selectedRowIds.size} dipilih</span>
                <div className="h-4 w-px bg-rose-200 mx-1"></div>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleBulkDelete}
                  className="text-rose-600 hover:text-rose-700"
                >
                  <Trash2 size={12} /> Hapus Massal
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/60 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-3 py-2.5 w-10 text-center select-none">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer w-3.5 h-3.5"
                    checked={sortedEvents.length > 0 && selectedRowIds.size === sortedEvents.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-3 py-2.5 w-10 text-center whitespace-nowrap select-none">#</th>
                <th className="px-3 py-2.5 w-[35%] min-w-56 whitespace-nowrap select-none">Event</th>
                <th className="px-3 py-2.5 w-[20%] min-w-32 whitespace-nowrap select-none">Penyelenggara</th>
                <th className="px-3 py-2.5 w-[15%] min-w-28 whitespace-nowrap select-none">Tipe & Harga</th>
                <th className="px-3 py-2.5 w-[10%] min-w-24 text-center whitespace-nowrap select-none">Status</th>
                <th className="px-3 py-2.5 w-[10%] min-w-20 text-center whitespace-nowrap select-none">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 text-xs text-slate-600">
              {sortedEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-16 text-center text-slate-500">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-slate-100 shadow-inner">
                      <Search className="text-slate-300" size={20} />
                    </div>
                    <p className="font-black text-slate-800 text-sm tracking-tight mb-1">Tidak Ada Data</p>
                    <p className="text-xs font-medium text-slate-400">Gunakan kata kunci atau filter lain untuk menemukan event.</p>
                  </td>
                </tr>
              ) : (
                paginatedEvents.map((event, index) => {
                  return (
                    <tr key={event.id} className={cn("hover:bg-slate-50/25 transition-colors group", selectedRowIds.has(event.id) && "bg-blue-50/30")}>
                      {/* Column 1: Checkbox */}
                      <td className="px-3 py-2.5 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer w-3.5 h-3.5"
                          checked={selectedRowIds.has(event.id)}
                          onChange={() => toggleSelectRow(event.id)}
                        />
                      </td>

                      {/* Column 2: Number */}
                      <td className="px-3 py-2.5 text-center font-bold text-slate-400">
                        {startIdx + index + 1}
                      </td>
   
                      {/* Column 3: Event Title */}
                      <td className="px-3 py-2.5">
                        <div className="flex flex-col min-w-0">
                          <div className="font-bold text-slate-800 text-xs hover:text-indigo-600 transition-colors line-clamp-1" title={event.judul}>
                            {event.judul}
                          </div>
                          <div className="text-nano text-slate-500 mt-0.5">
                             {event.jenisEvent === 'conference' ? 'Konferensi' : event.jenisEvent === 'seminar' ? 'Seminar' : 'Event'} • {event.eventPolines ? EVENT_TARGET_LABELS.polines.split(' ')[0] : EVENT_TARGET_LABELS.umum.split(' ')[0]}
                          </div>
                        </div>
                      </td>
   
                      {/* Column 4: Penyelenggara */}
                      <td className="px-3 py-2.5">
                          <div className="flex items-center text-slate-700">
                            <span className="font-medium text-xs truncate max-w-36">{event.penyelenggara || '-'}</span>
                          </div>
                      </td>
   
                      {/* Column 5: Tipe & Harga */}
                      <td className="px-3 py-2.5">
                        <div className="text-xs text-slate-700 whitespace-nowrap">
                          <span className="capitalize">{event.tipePlatform || '-'}</span> • {event.tipeHarga === 'free' ? <span className="text-emerald-600 font-semibold">Gratis</span> : `Rp ${(event.harga || 0).toLocaleString('id-ID')}`}
                        </div>
                      </td>
   
                      {/* Column 8: Status */}
                      <td className="px-3 py-2.5 text-center">
                        <div className="flex justify-center">
                          {event.status === 'pending' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-nano font-bold bg-amber-50 text-amber-700 uppercase tracking-wider">
                              Menunggu
                            </span>
                          ) : event.status === 'published' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-nano font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                              Disetujui
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-nano font-bold bg-rose-50 text-rose-700 uppercase tracking-wider">
                              Ditolak
                            </span>
                          )}
                        </div>
                      </td>
   
                      {/* Column 9: Aksi */}
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex justify-end items-center gap-1.5">
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => openDetail(event)}
                            aria-label="Lihat Detail"
                          >
                            <Eye size={13} strokeWidth={2.5} />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(event.id)}
                            aria-label="Hapus Event"
                          >
                            <Trash2 size={13} strokeWidth={2.5} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-slate-50/20 mt-auto shrink-0 h-14">
          <span className="text-micro text-slate-400 font-medium">
            {sortedEvents.length > 0 ? (
              <>
                Menampilkan <strong className="text-slate-600">{startIdx + 1}</strong>&ndash;<strong className="text-slate-600">{Math.min(startIdx + EVENTS_PER_PAGE, sortedEvents.length)}</strong> dari <strong className="text-slate-600">{sortedEvents.length}</strong> event
              </>
            ) : (
              "Tidak ada data"
            )}
          </span>
          {totalPages > 1 && (
            <div className="flex gap-1 items-center">
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={mounted ? (currentPage === 1) : false}
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                if (totalPages > 5) {
                  if (p !== 1 && p !== totalPages && Math.abs(p - currentPage) > 1) {
                    if (p === 2 && currentPage > 3) return <span key={p} className="text-slate-400 px-0.5 text-xxs">...</span>;
                    if (p === totalPages - 1 && currentPage < totalPages - 2) return <span key={p} className="text-slate-400 px-0.5 text-xxs">...</span>;
                    return null;
                  }
                }
                
                return (
                  <Button
                    key={p}
                    variant={currentPage === p ? "default" : "outline"}
                    size="icon-xs"
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={mounted ? (currentPage === totalPages) : false}
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEvent && (
        <DataEvent 
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          event={selectedEvent}
          onUpdateStatus={handleStatusUpdate}
          onEditSuccess={handleEditSuccess}
        />
      )}

      {/* Confirm Modal */}
      <ConfirmationModal
        open={confirmModal.isOpen}
        title="Konfirmasi Hapus"
        message={confirmModal.type === 'bulk' 
          ? `Apakah Anda yakin ingin menghapus ${selectedRowIds.size} event terpilih secara massal? Aksi ini tidak dapat dibatalkan.`
          : "Apakah Anda yakin ingin menghapus event ini? Aksi ini tidak dapat dibatalkan."}
        confirmLabel="Ya, Hapus"
        variant="danger"
        onConfirm={handleConfirmExecute}
        onCancel={() => setConfirmModal({ isOpen: false, type: null, eventId: null })}
      />
    </div>
  );
}
