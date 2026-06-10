"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import UserMenu from "./UserMenu";
import SearchInput from "./SearchInput";
import { Button } from '@/components/ui/button';
import { Suspense } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user ?? null;
  const [mobileOpen, setMobileOpen] = useState(false);

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

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/">Beranda</Link>
          <Link href="/jelajah">Jelajah</Link>
          <Link href="/bantuan">Bantuan</Link>

          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                href="/register"
                className="px-4 py-2 rounded-xl transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
              >
                Daftar
              </Link>
              <Link href="/login">
                <Button variant="outline" className="bg-white text-slate-900 border-0 px-5 py-2">
                  Masuk
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger button */}
        <Button
          onClick={() => setMobileOpen(!mobileOpen)}
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 w-72 h-full bg-[var(--brand-dark)] shadow-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-right duration-200">
            <div className="flex justify-end">
              <Button
                onClick={() => setMobileOpen(false)}
                variant="ghost"
                size="icon"
                aria-label="Tutup menu"
              >
                <X size={24} />
              </Button>
            </div>

            <Link href="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2 hover:text-slate-300 transition-colors">
              Beranda
            </Link>
            <Link href="/jelajah" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2 hover:text-slate-300 transition-colors">
              Jelajah
            </Link>
            <Link href="/bantuan" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2 hover:text-slate-300 transition-colors">
              Bantuan
            </Link>

            <div className="border-t border-white/10 pt-4 mt-2">
              {user ? (
                <div className="space-y-2">
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="block text-sm font-medium py-2 hover:text-slate-300 transition-colors">
                    Profil
                  </Link>
                  <Link href="/profile/dashboard" onClick={() => setMobileOpen(false)} className="block text-sm font-medium py-2 hover:text-slate-300 transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/profile/eventku" onClick={() => setMobileOpen(false)} className="block text-sm font-medium py-2 hover:text-slate-300 transition-colors">
                    Event Saya
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full border-white/20">
                      Daftar
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full bg-white text-slate-900 border-0">
                      Masuk
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
