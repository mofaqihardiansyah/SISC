import { Search } from "lucide-react"; 

export default function Navbar() {
  return (
    <nav className="bg-[#1e293b] text-white px-6 py-4 flex items-center justify-between">
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
        <a href="#" className="hover:text-gray-300">Beranda</a>
        <a href="#" className="hover:text-gray-300">Jelajah</a>
        <a href="#" className="hover:text-gray-300">Bantuan</a>
        <a href="#" className="hover:text-gray-300">Daftar</a>
        <button className="bg-white text-[#1e293b] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition">
          Masuk
        </button>
      </div>
    </nav>
  );
}