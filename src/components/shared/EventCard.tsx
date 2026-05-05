import Link from "next/link";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  price: number | null;
  category: string;
  organizer: string;
  type: "POLINES" | "UMUM";
  imageUrl?: string;
}

export default function EventCard({
  id,
  title,
  date,
  price,
  category,
  organizer,
  type,
  imageUrl,
}: EventCardProps) {
  const tagColor: Record<string, string> = {
    Teknologi: "bg-blue-100 text-blue-700",
    Desain: "bg-yellow-100 text-yellow-700",
    Seni: "bg-pink-100 text-pink-700",
  };

  return (
    <Link href={`/event/${id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">
        
        {/* Image */}
        <div className="relative h-36">
          <img
            src={imageUrl || "/placeholder-banner.png"}
            alt={title}
            className="w-full h-full object-cover"
          />

          <span className="absolute top-2 left-2 bg-white text-xs font-bold px-2 py-1 rounded">
            {type}
          </span>
        </div>

        {/* Body */}
        <div className="p-3">
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded ${
              tagColor[category] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {category}
          </span>

          <p className="text-[11px] text-slate-500 mt-2">{date}</p>

          <h3 className="text-[13px] font-bold text-slate-800 mt-1 line-clamp-2">
            {title}
          </h3>

          <p className="text-[11px] text-slate-400 mt-2">{organizer}</p>

          <p
            className={`text-sm font-extrabold mt-2 ${
              price === null ? "text-green-600" : "text-slate-800"
            }`}
          >
            {price === null
              ? "Gratis"
              : `Rp ${price.toLocaleString("id-ID")}`}
          </p>
        </div>
      </div>
    </Link>
  );
}