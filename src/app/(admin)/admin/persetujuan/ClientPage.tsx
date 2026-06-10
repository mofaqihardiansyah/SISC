'use client';

import React, { useState } from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { FileCheck, CheckCircle, Users, X, Calendar, MapPin, Users as UsersIcon, Wallet, Building2, Phone, Mail, Globe, Clock, Tag, Monitor, ClipboardList, Laptop, Film, BookOpen, Briefcase, HeartPulse, Trophy, Music, Utensils } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { approveEvent, rejectEvent, getPendingEvents } from '../../../../actions/persetujuan-event';
import type { PendingEvent } from '../../../../actions/persetujuan-event';
import Portal from '@/components/ui/Portal';
import { toast } from 'sonner';

function EventCategoryIcon({ emoji, className = "w-5 h-5 text-slate-500" }: { emoji: string; className?: string }) {
  switch (emoji) {
    case "ðŸ’»": return <Laptop className={className} />;
    case "ðŸŽ­": return <Film className={className} />;
    case "ðŸ“š": return <BookOpen className={className} />;
    case "ðŸ’¼": return <Briefcase className={className} />;
    case "ðŸ¥": return <HeartPulse className={className} />;
    case "âš½": return <Trophy className={className} />;
    case "ðŸŽµ": return <Music className={className} />;
    case "ðŸ½ï¸": return <Utensils className={className} />;
    default: return <Calendar className={className} />;
  }
}

