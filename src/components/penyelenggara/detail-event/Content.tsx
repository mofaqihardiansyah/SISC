import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Info, Image as ImageIcon, ClipboardList, Calendar, Link2 } from "lucide-react";

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

// â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
      <label className="text-xs font-medium text-gray-505">{label}</label>
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 min-h-9 flex items-center">
        {value || (
          <span className="text-slate-400 text-sm">{placeholder ?? "â€”"}</span>
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
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={sectionId} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50/60">
        <span className="text-slate-500 shrink-0">{icon}</span>
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

// â”€â”€ main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function Content({ event }: Props) {
  const jenisLabel =
    event.jenisEvent === "seminar"
      ? "Seminar"
      : event.jenisEvent === "conference"
      ? "Conference"
      : "â€”";

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
      : "â€”";

  const fmtDate = (d: Date | null) =>
    d ? format(new Date(d), "dd/MM/yyyy, HH:mm", { locale: id }) : "";

  const deskripsiPlain = event.deskripsi
    ? event.deskripsi.replace(/<[^>]*>/g, "").trim()
    : "";

  const syaratPlain = event.syaratDanKetentuan
    ? event.syaratDanKetentuan.replace(/<[^>]*>/g, "").trim()
    : "";

  return (
    <div className="space-y-4 pb-8 animate-page-fade-in">

      {/* â”€â”€ 1. TIPE EVENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <SectionCard sectionId="tipe-event" icon={<Info size={16} />} title="Tipe Event">
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

      {/* â”€â”€ 2. DETAIL UMUM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <SectionCard sectionId="detail-umum" icon={<Info size={16} />} title="Detail Umum">
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

      {/* â”€â”€ 3. DESKRIPSI & POSTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <SectionCard sectionId="deskripsi-poster" icon={<ImageIcon size={16} />} title="Deskripsi & Poster">
        <div className="space-y-3">

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500">Deskripsi Event</label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 min-h-20 whitespace-pre-line leading-relaxed">
              {deskripsiPlain || (
                <span className="text-slate-400">Tidak ada deskripsi.</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-505">Banner Event</label>
            {event.bannerUrl ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden relative w-full h-48">
                <Image
                  src={event.bannerUrl}
                  alt={event.judul ?? "Banner"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl h-24 flex flex-col items-center justify-center gap-1 text-slate-400">
                <ImageIcon size={28} className="text-slate-300" />
                <p className="text-xs">Belum ada banner</p>
              </div>
            )}
          </div>

        </div>
      </SectionCard>

      {/* â”€â”€ 4. SYARAT DAN KETENTUAN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <SectionCard sectionId="syarat" icon={<ClipboardList size={16} />} title="Syarat dan Ketentuan">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-505">
            Detail Syarat &amp; Ketentuan Event
          </label>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 min-h-20 whitespace-pre-line leading-relaxed">
            {syaratPlain || (
              <span className="text-slate-400">Belum ada syarat dan ketentuan.</span>
            )}
          </div>
        </div>
      </SectionCard>

      {/* â”€â”€ 5. JADWAL & KUOTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <SectionCard sectionId="jadwal-kuota" icon={<Calendar size={16} />} title="Jadwal & Kuota">
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
            placeholder="â€”"
          />
        </div>
      </SectionCard>

      {/* â”€â”€ 6. LINK FORM PENDAFTARAN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <SectionCard sectionId="link-pendaftaran" icon={<Link2 size={16} />} title="Link Form Pendaftaran">
        <ReadonlyField
          label="Link Form Pendaftaran untuk Peserta Event"
          value={event.linkEksternal}
          placeholder="https://..."
        />
      </SectionCard>

    </div>
  );
}