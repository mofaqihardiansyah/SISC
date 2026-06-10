"use client";

import Image from "next/image";
import { MapPin, Calendar, Tag, Sparkles } from "lucide-react";
import type { event } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type EventWithKategori = InferSelectModel<typeof event> & {
  kategori?: { nama: string | null } | null;
  kota?: { provinsi?: { nama: string | null } | null } | null;
};

type Props = {
  event: EventWithKategori;
};

export default function Header({ event }: Props) {
  return (
    <div data-header className="bg-slate-900 rounded-2xl px-6 py-4 text-white shadow-md">
      <div className="flex items-center justify-between gap-6">

        {/* KIRI */}
        <div className="flex-1 min-w-0">

          <div className="inline-block bg-white/10 px-3 py-1 rounded-md text-xs font-medium mb-3">
            {event.kategori?.nama ?? "Umum"}
          </div>

          <h1 className="text-2xl font-bold mb-3 leading-snug truncate">
            {event.judul}
          </h1>

          <div className="space-y-1.5 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-slate-300" />
              <p>
                {event.tipePlatform === "online"
                  ? "Online"
                  : event.tipePlatform === "hybrid"
                  ? "Hybrid"
                  : "Offline"}
                {event.detailLokasi ? ` (${event.detailLokasi})` : ""}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-slate-300" />
              <p>
                {event.tanggalMulai
                  ? new Intl.DateTimeFormat("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                     }).format(new Date(event.tanggalMulai))
                  : "Tanggal belum ditentukan"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Tag size={15} className="text-slate-300" />
              <p>{event.kategori?.nama ?? "Umum"}</p>
            </div>
          </div>
        </div>

        {/* KANAN — gambar lebih kecil */}
        <div className="w-[200px] h-[130px] shrink-0 relative">
          {event.bannerUrl ? (
            <Image
              src={event.bannerUrl}
              alt={event.judul ?? "Banner"}
              fill
              className="rounded-xl object-cover"
              sizes="200px"
            />
          ) : (
            <div className="rounded-xl w-full h-[130px] bg-white/10 flex flex-col items-center justify-center text-xs text-slate-300 gap-1.5">
              <Sparkles size={28} className="text-slate-300" />
              <span className="font-semibold uppercase tracking-wider text-[9px]">Event</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}