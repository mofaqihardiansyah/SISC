import { auth } from "@/auth";
import BuatEventButton from "./BuatEventButton";
import { db } from "@/db";
import { SharedDashboardTopbar } from '@/components/layout/SharedDashboardTopbar';
import { LayoutDashboard, Settings } from 'lucide-react';

export async function Header() {
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
    image: dbUser.avatarUrl || session?.user?.image,
  } : session?.user;

  const menuItems = [
    { label: "Dashboard", href: "/penyelenggara", icon: LayoutDashboard },
    { label: "Pengaturan", href: "/penyelenggara/profile", icon: Settings },
  ];

  return (
    <SharedDashboardTopbar 
      title="Dashboard" 
      user={user as any} 
      roleTitle="Penyelenggara" 
      menuItems={menuItems}
    >
      <BuatEventButton />
    </SharedDashboardTopbar>
  );
}