const getPlatformColor = (platform: string | null) => {
  switch (platform) {
    case 'Offline':
      return 'bg-blue-100 text-blue-800';
    case 'Online':
      return 'bg-purple-100 text-purple-800';
    case 'Hybrid':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const statusLabel: Record<string, string> = {
  pending: 'Menunggu',
  published: 'Disetujui',
  rejected: 'Ditolak',
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

function formatDateDisplay(d: Date | string | null): string {
  if (!d) return '-';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function ReviewModal({
  event,
  isOpen,
  onClose,
  onRefresh,
}: {
  event: PendingEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<'approve' | 'reject' | null>(null);

  if (!isOpen || !event) return null;

  const handleApproveAction = async () => {
    setActionLoading('approve');
    const res = await approveEvent(event.id);
    setActionLoading(null);
    if (res.success) {
      toast.success(res.message || "Event berhasil disetujui");
    } else {
      toast.error(res.error || "Gagal menyetujui event");
    }
    onRefresh();
    onClose();
  };

  const handleRejectAction = async () => {
    setActionLoading('reject');
    const res = await rejectEvent(event.id, rejectReason);
    setActionLoading(null);
    if (res.success) {
      toast.success(res.message || "Event berhasil ditolak");
    } else {
      toast.error(res.error || "Gagal menolak event");
    }
    onRefresh();
    onClose();
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {event.jenisEvent && (
                <>
                  <span className="text-xxs font-bold text-slate-300 uppercase tracking-wider">{event.jenisEvent}</span>
                  <span className="text-xxs font-bold text-slate-300">â€¢</span>
                </>
              )}
              <span className="text-xxs font-bold text-slate-300 uppercase tracking-wider">{event.platform || '-'}</span>
              <span className="text-xxs font-bold text-slate-300">â€¢</span>
              <span className={`text-xxs font-bold uppercase tracking-wider ${
                event.status === 'pending' ? 'text-amber-300' :
                event.status === 'published' ? 'text-emerald-300' : 'text-rose-300'
              }`}>
                {statusLabel[event.status]}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white truncate">{event.judul}</h2>
            <p className="text-sm text-slate-300">oleh {event.penyelenggara || '-'}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 ml-4">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {[
              { label: 'Kategori', value: event.kategori || '-' },
              { label: 'Tanggal', value: formatDateDisplay(event.tanggalMulai) },
              { label: 'Jam', value: `${event.jamMulai} - ${event.jamSelesai}` },
              { label: 'Harga', value: event.harga },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-nano font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                <p className="text-xs font-bold text-slate-800 truncate">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Alasan Penolakan */}
          {event.status === 'rejected' && event.alasanPenolakan && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">Alasan Penolakan</h3>
              <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
                <p className="text-sm text-rose-700 font-medium">{event.alasanPenolakan}</p>
              </div>
            </div>
          )}

          {/* Deskripsi */}
          <div className="mb-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Deskripsi</h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100 whitespace-pre-wrap">
              {event.deskripsi || 'Tidak ada deskripsi.'}
            </p>
          </div>

          {/* Detail Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Waktu & Lokasi</h3>
              <InfoRow icon={<Calendar size={14} />} label="Mulai" value={formatDateDisplay(event.tanggalMulai)} />
              <InfoRow icon={<Calendar size={14} />} label="Selesai" value={formatDateDisplay(event.tanggalSelesai)} />
              <InfoRow icon={<Clock size={14} />} label="Jam" value={`${event.jamMulai} - ${event.jamSelesai}`} />
              <InfoRow icon={<Clock size={14} />} label="Batas Daftar" value={formatDateDisplay(event.batasRegistrasi)} />
              <InfoRow icon={<MapPin size={14} />} label="Lokasi" value={event.lokasi || '-'} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detail Event</h3>
              <InfoRow icon={<Tag size={14} />} label="Kategori" value={event.kategori || '-'} />
              <InfoRow icon={<Monitor size={14} />} label="Platform" value={event.platform || '-'} />
              <InfoRow icon={<UsersIcon size={14} />} label="Kuota" value={event.kuota ? `${event.kuota.toLocaleString('id-ID')} orang` : '-'} />
              <InfoRow icon={<Wallet size={14} />} label="Harga" value={event.harga} />
              <InfoRow icon={<Globe size={14} />} label="Link" value={event.linkEksternal || '-'} />
            </div>
          </div>

          {/* Pembicara */}
          {event.pembicara && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pembicara</h3>
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {event.pembicara.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{event.pembicara}</p>
                  <p className="text-xs text-slate-500">{event.peranPembicara || '-'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Kontak */}
          <div className="mb-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kontak Penyelenggara</h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
              <InfoRow icon={<Building2 size={14} />} label="Penyelenggara" value={event.penyelenggara || '-'} />
              <InfoRow icon={<Mail size={14} />} label="Email" value={event.kontakEmail || '-'} />
              <InfoRow icon={<Phone size={14} />} label="Telepon" value={event.kontakTelepon || '-'} />
            </div>
          </div>

          {/* Action Buttons */}
          {event.status === 'pending' && !showRejectForm && (
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleApproveAction}
                disabled={actionLoading !== null}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm text-sm flex items-center justify-center gap-2"
              >
                {actionLoading === 'approve' ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'âœ“ Setujui'}
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={actionLoading !== null}
                className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm text-sm flex items-center justify-center gap-2"
              >
                âœ— Tolak
              </button>
            </div>
          )}

          {event.status === 'pending' && showRejectForm && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Alasan penolakan..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRejectAction}
                  disabled={actionLoading !== null}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm text-sm flex items-center justify-center gap-2"
                >
                  {actionLoading === 'reject' ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : 'Konfirmasi Tolak'}
                </button>
                <button
                  onClick={() => { setShowRejectForm(false); setRejectReason(''); }}
                  disabled={actionLoading !== null}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </Portal>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center border border-slate-100 text-slate-900 shrink-0">
        {icon}
      </div>
      <span className="text-xs text-slate-400 font-semibold w-20 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-slate-700 truncate">{value}</span>
    </div>
  );
}

export default function PersetujuanEventClient({ initialEvents }: { initialEvents: PendingEvent[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<PendingEvent | null>(null);

  const refresh = async () => {
    const result = await getPendingEvents();
    if (result.success) setEvents(result.data);
  };

  const pendingCount = events.filter(e => e.status === 'pending').length;
  const approvedTodayCount = events.filter(e => e.status === 'published').length;
  const totalOrganizers = [...new Set(events.map(e => e.penyelenggara).filter(Boolean))].length || 0;

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <section>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Persetujuan Event</h1>
        <p className="text-gray-500 mt-2 font-medium">Tinjau dan kelola pendaftaran event baru dari penyenggara.</p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Menunggu Persetujuan"
          value={pendingCount}
          icon={FileCheck}
          color="blue"
        />
        <StatCard
          label="Event Disetujui"
          value={approvedTodayCount}
          icon={CheckCircle}
          color="yellow"
        />
        <StatCard
          label="Total Penyelenggara Aktif"
          value={totalOrganizers}
          icon={Users}
          color="purple"
        />
      </section>

      {/* Events Table Section */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-50 p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Daftar Registrasi Event Terbaru</h2>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4 text-slate-300"><ClipboardList size={48} /></div>
            <p className="text-gray-500 font-medium">Belum ada event yang perlu ditinjau.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-xs font-bold text-gray-500 uppercase tracking-wider py-4 px-4 text-left">Nama Event</th>
                  <th className="text-xs font-bold text-gray-500 uppercase tracking-wider py-4 px-4 text-left">Kategori</th>
                  <th className="text-xs font-bold text-gray-500 uppercase tracking-wider py-4 px-4 text-left">Platform</th>
                  <th className="text-xs font-bold text-gray-500 uppercase tracking-wider py-4 px-4 text-left">Harga</th>
                  <th className="text-xs font-bold text-gray-500 uppercase tracking-wider py-4 px-4 text-left">Tanggal Masuk</th>
                  <th className="text-xs font-bold text-gray-500 uppercase tracking-wider py-4 px-4 text-left">Status</th>
                  <th className="text-xs font-bold text-gray-500 uppercase tracking-wider py-4 px-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="flex items-center gap-3 text-left"
                      >
                        <EventCategoryIcon emoji={event.icon} className="w-5 h-5 text-slate-500 shrink-0" />
                        <span className="font-semibold text-gray-900 text-sm2 hover:text-slate-700 transition-colors">{event.judul}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{event.kategori || '-'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`text-xs font-bold ${getPlatformColor(event.platform)}`}>
                        {event.platform || '-'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-gray-900">{event.harga}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{event.tanggalMasuk}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`text-xs font-bold ${getStatusColor(event.status)}`}>
                        {statusLabel[event.status] || event.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {event.status === 'pending' && (
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                        >
                          Tinjau
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Review Modal */}
      <ReviewModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRefresh={refresh}
      />
    </div>
  );
}
