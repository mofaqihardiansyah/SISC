"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Info,
  User,
  Mail,
  UploadCloud,
  CreditCard,
  FileCheck
} from 'lucide-react';
import { daftarEvent } from '@/actions/peserta';

interface DataEvent {
  judul: string;
  linkEksternal?: string | null;
}

export default function FormRegistrasi({ eventId, dataEvent }: { eventId: string; dataEvent: DataEvent }) {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    nomor_telepon: '',
    jenis_kelamin: 'pria'
  });
  const [buktiPembayaran, setBuktiPembayaran] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBuktiPembayaran(e.target.files[0]);
    }
  };

  const handleSimpanData = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama_lengkap || !formData.email || !formData.nomor_telepon) {
      alert("Harap isi semua informasi peserta!");
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
      alert(`Pendaftaran Berhasil Disimpan untuk Event: ${dataEvent.judul}`);
    } else {
      alert("Gagal menyimpan data. Cek terminal!");
    }
  };

  return (
    <form onSubmit={handleSimpanData} className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* SEKSI 1: INFORMASI PESERTA */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600">
            <Info className="h-4 w-4 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Informasi Peserta - {dataEvent.judul}</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <User className="h-3.5 w-3.5" /> Nama Lengkap
            </Label>
            <Input 
              value={formData.nama_lengkap}
              onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
              placeholder="Masukkan Nama Lengkap" 
              className="bg-gray-50 border-none h-12" 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" /> Email
            </Label>
            <Input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Masukkan Email Anda" 
              className="bg-gray-50 border-none h-12" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Handphone</Label>
              <div className="flex gap-2">
                <select className="flex h-12 w-[100px] rounded-md border-none bg-gray-50 px-3 py-2 text-sm outline-none">
                  <option value="62">(+62)</option>
                </select>
                <Input 
                  type="tel" 
                  value={formData.nomor_telepon}
                  onChange={(e) => setFormData({...formData, nomor_telepon: e.target.value})}
                  placeholder="8123456789" 
                  className="flex-1 bg-gray-50 border-none h-12" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis Kelamin</Label>
              <select 
                value={formData.jenis_kelamin}
                onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}
                className="flex h-12 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm outline-none"
              >
                <option value="pria">Pria</option>
                <option value="wanita">Wanita</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SEKSI 2: DESKRIPSI PEMBAYARAN */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Informasi & Deskripsi Pembayaran</h2>
        </div>
        
        <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-5 space-y-4 text-sm text-gray-700">
          
          {/* 5 POIN REKOMENDASI PETUNJUK PEMBAYARAN */}
          <div className="space-y-2">
            <p className="font-bold text-blue-900 mb-2 text-base">Petunjuk Alur Pembayaran:</p>
            <ul className="list-decimal pl-5 space-y-2 text-gray-600 leading-relaxed">
              <li>Transfer nominal biaya pendaftaran sesuai kategori tiket yang Anda pilih ke salah satu rekening resmi (Bank Mandiri atau E-Wallet) yang tertera di bawah.</li>
              <li>Pada kolom catatan/berita transfer, disarankan mengetik format: <code className="bg-white px-1.5 py-0.5 rounded border text-blue-700 font-mono text-xs">Nama_IDEvent</code> untuk mempercepat proses verifikasi oleh panitia.</li>
              <li>Pastikan Anda menyimpan bukti transfer resmi berupa screenshot (m-banking/e-wallet) atau foto struk fisik yang terlihat jelas tulisannya (tidak blur).</li>
              <li>Unggah file bukti transfer tersebut pada area <span className="font-medium text-gray-800">Drag & Drop Bukti Pembayaran</span> yang telah disediakan di bagian bawah halaman ini.</li>
              <li>Setelah menekan tombol &quot;Simpan dan Selesai&quot;, data Anda akan divalidasi. Status pendaftaran dan e-ticket dapat dipantau secara berkala pada Dashboard menu <strong className="text-gray-900">&apos;Eventku&apos;</strong>.</li>
            </ul>
          </div>

          <hr className="border-blue-100 my-2" />

          <p className="font-semibold text-blue-900">Silakan lakukan pembayaran pendaftaran melalui rekening berikut:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
              <span className="text-xs text-gray-400 block">Bank Transfer (Bank Mandiri)</span>
              <strong className="text-base text-gray-800">132-000-1234-567</strong>
              <span className="text-xs text-gray-500 block mt-1">a.n. Panitia POLIVENTS</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
              <span className="text-xs text-gray-400 block">E-Wallet (Dana / ShopeePay)</span>
              <strong className="text-base text-gray-800">0812-3456-7890</strong>
              <span className="text-xs text-gray-500 block mt-1">a.n. POLIVENTS Internal</span>
            </div>
          </div>
          <p className="text-xs text-red-500 pt-2 font-medium">
            *Pastikan nominal transfer sesuai dengan ketentuan harga tiket event. Simpan bukti transfer untuk diunggah di bawah ini.
          </p>
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
          
          {/* Komponen Drag & Drop Area - Teks sudah di-update */}
          <div className="relative group border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-xl bg-gray-50/50 transition-all duration-200">
            <input 
              type="file" 
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <UploadCloud className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">Drag & Drop Bukti Pembayaran</p>
                <p className="text-xs text-gray-400">Format yang didukung: JPG, PNG, atau PDF (Maks. 5MB)</p>
              </div>
            </div>
          </div>

          {/* Manajer Tampilan Gambar/File yang Sukses Dipilih */}
          {buktiPembayaran && (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-2">
              <FileCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800 truncate">{buktiPembayaran.name}</p>
                <p className="text-xs text-green-600">{(buktiPembayaran.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setBuktiPembayaran(null)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs"
              >
                Hapus
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* TOMBOL SIMPAN UTAMA */}
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-[#0052cc] hover:bg-blue-700 h-14 text-lg font-bold rounded-xl shadow-md transition-transform active:scale-[0.99]"
        >
          Simpan dan Selesai Pendaftaran
        </Button>
      </div>

    </form>
  );
}