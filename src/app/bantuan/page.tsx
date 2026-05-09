'use client';

import React, { useState } from 'react';
import { Star, Plus } from 'lucide-react';

export default function BantuanPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

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
      answer: (
        <>
          Saat melihat event, klik tombol &quot;<Star className="inline w-4 h-4 text-yellow-500 fill-current mb-0.5" /> Favorit&quot; atau ikon bintang di halaman event. Event favorit Anda akan tersimpan dan dapat diakses di menu &quot;Favorit&quot;.
        </>
      ),
    },
    {
      id: 5,
      question: 'Bagaimana cara menghubungi support?',
      answer:
        'Anda dapat menghubungi tim support kami melalui email support@polivents.com atau menggunakan form kontak di bawah. Tim kami akan merespons dalam waktu 24 jam.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{`
        .bantuan-wrapper {
          min-height: 100vh;
          background-color: #f8fafc;
        }
        .bantuan-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }
        .bantuan-header { margin-bottom: 32px; }
        .bantuan-title {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }
        .bantuan-subtitle { font-size: 15px; color: #64748b; }
        .bantuan-search {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          margin-bottom: 32px;
          transition: border 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .bantuan-search:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .section-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 24px;
        }
        .section-card-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        .section-card-title { font-size: 20px; font-weight: 700; color: #0f172a; }
        .faq-item {
          border-bottom: 1px solid #e2e8f0;
          transition: background 0.2s;
        }
        .faq-item:last-child { border-bottom: none; }
        .faq-item:hover { background: #f8fafc; }
        .faq-btn {
          width: 100%;
          padding: 18px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
        }
        .faq-question { font-size: 15px; font-weight: 600; color: #0f172a; }
        .faq-icon { font-size: 22px; color: #64748b; transition: transform 0.2s; flex-shrink: 0; }
        .faq-icon.open { transform: rotate(45deg); }
        .faq-answer { padding: 0 24px 18px; font-size: 14px; color: #475569; line-height: 1.7; }
        .faq-empty { padding: 24px; text-align: center; color: #94a3b8; font-size: 14px; }
        .quick-links-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          padding: 24px;
        }
        .quick-link-item {
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
          display: block;
        }
        .quick-link-item:hover { border-color: #3b82f6; background: #eff6ff; }
        .quick-link-title { font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
        .quick-link-item:hover .quick-link-title { color: #2563eb; }
        .quick-link-desc { font-size: 13px; color: #64748b; }
        .contact-form { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .form-label { display: block; font-size: 13px; font-weight: 600; color: #0f172a; margin-bottom: 6px; }
        .form-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .form-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .form-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          resize: none;
          transition: border 0.2s;
          box-sizing: border-box;
          font-family: inherit;
        }
        .form-textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .btn-kirim {
          width: 100%;
          padding: 12px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-kirim:hover { background: #1d4ed8; }
        .contact-info {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .contact-info-title { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 20px; }
        .contact-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .contact-info-label { font-size: 13px; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
        .contact-info-value { font-size: 14px; color: #2563eb; cursor: pointer; }
        .contact-info-value:hover { text-decoration: underline; }
        .contact-info-value.plain { color: #475569; cursor: default; }
        .contact-info-value.plain:hover { text-decoration: none; }
        @media (max-width: 640px) {
          .quick-links-grid { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
          .contact-info-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="bantuan-wrapper">

        <div className="bantuan-container">
          <div className="bantuan-header">
            <h1 className="bantuan-title">Bantuan & Dukungan</h1>
            <p className="bantuan-subtitle">Temukan jawaban atas pertanyaan Anda</p>
          </div>

          <input
            type="text"
            placeholder="Cari topik bantuan..."
            className="bantuan-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* FAQ */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Pertanyaan yang Sering Diajukan</h2>
            </div>
            <div>
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="faq-item">
                    <button
                      className="faq-btn"
                      onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    >
                      <span className="faq-question">{faq.question}</span>
                      <Plus className={`faq-icon ${openFaq === faq.id ? 'open' : ''}`} />
                    </button>
                    {openFaq === faq.id && (
                      <div className="faq-answer">{faq.answer}</div>
                    )}
                  </div>
                ))
              ) : (
            <div className="faq-empty">Tidak ada hasil untuk &quot;{searchQuery}&quot;</div>
              )}
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="section-card">
            <div className="section-card-header">
              <h2 className="section-card-title">Hubungi Kami</h2>
            </div>
            <div className="contact-form">
              <div className="form-grid">
                <div>
                  <label className="form-label">Nama Anda</label>
                  <input type="text" placeholder="Masukkan nama Anda" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Email Anda</label>
                  <input type="email" placeholder="Masukkan email Anda" className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Subjek</label>
                <select className="form-input">
                  <option>-- Pilih Subjek --</option>
                  <option>Pertanyaan Umum</option>
                  <option>Laporan Bug</option>
                  <option>Saran Fitur</option>
                  <option>Masalah Teknis</option>
                </select>
              </div>
              <div>
                <label className="form-label">Pesan</label>
                <textarea rows={6} placeholder="Tulis pesan Anda di sini..." className="form-textarea" />
              </div>
              <button className="btn-kirim">Kirim Pesan</button>
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="contact-info">
            <h2 className="contact-info-title">Informasi Kontak</h2>
            <div className="contact-info-grid">
              <div>
                <p className="contact-info-label">Email</p>
                <p className="contact-info-value">support@polivents.com</p>
              </div>
              <div>
                <p className="contact-info-label">Nomor Telepon</p>
                <p className="contact-info-value">+62 (024) 8313-8313</p>
              </div>
              <div>
                <p className="contact-info-label">Jam Operasional</p>
                <p className="contact-info-value plain">Senin - Jumat: 09:00 - 17:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
