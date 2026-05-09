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
  status: string | null;
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
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0E215D]">Submit Paper</h1>
          <p className="text-slate-600 mt-2">Unggah, kelola, dan pantau status publikasi penelitian Anda di berbagai conference.</p>
        </div>

        {view === 'list' ? (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            
            {/* Mini Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Terdaftar</p>
                  <p className="text-2xl font-black text-[#0E215D]">{initialRegisteredEvents.length}</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><Building2 size={24} /></div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Paper Masuk</p>
                  <p className="text-2xl font-black text-[#0E215D]">{initialSubmittedPapers.length}</p>
                </div>
                <div className="bg-slate-50 text-slate-600 p-3 rounded-xl"><FileText size={24} /></div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Review</p>
                  <p className="text-2xl font-black text-[#0E215D]">{initialSubmittedPapers.filter((p: SubmittedPaper) => p.status === 'review').length}</p>
                </div>
                <div className="bg-amber-50 text-amber-500 p-3 rounded-xl"><Clock size={24} /></div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Diterima</p>
                  <p className="text-2xl font-black text-[#0E215D]">{initialSubmittedPapers.filter((p: SubmittedPaper) => p.status === 'accepted').length}</p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl"><CheckCircle size={24} /></div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative group flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0E215D] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Cari event conference..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium focus:border-[#0E215D] focus:ring-4 focus:ring-[#0E215D]/10 transition-all shadow-sm" 
                />
              </div>

              {/* Filter Dropdown & Button */}
              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-56 group">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-700 pl-4 pr-10 py-3.5 rounded-xl outline-none text-sm font-bold cursor-pointer focus:border-[#0E215D] focus:ring-4 focus:ring-[#0E215D]/10 transition-all shadow-sm"
                  >
                    <option value="all">Semua Status</option>
                    <option value="belum_submit">Belum Submit</option>
                    <option value="review">Sedang Review</option>
                    <option value="accepted">Diterima</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
                <button className="bg-[#0E215D] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm hover:bg-[#1a3280] active:scale-95 transition-all whitespace-nowrap flex items-center gap-2">
                  Terapkan
                </button>
              </div>
            </div>

            {/* Modern Grid List (Table Overhaul) */}
              <div className="space-y-4">
                <div className="hidden lg:grid grid-cols-12 gap-4 px-10 py-4">
                  <div className="col-span-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Informasi Event</div>
                  <div className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Penyelenggara</div>
                  <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Paper</div>
                  <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Navigasi</div>
                </div>

                <div className="space-y-4">
                  {filteredEvents.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-[3rem] p-24 text-center">
                      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="text-slate-200" size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">Tidak Ada Data</h3>
                      <p className="text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">Kami tidak dapat menemukan conference yang cocok dengan filter atau pencarian Anda saat ini.</p>
                    </div>
                  ) : (
                    filteredEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className="bg-white border border-slate-100 hover:border-[#0E215D]/20 rounded-[2.5rem] p-4 lg:p-6 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 group"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6">
                          {/* Info Column */}
                          <div className="lg:col-span-5 flex items-center gap-5">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#0E215D]/5 transition-colors">
                              <Building2 className="text-slate-300 group-hover:text-[#0E215D] transition-colors" size={24} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <h4 className="font-black text-slate-900 group-hover:text-[#0E215D] transition-colors truncate text-base md:text-lg">{event.judul}</h4>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg uppercase tracking-wider">Conference</span>
                                <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                                  <Clock size={14} className="text-slate-300" /> 
                                  {format(new Date(event.tanggalMulai), 'dd MMM yyyy', { locale: id })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Penyelenggara */}
                          <div className="hidden lg:flex lg:col-span-3 items-center justify-center">
                            <div className="text-center">
                              <p className="text-sm font-bold text-slate-600">{event.penyelenggara || 'Institusi Polines'}</p>
                              <p className="text-[10px] text-slate-400 font-medium mt-1 italic">Penyelenggara Resmi</p>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="lg:col-span-2 flex justify-center">
                            {event.submissionStatus === 'belum_submit' ? (
                              <div className="px-5 py-2.5 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100">Belum Ada Paper</div>
                            ) : event.submissionStatus === 'review' ? (
                              <div className="px-5 py-2.5 bg-blue-50 text-[#0E215D] rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[#0E215D] rounded-full animate-pulse"></span> Sedang Review
                              </div>
                            ) : event.submissionStatus === 'accepted' ? (
                              <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                                <CheckCircle size={14} /> Diterima
                              </div>
                            ) : (
                              <div className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100 flex items-center gap-2">
                                <AlertCircle size={14} /> Ditolak
                              </div>
                            )}
                          </div>

                          {/* Action */}
                          <div className="lg:col-span-2 flex justify-end">
                            {event.submissionStatus === 'belum_submit' || event.submissionStatus === 'rejected' ? (
                              <button 
                                onClick={() => handleStartSubmit(event.id)}
                                className="w-full lg:w-auto px-8 py-3.5 bg-[#0E215D] text-white rounded-2xl text-xs font-black tracking-widest uppercase transition-all shadow-xl shadow-[#0E215D]/20 active:scale-95 flex items-center justify-center gap-2 hover:bg-[#1a3280]"
                              >
                                {event.submissionStatus === 'rejected' ? 'Re-Submit' : 'Submit'} <ChevronRight size={16} />
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-widest bg-slate-50 px-6 py-3.5 rounded-2xl border border-slate-100 cursor-default">
                                <CheckCircle size={16} /> Terkirim
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
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-4">
                <div className="bg-white p-2 rounded-lg shadow-sm"><Clock className="text-[#0E215D]" size={18} /></div>
                <div>
                  <h4 className="text-sm font-bold text-[#0E215D]">Catatan Penting</h4>
                  <p className="text-xs text-[#0E215D]/70 mt-0.5 leading-relaxed">
                    Pastikan Anda mengirimkan paper sebelum batas waktu (Deadline) yang ditentukan. Paper yang sudah masuk tahap review tidak dapat diubah kembali informasinya.
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
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0E215D] transition-colors mb-6 group"
              >
                <div className="bg-white w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-[#0E215D]/30 shadow-sm transition-all">
                  <X size={16} />
                </div>
                Kembali ke Daftar Conference
              </button>

              {/* Info Event Terpilih */}
              <div className="bg-[#0E215D] text-white p-6 rounded-t-3xl shadow-lg relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/20">
                      <FileText size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-1">Anda mengirimkan paper untuk:</p>
                      <h2 className="text-xl font-extrabold leading-tight">{selectedEvent?.judul}</h2>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="bg-white border-x border-b border-slate-200 rounded-b-3xl shadow-sm p-6 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Form fields remain the same as previous implementation */}
                  <div className="grid grid-cols-1 gap-8">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                        <span className="w-1.5 h-4 bg-[#0E215D] rounded-full"></span>
                        Judul Penelitian (Paper Title) <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        required 
                        rows={3}
                        value={paperTitle} 
                        onChange={(e) => setPaperTitle(e.target.value)} 
                        placeholder="Masukkan judul penelitian lengkap sesuai dokumen..." 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#0E215D]/10 focus:border-[#0E215D] outline-none text-sm transition-all shadow-sm" 
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                        <span className="w-1.5 h-4 bg-[#0E215D] rounded-full"></span>
                        Daftar Penulis (Authors) <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2.5 p-3 border border-slate-200 rounded-2xl bg-slate-50 focus-within:ring-4 focus-within:ring-[#0E215D]/10 focus-within:border-[#0E215D] transition-all shadow-sm">
                          {authors.map((author, idx) => (
                            <span key={idx} className="bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-in zoom-in-95 duration-200">
                              {author} 
                              <button type="button" onClick={() => removeAuthor(idx)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                          <input 
                            type="text" 
                            placeholder={authors.length === 0 ? "Ketik nama & tekan Enter..." : "Tambah penulis lain..."} 
                            className="flex-1 outline-none text-sm min-w-[200px] p-2 bg-transparent font-medium" 
                            value={authorInput} 
                            onChange={e => setAuthorInput(e.target.value)} 
                            onKeyDown={handleAddAuthor} 
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                        <span className="w-1.5 h-4 bg-[#0E215D] rounded-full"></span>
                        Upload Dokumen Full Paper <span className="text-red-500">*</span>
                      </label>
                      <div className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all ${file ? 'border-[#0E215D]/30 bg-slate-50 shadow-inner' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-300'}`}>
                        {!file ? (
                          <div className="space-y-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
                              <UploadCloud className="text-[#0E215D]" size={32} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">Drag & drop berkas paper Anda</p>
                              <p className="text-xs text-slate-500 mt-1">Mendukung format PDF atau DOCX (Maksimal 10MB)</p>
                            </div>
                            <label className="inline-block bg-white border border-slate-200 px-8 py-3 rounded-xl font-extrabold text-slate-800 cursor-pointer hover:bg-slate-50 transition-all shadow-sm active:scale-95 text-sm">
                              Pilih Berkas <input type="file" className="hidden" accept=".pdf,.docx,.doc" onChange={handleFileChange} />
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

                  <div className="pt-4">
                    <button type="submit" disabled={uploading} className="group w-full flex items-center justify-center gap-3 bg-[#0E215D] hover:bg-[#0a1845] text-white py-5 rounded-2xl font-black text-base transition-all shadow-2xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider">
                      {uploading ? <>Sedang Memproses...</> : <><Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Submit Paper Penelitian</>}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-6 font-medium">
                      Dengan menekan tombol submit, Anda menyatakan bahwa paper ini adalah karya orisinal dan belum pernah dipublikasikan sebelumnya.
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
