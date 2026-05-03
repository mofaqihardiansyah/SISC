'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const profileMenuItems = [
  { href: '/profile/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/profile/events', label: 'Event Saya', icon: '🎫' },
  { href: '/profile/favorites', label: 'Favorit', icon: '⭐' },
  { href: '/profile/tickets', label: 'Tiket Saya', icon: '🎟️' },
  { href: '/profile/settings', label: 'Pengaturan Akun', icon: '⚙️' },
  { href: '/profile/help', label: 'Bantuan', icon: '❓' },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col fixed h-full shadow-lg">
        {/* Brand */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold tracking-tighter">POLIVENTS</h1>
          <p className="text-xs text-slate-400 mt-1">Event Management</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {profileMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-700 space-y-3">
          <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">User Profile</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">Faqih Ardiansyah</p>
              <p className="text-xs text-slate-500">Pengunjung</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
              FA
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
