import React from 'react';
import Navbar from '../components/layout/navbar';  
import { HeroBanner } from '../components/beranda/HeroBanner';
import { CategoryList } from '../components/beranda/CategoryList';
import { EventCard } from '../components/beranda/EventCard';
import { db } from '@/db';
import { event } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// Helper function untuk format rupiah
const formatRupiah = (angka: number | null) => {
  if (!angka || angka === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

// Helper function untuk format tanggal ke "SABTU, 24 OCT • 08:00"
const formatTanggalEvent = (dateStr: Date | null) => {
  if (!dateStr) return "TANGGAL BELUM DITENTUKAN";
  const date = new Date(dateStr);
  const optionsDay: Intl.DateTimeFormatOptions = { weekday: 'long' };
  const optionsDate: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
  const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
  
  const hari = new Intl.DateTimeFormat('id-ID', optionsDay).format(date).toUpperCase();
  const tglBulan = new Intl.DateTimeFormat('id-ID', optionsDate).format(date).toUpperCase();
  const jam = new Intl.DateTimeFormat('id-ID', optionsTime).format(date);
  
  return `${hari}, ${tglBulan} • ${jam}`.replace('.', ':');
};

export default async function HalamanBeranda() {
  // Mengambil event Terpopuler untuk Hero Banner (Berdasarkan jumlahTayangan)
  const dbEventTerpopuler = await db.query.event.findMany({
    limit: 5,
    orderBy: [desc(event.jumlahTayangan)],
    with: {
      kategori: true,
      kota: true,
    }
  });

  // Mengambil event Polines
  const dbEventPolines = await db.query.event.findMany({
    where: eq(event.isEventPolines, true),
    limit: 4,
    orderBy: [desc(event.tanggalMulai)],
    with: {
      kategori: true,
      organizer: true
    }
  });

  // Mengambil event Umum
  const dbEventUmum = await db.query.event.findMany({
    where: eq(event.isEventPolines, false),
    limit: 4,
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
        <CategoryList />

        {/* 3. Event Polines Section */}
        <section className="px-6 py-8 w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-heading text-[#1e293b]">Event Polines</h2>
            <button className="text-sm font-semibold text-[#0C4A8E] border border-gray-200 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm">
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
                  imageUrl={evt.bannerUrl || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop"}
                  kategori={evt.kategori?.nama || "Umum"}
                  tanggal={formatTanggalEvent(evt.tanggalMulai)}
                  judul={evt.judul || "Event Tanpa Judul"}
                  penyelenggara={evt.organizer?.namaLengkap || evt.namaKontak || "Penyelenggara Anonim"}
                  harga={formatRupiah(evt.harga)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 4. Event Umum Section */}
        <section className="px-6 py-8 mb-10 w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-heading text-[#1e293b]">Event Umum</h2>
            <button className="text-sm font-semibold text-[#0C4A8E] border border-gray-200 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm">
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
                  imageUrl={evt.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"}
                  kategori={evt.kategori?.nama || "Umum"}
                  tanggal={formatTanggalEvent(evt.tanggalMulai)}
                  judul={evt.judul || "Event Tanpa Judul"}
                  penyelenggara={evt.organizer?.namaLengkap || evt.namaKontak || "Penyelenggara Anonim"}
                  harga={formatRupiah(evt.harga)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
