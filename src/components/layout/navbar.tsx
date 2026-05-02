import { Search, User } from "lucide-react"; 
import Link from "next/link";
import { auth } from "@/auth";

export default async function Navbar() {
  const session = await auth();
  return (
    <nav className="bg-[var(--brand-dark)] text-white px-6 py-4 flex items-center justify-between">
      {/* bagian logo polivents sama Search bar */}
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold tracking-wider">POLIVENTS</h1>
        
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari Seminar, Kota, atau Kategori" 
            className="pl-10 pr-4 py-2 rounded-full text-sm text-black bg-white w-[300px] focus:outline-none"
          />
        </div>
      </div>

      {/* ini button buat nge-Link(?) */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link href="/" className="hover:text-gray-300">Beranda</Link>
        <Link href="/explore" className="hover:text-gray-300">Jelajah</Link>
        <Link href="/help" className="hover:text-gray-300">Bantuan</Link>
        
        {session ? (
          <Link href="/dashboard" className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-md hover:bg-white/20 transition">
            <User className="w-4 h-4" />
            <span>{session.user?.name || "Profil"}</span>
          </Link>
        ) : (
          <>
            <Link href="/register" className="hover:text-gray-300">Daftar</Link>
            <Link href="/login">
              <button className="bg-white text-[var(--brand-dark)] px-6 py-2 rounded-md font-bold hover:bg-gray-100 transition">
                Masuk
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}