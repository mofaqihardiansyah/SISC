import React from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">POLIVENTS</h1>
        <p className="mt-4 text-slate-500">INI HARUSNYA HALAMAN BERANDA.</p>
        <div className="mt-8 flex gap-4 justify-center">
          <a href="/login" className="px-4 py-2 bg-[#03428B] text-white rounded-lg font-medium hover:bg-[#02336B] transition">
            Ke Halaman Login
          </a>
          <a href="/register" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition">
            Daftar Akun Baru
          </a>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-3">Tidak bisa ke halaman Login? Anda mungkin masih dalam status Logged In.</p>
          <form action={async () => {
            "use server";
            const { signOut } = await import("@/auth");
            await signOut();
          }}>
            <button type="submit" className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100 transition">
              Logout (Keluar Sesi)
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
