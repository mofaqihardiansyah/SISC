'use client';

import React, { useState } from 'react';
import { UploadCloud, X, CheckCircle, Clock, AlertCircle, FileText, Send, Building2, ChevronRight, ChevronDown, Search } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { submitNewPaper } from '@/actions/paper';
import { toast } from 'react-hot-toast';

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
  
  // Form States
  const [paperTitle, setPaperTitle] = useState('');
  const [authors, setAuthors] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const selectedEvent = initialRegisteredEvents.find(e => e.id === selectedEventId);

  // Enrich data with submission status
  const eventsWithStatus = initialRegisteredEvents.map(event => {
    const submission = initialSubmittedPapers.find(p => p.eventJudul === event.judul);
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

  const handleAddAuthor = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (authorInput.trim() && !authors.includes(authorInput.trim())) {
        setAuthors([...authors, authorInput.trim()]);
        setAuthorInput('');
      }
    }
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) return toast.error('File maksimal 10MB');
      setFile(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !paperTitle || authors.length === 0 || !file) {
      return toast.error('Harap lengkapi semua form dan upload dokumen!');
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      // Simulasi progress bar UI 90% (Estetika)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 15));
      }, 300);

      // Proses Upload File
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'paper');

      const resUpload = await fetch('/api/upload', { method: 'POST', body: formData });
      const dataUpload = await resUpload.json();
      clearInterval(progressInterval);

      if (!resUpload.ok) throw new Error(dataUpload.error || 'Gagal upload file');
      
      setUploadProgress(100);

      // Proses Simpan ke Database
      await submitNewPaper({
        eventId: Number(selectedEventId),
        judul: paperTitle,
        penulis: authors.join(', '),
        fileUrl: dataUpload.url,
      });

      toast.success('Paper berhasil disubmit!');
      // Reset Form & Back to List
      setView('list');
      setSelectedEventId(null); setPaperTitle(''); setAuthors([]); setFile(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Terjadi kesalahan yang tidak diketahui');
      }
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
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

                <div className="space-y-4">
                  {filteredEvents.length === 0 ? (
                    <div className="bg-white border border-slate-200/60 rounded-[3rem] p-32 text-center shadow-sm">
                      <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-inner">
                        <Search className="text-slate-300" size={40} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Data Tidak Ditemukan</h3>
                      <p className="text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                        Kami tidak dapat menemukan conference yang sesuai dengan filter atau pencarian Anda.
                      </p>
                    </div>
                  ) : (
                    filteredEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className="bg-white border border-slate-200/60 hover:border-[#0E215D]/20 rounded-[2.5rem] p-5 lg:p-8 transition-all duration-300 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 group relative"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
                          {/* Info Column */}
                          <div className="lg:col-span-5 flex items-center gap-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#0E215D] group-hover:rotate-6 transition-all duration-500 shadow-inner">
                              <Building2 className="text-slate-400 group-hover:text-white transition-colors" size={28} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-blue-100/50">Conference</span>
                                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
                                  <Clock size={12} className="text-slate-300" /> 
                                  {format(new Date(event.tanggalMulai), 'dd MMM yyyy', { locale: id })}
                                </span>
                              </div>
                              <h4 className="font-black text-slate-900 group-hover:text-[#0E215D] transition-colors truncate text-lg leading-tight">{event.judul}</h4>
                            </div>
                          </div>

                          {/* Penyelenggara */}
                          <div className="hidden lg:flex lg:col-span-3 items-center justify-center">
                            <div className="text-center bg-slate-50/50 px-6 py-3 rounded-2xl border border-slate-100 w-full group-hover:bg-white transition-colors">
                              <p className="text-sm font-black text-slate-700 truncate">{event.penyelenggara || 'Institusi Polines'}</p>
                              <p className="text-[10px] text-[#0E215D] font-bold mt-0.5 opacity-60">Penyelenggara Utama</p>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="lg:col-span-2 flex justify-center">
                            {event.submissionStatus === 'belum_submit' ? (
                              <div className="px-5 py-2.5 bg-slate-50 text-slate-400 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-slate-100 shadow-sm">Belum Ada Paper</div>
                            ) : event.submissionStatus === 'review' ? (
                              <div className="px-5 py-2.5 bg-blue-50 text-[#0E215D] rounded-2xl text-[9px] font-black uppercase tracking-widest border border-blue-200/50 flex items-center gap-2 shadow-sm">
                                <span className="w-1.5 h-1.5 bg-[#0E215D] rounded-full animate-ping"></span> Sedang Review
                              </div>
                            ) : event.submissionStatus === 'accepted' ? (
                              <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-emerald-200/50 flex items-center gap-2 shadow-sm">
                                <CheckCircle size={14} strokeWidth={3} /> Diterima
                              </div>
                            ) : (
                              <div className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-rose-200/50 flex items-center gap-2 shadow-sm">
                                <AlertCircle size={14} strokeWidth={3} /> Ditolak
                              </div>
                            )}
                          </div>

                          {/* Action */}
                          <div className="lg:col-span-2 flex justify-end">
                            {event.submissionStatus === 'belum_submit' || event.submissionStatus === 'rejected' ? (
                              <button 
                                onClick={() => handleStartSubmit(event.id)}
                                className="w-full lg:w-auto px-10 py-4 bg-[#0E215D] text-white rounded-[1.25rem] text-[10px] font-black tracking-widest uppercase transition-all shadow-xl shadow-[#0E215D]/20 active:scale-95 flex items-center justify-center gap-2 hover:bg-[#1a3280] hover:shadow-2xl hover:shadow-[#0E215D]/30"
                              >
                                {event.submissionStatus === 'rejected' ? 'Submit Ulang' : 'Submit Sekarang'} <ChevronRight size={14} strokeWidth={3} />
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50/50 px-8 py-4 rounded-[1.25rem] border border-emerald-100 cursor-default shadow-sm">
                                <CheckCircle size={14} strokeWidth={3} /> Terkirim
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
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
            /* ========================================== */
            /* TAMPILAN 2: FORM SUBMISSION (DEDICATED)   */
            /* ========================================== */
            <section className="animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Back Navigation */}
              <button 
                onClick={handleBackToList}
                className="flex items-center gap-3 text-xs font-black text-slate-400 hover:text-[#0E215D] transition-all mb-8 group uppercase tracking-widest"
              >
                <div className="bg-white w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center group-hover:border-[#0E215D]/30 group-hover:bg-slate-50 shadow-sm transition-all">
                  <X size={18} />
                </div>
                Kembali ke Daftar
              </button>

              {/* Info Event Terpilih */}
              <div className="bg-[#0E215D] text-white p-8 md:p-12 rounded-t-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/5 rounded-full blur-[80px]"></div>
                <div className="absolute left-1/4 -bottom-12 w-48 h-48 bg-blue-400/10 rounded-full blur-[60px]"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="bg-white/10 p-5 rounded-[1.5rem] backdrop-blur-xl border border-white/10 shadow-inner">
                      <FileText size={32} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-400/20 text-blue-100 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border border-white/10">Registration Ready</span>
                      </div>
                      <p className="text-blue-100/60 text-[10px] font-black uppercase tracking-widest mb-1">Pengiriman Paper Untuk:</p>
                      <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight max-w-2xl">{selectedEvent?.judul}</h2>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="bg-white border-x border-b border-slate-200 rounded-b-3xl shadow-sm p-6 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Form fields remain the same as previous implementation */}
                  <div className="grid grid-cols-1 gap-10">
                    <div>
                      <label className="flex items-center gap-3 text-xs font-black text-slate-800 uppercase tracking-widest mb-4">
                        <span className="w-1.5 h-4 bg-[#0E215D] rounded-full"></span>
                        Judul Penelitian <span className="text-rose-500">*</span>
                      </label>
                      <textarea 
                        required 
                        rows={4}
                        value={paperTitle} 
                        onChange={(e) => setPaperTitle(e.target.value)} 
                        placeholder="Masukkan judul penelitian lengkap sesuai dengan dokumen yang diunggah..." 
                        className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-[#0E215D]/5 focus:border-[#0E215D] focus:bg-white outline-none text-sm font-semibold text-slate-700 transition-all shadow-sm placeholder:text-slate-300" 
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-3 text-xs font-black text-slate-800 uppercase tracking-widest mb-4">
                        <span className="w-1.5 h-4 bg-[#0E215D] rounded-full"></span>
                        Daftar Penulis <span className="text-rose-500">*</span>
                      </label>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-3 p-4 border border-slate-200 rounded-[1.5rem] bg-slate-50 focus-within:ring-4 focus-within:ring-[#0E215D]/5 focus-within:border-[#0E215D] focus-within:bg-white transition-all shadow-sm">
                          {authors.map((author, idx) => (
                            <span key={idx} className="bg-[#0E215D] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-3 shadow-lg shadow-[#0E215D]/20 animate-in zoom-in-95 duration-200">
                              {author} 
                              <button type="button" onClick={() => removeAuthor(idx)} className="text-blue-300 hover:text-white transition-colors">
                                <X size={14} strokeWidth={3} />
                              </button>
                            </span>
                          ))}
                          <input 
                            type="text" 
                            placeholder={authors.length === 0 ? "Ketik nama penulis lalu tekan Enter..." : "Tambah penulis..."} 
                            className="flex-1 outline-none text-sm font-semibold text-slate-700 p-2 bg-transparent min-w-[250px] placeholder:text-slate-300" 
                            value={authorInput} 
                            onChange={e => setAuthorInput(e.target.value)} 
                            onKeyDown={handleAddAuthor} 
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold italic ml-1">Tips: Tekan Enter atau Koma untuk memisahkan nama penulis.</p>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-3 text-xs font-black text-slate-800 uppercase tracking-widest mb-4">
                        <span className="w-1.5 h-4 bg-[#0E215D] rounded-full"></span>
                        Dokumen Full Paper <span className="text-rose-500">*</span>
                      </label>
                      <div className={`relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-500 ${file ? 'border-[#0E215D]/20 bg-blue-50/30' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-[#0E215D]/20'}`}>
                        {!file ? (
                          <div className="space-y-6">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                              <UploadCloud className="text-[#0E215D]" size={36} />
                            </div>
                            <div className="space-y-1">
                              <p className="text-lg font-black text-slate-800 tracking-tight">Tarik & Lepas File Paper</p>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Mendukung PDF atau DOCX (Maks. 10MB)</p>
                            </div>
                            <label className="inline-block bg-[#0E215D] text-white px-10 py-4 rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.2em] cursor-pointer hover:bg-[#1a3280] transition-all shadow-xl shadow-[#0E215D]/20 active:scale-95">
                              Cari Berkas <input type="file" className="hidden" accept=".pdf,.docx,.doc" onChange={handleFileChange} />
                            </label>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xl w-full max-w-md relative overflow-hidden group">
                              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0E215D]"></div>
                              <div className="bg-slate-50 p-3.5 rounded-xl"><FileText className="text-[#0E215D]" size={28} /></div>
                              <div className="text-left flex-1 overflow-hidden">
                                <p className="text-sm font-black text-slate-900 truncate">{file.name}</p>
                                <p className="text-[10px] font-bold text-[#0E215D]/60 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB • READY TO UPLOAD</p>
                              </div>
                              <button type="button" onClick={() => setFile(null)} className="p-2.5 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"><X size={18} /></button>
                            </div>
                            
                            {uploading && (
                              <div className="w-full max-w-md mt-8 space-y-2">
                                <div className="flex justify-between text-[10px] font-black text-[#0E215D] uppercase tracking-widest">
                                  <span>Mengunggah Berkas...</span> <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                                  <div className="bg-[#0E215D] h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(14,33,93,0.4)]" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button type="submit" disabled={uploading} className="group w-full flex items-center justify-center gap-4 bg-[#0E215D] hover:bg-[#0a1845] text-white py-6 rounded-[1.5rem] font-black text-sm transition-all shadow-2xl shadow-blue-900/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.3em]">
                      {uploading ? <>Sedang Memproses...</> : <><Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Kirim Paper Sekarang</>}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-8 font-black uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto">
                      Pastikan data sudah benar. Paper yang disubmit akan melalui proses review oleh tim ahli.
                    </p>
                  </div>
                </form>
              </div>
            </section>
          )}
      </div>
    </div>
  );
}
