import React from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">POLIVENTS</h1>
        <p className="mt-4 text-slate-500">Harusnya halaman beranda.</p>
        <div className="mt-8 flex gap-4 justify-center">
          <a href="/login" className="px-4 py-2 bg-[#03428B] text-white rounded-lg font-medium hover:bg-[#02336B] transition">
            Tombol testing Ke Halaman Login
          </a>
          <a href="/register" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition">
            Daftar Akun Baru
          </a>
        </div>
      </div>
    </main>
  );
}
