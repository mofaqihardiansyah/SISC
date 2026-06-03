import React from 'react';
import { auth } from "@/auth";
import AdminUserMenu from "./AdminUserMenu";
import BuatEventButton from "@/components/penyelenggara/BuatEventButton";

interface TopbarProps {
  title: string;
}

export async function Topbar({ title }: TopbarProps) {
  const session = await auth();

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      
      <div className="flex items-center gap-4">
        <BuatEventButton />
        {session?.user && <AdminUserMenu user={session.user} />}
      </div>
    </header>
  );
}