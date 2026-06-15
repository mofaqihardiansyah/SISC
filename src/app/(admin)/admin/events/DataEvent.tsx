"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  Building2, 
  Save, 
  Pencil, 
  Eye,
  MapPin,
  Users,
  Clock,
  Globe,
  Ticket,
  Mic,
  Layout,
  Tag,
  AlignLeft,
  ShieldCheck,
  Image as ImageIcon,
  Type
} from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { toast } from 'sonner';
import { updateEvent } from '@/actions/admin-event';
import { cn } from "@/lib/utils";
import Portal from "@/components/ui/Portal";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Event } from './ClientPage';

type DataEventProps = {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onUpdateStatus: (id: number, status: 'published' | 'rejected', reason?: string) => Promise<void>;
  onEditSuccess: () => void;
  initialMode?: 'view' | 'edit';
};

export default function DataEvent({ isOpen, onClose, event, onUpdateStatus, onEditSuccess, initialMode = 'view' }: DataEventProps) {
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState<'approve' | 'reject' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Event>>({});

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        namaPembicara: event.namaPembicara || '',
        websiteSumber: event.websiteSumber || '',
        tipePlatform: event.tipePlatform || 'offline',
        tipeHarga: event.tipeHarga || 'free',
        eventPolines: event.eventPolines ?? false,
      });
    }
  }, [event]);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleApproveAction = async () => {
    setActionLoading('approve');
    try {
      await onUpdateStatus(event.id, 'published');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectAction = async () => {
    if (!rejectReason.trim()) {
      alert('Alasan penolakan tidak boleh kosong.');
      return;
    }
    setActionLoading('reject');
    try {
      await onUpdateStatus(event.id, 'rejected', rejectReason);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: new Date(value) }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await updateEvent(event.id, formData as Record<string, unknown>);
      if (res.success) {
        toast.success('Event berhasil diperbarui');
        onEditSuccess();
        setMode('view');
      } else {
        toast.error(res.error || 'Gagal memperbarui event');
      }
    } catch (err) {
      console.error("[DataEvent] Submit error:", err);
      toast.error('Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original event
    setFormData({
      ...event,
      namaPembicara: event.namaPembicara || '',
      websiteSumber: event.websiteSumber || '',
      tipePlatform: event.tipePlatform || 'offline',
      tipeHarga: event.tipeHarga || 'free',
      eventPolines: event.eventPolines ?? false,
    });
    setMode('view');
  };

  const inputClasses = "w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-100 text-slate-700 font-medium";
  const selectClasses = cn(inputClasses, "appearance-none cursor-pointer");

  const renderViewMode = () => {
    const rows = [
      { label: 'Penyelenggara', value: event.penyelenggara || '-', icon: Building2 },
      { label: 'Jenis Event', value: event.jenisEvent === 'conference' ? 'Konferensi' : event.jenisEvent === 'seminar' ? 'Seminar' : '-', icon: Layout },
      { label: 'Target Peserta', value: event.eventPolines ? 'Polines (Internal)' : 'Umum (Eksternal)', icon: Tag },
      { label: 'Tanggal Mulai', value: format(new Date(event.tanggalMulai), 'dd MMMM yyyy HH:mm', { locale: idLocale }) + ' WIB', icon: Clock },
      { label: 'Tanggal Selesai', value: event.tanggalSelesai ? format(new Date(event.tanggalSelesai), 'dd MMMM yyyy HH:mm', { locale: idLocale }) + ' WIB' : '-', icon: Clock },
      { label: 'Platform', value: event.tipePlatform === 'offline' ? 'Luring (Offline)' : event.tipePlatform === 'online' ? 'Daring (Online)' : event.tipePlatform === 'hybrid' ? 'Hybrid' : '-', icon: Globe },
      { label: 'Lokasi / Platform', value: event.detailLokasi || '-', icon: MapPin },
      { label: 'Pembicara', value: event.namaPembicara || '-', icon: Mic },
      { label: 'Kuota Peserta', value: `${event.kuota || 0} Orang`, icon: Users },
      { label: 'Jumlah Pendaftar', value: `${event.participantCount || 0} Orang`, icon: Users },
      { label: 'Harga Tiket', value: event.tipeHarga === 'free' ? 'Gratis' : `Rp ${(event.harga || 0).toLocaleString('id-ID')}`, icon: Ticket },
    ];

    if (!event.eventPolines && event.websiteSumber) {
      rows.push({ label: 'Website Sumber', value: event.websiteSumber, icon: Globe });
    }

    return (
      <div className="space-y-5">
        {/* Avatar/Banner + Name + Status */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50 relative">
            {event.urlBanner ? (
              <Image src={event.urlBanner} alt={event.judul} fill className="object-cover" sizes="64px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                <Building2 size={24} />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-slate-800 text-sm leading-snug truncate" title={event.judul}>
              {event.judul}
            </div>
            <div className="text-xs text-slate-400 mb-1.5 truncate">oleh {event.penyelenggara || '-'}</div>
            <span className={`
              ${event.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''}
              ${event.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : ''}
              ${event.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' : ''}
              text-nano font-bold uppercase tracking-wider px-2 py-0.5 rounded border inline-block
            `}>
              {event.status === 'published' ? 'Disetujui' : event.status === 'pending' ? 'Menunggu' : 'Ditolak'}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100"></div>

        {/* Key-Value Details */}
        <div className="space-y-3">
          {rows.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex justify-between items-start gap-4">
              <span className="text-micro text-slate-400 font-medium shrink-0 w-40 flex items-center gap-1.5">
                <Icon size={12} className="text-slate-300" />
                {label}
              </span>
              <span className="text-micro text-slate-700 text-right font-semibold">{value || "-"}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100"></div>

        {/* Descriptions */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <h4 className="text-xxs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlignLeft size={12} /> Deskripsi Event
            </h4>
            <div className="text-micro text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
              {event.deskripsi || 'Tidak ada deskripsi.'}
            </div>
          </div>

          {event.syaratDanKetentuan && (
            <div className="space-y-1.5">
              <h4 className="text-xxs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={12} /> Syarat & Ketentuan
              </h4>
              <div className="text-micro text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
                {event.syaratDanKetentuan}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ---- EDIT MODE ----
  const renderEditMode = () => {
    const labelClasses = "text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5";

    return (
      <div className="space-y-5">
        {/* Banner Section */}
        <div className="space-y-2">
          <label className={labelClasses}><ImageIcon size={12} /> Poster / Banner Event</label>
          <div className="relative h-40 w-full rounded-xl bg-slate-100 overflow-hidden group border border-slate-200 shadow-sm">
            {formData.urlBanner ? (
              <Image src={formData.urlBanner} alt="Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="100vw" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1">
                <ImageIcon size={28} strokeWidth={1} />
                <p className="text-xxs font-bold uppercase tracking-wider">No Poster</p>
              </div>
            )}
            <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-xs duration-300">
              <div className="w-4/5 space-y-2 text-center">
                <label className="text-xxs text-white font-bold uppercase tracking-wider block">Update URL Poster</label>
                <Input
                  type="text"
                  name="urlBanner"
                  value={formData.urlBanner || ''}
                  onChange={handleChange}
                  placeholder="https://link-gambar.com/poster.jpg"
                  className="w-full px-3 py-1.5 bg-white rounded-xl text-xs outline-none border border-slate-200 focus:ring-2 focus:ring-slate-100 text-slate-700 font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Klasifikasi */}
        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
          <div className="w-1 h-3.5 bg-slate-900 rounded-full"></div>
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xxs">Klasifikasi Event</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}><Layout size={12} /> Tipe Event</label>
            <select name="jenisEvent" value={formData.jenisEvent || ''} onChange={handleChange} className={selectClasses}>
              <option value="seminar">Seminar</option>
              <option value="conference">Conference</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}><Tag size={12} /> Jenis Event</label>
            <select
              name="eventPolines"
              value={formData.eventPolines ? "true" : "false"}
              onChange={(e) => setFormData(prev => ({ ...prev, eventPolines: e.target.value === "true" }))}
              className={selectClasses}
            >
              <option value="true">Polines (Internal)</option>
              <option value="false">Umum (Eksternal)</option>
            </select>
          </div>
        </div>

        {/* Section: Detail Umum */}
        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
          <div className="w-1 h-3.5 bg-slate-900 rounded-full"></div>
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xxs">Detail Umum</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClasses}><Type size={12} /> Judul Event</label>
            <Input type="text" name="judul" value={formData.judul || ''} onChange={handleChange} className={inputClasses} required />
          </div>
          <div>
            <label className={labelClasses}><Globe size={12} /> Tipe Platform</label>
            <select name="tipePlatform" value={formData.tipePlatform || 'offline'} onChange={handleChange} className={selectClasses}>
              <option value="offline">Luring (Offline)</option>
              <option value="online">Daring (Online)</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}><MapPin size={12} /> Lokasi / Link Platform</label>
            <Input type="text" name="detailLokasi" value={formData.detailLokasi || ''} onChange={handleChange} className={inputClasses} placeholder="Alamat atau Link Zoom/GMeet" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClasses}><Mic size={12} /> Pembicara / Pemateri</label>
            <Input type="text" name="namaPembicara" value={formData.namaPembicara || ''} onChange={handleChange} className={inputClasses} placeholder="Nama pembicara (pisahkan dengan koma)" />
          </div>
          <div>
            <label className={labelClasses}><Ticket size={12} /> Status Biaya</label>
            <select name="tipeHarga" value={formData.tipeHarga || 'free'} onChange={handleChange} className={selectClasses}>
              <option value="free">Gratis</option>
              <option value="paid">Berbayar</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}><Ticket size={12} /> Nominal Biaya (IDR)</label>
            <Input type="number" name="harga" value={formData.harga || 0} onChange={handleChange} className={inputClasses} disabled={formData.tipeHarga === 'free'} />
          </div>
        </div>

        {/* Section: Jadwal & Kuota */}
        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
          <div className="w-1 h-3.5 bg-slate-900 rounded-full"></div>
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xxs">Jadwal & Kuota</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}><Clock size={12} /> Tanggal & Waktu Mulai</label>
            <Input type="datetime-local" name="tanggalMulai" value={formData.tanggalMulai ? new Date(formData.tanggalMulai).toISOString().slice(0, 16) : ''} onChange={(e) => handleDateChange('tanggalMulai', e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}><Clock size={12} /> Tanggal & Waktu Selesai</label>
            <Input type="datetime-local" name="tanggalSelesai" value={formData.tanggalSelesai ? new Date(formData.tanggalSelesai).toISOString().slice(0, 16) : ''} onChange={(e) => handleDateChange('tanggalSelesai', e.target.value)} className={inputClasses} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClasses}><Users size={12} /> Batas Kuota Peserta</label>
            <Input type="number" name="kuota" value={formData.kuota || 0} onChange={handleChange} className={inputClasses} />
          </div>
        </div>

        {/* Section: Registrasi & Konten */}
        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/60">
          <div className="w-1 h-3.5 bg-slate-900 rounded-full"></div>
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xxs">Registrasi & Konten</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {!formData.eventPolines && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className={cn("text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5")}><Globe size={12} /> Link Sumber / Web Sumber</label>
              <Input
                type="text"
                name="websiteSumber"
                value={formData.websiteSumber || ''}
                onChange={handleChange}
                className={cn(inputClasses, "border-blue-100 bg-blue-50/30")}
                placeholder="Contoh: https://eventbanget.com/detail-event"
              />
            </div>
          )}
          <div>
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><AlignLeft size={12} /> Deskripsi Lengkap Event</label>
            <textarea name="deskripsi" value={formData.deskripsi || ''} onChange={handleChange} rows={3} className={cn(inputClasses, "resize-none")} />
          </div>
          <div>
            <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><ShieldCheck size={12} /> Syarat & Ketentuan</label>
            <textarea name="syaratDanKetentuan" value={formData.syaratDanKetentuan || ''} onChange={handleChange} rows={3} className={cn(inputClasses, "resize-none")} />
          </div>
        </div>
      </div>
    );
  };

      return (
      <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={onClose}
        ></div>

        {/* Modal Content */}
        <div className={cn(
          "relative w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300",
          mode === 'edit' ? 'max-w-3xl' : 'max-w-xl'
        )}>

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold text-slate-800">
                {mode === 'view' ? 'Detail Event' : 'Edit Event'}
              </h3>
              {/* Mode badge */}
              <span className={cn(
                "text-nano font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                mode === 'view' 
                  ? "bg-slate-50 text-slate-500 border-slate-200" 
                  : "bg-blue-50 text-blue-600 border-blue-200"
              )}>
                {mode === 'view' ? 'Lihat' : 'Editing'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Toggle View/Edit */}
              <Button
                variant="outline"
                size="xs"
                onClick={() => mode === 'view' ? setMode('edit') : handleCancelEdit()}
              >
                {mode === 'view' ? (
                  <><Pencil size={12} /> Edit</>
                ) : (
                  <><Eye size={12} /> Lihat</>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Tutup">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {mode === 'view' ? renderViewMode() : renderEditMode()}
          </div>

          {/* Footer */}
          {mode === 'edit' ? (
            /* Edit Mode Footer */
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3 justify-end shrink-0">
              <Button variant="outline" onClick={handleCancelEdit} size="sm">
                Batal
              </Button>
              <Button
                variant="default"
                onClick={handleSubmit}
                disabled={isSubmitting}
                size="sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          ) : (
            /* View Mode Footer - Moderation for pending events */
            event.status === 'pending' && (
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                <span className="text-micro font-semibold text-slate-400">Moderasi Event ini:</span>
                {!showRejectForm ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleApproveAction}
                      disabled={actionLoading !== null}
                    >
                      {actionLoading === 'approve' ? (
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : 'âœ“ Setujui Event'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowRejectForm(true)}
                      disabled={actionLoading !== null}
                    >
                      âœ— Tolak Event
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1 ml-4 flex items-center gap-2">
                    <Input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Masukkan alasan penolakan..."
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-slate-100 text-slate-700 font-medium"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleRejectAction}
                      disabled={actionLoading !== null}
                    >
                      Konfirmasi Tolak
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectReason('');
                      }}
                    >
                      Batal
                    </Button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </Portal>
  );
}