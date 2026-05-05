"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface DashboardUserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function DashboardUserMenu({ user }: DashboardUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-6 border-l border-gray-100 group transition-all"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {user.name}
          </p>
          <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-tighter opacity-80">
            Admin
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-400 group-active:scale-95 shadow-sm">
          {user.image ? (
            <img 
              src={user.image} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
            <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
          </div>
          
          <div className="py-1">
            <Link 
              href="/penyelenggara"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Utama
            </Link>
            <Link 
              href="/penyelenggara/profile"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Pengaturan Akun
            </Link>
          </div>

          <div className="border-t border-gray-50 mt-1 pt-1">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Keluar Sesi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
