import React from 'react';
import Navbar from '../components/layout/navbar';  
import { HeroBanner } from '../components/beranda/HeroBanner';
import { CategoryList } from '../components/beranda/CategoryList';
import { EventCard } from '../components/beranda/EventCard';
import { db } from '@/db';
import { event, kategori } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { formatCurrency, formatEventDate } from '@/lib/formatters';
import { EVENT_LIMITS, ASSETS } from '@/lib/constants';

export default async function HalamanBeranda() {
  // Mengambil kategori untuk CategoryList
  const dbKategori = await db.query.kategori.findMany();

  // Mengambil event Terpopuler untuk Hero Banner (Berdasarkan jumlahTayangan)
  const dbEventTerpopuler = await db.query.event.findMany({
    limit: EVENT_LIMITS.HERO,
    orderBy: [desc(event.jumlahTayangan)],
    with: {
      kategori: true,
      kota: true,
    }
  });

  // Mengambil event Polines
  const dbEventPolines = await db.query.event.findMany({
    where: eq(event.isEventPolines, true),
    limit: EVENT_LIMITS.LIST,
    orderBy: [desc(event.tanggalMulai)],
    with: {
      kategori: true,
      organizer: true
    }
  });

  // Mengambil event Umum
  const dbEventUmum = await db.query.event.findMany({
    where: eq(event.isEventPolines, false),
    limit: EVENT_LIMITS.LIST,
    orderBy: [desc(event.tanggalMulai)],
    with: {
      kategori: true,
      organizer: true
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* 1. Hero Banner Section */}
        <HeroBanner events={dbEventTerpopuler} />

        {/* 2. Kategori Event Section */}
        <CategoryList categories={dbKategori} />

        {/* 3. Event Polines Section */}
        <section className="px-6 py-8 w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-heading text-[var(--brand-dark)]">Event Polines</h2>
            <button className="text-sm font-semibold text-[var(--sisc-blue)] border border-gray-200 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm">
              Lihat Selengkapnya
            </button>
          </div>
          {dbEventPolines.length === 0 ? (
            <p className="text-gray-500 italic">Belum ada event Polines saat ini.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dbEventPolines.map((evt) => (
                <EventCard 
                  key={evt.id}
                  isPolines={true}
                  imageUrl={evt.bannerUrl || ASSETS.PLACEHOLDER_BANNER}
                  kategori={evt.kategori?.nama || "Umum"}
                  tanggal={formatEventDate(evt.tanggalMulai)}
                  judul={evt.judul || "Event Tanpa Judul"}
                  penyelenggara={evt.organizer?.namaLengkap || evt.namaKontak || "Penyelenggara Anonim"}
                  harga={formatCurrency(evt.harga || 0)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 4. Event Umum Section */}
        <section className="px-6 py-8 mb-10 w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-heading text-[var(--brand-dark)]">Event Umum</h2>
            <button className="text-sm font-semibold text-[var(--sisc-blue)] border border-gray-200 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm">
              Lihat Selengkapnya
            </button>
          </div>
          {dbEventUmum.length === 0 ? (
            <p className="text-gray-500 italic">Belum ada event Umum saat ini.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dbEventUmum.map((evt) => (
                <EventCard 
                  key={`umum-${evt.id}`}
                  isPolines={false}
                  imageUrl={evt.bannerUrl || ASSETS.PLACEHOLDER_BANNER}
                  kategori={evt.kategori?.nama || "Umum"}
                  tanggal={formatEventDate(evt.tanggalMulai)}
                  judul={evt.judul || "Event Tanpa Judul"}
                  penyelenggara={evt.organizer?.namaLengkap || evt.namaKontak || "Penyelenggara Anonim"}
                  harga={formatCurrency(evt.harga || 0)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
