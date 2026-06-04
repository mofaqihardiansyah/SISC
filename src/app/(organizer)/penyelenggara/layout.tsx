import { Sidebar } from "@/components/penyelenggara/Sidebar";
import { Topbar } from "@/components/penyelenggara/Topbar";

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto h-0 px-4 md:px-6 lg:px-8">
  {children}
</main>
      </div>
    </div>
  );
}