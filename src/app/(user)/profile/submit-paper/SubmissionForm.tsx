'use client';

import React, { useState } from 'react';
import { X, FileText, Send, UploadCloud, ChevronLeft, ChevronRight, Info, Plus, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { submitNewPaper } from '@/actions/paper';

type SubmissionFormProps = {
  selectedEvent: { id: number; judul: string } | undefined;
  onBack: () => void;
  onSuccess: () => void;
};

type AuthorInput = { nama: string; email: string; afiliasi: string; isCorresponding: boolean };

export function SubmissionForm({ selectedEvent, onBack, onSuccess }: SubmissionFormProps) {
  const [step, setStep] = useState(1);
  const [paperTitle, setPaperTitle] = useState('');
  
  const [kataKunci, setKataKunci] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [track, setTrack] = useState('');

  const [authors, setAuthors] = useState<AuthorInput[]>([]);
  
  const [file, setFile] = useState<File | null>(null);
  const [coiAgreed, setCoiAgreed] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const predefinedTopics = [
    "Artificial Intelligence", "Machine Learning", "Software Engineering", 
    "Networking", "Cybersecurity", "Data Science", "Internet of Things",
    "Computer Vision", "Natural Language Processing", "Cloud Computing"
  ];

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = keywordInput.trim();
      if (trimmed && !kataKunci.includes(trimmed)) {
        setKataKunci([...kataKunci, trimmed]);
        setKeywordInput('');
      }
    }
  };

  const removeKeyword = (index: number) => {
    setKataKunci(kataKunci.filter((_, i) => i !== index));
  };

  const addEmptyAuthor = () => {
    setAuthors([...authors, { nama: '', email: '', afiliasi: '', isCorresponding: authors.length === 0 }]);
  };

  const updateAuthor = (index: number, field: keyof AuthorInput, value: string | boolean) => {
    const newAuthors = [...authors];
    if (field === 'isCorresponding' && value === true) {
      newAuthors.forEach(a => a.isCorresponding = false);
    }
    newAuthors[index] = { ...newAuthors[index], [field]: value };
    setAuthors(newAuthors);
  };

  const removeAuthor = (index: number) => {
    const newAuthors = authors.filter((_, i) => i !== index);
    if (newAuthors.length > 0 && authors[index].isCorresponding) {
      newAuthors[0].isCorresponding = true;
    }
    setAuthors(newAuthors);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) return toast.error('File maksimal 10MB');
      if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
        return toast.error('Hanya file PDF yang diperbolehkan!');
      }
      setFile(selected);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (paperTitle.trim().length < 5) return toast.error('Judul minimal 5 karakter');
      if (kataKunci.length === 0) return toast.error('Minimal 1 kata kunci');
      setStep(2);
    } else if (step === 2) {
      if (authors.length === 0) return toast.error('Tambahkan minimal 1 penulis');
      const incomplete = authors.some(a => !a.nama.trim() || !a.email.trim() || !a.afiliasi.trim());
      if (incomplete) return toast.error('Lengkapi semua data penulis (Nama, Email, Afiliasi)');
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !paperTitle || authors.length === 0 || !file) {
      return toast.error('Harap lengkapi semua form dan upload dokumen!');
    }
    if (!coiAgreed) {
      return toast.error('Anda harus menyetujui Deklarasi Integritas Akademik!');
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
        kataKunci: kataKunci.join(', '),
        track: track.trim() || undefined,
        penulis: authors,
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

  const steps = [
    { num: 1, title: 'Metadata Paper' },
    { num: 2, title: 'Data Penulis' },
    { num: 3, title: 'Dokumen & Deklarasi' }
  ];

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

        {/* Stepper Progress */}
        <div className="flex items-center justify-between mt-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0">
            <div 
              className="h-full bg-primary transition-all duration-500 rounded-full" 
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
          {steps.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm
                  ${isCompleted ? 'bg-primary text-white border-2 border-primary' : 
                    isCurrent ? 'bg-white border-2 border-primary text-primary ring-4 ring-primary/10' : 
                    'bg-white border-2 border-slate-200 text-slate-400'}`}
                >
                  {isCompleted ? <Check size={14} /> : s.num}
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold ${isCurrent || isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-300">
              
              {/* STEP 1 */}
              {step === 1 && (
                <>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Judul Penelitian
                    </label>
                    <textarea
                      rows={2}
                      value={paperTitle}
                      onChange={(e) => setPaperTitle(e.target.value)}
                      placeholder="Tuliskan judul lengkap paper Anda"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white outline-none text-sm text-slate-700 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Track / Topik (Opsional)
                    </label>
                    <input
                      type="text"
                      list="topicsList"
                      value={track}
                      onChange={(e) => setTrack(e.target.value)}
                      placeholder="Pilih atau ketik Topik (Contoh: Artificial Intelligence)"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white outline-none text-sm text-slate-700 transition-all placeholder:text-slate-400"
                    />
                  </div>



                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Kata Kunci (Keywords)
                    </label>
                    <div className="flex flex-wrap gap-2 min-h-[56px] p-3.5 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                      {kataKunci.length === 0 ? (
                        <p className="text-xs text-slate-400 self-center px-1">Belum ada kata kunci...</p>
                      ) : (
                        kataKunci.map((k, idx) => (
                          <span key={idx} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                            {k}
                            <button type="button" onClick={() => removeKeyword(idx)} className="text-primary hover:text-primary/70 transition-colors">
                              <X size={14} />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        list="topicsList"
                        placeholder="Pilih atau ketik kata kunci lalu tekan Enter..."
                        className="w-full pl-4 pr-16 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm text-slate-700 focus:border-primary transition-all shadow-sm"
                        value={keywordInput}
                        onChange={e => setKeywordInput(e.target.value)}
                        onKeyDown={handleAddKeyword}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-100 rounded text-slate-400 text-[9px] font-bold tracking-wider">ENTER ↵</div>
                    </div>
                  </div>
                  
                  {/* Combobox Datalist */}
                  <datalist id="topicsList">
                    {predefinedTopics.map((topic, i) => <option key={i} value={topic} />)}
                  </datalist>
                </>
              )}
              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Daftar Penulis Terstruktur
                    </label>
                    <button onClick={addEmptyAuthor} type="button" className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-md shadow-slate-900/10">
                      <Plus size={14} /> Tambah Penulis
                    </button>
                  </div>
                  
                  {authors.length === 0 ? (
                    <div className="text-center p-8 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                      <p className="text-sm text-slate-500">Silakan tambahkan penulis untuk paper ini.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {authors.map((author, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl relative group">
                          <button onClick={() => removeAuthor(idx)} type="button" className="absolute -top-2 -right-2 w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-rose-500 hover:text-white">
                            <X size={12} />
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Nama Lengkap" value={author.nama} onChange={(e) => updateAuthor(idx, 'nama', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary" />
                            <input type="email" placeholder="Email (misal: jhon@univ.edu)" value={author.email} onChange={(e) => updateAuthor(idx, 'email', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary" />
                            <input type="text" placeholder="Instansi / Afiliasi" value={author.afiliasi} onChange={(e) => updateAuthor(idx, 'afiliasi', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary md:col-span-2" />
                          </div>
                          
                          <div className="mt-4 flex items-center gap-2">
                            <input 
                              type="radio" 
                              id={`ca-${idx}`} 
                              name="correspondingAuthor" 
                              checked={author.isCorresponding} 
                              onChange={() => updateAuthor(idx, 'isCorresponding', true)}
                              className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <label htmlFor={`ca-${idx}`} className="text-xs font-medium text-slate-700 cursor-pointer">Jadikan Penulis Utama (Korespondensi)</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Unggah Dokumen PDF
                    </label>
                    {!file ? (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-10 cursor-pointer hover:bg-slate-50 hover:border-primary/30 transition-all group">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-3">
                          <UploadCloud className="text-slate-400 group-hover:text-primary transition-colors" size={24} />
                        </div>
                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Klik untuk Unggah Dokumen</span>
                        <span className="text-xs text-slate-400 mt-1">Hanya file PDF (Maks. 10MB)</span>
                        <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
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

                  <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="coi" 
                      checked={coiAgreed} 
                      onChange={(e) => setCoiAgreed(e.target.checked)}
                      className="mt-1 border-amber-300 rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="coi" className="text-xs text-amber-900 font-medium leading-relaxed cursor-pointer">
                      <strong>Deklarasi Integritas Akademik:</strong> Dengan mencentang kotak ini, saya menyatakan bahwa karya tulis ini murni hasil pemikiran orisinal saya (dan tim penulis), bebas dari segala bentuk plagiarisme, belum pernah dipublikasikan, dan tidak sedang dalam proses review di konferensi atau jurnal lain.
                    </label>
                  </div>
                  
                  {uploading && (
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <span>Sedang mengunggah file...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>

            {/* Actions Footer */}
            <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} disabled={uploading} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors">
                  <ChevronLeft size={16} /> Kembali
                </button>
              ) : <div />}
              
              {step < 3 ? (
                <button onClick={handleNextStep} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                  Selanjutnya <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={uploading || !file || !coiAgreed}
                  className="px-8 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3 shadow-lg shadow-primary/20"
                >
                  {uploading ? 'Memproses...' : (
                    <>
                      Kirim Paper <Send size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 hidden lg:block">
          {/* Side Info */}
          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl sticky top-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Info size={18} className="text-primary" />
              Petunjuk Form
            </h3>
            <ul className="space-y-5 text-xs text-slate-300 leading-relaxed">
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">1</span>
                <div>
                  <strong className="text-white block mb-0.5">Metadata Valid</strong>
                  Pastikan Judul, Abstrak, dan Kata Kunci sesuai dengan isi dokumen PDF untuk memudahkan sistem indexing.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">2</span>
                <div>
                  <strong className="text-white block mb-0.5">Penulis Utama</strong>
                  Pilih &quot;Penulis Utama&quot; untuk kontak hasil review hanya akan dikirimkan ke email tersebut.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">3</span>
                <div>
                  <strong className="text-white block mb-0.5">Kepatuhan Etik</strong>
                  Form tidak dapat dikirim sebelum Anda menyetujui Deklarasi Integritas Akademik pada langkah akhir.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}