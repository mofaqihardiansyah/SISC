"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { normalizeImagePath } from "@/lib/utils/image-utils";

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
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop={true}
      className="h-[300px] rounded-2xl overflow-hidden"
    >
      {events.map((ev, index) => (
        <SwiperSlide key={ev.id}>
          <div className="relative h-[300px]">
            <Image
              src={normalizeImagePath(ev.bannerUrl)}
              alt={ev.judul ?? ""}
              fill
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <span className="bg-yellow-400 text-yellow-900 text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                Paling Banyak Diminati
              </span>
              <h1 className="text-3xl font-black mt-2 leading-tight">
                {ev.judul ?? "Electro Tech 2024"}
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <a href={`/event/${ev.id}`}>
                  <button className="bg-white text-slate-800 font-semibold px-5 py-2 rounded-lg hover:scale-105 transition">
                    Daftar
                  </button>
                </a>
                <span className="text-sm opacity-80">
                  📅{" "}
                  {ev.tanggalMulai
                    ? ev.tanggalMulai.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Sept 15-20"}{" "}
                  • {ev.detailLokasi ?? "GBK Arena"}
                </span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}