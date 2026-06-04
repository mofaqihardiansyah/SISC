import React from 'react';
import { auth } from "@/auth";
import { db } from "@/db";
import { SharedDashboardTopbar } from '@/components/layout/SharedDashboardTopbar';
import { LayoutDashboard, Settings } from 'lucide-react';

interface TopbarProps {
  title?: string;
}

export async function Topbar({ title = "User Profile" }: TopbarProps) {
  const session = await auth();
  
  let dbUser = null;
  if (session?.user?.id) {
    dbUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, Number(session.user.id)),
    });
  }

  const user = dbUser ? {
    name: dbUser.namaLengkap || session?.user?.name || "Demo User",
    email: dbUser.email || session?.user?.email || "demo@example.com",
    image: dbUser.avatarUrl || session?.user?.image,
  } : session?.user || {
    name: "Demo User",
    email: "demo@example.com",
  };

  const menuItems = [
    { label: "Dashboard", href: "/profile/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Pengaturan", href: "/profile/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <SharedDashboardTopbar 
      title={title} 
      user={user || null} 
      roleTitle={session?.user?.role || "Pengunjung"} 
      menuItems={menuItems}
    />
  );
}
