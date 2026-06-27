import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Activity, Megaphone, MapPin, Calendar, Bookmark, History } from 'lucide-react';
import { db } from '@/db';
import { auth } from '@/auth';
import { event, favorit, pendaftaran } from '@/db/schema';
import { desc, eq, and, gte, asc, inArray, notInArray, type InferSelectModel } from 'drizzle-orm';
export const dynamic = 'force-dynamic';

type EventRow = InferSelectModel<typeof event>;

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
  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;

  let userBookmarks: { eventId: number | null }[] = [];
  let userRegistrations: { eventId: number | null; userId: number | null; status: string | null }[] = [];
  let activeEvents: EventRow[] = [];
  let upcomingEventsData: EventRow[] = [];
  let latestEventsData: EventRow[] = [];

  try {
    userBookmarks = userId
      ? await db.select({ eventId: favorit.eventId }).from(favorit).where(eq(favorit.userId, userId))
      : [];

    userRegistrations = userId
      ? await db.select().from(pendaftaran).where(eq(pendaftaran.userId, userId))
      : [];

    activeEvents = await db.select()
      .from(event)
      .where(eq(event.status, 'published'));

    upcomingEventsData = userId
      ? await db
          .select()
          .from(event)
          .innerJoin(pendaftaran, eq(pendaftaran.eventId, event.id))
          .where(
            and(
              eq(pendaftaran.userId, userId),
              eq(event.status, 'published'),
              gte(event.tanggalMulai, new Date()),
              eq(pendaftaran.status, 'terdaftar'),
            ),
          )
          .orderBy(asc(event.tanggalMulai))
          .limit(3)
          .then(rows => rows.map(r => r.event))
      : [];

    if (upcomingEventsData.length === 0) {
      upcomingEventsData = await db.select()
        .from(event)
        .where(and(eq(event.status, 'published'), gte(event.tanggalMulai, new Date())))
        .orderBy(asc(event.tanggalMulai))
        .limit(3);
    }

    let preferredKategoriIds: number[] = [];
    if (userId) {
      const userEventIds = [
        ...new Set([
          ...userRegistrations.map(r => r.eventId).filter((id): id is number => id !== null),
          ...userBookmarks.map(b => b.eventId).filter((id): id is number => id !== null),
        ]),
      ];
      if (userEventIds.length > 0) {
        const userEvents = await db
          .select({ kategoriId: event.kategoriId })
          .from(event)
          .where(inArray(event.id, userEventIds));
        preferredKategoriIds = [
          ...new Set(
            userEvents
              .map(e => e.kategoriId)
              .filter((id): id is number => id !== null),
          ),
        ];
      }
    }

    latestEventsData = preferredKategoriIds.length > 0
      ? await db.select()
          .from(event)
          .where(
            and(
              eq(event.status, 'published'),
              inArray(event.kategoriId, preferredKategoriIds),
              ...(userRegistrations.length > 0
                ? [notInArray(event.id, userRegistrations.map(r => r.eventId).filter((id): id is number => id !== null))]
                : []),
            ),
          )
          .orderBy(desc(event.dibuatPada))
          .limit(4)
      : await db.select()
          .from(event)
          .where(eq(event.status, 'published'))
          .orderBy(desc(event.dibuatPada))
          .limit(4);
  } catch (err) {
    console.error('Database query failed in UserDashboard:', err);
  }

  const stats = [
    {
      label: 'Event Aktif',
      value: activeEvents.length,
      bg: 'from-emerald-100 to-emerald-50 border-emerald-200',
      icon: <Activity className="w-8 h-8 text-emerald-600" />
    },
    {
      label: 'Event Favorit',
      value: userBookmarks.length,
      bg: 'from-violet-100 to-violet-50 border-violet-200',
      icon: <Bookmark className="w-8 h-8 text-violet-600" />
    },
    {
      label: 'Event Diikuti',
      value: userRegistrations.length,
      bg: 'from-blue-100 to-blue-50 border-blue-200',
      icon: <History className="w-8 h-8 text-blue-600" />
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-500">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pusat Aktivitas Anda</h1>
        <p className="text-slate-500 mt-2">Pantau event favorit dan riwayat kegiatan Anda di sini</p>
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
                id={data.id}
                date={data.tanggalMulai ? new Date(data.tanggalMulai).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBA'}
                location={data.detailLokasi ?? 'TBA'}
                urlBanner={data.urlBanner}
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
          {latestEventsData.length > 0 ? (
            latestEventsData.map((data) => (
              <div key={data.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-1 rounded text-xxs font-black bg-blue-100 text-blue-600 uppercase tracking-wider">
                    Event Baru
                  </span>
                  <span className="text-xxs text-slate-400 font-medium">
                    {data.dibuatPada
                      ? `${String(new Date(data.dibuatPada).getDate()).padStart(2, '0')}-${String(new Date(data.dibuatPada).getMonth() + 1).padStart(2, '0')}-${new Date(data.dibuatPada).getFullYear()}`
                      : ''}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900">
                  <span className="font-bold text-sisc-navy">{data.judul}</span> telah dibuka pendaftarannya! Jangan sampai kehabisan kuota.
                </p>
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

function EventCard({ judul, id, date, location, urlBanner }: {
  judul: string | null;
  id: number;
  date: string;
  location: string;
  urlBanner: string | null;
}) {
  return (
    <Link href={`/event/${id}`} className="block flex flex-col md:flex-row gap-6 p-5 border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all group bg-white">
      <div className="w-full md:w-40 h-32 bg-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-slate-200 relative">
        {urlBanner ? (
          <Image src={urlBanner} alt={judul ?? ''} fill className="object-cover" sizes="(max-width: 768px) 100vw, 160px" />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs p-2 text-center italic">Tanpa Banner</div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 uppercase">{judul}</h3>
          <div className="space-y-1 mt-2 text-sm text-slate-500">
            <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {date}</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {location}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex md:justify-end">
          <span className="text-sm font-bold text-blue-600 hover:underline group-hover:underline">Lihat Detail</span>
        </div>
      </div>
    </Link>
  );
}
