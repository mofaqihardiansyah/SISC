import React from 'react';
import Link from 'next/link';
import { Activity, Megaphone, MapPin, Calendar, Bookmark, History } from 'lucide-react';
import { db } from '@/db'; 
import { event, pemberitahuan, favorit, pendaftaran } from '@/db/schema'; 
import { desc, eq, count } from 'drizzle-orm';

function StatsCard({ label, value, bg, renderIcon }: { 
  label: string; 
  value: number | string; 
  bg: string; 
  renderIcon: () => React.ReactNode; 
}) {
  return (
    <div className={`bg-gradient-to-br ${bg} p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-center justify-between">
        {renderIcon()}
        <div className="text-right">
          <p className="text-4xl font-extrabold text-slate-900">{value}</p>
          <p className="text-xs font-semibold text-slate-600 mt-2 uppercase tracking-wider">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default async function UserDashboard() {
  const activeEvents = await db.select().from(event).where(eq(event.status, 'published'));
  const upcomingEventsData = await db.select().from(event).limit(3);
  const pemberitahuanData = await db.select().from(pemberitahuan).orderBy(desc(pemberitahuan.createdAt)).limit(4);
  
  const favoriteRes = await db.select({ value: count() }).from(favorit);
  const registeredRes = await db.select({ value: count() }).from(pendaftaran);

  const stats = [
    {
      label: 'Event Aktif',
      value: activeEvents.length,
      bg: 'from-emerald-100 to-emerald-50 border-emerald-200',
      icon: <Activity className="w-8 h-8 text-emerald-600" />
    },
    {
      label: 'Event Favorit',
      value: favoriteRes[0]?.value ?? 0, 
      bg: 'from-violet-100 to-violet-50 border-violet-200',
      icon: <Bookmark className="w-8 h-8 text-violet-600" />
    },
    {
      label: 'Event Diikuti',
      value: registeredRes[0]?.value ?? 0, 
      bg: 'from-blue-100 to-blue-50 border-blue-200',
      icon: <History className="w-8 h-8 text-blue-600" />
    },
  ];

  const getRelativeTime = (date: Date | null | undefined) => {
    if (!date) return 'Waktu tidak tersedia';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Baru saja';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}j lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-8 p-6 md:p-8 bg-slate-50">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pusat Aktivitas Anda</h1>
        <p className="text-slate-500 mt-2">Pantau event favorit dan riwayat kegiatan Anda di sini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <StatsCard 
            key={index}
            label={item.label}
            value={item.value}
            bg={item.bg}
            renderIcon={() => <div className="w-14 h-14 rounded-lg bg-white/60 flex items-center justify-center">{item.icon}</div>}
          />
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Acara Terdekat</h2>
            <p className="text-sm text-slate-500 mt-1">Jangan lewatkan kesempatan bergabung</p>
          </div>
          <Link href="/profile/eventku" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
            Lihat Selengkapnya <span className="text-lg">→</span>
          </Link>
        </div>

        <div className="space-y-4">
          {upcomingEventsData.length > 0 ? (
            upcomingEventsData.map((data) => (
              <EventCard 
                key={data.id} 
                judul={data.judul}
                slug={data.slug ?? ''}
                date={'TBA'} 
                location={'TBA'} 
                organizer={`Penyelenggara ID: ${data.organizerId}`} 
                bannerUrl={data.bannerUrl}
              />
            ))
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50">
              <p className="text-slate-500 text-sm">Belum ada acara terdekat saat ini.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Megaphone className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Mading Polivent</h2>
            <p className="text-sm text-slate-500">Informasi event terbaru yang bisa Anda ikuti</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pemberitahuanData.length > 0 ? (
            pemberitahuanData.map((news) => (
              <div key={news.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${news.tag === 'Penting' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {news.tag}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{getRelativeTime(news.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900">{news.isi}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50 col-span-2">
              <p className="text-slate-500 text-sm">Belum ada pengumuman baru.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCard({ judul, slug, date, location, organizer, bannerUrl }: {
  judul: string;
  slug: string;
  date: string;
  location: string;
  organizer: string;
  bannerUrl: string | null;
}) {
  return (
    <Link href={`/events/${slug}`} className="block flex flex-col md:flex-row gap-6 p-5 border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all group bg-white">
      <div className="w-full md:w-40 h-32 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-200">
        {bannerUrl ? (
          <img src={bannerUrl} alt={judul} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs p-2 text-center italic">Tanpa Banner</div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase">
            {judul}
          </h3>
          <div className="space-y-1 mt-2 text-sm text-slate-500">
            <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {date}</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {location}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex md:justify-end">
          <span className="text-sm font-bold text-blue-600 group-hover:underline">Detail Acara</span>
        </div>
      </div>
    </Link>
  );
}