// src/components/layout/navbar.tsx
import Link from "next/link";
import { auth } from "@/auth";
import UserMenu from "./UserMenu";
import SearchBar from "./SearchBar";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-[var(--brand-dark)] text-white">
      {/* ✅ Ganti max-w-6xl → max-w-none, samakan padding dengan hero */}
      <div className="px-4 sm:px-8 lg:px-16 py-4 flex justify-between items-center">

        {/* LEFT */}
        <div className="flex items-center gap-8">
          <Link href="/">
  <h1 className="text-xl font-bold hover:opacity-80 transition-opacity cursor-pointer">
    POLIVENTS
  </h1>
</Link>

          <SearchBar />
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/">Beranda</Link>
          <Link href="/jelajah">Jelajah</Link>
          <Link href="/bantuan">Bantuan</Link>

          {session?.user ? (
            <UserMenu user={session.user} />
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