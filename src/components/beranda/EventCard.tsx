import React from 'react';
import { ASSETS } from '@/lib/constants';

export interface EventCardProps {
  imageUrl?: string;
  isPolines?: boolean;
  kategori: string;
  tanggal: string;
  judul: string;
  penyelenggara: string;
  penyelenggaraAvatar?: string;
  harga: string;
}

export function EventCard({ 
  imageUrl = ASSETS.PLACEHOLDER_BANNER, 
  isPolines = false, 
  kategori, 
  tanggal, 
  judul, 
  penyelenggara, 
  penyelenggaraAvatar = "https://ui-avatars.com/api/?name=" + penyelenggara + "&background=random",
  harga 
}: EventCardProps) {
  
  // Menentukan warna tag kategori secara dinamis (simulasi)
  const getCategoryColor = (kat: string) => {
    switch (kat.toLowerCase()) {
      case 'teknologi': return 'bg-orange-500';
      case 'bisnis': return 'bg-blue-500';
      case 'otomotif': return 'bg-yellow-400';
      case 'ekonomi': return 'bg-teal-500';
      case 'seni': return 'bg-purple-500';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="flex flex-col group cursor-pointer">
      {/* Gambar & Tags */}
      <div 
        className="w-full h-[220px] rounded-xl bg-gray-200 relative mb-4 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
        
        {/* Tag POLINES (opsional) */}
        {isPolines && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[var(--brand-dark)] text-[10px] font-bold px-2 py-1 rounded-sm uppercase">
            POLINES
          </div>
        )}

        {/* Tag Kategori */}
        <div className={`absolute bottom-3 left-3 ${getCategoryColor(kategori)} text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase`}>
          {kategori}
        </div>
      </div>

      {/* Info Tanggal */}
      <p className="text-[var(--sisc-blue)] text-[10px] font-bold uppercase tracking-wider mb-2">
        {tanggal}
      </p>

      {/* Judul */}
      <h3 className="font-bold text-[var(--brand-dark)] text-base leading-tight mb-3 line-clamp-2 min-h-[40px] group-hover:text-[var(--sisc-blue)] transition-colors">
        {judul}
      </h3>

      {/* Penyelenggara */}
      <div className="flex items-center gap-2 mb-4">
        <img src={penyelenggaraAvatar} alt={penyelenggara} className="w-5 h-5 rounded-full bg-gray-200" />
        <span className="text-xs text-gray-500 font-medium">{penyelenggara}</span>
      </div>

      {/* Harga */}
      <p className="font-bold text-[var(--brand-dark)] text-sm mt-auto">
        {harga}
      </p>
    </div>
  );
}
