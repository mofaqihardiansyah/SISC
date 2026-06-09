'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    avatarUrl: '',
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
          institution: data.institution || '',
          avatarUrl: data.avatarUrl || '',
        });
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
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
      setFormData(prev => ({ ...prev, avatarUrl: data.url }));
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
        <h1 className="text-3xl font-bold text-slate-900">Pengaturan Akun</h1>
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
                src={formData.avatarUrl || "/uploads/avatars/fotodummy.jpg"} 
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
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl disabled:opacity-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
              >
                {isUploading ? 'Mengupload...' : 'Ubah Foto Profil'}
              </button>
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
              <input
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
              <input
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
              <input
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
              <input
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            Simpan Perubahan
          </button>
        </div>
      </section>

      {/* KEAMANAN */}
      <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <h2 className="text-2xl font-bold mb-6">Keamanan & Privasi</h2>

        <div className="space-y-4 max-w-md relative">
          <div>
            <label className="text-sm font-semibold mb-2 block">Kata Sandi Saat Ini</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passLama}
                onChange={(e) => setPassLama(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg pr-12"
                placeholder="Masukkan kata sandi lama"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Kata Sandi Baru</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passBaru}
                onChange={(e) => setPassBaru(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg pr-12"
                placeholder="Masukkan kata sandi baru"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Konfirmasi Kata Sandi Baru</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passKonfirm}
                onChange={(e) => setPassKonfirm(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg pr-12"
                placeholder="Ketik ulang kata sandi baru"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {errorPass && <p className="text-sm text-red-600">{errorPass}</p>}
          <button
            onClick={handleUpdatePassword}
            disabled={loadingPass}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold disabled:opacity-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            {loadingPass ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
          </button>
        </div>
      </section>

      {/* DANGER ZONE */}
      <section className="bg-red-50 border border-red-200 rounded-xl p-8 shadow-xs">
        <h2 className="text-2xl font-bold text-red-900 mb-6">
          Konfirmasi Penghapusan Akun
        </h2>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
        >
          Hapus Akun
        </button>

        <p className="text-xs text-red-700 mt-2">
          Menghapus akun akan menghapus semua data secara permanen.
        </p>
      </section>

      {/* MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">
              Yakin ingin menghapus akun ini?
            </h3>

            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
              >
                Iya
              </button>

              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}