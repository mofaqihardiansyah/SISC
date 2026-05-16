import { InferSelectModel } from "drizzle-orm";
import { event as eventSchema } from "@/db/schema";

type EventType = {
  id: number;
  judul: string | null;
  deskripsi: string | null;
  namaPembicara: string | null;
  peranPembicara: string | null;
  tanggalMulai: Date | null;
  detailLokasi: string | null;
  linkEksternal: string | null;
  syaratDanKetentuan: string | null;

  kota?: {
    nama: string | null;
    provinsi?: {
      nama: string | null;
    } | null;
  } | null;
};

type Props = {
  event: EventType;
};

function parseDeskripsi(deskripsi?: string | null) {
  if (!deskripsi?.trim()) {
    return {
      teks: "Tidak ada deskripsi.",
      materi: [],
    };
  }

  const [teksPart, materiPart] =
    deskripsi.split("Materi yang Dipelajari:");

  const materi =
    materiPart
      ?.split("\n")
      .map((item) => item.trim())
      .filter((item) => /^\d+\./.test(item))
      .map((item) => item.replace(/^\d+\.\s*/, "")) || [];

  return {
    teks: teksPart.trim(),
    materi,
  };
}

export default function Content({ event }: Props) {
  const { teks, materi } = parseDeskripsi(event.deskripsi);

  const syaratList =
    event.syaratDanKetentuan
      ?.split("\n")
      .map((item) => item.trim())
      .filter(Boolean) || [];

  // LANGKAH FIX TANPA LINK EKSTERNAL
  const langkahPendaftaran = [
    "Pendaftaran dilakukan langsung melalui platform POLIVENTS",
    "Lengkapi data peserta",
    "Konfirmasi pendaftaran",
  ];

  return (
    <div className="space-y-16">

      {/* DESKRIPSI */}
      <section id="deskripsi" className="pt-2">
        <h2 className="text-4xl font-bold text-[#1B1B1B] mb-8">
          Deskripsi
        </h2>

        {/* BOX DESKRIPSI */}
        <div className="border border-gray-200 rounded-3xl p-8 bg-white">

          <div className="space-y-8 text-[#2B3A55]">

            {/* Isi Deskripsi */}
            <div>
              <p className="text-lg leading-relaxed text-gray-700">
                {teks}
              </p>
            </div>

            {/* Materi */}
            {materi.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-black mb-5">
                  Materi yang Dipelajari
                </h3>

                <div className="space-y-4">
                  {materi.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#13254C] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {i + 1}
                      </div>

                      <p className="leading-7 text-gray-700">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speaker */}
            {event.namaPembicara && (
              <div>
                <h3 className="font-bold text-black mb-3 text-xl">
                  Special Speaker
                </h3>

                <p className="text-lg text-gray-700">
                  {event.namaPembicara}
                  {event.peranPembicara &&
                    ` (${event.peranPembicara})`}
                </p>
              </div>
            )}

            {/* Pelaksanaan */}
            <div>
              <h3 className="font-bold text-black mb-3 text-xl">
                Pelaksanaan
              </h3>

              <p className="uppercase tracking-wide text-lg text-gray-800">
  {event.tanggalMulai
    ? new Date(event.tanggalMulai).toLocaleDateString(
        "id-ID",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Tanggal belum ditentukan"}
</p>

              <p className="text-gray-500 text-lg mt-1">
                {event.detailLokasi},{" "}
                {event.kota?.nama}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* PENDAFTARAN */}
      <section id="pendaftaran">
        <h2 className="text-4xl font-bold mb-8">
          Pendaftaran
        </h2>

        <div className="border border-gray-200 rounded-3xl p-8 bg-white">

          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">📝</span>

            <h3 className="text-2xl font-bold">
              Langkah Pendaftaran
            </h3>
          </div>

          <div className="space-y-6">
            {langkahPendaftaran.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-5"
              >
                <div className="w-9 h-9 rounded-full bg-[#13254C] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {i + 1}
                </div>

                <p className="leading-8 text-gray-700 text-lg">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYARAT */}
      <section id="syarat">
        <h2 className="text-4xl font-bold mb-8">
          Syarat dan Ketentuan
        </h2>

        <div className="border border-gray-200 rounded-3xl p-8 bg-white">

          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">📋</span>

            <h3 className="text-2xl font-bold">
              Ketentuan Peserta
            </h3>
          </div>

          {syaratList.length > 0 ? (
            <div className="space-y-6">

              {syaratList.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-5"
                >
                  <div className="w-9 h-9 rounded-full bg-[#13254C] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {i + 1}
                  </div>

                  <p className="leading-8 text-gray-700 text-lg">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-lg">
              Belum ada syarat dan ketentuan.
            </p>
          )}
        </div>
      </section>

    </div>
  );
}