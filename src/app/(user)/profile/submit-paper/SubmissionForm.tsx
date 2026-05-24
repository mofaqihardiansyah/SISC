'use client';

import React, { useState } from 'react';
import { X, FileText, Send, UploadCloud } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { submitNewPaper } from '@/actions/paper';

type SubmissionFormProps = {
  selectedEvent: { id: number; judul: string } | undefined;
  onBack: () => void;
  onSuccess: () => void;
};

export function SubmissionForm({ selectedEvent, onBack, onSuccess }: SubmissionFormProps) {
  const [paperTitle, setPaperTitle] = useState('');
  const [authors, setAuthors] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState('');
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
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 15));
      }, 300);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'paper');

      const resUpload = await fetch('/api/upload', { method: 'POST', body: formData });
      const dataUpload = await resUpload.json();
      clearInterval(progressInterval);

      if (!resUpload.ok) throw new Error(dataUpload.error || 'Gagal upload file');
      
      setUploadProgress(100);

      await submitNewPaper({
        eventId: selectedEvent.id,
        judul: paperTitle,
        penulis: authors.join(', '),
        fileUrl: dataUpload.url,
      });

      toast.success('Paper berhasil disubmit!');
      onSuccess();
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
    <section className="animate-in fade-in slide-in-from-right-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-3 text-xs font-black text-slate-400 hover:text-[#0E215D] transition-all mb-8 group uppercase tracking-widest"
      >
        <div className="bg-white w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center group-hover:border-[#0E215D]/30 group-hover:bg-slate-50 shadow-sm transition-all">
          <X size={18} />
        </div>
        Kembali ke Daftar
      </button>

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

      <div className="bg-white border-x border-b border-slate-200 rounded-b-3xl shadow-sm p-6 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
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
  );
}