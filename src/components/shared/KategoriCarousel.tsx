"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/profile/EmptyState";
import {
  Monitor, Calculator, Wrench, Briefcase, Stethoscope, Languages,
  Palette, Scale, Leaf, GraduationCap, Search, Brain, Book, Tag,
  Dumbbell, Utensils, Music, Camera, Gamepad2, Rocket,
  Shirt, Clapperboard, PawPrint, FlaskConical, HeartHandshake, Sparkles,
  Car, TrendingUp, Mountain, Tent, Plane, CookingPot, PenLine,
  Scroll, Star, Globe,
} from "lucide-react";

function CategoryIcon({ slug, size, className, nama }: { slug: string; size: number; className?: string; nama?: string | null }) {
  switch (slug) {
    case "teknologi": return <Monitor size={size} className={className} />;
    case "sains-matematika": return <Calculator size={size} className={className} />;
    case "teknik-rekayasa": return <Wrench size={size} className={className} />;
    case "bisnis-ekonomi": return <Briefcase size={size} className={className} />;
    case "kesehatan-medis": return <Stethoscope size={size} className={className} />;
    case "bahasa-sastra": return <Languages size={size} className={className} />;
    case "seni-budaya": return <Palette size={size} className={className} />;
    case "sosial-hukum": return <Scale size={size} className={className} />;
    case "pertanian-lingkungan": return <Leaf size={size} className={className} />;
    case "pendidikan": return <GraduationCap size={size} className={className} />;
    case "riset-publikasi": return <Search size={size} className={className} />;
    case "psikologi": return <Brain size={size} className={className} />;
    case "filsafat-agama": return <Book size={size} className={className} />;
    default: return autoIcon(slug, size, className, nama);
  }
}

function autoIcon(slug: string, size: number, className?: string, nama?: string | null) {
  const s = `${slug} ${nama ?? ""}`.toLowerCase().replace(/[-_]/g, " ");

  type IconComp = React.ComponentType<{ size?: number; className?: string }>;
  const rules: [string[], IconComp][] = [
    [["startup", "technopreneur"], Rocket],
    [["olahraga", "fitnes", "sepak", "bola", "sport", "yoga", "lari", "renang", "gym", "atlet", "senam", "tinju", "beladiri"], Dumbbell],
    [["makan", "kuliner", "masak", "kopi", "teh", "minum", "restoran", "cafe", "dapur", "kue", "roti"], Utensils],
    [["musik", "lagu", "konser", "gitar", "piano", "drum"], Music],
    [["foto", "fotografi", "kamera", "video", "sinematografi"], Camera],
    [["game", "gaming", "esport"], Gamepad2],
    [["teknologi", "digital", "komputer", "program", "software", "coding", "ai", "informatika", "it"], Monitor],
    [["seni", "budaya", "lukis", "desain", "kreatif", "kerajinan"], Palette],
    [["pendidikan", "belajar", "kursus", "pelatihan", "seminar", "workshop", "akademik"], GraduationCap],
    [["bisnis", "ekonomi", "wirausaha", "manajemen", "marketing"], Briefcase],
    [["sosial", "hukum", "masyarakat", "kebijakan", "politik"], Scale],
    [["psikologi", "mental", "konseling", "pikiran", "wellness"], Brain],
    [["agama", "filsafat", "spiritual", "keagamaan", "teologi"], Book],
    [["sains", "riset", "penelitian", "laboratorium", "eksperimen", "ilmiah", "jurnal", "publikasi"], FlaskConical],
    [["kesehatan", "medis", "sehat", "rumah sakit", "dokter", "klinik"], Stethoscope],
    [["teknik", "rekayasa", "mesin", "industri", "konstruksi", "bangunan"], Wrench],
    [["bahasa", "linguistik", "sastra", "penerjemah"], Languages],
    [["pertanian", "perkebunan", "peternakan", "pangan"], Leaf],
    [["lingkungan", "alam", "ekologi", "daur ulang"], Globe],
    [["travel", "wisata", "liburan", "pariwisata"], Plane],
    [["fashion", "busana", "kecantikan", "grooming", "style"], Shirt],
    [["film", "movie", "sinema", "drama", "teater", "pertunjukan"], Clapperboard],
    [["hewan", "binatang", "peliharaan", "satwa"], PawPrint],
    [["relawan", "charity", "donasi", "amal", "volunteer"], HeartHandshake],
    [["spa", "self", "personal"], Sparkles],
    [["otomotif", "mobil", "motor", "kendaraan", "bengkel"], Car],
    [["investasi", "saham", "crypto", "keuangan", "finansial", "bank", "asuransi"], TrendingUp],
    [["petualangan", "gunung", "mendaki", "outdoor"], Mountain],
    [["kamping", "outbound", "outbond"], Tent],
    [["memasak", "katering"], CookingPot],
    [["menulis", "jurnalistik", "content", "copywriting", "nulis"], PenLine],
    [["sejarah", "tradisi", "warisan"], Scroll],
    [["karier", "profesional", "jaringan", "networking", "karir"], Briefcase],
    [["hiburan", "show", "pagelaran"], Star],
    [["matematika", "statistika", "hitung", "akuntansi"], Calculator],
    [["tanam", "berkebun", "hijau", "bumi"], Leaf],
    [["umum", "general", "lainnya"], Tag],
  ];

  for (const [keywords, Icon] of rules) {
    if (keywords.some(k => s.includes(k))) return <Icon size={size} className={className} />;
  }
  return <Tag size={size} className={className} />;
}

