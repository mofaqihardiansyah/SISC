import Image from "next/image";
import Link from "next/link";
import { normalizeImagePath } from "@/lib/utils/image-utils";

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
}: EventCardProps) {
  return (
    <Link href={`/event/${id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">

        {/* Image + POLINES badge di atas gambar */}
        <div className="relative h-36">
          <Image
            src={normalizeImagePath(imageUrl)}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
          />
          <span className="absolute top-2 left-2 bg-white text-xs font-bold px-2 py-1 rounded">
  {type}
</span>
        </div>

        {/* Body */}
        <div className="p-4">

          {/* Badge: Offline/Online + Seminar/Conference */}
          <div className="flex flex-wrap gap-1 mb-2">
            {tipePlatform && (
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full capitalize">
                {tipePlatform.charAt(0).toUpperCase() + tipePlatform.slice(1)}
              </span>
            )}
            {category && (
              <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                {category}
              </span>
            )}
          </div>

          <h3 className="text-[13px] font-bold text-slate-800 mt-1 line-clamp-2">
            {title}
          </h3>

          <p className="text-[11px] text-slate-400 mt-1">{date}</p>

          <p className={`text-sm font-extrabold mt-2 ${
            price === null || price === 0 ? "text-green-600" : "text-slate-800"
          }`}>
            {price === null || price === 0
              ? "Gratis"
              : `Rp ${price.toLocaleString("id-ID")}`}
          </p>
        </div>

        {/* Footer: Lokasi & Kategori */}
        <div className="px-4 py-3 border-t flex items-center gap-2 text-xs text-gray-500">
          <span>📍 {kotaNama ?? "-"}</span>
          <span className="text-gray-300">•</span>
          <span>{kategoriNama ?? "-"}</span>
        </div>

      </div>
    </Link>
  );
}