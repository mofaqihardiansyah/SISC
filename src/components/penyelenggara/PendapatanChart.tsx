"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

type FilterType = "bulan-ini" | "bulan-lalu" | "tahun-ini";

interface PendapatanChartProps {
  initialData: { tanggal: string; jumlah: number }[];
}

export function PendapatanChart({ initialData }: PendapatanChartProps) {
  const [filter, setFilter] = useState<FilterType>("bulan-ini");
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (filter === "bulan-ini") {
      return;
    }
    const controller = new AbortController();
    fetch(`/api/organizer/grafik-pendapatan?filter=${filter}`, { signal: controller.signal })
      .then(r => { setLoading(true); return r.json(); })
      .then(setData)
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [filter]);

  const displayData = filter === "bulan-ini" ? initialData : data;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Grafik Pendapatan</h3>
          <p className="text-sm text-gray-400">Data pendapatan real-time</p>
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as FilterType)}
          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl p-2.5 font-bold outline-none"
        >
          <option value="bulan-ini">Bulan Ini</option>
          <option value="bulan-lalu">Bulan Lalu</option>
          <option value="tahun-ini">Tahun Ini</option>
        </select>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-xl">
            <p className="text-sm text-gray-400">Memuat data...</p>
          </div>
        )}
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={displayData} margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="tanggal" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={50} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(val) => `Rp ${Number(val).toLocaleString('id-ID')}`}
              width={90}
            />
            <Tooltip formatter={(val) => [`Rp ${Number(val).toLocaleString('id-ID')}`, 'Pendapatan']} />
            <Bar dataKey="jumlah" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}