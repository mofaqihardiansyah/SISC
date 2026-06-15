import { Sidebar } from "@/components/penyelenggara/Sidebar";
import { Topbar } from "@/components/penyelenggara/Topbar";
import { SidebarProvider } from '@/components/layout/SidebarContext';

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-slate-50">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />

          <main className="flex-1 overflow-y-auto h-0 px-4 md:px-6 lg:px-8 bg-slate-50/50">
            <div className="max-w-7xl mx-auto w-full py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}