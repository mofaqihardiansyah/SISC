// File: src/components/profile/EventCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface EventCardProps {
  id: string | number;
  title: string;
  date: string;
  location: string;
  organizer: string;
  timeLeft?: string;
  image?: string;
  status?: 'upcoming' | 'registered' | 'completed' | 'favorited';
  onFavoriteToggle?: () => void;
  isFavorited?: boolean;
  variant?: 'list' | 'grid'; // list view untuk dashboard, grid untuk favorites
}

export default function EventCard({
  id,
  title,
  date,
  location,
  organizer,
  timeLeft,
  image,
  status,
  onFavoriteToggle,
  isFavorited = false,
  variant = 'list',
}: EventCardProps) {
  if (variant === 'grid') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
        {/* Image */}
        <div className="w-full h-40 bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-white font-bold">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            'Event Image'
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2">
                {title}
              </h3>
              <button
                onClick={onFavoriteToggle}
                className={`text-2xl transition ${isFavorited ? 'text-yellow-400' : 'text-slate-300'}`}
              >
                ⭐
              </button>
            </div>
            {status && (
              <span
                className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                  status === 'upcoming'
                    ? 'bg-yellow-100 text-yellow-800'
                    : status === 'registered'
                      ? 'bg-green-100 text-green-800'
                      : status === 'completed'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-pink-100 text-pink-800'
                }`}
              >
                {status === 'upcoming'
                  ? 'Mendatang'
                  : status === 'registered'
                    ? 'Terdaftar'
                    : status === 'completed'
                      ? 'Selesai'
                      : 'Favorit'}
              </span>
            )}
          </div>

          <div className="space-y-1 text-sm text-slate-600">
            <p>📅 {date}</p>
            <p>📍 {location}</p>
            <p>👤 {organizer}</p>
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-200">
            <Link
              href={`/events/${id}`}
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors text-center"
            >
              Lihat Detail
            </Link>
            <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors">
              Bagikan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List variant (default)
  return (
    <div className="flex flex-col md:flex-row gap-6 p-5 border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer bg-white">
      {/* Event Image */}
      <div className="w-full md:w-40 h-32 bg-gradient-to-br from-slate-300 to-slate-400 rounded-xl overflow-hidden flex-shrink-0">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
            Event Image
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            {status && (
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mt-2 ${
                  status === 'upcoming'
                    ? 'bg-yellow-100 text-yellow-800'
                    : status === 'registered'
                      ? 'bg-green-100 text-green-800'
                      : status === 'completed'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-pink-100 text-pink-800'
                }`}
              >
                {status === 'upcoming'
                  ? 'Mendatang'
                  : status === 'registered'
                    ? 'Terdaftar'
                    : status === 'completed'
                      ? 'Selesai'
                      : 'Favorit'}
              </span>
            )}
          </div>
          <button
            onClick={onFavoriteToggle}
            className={`text-3xl transition flex-shrink-0 ${isFavorited ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-400'}`}
          >
            ⭐
          </button>
        </div>

        <div className="space-y-2 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <span>📅</span>
            {date}
          </p>
          <p className="flex items-center gap-2">
            <span>📍</span>
            {location}
          </p>
          <p className="flex items-center gap-2">
            <span className="w-5 h-5 bg-slate-300 rounded-full inline-flex items-center justify-center text-xs">
              👤
            </span>
            {organizer}
          </p>
        </div>
      </div>

      {/* Countdown & CTA */}
      <div className="flex flex-col gap-3 md:items-end">
        {timeLeft && (
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl text-center">
            <p className="text-xs uppercase tracking-widest opacity-70 font-semibold">
              Dimulai Dalam
            </p>
            <p className="text-sm font-mono font-bold mt-1">{timeLeft}</p>
          </div>
        )}
        <Link
          href={`/events/${id}`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors text-center"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
