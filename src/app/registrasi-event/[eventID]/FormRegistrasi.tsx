"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Info, Link as LinkIcon } from 'lucide-react';
import { daftarEvent } from '@/actions/peserta';
import Swal from 'sweetalert2';

// Kita terima data event dan eventId sebagai props
export default function FormRegistrasi({ eventId, dataEvent }: { eventId: string, dataEvent: any }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    nomor_telepon: '',
    jenis_kelamin: 'pria'
  });

  const handleSimpanData = async () => {
    try {
      const res = await daftarEvent(formData, Number(eventId));
      
      if (res.success) {
        // Tampilan Pop-up Berhasil
        Swal.fire({
          title: 'Pendaftaran Berhasil!',
          icon: 'success',
          html: `
            <div style="text-align: center;">
              <p>Data kamu sudah berhasil masuk ke database kami.</p>
              <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #666;">
                Pemberitahuan: Silakan klik link pendaftaran resmi di halaman ini untuk melanjutkan proses pendaftaran.
              </p>
            </div>
          `,
          confirmButtonText: 'Selesai',
          confirmButtonColor: '#0052cc',
        });
      } else {
        throw new Error("Gagal");
      }
    } catch (error) {
      // Tampilan Pop-up Gagal
      Swal.fire({
        title: 'Gagal Menyimpan Data!',
        text: 'Mohon maaf, sepertinya terjadi kesalahan sistem saat mencoba menyimpan pendaftaran kamu.',
        icon: 'error',
        confirmButtonText: 'Coba Lagi',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      {step === 1 ? (
        <>
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-8">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Informasi Peserta - {dataEvent.namaEvent}</h2>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Lengkap</Label>
                <Input 
                  value={formData.nama_lengkap}
                  onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                  placeholder="Masukkan Nama Lengkap" 
                  className="bg-gray-50 border-none h-12" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</Label>
                <Input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Masukkan Email Anda" 
                  className="bg-gray-50 border-none h-12" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Handphone</Label>
                  <div className="flex gap-2">
                    <select className="flex h-12 w-[100px] rounded-md border-none bg-gray-50 px-3 py-2 text-sm outline-none">
                      <option value="62">(+62)</option>
                    </select>
                    <Input 
                      type="tel" 
                      value={formData.nomor_telepon}
                      onChange={(e) => setFormData({...formData, nomor_telepon: e.target.value})}
                      placeholder="8123456789" 
                      className="flex-1 bg-gray-50 border-none h-12" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis Kelamin</Label>
                  <select 
                    value={formData.jenis_kelamin}
                    onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})}
                    className="flex h-12 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm outline-none"
                  >
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
                className="w-full bg-[#0052cc] hover:bg-blue-700 h-14 text-lg font-bold rounded-xl shadow-md"
              >
                Selanjutnya
              </Button>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-8">
            <LinkIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Link Form Pendaftaran Resmi</h2>
          </div>

          <div className="space-y-8 px-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
              {dataEvent.linkPendaftaran ? (
                <a 
                  href={dataEvent.linkPendaftaran} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium underline break-all"
                >
                  {dataEvent.linkPendaftaran}
                </a>
              ) : (
                <p className="text-gray-500 italic">Link pendaftaran belum tersedia untuk event ini.</p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                type="button"
                className="w-full bg-[#0052cc] hover:bg-blue-700 h-14 text-lg font-bold rounded-xl shadow-md"
                onClick={handleSimpanData}
              >
                Simpan dan Selesai
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
  );
}