import EventCardSkeleton from '@/components/profile/EventCardSkeleton';

function SidebarItemLoading({ active = false }: { active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 px-6 py-3 ${active ? 'bg-white text-[#0F172A] font-bold rounded-l-full ml-2' : ''}`}>
      <div className="w-5 h-5 bg-slate-500/50 rounded animate-pulse"></div>
      <div className="w-24 h-4 bg-slate-500/50 rounded animate-pulse"></div>
    </div>
  );
}

function EventkuLoading() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="w-64 bg-[#0F172A] text-white hidden md:flex flex-col fixed h-full shadow-2xl z-30">
        <div className="p-8"><h1 className="text-2xl font-bold tracking-tight">POLIVENTS</h1></div>
        <nav className="flex-1 px-4 space-y-1">
          <SidebarItemLoading />
          <SidebarItemLoading />
          <SidebarItemLoading active />
          <SidebarItemLoading />
          <SidebarItemLoading />
          <SidebarItemLoading />
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 flex flex-col">
        <header className="h-16 bg-[#0E215D] flex items-center justify-between px-4 md:px-8 text-white sticky top-0 z-20 shadow-lg">
          <div className="w-24 h-6 bg-white/20 animate-pulse rounded"></div>
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 bg-white/20 animate-pulse rounded"></div>
            <div className="w-9 h-9 bg-white/20 animate-pulse rounded-full"></div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl w-full mx-auto">
          <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 flex flex-wrap lg:flex-nowrap gap-4 items-end mb-10 shadow-sm">
            <div className="flex-1 min-w-[200px] space-y-2">
              <div className="w-20 h-3 bg-slate-200 rounded animate-pulse"></div>
              <div className="w-full h-10 bg-slate-100 rounded-md animate-pulse"></div>
            </div>
            <div className="w-full lg:w-48 space-y-2">
              <div className="w-20 h-3 bg-slate-200 rounded animate-pulse"></div>
              <div className="w-full h-10 bg-slate-100 rounded-md animate-pulse"></div>
            </div>
            <div className="w-full lg:w-auto h-10 bg-slate-100 rounded-md animate-pulse"></div>
          </div>

          <div className="w-40 h-6 bg-slate-200 rounded animate-pulse mb-6"></div>
          
          <div className="flex flex-col gap-5">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Loading() {
  return <EventkuLoading />;
}
