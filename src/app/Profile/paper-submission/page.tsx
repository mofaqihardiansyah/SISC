'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

interface Conference {
  id: number;
  judul: string;
  deskripsi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  detailLokasi: string;
  kuota?: number;
  bannerUrl?: string;
  jenisEvent: string;
}

export default function PaperSubmissionPage() {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch conferences from API
    const fetchConferences = async () => {
      try {
        setLoading(true);
        // TODO: Update endpoint sesuai dengan API Anda
        const response = await fetch('/api/events?type=conference');
        if (!response.ok) {
          throw new Error('Failed to fetch conferences');
        }
        const data = await response.json();
        setConferences(data.events || data || []);
      } catch (err) {
        console.error('Error fetching conferences:', err);
        setError('Gagal memuat daftar konferensi');
        // For demo purposes, set dummy data
        setConferences([
          {
            id: 1,
            judul: 'International Conference on Technology 2026',
            deskripsi: 'Konferensi internasional terkemuka dalam bidang teknologi dan inovasi',
            tanggalMulai: '2026-06-15T09:00:00',
            tanggalSelesai: '2026-06-17T17:00:00',
            detailLokasi: 'Auditorium Utama Polines',
            kuota: 500,
            jenisEvent: 'conference',
            bannerUrl: '/images/event1.jpg',
          },
          {
            id: 2,
            judul: 'Digital Transformation Summit 2026',
            deskripsi: 'Summit tentang transformasi digital dalam era modern',
            tanggalMulai: '2026-07-10T08:30:00',
            tanggalSelesai: '2026-07-12T16:30:00',
            detailLokasi: 'Gedung Kerjasama Polines',
            kuota: 300,
            jenisEvent: 'conference',
            bannerUrl: '/images/event2.jpg',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Submit Paper</h1>
          <p className="text-slate-500 mt-2">Pilih konferensi untuk mengunggah paper Anda</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
              <div className="h-8 bg-slate-200 rounded mb-4 w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded mb-4 w-full"></div>
              <div className="h-4 bg-slate-200 rounded mb-4 w-2/3"></div>
              <div className="h-10 bg-slate-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* PAGE TITLE */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Submit Paper</h1>
        <p className="text-slate-500 mt-2">Pilih konferensi untuk mengunggah paper Anda</p>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* CONFERENCES GRID */}
      {conferences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {conferences.map((conference) => (
            <div
              key={conference.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Banner */}
              {conference.bannerUrl && (
                <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-50 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-blue-300" />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{conference.judul}</h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {conference.deskripsi}
                </p>

                {/* Info Grid */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-slate-900 font-semibold">
                        {formatDate(conference.tanggalMulai)}
                      </p>
                      <p className="text-slate-500 text-xs">
                        hingga {formatDate(conference.tanggalSelesai)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-600">{conference.detailLokasi}</p>
                  </div>

                  {conference.kuota && (
                    <div className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-600">
                        Kuota: <span className="font-semibold">{conference.kuota} peserta</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Open Button */}
                <Link
                  href={`/Profile/paper-submission/${conference.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors w-full justify-center"
                >
                  <span>Buka</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada konferensi tersedia</h3>
          <p className="text-slate-600">Konferensi yang menerima submission paper akan ditampilkan di sini</p>
        </div>
      )}
    </div>
  );
}
