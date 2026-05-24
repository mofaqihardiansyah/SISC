'use client';

import React, { useState } from 'react';
import { SubmissionForm } from './SubmissionForm';
import { EventList } from './EventList';
import { SubmissionTimeline } from './SubmissionTimeline';

type RegisteredEvent = {
  id: number;
  judul: string;
  penyelenggara: string | null;
  tanggalMulai: Date;
};

type SubmittedPaper = {
  id: number;
  judul: string;
  status: 'review' | 'accepted' | 'rejected' | null;
  komentarPenolakan: string | null;
  dibuatPada: Date | null;
  eventId: number;
  eventJudul: string;
};

type ClientPageProps = {
  initialRegisteredEvents: RegisteredEvent[];
  initialSubmittedPapers: SubmittedPaper[];
};

export default function ClientPage({ initialRegisteredEvents, initialSubmittedPapers }: ClientPageProps) {
  const [view, setView] = useState<'list' | 'submit'>('list');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const selectedEvent = initialRegisteredEvents.find(e => e.id === selectedEventId);

  // Enrich events with submission status
  const eventsWithStatus = initialRegisteredEvents.map(event => {
    const submission = initialSubmittedPapers.find(p => p.eventId === event.id);
    return {
      ...event,
      submissionStatus: submission ? (submission.status || 'review') : 'belum_submit',
    };
  });

  // Filter events
  const filteredEvents = eventsWithStatus.filter(e => {
    const matchesSearch = e.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.penyelenggara && e.penyelenggara.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || e.submissionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStartSubmit = (eventId: number) => {
    setSelectedEventId(eventId);
    setView('submit');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedEventId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto space-y-8 py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Submit Paper
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kirim paper untuk conference yang sudah Anda daftarkan.
          </p>
        </div>

        {view === 'list' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Cari conference atau penyelenggara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-primary/40 transition-colors"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:border-primary/40 transition-colors cursor-pointer sm:w-48"
              >
                <option value="all">Semua Status</option>
                <option value="belum_submit">Belum Submit</option>
                <option value="review">Sedang Direview</option>
                <option value="accepted">Diterima</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>

            {/* Event List Table */}
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Conference Terdaftar</h2>
              <EventList
                events={filteredEvents}
                onStartSubmit={handleStartSubmit}
              />
            </div>

            {/* Submission History */}
            <SubmissionTimeline papers={initialSubmittedPapers} />

            {/* Info Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">Catatan:</span> Setiap paper yang dikirimkan akan melalui proses review. Pastikan file yang diunggah sesuai dengan template yang disediakan. Status paper akan diperbarui secara berkala oleh komite reviewer.
              </p>
            </div>
          </div>
        ) : (
          <SubmissionForm
            selectedEvent={selectedEvent}
            onBack={handleBackToList}
            onSuccess={handleBackToList}
          />
        )}
      </div>
    </div>
  );
}