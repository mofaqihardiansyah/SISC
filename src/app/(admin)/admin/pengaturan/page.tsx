"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { KeyRound, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UPLOAD_LIMITS } from "@/lib/constants";
export const dynamic = 'force-dynamic';


export default function AdminSettingsPage() {
  const router = useRouter();
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [inisial, setInisial] = useState("A");

  const [passLama, setPassLama] = useState("");
  const [passBaru, setPassBaru] = useState("");
  const [passKonfirm, setPassKonfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorProfil, setErrorProfil] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [loadingProfil, setLoadingProfil] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const [urlAvatar, setAvatarUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch admin data on load
  useEffect(() => {
    fetch("/api/admin/pengaturan")
      .then((res) => res.json())
      .then((data) => {
        if (data.namaLengkap) {
          setNamaLengkap(data.namaLengkap);
          setInisial(data.namaLengkap.charAt(0).toUpperCase());
        }
        if (data.email) setEmail(data.email);
        if (data.urlAvatar) setAvatarUrl(data.urlAvatar);
      })
      .catch((err) => console.error(err));
  }, []);

  // Save profile
  const handleSimpan = async () => {
    setErrorProfil("");
    if (!namaLengkap || !email) {
      setErrorProfil("Nama dan email wajib diisi");
      return;
    }
    setLoadingProfil(true);
    try {
      const res = await fetch("/api/admin/pengaturan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namaLengkap, email, urlAvatar }),
      });
      const data = await res.json();
      if (res.ok) {
        setInisial(namaLengkap.charAt(0).toUpperCase());
        toast.success("Profil berhasil diperbarui!");
        router.refresh();
      } else {
        setErrorProfil(data.error || "Gagal menyimpan profil");
      }
    } catch {
      setErrorProfil("Terjadi kesalahan jaringan");
    } finally {
      setLoadingProfil(false);
    }
  };

  // Handle avatar upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > UPLOAD_LIMITS.AVATAR_MAX_SIZE) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("type", "avatar");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) throw new Error("Gagal upload foto");

      const data = await res.json();
      setAvatarUrl(data.url);
      
      // Auto-save the avatar URL to the database
      await fetch("/api/admin/pengaturan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namaLengkap, email, urlAvatar: data.url }),
      });
      
      router.refresh();
      toast.success("Foto profil berhasil diperbarui!");
    } catch {
      toast.error("Gagal upload foto");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    setErrorPass("");
    if (!passLama || !passBaru || !passKonfirm) {
      setErrorPass("Semua kolom kata sandi wajib diisi");
      return;
    }
    if (passBaru !== passKonfirm) {
      setErrorPass("Konfirmasi kata sandi tidak cocok");
      return;
    }
    if (passBaru.length < 8) {
      setErrorPass("Kata sandi baru minimal 8 karakter");
      return;
    }
    setLoadingPass(true);
    try {
      const res = await fetch("/api/admin/pengaturan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passLama, passBaru, passKonfirm }),
      });
      const data = await res.json();
      if (res.ok) {
        setPassLama("");
        setPassBaru("");
        setPassKonfirm("");
        toast.success("Kata sandi berhasil diperbarui!");
      } else {
        setErrorPass(data.error || "Gagal mengupdate kata sandi");
      }
    } catch {
      setErrorPass("Terjadi kesalahan jaringan");
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-500 p-6 md:p-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pengaturan Admin</h1>
        <p className="text-slate-500 mt-2">Kelola informasi pribadi dan pengaturan keamanan Anda.</p>
      </div>

      {/* Profil & Akun */}
      <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Profil & Akun Admin</h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-2 border-slate-100 flex-shrink-0 relative overflow-hidden bg-slate-900 flex items-center justify-center">
              {urlAvatar ? (
                <Image src={urlAvatar} alt="Profil Admin" fill className="object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">{inisial}</span>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/webp" 
                className="hidden" 
              />
              <Button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                variant="secondary"
              >
                {isUploading ? 'Mengupload...' : 'Ubah Foto Profil'}
              </Button>
              <p className="text-xs text-slate-500 mt-2">Format: JPG, PNG, WEBP. Maks: 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-1">
              <label className="text-sm font-semibold mb-2 block text-slate-700">Nama Lengkap</label>
              <Input 
                type="text" 
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-sm text-slate-700 bg-slate-50 focus:bg-white"
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="text-sm font-semibold mb-2 block text-slate-700">Email Kerja</label>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-sm text-slate-700 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {errorProfil && <p className="text-sm text-red-600 font-medium">{errorProfil}</p>}

          <div className="mt-8 pt-6 border-t border-slate-200">
            <Button 
              type="button"
              onClick={handleSimpan}
              disabled={loadingProfil}
              className="px-8 py-2.5 flex items-center justify-center gap-2"
            >
              {loadingProfil && <Loader2 className="w-5 h-5 animate-spin" />}
              {loadingProfil ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </div>
      </section>

      {/* Keamanan */}
      <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-slate-100 text-slate-900 rounded-xl border border-slate-200">
            <KeyRound size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Keamanan Akun</h2>
        </div>
        
        <div className="space-y-4 max-w-md relative">
          <div>
            <label className="text-sm font-semibold mb-2 block text-slate-700">Kata Sandi Saat Ini</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={passLama}
                onChange={(e) => setPassLama(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl pr-12 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-sm text-slate-700 bg-slate-50 focus:bg-white"
                placeholder="Masukkan kata sandi saat ini"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block text-slate-700">Kata Sandi Baru</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={passBaru}
                onChange={(e) => setPassBaru(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl pr-12 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-sm text-slate-700 bg-slate-50 focus:bg-white"
                placeholder="Minimal 8 karakter"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block text-slate-700">Konfirmasi Kata Sandi Baru</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={passKonfirm}
                onChange={(e) => setPassKonfirm(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl pr-12 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-sm text-slate-700 bg-slate-50 focus:bg-white"
                placeholder="Ketik ulang kata sandi baru"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>
          
          {errorPass && <p className="text-sm text-red-600 font-medium">{errorPass}</p>}
          
          <Button
            type="button"
            onClick={handleUpdatePassword}
            disabled={loadingPass}
            className="w-full py-6 flex items-center justify-center gap-2 mt-4"
          >
            {loadingPass && <Loader2 className="w-4 h-4 animate-spin" />}
            {loadingPass ? 'Memperbarui...' : 'Perbarui Kata Sandi'}
          </Button>
        </div>
      </section>
    </div>
  );
}
