"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
} from "chart.js";

Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Filler, Tooltip);

interface EventChartProps {
  data: { tanggal: string; jumlah: number }[];
}

export function EventChart({ data }: EventChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: data.map((d) => d.tanggal),
        datasets: [{
          label: "Pendaftar",
          data: data.map((d) => d.jumlah),
          borderColor: "#1E3A8A",
          backgroundColor: "rgba(30, 58, 138, 0.08)",
          borderWidth: 2.5,
          pointBackgroundColor: "#1E3A8A",
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y} pendaftar` } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: "#9CA3AF" } },
          y: { beginAtZero: true, grid: { color: "#F3F4F6" }, ticks: { font: { size: 11 }, color: "#9CA3AF", stepSize: 1 } },
        },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [data]);

  return (
    <div className="w-full h-full min-h-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-extrabold text-gray-900">Grafik Pendaftar Bulan Ini</h4>
      </div>
      <div className="h-[250px] relative">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}