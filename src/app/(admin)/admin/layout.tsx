import React from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { Topbar } from '@/components/admin/Topbar';
import { SidebarProvider } from '@/components/layout/SidebarContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Topbar title="Dashboard" />
          <main className="flex-1 overflow-y-auto h-0 p-4 md:p-6 lg:p-8 bg-slate-100/30">
            <div className="max-w-7xl mx-auto animate-page-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
