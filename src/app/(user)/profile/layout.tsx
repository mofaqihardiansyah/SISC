import React from 'react';
import { Sidebar } from '@/components/profile/Sidebar';
import { Topbar } from '@/components/profile/Topbar';
import { SidebarProvider } from '@/components/layout/SidebarContext';

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}