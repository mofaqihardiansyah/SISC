'use client';

import React, { useState } from 'react';
import { Star, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { ERROR_MESSAGES, SITE } from '@/lib/constants';
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function HelpClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    subjek: '',
    pesan: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      id: 1,
      question: 'Bagaimana cara mendaftar event?',
      answer: 'Untuk mendaftar event, navigasi ke halaman event yang ingin Anda ikuti, kemudian klik tombol "Daftar". Ikuti instruksi pendaftaran dan Anda akan mendapatkan notifikasi persetujuan di halaman profil Anda.',
    },
    {
      id: 2,
      question: 'Bagaimana cara mengunggah bukti pembayaran?',
      answer: 'Setelah Anda disetujui untuk mengikuti event, masuk ke profil Anda lalu pilih menu "Riwayat Pendaftaran". Di sana akan ada opsi untuk mengunggah bukti pembayaran Anda untuk diverifikasi oleh penyelenggara.',
    },
    {
      id: 3,
      question: 'Bagaimana cara membatalkan pendaftaran?',
      answer: 'Anda dapat membatalkan pendaftaran melalui profil Anda. Pilih event yang ingin dibatalkan di "Riwayat Pendaftaran", kemudian klik "Batalkan Pendaftaran". Pembatalan hanya dapat dilakukan sebelum Anda melakukan pembayaran atau sebelum status pendaftaran final.',
    },
    {
      id: 4,
      question: 'Bagaimana cara mengubah informasi profil?',
      answer: 'Kunjungi halaman "Pengaturan Akun" di menu profil. Di sana Anda dapat mengubah nama, email, nomor telepon, institusi, dan informasi lainnya. Jangan lupa klik "Simpan Perubahan".',
    },
    {
      id: 5,
      question: 'Bagaimana cara menambahkan event ke favorit?',
      answer: (
        <>
          Saat melihat event, klik tombol &quot;<Star className="inline w-4 h-4 text-yellow-500 fill-current mb-0.5" /> Favorit&quot; atau ikon bintang di halaman event. Event favorit Anda akan tersimpan dan dapat diakses di menu &quot;Favorit&quot;.
        </>
      ),
    },
    {
      id: 6,
      question: 'Bagaimana saya tahu pembayaran saya sudah diverifikasi?',
      answer: 'Setelah Anda mengunggah bukti pembayaran, penyelenggara akan memeriksanya secara manual. Anda bisa mengecek status verifikasi secara berkala di halaman "Riwayat Pendaftaran" pada profil Anda.',
    },
    {
      id: 7,
      question: 'Apakah saya bisa mengajukan refund?',
      answer: 'Ketentuan refund bergantung pada masing-masing penyelenggara. Silakan hubungi support lewat formulir "Laporan Bug" dengan subjek "Lainnya/Refund" dan sebutkan judul event yang diikuti.',
    },
    {
      id: 8,
      question: 'Bagaimana cara mengirimkan/submit paper?',
      answer: 'Jika event yang Anda ikuti membutuhkan submission paper, masuk ke menu profil Anda dan cari opsi "Kirim Paper Baru". Isi detail form metadata, kata kunci, daftar penulis, dan unggah file PDF paper Anda sesuai panduan.',
    },
    {
      id: 9,
      question: 'Bagaimana cara menghubungi support?',
      answer: 'Anda dapat menghubungi tim support kami melalui form kontak di bawah. Tim kami akan merespons dalam waktu 24 jam ke email resmi kami.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.email || !formData.subjek || !formData.pesan) {
      toast.error(ERROR_MESSAGES.FORM_REQUIRED);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await res.json();
      if (res.ok) {
        toast.success("Pesan berhasil dikirim!");
        setFormData({ nama: '', email: '', subjek: '', pesan: '' });
      } else {
        toast.error(result.error || "Gagal mengirim pesan");
      }
    } catch (error) {
      console.error(error);
      toast.error(ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-500 p-6 md:p-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bantuan & Dukungan</h1>
        <p className="text-slate-500 mt-2">Temukan jawaban atas pertanyaan Anda</p>
      </div>

      {/* FAQ SECTION */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Pertanyaan yang Sering Diajukan</h2>
        </div>

        <div className="divide-y divide-slate-200">
          {faqs.map((faq) => (
            <div key={faq.id} className="hover:bg-slate-50 transition-colors">
              <button
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50"
              >
                <span className="font-semibold text-slate-900">{faq.question}</span>
                <Plus
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    openFaq === faq.id ? 'rotate-45 text-blue-600' : ''
                  }`}
                />
              </button>
              {openFaq === faq.id && (
                <div className="px-6 pb-6">
                  <p className="text-slate-600 leading-relaxed text-sm">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Kirim Laporan / Pesan</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Anda</label>
              <Input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                placeholder="Nama Anda"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Anda</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Email Anda"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Subjek</label>
            <Select 
              value={formData.subjek}
              onChange={(e) => setFormData({...formData, subjek: e.target.value})}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">-- Pilih Subjek --</option>
              <option value="Pertanyaan Umum">Pertanyaan Umum</option>
              <option value="Laporan Bug">Laporan Bug</option>
              <option value="Saran Fitur">Saran Fitur</option>
              <option value="Masalah Teknis">Masalah Teknis</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Pesan</label>
            <Textarea
              rows={6}
              value={formData.pesan}
              onChange={(e) => setFormData({...formData, pesan: e.target.value})}
              placeholder="Pesan Anda..."
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
          </button>
        </form>
      </section>

      {/* CONTACT INFO */}
      <section className="bg-slate-900 rounded-xl border border-slate-800 p-8 shadow-xs">
        <h2 className="text-xl font-bold text-white mb-6">Informasi Kontak Lainnya</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="font-semibold text-slate-400 mb-1">Email Dukungan</p>
            <p className="text-blue-400 font-medium">{SITE.CONTACT_EMAIL}</p>
          </div>

          <div>
            <p className="font-semibold text-slate-400 mb-1">Nomor Telepon</p>
            <p className="text-slate-300">{SITE.CONTACT_WHATSAPP_DISPLAY}</p>
          </div>

          <div>
            <p className="font-semibold text-slate-400 mb-1">Jam Operasional</p>
            <p className="text-slate-300">{SITE.OPERATIONAL_HOURS}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
