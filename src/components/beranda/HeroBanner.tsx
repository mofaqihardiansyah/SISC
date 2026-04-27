"use client";

import React from 'react';
import { Calendar, MapPin, Tag, Ticket, PlayCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface HeroBannerProps {
  events: any[]; // Using any for now to avoid complex type issues with Drizzle's nested results, or I can define a specific interface
}

export function HeroBanner({ events }: HeroBannerProps) {
  // Helper function for date formatting
  const formatBannerDate = (start: Date | null, end: Date | null) => {
    if (!start) return "Coming Soon";
    const startDate = new Date(start);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    if (!end) return `${months[startDate.getMonth()]} ${startDate.getDate()}`;
    
    const endDate = new Date(end);
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${months[startDate.getMonth()]} ${startDate.getDate()}-${endDate.getDate()}`;
    }
    return `${months[startDate.getMonth()]} ${startDate.getDate()} - ${months[endDate.getMonth()]} ${endDate.getDate()}`;
  };

  // Helper for price
  const formatPrice = (type: string | null, price: number | null) => {
    if (type === 'free' || !price || price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

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
              <img 
                src={evt.bannerUrl} 
                alt={evt.judul}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center p-12 text-white z-10">
                
                <h1 className="text-5xl md:text-5xl lg:text-6xl font-extrabold font-heading leading-tight mb-6 w-full md:w-2/3 line-clamp-2">
                  {evt.judul}
                </h1>

                <div className="flex items-center gap-6 mb-8">
                  <button className="bg-white text-[#0C4A8E] hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition shadow-lg">
                    Daftar Sekarang
                  </button>
                  <div className="flex items-center gap-2 text-sm text-gray-200">
                    <Calendar className="w-4 h-4" />
                    <span>{formatBannerDate(evt.tanggalMulai, evt.tanggalSelesai)} • {evt.kota?.nama || evt.detailLokasi || "Online"}</span>
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
                      {formatPrice(evt.tipeHarga, evt.harga)}
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
            background: #0C4A8E !important;
            width: 28px;
          }
        `
      }} />
    </section>
  );
}

