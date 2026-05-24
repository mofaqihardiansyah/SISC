import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, trend, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn("bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between", className)}>
      <div className="w-full">
        <div className="flex justify-between items-center gap-2 w-full">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">{title}</p>
          <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-extrabold mt-2 text-gray-900 tracking-tight leading-none truncate" title={String(value)}>
          {value}
        </h3>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-3 pt-2 border-t border-gray-50">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700">
            {trend}
          </span>
          <span className="text-[9px] text-gray-400 font-medium whitespace-nowrap">Bulan ini</span>
        </div>
      )}
    </div>
  );
}