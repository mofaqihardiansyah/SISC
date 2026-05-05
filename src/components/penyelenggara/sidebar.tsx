"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarRange, 
  Users, 
  UserCircle, 
  HelpCircle,
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const menuItems = [
  { label: "Dashboard", href: "/penyelenggara", icon: LayoutDashboard },
  { label: "Kelola Event", href: "/penyelenggara/event", icon: CalendarRange },
  { label: "Informasi Peserta", href: "/penyelenggara/peserta", icon: Users },
  { label: "Profil Akun", href: "/penyelenggara/profil", icon: UserCircle },
  { label: "Bantuan", href: "/penyelenggara/bantuan", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#111827] text-gray-400 flex flex-col h-screen sticky top-0 border-r border-gray-800">
      {/* Logo Section */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-white tracking-tight">
          POLIVENTS
        </h1>
        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-1">Penyelenggara</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-white text-[#111827] font-semibold shadow-lg shadow-white/5" 
                  : "hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-[#111827]" : "text-gray-500 group-hover:text-white"
              )} />
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 mt-auto border-t border-gray-800">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 text-gray-500"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
