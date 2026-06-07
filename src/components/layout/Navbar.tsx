import Link from "next/link";
import { auth } from "@/auth";
import UserMenu from "./UserMenu";
import SearchInput from "./SearchInput";
import { Suspense } from "react";
import { db } from "@/db";

export default async function Navbar() {
  const session = await auth();

  let dbUser = null;
  if (session?.user?.id) {
    dbUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, Number(session.user.id)),
    });
  }

  const user = dbUser ? {
    name: dbUser.namaLengkap || session?.user?.name || "User",
    email: dbUser.email || session?.user?.email,
    image: dbUser.avatarUrl || session?.user?.image,
    role: session?.user?.role,
  } : session?.user;

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
                <button className="bg-white text-slate-900 px-5 py-2 rounded-xl font-bold transition-all duration-200 hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md cursor-pointer">
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