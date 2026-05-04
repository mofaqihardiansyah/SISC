import { Plus, User, Bell } from "lucide-react";
import { auth } from "@/auth";

export async function Header() {
  const session = await auth();

  return (
    <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-xl font-bold font-heading text-gray-900">Dashboard</h1>
      </div>

      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 bg-[#1E3A8A] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95">
          <Plus className="w-4 h-4" />
          Buat Event Baru
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-none">{session?.user?.name}</p>
            <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-tighter">Penyelenggara</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
             {session?.user?.image ? (
                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
             ) : (
                <User className="w-6 h-6 text-gray-400" />
             )}
          </div>
        </div>
      </div>
    </header>
  );
}
