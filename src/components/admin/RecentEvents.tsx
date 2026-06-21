import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { normalizeImagePath } from '@/lib/utils/image-utils';
import { Image as ImageIcon } from 'lucide-react';

interface EventData {
  id: number;
  judul: string | null;
  detailLokasi: string | null;
  kuota: number | null;
  urlBanner: string | null;
  status: string | null;
}

interface RecentEventProps {
  events: EventData[];
}

export function RecentEvents({ events }: RecentEventProps) {
  return (
    <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-200 w-full lg:w-[350px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Event Terbaru</h3>
        <Link 
          href="/admin/events" 
          className="text-xxs font-bold text-blue-600 hover:text-blue-700 px-2 py-1 bg-blue-50 rounded-md border border-blue-100 uppercase tracking-tight transition-colors"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="space-y-6">
        {events.length > 0 ? events.map((event) => {
          const statusColor = event.status === 'published' ? 'bg-emerald-500' : 'bg-slate-300';
          const banner = event.urlBanner ? normalizeImagePath(event.urlBanner) : null;

          return (
            <div key={event.id} className="flex items-center gap-4 group cursor-pointer">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm bg-slate-100 flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-105 transition-transform duration-200">
                {banner ? (
                  <Image 
                    src={banner} 
                    alt={event.judul || "Event Banner"} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon size={18} className="text-slate-300" strokeWidth={1.5} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate mt-4">
                  {event.judul || "Tanpa Judul"}
                </h4>
                <p className="text-xxs text-slate-400 font-bold mt-0.5">
                  {event.detailLokasi || "Lokasi menyusul"} • {event.kuota || 0} Kuota
                </p>
              </div>
              <div className={`w-2 h-2 rounded-full ${statusColor} shadow-sm shadow-black/5`} />
            </div>
          );
        }) : (
          <p className="text-xs text-slate-400 text-center py-4 font-medium uppercase">Belum ada event.</p>
        )}
      </div>
    </div>
  );
}
