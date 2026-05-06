'use client';

import React from 'react';
import Link from 'next/link';

export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: 'Seminar PPKS',
      date: '11 April 2026',
      location: 'Auditorium Utama Polines',
      organizer: 'bem_polines',
      status: 'upcoming',
      participants: 120,
    },
    {
      id: 2,
      title: 'Seminar Cyber Security',
      date: '15 April 2026',
      location: 'Gedung Kerjasama Polines',
      organizer: 'elektro_polines',
      status: 'registered',
      participants: 85,
    },
    {
      id: 3,
      title: 'Workshop Web Development',
      date: '20 April 2026',
      location: 'Lab Komputer Lantai 2',
      organizer: 'ti_polines',
      status: 'completed',
      participants: 45,
    },
  ];

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Event Saya</h1>
        <p className="text-slate-500 mt-2">Kelola semua event yang Anda ikuti atau daftarkan</p>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari event..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Semua Status</option>
            <option>Mendatang</option>
            <option>Terdaftar</option>
            <option>Selesai</option>
          </select>
        </div>
      </div>

      {/* EVENTS LIST */}
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600">
                    {event.title}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      event.status === 'upcoming'
                        ? 'bg-yellow-100 text-yellow-800'
                        : event.status === 'registered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.status === 'upcoming'
                      ? 'Mendatang'
                      : event.status === 'registered'
                        ? 'Terdaftar'
                        : 'Selesai'}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>📅 {event.date}</p>
                  <p>📍 {event.location}</p>
                  <p>👤 {event.organizer} • {event.participants} peserta</p>
                </div>
              </div>
              <div className="flex gap-2 md:flex-col">
                <Link
                  href={`/events/${event.id}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors text-center"
                >
                  Lihat Detail
                </Link>
                <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors">
                  ⭐ Favorit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 text-lg">Anda belum mengikuti event apapun</p>
          <Link
            href="/events"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Jelajahi Event
          </Link>
        </div>
      )}
    </div>
  );
}
