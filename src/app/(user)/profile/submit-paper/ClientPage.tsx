'use client';

import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, FileText, Building2, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
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
  // Navigation & View States
  const [view, setView] = useState<'list' | 'submit'>('list');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const selectedEvent = initialRegisteredEvents.find(e => e.id === selectedEventId);

  // Enrich data with submission status
  const eventsWithStatus = initialRegisteredEvents.map(event => {
    const submission = initialSubmittedPapers.find(p => p.eventId === event.id);
    return {
      ...event,
      submissionStatus: submission ? (submission.status || 'review') : 'belum_submit',
    };
  });

  // Filtered Events Logic
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
      <div className="max-w-7xl mx-auto space-y-10 py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Submit Paper
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
            Kelola pengiriman paper Anda dengan sistem yang terintegrasi dan transparan.
          </p>
        </div>

        {view === 'list' ? (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
            
            {/* Table Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="relative group w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Cari conference atau penyelenggara..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-primary/30 transition-all" 
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="hidden sm:block text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 text-right">Filter Status:</span>
                <div className="relative flex-1 md:w-40">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-600 pl-4 pr-10 py-2 rounded-lg outline-none text-[10px] font-bold uppercase tracking-widest cursor-pointer focus:bg-white focus:border-primary/30 transition-all"
                  >
                    <option value="all">Semua Status</option>
                    <option value="belum_submit">Available</option>
                    <option value="review">In Review</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                </div>
              </div>
            </div>

            {/* Main Table Content */}
            <div className="space-y-4">
              <EventList 
                events={filteredEvents} 
                onStartSubmit={handleStartSubmit}
              />
            </div>

            {/* Submission History Section */}
            <SubmissionTimeline papers={initialSubmittedPapers} />

            {/* Info Helper Minimalist */}
            <div className="bg-slate-900 p-8 rounded-2xl flex items-start gap-6 relative overflow-hidden group">
              <div className="absolute right-0 bottom-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-20 -mb-20 group-hover:scale-110 transition-transform duration-1000"></div>
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/5 shrink-0">
                <AlertCircle className="text-primary-foreground" size={20} />
              </div>
              <div className="relative z-10">
                <h4 className="text-sm font-bold text-white mb-2">Penting untuk Diketahui</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-4xl">
                  Setiap paper yang dikirimkan akan melalui proses review anonim. Pastikan file yang Anda unggah sesuai dengan <span className="text-white underline underline-offset-4 decoration-primary/50">template yang disediakan</span>. Status paper akan diperbarui secara berkala oleh komite reviewer.
                </p>
              </div>
            </div>
          </section>
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
