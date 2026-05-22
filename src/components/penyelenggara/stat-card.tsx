import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  className?: string;
}

export function StatCard({ title, value, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-between text-center min-h-[120px]",
      className
    )}>
      {/* Judul — fixed height agar semua card sejajar */}
      <div className="h-10 flex items-center justify-center">
        <p className="text-xs font-extrabold text-gray-900 uppercase tracking-wide leading-tight">
          {title}
        </p>
      </div>

      {/* Value */}
      <h3 className="text-lg font-medium text-gray-400 leading-tight">
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