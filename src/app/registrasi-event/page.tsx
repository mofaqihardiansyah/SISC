"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Info, Link as LinkIcon, ChevronLeft, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { daftarEvent } from '@/actions/peserta';
import { toast } from 'sonner';

function RegistrationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get('eventId');
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    nomor_telepon: '',
    jenis_kelamin: 'pria'
  });

  const handleSimpanData = async () => {
    setIsSubmitting(true);
    const res = await daftarEvent(formData);
    setIsSubmitting(false);
    
    if (res.success) {
      toast.success("Pendaftaran Berhasil Disimpan!");
      router.push('/');
    } else {
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Simple Header */}
      <nav className="bg-white border-b border-slate-200 px-6 sm:px-12 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <span className="text-xl font-black text-primary tracking-tight">POLIVENTS</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 font-semibold">
          <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
        </Button>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 1 ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-slate-200 text-slate-500'}`}>
                1
              </div>
              <div className={`w-16 h-1 rounded-full transition-all ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 2 ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-slate-200 text-slate-500'}`}>
                2
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-8 sm:p-12">
              {step === 1 ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Informasi Peserta</h2>
                    <p className="text-slate-500 font-medium">Silakan lengkapi data diri Anda untuk melanjutkan pendaftaran.</p>
                  </div>

                  <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 ml-1">Nama Lengkap</Label>
                      <Input 
                        required
                        value={formData.nama_lengkap}
                        onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                        placeholder="Contoh: Budi Santoso" 
                        className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:ring-primary focus:border-primary" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 ml-1">Alamat Email</Label>
                      <Input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="email@anda.com" 
                        className="bg-slate-50 border-slate-200 h-12 rounded-xl" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-700 ml-1">Nomor WhatsApp</Label>
                        <Input 
                          required
                          type="tel" 
                          value={formData.nomor_telepon}
                          onChange={(e) => setFormData({...formData, nomor_telepon: e.target.value})}
                          placeholder="08123456789" 
                          className="bg-slate-50 border-slate-200 h-12 rounded-xl" 
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-700 ml-1">Jenis Kelamin</Label>
                        <select 
                          value={formData.jenis_kelamin}
                          onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}
                          className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                          <option value="pria">Pria</option>
                          <option value="wanita">Wanita</option>
                        </select>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-[#02336B] h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 mt-6 transition-all active:scale-95"
                    >
                      Lanjut ke Pendaftaran
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8 text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Hampir Selesai!</h2>
                    <p className="text-slate-500 font-medium px-4">
                      Silakan isi formulir pendaftaran eksternal melalui link di bawah ini, kemudian klik tombol konfirmasi.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <a 
                      href="https://docs.google.com/forms/u/0/create" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                          <ExternalLink className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-900">Formulir GForm</p>
                          <p className="text-xs text-slate-400 font-medium">Buka di tab baru</p>
                        </div>
                      </div>
                      <LinkIcon className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                    </a>

                    <div className="flex flex-col gap-3 pt-4">
                      <Button 
                        onClick={handleSimpanData}
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-[#02336B] h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                      >
                        {isSubmitting ? 'Menyimpan...' : 'Saya Sudah Mengisi Form & Selesai'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => setStep(1)} 
                        className="h-12 text-slate-400 font-bold hover:text-slate-600 rounded-xl"
                      >
                        Kembali ke Data Diri
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
            <Info className="w-4 h-4" />
            <span>Data Anda aman dan hanya digunakan untuk keperluan event ini.</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function RegistrasiEventPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-bold text-primary animate-pulse">Memuat...</div>}>
      <RegistrationForm />
    </Suspense>
  );
}