import { auth } from "@/auth";
import DashboardUserMenu from "./DashboardUserMenu";
import BuatEventButton from "./BuatEventButton"; // ← tambah import ini
// hapus import Plus dan Link karena sudah tidak dipakai di sini

export async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="h-20 bg-white border-b border-gray-100 pl-16 pr-4 md:px-8 flex items-center justify-between sticky top-0 z-20 transition-all">
      <div className="truncate pr-4">
        <h1 className="text-xl font-bold font-heading text-gray-900">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <BuatEventButton /> {/* ← ganti Link yang lama dengan ini */}

        {user && <DashboardUserMenu user={user} />}
      </div>
    </header>
  );
}