"use client";

import Image from "next/image";
import Link from "next/link";
import { normalizeImagePath } from "@/lib/utils/image-utils";
import BookmarkButton from "./BookmarkButton";
import { MapPin, Tag } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  price: number | null;
  category: string;
  type: "POLINES" | "UMUM";
  imageUrl?: string;
  tipePlatform?: string;
  kotaNama?: string;
  kategoriNama?: string;
  penyelenggara?: string | null;
  isLoggedIn?: boolean;
  isBookmarked?: boolean;
  onRemove?: () => void; 
}

export default function EventCard({
  id,
  title,
  date,
  price,
  category,
  type,
  imageUrl,
  tipePlatform,
  kotaNama,
  kategoriNama,
  penyelenggara,
  isLoggedIn = false,
  isBookmarked,
  onRemove,
}: EventCardProps) {
  return (
    <Link href={`/event/${id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full flex flex-col">

        {/* Image + POLINES badge */}
        <div className="relative h-36">
          <Image
            src={normalizeImagePath(imageUrl)}
            alt={title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
          />
          {/* Badge Tipe */}
          <span className="absolute top-2 left-2 bg-white text-xs font-bold px-2 py-1 rounded shadow-sm border border-slate-100">
            {type}
          </span>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col grow">
          <div className="flex flex-wrap gap-1 mb-2">
            {tipePlatform && (
              <span className="text-xxs font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full capitalize">
                {tipePlatform.charAt(0).toUpperCase() + tipePlatform.slice(1)}
              </span>
            )}
            {category && (
              <span className="text-xxs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                {category}
              </span>
            )}
          </div>

          <h3 className="text-sm2 font-bold text-slate-800 mt-1 line-clamp-2">
            {title}
          </h3>

          {penyelenggara && (
            <p className="text-micro text-slate-500 mt-0.5 truncate">{penyelenggara}</p>
          )}

          <p className="text-micro text-slate-400 mt-1">{date}</p>

          <div className="flex justify-between items-center mt-auto pt-2">
            <p className={`text-sm font-extrabold ${
              price === null || price === 0 ? "text-green-600" : "text-slate-800"
            }`}>
              {price === null || price === 0
                ? "Gratis"
                : `Rp ${price.toLocaleString("id-ID")}`}
            </p>
            
            <BookmarkButton 
              eventId={id} 
              isLoggedIn={isLoggedIn} 
              onRemove={onRemove} 
              initialBookmarked={isBookmarked} 
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t flex items-center gap-4 text-micro text-slate-500 bg-slate-50/50">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">{kotaNama ?? "-"}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <Tag className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">{kategoriNama ?? "-"}</span>
          </div>
        </div>

      </div>
    </Link>
  );
}