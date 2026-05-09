'use client';

import React, { useState } from 'react';
import { UploadCloud, X, CheckCircle, Clock, AlertCircle, FileText, Send, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { submitNewPaper } from '@/actions/paper';
import { toast } from 'sonner';

export type RegisteredEvent = {
  id: number;
  judul: string;
  penyelenggara: string | null;
  tanggalMulai: Date;
};

export type SubmittedPaper = {
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
  // Form States
  const [selectedEvent, setSelectedEvent] = useState<number | ''>('');
  const [paperTitle, setPaperTitle] = useState('');
  
  // Author Tagging States
  const [authors, setAuthors] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState('');
  
  // File States
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
        eventId: Number(selectedEvent),
        judul: paperTitle,
        penulis: authors.join(', '),
        fileUrl: dataUpload.url,
      });

      toast.success('Paper berhasil disubmit!');
      // Reset Form
      setSelectedEvent(''); setPaperTitle(''); setAuthors([]); setFile(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengirim paper');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8">
      {/* Header Utama */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Submit Paper</h1>
        <p className="text-slate-500 mt-1">Unggah dan pantau status publikasi jurnal / conference Anda.</p>
      </div>

      {/* Split-View Layout */}
      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* KONTEN TENGAH (Kiri): Event & Form */}
        <div className="flex-1 space-y-8">
          
          {/* Event Conference Terdaftar */}
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Event Conference Tersedia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initialRegisteredEvents.length === 0 && (
                <p className="text-sm text-slate-500 italic p-4 bg-white rounded-xl border border-slate-200 col-span-2">Anda belum mendaftar di event tipe Conference manapun.</p>
              )}
              {initialRegisteredEvents.map((event) => (
                <div key={event.id} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm relative overflow-hidden transition-all hover:border-blue-300">
                  <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Deadline: {format(new Date(event.tanggalMulai), 'dd MMM yyyy', { locale: id })}
                  </div>
                  <h3 className="font-bold text-slate-900 mt-2 pr-20 leading-tight">{event.judul}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-3 font-medium">
                    <Building2 size={16} /> {event.penyelenggara || 'Institusi Tidak Diketahui'}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Form Submission */}
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Form Pengajuan Paper</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Event Conference <span className="text-red-500">*</span></label>
                <select required value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                  <option value="" disabled>-- Silahkan Pilih Event --</option>
                  {initialRegisteredEvents.map(e => <option key={e.id} value={e.id}>{e.judul}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Paper Title <span className="text-red-500">*</span></label>
                <input required type="text" value={paperTitle} onChange={(e) => setPaperTitle(e.target.value)} placeholder="Masukkan judul penelitian lengkap..." className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Authors (Tekan Enter/Koma) <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2 p-2 border border-slate-300 rounded-xl bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  {authors.map((author, idx) => (
                    <span key={idx} className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                      {author} <button type="button" onClick={() => removeAuthor(idx)}><X size={14} className="hover:text-red-400" /></button>
                    </span>
                  ))}
                  <input type="text" placeholder={authors.length === 0 ? "Ketik nama penulis (Cth: Budi Raharjo)..." : "Tambah penulis..."} className="flex-1 outline-none text-sm min-w-[200px] p-1.5 bg-transparent" value={authorInput} onChange={e => setAuthorInput(e.target.value)} onKeyDown={handleAddAuthor} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Upload Full Paper <span className="text-red-500">*</span></label>
                <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${file ? 'border-blue-300 bg-blue-50/30' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>
                  {!file ? (
                    <>
                      <UploadCloud className="mx-auto text-blue-500 mb-3" size={40} />
                      <p className="font-semibold text-slate-700">Drag & drop your file here</p>
                      <p className="text-xs text-slate-500 mt-1 mb-5">Supported formats: PDF, DOCX (Max 10MB)</p>
                      <label className="bg-white border border-slate-200 px-5 py-2.5 rounded-lg font-bold text-slate-700 cursor-pointer hover:bg-slate-50 shadow-sm text-sm">
                        Browse Files <input type="file" className="hidden" accept=".pdf,.docx,.doc" onChange={handleFileChange} />
                      </label>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full max-w-sm">
                        <div className="bg-blue-100 p-3 rounded-lg"><FileText className="text-blue-600" size={24} /></div>
                        <div className="text-left flex-1 overflow-hidden">
                          <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                          <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button type="button" onClick={() => setFile(null)} className="p-2 bg-slate-100 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"><X size={16} /></button>
                      </div>
                      
                      {/* Progres Bar (Muncul saat upload) */}
                      {uploading && (
                        <div className="w-full max-w-sm mt-4">
                          <div className="flex justify-between text-xs font-bold text-blue-600 mb-1">
                            <span>Uploading...</span> <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" disabled={uploading} className="w-full flex items-center justify-center gap-2 bg-[#0E215D] hover:bg-[#0a1845] text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-[#0E215D]/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                <Send size={18} /> {uploading ? 'Memproses Submission...' : 'Submit Paper'}
              </button>
            </form>
          </section>
        </div>

        {/* KONTEN KANAN (Status Submission Sidebar) */}
        <aside className="w-full xl:w-96">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm sticky top-24">
            <div className="p-6 border-b border-slate-100"><h2 className="text-lg font-bold text-slate-900">Status Submission</h2></div>
            <div className="p-6 space-y-5 max-h-[600px] overflow-y-auto">
              {initialSubmittedPapers.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">Anda belum memiliki riwayat pengajuan paper.</p>
              ) : (
                initialSubmittedPapers.map((paper) => (
                  <div key={paper.id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl space-y-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">{paper.judul}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{paper.eventJudul}</p>
                    </div>

                    {paper.status === 'review' && <div className="inline-flex items-center gap-2 text-blue-700 bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-200"><Clock size={14} /> Sedang Review</div>}
                    
                    {paper.status === 'accepted' && (
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 text-green-700 bg-green-100 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-200"><CheckCircle size={14} /> Diterima</div>
                        <button className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 py-2.5 rounded-lg transition-colors">Hubungi Penyelenggara</button>
                      </div>
                    )}
                    
                    {paper.status === 'rejected' && (
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 text-red-700 bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200"><AlertCircle size={14} /> Ditolak</div>
                        {paper.komentarPenolakan && <div className="bg-red-50 p-3 rounded-lg text-xs text-red-800 border border-red-100"><span className="font-bold block mb-1">Catatan Reviewer:</span>{paper.komentarPenolakan}</div>}
                        <button className="w-full text-xs font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 py-2.5 rounded-lg transition-colors">Submit Ulang Paper</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}