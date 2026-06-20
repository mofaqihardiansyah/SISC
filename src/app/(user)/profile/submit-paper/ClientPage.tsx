'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { SubmissionForm } from './SubmissionForm';
import { EventList } from './EventList';
import { SubmissionDetail } from './SubmissionDetail';
import { SubmittedPaper } from '@/actions/paper';
import { Select } from '@/components/ui/select'

type RegisteredEvent = {
  id: number;
  judul: string;
  penyelenggara: string | null;
  tanggalMulai: Date;
};

type ClientPageProps = {
  initialRegisteredEvents: RegisteredEvent[];
  initialSubmittedPapers: SubmittedPaper[];
};

export default function ClientPage({ initialRegisteredEvents, initialSubmittedPapers }: ClientPageProps) {
  const searchParams = useSearchParams();
  // Parse query parameters immediately in the component render phase to avoid useEffect cascading renders
  const eventIdParam = searchParams.get('eventId');
  const initialEventId = eventIdParam ? parseInt(eventIdParam) : null;
  const initialEventExists = initialEventId ? initialRegisteredEvents.some(e => e.id === initialEventId) : false;
  
  const initialExistingPaper = initialEventExists ? initialSubmittedPapers.find(p => p.eventId === initialEventId) : undefined;
  const hasValidPaper = initialExistingPaper && initialExistingPaper.status !== 'rejected';

  const [view, setView] = useState<'list' | 'submit' | 'detail'>(
    initialEventExists ? (hasValidPaper ? 'detail' : 'submit') : 'list'
  );
  const [selectedEventId, setSelectedEventId] = useState<number | null>(
    initialEventExists && !hasValidPaper ? initialEventId : null
  );
  const [selectedPaperId, setSelectedPaperId] = useState<number | null>(
    initialEventExists && hasValidPaper && initialExistingPaper ? initialExistingPaper.id : null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const selectedEvent = initialRegisteredEvents.find(e => e.id === selectedEventId);

  // Enrich events with submission status
  const eventsWithStatus = initialRegisteredEvents.map(event => {
    const submission = initialSubmittedPapers.find(p => p.eventId === event.id);
    return {
      ...event,
      submissionStatus: submission ? (submission.status || 'review') : 'belum_submit',
      rejectionReason: submission?.komentarPenolakan || null,
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

  const handleViewDetailByEvent = (eventId: number) => {
    const paper = initialSubmittedPapers.find(p => p.eventId === eventId);
    if (paper) {
      setSelectedPaperId(paper.id);
      setView('detail');
    }
  };



  const handleBackToList = () => {
    setView('list');
    setSelectedEventId(null);
    setSelectedPaperId(null);
  };

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-500">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Submit Paper
        </h1>
        <p className="text-slate-500 mt-2">
          Kirim paper untuk conference yang sudah Anda daftarkan
        </p>
      </div>

        {view === 'list' ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Cari conference atau penyelenggara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 h-10 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-primary/40 transition-colors"
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-[38px] px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:border-primary/40 transition-colors cursor-pointer sm:w-48"
              >
                <option value="all">Semua Status</option>
                <option value="belum_submit">Belum Submit</option>
                <option value="review">Sedang Direview</option>
                <option value="accepted">Diterima</option>
                <option value="rejected">Ditolak</option>
              </Select>
            </div>

            {/* Event List Table */}
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Conference Terdaftar</h2>
              <EventList
                events={filteredEvents}
                onStartSubmit={handleStartSubmit}
                onViewDetail={handleViewDetailByEvent}
              />
            </div>


            {/* Info Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">Catatan:</span> Setiap paper yang dikirimkan akan melalui proses review. Pastikan file yang diunggah sesuai dengan template yang disediakan. Status paper akan diperbarui secara berkala oleh komite reviewer.
              </p>
            </div>
          </div>
        ) : view === 'submit' ? (
          <SubmissionForm
            selectedEvent={selectedEvent}
            onBack={handleBackToList}
            onSuccess={handleBackToList}
          />
        ) : (
          <SubmissionDetail
            paper={initialSubmittedPapers.find(p => p.id === selectedPaperId)}
            onBack={handleBackToList}
          />
        )}
    </div>
  );
}
