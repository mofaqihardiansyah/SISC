"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  Loader2
} from 'lucide-react';
import { daftarEvent } from '@/actions/peserta';
import { Modal } from '@/components/ui/modal';

interface DataEvent {
  judul: string;
  linkEksternal?: string | null;
  kategori?: string | null;
  harga?: number | string | null;
  tipeHarga?: string | null;
  jenisEvent?: string | null;
}

interface PaymentMethod {
  id: number;
  tipe: string;
  namaBank: string | null;
  nomorRekening: string | null;
  pemilikRekening: string | null;
  urlGambarQris: string | null;
}

interface CurrentUser {
  name?: string | null;
  email?: string | null;
  nomorTelepon?: string | null; 
  jenisKelamin?: string | null;
}

interface FormRegistrasiProps {
  eventId: string;
  dataEvent: DataEvent;
  currentUser: CurrentUser; 
  paymentMethods: PaymentMethod[];
}

const registrationSchema = z.object({
  nama_lengkap: z.string().min(2, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  nomor_telepon: z.string().min(8, "Nomor telepon wajib diisi"),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"]),
});

type RegistrationValues = z.infer<typeof registrationSchema>;

export default function FormRegistrasi({ eventId, dataEvent, currentUser, paymentMethods }: FormRegistrasiProps) {
  const router = useRouter();
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

  const formatGenderEnum = (gender: string | null | undefined): "Laki-laki" | "Perempuan" => {
    if (!gender) return "Laki-laki";
    const lower = gender.toLowerCase();
    if (lower === "pria" || lower === "laki-laki" || lower === "male") return "Laki-laki";
    if (lower === "wanita" || lower === "perempuan" || lower === "female") return "Perempuan";
    return "Laki-laki";
  };

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      nama_lengkap: currentUser.name || "",
      email: currentUser.email || "",
      nomor_telepon: currentUser.nomorTelepon && currentUser.nomorTelepon !== "-" ? currentUser.nomorTelepon : "",
      jenis_kelamin: formatGenderEnum(currentUser.jenisKelamin),
    }
  });

  const isGratis = dataEvent.tipeHarga === "free" || dataEvent.harga === 0 || dataEvent.harga === "0" || !dataEvent.harga;

  const checkIsConference = () => {
    return dataEvent.jenisEvent === "conference";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBuktiPembayaran(e.target.files[0]);
    }
  };

  const onSubmit = async (data: RegistrationValues) => {
    if (!isGratis && !buktiPembayaran) {
      setModalStatus({
        isOpen: true,
        type: 'warning',
        title: 'Bukti Pembayaran Diperlukan',
        message: 'Harap unggah file bukti transfer/pembayaran Anda terlebih dahulu sebelum menyelesaikan proses pendaftaran!'
      });
      return;
    }

    setIsLoading(true);

    try {
      let fileUrl = "";

      if (buktiPembayaran) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', buktiPembayaran);
        formDataUpload.append('type', 'document'); 

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.error || "Gagal mengunggah bukti pembayaran");
        }

        fileUrl = uploadData.url;
      }

      const payload = {
        ...data,
        bukti_pembayaran: fileUrl || undefined,
      };

      const res = await daftarEvent(payload, Number(eventId));
      setIsLoading(false);
      
      if (res && res.success) {
        setModalStatus({
          isOpen: true,
          type: 'success',
          title: 'Pendaftaran Berhasil!',
          message: `Selamat, Anda berhasil terdaftar pada event "${dataEvent.judul}".`
        });
      } else {
        const isAlreadyRegistered = res?.error?.toLowerCase().includes("sudah terdaftar") || res?.error?.toLowerCase().includes("unique");

        setModalStatus({
          isOpen: true,
          type: isAlreadyRegistered ? 'warning' : 'error',
          title: isAlreadyRegistered ? 'Sudah Terdaftar' : 'Gagal Mendaftar',
          message: isAlreadyRegistered 
            ? 'Anda sudah melakukan registrasi pada event ini sebelumnya.' 
            : (res?.error || "Terjadi kesalahan internal pada server database.")
        });
      }
    } catch (err) {
      console.error("Error mendaftar event:", err);
      setIsLoading(false);
      setModalStatus({
        isOpen: true,
        type: 'error',
        title: 'Gagal Mendaftar',
        message: 'Terjadi kegagalan koneksi sistem saat menghubungi server.'
      });
    }
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* SEKSI 1: INFORMASI PESERTA (Selalu muncul) */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary">
              <Info className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Informasi Peserta - {dataEvent.judul}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-gray-50/80 p-6 rounded-xl border border-gray-100">
            <div className="flex flex-col space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <User className="h-4 w-4" /> Nama Lengkap
              </Label>
              <Input 
                {...form.register("nama_lengkap")} 
                readOnly
                disabled
                className="bg-gray-100/70 border-gray-200 text-gray-700 cursor-not-allowed"
              />
              {form.formState.errors.nama_lengkap && (
                <p className="text-red-500 text-xs font-medium mt-1">{form.formState.errors.nama_lengkap.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Mail className="h-4 w-4" /> Alamat Email
              </Label>
              <Input 
                {...form.register("email")} 
                type="email"
                readOnly
                disabled
                className="bg-gray-100/70 border-gray-200 text-gray-700 cursor-not-allowed"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs font-medium mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Phone className="h-4 w-4" /> No. Handphone
              </Label>
              <Input 
                {...form.register("nomor_telepon")} 
                readOnly
                disabled
                className="bg-gray-100/70 border-gray-200 text-gray-700 cursor-not-allowed"
              />
              {form.formState.errors.nomor_telepon && (
                <p className="text-red-500 text-xs font-medium mt-1">{form.formState.errors.nomor_telepon.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Coins className="h-4 w-4" /> Jenis Kelamin
              </Label>
              <Select 
                {...form.register("jenis_kelamin")}
                disabled
                className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-100/70 px-3 py-2 text-sm text-gray-700 cursor-not-allowed focus-visible:outline-none disabled:opacity-70"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </Select>
              {form.formState.errors.jenis_kelamin && (
                <p className="text-red-500 text-xs font-medium mt-1">{form.formState.errors.jenis_kelamin.message}</p>
              )}
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
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-800">Pembayaran Tiket</h2>
              </div>
              
              <div className="mb-6 bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white shadow-md">
                <p className="text-white/80 text-sm font-medium mb-1">Total Tagihan Pembayaran</p>
                <h3 className="text-4xl font-black tracking-tight">
                  {Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(dataEvent.harga || 0))}
                </h3>
              </div>

              <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 space-y-4 text-sm text-gray-700">
                <p className="font-bold text-primary text-base">Petunjuk Alur Pembayaran:</p>
                <ul className="list-decimal pl-5 space-y-2 text-gray-600 leading-relaxed">
                  <li>Transfer nominal tagihan secara tepat ke salah satu rekening di bawah.</li>
                  <li>Simpan bukti transfer resmi berupa foto atau screenshot struk jernih.</li>
                </ul>
                <hr className="border-primary/20 my-2" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {paymentMethods && paymentMethods.map((pm) => (
                    <div key={pm.id} className="p-4 bg-white rounded-lg border shadow-sm hover:border-primary/50 transition-colors">
                      <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">{pm.namaBank || pm.tipe.replace('_', ' ')}</span>
                      <strong className="text-xl text-gray-800 font-mono tracking-wider block mt-1">{pm.nomorRekening || "-"}</strong>
                      <span className="text-sm text-gray-500 block mt-1">a.n. <span className="font-semibold text-gray-700">{pm.pemilikRekening || "-"}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SEKSI 3: UPLOAD BUKTI PEMBAYARAN */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <UploadCloud className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-800">Bukti Pembayaran</h2>
              </div>
              <div className="space-y-4">
                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Upload Bukti Pembayaran (Maks. 5MB)
                </Label>
                {!buktiPembayaran ? (
                  <div className="relative group border-2 border-dashed border-gray-300 hover:border-primary rounded-xl bg-gray-50/50 transition-all duration-200">
                    <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
                      <UploadCloud className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-semibold text-gray-700">Klik atau Drag & Drop Bukti Transfer</p>
                      <p className="text-xs text-gray-400">Mendukung JPG, PNG, PDF</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
                    <FileCheck className="h-6 w-6 text-green-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-green-800 truncate">{buktiPembayaran.name}</p>
                      <p className="text-xs text-green-600 mt-0.5">{(buktiPembayaran.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => setBuktiPembayaran(null)} className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                      Hapus
                    </Button>
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
            className={`w-full h-14 text-lg font-bold rounded-xl shadow-md transition-all active:scale-[0.99] ${
              isGratis ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90 text-white'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Memproses Pendaftaran...
              </span>
            ) : isGratis ? (
              "Daftar Event Sekarang (Gratis)"
            ) : (
              "Selesaikan Pendaftaran"
            )}
          </Button>
        </div>
      </form>

      {/* POP-UP CUSTOM MODAL DIALOG */}
      <Modal
        open={modalStatus.isOpen}
        onClose={() => {
          if (modalStatus.type !== 'success') {
            setModalStatus(prev => ({ ...prev, isOpen: false }));
          }
        }}
        className="text-center"
      >
        <div className="flex flex-col items-center max-w-md mx-auto">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${
            modalStatus.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
            modalStatus.type === 'warning' ? 'bg-amber-50 text-amber-600' :
            'bg-rose-50 text-rose-600'
          }`}>
            {modalStatus.type === 'success' && <CheckCircle2 className="w-10 h-10" />}
            {modalStatus.type === 'warning' && <AlertTriangle className="w-10 h-10" />}
            {modalStatus.type === 'error' && <XCircle className="w-10 h-10" />}
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">{modalStatus.title}</h3>
          <p className="text-slate-500 mb-8 leading-relaxed text-sm md:text-base">{modalStatus.message}</p>
          {modalStatus.type === 'success' && (
            <p className="text-amber-600 font-medium mb-8 leading-relaxed text-sm md:text-base p-3 bg-amber-50 rounded-lg">
              Pendaftaran Anda sedang menunggu verifikasi dari penyelenggara. Silakan cek status secara berkala di dashboard Anda.
              {checkIsConference() && " Setelah diverifikasi, Anda dapat melakukan submit paper."}
            </p>
          )}

          <div className="w-full">
            {modalStatus.type === 'success' || modalStatus.title === 'Sudah Terdaftar' ? (
              <Button 
                onClick={() => {
                  setModalStatus(prev => ({ ...prev, isOpen: false }));
                  router.push('/profile/dashboard');
                  router.refresh();
                }} 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-13 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
              >
                Lihat Dashboard Saya
              </Button>
            ) : (
              <Button 
                onClick={() => setModalStatus((prev) => ({ ...prev, isOpen: false }))} 
                className={`w-full font-bold h-13 rounded-2xl transition-all active:scale-[0.98] shadow-lg ${
                  modalStatus.type === 'warning' 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100' 
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-100'
                }`}
              >
                {modalStatus.type === 'warning' ? 'Upload Sekarang' : 'Tutup'}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}