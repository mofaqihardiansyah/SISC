"use client";

import React, { useState, useRef } from 'react';
import { Camera, Globe, Mail, Phone, FileText, Eye, Loader2, KeyRound } from 'lucide-react';
import { updateProfilPenyelenggara } from './actions';
import Image from 'next/image';
import { toast } from 'sonner';

interface ProfilFormProps {
  initialData: {
    avatarUrl: string | null;
    namaInstansi: string | null;
    deskripsiInstansi: string | null;
    websiteUrl: string | null;
    email: string | null;
    nomorTelepon: string | null;
    dokumenLegalitasUrl: string | null;
    isApproved: boolean;
  };
}

export default function ProfilForm({ initialData }: ProfilFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [passLama, setPassLama] = useState('');
  const [passBaru, setPassBaru] = useState('');
  const [passKonfirm, setPassKonfirm] = useState('');
  const [loadingPass, setLoadingPass] = useState(false);
  const [errorPass, setErrorPass] = useState('');

  const [formData, setFormData] = useState({
    avatarUrl: initialData.avatarUrl || '/uploads/avatars/fotodummy.jpg',
    namaInstansi: initialData.namaInstansi || '',
    deskripsiInstansi: initialData.deskripsiInstansi || '',
    websiteUrl: initialData.websiteUrl || '',
    nomorTelepon: initialData.nomorTelepon || '',
    dokumenLegalitasUrl: initialData.dokumenLegalitasUrl || '',
  });

  const [avatarPreview, setAvatarPreview] = useState(formData.avatarUrl);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingDokumen, setIsUploadingDokumen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingLogo(true);
      const data = new FormData();
      data.append('file', file);
      data.append('type', 'avatar');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      
      if (result.success) {
        setFormData(prev => ({ ...prev, avatarUrl: result.url }));
        setAvatarPreview(result.url);
        toast.success('Logo berhasil diupload');
      } else {
        toast.error(result.error || 'Gagal upload logo');
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal upload logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingDokumen(true);
      const data = new FormData();
      data.append('file', file);
      data.append('type', 'document');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      
      if (result.success) {
        setFormData(prev => ({ ...prev, dokumenLegalitasUrl: result.url }));
        toast.success('Dokumen berhasil diupload');
      } else {
        toast.error(result.error || 'Gagal upload dokumen');
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal upload dokumen');
    } finally {
      setIsUploadingDokumen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateProfilPenyelenggara(formData);
      if (res.success) {
        toast.success('Profil berhasil diperbarui!');
      } else {
        toast.error(res.error || 'Gagal menyimpan perubahan');
      }
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    setErrorPass('');
    if (!passLama || !passBaru || !passKonfirm) {
      setErrorPass('Semua kolom wajib diisi');
      return;
    }
    if (passBaru !== passKonfirm) {
      setErrorPass('Konfirmasi password tidak cocok');
      return;
    }
    if (passBaru.length < 8) {
      setErrorPass('Kata sandi baru minimal 8 karakter');
      return;
    }
    setLoadingPass(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passLama, passBaru }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengubah kata sandi');
      }
      toast.success('Kata sandi berhasil diperbarui');
      setPassLama('');
      setPassBaru('');
      setPassKonfirm('');
    } catch (error: unknown) {
      setErrorPass(error instanceof Error ? error.message : 'Terjadi kesalahan jaringan');
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="p-6 ml-0 md:ml-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Profil Penyelenggara</h1>
        {initialData.isApproved && (
          <span className="bg-emerald-100 text-emerald-600 w-fit text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Akun Terverifikasi
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Informasi Organisasi (Lebar 2 Kolom) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Informasi Organisasi</h2>
            <p className="text-sm text-slate-500 mb-8">Kelola identitas publik dan deskripsi lembaga Anda.</p>

            {/* Bagian Ubah Logo */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden relative">
                  <Image 
                    src={avatarPreview} 
                    alt="Logo Organisasi" 
                    fill
                    className="object-cover"
                  />
                  {isUploadingLogo && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 bg-slate-800 text-white rounded-full border-2 border-white hover:bg-slate-700 transition-colors z-10"
                >
                  <Camera size={16} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarUpload}
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">Ubah Logo</h3>
                <p className="text-xs text-slate-400">Maks. 10MB (JPG, PNG). Rekomendasi 512×512px.</p>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Organisasi</label>
                <input 
                  type="text" 
                  value={formData.namaInstansi}
                  onChange={(e) => setFormData(prev => ({ ...prev, namaInstansi: e.target.value }))}
                  placeholder="Nama Organisasi Anda"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
                <textarea 
                  rows={4}
                  value={formData.deskripsiInstansi}
                  onChange={(e) => setFormData(prev => ({ ...prev, deskripsiInstansi: e.target.value }))}
                  placeholder="Deskripsikan organisasi Anda..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Globe size={18} />
                  </div>
                  <input 
                    type="url" 
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Kontak & Legalitas */}
        <div className="space-y-6">
          {/* Card Kontak */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Informasi Kontak</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input 
                    type="email" 
                    value={initialData.email || ''}
                    readOnly
                    title="Email tidak dapat diubah"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nomor HP/WA</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input 
                    type="text" 
                    value={formData.nomorTelepon}
                    onChange={(e) => setFormData(prev => ({ ...prev, nomorTelepon: e.target.value }))}
                    placeholder="+62 8..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card Legalitas */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Dokumen Legalitas</h2>
            </div>
            
            {formData.dokumenLegalitasUrl ? (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-3 mb-4">
                <div className="p-2 bg-red-50 text-red-500 rounded-lg flex-shrink-0">
                  <FileText size={24} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold text-slate-700 truncate mb-1" title={formData.dokumenLegalitasUrl.split('/').pop()}>
                    {formData.dokumenLegalitasUrl.split('/').pop()}
                  </p>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    Tersimpan
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 mb-4 text-slate-500 text-sm">
                <FileText size={24} className="text-slate-400" />
                <p>Belum ada dokumen</p>
              </div>
            )}

            <div className="space-y-3">
              {formData.dokumenLegalitasUrl && (
                <a 
                  href={formData.dokumenLegalitasUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Eye size={16} />
                  Lihat Dokumen
                </a>
              )}
              
              <button 
                type="button"
                onClick={() => docInputRef.current?.click()}
                disabled={isUploadingDokumen}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {isUploadingDokumen ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText size={16} />}
                {formData.dokumenLegalitasUrl ? 'Ubah Dokumen' : 'Upload Dokumen (PDF)'}
              </button>
              <input 
                type="file" 
                ref={docInputRef} 
                onChange={handleDocumentUpload}
                accept="application/pdf" 
                className="hidden" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Button Section for Organization Profile */}
      <div className="mt-8 flex justify-end pb-8 border-b border-slate-200">
        <button 
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-8 py-3 bg-[#7C87A6] text-white rounded-lg font-semibold hover:bg-[#6A7591] transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
          {isSaving ? 'Menyimpan...' : 'Simpan Profil Organisasi'}
        </button>
      </div>

      {/* Bagian Keamanan Akun di Bawah */}
      <div className="mt-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-3xl">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <KeyRound size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Keamanan Akun</h2>
              <p className="text-sm text-slate-500">Perbarui kata sandi untuk akun administrator penyelenggara Anda.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="max-w-md">
              <label className="block text-sm font-medium text-slate-700 mb-2">Kata Sandi Saat Ini</label>
              <input
                type="password"
                value={passLama}
                onChange={(e) => setPassLama(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                placeholder="Masukkan kata sandi saat ini"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={passBaru}
                  onChange={(e) => setPassBaru(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                  placeholder="Minimal 8 karakter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Konfirmasi Kata Sandi</label>
                <input
                  type="password"
                  value={passKonfirm}
                  onChange={(e) => setPassKonfirm(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                  placeholder="Ketik ulang kata sandi baru"
                />
              </div>
            </div>

            {errorPass && <p className="text-sm text-red-600 font-medium">{errorPass}</p>}

            <div className="pt-4 flex justify-start">
              <button
                type="button"
                onClick={handleUpdatePassword}
                disabled={loadingPass}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {loadingPass && <Loader2 className="w-4 h-4 animate-spin" />}
                {loadingPass ? 'Memperbarui...' : 'Perbarui Kata Sandi'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
