import React from 'react';
import { db } from "@/db";
import { profilPenyelenggara, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateProfilAction } from "@/actions/organizer";
import { Camera, Globe, Mail, Phone, FileText, Eye } from 'lucide-react';

export default async function ProfilPenyelenggaraPage() {
  // 1. Menggabungkan tabel profil_penyelenggara dengan tabel users berdasarkan user_id
  const rows = await db
    .select({
      id: profilPenyelenggara.id,
      userId: profilPenyelenggara.userId,
      namaInstansi: profilPenyelenggara.namaInstansi,
      deskripsiInstansi: profilPenyelenggara.deskripsiInstansi,
      websiteUrl: profilPenyelenggara.websiteUrl,
      dokumenLegalitasUrl: profilPenyelenggara.dokumenLegalitasUrl,
      // Data dari tabel users:
      namaLengkap: users.namaLengkap,
      email: users.email,
      nomorTelepon: users.nomorTelepon,
      avatarUrl: users.avatarUrl,
    })
    .from(profilPenyelenggara)
    .innerJoin(users, eq(profilPenyelenggara.userId, users.id))
    .where(eq(profilPenyelenggara.id, 1))
    .limit(1);

  // Ambil data baris gabungan pertama
  const dataProfil = rows[0];

  // Mengambil huruf pertama nama instansi untuk dijadikan inisial avatar jika gambar kosong/pecah
  const inisialNama = dataProfil?.namaInstansi ? dataProfil.namaInstansi.charAt(0).toUpperCase() : "P";

  return (
    <div className="p-6 ml-0 md:ml-4">
      
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Profil Penyelenggara</h1>
        <span className="bg-emerald-100 text-emerald-600 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          Akun Terverifikasi ({dataProfil?.namaLengkap || "Penyelenggara"})
        </span>
      </div>

      {/* Form Action */}
      <form action={updateProfilAction}>
        
        {/* Input Hidden ID untuk target update */}
        <input type="hidden" name="id" value={dataProfil?.id || "1"} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom Kiri: Informasi Organisasi */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Informasi Organisasi</h2>
              <p className="text-sm text-slate-500 mb-8">Kelola identitas publik dan deskripsi lembaga Anda.</p>

              {/* Bagian Foto Profil / Avatar dari tabel Users */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-indigo-600 border-2 border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                    {/* PERBAIKAN LOGIKA AVATAR: Jika ada url gambar dan tidak mengandung path lokal '/uploads', pasang img. Jika tidak, pakai inisial huruf */}
                    {dataProfil?.avatarUrl && !dataProfil.avatarUrl.startsWith('/uploads') ? (
                      <img 
                        src={dataProfil.avatarUrl} 
                        alt="Avatar Penyelenggara" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white tracking-wider">
                        {inisialNama}
                      </span>
                    )}
                  </div>
                  <button type="button" className="absolute bottom-0 right-0 p-1.5 bg-slate-800 text-white rounded-full border-2 border-white hover:bg-slate-700 transition-colors">
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">Ubah Foto Profil</h3>
                  <p className="text-xs text-slate-400">Gunakan inisial pintar akun pengelola.</p>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nama Organisasi</label>
                  <input 
                    type="text" 
                    name="nama_instansi"
                    defaultValue={dataProfil?.namaInstansi || ""}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
                  <textarea 
                    rows={4}
                    name="deskripsi_instansi"
                    defaultValue={dataProfil?.deskripsiInstansi || ""}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Globe size={18} />
                    </div>
                    <input 
                      type="url" 
                      name="website_url"
                      placeholder="https://..."
                      defaultValue={dataProfil?.websiteUrl || ""}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Kontak & Legalitas dinamis dari tabel Users */}
          <div className="space-y-6">
            {/* Card Kontak */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Informasi Kontak</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Akun</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail size={16} />
                    </div>
                    <input 
                      type="email" 
                      disabled
                      value={dataProfil?.email || ""}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed outline-none font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nomor HP/WA</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone size={16} />
                    </div>
                    <input 
                      type="text" 
                      disabled
                      value={dataProfil?.nomorTelepon || ""}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed outline-none font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card Legalitas */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-6">Dokumen Legalitas</h2>
              
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-3 mb-4">
                <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                  <FileText size={24} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold text-slate-700 truncate mb-1">
                    {dataProfil?.dokumenLegalitasUrl || "Belum ada dokumen file"}
                  </p>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    Disetujui
                  </span>
                </div>
              </div>

              <button type="button" className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <Eye size={16} />
                Lihat Dokumen
              </button>
            </div>
          </div>
        </div>

        {/* Action Button Section */}
        <div className="mt-8 flex justify-end">
          <button 
            type="submit"
            className="px-8 py-3 bg-[#7C87A6] text-white rounded-lg font-semibold hover:bg-[#6A7591] transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}