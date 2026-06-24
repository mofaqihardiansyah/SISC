"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { normalizeImagePath } from "@/lib/utils/image-utils";
import { Calendar, MapPin } from "lucide-react";
import { UI_TEXT } from "@/lib/constants";
import { UI } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface HeroSliderProps {
  events: {
    id: number;
    judul: string | null;
    urlBanner: string | null;
    tanggalMulai: Date | null;
    detailLokasi: string | null;
  }[];
}

export default function HeroSlider({ events }: HeroSliderProps) {
  if (!events || events.length === 0) {
    return (
      <div className="h-[300px] rounded-2xl bg-slate-200 animate-pulse flex items-center justify-center">
        <p className="text-slate-400 font-medium">{UI_TEXT.NO_EVENT_FEATURED}</p>
      </div>
    );
  }

  return (
    // Tambah relative di wrapper luar
    <div className="relative h-[350px] sm:h-[400px]">

      {/* Badge di luar Swiper â€” tidak ikut bergerak */}
      <span className="absolute top-4 left-6 sm:top-6 sm:left-12 bg-blue-500 text-white text-xxs sm:text-micro font-bold px-3 py-1 rounded-full uppercase tracking-wider z-20">
        {UI_TEXT.POPULAR_EVENT}
      </span>

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: UI.HERO_AUTOPLAY_DELAY_MS, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active !bg-white",
        }}
        loop={true}
        grabCursor={true}
        className="h-full rounded-2xl overflow-hidden shadow-xl"
      >
        {events.map((ev, index) => (
          <SwiperSlide key={ev.id}>
            <div className="relative h-full w-full">
              <Image
                src={normalizeImagePath(ev.urlBanner)}
                alt={ev.judul ?? ""}
                fill
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Konten bawah â€” ini yang bergerak saat slide */}
              <div className="absolute bottom-8 left-6 sm:bottom-12 sm:left-12 text-white z-10 max-w-[80%]">
                <h1 className="text-3xl sm:text-5xl font-black mb-4 leading-tight drop-shadow-lg">
                  {ev.judul ?? UI_TEXT.NO_TITLE}
                </h1>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2">
                  <Link href={`/event/${ev.id}`}>
                    <Button variant="outline" size="lg" className="bg-white text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 shadow-lg transform hover:-translate-y-1">
                      {UI_TEXT.REGISTER_NOW}
                    </Button>
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
                          : UI_TEXT.NO_DATE_FALLBACK}
                      </span>
                    </div>
                    <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full" />
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="line-clamp-1">
                        {ev.detailLokasi ?? UI_TEXT.NO_LOCATION_FALLBACK}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}