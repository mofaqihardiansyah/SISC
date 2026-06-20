import { auth } from "@/auth";
import BuatEventButton from "./BuatEventButton";
import { db } from "@/db";
import { SharedDashboardTopbar } from '@/components/layout/SharedDashboardTopbar';
import { LayoutDashboard, Settings } from 'lucide-react';

export async function Topbar() {
  const session = await auth();
  let dbUser = null;
  if (session?.user?.id) {
    dbUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, Number(session.user.id)),
    });
  }

  const user = dbUser ? {
    name: dbUser.namaLengkap || session?.user?.name || "Penyelenggara",
    email: dbUser.email || session?.user?.email,
    image: dbUser.urlAvatar || session?.user?.image,
  } : session?.user;

  const menuItems = [
    { label: "Dashboard", href: "/penyelenggara", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Pengaturan", href: "/penyelenggara/profil", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <SharedDashboardTopbar 
      title="Dashboard" 
      user={user || null} 
      roleTitle="Penyelenggara" 
      menuItems={menuItems}
    >
      <BuatEventButton />
    </SharedDashboardTopbar>
  );
}