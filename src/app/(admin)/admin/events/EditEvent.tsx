"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import { updateEvent } from "@/actions/admin-event";
import { toast } from "react-hot-toast";
import type { Event } from "./ClientPage";
import { cn } from "@/lib/utils";

type EditEventProps = {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onSuccess: () => void;
};

export default function EditEvent({ isOpen, onClose, event, onSuccess }: EditEventProps) {
  const [formData, setFormData] = useState<Partial<Event> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        namaPembicara: event.namaPembicara || "",
        websiteSumber: event.websiteSumber || "",
        tipePlatform: event.tipePlatform || "offline",
        tipeHarga: event.tipeHarga || "free",
        isEventPolines: event.isEventPolines ?? false,
        penyelenggara: event.penyelenggara || "",
        emailKontak: event.emailKontak || "",
        teleponKontak: event.teleponKontak || "",
      });
    }
  }, [event]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => (prev ? { ...prev, [name]: finalValue } : null));
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [name]: value ? new Date(value) : null } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateEvent(event.id, formData as Record<string, unknown>);
      if (res.success) {
        toast.success("Event berhasil diperbarui");
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || "Gagal memperbarui event");
      }
    } catch (err) {
      console.error("[EditEvent] Submit error:", err);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelClasses = "block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1";
  const inputClasses =
    "w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-100 text-gray-700 transition-all focus:bg-white";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <h3 className="text-sm font-bold text-gray-800">Edit Event</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {/* Poster Preview & URL input */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-100 rounded-xl">
            <div className="w-16 h-20 bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
              {formData.bannerUrl ? (
                <img src={formData.bannerUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <label className={labelClasses}>URL Poster / Banner</label>
              <input
                type="text"
                name="bannerUrl"
                value={formData.bannerUrl || ""}
                onChange={handleChange}
                placeholder="https://link-gambar.com/poster.jpg"
                className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-100 text-gray-700"
              />
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className={labelClasses}>Judul Event</label>
              <input type="text" name="judul" value={formData.judul || ""} onChange={handleChange} className={inputClasses} required />
            </div>

            <div>
              <label className={labelClasses}>Kategori Event</label>
              <select name="jenisEvent" value={formData.jenisEvent || "seminar"} onChange={handleChange} className={inputClasses}>
                <option value="seminar">Seminar</option>
                <option value="conference">Conference</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Lingkup Event</label>
              <select
                name="isEventPolines"
                value={formData.isEventPolines ? "true" : "false"}
                onChange={(e) => setFormData((prev) => (prev ? { ...prev, isEventPolines: e.target.value === "true" } : null))}
                className={inputClasses}
              >
                <option value="true">Internal (Polines)</option>
                <option value="false">Eksternal (Umum)</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Tipe Platform</label>
              <select name="tipePlatform" value={formData.tipePlatform || "offline"} onChange={handleChange} className={inputClasses}>
                <option value="offline">Luring (Offline)</option>
                <option value="online">Daring (Online)</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Lokasi / Link Platform</label>
              <input
                type="text"
                name="detailLokasi"
                value={formData.detailLokasi || ""}
                onChange={handleChange}
                placeholder="Ruangan atau Link Zoom/GMeet"
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Batas Kuota Peserta</label>
              <input type="number" name="kuota" value={formData.kuota || 0} onChange={handleChange} className={inputClasses} />
            </div>

            <div>
              <label className={labelClasses}>Penyelenggara</label>
              <input type="text" name="penyelenggara" value={formData.penyelenggara || ""} onChange={handleChange} className={inputClasses} />
            </div>

            <div>
              <label className={labelClasses}>Pembicara / Pemateri</label>
              <input
                type="text"
                name="namaPembicara"
                value={formData.namaPembicara || ""}
                onChange={handleChange}
                placeholder="Pisahkan dengan koma jika lebih dari satu"
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Status Biaya</label>
              <select name="tipeHarga" value={formData.tipeHarga || "free"} onChange={handleChange} className={inputClasses}>
                <option value="free">Gratis</option>
                <option value="paid">Berbayar</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Nominal Biaya (IDR)</label>
              <input
                type="number"
                name="harga"
                value={formData.harga || 0}
                onChange={handleChange}
                disabled={formData.tipeHarga === "free"}
                className={cn(inputClasses, formData.tipeHarga === "free" && "opacity-50 cursor-not-allowed")}
              />
            </div>

            <div>
              <label className={labelClasses}>Tanggal Mulai</label>
              <input
                type="datetime-local"
                name="tanggalMulai"
                value={formData.tanggalMulai ? new Date(new Date(formData.tanggalMulai).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                onChange={(e) => handleDateChange("tanggalMulai", e.target.value)}
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className={labelClasses}>Tanggal Selesai</label>
              <input
                type="datetime-local"
                name="tanggalSelesai"
                value={formData.tanggalSelesai ? new Date(new Date(formData.tanggalSelesai).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                onChange={(e) => handleDateChange("tanggalSelesai", e.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}>Email Kontak</label>
              <input type="email" name="emailKontak" value={formData.emailKontak || ""} onChange={handleChange} className={inputClasses} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}>Telepon Kontak</label>
              <input type="text" name="teleponKontak" value={formData.teleponKontak || ""} onChange={handleChange} className={inputClasses} />
            </div>

            {!formData.isEventPolines && (
              <div className="md:col-span-2 animate-in slide-in-from-top-2 duration-300">
                <label className={labelClasses}>Link / Website Sumber</label>
                <input
                  type="text"
                  name="websiteSumber"
                  value={formData.websiteSumber || ""}
                  onChange={handleChange}
                  placeholder="https://event-link.com/detail"
                  className={inputClasses}
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className={labelClasses}>Deskripsi Event</label>
              <textarea name="deskripsi" value={formData.deskripsi || ""} onChange={handleChange} rows={3} className={cn(inputClasses, "resize-none py-2")} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClasses}>Syarat & Ketentuan</label>
              <textarea
                name="syaratDanKetentuan"
                value={formData.syaratDanKetentuan || ""}
                onChange={handleChange}
                rows={3}
                className={cn(inputClasses, "resize-none py-2")}
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-white border border-gray-200 text-gray-500 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-all text-center"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
