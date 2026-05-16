import { Sidebar } from "@/components/penyelenggara/sidebar";
import { Header } from "@/components/penyelenggara/header";

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}