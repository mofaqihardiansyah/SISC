import React from 'react';
import { auth } from "@/auth";
import AdminUserMenu from "./AdminUserMenu";
import { db } from "@/db";

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
    name: dbUser.namaLengkap || session?.user?.name || "Admin POLIVENTS",
    email: dbUser.email || session?.user?.email,
    image: dbUser.avatarUrl || session?.user?.image,
    role: session?.user?.role,
  } : session?.user;

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      
      <div className="flex items-center gap-4">
        {user && <AdminUserMenu user={user} />}
      </div>
    </header>
  );
}
