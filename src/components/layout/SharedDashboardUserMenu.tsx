"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { User, LogOut, Home } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export type UserMenuItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

interface SharedDashboardUserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  roleTitle: string;
  menuItems: UserMenuItem[];
}

export default function SharedDashboardUserMenu({ user, roleTitle, menuItems }: SharedDashboardUserMenuProps) {
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

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 pl-3 border-l border-gray-100 group transition-all"
      >
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {user.name || "User"}
          </p>
          <p className="text-nano font-bold text-blue-600 mt-0.5 uppercase tracking-tighter opacity-80 flex items-center justify-end gap-1">
            {roleTitle}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-400 group-active:scale-95 shadow-sm">
          {user.image ? (
            <Image 
              src={user.image} 
              alt="Profile" 
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-blue-600" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-sm font-bold text-gray-900 truncate">{user.name || "User"}</p>
            <p className="text-xxs text-gray-500 truncate">{user.email || ""}</p>
          </div>
          
          <div className="py-1">
            {(roleTitle === "visitor" || roleTitle === "Pengunjung") && (
              <Link 
                href="/"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100 pb-2 mb-1"
                onClick={() => setIsOpen(false)}
              >
                <Home className="w-4 h-4 text-gray-500" />
                <span>Beranda</span>
              </Link>
            )}
            {menuItems.map((item, idx) => (
              <Link 
                key={idx}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-50 mt-1 pt-1">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
