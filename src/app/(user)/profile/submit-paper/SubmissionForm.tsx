'use client';

import React, { useState } from 'react';
import { X, FileText, Send, UploadCloud, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { submitNewPaper } from '@/actions/paper';
import { Stepper } from '@/components/ui/stepper';

type SubmissionFormProps = {
  selectedEvent: { id: number; judul: string } | undefined;
  onBack: () => void;
  onSuccess: () => void;
};

type Step = 'event_info' | 'paper_details' | 'authors' | 'review_submit';

const STEPS = [
  { id: 'event_info', label: 'Event' },
  { id: 'paper_details', label: 'Detail' },
  { id: 'authors', label: 'Penulis' },
  { id: 'review_submit', label: 'Review' },
];

export function SubmissionForm({ selectedEvent, onBack, onSuccess }: SubmissionFormProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [paperTitle, setPaperTitle] = useState('');
  const [authors, setAuthors] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const currentStep = STEPS[currentStepIndex].id as Step;

  const handleNext = () => {
    if (currentStep === 'paper_details' && !paperTitle.trim()) {
      return toast.error('Judul penelitian wajib diisi');
    }
    if (currentStep === 'authors' && authors.length === 0) {
      return toast.error('Minimal harus ada satu penulis');
    }
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      onBack();
    }
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrev}
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200"
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pengiriman Paper Baru</h2>
              <p className="text-xs text-slate-500 mt-0.5">{selectedEvent?.judul}</p>
            </div>
          </div>
          <div className="w-full sm:w-56">
            <Stepper steps={STEPS} currentStep={currentStepIndex} />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden min-h-[360px] flex flex-col">
        <div className="p-6 flex-1">
          {currentStep === 'event_info' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                <h3 className="font-semibold text-slate-900 mb-1 text-sm">Informasi Conference</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Anda akan mengirimkan paper untuk conference <strong>{selectedEvent?.judul}</strong>. Pastikan judul penelitian relevan dengan tema conference ini.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <span className="font-semibold">Catatan:</span> Paper yang sudah disubmit tidak dapat diedit kembali tanpa persetujuan dari pihak penyelenggara atau administrator.
                </p>
              </div>
            </div>
          )}

          {currentStep === 'paper_details' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-3">
              <label className="block text-sm font-semibold text-slate-900">Judul Penelitian</label>
              <textarea 
                rows={5}
                value={paperTitle} 
                onChange={(e) => setPaperTitle(e.target.value)} 
                placeholder="Tuliskan judul lengkap paper Anda..." 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white outline-none text-sm text-slate-700 transition-all placeholder:text-slate-400" 
              />
              <p className="text-xs text-slate-400 italic">Gunakan kapitalisasi yang benar sesuai standar penulisan ilmiah.</p>
            </div>
          )}

          {currentStep === 'authors' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
              <label className="block text-sm font-semibold text-slate-900">Daftar Penulis</label>
              <div className="flex flex-wrap gap-2 min-h-[48px] p-3 bg-slate-50 rounded-lg border border-slate-200">
                {authors.length === 0 ? (
                  <p className="text-xs text-slate-400 self-center px-1">Belum ada penulis ditambahkan...</p>
                ) : (
                  authors.map((author, idx) => (
                    <span key={idx} className="bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2">
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
                  className="w-full pl-4 pr-16 py-2.5 bg-white border border-slate-200 rounded-lg outline-none text-sm text-slate-700 focus:border-primary transition-all" 
                  value={authorInput} 
                  onChange={e => setAuthorInput(e.target.value)} 
                  onKeyDown={handleAddAuthor} 
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 text-[10px] font-medium">ENTER ↵</span>
              </div>
            </div>
          )}

          {currentStep === 'review_submit' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Judul Paper</p>
                    <p className="text-sm font-medium text-slate-900 line-clamp-3">{paperTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Daftar Penulis</p>
                    <p className="text-sm text-slate-700">{authors.join(', ')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Dokumen Paper</p>
                  {!file ? (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-6 cursor-pointer hover:bg-slate-50 hover:border-primary/30 transition-all group">
                      <UploadCloud className="text-slate-300 group-hover:text-primary mb-2 transition-colors" size={22} />
                      <span className="text-xs text-slate-400 group-hover:text-slate-700 transition-colors">Pilih File (PDF/DOCX, maks. 10MB)</span>
                      <input type="file" className="hidden" accept=".pdf,.docx,.doc" onChange={handleFileChange} />
                    </label>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText size={18} className="text-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-900 truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setFile(null)} className="p-1 hover:bg-white rounded text-slate-400 hover:text-rose-500 transition-all">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {uploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Sedang mengunggah...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <button 
            type="button"
            onClick={handlePrev}
            className="px-5 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 transition-all"
          >
            {currentStepIndex === 0 ? 'Batal' : 'Kembali'}
          </button>

          {currentStep === 'review_submit' ? (
            <button 
              onClick={handleSubmit}
              disabled={uploading || !file}
              className="px-6 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {uploading ? 'Memproses...' : (
                <>
                  Kirim Paper
                  <Send size={14} />
                </>
              )}
            </button>
          ) : (
            <button 
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 active:scale-[0.97] transition-all flex items-center gap-2"
            >
              Lanjut
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}