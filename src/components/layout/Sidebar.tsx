"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MenuItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  exactMatch?: boolean;
};

interface SidebarProps {
  roleTitle: string;
  menuItems: MenuItem[];
}

export function Sidebar({ roleTitle, menuItems }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Menutup sidebar otomatis saat pengguna berpindah halaman (di mobile)
  if (pathname !== prevPathname) {
    setIsOpen(false);
    setPrevPathname(pathname);
  }

  return (
    <>
      {/* Tombol Hamburger (Hanya muncul di Mobile) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-5 left-4 z-60 p-2 bg-slate-900 text-white rounded-xl shadow-md hover:bg-slate-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        {isOpen ? <MoreVertical className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay Background Gelap saat Sidebar Terbuka di Mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-400 flex flex-col h-screen border-r border-slate-800 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="p-6 hidden md:block">
          <h1 className="text-xl font-bold text-white tracking-tight">
            POLIVENTS
          </h1>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-1">{roleTitle}</p>
        </div>
        
        {/* Spasi tambahan untuk mobile agar menu tidak tertutup tombol hamburger */}
        <div className="h-24 md:hidden"></div>
 
        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = item.exactMatch
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');
 
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-white text-slate-900 font-semibold shadow-lg shadow-white/5" 
                  : "text-slate-400 font-medium hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-slate-900" : "text-slate-500 group-hover:text-white"
                )} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
