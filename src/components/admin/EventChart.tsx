"use client";

import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  LineChart,
  ComposedChart
} from 'recharts';

interface ChartData {
  name: string;
  count: number;
  registrations: number;
  revenue: number;
  trend: number;
}

interface TooltipPayloadItem {
  value?: number;
  payload?: ChartData;
  dataKey?: string;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-100 min-w-[200px]">
        <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">{label}</p>
        <div className="space-y-2">
          {payload.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <p className="text-[11px] font-bold text-gray-500 uppercase">
                  {item.dataKey === 'count' ? 'EVENT' : 
                   item.dataKey === 'registrations' ? 'DAFTAR' :
                   item.dataKey === 'revenue' ? 'REVENUE' : 'TREN'}
                </p>
              </div>
              <p className="text-xs font-black text-gray-900">
                {Math.round(Number(item.value || 0))}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function EventChart({ data }: { data: ChartData[] }) {
  // Use array for multi-select
  const [activeSeries, setActiveSeries] = React.useState<string[]>([]);

  const toggleSeries = (series: string) => {
    setActiveSeries(prev => 
      prev.includes(series) 
        ? prev.filter(s => s !== series) 
        : [...prev, series]
    );
  };

  const isShowAll = activeSeries.length === 0;

  // Mock data for 12 months if empty
  const chartData = data.length > 0 ? data : [
    { name: 'JAN', count: 8, registrations: 2, revenue: 4, trend: 1 },
    { name: 'FEB', count: 12, registrations: 3, revenue: 6, trend: 1 },
    { name: 'MAR', count: 10, registrations: 2, revenue: 5, trend: 1 },
    { name: 'APR', count: 15, registrations: 5, revenue: 8, trend: 2 },
    { name: 'MEI', count: 18, registrations: 4, revenue: 9, trend: 2 },
    { name: 'JUN', count: 14, registrations: 3, revenue: 7, trend: 2 },
    { name: 'JUL', count: 22, registrations: 6, revenue: 11, trend: 3 },
    { name: 'AGU', count: 20, registrations: 5, revenue: 10, trend: 3 },
    { name: 'SEP', count: 25, registrations: 8, revenue: 13, trend: 4 },
    { name: 'OKT', count: 28, registrations: 10, revenue: 16, trend: 4 },
    { name: 'NOV', count: 24, registrations: 7, revenue: 14, trend: 4 },
    { name: 'DES', count: 30, registrations: 12, revenue: 18, trend: 5 },
  ];

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex-1">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Statistik Pertumbuhan</h3>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Analisis tren 12 bulan terakhir
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => toggleSeries('count')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 shadow-sm border ${
              activeSeries.includes('count')
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white border-gray-100 text-gray-500'
            } ${!isShowAll && !activeSeries.includes('count') ? 'opacity-40 hover:opacity-100' : ''}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${activeSeries.includes('count') ? 'bg-white' : 'bg-blue-600'}`} />
            <span className="text-[10px] font-black tracking-wider">EVENT</span>
          </button>

          <button 
            onClick={() => toggleSeries('registrations')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 shadow-sm border ${
              activeSeries.includes('registrations')
                ? 'bg-emerald-500 border-emerald-500 text-white' 
                : 'bg-white border-gray-100 text-gray-500'
            } ${!isShowAll && !activeSeries.includes('registrations') ? 'opacity-40 hover:opacity-100' : ''}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${activeSeries.includes('registrations') ? 'bg-white' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-black tracking-wider">DAFTAR</span>
          </button>

          <button 
            onClick={() => toggleSeries('revenue')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 shadow-sm border ${
              activeSeries.includes('revenue')
                ? 'bg-orange-500 border-orange-500 text-white' 
                : 'bg-white border-gray-100 text-gray-500'
            } ${!isShowAll && !activeSeries.includes('revenue') ? 'opacity-40 hover:opacity-100' : ''}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${activeSeries.includes('revenue') ? 'bg-white' : 'bg-orange-500'}`} />
            <span className="text-[10px] font-black tracking-wider">REVENUE</span>
          </button>

          <button 
            onClick={() => toggleSeries('trend')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 shadow-sm border ${
              activeSeries.includes('trend')
                ? 'bg-slate-500 border-slate-500 text-white' 
                : 'bg-white border-gray-100 text-gray-500'
            } ${!isShowAll && !activeSeries.includes('trend') ? 'opacity-40 hover:opacity-100' : ''}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${activeSeries.includes('trend') ? 'bg-white' : 'bg-slate-400'}`} />
            <span className="text-[10px] font-black tracking-wider">TREN</span>
          </button>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEvent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} 
            />
            
            {(isShowAll || activeSeries.includes('count')) && (
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#2563eb" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorEvent)" 
                animationDuration={500}
              />
            )}
            
            {(isShowAll || activeSeries.includes('registrations')) && (
              <Line 
                type="monotone" 
                dataKey="registrations" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
                animationDuration={500}
              />
            )}

            {(isShowAll || activeSeries.includes('revenue')) && (
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#f59e0b" 
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                animationDuration={500}
              />
            )}

            {(isShowAll || activeSeries.includes('trend')) && (
              <Line 
                type="monotone" 
                dataKey="trend" 
                stroke="#94a3b8" 
                strokeWidth={2}
                dot={false}
                animationDuration={500}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}