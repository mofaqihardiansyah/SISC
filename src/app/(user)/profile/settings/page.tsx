'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { ConfirmationModal } from '@/components/feedback/ConfirmationModal';
import { UPLOAD_LIMITS } from '@/lib/constants';
export const dynamic = 'force-dynamic';


export default function SettingsPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institusi: '',
    urlAvatar: '',
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [passLama, setPassLama] = useState('');
  const [passBaru, setPassBaru] = useState('');
  const [passKonfirm, setPassKonfirm] = useState('');
  const [loadingPass, setLoadingPass] = useState(false);
  const [errorPass, setErrorPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // FETCH DATA USER
  useEffect(() => {
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.namaLengkap || '',
          email: data.email || '',
          phone: data.nomorTelepon || '',
          institusi: data.institusi || '',
          urlAvatar: data.urlAvatar || '',
        });
      })
      .catch(err => console.error("Gagal fetch profil:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > UPLOAD_LIMITS.AVATAR_MAX_SIZE) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('type', 'avatar');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal upload foto');
      }

      const data = await res.json();
      setFormData(prev => ({ ...prev, urlAvatar: data.url }));
      toast.success('Foto profil berhasil diupload. Jangan lupa klik Simpan Perubahan.');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan saat upload foto');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // UPDATE
  const handleSave = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast.success('Pengaturan berhasil disimpan!');
      router.refresh();
    } catch {
      toast.error('Gagal menyimpan');
    }
  };

  // UPDATE PASSWORD
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

  // DELETE
  const handleDelete = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error();

      toast.success('Akun berhasil dihapus');
      router.push('/login');
    } catch {
      toast.error('Gagal menghapus akun');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-500">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pengaturan Akun</h1>
        <p className="text-slate-500 mt-2">
          Kelola informasi profil dan preferensi Anda
        </p>
      </div>

      {/* INFORMASI PROFIL */}
      <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Informasi Profil
        </h2>

        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 flex-shrink-0">
              <Image 
                src={formData.urlAvatar || "/uploads/avatars/fotodummy.jpg"} 
                alt="Profile" 
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="default"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? 'Mengupload...' : 'Ubah Foto Profil'}
              </Button>
              <p className="text-xs text-slate-500 mt-1">
                Format: JPG, PNG, WEBP. Maks: 2MB
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Nama Lengkap
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Email
              </label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Nomor Telepon
              </label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Institusi
              </label>
              <Input
                name="institusi"
                value={formData.institusi}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
          </div>

          <Button
            variant="default"
            className="w-full"
            onClick={handleSave}
          >
            Simpan Perubahan
          </Button>
        </div>
      </section>

      {/* KEAMANAN */}
      <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <h2 className="text-2xl font-bold mb-6">Keamanan & Privasi</h2>

        <div className="space-y-4 max-w-md relative">
          <div>
            <label className="text-sm font-semibold mb-2 block">Kata Sandi Saat Ini</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={passLama}
                onChange={(e) => setPassLama(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg pr-12"
                placeholder="Masukkan kata sandi lama"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Kata Sandi Baru</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={passBaru}
                onChange={(e) => setPassBaru(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg pr-12"
                placeholder="Masukkan kata sandi baru"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Konfirmasi Kata Sandi Baru</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={passKonfirm}
                onChange={(e) => setPassKonfirm(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg pr-12"
                placeholder="Ketik ulang kata sandi baru"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>
          {errorPass && <p className="text-sm text-red-600">{errorPass}</p>}
          <Button
            variant="default"
            className="w-full"
            onClick={handleUpdatePassword}
            disabled={loadingPass}
          >
            {loadingPass ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
          </Button>
        </div>
      </section>

      {/* DANGER ZONE */}
      <section className="bg-red-50 border border-red-200 rounded-xl p-8 shadow-xs">
        <h2 className="text-2xl font-bold text-red-900 mb-6">
          Konfirmasi Penghapusan Akun
        </h2>

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => setShowDeleteModal(true)}
        >
          Hapus Akun
        </Button>

        <p className="text-xs text-red-700 mt-2">
          Menghapus akun akan menghapus semua data secara permanen.
        </p>
      </section>

      {/* MODAL */}
      <ConfirmationModal
        open={showDeleteModal}
        title="Hapus Akun Permanen?"
        message="Tindakan ini tidak dapat dibatalkan. Semua data profil, riwayat event, dan sertifikat Anda akan dihapus secara permanen."
        confirmLabel="Ya, Hapus Akun"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}