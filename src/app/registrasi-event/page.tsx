"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Info, Link as LinkIcon } from 'lucide-react';

export default function RegistrasiEventPage() {
  // State untuk mengatur perpindahan halaman (1 atau 2)
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header / Navbar */}
      <nav className="flex items-center justify-between bg-[#1e293b] px-10 py-4 text-white">
        <div className="text-xl font-bold tracking-wider">POLIVENTS</div>
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <a href="#" className="hover:text-blue-400">Beranda</a>
          <a href="#" className="hover:text-blue-400 border-b-2 border-white pb-1">Jelajah</a>
          <a href="#" className="hover:text-blue-400">Bantuan</a>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-orange-400 flex items-center justify-center text-[10px] font-bold">
            IL
          </div>
          <span className="text-xs font-medium">Ika Lutfi</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto mt-12 max-w-4xl px-4">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          
          {step === 1 ? (
            /* --- HALAMAN 1: INFORMASI PESERTA --- */
            <>
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-8">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Informasi Peserta</h2>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  
                  {/* Nama Lengkap */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Lengkap</Label>
                    <Input placeholder="Masukkan Nama Lengkap" className="bg-gray-50 border-none h-12 focus-visible:ring-1 focus-visible:ring-blue-500" />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</Label>
                    <Input type="email" placeholder="Masukkan Email Anda" className="bg-gray-50 border-none h-12 focus-visible:ring-1 focus-visible:ring-blue-500" />
                  </div>

                  {/* Baris No Handphone dan Jenis Kelamin */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* No Handphone - Kode Negara (Pilih) + Nomor (Ketik) */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Handphone</Label>
                      <div className="flex gap-2">
                        <select className="flex h-12 w-[100px] rounded-md border-none bg-gray-50 px-3 py-2 text-sm outline-none cursor-pointer">
                          <option value="62">(+62)</option>
                          <option value="1">(+1)</option>
                          <option value="44">(+44)</option>
                        </select>
                        <Input 
                          type="tel" 
                          placeholder="8123456789" 
                          className="flex-1 bg-gray-50 border-none h-12 focus-visible:ring-1 focus-visible:ring-blue-500" 
                        />
                      </div>
                    </div>

                    {/* Jenis Kelamin */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis Kelamin</Label>
                      <select className="flex h-12 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm outline-none cursor-pointer">
                        <option value="pria">Pria</option>
                        <option value="wanita">Wanita</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Button 
                    type="button" 
                    onClick={() => setStep(2)} 
                    className="w-full bg-[#0052cc] hover:bg-blue-700 h-14 text-lg font-bold rounded-xl shadow-md transition-all"
                  >
                    Selanjutnya
                  </Button>
                </div>
              </form>
            </>
          ) : (
            /* --- HALAMAN 2: LINK FORM PENDAFTARAN --- */
            <>
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-8">
                <LinkIcon className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Link Form Pendaftaran</h2>
              </div>

              <div className="space-y-8 px-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <p className="text-sm font-mono break-all text-gray-700 leading-relaxed">
                    https://docs.google.com/forms/u/0/create?usp=forms_home&ths=true
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <Button 
                    type="button"
                    className="w-full bg-[#0052cc] hover:bg-blue-700 h-14 text-lg font-bold rounded-xl shadow-md transition-all"
                    onClick={() => alert("Pendaftaran Berhasil Dikirim!")}
                  >
                    Selanjutnya
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setStep(1)} 
                    className="text-gray-500 hover:text-gray-800 font-medium"
                  >
                    Kembali ke Informasi Peserta
                  </Button>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}