"use client";

import React, { useState, useRef } from 'react';
import { Globe, Mail, Phone, FileText, Eye, Loader2, KeyRound } from 'lucide-react';
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
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-500 p-6 md:p-8">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Profil Penyelenggara</h1>
          {initialData.isApproved && (
            <span className="bg-emerald-100 text-emerald-600 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Akun Terverifikasi
            </span>
          )}
        </div>
        <p className="text-slate-500 mt-2">Kelola identitas publik dan pengaturan keamanan Anda</p>
      </div>

      {/* Informasi Organisasi */}
      <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Informasi Organisasi</h2>
        
        <div className="space-y-6">
          {/* Logo Upload */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-2 border-slate-100 flex-shrink-0 relative overflow-hidden bg-slate-100">
              <Image 
                src={avatarPreview} 
                alt="Logo Organisasi" 
                fill
                className="object-cover"
              />
              {isUploadingLogo && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload}
                accept="image/jpeg, image/png, image/webp" 
                className="hidden" 
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingLogo}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl disabled:opacity-50 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
              >
                {isUploadingLogo ? 'Mengupload...' : 'Ubah Logo'}
              </button>
              <p className="text-xs text-slate-500 mt-2">Format: JPG, PNG, WEBP. Maks: 10MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold mb-2 block">Nama Organisasi</label>
              <input 
                type="text" 
                value={formData.namaInstansi}
                onChange={(e) => setFormData(prev => ({ ...prev, namaInstansi: e.target.value }))}
                placeholder="Nama Organisasi Anda"
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-semibold mb-2 block">Deskripsi</label>
              <textarea 
                rows={4}
                value={formData.deskripsiInstansi}
                onChange={(e) => setFormData(prev => ({ ...prev, deskripsiInstansi: e.target.value }))}
                placeholder="Deskripsikan organisasi Anda..."
                className="w-full px-4 py-3 border rounded-lg resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold mb-2 block">Website</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Globe size={18} />
                </div>
                <input 
                  type="url" 
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full pl-12 pr-4 py-3 border rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kontak & Legalitas */}
      <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Kontak & Legalitas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="text-sm font-semibold mb-2 block">Email Pendaftaran</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                value={initialData.email || ''}
                readOnly
                className="w-full pl-12 pr-4 py-3 border border-slate-200 bg-slate-100 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Email tidak dapat diubah</p>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Nomor HP/WA</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Phone size={18} />
              </div>
              <input 
                type="text" 
                value={formData.nomorTelepon}
                onChange={(e) => setFormData(prev => ({ ...prev, nomorTelepon: e.target.value }))}
                placeholder="+62 8..."
                className="w-full pl-12 pr-4 py-3 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Dokumen Legalitas (Opsional)</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input 
              type="file" 
              ref={docInputRef} 
              onChange={handleDocumentUpload}
              accept="application/pdf" 
              className="hidden" 
            />
            <button 
              type="button"
              onClick={() => docInputRef.current?.click()}
              disabled={isUploadingDokumen}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl disabled:opacity-50 font-semibold flex items-center gap-2 text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
            >
              {isUploadingDokumen ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText size={16} />}
              {formData.dokumenLegalitasUrl ? 'Ubah Dokumen' : 'Upload Dokumen (PDF)'}
            </button>
            
            {formData.dokumenLegalitasUrl && (
              <a 
                href={formData.dokumenLegalitasUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-semibold"
              >
                <Eye size={16} /> Lihat Dokumen Tersimpan
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
            {isSaving ? 'Menyimpan...' : 'Simpan Profil Organisasi'}
          </button>
        </div>
      </section>

      {/* Keamanan */}
      <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
            <KeyRound size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Keamanan Akun</h2>
        </div>
        
        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-semibold mb-2 block">Kata Sandi Saat Ini</label>
            <input
              type="password"
              value={passLama}
              onChange={(e) => setPassLama(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Masukkan kata sandi lama"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Kata Sandi Baru</label>
            <input
              type="password"
              value={passBaru}
              onChange={(e) => setPassBaru(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Minimal 8 karakter"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Konfirmasi Kata Sandi Baru</label>
            <input
              type="password"
              value={passKonfirm}
              onChange={(e) => setPassKonfirm(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Ketik ulang kata sandi baru"
            />
          </div>
          
          {errorPass && <p className="text-sm text-red-600">{errorPass}</p>}
          
          <button
            type="button"
            onClick={handleUpdatePassword}
            disabled={loadingPass}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2 mt-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            {loadingPass && <Loader2 className="w-4 h-4 animate-spin" />}
            {loadingPass ? 'Memperbarui...' : 'Perbarui Kata Sandi'}
          </button>
        </div>
      </section>
    </div>
  );
}
