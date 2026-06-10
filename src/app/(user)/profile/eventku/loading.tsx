import EventCardSkeleton from '@/components/profile/EventCardSkeleton';

export default function Loading() {
  return (
    <div className="max-w-6xl w-full mx-auto animate-in fade-in duration-500">
      {/* Skeleton Filter Section */}
      <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 flex flex-wrap lg:flex-nowrap gap-4 items-end mb-10 shadow-sm">
        <div className="flex-1 min-w-48 space-y-2">
          <div className="w-20 h-3 bg-slate-200 rounded animate-pulse"></div>
          <div className="w-full h-10 bg-slate-100 rounded-xl animate-pulse"></div>
        </div>
        <div className="w-full lg:w-48 space-y-2">
          <div className="w-20 h-3 bg-slate-200 rounded animate-pulse"></div>
          <div className="w-full h-10 bg-slate-100 rounded-xl animate-pulse"></div>
        </div>
        <div className="w-full lg:w-32 h-10 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>

      {/* Skeleton Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 bg-slate-200 rounded-full animate-pulse"></div>
        <div className="w-40 h-6 bg-slate-200 rounded animate-pulse"></div>
      </div>
      
      {/* Skeleton Event Cards */}
      <div className="flex flex-col gap-5">
        <EventCardSkeleton />
        <EventCardSkeleton />
        <EventCardSkeleton />
      </div>
    </div>
  );
}
