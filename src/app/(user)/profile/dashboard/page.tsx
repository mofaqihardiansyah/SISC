import React from 'react';
import Link from 'next/link';
import { 
  Activity, 
  BookOpen,
  Heart,
  Clipboard,
  Clock,
  Megaphone, 
  MapPin, 
  User,
  Calendar,
  Dot,
  Search,
  Bookmark,
  CalendarDays
} from 'lucide-react';

export default function UserDashboard() {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Seminar PPKS',
      date: '11 April 2026',
      location: 'Auditorium Utama Polines',
      organizer: 'bem_polines',
      timeLeft: '1hr : 30m : 40s',
      image: '/images/event1.jpg',
    },
    {
      id: 2,
      title: 'Seminar Cyber Security',
      date: '15 April 2026',
      location: 'Gedung Kerjasama Polines',
      organizer: 'elektro_polines',
      timeLeft: '2hr : 45m : 20s',
      image: '/images/event2.jpg',
    },
  ];

  // Data baru untuk Mading / News Feed
  const announcements = [
    {
      id: 1,
      tag: 'Penting',
      content: 'Pendaftaran Seminar Cyber Security diperpanjang hingga 14 April 2026!',
      date: 'Baru saja',
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 2,
      tag: 'Info',
      content: 'Sertifikat Seminar PPKS sudah dapat diunduh di menu "Tiket Saya".',
      date: '2 jam yang lalu',
      color: 'bg-blue-100 text-blue-600'
    },
  ];

  return (
    <div className="space-y-8">
      {/* PAGE TITLE */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Pengunjung</h1>
        <p className="text-slate-500 mt-2">Selamat datang kembali! Berikut adalah ringkasan aktivitas Anda.</p>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Event Aktif',
            value: 6,
            bg: 'from-emerald-100 to-emerald-50 border-emerald-200',
            renderIcon: () => (
              <div className="w-14 h-14 rounded-lg bg-white/60 flex items-center justify-center">
                <Activity className="w-8 h-8 text-emerald-600" />
              </div>
            ),
          },
          {
            label: 'Event Favorit',
            value: 16,
            bg: 'from-violet-100 to-violet-50 border-violet-200',
            renderIcon: () => (
              <div className="w-14 h-14 rounded-lg bg-white/60 flex items-center justify-center">
                <Bookmark className="w-8 h-8 text-violet-600" />
              </div>
            ),
          },
          {
            label: 'Event Diikuti',
            value: 36,
            bg: 'from-blue-100 to-blue-50 border-blue-200',
            renderIcon: () => (
              <div className="w-14 h-14 rounded-lg bg-white/60 flex items-center justify-center">
                <CalendarDays className="w-8 h-8 text-blue-600" />
              </div>
            ),
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${item.bg} p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all`}
          >
            <div className="flex items-center justify-between">
              {item.renderIcon()}
              <div className="text-right">
                <p className="text-4xl font-extrabold text-slate-900">{item.value}</p>
                <p className="text-xs font-semibold text-slate-600 mt-2 uppercase tracking-wider">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ACARA TERDEKAT SECTION */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Acara Terdekat</h2>
            <p className="text-sm text-slate-500 mt-1">Event yang akan datang dalam waktu dekat</p>
          </div>
          <Link
            href="/profile/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Lihat Selengkapnya →
          </Link>
        </div>

        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>

      {/* MADING DIGITAL / NEWS FEED SECTION */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Megaphone className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Mading Polivent</h2>
            <p className="text-sm text-slate-500">Informasi dan pengumuman terbaru seputar event</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((news) => (
            <div key={news.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200 transition-all cursor-default group">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${news.color}`}>
                  {news.tag}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{news.date}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900">
                {news.content}
              </p>
            </div>
          ))}
        </div>
        
        {/* Simple Marquee-like footer for mading */}
        <div className="mt-6 pt-4 border-t border-dashed border-slate-200">
          <p className="text-xs text-slate-400 italic flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Update otomatis dari sistem mading digital Polines
          </p>
        </div>
      </div>
    </div>
  );
}

// Event Card Component
function EventCard({
  title,
  date,
  location,
  organizer,
  timeLeft,
}: {
  title: string;
  date: string;
  location: string;
  organizer: string;
  timeLeft: string;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-5 border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer bg-white">
      <div className="w-full md:w-40 h-32 bg-gradient-to-br from-slate-300 to-slate-400 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
        Event Image
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <div className="space-y-2 mt-3 text-sm text-slate-600 font-medium">
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            {date}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            {location}
          </p>
          <p className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            {organizer}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 md:items-end">
        <div className="bg-slate-900 text-white px-4 py-3 rounded-xl text-center">
          <p className="text-xs uppercase tracking-widest opacity-70 font-semibold flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            Dimulai Dalam
          </p>
          <p className="text-sm font-mono font-bold mt-1">{timeLeft}</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
          Lihat Detail
        </button>
      </div>
    </div>
  );
}