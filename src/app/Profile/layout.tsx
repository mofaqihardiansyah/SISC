'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/pengunjung/sidebar';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/user/profile?userId=1')
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">User Profile</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">
                {user?.namaLengkap || 'Loading...'}
              </p>
              <p className="text-xs text-slate-500">
                {user?.role || 'User'}
              </p>
            </div>

            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
              {user?.namaLengkap
                ? user.namaLengkap
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()
                : '...'}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}