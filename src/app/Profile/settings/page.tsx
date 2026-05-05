'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // FETCH DATA USER
  useEffect(() => {
    fetch('/api/user/profile?userId=1')
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.namaLengkap || '',
          email: data.email || '',
          phone: data.nomorTelepon || '',
          institution: data.institution || '',
        });
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // UPDATE
  const handleSave = async () => {
    try {
      const res = await fetch('/api/user/profile?userId=1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      alert('Pengaturan berhasil disimpan!');
    } catch {
      alert('Gagal menyimpan');
    }
  };

  // DELETE
  const handleDelete = async () => {
    try {
      const res = await fetch('/api/user/profile?userId=1', {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error();

      alert('Akun berhasil dihapus');
      router.push('/login');
    } catch {
      alert('Gagal menghapus akun');
    }
  };

  return (
    <div className="w-full min-h-screen px-10 py-8 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Pengaturan Akun</h1>
        <p className="text-slate-500 mt-2">
          Kelola informasi profil dan preferensi Anda
        </p>
      </div>

      {/* INFORMASI PROFIL */}
      <section className="w-full bg-white rounded-xl border border-slate-200 p-10 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Informasi Profil
        </h2>

        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Ubah Foto Profil
              </button>
              <p className="text-xs text-slate-500 mt-1">
                Format: JPG, PNG. Maks: 5MB
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
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            Simpan Perubahan
          </button>
        </div>
      </section>

      {/* KEAMANAN */}
      <section className="w-full bg-white rounded-xl border border-slate-200 p-10 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Keamanan & Privasi</h2>

        <button
          onClick={() => router.push('/forgot-password')}
          className="w-full border px-4 py-3 rounded-lg text-left hover:bg-slate-50"
        >
          🔐 Ubah Password
        </button>
      </section>

      {/* DANGER ZONE */}
      <section className="w-full bg-red-50 border border-red-200 rounded-xl p-10 shadow-sm">
        <h2 className="text-2xl font-bold text-red-900 mb-6">
          Zona Bahaya
        </h2>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
        >
          🗑️ Hapus Akun
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
                className="flex-1 bg-red-600 text-white py-2 rounded"
              >
                Iya
              </button>

              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-300 py-2 rounded"
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