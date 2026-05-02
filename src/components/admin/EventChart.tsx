"use client";

import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  ComposedChart,
  Bar
} from 'recharts';

interface ChartData {
  name: string;
  count: number;
  trend: number;
}

interface TooltipPayloadItem {
  value?: number;
  payload?: ChartData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    // Recharts payload can be accessed via .value or .payload
    const count = payload[1]?.value ?? payload[1]?.payload?.count ?? 0;
    const trend = payload[0]?.value ?? payload[0]?.payload?.trend ?? 0;

    return (
      <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
        <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-200" />
            <p className="text-xs font-bold text-gray-700">
              Jumlah Event: <span className="text-blue-600">{count}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <p className="text-xs font-bold text-gray-700">
              Tren: <span className="text-blue-600">{Math.round(Number(trend))}%</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function EventChart({ data }: { data: ChartData[] }) {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 flex-1 min-h-[400px]">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mt-4 uppercase tracking-tight">
            Statistik Event
          </h3>
          <p className="text-sm text-gray-500 mt-1 font-medium">Perbandingan jumlah event dan tren bulanan</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-100" />
            <span className="text-[10px] font-bold text-gray-400 uppercase">Total</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-[10px] font-bold text-gray-400 uppercase">Tren</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full mt-4">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }}
                dy={15}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
              <Area 
                type="monotone" 
                dataKey="trend" 
                stroke="#2563EB" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorCount)" 
                animationDuration={1500}
              />
              <Bar 
                dataKey="count" 
                fill="#DBEAFE" 
                radius={[12, 12, 12, 12]} 
                barSize={45}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 font-medium">
            Tidak ada data untuk ditampilkan.
          </div>
        )}
      </div>
    </div>
  );
}