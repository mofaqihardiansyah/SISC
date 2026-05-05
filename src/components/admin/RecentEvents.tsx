import React from 'react';
import Image from 'next/image';
import { normalizeImagePath } from '@/lib/utils/image-utils';

const DEFAULT_EVENT_IMAGE = "/placeholder-banner.png";

interface EventData {
  id: number;
  judul: string | null;
  detailLokasi: string | null;
  kuota: number | null;
  bannerUrl: string | null;
  status: string | null;
}

interface RecentEventProps {
  events: EventData[];
}

export function RecentEvents({ events }: RecentEventProps) {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 w-full lg:w-[350px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Event Terbaru</h3>
        <button className="text-blue-600 text-[10px] font-black uppercase hover:underline">Lihat Semua</button>
      </div>

      <div className="space-y-6">
        {events.length > 0 ? events.map((event) => {
          const statusColor = event.status === 'published' ? 'bg-emerald-500' : 'bg-slate-300';
          const banner = normalizeImagePath(event.bannerUrl, DEFAULT_EVENT_IMAGE);

          return (
            <div key={event.id} className="flex items-center gap-4 group cursor-pointer">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Image 
                  src={banner} 
                  alt={event.judul || "Event Banner"} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate mt-4">
                  {event.judul || "Tanpa Judul"}
                </h4>
                <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                  {event.detailLokasi || "Lokasi menyusul"} • {event.kuota || 0} Kuota
                </p>
              </div>
              <div className={`w-2 h-2 rounded-full ${statusColor} shadow-sm shadow-black/5`} />
            </div>
          );
        }) : (
          <p className="text-xs text-gray-400 text-center py-4 font-medium uppercase">Belum ada event.</p>
        )}
      </div>
    </div>
  );
}
