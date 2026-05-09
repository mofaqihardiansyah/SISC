'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface Conference {
  id: number;
  judul: string;
  deskripsi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  detailLokasi: string;
}

interface SubmissionStatus {
  success?: boolean;
  error?: string;
  message?: string;
}

export default function PaperUploadPage() {
  const params = useParams();
  const router = useRouter();
  const conferenceId = params.conferenceId as string;

  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    judul: '',
    abstrak: '',
    penulis: '',
    email: '',
    file: null as File | null,
  });

  const [fileName, setFileName] = useState('');

  useEffect(() => {
    // Fetch conference details
    const fetchConference = async () => {
      try {
        setLoading(true);
        // TODO: Update endpoint sesuai dengan API Anda
        const response = await fetch(`/api/events/${conferenceId}`);
        if (!response.ok) {
          throw new Error('Conference not found');
        }
        const data = await response.json();
        setConference(data);
      } catch (err) {
        console.error('Error fetching conference:', err);
        // For demo, set dummy data
        setConference({
          id: parseInt(conferenceId),
          judul: 'International Conference on Technology 2026',
          deskripsi: 'Konferensi internasional terkemuka dalam bidang teknologi dan inovasi',
          tanggalMulai: '2026-06-15T09:00:00',
          tanggalSelesai: '2026-06-17T17:00:00',
          detailLokasi: 'Auditorium Utama Polines',
        });
      } finally {
        setLoading(false);
      }
    };

    if (conferenceId) {
      fetchConference();
    }
  }, [conferenceId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setStatus({
          error: 'Format file harus PDF',
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setStatus({
          error: 'Ukuran file maksimal 10MB',
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        file,
      }));
      setFileName(file.name);
      setStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    // Validate form
    if (!formData.judul.trim()) {
      setStatus({ error: 'Judul paper tidak boleh kosong' });
      return;
    }
    if (!formData.abstrak.trim()) {
      setStatus({ error: 'Abstrak tidak boleh kosong' });
      return;
    }
    if (!formData.penulis.trim()) {
      setStatus({ error: 'Nama penulis tidak boleh kosong' });
      return;
    }
    if (!formData.email.trim()) {
      setStatus({ error: 'Email tidak boleh kosong' });
      return;
    }
    if (!formData.file) {
      setStatus({ error: 'File paper harus diunggah' });
      return;
    }

    try {
      setSubmitting(true);

      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.file);
      uploadFormData.append('judul', formData.judul);
      uploadFormData.append('abstrak', formData.abstrak);
      uploadFormData.append('penulis', formData.penulis);
      uploadFormData.append('email', formData.email);
      uploadFormData.append('eventId', conferenceId);

      // TODO: Update endpoint sesuai dengan API Anda
      const response = await fetch('/api/paper-submission', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Gagal mengunggah paper');
      }

      const result = await response.json();
      setStatus({
        success: true,
        message: 'Paper berhasil disubmit! Tim reviewer akan mengevaluasi paper Anda.',
      });

      // Reset form after successful submission
      setFormData({
        judul: '',
        abstrak: '',
        penulis: '',
        email: '',
        file: null,
      });
      setFileName('');

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/Profile/paper-submission');
      }, 2000);
    } catch (err) {
      console.error('Error submitting paper:', err);
      setStatus({
        error: err instanceof Error ? err.message : 'Terjadi kesalahan saat mengunggah paper',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Link
          href="/Profile/paper-submission"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
        <div className="bg-white rounded-xl border border-slate-200 p-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded mb-4 w-full"></div>
        </div>
      </div>
    );
  }

  if (!conference) {
    return (
      <div className="space-y-8">
        <Link
          href="/Profile/paper-submission"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          Konferensi tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* BACK BUTTON */}
      <Link
        href="/Profile/paper-submission"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar konferensi
      </Link>

      {/* CONFERENCE INFO */}
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{conference.judul}</h1>
        <p className="text-slate-600 mb-6">{conference.deskripsi}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-slate-500 font-semibold uppercase mb-1">Tanggal Mulai</p>
            <p className="text-lg font-semibold text-slate-900">
              {new Date(conference.tanggalMulai).toLocaleDateString('id-ID')}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold uppercase mb-1">Tanggal Selesai</p>
            <p className="text-lg font-semibold text-slate-900">
              {new Date(conference.tanggalSelesai).toLocaleDateString('id-ID')}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold uppercase mb-1">Lokasi</p>
            <p className="text-lg font-semibold text-slate-900">{conference.detailLokasi}</p>
          </div>
        </div>
      </div>

      {/* UPLOAD FORM */}
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Upload Paper</h2>

        {/* SUCCESS MESSAGE */}
        {status?.success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-700 font-semibold">Berhasil!</p>
              <p className="text-green-600 text-sm mt-1">{status.message}</p>
            </div>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {status?.error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{status.error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* JUDUL */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Judul Paper <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleInputChange}
              placeholder="Masukkan judul paper Anda"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
            />
          </div>

          {/* ABSTRAK */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Abstrak <span className="text-red-600">*</span>
            </label>
            <textarea
              name="abstrak"
              value={formData.abstrak}
              onChange={handleInputChange}
              placeholder="Masukkan abstrak paper Anda (minimal 100 kata)"
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
            />
            <p className="text-xs text-slate-500 mt-1">
              Karakter: {formData.abstrak.length}
            </p>
          </div>

          {/* PENULIS */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Nama Penulis <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="penulis"
              value={formData.penulis}
              onChange={handleInputChange}
              placeholder="Masukkan nama penulis utama"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Masukkan email Anda"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
            />
          </div>

          {/* FILE UPLOAD */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Upload File Paper (PDF) <span className="text-red-600">*</span>
            </label>

            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={submitting}
              />
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-900 font-semibold mb-1">
                  {fileName ? `File dipilih: ${fileName}` : 'Klik atau drag file PDF di sini'}
                </p>
                <p className="text-xs text-slate-500">
                  Format: PDF | Ukuran maksimal: 10MB
                </p>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={submitting || !formData.file}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Mengunggah...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Kirim Paper
              </>
            )}
          </button>
        </form>
      </div>

      {/* GUIDELINES */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-slate-900 mb-3">Panduan Submission</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>✓ Paper harus berformat PDF</li>
          <li>✓ Ukuran file maksimal 10MB</li>
          <li>✓ Pastikan semua data terisi dengan benar</li>
          <li>✓ Tim reviewer akan memberikan feedback dalam 2-3 minggu</li>
          <li>✓ Anda akan menerima notifikasi tentang status paper Anda</li>
        </ul>
      </div>
    </div>
  );
}
