"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Landmark, Wallet } from "lucide-react";
import { ConfirmationModal } from '@/components/feedback/ConfirmationModal';
import { createEvent, type MetodePembayaranInput } from "@/actions/create-event";
import { BANK_LIST, E_WALLET_LIST, UPLOAD_LIMITS } from "@/lib/constants";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

declare global {
  interface Window {
    __buatEventIsDirty?: () => boolean;
    __buatEventShowModal?: () => void;
  }
}

const BANK_OPTIONS = [...BANK_LIST, "Bank Jateng", "Lainnya"];
const EWALLET_OPTIONS = [...E_WALLET_LIST, "Jenius", "Sakuku", "Lainnya"];

type MetodePembayaranLocal = MetodePembayaranInput & {
  namaPenyediaCustom?: string;
};

interface KategoriOption {
  id: number;
  nama: string | null;
}

interface KotaOption {
  id: number;
  nama: string | null;
  provinsiId: number | null;
}

interface ProvinsiOption {
  id: number;
  nama: string | null;
}

interface BuatEventClientProps {
  categories: KategoriOption[];
  cities: KotaOption[];
  provinces: ProvinsiOption[];
}

function MetodePembayaranItem({
  item, index, onChange, onRemove,
}: {
  item: MetodePembayaranLocal;
  index: number;
  onChange: (index: number, updated: MetodePembayaranLocal) => void;
  onRemove: (index: number) => void;
}) {
  const isLainnya = item.namaPenyedia === "Lainnya";

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">Metode #{index + 1}</span>
        <Button type="button" onClick={() => onRemove(index)}
          variant="ghost" size="icon" aria-label="Hapus metode pembayaran">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
          </svg>
        </Button>
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">Jenis Pembayaran</label>
        <div className="flex gap-2 flex-wrap">
          {(["bank_transfer", "e_wallet"] as const).map((j) => (
            <Button key={j} type="button"
              onClick={() => onChange(index, {
                ...item,
                jenis: j,
                namaPenyedia: "",
                namaPenyediaCustom: "",
                nomorAkun: "",
                atasNama: "",
              })}
              variant={item.jenis === j ? "default" : "outline"}
              size="sm">
              {j === "bank_transfer" ? (
                <><Landmark size={13} /> Bank Transfer</>
              ) : (
                <><Wallet size={13} /> E-Wallet</>
              )}
            </Button>
          ))}
        </div>
      </div>

      {item.jenis === "bank_transfer" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Nama Bank</label>
            <div className="relative">
              <Select
                value={item.namaPenyedia}
                onChange={(e) => onChange(index, {
                  ...item,
                  namaPenyedia: e.target.value,
                  namaPenyediaCustom: "",
                })}
                className="w-full h-[38px] appearance-none border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20">
                <option value="">Pilih Bank</option>
                {BANK_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
              </Select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            {isLainnya && (
              <Input
                type="text"
                value={item.namaPenyediaCustom ?? ""}
                onChange={(e) => onChange(index, { ...item, namaPenyediaCustom: e.target.value })}
                placeholder="Nama bank..."
                className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 placeholder-slate-400 transition-all"
              />
            )}
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Nomor Rekening</label>
            <Input type="text" value={item.nomorAkun ?? ""}
              onChange={(e) => onChange(index, { ...item, nomorAkun: e.target.value })}
              placeholder="Contoh: 1234567890"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 placeholder-slate-400 transition-all" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Atas Nama</label>
            <Input type="text" value={item.atasNama ?? ""}
              onChange={(e) => onChange(index, { ...item, atasNama: e.target.value })}
              placeholder="Contoh: Budi Santoso"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 placeholder-slate-400 transition-all" />
          </div>
        </div>
      )}

      {item.jenis === "e_wallet" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">E-Wallet</label>
            <div className="relative">
              <Select
                value={item.namaPenyedia}
                onChange={(e) => onChange(index, {
                  ...item,
                  namaPenyedia: e.target.value,
                  namaPenyediaCustom: "",
                })}
                className="w-full h-[38px] appearance-none border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20">
                <option value="">Pilih E-Wallet</option>
                {EWALLET_OPTIONS.map((ew) => <option key={ew} value={ew}>{ew}</option>)}
              </Select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            {isLainnya && (
              <Input
                type="text"
                value={item.namaPenyediaCustom ?? ""}
                onChange={(e) => onChange(index, { ...item, namaPenyediaCustom: e.target.value })}
                placeholder="Nama e-wallet..."
                className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 placeholder-slate-400 transition-all"
              />
            )}
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Nomor / Akun</label>
            <Input type="text" value={item.nomorAkun ?? ""}
              onChange={(e) => onChange(index, { ...item, nomorAkun: e.target.value })}
              placeholder="Contoh: 08123456789"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 placeholder-slate-400 transition-all" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Atas Nama</label>
            <Input type="text" value={item.atasNama ?? ""}
              onChange={(e) => onChange(index, { ...item, atasNama: e.target.value })}
              placeholder="Contoh: Budi Santoso"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 placeholder-slate-400 transition-all" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuatEventClient({ categories, cities, provinces }: BuatEventClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [eventTitle, setEventTitle] = useState("");
  const [location, setLocation] = useState("");
  const [kotaId, setKotaId] = useState("");
  const [provinsiId, setProvinsiId] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [quota, setQuota] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
  const [batasRegistrasi, setBatasRegistrasi] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [metodePembayaranList, setMetodePembayaranList] = useState<MetodePembayaranLocal[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCities = provinsiId
    ? cities.filter((c) => c.provinsiId === Number(provinsiId))
    : [];

  const isDirty = useCallback(() => {
    return (
      eventTitle.trim() !== "" || location.trim() !== "" || kotaId !== "" || provinsiId !== "" || speaker.trim() !== "" ||
      quota !== "" || startDate !== "" || endDate !== "" ||
      description.trim() !== "" || terms.trim() !== "" ||
      bannerFile !== null || fee !== "" || metodePembayaranList.length > 0 ||
      batasRegistrasi !== "" 
    );
  }, [eventTitle, location, kotaId, provinsiId, speaker, quota, startDate, endDate, description, terms, bannerFile, fee, metodePembayaranList, batasRegistrasi]);

  const resetForm = useCallback(() => {
    setEventTitle(""); setLocation(""); setKotaId(""); setProvinsiId(""); setSpeaker(""); setQuota("");
    setStartDate(""); setEndDate(""); setDescription(""); setTerms("");
    setBannerFile(null); setBannerPreview(null);
    setEventType("seminar"); setEventKind("polines"); setKategoriId("");
    setPlatform("offline"); setTipeHarga("paid"); setFee("");
    setBatasRegistrasi(""); 
    setMetodePembayaranList([]);
    setError(null); setSuccessMsg(null); setDragOver(false);
  }, []);

  useEffect(() => {
    window.__buatEventIsDirty = isDirty;
    window.__buatEventShowModal = () => setShowDraftModal(true);
    return () => {
      delete window.__buatEventIsDirty;
      delete window.__buatEventShowModal;
    };
  }, [isDirty]);

  const addMetodePembayaran = () => {
    setMetodePembayaranList((prev) => [
      ...prev,
      { jenis: "bank_transfer", namaPenyedia: "", namaPenyediaCustom: "", nomorAkun: "", atasNama: "" },
    ]);
  };

  const updateMetodePembayaran = (index: number, updated: MetodePembayaranLocal) => {
    setMetodePembayaranList((prev) => prev.map((item, i) => (i === index ? updated : item)));
  };

  const removeMetodePembayaran = (index: number) => {
    setMetodePembayaranList((prev) => prev.filter((_, i) => i !== index));
  };

  const resolveNamaPenyedia = (item: MetodePembayaranLocal): string => {
    if (item.namaPenyedia === "Lainnya") {
      return item.namaPenyediaCustom?.trim() ?? "";
    }
    return item.namaPenyedia;
  };

  const buildFormData = (isDraftFlag: boolean) => {
    const formData = new FormData();
    formData.append("judul", eventTitle);
    formData.append("jenisEvent", eventType);
    formData.append("eventPolines", eventKind === "polines" ? "true" : "false");
    formData.append("tipePlatform", platform);
    formData.append("tipeHarga", tipeHarga);
    formData.append("harga", tipeHarga === "free" ? "0" : fee);
    formData.append("detailLokasi", platform === "online" ? "Online Only" : location);
    formData.append("kotaId", platform === "online" ? "" : kotaId);
    formData.append("namaPembicara", speaker);
    formData.append("deskripsi", description);
    formData.append("syaratDanKetentuan", terms);
    formData.append("tanggalMulai", startDate);
    formData.append("tanggalSelesai", endDate);
    formData.append("kuota", quota);
    formData.append("batasRegistrasi", batasRegistrasi);
    formData.append("linkEksternal", "");
    formData.append("kategoriId", kategoriId);
    formData.append("isDraft", isDraftFlag ? "true" : "false");
    if (bannerFile) formData.append("banner", bannerFile);

    const cleanedMetode: MetodePembayaranInput[] = metodePembayaranList.map((item) => ({
      jenis: item.jenis,
      namaPenyedia: resolveNamaPenyedia(item),
      nomorAkun: item.nomorAkun,
      atasNama: item.atasNama,
    }));
    formData.append("metodePembayaran", JSON.stringify(cleanedMetode));
    return formData;
  };

  const handleSubmit = async (isDraftFlag: boolean) => {
    if (isPending || isSubmitting) return;
    setError(null);
    setSuccessMsg(null);

    // Validasi dasar (Wajib diisi baik Draft maupun Publikasi)
    if (!eventTitle.trim()) return setError("Judul event wajib diisi.");

    // Validasi Khusus Publikasi (Draft dibebaskan dari ini)
    if (!isDraftFlag) {
      if (!startDate) return setError("Tanggal mulai wajib diisi.");
      if (!kategoriId) return setError("Kategori event wajib dipilih.");
      
      if (platform !== "online") {
        if (!provinsiId) return setError("Provinsi penyelenggaraan wajib dipilih.");
        if (!kotaId) return setError("Kota penyelenggaraan wajib dipilih.");
        if (!location.trim()) return setError("Detail lokasi wajib diisi.");
      }

      if (tipeHarga === "paid") {
        const parsedFee = parseInt(fee, 10);
        if (!fee || isNaN(parsedFee) || parsedFee <= 0) {
          return setError("Biaya event berbayar harus lebih besar dari Rp 0.");
        }
      }
    }

    // Validasi Tanggal Selesai (Jika diisi)
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        return setError("Tanggal & waktu selesai tidak boleh mendahului tanggal & waktu mulai.");
      }
    }

    if (bannerFile && bannerFile.size > UPLOAD_LIMITS.BANNER_MAX_SIZE)
      return setError("Ukuran banner terlalu besar. Maksimal 5MB.");

    // Validasi Metode Pembayaran khusus Publikasi Berbayar
    if (!isDraftFlag && tipeHarga === "paid") {
      if (metodePembayaranList.length === 0) {
        return setError("Metode pembayaran wajib ditambahkan minimal satu.");
      }
      for (let i = 0; i < metodePembayaranList.length; i++) {
        const mp = metodePembayaranList[i];
        const namaFinal = resolveNamaPenyedia(mp);
        if (!namaFinal)
          return setError(`Metode pembayaran #${i + 1}: nama bank/e-wallet wajib dipilih/diisi.`);
        if (!mp.nomorAkun?.trim())
          return setError(`Metode pembayaran #${i + 1}: nomor rekening/akun wajib diisi.`);
      }
    }

    setIsSubmitting(true);
    startTransition(async () => {
      try {
        const result = await createEvent(buildFormData(isDraftFlag));
        if (result?.error) {
          setError(result.error);
          setIsSubmitting(false);
        } else {
          setSuccessMsg(
            isDraftFlag
              ? "Event berhasil disimpan sebagai draft!"
              : "Event berhasil diajukan ke admin untuk direview!"
          );
          setTimeout(() => router.push("/penyelenggara/event"), 1500);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '';
        setError(
          errorMessage.includes("exceeded")
            ? "Ukuran formulir melebihi batas server. Maksimal 5MB."
            : "Terjadi kesalahan jaringan atau server."
        );
        setIsSubmitting(false);
      }
    });
  };

  const handleModalYes = () => {
    if (isPending || isSubmitting) return;
    if (!eventTitle.trim()) { setShowDraftModal(false); resetForm(); return; }
    setIsSubmitting(true);
    startTransition(async () => {
      await createEvent(buildFormData(true));
      setShowDraftModal(false);
      resetForm();
      router.push("/penyelenggara/buatevent?reset=" + Date.now());
      setIsSubmitting(false);
    });
  };

  const handleModalNo = () => {
    setShowDraftModal(false);
    resetForm();
    router.push("/penyelenggara/buatevent?reset=" + Date.now());
  };

  const handleBannerDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) { setBannerFile(file); setBannerPreview(URL.createObjectURL(file)); }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setBannerFile(file); setBannerPreview(URL.createObjectURL(file)); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ConfirmationModal
        open={showDraftModal}
        title="Simpan Perubahan ke Draft?"
        message="Data event yang sudah kamu isi belum disimpan. Apakah kamu ingin menyimpan data ini ke dalam draft sebelum membuat event baru?"
        confirmLabel="Ya, Simpan Draft"
        cancelLabel="Tidak, Buang"
        variant="warning"
        loading={isPending || isSubmitting}
        onConfirm={handleModalYes}
        onCancel={handleModalNo}
      />

      <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col gap-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl shadow-sm">{error}</div>
        )}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl shadow-sm">{successMsg}</div>
        )}

        {/* Section 1: Tipe Event */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <SectionHeader icon={<InfoIcon />} title="Tipe Event" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField label="Pilih Tipe Event (Seminar/Conference)" value={eventType}
              onChange={(v) => setEventType(v as "seminar" | "conference")}
              options={[{ value: "seminar", label: "Seminar" }, { value: "conference", label: "Conference" }]} />
            <SelectField label="Pilih Jenis Event (Polines/Umum)" value={eventKind}
              onChange={(v) => setEventKind(v as "polines" | "umum")}
              options={[{ value: "polines", label: "Polines" }, { value: "umum", label: "Umum" }]} />
          </div>
        </div>

        {/* Section 2: Detail Umum */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <SectionHeader icon={<InfoIcon />} title="Detail Umum" />
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1.5 font-medium">Judul Event</label>
            <Input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Judul event..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 placeholder-slate-400 transition-all" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <SelectField label="Kategori Event" value={kategoriId} onChange={setKategoriId}
              options={[
                { value: "", label: "Pilih Kategori" },
                ...categories.map(c => ({ value: String(c.id), label: c.nama || "" }))
              ]} />
            <SelectField label="Tipe Platform" value={platform}
              onChange={(v) => setPlatform(v as "online" | "offline" | "hybrid")}
              options={[{ value: "offline", label: "Luring (Offline)" }, { value: "online", label: "Daring (Online)" }, { value: "hybrid", label: "Hybrid" }]} />
          </div>

          {platform !== "online" && (
            <div className="space-y-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField label="Provinsi" value={provinsiId}
                  onChange={(v) => { setProvinsiId(v); setKotaId(""); }}
                  options={[
                    { value: "", label: "Pilih Provinsi" },
                    ...provinces.map(p => ({ value: String(p.id), label: p.nama || "" }))
                  ]} />
                <div>
                  <SelectField label="Kota / Kabupaten" value={kotaId} onChange={setKotaId}
                    disabled={!provinsiId}
                    options={[
                      { value: "", label: provinsiId ? "Pilih Kota" : "— Pilih provinsi terlebih dahulu —" },
                      ...filteredCities.map(c => ({ value: String(c.id), label: c.nama || "" }))
                    ]} />
                  {!provinsiId && (
                    <p className="text-xs text-slate-400 mt-1 ml-1">Kota akan muncul setelah provinsi dipilih</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5 font-medium">Detail Lokasi</label>
                <Input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                  placeholder="Deskripsi Detail Lokasi"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 placeholder-slate-400 transition-all" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">Pembicara (Opsional)</label>
              <Input type="text" value={speaker} onChange={(e) => setSpeaker(e.target.value)}
                placeholder="Nama pembicara (pisahkan koma)..."
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 placeholder-slate-400 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">Tipe Tiket</label>
              <SelectField label="" value={tipeHarga} onChange={(v) => setTipeHarga(v as "free" | "paid")}
                options={[{ value: "paid", label: "Berbayar" }, { value: "free", label: "Gratis" }]} />
            </div>
            {tipeHarga === "paid" && (
              <div>
                <label className="block text-sm text-gray-600 mb-1.5 font-medium">Harga Tiket (Rupiah)</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">Rp</div>
                  <Input type="number" value={fee} onChange={(e) => setFee(e.target.value)}
                    placeholder="Contoh: 25000" min={0}
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 placeholder-slate-400 transition-all" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Deskripsi & Poster */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <SectionHeader icon={<ImageIcon />} title="Deskripsi & Poster" />
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1.5 font-medium">Deskripsi Event</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ceritakan detail event Anda..." rows={5}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 placeholder-slate-400 transition-all resize-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5 font-medium">Banner Event</label>
            <label className={`block border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
              dragOver ? "border-blue-400 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100/50"
            }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)} onDrop={handleBannerDrop}>
              <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
              {bannerPreview ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden">
                  <Image src={bannerPreview} alt="Banner Preview" fill className="object-cover" sizes="100vw" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">Klik untuk ganti</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 p-10">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center"><UploadIcon /></div>
                  <p className="text-sm font-medium text-gray-700">Drag & Drop Banner Event</p>
                  <p className="text-xs text-gray-400">Rasio rekomendasi: 1200 × 630px (Maks 5MB)</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Section 4: Syarat dan Ketentuan */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <SectionHeader icon={<ImageIcon />} title="Syarat dan Ketentuan" />
          <label className="block text-sm text-gray-600 mb-1.5 font-medium">Masukkan Detail Syarat &amp; Ketentuan Event</label>
          <Textarea value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="Syarat & Ketentuan" rows={5}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 placeholder-slate-400 transition-all resize-none" />
        </div>

        {/* Section 5: Jadwal & Kuota */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <SectionHeader icon={<CalendarIcon />} title="Jadwal & Kuota" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">Tanggal &amp; Waktu Mulai</label>
              <Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5 font-medium">Tanggal &amp; Waktu Selesai</label>
              <Input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5 font-medium">Kuota Peserta</label>
            <Input type="number" value={quota} onChange={(e) => setQuota(e.target.value)} min={0}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 placeholder-slate-400 transition-all" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5 font-medium">Batas Registrasi (Opsional)</label>
            <Input type="datetime-local" value={batasRegistrasi} onChange={(e) => setBatasRegistrasi(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all" />
            <p className="text-xs text-slate-400 mt-1 ml-1">Deadline pendaftaran peserta. Kosongkan jika tidak ada batas.</p>
          </div>
        </div>

        {/* Section 6: Metode Pembayaran */}
        {tipeHarga === "paid" && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <SectionHeader icon={<PaymentIcon />} title="Metode Pembayaran" />
            <p className="text-sm text-slate-500 mb-4">
              Tambahkan satu atau lebih metode pembayaran untuk peserta. Kamu bisa menambahkan Bank Transfer atau E-Wallet.
            </p>
            <div className="flex flex-col gap-4">
              {metodePembayaranList.map((item, index) => (
                <MetodePembayaranItem
                  key={index} item={item} index={index}
                  onChange={updateMetodePembayaran} onRemove={removeMetodePembayaran}
                />
              ))}
            </div>
            <Button type="button" onClick={addMetodePembayaran}
              variant="outline"
              className="mt-4 w-full border-2 border-dashed">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Tambah Metode Pembayaran
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pb-8">
          <Button type="button" onClick={() => handleSubmit(true)} disabled={isPending || isSubmitting}
            loading={isPending || isSubmitting}
            variant="outline">
            Simpan Draft
          </Button>
          <Button type="button" onClick={() => handleSubmit(false)} disabled={isPending || isSubmitting}
            loading={isPending || isSubmitting}
            variant="default">
            Ajukan Publikasi ke Admin
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {icon}
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
  );
}

function SelectField({ label, value, onChange, options, disabled }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div>
      {label && <label className="block text-sm text-gray-600 mb-1.5 font-medium">{label}</label>}
      <div className="relative">
        <Select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
          className={`w-full h-[42px] appearance-none border rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all ${
            disabled
              ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
              : "border-slate-200 text-slate-700"
          }`}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
        <div className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${disabled ? "text-slate-300" : "text-gray-400"}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function InfoIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
}
function ImageIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>;
}
function CalendarIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function PaymentIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>;
}
function UploadIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>;
}
