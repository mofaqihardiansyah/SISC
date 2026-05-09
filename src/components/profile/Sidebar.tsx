"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Bookmark, 
  Info, 
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", href: "/profile/dashboard", icon: LayoutDashboard },
  { label: "Eventku", href: "/profile/eventku", icon: CalendarCheck },
  { label: "Event Favorit", href: "/profile/event-favorit", icon: Bookmark },
  { label: "Akun & Privasi", href: "/profile/settings", icon: Info },
  { label: "Bantuan", href: "/profile/help", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#111827] text-gray-400 flex flex-col h-screen sticky top-0 border-r border-gray-800">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-white tracking-tight">POLIVENTS</h1>
        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-1">Pengunjung</p>
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
                : "text-gray-400 font-medium hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-[#111827]" : "text-gray-500 group-hover:text-white"
              )} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
