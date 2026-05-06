"use client";

import { useRef, useState, useEffect } from "react";

type Kategori = {
  id: number;
  nama: string | null;
  slug: string | null;
  iconUrl: string | null;
};

const categoryColors: Record<string, string> = {
  teknologi: "bg-orange-500",
  bisnis: "bg-blue-600",
  otomotif: "bg-yellow-400",
  ekonomi: "bg-teal-500",
  seni: "bg-purple-600",
  "artificial-intelligence": "bg-red-500",
  bahasa: "bg-pink-500",
  pendidikan: "bg-yellow-500",
  kesehatan: "bg-gray-400",
  olahraga: "bg-gray-400",
  hiburan: "bg-gray-400",
  sains: "bg-gray-400",
};

export default function KategoriCarousel({ categories }: { categories: Kategori[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const SCROLL_AMOUNT = 600;

  const updateButtons = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons);
    return () => el.removeEventListener("scroll", updateButtons);
  }, []);

  const scroll = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "next" ? SCROLL_AMOUNT : -SCROLL_AMOUNT, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Tombol Prev */}
      {canPrev && (
        <button
          onClick={() => scroll("prev")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-50 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Track */}
      <div
  ref={trackRef}
  className="flex gap-3 overflow-x-auto scroll-smooth py-2 pr-5 items-stretch"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/jelajah?kategori=${cat.slug}`}
            className="group flex-shrink-0 basis-[calc(25%-0.75rem)]"
          >
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white group-hover:-translate-y-1 transition-transform duration-200">
              {/* Bagian atas berwarna + ikon */}
              <div className={`relative h-20 sm:h-24 w-full ${categoryColors[cat.slug ?? ""] ?? "bg-gray-400"} flex items-center justify-center overflow-hidden`}>
                {cat.iconUrl && (
                  <div className="absolute -bottom-3 -right-3 opacity-20 select-none pointer-events-none w-16 h-16">
                    <img src={cat.iconUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                )}
                {cat.iconUrl && (
                  <div className="relative z-10 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center p-2">
                    <img src={cat.iconUrl} alt={cat.nama ?? ""} className="w-10 h-10 object-contain" />
                  </div>
                )}
              </div>
              {/* Label nama */}
              <div className="px-2 py-2 h-10 flex items-center">
                <span className="text-[11px] font-semibold text-gray-800 leading-tight line-clamp-2 w-full">
                  {cat.nama}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Tombol Next */}
      {canNext && (
        <button
          onClick={() => scroll("next")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-50 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}