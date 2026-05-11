'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  Calendar, 
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
import { deleteEvent, updateEventStatus } from '@/actions/admin-event';
import DataEvent from './DataEvent';
import EditEvent from './EditEvent';

export type Event = {
  id: number;
  judul: string;
  penyelenggara: string | null;
  tanggalMulai: Date;
  status: 'pending' | 'published' | 'rejected';
  bannerUrl: string | null;
  deskripsi: string | null;
  syaratDanKetentuan: string | null;
  detailLokasi: string | null;
  kuota: number | null;
  tipeHarga: string | null;
  harga: number | null;
  participantCount?: number;
  jenisEvent: 'seminar' | 'conference' | null;
  emailKontak: string | null;
  teleponKontak: string | null;
};

export type Stats = {
  total: number;
  pending: number;
  published: number;
  rejected: number;
};

type ClientPageProps = {
  initialEvents: Event[];
  initialStats: Stats;
};

export default function ClientPage({ initialEvents: initialEventsData, initialStats }: ClientPageProps) {
  const [events, setEvents] = useState<Event[]>(initialEventsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Stats display
  const statsDisplay = [
    { label: 'Total Event', count: initialStats.total, icon: Calendar, color: 'blue', glow: 'bg-blue-500/10' },
    { label: 'Published', count: initialStats.published, icon: CheckCircle, color: 'emerald', glow: 'bg-emerald-500/10' },
    { label: 'Pending', count: initialStats.pending, icon: Clock, color: 'amber', glow: 'bg-amber-500/10' },
    { label: 'Rejected', count: initialStats.rejected, icon: AlertCircle, color: 'rose', glow: 'bg-rose-500/10' },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.judul.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (e.penyelenggara && e.penyelenggara.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, statusFilter]);

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
    // We could re-fetch or just update local state. Re-fetching is safer.
    window.location.reload(); 
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[#0E215D] tracking-tight">Manajemen Event</h1>
          <p className="text-slate-500 font-medium max-w-2xl">
            Kelola, verifikasi, dan pantau seluruh event yang didaftarkan oleh penyelenggara di platform.
          </p>
        </div>
        <button className="bg-[#0E215D] text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#0E215D]/20 hover:bg-[#1a3280] transition-all flex items-center gap-3">
          <Calendar size={18} />
          Tambah Event Baru
        </button>
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat, i) => (
          <div key={i} className="group bg-white border border-slate-200/60 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 relative overflow-hidden">
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.glow} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <p className="text-3xl font-black text-[#0E215D]">{stat.count}</p>
              </div>
              <div className={`
                ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : ''}
                ${stat.color === 'amber' ? 'bg-amber-50 text-amber-500' : ''}
                ${stat.color === 'rose' ? 'bg-rose-50 text-rose-600' : ''}
                p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300
              `}>
                <stat.icon size={26} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="bg-white p-2 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-2">
        <div className="relative group flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0E215D] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Cari judul event atau penyelenggara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-transparent outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400" 
          />
        </div>

        <div className="flex gap-2 p-1">
          <div className="relative min-w-[180px]">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-slate-50 text-slate-700 pl-5 pr-12 py-3.5 rounded-[1.25rem] outline-none text-xs font-black uppercase tracking-widest cursor-pointer border border-transparent focus:border-[#0E215D]/20 transition-all"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Event List Section */}
      <div className="space-y-6">
        <div className="hidden lg:grid grid-cols-12 gap-6 px-12">
          <div className="col-span-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Informasi Event</div>
          <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Monitoring</div>
          <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</div>
          <div className="col-span-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Aksi</div>
        </div>

        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-[3rem] p-24 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner">
                <Search className="text-slate-300" size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Tidak Ada Data</h3>
              <p className="text-slate-400 max-w-xs mx-auto font-medium text-sm leading-relaxed">
                Gunakan kata kunci atau filter lain untuk menemukan event.
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div 
                key={event.id} 
                className="bg-white border border-slate-200/60 hover:border-[#0E215D]/20 rounded-[2.5rem] p-5 lg:p-8 transition-all duration-300 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 group relative"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
                  {/* Info Column */}
                  <div className="lg:col-span-4 flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#0E215D] group-hover:rotate-6 transition-all duration-500 shadow-inner overflow-hidden">
                      {event.bannerUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={event.bannerUrl} alt={event.judul} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="text-slate-400 group-hover:text-white transition-colors" size={28} />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-blue-100/50">{event.jenisEvent || 'Event'}</span>
                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
                          <Clock size={12} className="text-slate-300" /> 
                          {format(new Date(event.tanggalMulai), 'dd MMM yyyy', { locale: id })}
                        </span>
                      </div>
                      <h4 className="font-black text-slate-900 group-hover:text-[#0E215D] transition-colors truncate text-lg leading-tight">{event.judul}</h4>
                      <p className="text-[11px] text-slate-400 font-bold mt-0.5 truncate">{event.penyelenggara || 'Institusi Polines'}</p>
                    </div>
                  </div>

                  {/* Monitoring Column */}
                  <div className="lg:col-span-2 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl py-3 border border-slate-100/50">
                    <div className="flex items-center gap-2 text-[#0E215D]">
                      <Users size={16} strokeWidth={2.5} />
                      <span className="text-lg font-black">{event.participantCount || 0}</span>
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Pendaftar</p>
                  </div>

                  {/* Status Column */}
                  <div className="lg:col-span-2 flex justify-center">
                    {event.status === 'pending' ? (
                      <div className="px-5 py-2.5 bg-amber-50 text-amber-600 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-amber-200/50 flex items-center gap-2 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span> Pending
                      </div>
                    ) : event.status === 'published' ? (
                      <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-emerald-200/50 flex items-center gap-2 shadow-sm">
                        <CheckCircle size={14} strokeWidth={3} /> Published
                      </div>
                    ) : (
                      <div className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-rose-200/50 flex items-center gap-2 shadow-sm">
                        <AlertCircle size={14} strokeWidth={3} /> Rejected
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="lg:col-span-4 flex justify-end items-center gap-2">
                    <button 
                      onClick={() => openDetail(event)}
                      className="p-3 bg-slate-50 text-slate-400 hover:bg-[#0E215D] hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 flex items-center gap-2 group/btn"
                      title="Lihat Detail"
                    >
                      <Eye size={18} strokeWidth={2.5} />
                      <span className="hidden group-hover/btn:block text-[9px] font-black uppercase tracking-widest px-1">Detail</span>
                    </button>

                    <button 
                      onClick={() => openEdit(event)}
                      className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-slate-100 flex items-center gap-2 group/btn"
                      title="Edit Event"
                    >
                      <Edit3 size={18} strokeWidth={2.5} />
                      <span className="hidden group-hover/btn:block text-[9px] font-black uppercase tracking-widest px-1">Edit</span>
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(event.id)}
                      className="p-3 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-rose-100"
                      title="Hapus Event"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))
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
