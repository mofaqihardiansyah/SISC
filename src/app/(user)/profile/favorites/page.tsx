'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      title: 'Seminar PPKS',
      date: '11 April 2026',
      location: 'Auditorium Utama Polines',
      organizer: 'bem_polines',
      category: 'Seminar',
    },
    {
      id: 2,
      title: 'Workshop Web Development',
      date: '20 April 2026',
      location: 'Lab Komputer Lantai 2',
      organizer: 'ti_polines',
      category: 'Workshop',
    },
    {
      id: 3,
      title: 'Konferensi Teknologi AI',
      date: '25 April 2026',
      location: 'Auditorium Besar',
      organizer: 'ai_club_polines',
      category: 'Konferensi',
    },
  ]);

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Event Favorit</h1>
        <p className="text-slate-500 mt-2">
          Anda memiliki {favorites.length} event favorit
        </p>
      </div>

      {/* FILTER */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari event favorit..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Semua Kategori</option>
          <option>Seminar</option>
          <option>Workshop</option>
          <option>Konferensi</option>
        </select>
      </div>

      {/* FAVORITES GRID OR LIST */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Image Placeholder */}
              <div className="w-full h-40 bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-white font-bold">
                Event Image
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2">
                      {event.title}
                    </h3>
                    <span className="text-2xl">⭐</span>
                  </div>
                  <span className="inline-block text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {event.category}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-slate-600">
                  <p>📅 {event.date}</p>
                  <p>📍 {event.location}</p>
                  <p>👤 {event.organizer}</p>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-200">
                  <Link
                    href={`/events/${event.id}`}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors text-center"
                  >
                    Lihat Detail
                  </Link>
                  <button
                    onClick={() => removeFavorite(event.id)}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-lg transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 text-lg mb-4">Anda belum memiliki event favorit</p>
          <Link
            href="/events"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Jelajahi Event
          </Link>
        </div>
      )}
    </div>
  );
}
