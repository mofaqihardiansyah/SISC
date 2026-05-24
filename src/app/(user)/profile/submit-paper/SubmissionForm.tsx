'use client';

import React, { useState } from 'react';
import { X, FileText, Send, UploadCloud, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { submitNewPaper } from '@/actions/paper';
import { Stepper } from '@/components/ui/stepper';

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
        judul: paperTitle.trim(),
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Pengiriman Paper Baru</h2>
            <p className="text-sm text-slate-500 mt-0.5">{selectedEvent?.judul}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Form Content */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Judul Section */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Judul Penelitian
                </label>
                <textarea
                  rows={4}
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                  placeholder="Tuliskan judul lengkap paper Anda..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white outline-none text-sm text-slate-700 transition-all placeholder:text-slate-400 leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 italic">Gunakan kapitalisasi yang benar sesuai standar penulisan ilmiah.</p>
              </div>

              {/* Penulis Section */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Daftar Penulis
                </label>
                <div className="flex flex-wrap gap-2 min-h-[56px] p-3.5 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                  {authors.length === 0 ? (
                    <p className="text-xs text-slate-400 self-center px-1">Belum ada penulis ditambahkan...</p>
                  ) : (
                    authors.map((author, idx) => (
                      <span key={idx} className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 animate-in zoom-in-95 duration-200">
                        {author}
                        <button type="button" onClick={() => removeAuthor(idx)} className="text-slate-400 hover:text-white transition-colors">
                          <X size={14} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ketik nama penulis lalu tekan Enter..."
                    className="w-full pl-4 pr-16 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                    value={authorInput}
                    onChange={e => setAuthorInput(e.target.value)}
                    onKeyDown={handleAddAuthor}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-100 rounded text-slate-400 text-[9px] font-bold tracking-wider">ENTER ↵</div>
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Dokumen Paper
                </label>
                {!file ? (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-10 cursor-pointer hover:bg-slate-50 hover:border-primary/30 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-3">
                      <UploadCloud className="text-slate-400 group-hover:text-primary transition-colors" size={24} />
                    </div>
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Klik untuk Unggah Dokumen</span>
                    <span className="text-xs text-slate-400 mt-1">PDF atau DOCX (Maks. 10MB)</span>
                    <input type="file" className="hidden" accept=".pdf,.docx,.doc" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText size={20} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setFile(null)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all">
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              {uploading && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Sedang mengunggah...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-200">
              <button
                onClick={handleSubmit}
                disabled={uploading || !file || !paperTitle.trim() || authors.length === 0}
                className="w-full py-3.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
              >
                {uploading ? 'Memproses Pengiriman...' : (
                  <>
                    Kirim Paper Sekarang
                    <Send size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Side Info */}
          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Info size={18} className="text-primary" />
              Informasi Penting
            </h3>
            <ul className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                Paper yang sudah disubmit tidak dapat diedit kembali tanpa persetujuan penyelenggara.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                Pastikan format file sesuai (PDF/DOCX) dan ukuran tidak melebihi 10MB.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                Reviewer akan memberikan feedback secara berkala melalui sistem ini.
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h4 className="text-amber-900 text-xs font-bold mb-2 uppercase tracking-wider">Bantuan</h4>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              Jika mengalami kendala teknis saat mengunggah paper, silakan hubungi tim IT kami melalui menu bantuan di sidebar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}