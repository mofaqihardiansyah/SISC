// File: src/components/profile/StatsCard.tsx
'use client';

import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  onClick?: () => void;
}

export default function StatsCard({
  label,
  value,
  icon,
  trend,
  onClick,
}: StatsCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:border-blue-300' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-5xl">{icon}</span>
        <div className="text-right">
          <p className="text-4xl font-extrabold text-slate-900">{value}</p>
          <p className="text-xs font-semibold text-slate-600 mt-2 uppercase tracking-wider">
            {label}
          </p>
          {trend && (
            <p
              className={`text-xs font-bold mt-2 ${
                trend.direction === 'up'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
