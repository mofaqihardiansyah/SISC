'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  Building2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Trash2,
  Users,
  Edit3
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { deleteEvent, updateEventStatus } from '@/actions/admin-event';
import { cn } from "@/lib/utils";
import DataEvent from './DataEvent';
import EditEvent from './EditEvent';

export type Event = {
  id: number;
  judul: string;
  penyelenggara: string | null;
  tanggalMulai: Date;
  tanggalSelesai: Date | null;
  status: 'pending' | 'published' | 'rejected';
  bannerUrl: string | null;
  deskripsi: string | null;
  syaratDanKetentuan: string | null;
  detailLokasi: string | null;
  kuota: number | null;
  isEventPolines: boolean;
  jenisEvent: 'seminar' | 'conference' | null;
  tipePlatform: 'online' | 'offline' | 'hybrid' | null;
  tipeHarga: 'free' | 'paid' | null;
  harga: number | null;
  participantCount?: number;
  namaPembicara: string | null;
  websiteSumber: string | null;
  emailKontak: string | null;
  teleponKontak: string | null;
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

  // Sync state with props when server data refreshes
  React.useEffect(() => {
    setEvents(initialEventsData);
  }, [initialEventsData]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [statusTab, setStatusTab] = useState<'all' | 'pending' | 'published' | 'rejected'>('all');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.judul.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (e.penyelenggara && e.penyelenggara.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === 'all' || e.jenisEvent === typeFilter;
      const matchesStatus = statusTab === 'all' || e.status === statusTab;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [events, searchTerm, typeFilter, statusTab]);

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

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus event ini?')) return;

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

  const handleStatusUpdate = async (id: number, status: 'published' | 'rejected') => {
    try {
      const res = await updateEventStatus(id, status);
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

  const openEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditOpen(true);
  };

  const handleEditSuccess = () => {
    // router.refresh() will update the server-side props
    // and trigger a re-render without a full page reload
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
        <h1 className="text-3xl font-black text-[#0E215D] tracking-tight">Manajemen Event</h1>
        <p className="text-slate-500 font-medium text-sm max-w-2xl">
          Kelola event yang didaftarkan oleh penyelenggara di platform.
        </p>
      </div>

      {/* Unified Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
        
        {/* Status Tabs */}
        <div className="flex items-center border-b border-slate-200/60 px-2 pt-2">
          {[
            { id: 'all', label: 'Semua Event', count: events.length },
            { id: 'pending', label: 'Menunggu Verifikasi', count: events.filter(e => e.status === 'pending').length },
            { id: 'published', label: 'Published', count: events.filter(e => e.status === 'published').length },
            { id: 'rejected', label: 'Ditolak', count: events.filter(e => e.status === 'rejected').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id as 'all' | 'pending' | 'published' | 'rejected')}
              className={cn(
                "px-5 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2",
                statusTab === tab.id 
                  ? "border-[#0E215D] text-[#0E215D]" 
                  : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300"
              )}
            >
              {tab.label}
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[9px]",
                statusTab === tab.id ? "bg-[#0E215D]/10 text-[#0E215D]" : "bg-slate-100 text-slate-500"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Control Bar inside Grid */}
        <div className="p-3 bg-slate-50/50 border-b border-slate-200/60 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative group flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0E215D] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Cari judul event atau penyelenggara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-lg outline-none text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-[#0E215D]/30 transition-all shadow-sm" 
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {selectedRowIds.size > 0 && (
              <div className="flex items-center gap-2 mr-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                <span>{selectedRowIds.size} dipilih</span>
                <div className="h-4 w-px bg-slate-300 mx-1"></div>
                <button className="text-rose-600 hover:text-rose-700 px-2 py-0.5 rounded hover:bg-rose-50 transition-colors">Hapus</button>
              </div>
            )}
            <div className="relative min-w-[130px]">
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200/60 text-slate-700 pl-3 pr-8 py-2 rounded-lg outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer focus:border-[#0E215D]/30 transition-all shadow-sm"
              >
                <option value="all">Semua Jenis</option>
                <option value="seminar">Seminar</option>
                <option value="conference">Conference</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
            <div className="relative min-w-[130px]">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200/60 text-slate-700 pl-3 pr-8 py-2 rounded-lg outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer focus:border-[#0E215D]/30 transition-all shadow-sm"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="name_asc">Nama (A-Z)</option>
                <option value="name_desc">Nama (Z-A)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/60 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-3 w-16 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-[#0E215D] focus:ring-[#0E215D] cursor-pointer"
                      checked={sortedEvents.length > 0 && selectedRowIds.size === sortedEvents.length}
                      onChange={toggleSelectAll}
                    />
                    <span>#</span>
                  </div>
                </th>
                <th className="px-6 py-3 whitespace-nowrap">Event</th>
                <th className="px-6 py-3 whitespace-nowrap">Penyelenggara & Waktu</th>
                <th className="px-6 py-3 text-center whitespace-nowrap">Kategori</th>
                <th className="px-6 py-3 text-center whitespace-nowrap">Pendaftar</th>
                <th className="px-6 py-3 text-center whitespace-nowrap">Status</th>
                <th className="px-6 py-3 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 text-xs">
              {sortedEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-slate-100 shadow-inner">
                      <Search className="text-slate-300" size={20} />
                    </div>
                    <p className="font-black text-slate-800 text-sm tracking-tight mb-1">Tidak Ada Data</p>
                    <p className="text-xs font-medium text-slate-400">Gunakan kata kunci atau filter lain untuk menemukan event.</p>
                  </td>
                </tr>
              ) : (
                sortedEvents.map((event, index) => (
                  <tr key={event.id} className={cn("hover:bg-slate-50/25 transition-colors group", selectedRowIds.has(event.id) && "bg-blue-50/30")}>
                    {/* Checkbox & Number */}
                    <td className="px-6 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-[#0E215D] focus:ring-[#0E215D] cursor-pointer"
                          checked={selectedRowIds.has(event.id)}
                          onChange={() => toggleSelectRow(event.id)}
                        />
                        <span className="text-[10px] font-bold text-slate-400">{index + 1}</span>
                      </div>
                    </td>
 
                    {/* Column 1: Event */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200/60 group-hover:border-[#0E215D]/20 transition-colors">
                          {event.bannerUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={event.bannerUrl} alt={event.judul} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                              <Building2 size={16} />
                            </div>
                          )}
                        </div>
                        <div className="font-semibold text-slate-800 text-[13px] group-hover:text-[#0E215D] transition-colors truncate max-w-[200px]" title={event.judul}>
                          {event.judul}
                        </div>
                      </div>
                    </td>
 
                    {/* Column 2: Penyelenggara & Waktu */}
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-slate-700 truncate max-w-[150px]">{event.penyelenggara || 'Institusi Polines'}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <Clock size={10} className="text-slate-400" />
                        {format(new Date(event.tanggalMulai), 'dd MMM yyyy', { locale: id })}
                      </div>
                    </td>
 
                    {/* Column 3: Kategori */}
                    <td className="px-6 py-3.5 text-center">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold border tracking-wider uppercase whitespace-nowrap",
                        event.jenisEvent === 'conference'
                          ? "bg-blue-50 text-blue-700 border-blue-200/60"
                          : "bg-indigo-50 text-indigo-700 border-indigo-200/60"
                      )}>
                        {event.jenisEvent === 'conference' ? 'Konferensi' : event.jenisEvent === 'seminar' ? 'Seminar' : 'Event'}
                      </span>
                    </td>
                    
                    {/* Column 4: Monitoring */}
                    <td className="px-6 py-3.5">
                      <div className="flex justify-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-50 text-[#0E215D] rounded-full text-xs font-bold border border-slate-200/60">
                          <Users size={12} strokeWidth={2.5} />
                          {event.participantCount || 0}
                        </div>
                      </div>
                    </td>
 
                    {/* Column 5: Status */}
                    <td className="px-6 py-3.5">
                      <div className="flex justify-center">
                        {event.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 uppercase tracking-wider border border-amber-200/60">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span> Menunggu
                          </span>
                        ) : event.status === 'published' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wider border border-emerald-200/60">
                            <CheckCircle size={10} strokeWidth={3} /> Disetujui
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 uppercase tracking-wider border border-rose-200/60">
                            <AlertCircle size={10} strokeWidth={3} /> Ditolak
                          </span>
                        )}
                      </div>
                    </td>
 
                    {/* Column 6: Aksi */}
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex justify-end items-center gap-1">
                        <button 
                          onClick={() => openDetail(event)}
                          className="p-1.5 text-slate-400 hover:text-[#0E215D] hover:bg-slate-100 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye size={16} strokeWidth={2.5} />
                        </button>
                        <button 
                          onClick={() => openEdit(event)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Event"
                        >
                          <Edit3 size={16} strokeWidth={2.5} />
                        </button>
                        <button 
                          onClick={() => handleDelete(event.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Event"
                        >
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEvent && (
        <DataEvent 
          isOpen={isDetailOpen} 
          onClose={() => setIsDetailOpen(false)} 
          event={selectedEvent} 
          onUpdateStatus={handleStatusUpdate}
        />
      )}

      {/* Edit Modal */}
      {selectedEvent && (
        <EditEvent 
          isOpen={isEditOpen} 
          onClose={() => setIsEditOpen(false)} 
          event={selectedEvent} 
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
