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
    tipePlatform?: string | null;
    kotaNama?: string | null;
    kategoriNama?: string | null;
    
  }[];
  emptyMessage?: string;
  type: "POLINES" | "UMUM";
  organizerLabel: string;
  isLoggedIn?: boolean;
}

export default function EventSection({
  title,
  viewAllHref,
  events,
  emptyMessage = "Belum ada event.",
  type,
  isLoggedIn = false,
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

      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      >
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
              category={ev.jenisEvent ?? ""}
              type={type}
              imageUrl={ev.bannerUrl || undefined}
              tipePlatform={ev.tipePlatform ?? undefined}
              kotaNama={ev.kotaNama ?? undefined}
              kategoriNama={ev.kategoriNama ?? undefined}
              isLoggedIn={isLoggedIn}
            />
          ))
        )}
      </div>
    </div>
  );
}