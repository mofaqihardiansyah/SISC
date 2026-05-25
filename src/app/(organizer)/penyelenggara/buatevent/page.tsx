"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/actions/create-event";

// ─── Popup Konfirmasi ─────────────────────────────────────────────
function ConfirmDraftModal({
  onYes,
  onNo,
  isPending,
}: {
  onYes: () => void;
  onNo: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Simpan Perubahan ke Draft?</h3>
            <p className="text-sm text-gray-500 mt-0.5">Data event yang sudah kamu isi belum disimpan.</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-5 pl-[52px]">
          Apakah kamu ingin menyimpan data ini ke dalam draft sebelum membuat event baru?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onNo}
            disabled={isPending}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Tidak, Buang
          </button>
          <button
            onClick={onYes}
            disabled={isPending}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {isPending ? "Menyimpan..." : "Ya, Simpan Draft"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuatEventPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // --- Form State ---
  const [eventTitle, setEventTitle] = useState("");
  const [location, setLocation] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [quota, setQuota] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [description, setDescription] = useState("");
  const [terms, setTerms] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [eventType, setEventType] = useState<"seminar" | "conference">("seminar");
  const [eventKind, setEventKind] = useState<"polines" | "umum">("polines");
  const [kategoriId, setKategoriId] = useState("");
  const [platform, setPlatform] = useState<"online" | "offline" | "hybrid">("offline");
  const [tipeHarga, setTipeHarga] = useState<"free" | "paid">("paid");
  const [fee, setFee] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- Draft Popup State ---
  const [showDraftModal, setShowDraftModal] = useState(false);

  // ─── Cek apakah form "kotor" (ada data yang diisi) ───────────────
  const isDirty = useCallback(() => {
    return (
      eventTitle.trim() !== "" ||
      location.trim() !== "" ||
      speaker.trim() !== "" ||
      quota !== "" ||
      startDate !== "" ||
      endDate !== "" ||
      registrationLink.trim() !== "" ||
      description.trim() !== "" ||
      terms.trim() !== "" ||
      bannerFile !== null ||
      fee !== ""
    );
  }, [eventTitle, location, speaker, quota, startDate, endDate, registrationLink, description, terms, bannerFile, fee]);

  // ─── Reset semua state form ke kosong ────────────────────────────
  const resetForm = useCallback(() => {
    setEventTitle("");
    setLocation("");
    setSpeaker("");
    setQuota("");
    setStartDate("");
    setEndDate("");
    setRegistrationLink("");
    setDescription("");
    setTerms("");
    setBannerFile(null);
    setBannerPreview(null);
    setEventType("seminar");
    setEventKind("polines");
    setKategoriId("");
    setPlatform("offline");
    setTipeHarga("paid");
    setFee("");
    setError(null);
    setSuccessMsg(null);
    setDragOver(false);
  }, []);

  // ─── Expose isDirty & showModal ke window agar bisa dipanggil dari header ───
  useEffect(() => {
    (window as any).__buatEventIsDirty = isDirty;
    (window as any).__buatEventShowModal = () => setShowDraftModal(true);
    return () => {
      delete (window as any).__buatEventIsDirty;
      delete (window as any).__buatEventShowModal;
    };
  }, [isDirty]);

  // --- Handler ---
  const handleBannerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const buildFormData = (isDraft: boolean) => {
    const formData = new FormData();
    formData.append("judul", eventTitle);
    formData.append("jenisEvent", eventType);
    formData.append("isEventPolines", eventKind === "polines" ? "true" : "false");
    formData.append("tipePlatform", platform);
    formData.append("tipeHarga", tipeHarga);
    formData.append("harga", tipeHarga === "free" ? "0" : fee.replace(/\D/g, ""));
    formData.append("detailLokasi", location);
    formData.append("namaPembicara", speaker);
    formData.append("deskripsi", description);
    formData.append("syaratDanKetentuan", terms);
    formData.append("tanggalMulai", startDate);
    formData.append("tanggalSelesai", endDate);
    formData.append("kuota", quota);
    formData.append("linkEksternal", registrationLink);
    formData.append("kategoriId", kategoriId);
    formData.append("isDraft", isDraft ? "true" : "false");
    if (bannerFile) formData.append("banner", bannerFile);
    return formData;
  };

  const handleSubmit = async (isDraft: boolean) => {
    setError(null);
    setSuccessMsg(null);

    if (!eventTitle.trim()) return setError("Judul event wajib diisi.");
    if (!startDate) return setError("Tanggal mulai wajib diisi.");

    startTransition(async () => {
      const result = await createEvent(buildFormData(isDraft));
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccessMsg(
          isDraft
            ? "Event berhasil disimpan sebagai draft!"
            : "Event berhasil diajukan ke admin untuk direview!"
        );
        setTimeout(() => router.push("/penyelenggara/event"), 1500);
      }
    });
  };

  // ─── Handler popup: Ya (simpan draft lalu reset & redirect) ──────
  const handleModalYes = () => {
    if (!eventTitle.trim()) {
      // Kalau judul kosong, tidak bisa simpan draft — langsung buang saja
      setShowDraftModal(false);
      resetForm();
      return;
    }
    startTransition(async () => {
      const result = await createEvent(buildFormData(true));
      setShowDraftModal(false);
      resetForm();
      if (result?.error) {
        // Gagal simpan draft, tapi tetap lanjut buat event baru
        console.warn("Gagal simpan draft:", result.error);
      }
      // Redirect ke halaman buat event baru (reset URL param)
      router.push("/penyelenggara/buatevent?reset=" + Date.now());
    });
  };

  // ─── Handler popup: Tidak (buang data, reset & redirect) ─────────
  const handleModalNo = () => {
    setShowDraftModal(false);
    resetForm();
    router.push("/penyelenggara/buatevent?reset=" + Date.now());
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Popup Draft Modal */}
      {showDraftModal && (
        <ConfirmDraftModal
          onYes={handleModalYes}
          onNo={handleModalNo}
          isPending={isPending}
        />
      )}

      <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col gap-6">

        {/* Alert Error / Success */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
            {successMsg}
          </div>
        )}

        {/* ── Section 1: Tipe Event ── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <InfoIcon />
            <h2 className="text-lg font-semibold text-gray-800">Tipe Event</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Pilih Tipe Event (Seminar/Conference)"
              value={eventType}
              onChange={(v) => setEventType(v as "seminar" | "conference")}
              options={[
                { value: "seminar", label: "Seminar" },
                { value: "conference", label: "Conference" },
              ]}
            />
            <SelectField
              label="Pilih Jenis Event (Polines/Umum)"
              value={eventKind}
              onChange={(v) => setEventKind(v as "polines" | "umum")}
              options={[
                { value: "polines", label: "Polines" },
                { value: "umum", label: "Umum" },
              ]}
            />
          </div>
        </div>

        {/* ── Section 2: Detail Umum ── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <InfoIcon />
            <h2 className="text-lg font-semibold text-gray-800">Detail Umum</h2>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1.5">Judul Event</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Masukkan judul event yang menarik..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <SelectField
              label="Kategori Event"
              value={kategoriId}
              onChange={setKategoriId}
              options={[
                { value: "", label: "Pilih Kategori" },
                { value: "1", label: "Teknologi" },
                { value: "2", label: "Bisnis" },
                { value: "3", label: "Pendidikan" },
                { value: "4", label: "Kesehatan" },
                { value: "5", label: "Seni & Budaya" },
              ]}
            />
            <SelectField
              label="Tipe Platform"
              value={platform}
              onChange={(v) => setPlatform(v as "online" | "offline" | "hybrid")}
              options={[
                { value: "offline", label: "Luring" },
                { value: "online", label: "Daring" },
                { value: "hybrid", label: "Hybrid" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Lokasi</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Jakarta, Bandung, Online Only"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Pembicara (Opsional)</label>
              <input
                type="text"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                placeholder="Contoh: Pak Nakala"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Harga</label>
              <SelectField
                label=""
                value={tipeHarga}
                onChange={(v) => setTipeHarga(v as "free" | "paid")}
                options={[
                  { value: "paid", label: "Berbayar" },
                  { value: "free", label: "Gratis" },
                ]}
              />
            </div>
            {tipeHarga === "paid" && (
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Biaya</label>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="Contoh: 25000"
                  min={0}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Section 3: Deskripsi & Poster ── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <ImageIcon />
            <h2 className="text-lg font-semibold text-gray-800">Deskripsi & Poster</h2>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1.5">Deskripsi Event</label>
            <RichTextarea
              value={description}
              onChange={setDescription}
              placeholder="Ceritakan detail event Anda..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Banner Event</label>
            <label
              className={`block border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
                dragOver
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleBannerDrop}
            >
              <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
              {bannerPreview ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">Klik untuk ganti</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 p-10">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <UploadIcon />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Drag & Drop Banner Event</p>
                  <p className="text-xs text-gray-400">Recommended size: 1200 × 630px (Max 5MB)</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* ── Section 4: Syarat dan Ketentuan ── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <ImageIcon />
            <h2 className="text-lg font-semibold text-gray-800">Syarat dan Ketentuan</h2>
          </div>
          <label className="block text-sm text-gray-600 mb-1.5">
            Masukkan Detail Syarat &amp; Ketentuan Event
          </label>
          <RichTextarea
            value={terms}
            onChange={setTerms}
            placeholder="Masukkan Syarat & Ketentuan"
          />
        </div>

        {/* ── Section 5: Jadwal & Kuota ── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <CalendarIcon />
            <h2 className="text-lg font-semibold text-gray-800">Jadwal &amp; Kuota</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Tanggal &amp; Waktu Mulai</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Tanggal &amp; Waktu Selesai</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Kuota Peserta</label>
            <input
              type="number"
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              min={0}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* ── Section 6: Link Form Pendaftaran ── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <MonitorIcon />
            <h2 className="text-lg font-semibold text-gray-800">Link Form Pendaftaran</h2>
          </div>
          <textarea
            value={registrationLink}
            onChange={(e) => setRegistrationLink(e.target.value)}
            placeholder="Masukkan Link Form Pendaftaran untuk Peserta Event"
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
          />
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isPending}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isPending ? "Menyimpan..." : "Simpan Draft"}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isPending}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {isPending ? "Mengajukan..." : "Ajukan Publikasi ke Admin"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components (tidak berubah) ──────────────────────────────────────────

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      {label && <label className="block text-sm text-gray-600 mb-1.5">{label}</label>}
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function RichTextarea({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-200 bg-white">
        {[
          { title: "Bold", label: <span className="font-bold">B</span> },
          { title: "Italic", label: <span className="italic">I</span> },
          { title: "Italic Underline", label: <span className="italic underline">I</span> },
          { title: "List", label: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>) },
          { title: "Numbered", label: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>) },
          { title: "Link", label: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>) },
        ].map((btn) => (
          <button key={btn.title} type="button" title={btn.title}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600 text-sm">
            {btn.label}
          </button>
        ))}
      </div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={5}
        className="w-full px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none resize-none placeholder-gray-400" />
    </div>
  );
}

function InfoIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
}
function ImageIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>;
}
function CalendarIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function MonitorIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
}
function UploadIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>;
}