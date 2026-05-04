// src/components/layout/navbar.tsx
import { Search, User } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-[var(--brand-dark)] text-white">
      {/* ✅ Ganti max-w-6xl → max-w-none, samakan padding dengan hero */}
      <div className="px-4 sm:px-8 lg:px-16 py-4 flex justify-between items-center">

        {/* LEFT */}
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold">POLIVENTS</h1>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari seminar atau konferensi..."
              className="pl-10 pr-4 py-2 rounded-full text-sm text-black bg-white w-[300px]"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/beranda">Beranda</Link>
          <Link href="/jelajah">Jelajah</Link>
          <Link href="/bantuan">Bantuan</Link>

          {session ? (
            <Link
              href="/dashboard"
              className="flex items-center justify-center bg-white/10 w-10 h-10 rounded-full transition-all duration-300 hover:bg-white/20 active:scale-95 overflow-hidden border border-white/20"
              title={session.user?.name || "Profil"}
            >
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                href="/register"
                className="px-4 py-2 rounded-md transition-all duration-300 hover:bg-white/10 active:scale-95"
              >
                Daftar
              </Link>
              <Link href="/login">
                <button className="bg-white text-black px-5 py-2 rounded-md font-bold transition-all duration-300 hover:bg-gray-100 hover:scale-105 active:scale-95 cursor-pointer">
                  Masuk
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}