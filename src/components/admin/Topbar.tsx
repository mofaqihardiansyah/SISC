import React from 'react';
import { auth } from "@/auth";
import { db } from "@/db";
import { SharedDashboardTopbar } from '@/components/layout/SharedDashboardTopbar';
import { LayoutDashboard, Settings } from 'lucide-react';
import { SITE } from "@/lib/constants";

interface TopbarProps {
  title: string;
}

export async function Topbar({ title }: TopbarProps) {
  const session = await auth();
  
  let dbUser = null;
  if (session?.user?.id) {
    dbUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, Number(session.user.id)),
    });
  }

  const user = dbUser ? {
    name: dbUser.namaLengkap || session?.user?.name || `Admin ${SITE.NAME}`,
    email: dbUser.email || session?.user?.email,
    image: dbUser.avatarUrl || session?.user?.image,
  } : session?.user;

  const menuItems = [
    { label: "Dashboard Admin", href: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Pengaturan", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <SharedDashboardTopbar 
      title={title} 
      user={user || null} 
      roleTitle={SITE.NAME} 
      menuItems={menuItems}
    />
  );
}