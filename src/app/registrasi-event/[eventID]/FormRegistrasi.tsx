"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Info,
  User,
  Mail,
  Phone,
  Coins,
  UploadCloud,
  FileCheck,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  FileText
} from 'lucide-react';
import { daftarEvent } from '@/actions/peserta';

interface DataEvent {
  judul: string;
  linkEksternal?: string | null;
}

export default function FormRegistrasi({ eventId, dataEvent }: { eventId: string; dataEvent: DataEvent }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    nomor_telepon: '',
    jenis_kelamin: 'pria'
  });
  const [buktiPembayaran, setBuktiPembayaran] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [modalStatus, setModalStatus] = useState<{
    isOpen: boolean;
    type: 'success' | 'warning' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Pengecekan cerdas: Apakah event ini gratis? (Harga bernilai 0, "0", atau kosong)
  const isGratis = dataEvent.harga === 0 || dataEvent.harga === "0" || !dataEvent.harga;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBuktiPembayaran(e.target.files[0]);
    }
  };

  const formatGenderEnum = (gender: string | null | undefined) => {
    if (!gender) return "Laki-laki";
    const lower = gender.toLowerCase();
    if (lower === "pria" || lower === "laki-laki" || lower === "male") return "Laki-laki";
    if (lower === "wanita" || lower === "perempuan" || lower === "female") return "Perempuan";
    return gender;
  };

  const checkIsConference = () => {
    const kategori = dataEvent.kategori?.toLowerCase() || "";
    const judul = dataEvent.judul?.toLowerCase() || "";
    return kategori === "conference" || kategori === "konferensi" || judul.includes("conference") || judul.includes("konferensi");
  };

  const handleSimpanData = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // VALIDASI PEMBAYARAN: Hanya dijalankan kalau eventnya BERBAYAR (!isGratis)
    if (!isGratis && !buktiPembayaran) {
      setModalStatus({
        isOpen: true,
        type: 'warning',
        title: 'Bukti Pembayaran Diperlukan',
        message: 'Harap unggah file bukti transfer/pembayaran Anda terlebih dahulu sebelum menyelesaikan proses pendaftaran!'
      });
      return;
    }

    if (!buktiPembayaran) {
      alert("Harap unggah bukti pembayaran terlebih dahulu!");
      return;
    }

    // Menggunakan FormData untuk kebutuhan pengiriman file ke Server Action backend
    const dataToSend = new FormData();
    dataToSend.append("nama_lengkap", formData.nama_lengkap);
    dataToSend.append("email", formData.email);
    dataToSend.append("nomor_telepon", formData.nomor_telepon);
    dataToSend.append("jenis_kelamin", formData.jenis_kelamin);
    dataToSend.append("bukti_pembayaran", buktiPembayaran);

    const res = await daftarEvent(formData, Number(eventId));
    if (res.success) {
      toast.success(`Pendaftaran Berhasil! Silakan lengkapi submission paper Anda.`);
      router.push(`/profile/submit-paper?eventId=${eventId}`);
    } else {
      toast.error(res.error || "Gagal menyimpan data.");
    }
  };

  return (
    <>
      <form onSubmit={handleSimpanData} className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* SEKSI 1: INFORMASI PESERTA (Selalu muncul) */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Informasi Peserta - {dataEvent.judul}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-gray-50/80 p-6 rounded-xl border border-gray-100">
            <div className="flex flex-col space-y-1.5 pl-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" /> Nama Lengkap
              </span>
              <p className="text-[15px] font-semibold text-gray-900 tracking-wide ml-[24px]">
                {currentUser?.name || "Nama Tidak Ditemukan"}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5 pl-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" /> Alamat Email
              </span>
              <p className="text-[15px] font-semibold text-gray-900 tracking-wide ml-[24px]">
                {currentUser?.email || "Email Tidak Ditemukan"}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5 pl-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" /> No. Handphone
              </span>
              <p className="text-[15px] font-semibold text-gray-900 tracking-wide ml-[24px]">
                {currentUser?.nomorTelepon || "-"}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5 pl-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Coins className="h-4 w-4 text-gray-400" /> Jenis Kelamin
              </span>
              <p className="text-[15px] font-semibold text-gray-900 tracking-wide capitalize ml-[24px]">
                {currentUser?.jenisKelamin || "Laki-laki"}
              </p>
            </div>
          </div>
          {isGratis && (
            <p className="text-xs font-semibold text-green-600 mt-4 bg-green-50 p-2.5 rounded-lg border border-green-100 animate-pulse">
              ✓ Event ini tidak dipungut biaya (Gratis). Anda bisa langsung menekan tombol pendaftaran di bawah.
            </p>
          )}
        </div>

        {/* LOGIKAL KONDISIONAL: JIKA BERBAYAR, TAMPILKAN SEKSI REKENING & UPLOAD BUKTI */}
        {!isGratis && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* SEKSI 2: DESKRIPSI PEMBAYARAN */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Informasi & Deskripsi Pembayaran</h2>
              </div>
              <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-5 space-y-4 text-sm text-gray-700">
                <p className="font-bold text-blue-900 text-base">Petunjuk Alur Pembayaran:</p>
                <ul className="list-decimal pl-5 space-y-2 text-gray-600 leading-relaxed">
                  <li>Transfer nominal biaya pendaftaran sesuai kategori tiket ke salah satu rekening di bawah.</li>
                  <li>Simpan bukti transfer resmi berupa screenshot jernih.</li>
                </ul>
                <hr className="border-blue-100 my-2" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-white rounded-lg border shadow-sm">
                    <span className="text-xs text-gray-400 block">Bank Transfer (Bank Mandiri)</span>
                    <strong className="text-base text-gray-800">132-000-1234-567</strong>
                    <span className="text-xs text-gray-500 block mt-1">a.n. Panitia POLIVENTS</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border shadow-sm">
                    <span className="text-xs text-gray-400 block">E-Wallet (Dana / ShopeePay)</span>
                    <strong className="text-base text-gray-800">0812-3456-7890</strong>
                    <span className="text-xs text-gray-500 block mt-1">a.n. POLIVENTS Internal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SEKSI 3: UPLOAD BUKTI PEMBAYARAN */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <UploadCloud className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Bukti Pembayaran</h2>
              </div>
              <div className="space-y-4">
                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Upload Bukti Pembayaran (Maks. 5MB)
                </Label>
                <div className="relative group border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-xl bg-gray-50/50 transition-all duration-200">
                  <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
                    <UploadCloud className="h-6 w-6 text-blue-600" />
                    <p className="text-sm font-semibold text-gray-700">Drag & Drop Bukti Pembayaran</p>
                  </div>
                </div>
                {buktiPembayaran && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <FileCheck className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-green-800 truncate flex-1">{buktiPembayaran.name}</p>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setBuktiPembayaran(null)} className="text-red-500 text-xs">Hapus</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TOMBOL SIMPAN UTAMA */}
        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className={`w-full h-14 text-lg font-bold rounded-xl shadow-md transition-transform active:scale-[0.99] ${
              isGratis ? 'bg-green-600 hover:bg-green-700' : 'bg-[#0052cc] hover:bg-blue-700'
            }`}
          >
            {isLoading ? "Sedang Memproses..." : isGratis ? "Daftar Event Sekarang (Gratis)" : "Simpan dan Selesai Pendaftaran"}
          </Button>
        </div>
      </form>

      {/* POP-UP CUSTOM MODAL DIALOG */}
      {modalStatus.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
            
            {modalStatus.type === 'success' && <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />}
            {modalStatus.type === 'warning' && <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />}
            {modalStatus.type === 'error' && <XCircle className="w-12 h-12 text-red-500 mb-4" />}

            <h3 className="text-xl font-bold text-gray-900 mb-2">{modalStatus.title}</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{modalStatus.message}</p>

            <div className="w-full">
              {modalStatus.type === 'success' || modalStatus.title === 'Sudah Terdaftar' ? (
                checkIsConference() ? (
                  <Button onClick={handleModalAction} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" /> Lanjutkan ke Submit Paper <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleModalAction} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold h-11 rounded-xl flex items-center justify-center gap-2">
                    Kembali ke Detail Event
                  </Button>
                )
              ) : (
                <Button onClick={() => setModalStatus((prev) => ({ ...prev, isOpen: false }))} className={`w-full font-bold h-11 rounded-xl ${modalStatus.type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
                  {modalStatus.type === 'warning' ? 'Upload Sekarang' : 'Tutup'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}