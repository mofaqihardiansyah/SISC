'use client';

import React, { useState } from 'react';

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      id: 1,
      question: 'Bagaimana cara mendaftar event?',
      answer:
        'Untuk mendaftar event, navigasi ke halaman event yang ingin Anda ikuti, kemudian klik tombol "Daftar" atau "Beli Tiket". Ikuti proses pembayaran (jika ada) dan Anda akan menerima tiket melalui email.',
    },
    {
      id: 2,
      question: 'Bagaimana cara membatalkan pendaftaran?',
      answer:
        'Anda dapat membatalkan pendaftaran melalui menu "Tiket Saya". Pilih event yang ingin dibatalkan, kemudian klik "Batalkan Pendaftaran". Pembatalan hanya dapat dilakukan sebelum event dimulai.',
    },
    {
      id: 3,
      question: 'Bagaimana cara mengubah informasi profil?',
      answer:
        'Kunjungi halaman "Pengaturan Akun" di menu profil. Di sana Anda dapat mengubah nama, email, nomor telepon, institusi, dan informasi lainnya. Jangan lupa klik "Simpan Perubahan".',
    },
    {
      id: 4,
      question: 'Bagaimana cara menambahkan event ke favorit?',
      answer:
        'Saat melihat event, klik tombol "Favorit" atau ikon bintang di halaman event. Event favorit Anda akan tersimpan dan dapat diakses di menu "Favorit".',
    },
    {
      id: 5,
      question: 'Bagaimana cara menghubungi support?',
      answer:
        'Anda dapat menghubungi tim support kami melalui email support@polivents.com atau menggunakan form kontak di bawah. Tim kami akan merespons dalam waktu 24 jam.',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bantuan & Dukungan</h1>
        <p className="text-slate-500 mt-2">Temukan jawaban atas pertanyaan Anda</p>
      </div>

      {/* SEARCH */}
      <div>
        <input
          type="text"
          placeholder="Cari topik bantuan..."
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* FAQ SECTION */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-900">Pertanyaan yang Sering Diajukan</h2>
        </div>

        <div className="divide-y divide-slate-200">
          {faqs.map((faq) => (
            <div key={faq.id} className="hover:bg-slate-50 transition">
              <button
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50"
              >
                <span className="font-semibold text-slate-900">{faq.question}</span>
                <span
                  className={`text-2xl transition-transform ${
                    openFaq === faq.id ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
              {openFaq === faq.id && (
                <div className="px-6 pb-6">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="bg-white rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Hubungi Kami</h2>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Nama Anda
              </label>
              <input
                type="text"
                placeholder="Masukkan nama Anda"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Email Anda
              </label>
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Subjek
            </label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>-- Pilih Subjek --</option>
              <option>Pertanyaan Umum</option>
              <option>Laporan Bug</option>
              <option>Saran Fitur</option>
              <option>Masalah Teknis</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Pesan
            </label>
            <textarea
              rows={6}
              placeholder="Tulis pesan Anda di sini..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Kirim Pesan
          </button>
        </form>
      </section>

      {/* CONTACT INFO */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Informasi Kontak</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="font-semibold text-slate-900">Email</p>
            <p className="text-blue-600 hover:underline cursor-pointer">support@polivents.com</p>
          </div>

          <div>
            <p className="font-semibold text-slate-900">Nomor Telepon</p>
            <p className="text-blue-600 hover:underline cursor-pointer">+62 (024) 8313-8313</p>
          </div>

          <div>
            <p className="font-semibold text-slate-900">Jam Operasional</p>
            <p className="text-slate-600">Senin - Jumat: 09:00 - 17:00</p>
          </div>
        </div>
      </section>
    </div>
  );
}
