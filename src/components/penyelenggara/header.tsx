import { Plus, Bell } from "lucide-react";
import { auth } from "@/auth";
import DashboardUserMenu from "./DashboardUserMenu";

export async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="h-20 bg-white border-b border-gray-100 pl-16 pr-4 md:px-8 flex items-center justify-between sticky top-0 z-20 transition-all">
      {/* Memberi padding kiri (pl-16) pada mobile agar teks tidak tertutup tombol Hamburger */}
      <div className="truncate pr-4">
        <h1 className="text-xl font-bold font-heading text-gray-900">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Menyembunyikan tombol Buat Event Baru di layar HP agar menu Profile tidak terdorong */}
        <button className="hidden md:flex items-center gap-2 bg-[#1E3A8A] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95">
          <Plus className="w-4 h-4" />
          Buat Event Baru
        </button>

        {user && <DashboardUserMenu user={user} />}
      </div>
    </header>
  );
}
