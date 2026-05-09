export default function EventCardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-white border border-slate-100 rounded-3xl animate-pulse">
      <div className="w-full md:w-48 h-36 bg-slate-200 rounded-2xl flex-shrink-0"></div>
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="w-20 h-5 bg-slate-200 rounded-full"></div>
          <div className="w-3/4 h-6 bg-slate-200 rounded-lg"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-200 rounded"></div>
              <div className="w-32 h-4 bg-slate-200 rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-200 rounded"></div>
              <div className="w-40 h-4 bg-slate-200 rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-200 rounded"></div>
              <div className="w-28 h-4 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-4 md:items-end">
        <div className="w-10 h-10 bg-slate-200 rounded-2xl"></div>
        <div className="flex flex-col gap-3">
          <div className="w-28 h-8 bg-slate-200 rounded-xl"></div>
          <div className="w-24 h-10 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}