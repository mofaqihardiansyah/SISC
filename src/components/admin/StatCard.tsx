import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'yellow' | 'purple' | 'green' | 'red';
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-500',
    text: 'text-blue-600',
  },
  yellow: {
    bg: 'bg-amber-50',
    icon: 'bg-amber-500',
    text: 'text-amber-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-500',
    text: 'text-purple-600',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-500',
    text: 'text-green-600',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-500',
    text: 'text-red-600',
  },
};

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const style = colorStyles[color];

  return (
    <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-50 flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0", style.icon)}>
        <Icon size={24} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-black text-gray-900">{value}</h3>
      </div>
    </div>
  );
}
