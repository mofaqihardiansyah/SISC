'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, User, Search, Bookmark, CalendarDays } from 'lucide-react';

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
          { label: 'Event Aktif', value: 6, icon: <Calendar className="w-8 h-8 text-blue-600" /> },
          { label: 'Event Favorit', value: 16, icon: <Bookmark className="w-8 h-8 text-blue-600" /> },
          { label: 'Event Diikuti', value: 36, icon: <CalendarDays className="w-8 h-8 text-blue-600" /> },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-3xl font-extrabold text-slate-900">{item.value}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              {item.icon}
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

        {upcomingEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">Tidak ada event terdekat saat ini</p>
          </div>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/profile/events"
          className="bg-linear-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-2xl transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Jelajahi Event</h3>
              <p className="text-sm text-purple-100 mt-1">Lihat semua event yang tersedia</p>
            </div>
            <span className="text-3xl group-hover:translate-x-1 transition-transform">🎫</span>
          </div>
        </Link>

        <Link
          href="/profile/event-favorit"
          className="bg-linear-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white p-6 rounded-2xl transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Event Favorit</h3>
              <p className="text-sm text-pink-100 mt-1">Lihat event yang Anda favoritkan</p>
            </div>
            <span className="text-3xl group-hover:translate-x-1 transition-transform">⭐</span>
          </div>
        </Link>
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
      {/* Event Image */}
      <div className="w-full md:w-40 h-32 bg-gradient-to-br from-slate-300 to-slate-400 rounded-xl overflow-hidden flex-shrink-0">
        <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
          Event Image
        </div>
      </div>

      {/* Event Details */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <div className="space-y-2 mt-3 text-sm text-slate-600 font-medium">
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            {date}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            {location}
          </p>
          <p className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            {organizer}
          </p>
        </div>
      </div>

      {/* Countdown & CTA */}
      <div className="flex flex-col gap-3 md:items-end">
        <div className="bg-slate-900 text-white px-4 py-3 rounded-xl text-center">
          <p className="text-xs uppercase tracking-widest opacity-70 font-semibold">Dimulai Dalam</p>
          <p className="text-sm font-mono font-bold mt-1">{timeLeft}</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
          Lihat Detail
        </button>
      </div>
    </div>
  );
}
