"use client";

import { useRef, useState, useEffect } from "react";

type Kategori = {
  id: number;
  nama: string | null;
  slug: string | null;
  iconUrl: string | null;
};

const categoryColors: Record<string, string> = {
  "teknologi-informasi": "bg-orange-500",
  "bisnis-ekonomi": "bg-blue-600",
  "kreatif-desain": "bg-purple-500",
  "sains-akademik": "bg-indigo-500",
  "kesehatan-medis": "bg-green-500",
  "sosial-humaniora": "bg-teal-500",
  "seni-musik-budaya": "bg-rose-500",
  "hiburan-gaya-hidup": "bg-yellow-500",
  "olahraga-kebugaran": "bg-sky-500",
  umum: "bg-gray-500",
};

export default function KategoriCarousel({
  categories,
}: {
  categories: Kategori[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const SCROLL_AMOUNT = 400;

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
    el.scrollBy({
      left: dir === "next" ? SCROLL_AMOUNT : -SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group">
      {/* Tombol Prev */}
      {canPrev && (
        <button
          onClick={() => scroll("prev")}
          className="absolute -left-8 top-1/2 -translate-y-1/2 z-50 w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm border border-black/40 shadow-sm flex items-center justify-center text-gray-700 opacity-70 hover:opacity-100 hover:border-black hover:bg-white hover:shadow-lg transition-all duration-300"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto scroll-smooth py-2 items-stretch"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/jelajah?kategori=${encodeURIComponent(cat.nama ?? "")}`}
            className="flex-shrink-0 min-w-[170px] max-w-[190px]"
          >
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white hover:-translate-y-1 transition-transform duration-200 h-full min-h-[170px]">
              {/* Header */}
              <div
                className={`relative h-24 w-full ${
                  categoryColors[cat.slug ?? ""] ?? "bg-gray-400"
                } flex items-center justify-center overflow-hidden`}
              >
                {/* Background Icon */}
                {cat.iconUrl && (
                  <div className="absolute -bottom-2 -right-2 opacity-20 select-none pointer-events-none w-12 h-12">
                    <img src={cat.iconUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                )}

                {/* Main Icon */}
                {cat.iconUrl && (
                  <div className="relative z-10 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center p-2">
                    <img src={cat.iconUrl} alt={cat.nama ?? ""} className="w-7 h-7 object-contain" />
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="px-3 py-3 flex items-center min-h-[56px]">
                <span className="text-xs font-semibold text-gray-700 leading-tight line-clamp-2 w-full">
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
          className="absolute -right-8 top-1/2 -translate-y-1/2 z-50 w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm border border-black/40 shadow-sm flex items-center justify-center text-gray-700 opacity-70 hover:opacity-100 hover:border-black hover:bg-white hover:shadow-lg transition-all duration-300"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}