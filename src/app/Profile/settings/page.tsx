'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: 'Faqih Ardiansyah',
    email: 'faqih@polines.ac.id',
    phone: '+62 812-3456-7890',
    institution: 'Politeknik Negeri Semarang',
    major: 'Teknik Informatika',
    bio: 'Penggemar event dan networking',
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    publicProfile: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSettingToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    alert('Pengaturan berhasil disimpan!');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Pengaturan Akun</h1>
        <p className="text-slate-500 mt-2">Kelola informasi profil dan preferensi Anda</p>
      </div>

      {/* PROFILE INFORMATION SECTION */}
      <section className="bg-white rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Informasi Profil</h2>

        <div className="space-y-6">
          <div className="flex items-end gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-3xl font-bold">
              FA
            </div>
            <div className="space-y-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                Ubah Foto Profil
              </button>
              <p className="text-xs text-slate-500">Format: JPG, PNG. Ukuran maksimal: 5MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Institusi
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Program Studi
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Simpan Perubahan
          </button>
        </div>
      </section>

      {/* NOTIFICATION PREFERENCES SECTION */}
      <section className="bg-white rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Preferensi Notifikasi</h2>

        <div className="space-y-4">
          {[
            {
              key: 'emailNotifications' as const,
              label: 'Notifikasi Email',
              description: 'Terima notifikasi event dan update melalui email',
            },
            {
              key: 'smsNotifications' as const,
              label: 'Notifikasi SMS',
              description: 'Terima notifikasi penting melalui SMS',
            },
            {
              key: 'pushNotifications' as const,
              label: 'Notifikasi Push',
              description: 'Terima notifikasi push di browser atau aplikasi',
            },
            {
              key: 'publicProfile' as const,
              label: 'Profil Publik',
              description: 'Biarkan pengguna lain melihat profil Anda',
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              <div>
                <p className="font-semibold text-slate-900">{item.label}</p>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
              <button
                onClick={() => handleSettingToggle(item.key)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                  settings[item.key] ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECURITY SECTION */}
      <section className="bg-white rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Keamanan & Privasi</h2>

        <div className="space-y-3">
          <button className="w-full px-4 py-3 border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold rounded-lg transition-colors text-left">
            🔐 Ubah Password
          </button>
          <button className="w-full px-4 py-3 border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold rounded-lg transition-colors text-left">
            🔑 Autentikasi Dua Faktor
          </button>
          <button className="w-full px-4 py-3 border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold rounded-lg transition-colors text-left">
            📱 Kelola Sesi
          </button>
        </div>
      </section>

      {/* DANGER ZONE */}
      <section className="bg-red-50 rounded-xl border border-red-200 p-8">
        <h2 className="text-2xl font-bold text-red-900 mb-6">Zona Bahaya</h2>

        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
            🗑️ Hapus Akun
          </button>
          <p className="text-xs text-red-700">
            Peringatan: Menghapus akun akan menghapus semua data Anda secara permanen dan tidak dapat dipulihkan.
          </p>
        </div>
      </section>
    </div>
  );
}
