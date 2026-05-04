import React from "react";
import { auth, signOut } from "@/auth";

export default async function HomePage() {
  const session = await auth();
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">POLIVENTS</h1>
        <p className="mt-4 text-slate-500">Harusnya halaman beranda.</p>
        
        {session && (
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-600">Halo, TES!</p>
              <p className="text-lg font-bold text-primary">{session.user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{session.user?.role}</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <form action={async () => {
                "use server";
                await signOut();
              }}>
                <button type="submit" className="w-full px-6 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-bold hover:bg-red-100 transition cursor-pointer">
                  Logout
                </button>
              </form>
            </div>
          </div>
        ) }: (
          <div className="mt-8 flex gap-4 justify-center">
            <a href="/login" className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-[#02336B] transition">
              Masuk
            </a>
            <a href="/register" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition">
              Daftar
            </a>
          </div>
        )
      </div>
    </main>
  );
}