const CATEGORY_PALETTE = [
  "bg-blue-600", "bg-indigo-500", "bg-cyan-600", "bg-emerald-600",
  "bg-rose-500", "bg-amber-500", "bg-fuchsia-500", "bg-slate-600",
  "bg-lime-600", "bg-sky-500", "bg-violet-600", "bg-pink-500",
  "bg-orange-500",
];

function categoryColor(slug: string): string {
  const c = categoryColors[slug];
  if (c) return c;
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = ((hash << 5) - hash) + slug.charCodeAt(i);
  return CATEGORY_PALETTE[Math.abs(hash) % CATEGORY_PALETTE.length];
}

type Kategori = {
  id: number;
  nama: string | null;
  slug: string | null;
  urlIkon: string | null;
};

const categoryColors: Record<string, string> = {
  "teknologi": "bg-blue-600",
  "sains-matematika": "bg-indigo-500",
  "teknik-rekayasa": "bg-cyan-600",
  "bisnis-ekonomi": "bg-emerald-600",
  "kesehatan-medis": "bg-rose-500",
  "bahasa-sastra": "bg-amber-500",
  "seni-budaya": "bg-fuchsia-500",
  "sosial-hukum": "bg-slate-600",
  "pertanian-lingkungan": "bg-lime-600",
  "pendidikan": "bg-sky-500",
  "riset-publikasi": "bg-violet-600",
  "psikologi": "bg-pink-500",
  "filsafat-agama": "bg-orange-500",
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

  if (categories.length === 0) {
    return <EmptyState title="Belum ada kategori" description="Kategori event belum tersedia saat ini." />;
  }

  return (
    <div className="relative group">
      {/* Tombol Prev */}
      {canPrev && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll("prev")}
          className="absolute left-2 sm:-left-8 top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/70 backdrop-blur-sm border-black/40 text-gray-700 opacity-70 hover:opacity-100 hover:border-black hover:bg-white hover:shadow-lg shadow-sm"
          aria-label="Sebelumnya"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
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
            className="flex-shrink-0 min-w-44 max-w-48"
          >
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white hover:-translate-y-1 transition-transform duration-200 h-full min-h-44">
              {/* Header */}
              <div
                className={`relative h-24 w-full ${categoryColor(cat.slug ?? "")} flex items-center justify-center overflow-hidden`}
              >
                {/* Background Icon */}
                <div className="absolute -bottom-4 -right-4 opacity-20 select-none pointer-events-none">
                  <CategoryIcon slug={cat.slug ?? ""} size={80} className="text-white" nama={cat.nama} />
                </div>

                {/* Main Icon */}
                <div className="relative z-10 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center p-2 shadow-sm backdrop-blur-sm">
                  <CategoryIcon slug={cat.slug ?? ""} size={28} className="text-white" nama={cat.nama} />
                </div>
              </div>

              {/* Label */}
              <div className="px-3 py-3 flex items-center min-h-14">
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
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll("next")}
          className="absolute right-2 sm:-right-8 top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/70 backdrop-blur-sm border-black/40 text-gray-700 opacity-70 hover:opacity-100 hover:border-black hover:bg-white hover:shadow-lg shadow-sm"
          aria-label="Selanjutnya"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      )}
    </div>
  );
}