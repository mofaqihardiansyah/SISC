"use client";

import React, { useState, useRef } from 'react';
import { Globe, Mail, Phone, FileText, Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';
import { updateProfilPenyelenggara, updateOrganisasiInfo } from './actions';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea'

interface ProfilFormProps {
  initialData: {
    urlAvatar: string | null;
    namaInstansi: string | null;
    deskripsiInstansi: string | null;
    urlWebsite: string | null;
    email: string | null;
    nomorTelepon: string | null;
    urlDokumenLegalitas: string | null;
    disetujui: boolean;
  };
}

export default function ProfilForm({ initialData }: ProfilFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingOrg, setIsSavingOrg] = useState(false);
  const [passLama, setPassLama] = useState('');
  const [passBaru, setPassBaru] = useState('');
  const [passKonfirm, setPassKonfirm] = useState('');
  const [loadingPass, setLoadingPass] = useState(false);
  const [errorPass, setErrorPass] = useState('');
  const [showPassLama, setShowPassLama] = useState(false);
  const [showPassBaru, setShowPassBaru] = useState(false);
  const [showPassKonfirm, setShowPassKonfirm] = useState(false);

  const [formData, setFormData] = useState({
    urlAvatar: initialData.urlAvatar || '/uploads/avatars/fotodummy.jpg',
    namaInstansi: initialData.namaInstansi || '',
    deskripsiInstansi: initialData.deskripsiInstansi || '',
    urlWebsite: initialData.urlWebsite || '',
    nomorTelepon: initialData.nomorTelepon || '',
    urlDokumenLegalitas: initialData.urlDokumenLegalitas || '',
  });

  const [avatarPreview, setAvatarPreview] = useState(formData.urlAvatar);
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
        setFormData(prev => ({ ...prev, urlAvatar: result.url }));
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
        setFormData(prev => ({ ...prev, urlDokumenLegalitas: result.url }));
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

  const handleSaveOrganisasi = async () => {
    setIsSavingOrg(true);
    try {
      const res = await updateOrganisasiInfo({
        urlAvatar: formData.urlAvatar,
        namaInstansi: formData.namaInstansi,
        deskripsiInstansi: formData.deskripsiInstansi,
        urlWebsite: formData.urlWebsite,
      });
      if (res.success) {
        toast.success('Informasi organisasi berhasil diperbarui!');
      } else {
        toast.error(res.error || 'Gagal menyimpan perubahan');
      }
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan');
    } finally {
      setIsSavingOrg(false);
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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Profil Penyelenggara</h1>
          {initialData.disetujui && (
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
            <div className="w-24 h-24 rounded-full border-2 border-slate-100 shrink-0 relative overflow-hidden bg-slate-100">
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
              <Button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                loading={isUploadingLogo}
                variant="default"
              >
                Ubah Logo
              </Button>
              <p className="text-xs text-slate-500 mt-2">Format: JPG, PNG, WEBP. Maks: 10MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold mb-2 block">Nama Organisasi</label>
              <Input 
                type="text" 
                value={formData.namaInstansi}
                onChange={(e) => setFormData(prev => ({ ...prev, namaInstansi: e.target.value }))}
                placeholder="Nama Organisasi Anda"
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-semibold mb-2 block">Deskripsi</label>
              <Textarea 
                rows={4}
                value={formData.deskripsiInstansi}
                onChange={(e) => setFormData(prev => ({ ...prev, deskripsiInstansi: e.target.value }))}
                placeholder="Deskripsi organisasi..."
                className="w-full px-4 py-3 border rounded-lg resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold mb-2 block">Website</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Globe size={18} />
                </div>
                <Input 
                  type="url" 
                  value={formData.urlWebsite}
                  onChange={(e) => setFormData(prev => ({ ...prev, urlWebsite: e.target.value }))}
                  placeholder="https://..."
                  className="w-full pl-12 pr-4 py-3 border rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <Button 
            type="button"
            onClick={handleSaveOrganisasi}
            loading={isSavingOrg}
            variant="default"
            className="w-full sm:w-auto"
          >
            Simpan Informasi Organisasi
          </Button>
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
              <Input 
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
              <Input 
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
          <label className="text-sm font-semibold mb-2 block">Dokumen Legalitas</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input 
              type="file" 
              ref={docInputRef} 
              onChange={handleDocumentUpload}
              accept="application/pdf" 
              className="hidden" 
            />
            <Button 
              type="button"
              onClick={() => docInputRef.current?.click()}
              loading={isUploadingDokumen}
              variant="outline"
            >
              <FileText size={16} />
              {formData.urlDokumenLegalitas ? 'Ubah Dokumen' : 'Upload Dokumen (PDF)'}
            </Button>
            
            {formData.urlDokumenLegalitas && (
              <a 
                href={formData.urlDokumenLegalitas}
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
          <Button 
            type="button"
            onClick={handleSubmit}
            loading={isSaving}
            variant="default"
            className="w-full sm:w-auto"
          >
            Simpan Profil Organisasi
          </Button>
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
            <div className="relative">
              <Input
                type={showPassLama ? 'text' : 'password'}
                value={passLama}
                onChange={(e) => setPassLama(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg pr-12"
                placeholder="Kata sandi lama"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassLama(!showPassLama)} className="absolute right-4 top-1/2 -translate-y-1/2" aria-label={showPassLama ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                {showPassLama ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Kata Sandi Baru</label>
            <div className="relative">
              <Input
                type={showPassBaru ? 'text' : 'password'}
                value={passBaru}
                onChange={(e) => setPassBaru(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg pr-12"
                placeholder="Minimal 8 karakter"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassBaru(!showPassBaru)} className="absolute right-4 top-1/2 -translate-y-1/2" aria-label={showPassBaru ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                {showPassBaru ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Konfirmasi Kata Sandi Baru</label>
            <div className="relative">
              <Input
                type={showPassKonfirm ? 'text' : 'password'}
                value={passKonfirm}
                onChange={(e) => setPassKonfirm(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg pr-12"
                placeholder="Ketik ulang kata sandi baru"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassKonfirm(!showPassKonfirm)} className="absolute right-4 top-1/2 -translate-y-1/2" aria-label={showPassKonfirm ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                {showPassKonfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>
          
          {errorPass && <p className="text-sm text-red-600">{errorPass}</p>}
          
          <Button
            type="button"
            onClick={handleUpdatePassword}
            loading={loadingPass}
            variant="default"
            className="w-full mt-4"
          >
            Perbarui Kata Sandi
          </Button>
        </div>
      </section>
    </div>
  );
}
