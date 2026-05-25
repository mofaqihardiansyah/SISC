import { format } from "date-fns";
import { id } from "date-fns/locale";

type EventType = {
  id: number;
  judul: string | null;
  deskripsi: string | null;
  syaratDanKetentuan: string | null;
  bannerUrl: string | null;
  namaPembicara: string | null;
  peranPembicara: string | null;
  tanggalMulai: Date | null;
  tanggalSelesai: Date | null;
  detailLokasi: string | null;
  linkEksternal: string | null;
  jenisEvent: "seminar" | "conference" | null;
  tipePlatform: "online" | "offline" | "hybrid" | null;
  tipeHarga: "free" | "paid" | null;
  harga: number | null;
  kuota: number | null;
  isEventPolines: boolean | null;
  kategori?: { nama: string | null } | null;
  kota?: {
    nama: string | null;
    provinsi?: { nama: string | null } | null;
  } | null;
};

type Props = {
  event: EventType;
};

// ── helpers ──────────────────────────────────────────────────────────────────

function ReadonlyField({
  label,
  value,
  placeholder,
}: {
  label: string;
  value?: string | null;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 min-h-[36px]">
        {value || (
          <span className="text-gray-400 text-sm">{placeholder ?? "—"}</span>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  sectionId,
  icon,
  title,
  children,
}: {
  sectionId: string;
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={sectionId} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/60">
        <span className="text-sm">{icon}</span>
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function Content({ event }: Props) {
  const jenisLabel =
    event.jenisEvent === "seminar"
      ? "Seminar"
      : event.jenisEvent === "conference"
      ? "Conference"
      : "—";

  const polinesLabel = event.isEventPolines ? "Polines" : "Umum";

  const platformLabel =
    event.tipePlatform === "online"
      ? "Daring"
      : event.tipePlatform === "hybrid"
      ? "Hybrid"
      : "Luring";

  const hargaLabel = event.tipeHarga === "free" ? "Gratis" : "Berbayar";
  const biayaLabel =
    event.tipeHarga === "paid" && event.harga
      ? `Rp ${event.harga.toLocaleString("id-ID")}`
      : event.tipeHarga === "free"
      ? "Gratis"
      : "—";

  const fmtDate = (d: Date | null) =>
    d ? format(new Date(d), "dd/MM/yyyy, HH:mm", { locale: id }) : "";

  const deskripsiPlain = event.deskripsi
    ? event.deskripsi.replace(/<[^>]*>/g, "").trim()
    : "";

  const syaratPlain = event.syaratDanKetentuan
    ? event.syaratDanKetentuan.replace(/<[^>]*>/g, "").trim()
    : "";

  return (
    <div className="space-y-4 pb-8">

      {/* ── 1. TIPE EVENT ─────────────────────────────────────────── */}
      <SectionCard sectionId="tipe-event" icon="ℹ️" title="Tipe Event">
        <div className="grid grid-cols-2 gap-3">
          <ReadonlyField
            label="Pilih Tipe Event (Seminar/Conference)"
            value={jenisLabel}
          />
          <ReadonlyField
            label="Pilih Jenis Event (Polines/Umum)"
            value={polinesLabel}
          />
        </div>
      </SectionCard>

      {/* ── 2. DETAIL UMUM ────────────────────────────────────────── */}
      <SectionCard sectionId="detail-umum" icon="ℹ️" title="Detail Umum">
        <div className="space-y-3">

          <ReadonlyField label="Judul Event" value={event.judul} />

          <div className="grid grid-cols-2 gap-3">
            <ReadonlyField
              label="Kategori Event"
              value={event.kategori?.nama}
            />
            <ReadonlyField label="Tipe Platform" value={platformLabel} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ReadonlyField
              label="Lokasi"
              value={
                event.detailLokasi
                  ? `${event.detailLokasi}${event.kota?.nama ? `, ${event.kota.nama}` : ""}`
                  : event.kota?.nama
              }
              placeholder="Contoh: Jakarta, Bandung, Online Only"
            />
            <ReadonlyField
              label="Pembicara (Opsional)"
              value={
                event.namaPembicara
                  ? `${event.namaPembicara}${event.peranPembicara ? ` (${event.peranPembicara})` : ""}`
                  : null
              }
              placeholder="Contoh: Pak Nakala"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ReadonlyField label="Harga" value={hargaLabel} />
            <ReadonlyField label="Biaya" value={biayaLabel} />
          </div>

        </div>
      </SectionCard>

      {/* ── 3. DESKRIPSI & POSTER ─────────────────────────────────── */}
      <SectionCard sectionId="deskripsi-poster" icon="🖼️" title="Deskripsi & Poster">
        <div className="space-y-3">

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Deskripsi Event</label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 min-h-[80px] whitespace-pre-line leading-relaxed">
              {deskripsiPlain || (
                <span className="text-gray-400">Tidak ada deskripsi.</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Banner Event</label>
            {event.bannerUrl ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={event.bannerUrl}
                  alt={event.judul ?? "Banner"}
                  className="w-full max-h-[200px] object-cover"
                />
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg h-[100px] flex flex-col items-center justify-center gap-1 text-gray-400">
                <span className="text-2xl">🖼️</span>
                <p className="text-xs">Belum ada banner</p>
              </div>
            )}
          </div>

        </div>
      </SectionCard>

      {/* ── 4. SYARAT DAN KETENTUAN ───────────────────────────────── */}
      <SectionCard sectionId="syarat" icon="📋" title="Syarat dan Ketentuan">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">
            Detail Syarat &amp; Ketentuan Event
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 min-h-[80px] whitespace-pre-line leading-relaxed">
            {syaratPlain || (
              <span className="text-gray-400">Belum ada syarat dan ketentuan.</span>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ── 5. JADWAL & KUOTA ─────────────────────────────────────── */}
      <SectionCard sectionId="jadwal-kuota" icon="📅" title="Jadwal & Kuota">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ReadonlyField
              label="Tanggal & Waktu Mulai"
              value={fmtDate(event.tanggalMulai)}
              placeholder="mm/dd/yyyy, --:-- --"
            />
            <ReadonlyField
              label="Tanggal & Waktu Selesai"
              value={fmtDate(event.tanggalSelesai)}
              placeholder="mm/dd/yyyy, --:-- --"
            />
          </div>
          <ReadonlyField
            label="Kuota Peserta"
            value={event.kuota ? String(event.kuota) : null}
            placeholder="—"
          />
        </div>
      </SectionCard>

      {/* ── 6. LINK FORM PENDAFTARAN ──────────────────────────────── */}
      <SectionCard sectionId="link-pendaftaran" icon="🔗" title="Link Form Pendaftaran">
        <ReadonlyField
          label="Link Form Pendaftaran untuk Peserta Event"
          value={event.linkEksternal}
          placeholder="https://..."
        />
      </SectionCard>

    </div>
  );
}