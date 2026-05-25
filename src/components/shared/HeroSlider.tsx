"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { normalizeImagePath } from "@/lib/utils/image-utils";
import { Calendar, MapPin } from "lucide-react";

interface HeroSliderProps {
  events: {
    id: number;
    judul: string | null;
    bannerUrl: string | null;
    tanggalMulai: Date | null;
    detailLokasi: string | null;
  }[];
}

export default function HeroSlider({ events }: HeroSliderProps) {
  if (!events || events.length === 0) {
    return (
      <div className="h-[300px] rounded-2xl bg-slate-200 animate-pulse flex items-center justify-center">
        <p className="text-slate-400 font-medium">Belum ada event unggulan</p>
      </div>
    );
  }

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{
        clickable: true,
        bulletActiveClass: "swiper-pagination-bullet-active !bg-white",
      }}
      loop={true}
      grabCursor={true}
      className="h-[350px] sm:h-[400px] rounded-2xl overflow-hidden shadow-xl"
    >
        {events.map((ev, index) => (
          <SwiperSlide key={ev.id}>
            <div className="relative h-full w-full">
              <Image
                src={normalizeImagePath(ev.bannerUrl)}
                alt={ev.judul ?? ""}
                fill
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-8 left-6 sm:bottom-12 sm:left-12 text-white z-10 max-w-[80%]">
                <span className="bg-blue-500 text-white text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                  Paling Banyak Diminati
                </span>
                <h1 className="text-3xl sm:text-5xl font-black mt-2 mb-4 leading-tight drop-shadow-lg">
                  {ev.judul ?? "Untitled Event"}
                </h1>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2">
                  <Link href={`/event/${ev.id}`}>
                    <button className="bg-white text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg transform hover:-translate-y-1">
                      Daftar Sekarang
                    </button>
                  </Link>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm sm:text-base font-medium opacity-90">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>
                        {ev.tanggalMulai
                          ? ev.tanggalMulai.toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "TBA"}
                      </span>
                    </div>
                    <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full" />
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="line-clamp-1">
                        {ev.detailLokasi ?? "Lokasi TBA"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
    </Swiper>
  );
}
