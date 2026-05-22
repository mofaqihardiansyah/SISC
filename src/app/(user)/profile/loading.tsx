import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 animate-pulse">
      {/* Profile Header Block */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 mb-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-slate-200"></div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="h-6 bg-slate-200 rounded w-48 mx-auto md:mx-0"></div>
          <div className="h-4 bg-slate-100 rounded w-64 mx-auto md:mx-0"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Areas (Left/Center columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-slate-150 rounded w-1/3"></div>
                  <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
                </div>
              ))}
            </div>
            <div className="h-11 bg-slate-200 rounded-xl w-32 mt-4 ml-auto"></div>
          </div>
        </div>

        {/* Sidebar Info/Quick Links (Right column) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="h-5 bg-slate-200 rounded w-1/2"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50">
                  <div className="h-4 bg-slate-150 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}