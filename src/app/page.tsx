import React from 'react';
import Navbar from '../components/layout/navbar';  

export default function HalamanBeranda() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {/* Herosection */}
      <section className="px-6 py-8">
        <div className="h-[400px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
          [Hero Image Area]
        </div>
      </section>

      {/* bagian KATEGORI EVENT */}
      <section className="px-6 py-8">
        <h2 className="text-xl font-bold mb-4">Kategori Event</h2>
        <div className="h-24 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
          [Kategori Area]
        </div>
      </section>

      {/* card horizontal EVENT POLINES */}
      <section className="px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Event Polines</h2>
          <button className="text-sm border px-4 py-2 rounded-lg hover:bg-gray-50">Lihat Selengkapnya</button>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div className="h-[300px] bg-gray-200 rounded-xl"></div>
          <div className="h-[300px] bg-gray-200 rounded-xl"></div>
          <div className="h-[300px] bg-gray-200 rounded-xl"></div>
          <div className="h-[300px] bg-gray-200 rounded-xl"></div>
        </div>
      </section>

      {/* card horizontal event umum polines */}
      <section className="px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Event Umum Polines</h2>
          <button className="text-sm border px-4 py-2 rounded-lg hover:bg-gray-50">Lihat Selengkapnya</button>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div className="h-[300px] bg-gray-200 rounded-xl"></div>
          <div className="h-[300px] bg-gray-200 rounded-xl"></div>
          <div className="h-[300px] bg-gray-200 rounded-xl"></div>
          <div className="h-[300px] bg-gray-200 rounded-xl"></div>
        </div>
      </section>

    </div>
  );
}
