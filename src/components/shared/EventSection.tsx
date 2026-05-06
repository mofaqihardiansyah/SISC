import EventCard from "./EventCard";

interface EventSectionProps {
  title: string;
  viewAllHref: string;
  events: {
    id: number;
    judul: string | null;
    bannerUrl: string | null;
    tanggalMulai: Date | null;
    tipeHarga: string | null;
    harga: number | null;
    jenisEvent: string | null;
  }[];
  emptyMessage?: string;
  type: "POLINES" | "UMUM";
  organizerLabel: string;
}

export default function EventSection({
  title,
  viewAllHref,
  events,
  emptyMessage = "Belum ada event.",
  type,
  organizerLabel,
}: EventSectionProps) {
  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-extrabold text-slate-800">{title}</h2>
        <a 
          href={viewAllHref} 
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors"
        >
          Lihat Selengkapnya →
        </a>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full py-10 text-center bg-gray-100 rounded-xl">
            <p className="text-gray-500 italic">{emptyMessage}</p>
          </div>
        ) : (
          events.map((ev) => (
            <EventCard
              key={ev.id}
              id={String(ev.id)}
              title={ev.judul ?? "Tanpa Judul"}
              date={
                ev.tanggalMulai
                  ? ev.tanggalMulai.toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Tanggal belum diisi"
              }
              price={ev.tipeHarga === "free" ? 0 : (ev.harga ?? null)}
              category={ev.jenisEvent ?? "Kategori"}
              organizer={organizerLabel}
              type={type}
              imageUrl={ev.bannerUrl || "/placeholder-banner.png"}
            />
          ))
        )}
      </div>
    </div>
  );
}
