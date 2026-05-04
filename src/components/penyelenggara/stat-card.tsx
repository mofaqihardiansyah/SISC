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
    <div className={cn("bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-extrabold mt-2 text-gray-900">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                {trend}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">Bulan ini</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
