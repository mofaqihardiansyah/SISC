import React from 'react';

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
  imageUrl = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop", 
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
      case 'teknologi': return 'bg-blue-500';
      case 'desain': return 'bg-yellow-600';
      case 'seni': return 'bg-purple-500';
      case 'seni budaya': return 'bg-gray-500';
      case 'komunikasi': return 'bg-slate-600';
      default: return 'bg-blue-500';
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
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#1e293b] text-[10px] font-bold px-2 py-1 rounded-sm uppercase">
            POLINES
          </div>
        )}

        {/* Tag Kategori */}
        <div className={`absolute bottom-3 left-3 ${getCategoryColor(kategori)} text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase`}>
          {kategori}
        </div>
      </div>

      {/* Info Tanggal */}
      <p className="text-[#0C4A8E] text-[10px] font-bold uppercase tracking-wider mb-2">
        {tanggal}
      </p>

      {/* Judul */}
      <h3 className="font-bold text-[#1e293b] text-base leading-tight mb-3 line-clamp-2 min-h-[40px] group-hover:text-[#0C4A8E] transition-colors">
        {judul}
      </h3>

      {/* Penyelenggara */}
      <div className="flex items-center gap-2 mb-4">
        <img src={penyelenggaraAvatar} alt={penyelenggara} className="w-5 h-5 rounded-full bg-gray-200" />
        <span className="text-xs text-gray-500 font-medium">{penyelenggara}</span>
      </div>

      {/* Harga */}
      <p className="font-bold text-[#1e293b] text-sm mt-auto">
        {harga}
      </p>
    </div>
  );
}
