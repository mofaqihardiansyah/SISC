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
              className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-md"
            >
              <User className="w-4 h-4" />
              <span>{session.user?.name || "Profil"}</span>
            </Link>
          ) : (
            <>
              <Link href="/register">Daftar</Link>
              <Link href="/login">
                <button className="bg-white text-black px-5 py-2 rounded-md font-bold">
                  Masuk
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}