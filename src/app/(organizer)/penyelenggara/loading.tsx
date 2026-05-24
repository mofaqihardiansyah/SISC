import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-10 pb-10 animate-pulse">
      {/* Welcome Section */}
      <section className="space-y-3">
        <div className="h-10 bg-slate-200 rounded-lg w-1/3"></div>
        <div className="h-5 bg-slate-100 rounded w-1/2"></div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl flex items-center justify-between shadow-sm">
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-slate-100 rounded w-2/3"></div>
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            </div>
            <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
          </div>
        ))}
      </section>

      {/* Charts and Tables */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 h-[400px]">
          <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="w-full h-[280px] bg-slate-100 rounded-2xl flex items-end justify-between p-4">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="w-8 bg-slate-200 rounded-t"
                style={{ height: `${20 + idx * 12}%` }}
              ></div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-5">
          <div className="h-6 bg-slate-200 rounded w-1/2"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-slate-200 rounded-xl flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}