"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";

type FilterType = "bulan-ini" | "bulan-lalu" | "tahun-ini";

interface DataPoint {
  tanggal: string;
  jumlah: number;
}

interface EventChartProps {
  initialData: DataPoint[];
  selectedEventId?: string;
}

export function EventChart({ initialData, selectedEventId }: EventChartProps) {
  const [filter, setFilter] = useState<FilterType>("bulan-ini");
  const [data, setData] = useState<DataPoint[]>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const url = new URL("/api/organizer/grafik", window.location.origin);
    url.searchParams.set("filter", filter);
    if (selectedEventId && selectedEventId !== "all") {
      url.searchParams.set("eventId", selectedEventId);
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(url.toString(), { signal: controller.signal });
        if (!res.ok) throw new Error("Gagal mengambil data grafik peserta");
        const json = await res.json();
        setData(json);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [filter, selectedEventId]);

  const displayData = data;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Grafik Peserta</h3>
          <p className="text-sm text-gray-400">Data pendaftaran real-time</p>
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
          <AreaChart data={displayData}>
            <defs>
              <linearGradient id="colorPeserta" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F172B" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0F172B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="tanggal" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip formatter={(val) => [val, 'Pendaftar']} />
            <Area type="monotone" dataKey="jumlah" stroke="#0F172B" fill="url(#colorPeserta)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}