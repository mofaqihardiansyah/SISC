import { Plus, Bell } from "lucide-react";
import { auth } from "@/auth";
import DashboardUserMenu from "./DashboardUserMenu";

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

        {session?.user && <DashboardUserMenu user={session.user} />}
      </div>
    </header>
  );
}
