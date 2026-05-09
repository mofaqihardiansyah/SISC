import Link from "next/link";
import { auth } from "@/auth";
import UserMenu from "./UserMenu";
import SearchInput from "./search-input";
import { Suspense } from "react";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 bg-[var(--brand-dark)] text-white shadow-md">
      <div className="px-4 sm:px-8 lg:px-16 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center focus:outline-none">
            <h1 
              className="text-2xl font-black tracking-[0.15em] text-white group-hover:opacity-80 transition-opacity duration-300 drop-shadow-sm"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              POLIVENTS
            </h1>
          </Link>

          <Suspense fallback={<div className="w-[300px] h-9 bg-white/20 rounded-full animate-pulse hidden md:block"></div>}>
            <SearchInput />
          </Suspense>
        </div>

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