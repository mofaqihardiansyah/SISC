import { cn } from "@/lib/utils";
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  className?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
}

export function StatCard({ title, value, trend, className, icon: Icon }: StatCardProps) {
  return (
    <div className={cn(
      "bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-between text-center min-h-[140px]",
      className
    )}>
      {/* Icon & Title */}
      <div className="flex flex-col items-center gap-2">
        {Icon && (
          <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <p className="text-xs font-extrabold text-gray-900 uppercase tracking-wide leading-tight">
          {title}
        </p>
      </div>

      {/* Value */}
      <h3 className="text-lg font-medium text-gray-400 leading-tight mt-1">
        {value}
      </h3>

      {/* Trend */}
      <div className="h-6 flex items-center justify-center">
        {trend ? (
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
              {trend}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">Bulan ini</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}