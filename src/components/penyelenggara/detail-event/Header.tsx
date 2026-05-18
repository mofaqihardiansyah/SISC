"use client";


type Props = {
  event: any;
};

export default function Header({ event }: Props) {
  return (
    <div data-header className="bg-[#13254C] rounded-3xl p-8 text-white shadow-lg">

      <div className="flex items-center justify-between gap-10">

        {/* KIRI */}
        <div className="flex-1">

          <div className="inline-block bg-white/10 px-4 py-2 rounded-lg text-sm font-medium mb-5">
            {event.kategori?.nama ?? "Umum"}
          </div>

          <h1 className="text-4xl font-bold mb-6 leading-tight">
            {event.judul}
          </h1>

          <div className="space-y-3 text-white/85">

            <div className="flex items-center gap-2">
              <span>📍</span>
              <p>
                {event.tipePlatform === "online"
                  ? "Online"
                  : event.tipePlatform === "hybrid"
                  ? "Hybrid"
                  : "Offline"}
                {event.detailLokasi ? ` (${event.detailLokasi})` : ""}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span>📅</span>
              <p>
                {event.tanggalMulai
                  ? new Intl.DateTimeFormat("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(event.tanggalMulai))
                  : "Tanggal belum ditentukan"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span>🏷️</span>
              <p>{event.kategori?.nama ?? "Umum"}</p>
            </div>

          </div>

        </div>

        {/* KANAN */}
        <div className="w-[320px] shrink-0">

          {event.bannerUrl ? (
            <img
              src={event.bannerUrl}
              alt={event.judul}
              className="rounded-2xl object-cover w-full h-[220px]"
            />
          ) : (
            <div className="rounded-2xl w-full h-[220px] bg-white/10 flex items-center justify-center text-6xl">
              🎪
            </div>
          )}

        </div>

      </div>

    </div>
  );
}