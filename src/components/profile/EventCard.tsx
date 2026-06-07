// File: src/components/profile/EventCard.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, User, Bookmark, ImageOff, Palette } from 'lucide-react';

interface EventCardProps {
  id: string | number;
  title: string;
  date: string;
  location: string;
  organizer: string;
  timeLeft?: string;
  image?: string;
  status?: 'pending' | 'registered' | 'completed' | 'favorited';
  onFavoriteToggle?: () => void;
  isFavorited?: boolean;
  priority?: boolean;
  variant?: 'list' | 'grid';
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
  priority = false,
  variant = 'list',
}: EventCardProps) {
  const [bookmarked, setBookmarked] = useState(isFavorited);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setBookmarked((prev) => !prev);
    onFavoriteToggle?.();
  };

  if (variant === 'grid') {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        {/* Image */}
        <div className="relative w-full h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              priority={priority}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
              <Palette className="w-10 h-10 text-slate-300" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                bookmarked
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                  : 'bg-white/70 text-slate-400 hover:bg-white hover:text-slate-900'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            {status && (
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
                  status === 'pending'
                    ? 'bg-amber-50 text-amber-600 border border-amber-100'
                    : status === 'registered'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : status === 'completed'
                        ? 'bg-slate-50 text-slate-600 border border-slate-100'
                        : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    status === 'pending'
                      ? 'bg-amber-400'
                      : status === 'registered'
                        ? 'bg-emerald-400'
                        : status === 'completed'
                          ? 'bg-slate-400'
                          : 'bg-rose-400'
                  }`}
                ></span>
                {status === 'pending'
                  ? 'Menunggu Verifikasi'
                  : status === 'registered'
                    ? 'Terdaftar'
                    : status === 'completed'
                      ? 'Selesai'
                      : 'Favorit'}
              </span>
            )}
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 line-clamp-2 transition-colors">
              {title}
            </h3>
          </div>

          <div className="space-y-2 text-sm text-slate-500 font-medium">
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              {date}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="truncate">{location}</span>
            </p>
            <p className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              {organizer}
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Link
              href={`/event/${id}`}
              className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md text-center"
            >
              Lihat Detail
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // List variant (default)
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-white border border-slate-100 rounded-3xl hover:border-slate-300 hover:shadow-xl hover:shadow-slate-500/5 transition-all duration-300 group relative overflow-hidden">
      {/* Event Image */}
      <div className="relative w-full md:w-48 h-36 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
        {image ? (
          <Image
            src={image}
            alt={title}
            priority={priority}
            fill
            sizes="(max-width: 768px) 100vw, 192px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
            <ImageOff size={40} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="flex-1 flex flex-col justify-between z-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {status && (
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
                  status === 'pending'
                    ? 'bg-amber-50 text-amber-600 border border-amber-100'
                    : status === 'registered'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : status === 'completed'
                        ? 'bg-slate-50 text-slate-600 border border-slate-100'
                        : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    status === 'pending'
                      ? 'bg-amber-400'
                      : status === 'registered'
                        ? 'bg-emerald-400'
                        : status === 'completed'
                          ? 'bg-slate-400'
                          : 'bg-rose-400'
                  }`}
                ></span>
                {status === 'pending'
                  ? 'Menunggu Verifikasi'
                  : status === 'registered'
                    ? 'Terdaftar'
                    : status === 'completed'
                      ? 'Selesai'
                      : 'Favorit'}
              </span>
            )}
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-slate-700 transition-colors mb-4">
            {title}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-500 font-medium">
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              {date}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              {location}
            </p>
            <p className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              {organizer}
            </p>
          </div>
        </div>
      </div>

      {/* Countdown & CTA */}
      <div className="flex flex-col justify-between gap-4 md:items-end z-10">
        <div className="flex items-start justify-end gap-2">
          <button
            onClick={handleBookmarkToggle}
            className={`p-3 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 ${
              bookmarked
                ? 'bg-slate-900 text-white border border-slate-900 shadow-sm'
                : 'bg-slate-50 text-slate-300 hover:text-slate-900 border border-slate-100 hover:border-slate-900'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {timeLeft && (
            <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-center shadow-lg shadow-slate-200">
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-bold">
                Dimulai Dalam
              </p>
              <p className="text-xs font-mono font-bold mt-0.5">{timeLeft}</p>
            </div>
          )}
          <Link
            href={`/event/${id}`}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md text-center"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}