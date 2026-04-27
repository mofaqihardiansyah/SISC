"use client";

import React from 'react';
import { Calendar, MapPin, Tag, Ticket, PlayCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { formatCurrency, formatEventDate } from '@/lib/formatters';
import { ASSETS } from '@/lib/constants';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import Image from 'next/image';

interface HeroEvent {
  id: number;
  judul: string | null;
  bannerUrl: string | null;
  tanggalMulai: Date | null;
  tanggalSelesai: Date | null;
  jenisEvent: string | null;
  tipeHarga: string | null;
  harga: number | null;
  detailLokasi: string | null;
  kota?: { nama: string | null } | null;
  kategori?: { nama: string | null } | null;
}

interface HeroBannerProps {
  events: HeroEvent[];
}

export function HeroBanner({ events }: HeroBannerProps) {
  // If no events, show nothing or a placeholder
  if (!events || events.length === 0) return null;

  return (
    <section className="px-6 py-6 w-full max-w-7xl mx-auto">
      <div className="relative group">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            el: '.hero-pagination',
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-full rounded-2xl overflow-hidden shadow-lg"
        >
        {events.map((evt) => (
          <SwiperSlide key={evt.id}>
            <div className="relative w-full h-[450px]">
              {/* Background Image with Overlay */}
              <Image 
                src={evt.bannerUrl || ASSETS.PLACEHOLDER_BANNER} 
                alt={evt.judul || "Event Banner"}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center p-12 text-white z-10">
                
                <h1 className="text-5xl md:text-5xl lg:text-6xl font-extrabold font-heading leading-tight mb-6 w-full md:w-2/3 line-clamp-2">
                  {evt.judul}
                </h1>

                <div className="flex items-center gap-6 mb-8">
                  <button className="bg-white text-[var(--sisc-blue)] hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition shadow-lg">
                    Daftar Sekarang
                  </button>
                  <div className="flex items-center gap-2 text-sm text-gray-200">
                    <Calendar className="w-4 h-4" />
                    <span>{formatEventDate(evt.tanggalMulai)} • {evt.kota?.nama || evt.detailLokasi || "Online"}</span>
                  </div>
                </div>
              </div>

              {/* Info Box di Bawah */}
              <div className="absolute bottom-0 left-0 right-0 z-10">
                <div className="w-full bg-white/95 backdrop-blur-md p-5 flex items-center justify-between text-[#212121] overflow-x-auto gap-4 border-t border-gray-100">
                  <div className="flex-1 min-w-[120px] flex flex-col items-center border-r border-gray-200 px-2">
                    <span className="text-[10px] text-gray-500 font-semibold mb-1 uppercase tracking-wider">TIPE EVENT</span>
                    <div className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap capitalize">
                      <PlayCircle className="w-4 h-4 text-blue-500" />
                      {evt.jenisEvent}
                    </div>
                  </div>

                  <div className="flex-1 min-w-[120px] flex flex-col items-center border-r border-gray-200 px-2">
                    <span className="text-[10px] text-gray-500 font-semibold mb-1 uppercase tracking-wider">KATEGORI</span>
                    <div className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap">
                      <Tag className="w-4 h-4 text-blue-500" />
                      {evt.kategori?.nama || "Umum"}
                    </div>
                  </div>

                  <div className="flex-1 min-w-[120px] flex flex-col items-center border-r border-gray-200 px-2">
                    <span className="text-[10px] text-gray-500 font-semibold mb-1 uppercase tracking-wider">LOKASI</span>
                    <div className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {evt.kota?.nama || "Online"}
                    </div>
                  </div>

                  <div className="flex-1 min-w-[120px] flex flex-col items-center px-2">
                    <span className="text-[10px] text-gray-500 font-semibold mb-1 uppercase tracking-wider">HARGA</span>
                    <div className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap">
                      <Ticket className="w-4 h-4 text-blue-500" />
                      {formatCurrency(evt.harga || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        </Swiper>
        
        {/* Custom Pagination Outside Swiper */}
        <div className="hero-pagination flex justify-center gap-2 mt-6"></div>
      </div>
      
      {/* Kustomisasi tambahan untuk menutupi style bawaan panah/titik swiper */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .swiper-button-next, .swiper-button-prev {
            color: white !important;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(8px);
            padding: 24px;
            border-radius: 50%;
            transform: scale(0.6);
            transition: all 0.3s ease;
          }
          .swiper-button-next:hover, .swiper-button-prev:hover {
            background: rgba(255, 255, 255, 0.4);
            transform: scale(0.7);
          }
          
          .hero-pagination .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background: #cbd5e1;
            opacity: 1;
            transition: all 0.3s ease;
            border-radius: 5px;
          }
          .hero-pagination .swiper-pagination-bullet-active {
            background: var(--sisc-blue) !important;
            width: 28px;
          }
        `
      }} />
    </section>
  );
}

