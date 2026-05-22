"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

type FilterType = "bulan-ini" | "bulan-lalu" | "tahun-ini";

interface ViewChartProps {
  initialData: { tanggal: string; jumlah: number }[];
}

export function ViewChart({ initialData }: ViewChartProps) {
  const [filter, setFilter] = useState<FilterType>("bulan-ini");
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (filter === "bulan-ini") {
      setData(initialData);
      return;
    }
    setLoading(true);
    fetch(`/api/organizer/grafik-tayangan?filter=${filter}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Grafik Total Tayangan</h3>
          <p className="text-sm text-gray-400">Data tayangan real-time</p>
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
          <BarChart layout="vertical" data={data} margin={{ left: 40, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="tanggal" tick={{ fontSize: 10 }} width={50} />
            <Tooltip formatter={(val) => [Number(val).toLocaleString('id-ID'), 'Tayangan']} />
            <Bar dataKey="jumlah" fill="#f59e0b" radius={[0, 4, 4, 0]} maxBarSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}