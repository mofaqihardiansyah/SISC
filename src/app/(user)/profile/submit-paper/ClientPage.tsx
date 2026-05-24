'use client';

import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, FileText, Building2, ChevronDown, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { SubmissionForm } from './SubmissionForm';
import { EventList } from './EventList';

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
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-[#0E215D] tracking-tight">Submit Paper</h1>
            <p className="text-slate-500 font-medium max-w-2xl">
              Unggah, kelola, dan pantau status publikasi penelitian Anda di berbagai conference.
            </p>
          </div>
        </div>

        {view === 'list' ? (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            
            {/* Mini Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Terdaftar', count: initialRegisteredEvents.length, icon: Building2, color: 'blue', glow: 'bg-blue-500/10' },
                { label: 'Paper Masuk', count: initialSubmittedPapers.length, icon: FileText, color: 'slate', glow: 'bg-slate-500/10' },
                { label: 'Review', count: initialSubmittedPapers.filter((p: SubmittedPaper) => p.status === 'review').length, icon: Clock, color: 'amber', glow: 'bg-amber-500/10' },
                { label: 'Diterima', count: initialSubmittedPapers.filter((p: SubmittedPaper) => p.status === 'accepted').length, icon: CheckCircle, color: 'emerald', glow: 'bg-emerald-500/10' }
              ].map((stat, i) => (
                <div key={i} className="group bg-white border border-slate-200/60 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 relative overflow-hidden">
                  <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.glow} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500`}></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                      <p className="text-3xl font-black text-[#0E215D]">{stat.count}</p>
                    </div>
                    <div className={`
                      ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                      ${stat.color === 'slate' ? 'bg-slate-50 text-slate-600' : ''}
                      ${stat.color === 'amber' ? 'bg-amber-50 text-amber-500' : ''}
                      ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : ''}
                      p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300
                    `}>
                      <stat.icon size={26} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-2 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-2">
              {/* Search Bar */}
              <div className="relative group flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0E215D] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Cari event conference atau penyelenggara..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-transparent outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400" 
                />
              </div>

              {/* Filter Dropdown & Button */}
              <div className="flex gap-2 p-1">
                <div className="relative min-w-[180px]">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none bg-slate-50 text-slate-700 pl-5 pr-12 py-3.5 rounded-[1.25rem] outline-none text-xs font-black uppercase tracking-widest cursor-pointer border border-transparent focus:border-[#0E215D]/20 transition-all"
                  >
                    <option value="all">Semua Status</option>
                    <option value="belum_submit">Belum Submit</option>
                    <option value="review">Review</option>
                    <option value="accepted">Diterima</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
                <button className="bg-[#0E215D] text-white px-8 py-3.5 rounded-[1.25rem] font-black text-xs uppercase tracking-widest shadow-lg shadow-[#0E215D]/20 hover:bg-[#1a3280] hover:-translate-y-0.5 active:scale-95 transition-all whitespace-nowrap">
                  Terapkan
                </button>
              </div>
            </div>

            {/* Modern Grid List (Table Overhaul) */}
            <div className="space-y-6">
              <div className="hidden lg:grid grid-cols-12 gap-6 px-12">
                <div className="col-span-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Informasi Event</div>
                <div className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Penyelenggara</div>
                <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status Paper</div>
                <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Aksi</div>
              </div>

              <EventList 
                events={filteredEvents} 
                onStartSubmit={handleStartSubmit}
              />
            </div>

            {/* Info Helper */}
            <div className="bg-[#0E215D] border border-[#0E215D]/10 p-6 rounded-[2.5rem] flex items-start gap-5 shadow-2xl shadow-[#0E215D]/10 relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10 shrink-0">
                <AlertCircle className="text-white" size={20} />
              </div>
              <div className="relative z-10">
                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1.5">Panduan Pengiriman</h4>
                <p className="text-xs text-blue-100/70 font-medium leading-relaxed max-w-3xl">
                  Pastikan Anda mengirimkan paper sebelum batas waktu yang ditentukan oleh penyelenggara. Paper yang sudah masuk ke tahap <span className="text-white font-black">Review</span> tidak dapat diubah kembali informasinya atau ditarik tanpa persetujuan admin.
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
