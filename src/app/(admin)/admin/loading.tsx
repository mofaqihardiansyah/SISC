import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 animate-pulse">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-2">
          <div className="h-8 bg-slate-200 rounded-lg w-48"></div>
          <div className="h-4 bg-slate-150 rounded-lg w-72"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-32"></div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-3 shadow-sm">
            <div className="h-4 bg-slate-150 rounded w-1/3"></div>
            <div className="h-8 bg-slate-200 rounded w-2/3"></div>
            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="flex gap-2">
            <div className="h-9 bg-slate-150 rounded-lg w-28"></div>
            <div className="h-9 bg-slate-150 rounded-lg w-28"></div>
          </div>
        </div>

        {/* Table Rows Skeleton */}
        <div className="space-y-4">
          <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100">
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-10 h-10 rounded-full bg-slate-150"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-slate-200 rounded w-20"></div>
              <div className="h-4 bg-slate-150 rounded w-24"></div>
              <div className="h-8 bg-slate-100 rounded-lg w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}