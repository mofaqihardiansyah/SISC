"use client";

import { useEffect, useRef, useState } from "react";
import EventCard from "@/components/shared/EventCard";
import {
  Globe,
  Shuffle,
  MapPin,
  Calendar,
  Tag,
  Tent,
  ClipboardList,
  Ticket,
  ScrollText,
  User,
} from "lucide-react";
import EventViewTracker from "./EventViewTracker";

type SectionId = "deskripsi" | "pendaftaran" | "syarat";

interface LoketTiket {
  harga: number;
  nama: string;
  keterangan: string;
}

interface EventTerkait {
  id: string;
  title: string;
  date: string;
  price: number | null;
  category: string;
  type: "POLINES" | "UMUM";
  imageUrl: string;
  tipePlatform: string;
  kotaNama: string;
  kategoriNama: string;
}

interface DetailEventProps {
  event: {
    id: number;
    nama: string;
    lokasi: string;
    tanggal: Date | null;
    kategori: string;
    deskripsi: string | null;
    pembicara: string | null;
    harga: number | null;
    penyelenggara: string;
    gambar: string | null;
    tipePlatform: string;
    isEventPolines: boolean | null;
    hasilScraping: boolean | null;
    websiteSumber: string | null;
    linkEksternal: string | null;
    loket: LoketTiket[];
    langkahPendaftaran: string[];
    syaratKetentuan: string[];
    eventTerkait: EventTerkait[];
  };
  isLoggedIn: boolean;
}

const formatRupiah = (angka: number | null) => {
  if (!angka || angka === 0) return "Gratis";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

const formatTanggal = (dateStr: Date | null) => {
  if (!dateStr) return "TANGGAL BELUM DITENTUKAN";

  const date = new Date(dateStr);

  const hari = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
  })
    .format(date)
    .toUpperCase();

  const tglBulan = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();

  return `${hari}, ${tglBulan}`;
};

function parseDeskripsi(deskripsi: string | null) {
  if (!deskripsi) {
    return {
      teks: "Tidak ada deskripsi.",
      materi: [],
    };
  }

  const parts = deskripsi.split("Materi yang Dipelajari:");
  const teks = parts[0].trim();
  const materi: string[] = [];

  if (parts[1]) {
    parts[1]
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.match(/^\d+\./))
      .forEach((l) => materi.push(l.replace(/^\d+\.\s*/, "")));
  }

  return {
    teks,
    materi,
  };
}

export default function DetailEvent({ event, isLoggedIn }: DetailEventProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("deskripsi");

  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    deskripsi: null,
    pendaftaran: null,
    syarat: null,
  });

  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const navHeight = navRef.current?.offsetHeight ?? 80;

    const sections: SectionId[] = ["deskripsi", "pendaftaran", "syarat"];

    sections.forEach((id) => {
      const el = sectionRefs.current[id];
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: `-${navHeight + 16}px 0px -60% 0px`,
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const scrollToSection = (id: SectionId) => {
    const el = sectionRefs.current[id];
    if (!el) return;

    const navHeight = navRef.current?.offsetHeight ?? 80;
    const top =
      el.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  const { teks, materi } = parseDeskripsi(event.deskripsi);

  let urlPendaftaran = `/registrasi-event/${event.id}`;
  let isExternalUrl = false;

  if (event.isEventPolines) {
    urlPendaftaran = `/registrasi-event/${event.id}`;
  } else if (event.hasilScraping) {
    urlPendaftaran = event.websiteSumber || event.linkEksternal || "#";
    isExternalUrl = true;
  } else if (event.linkEksternal) {
    urlPendaftaran = event.linkEksternal;
    isExternalUrl = true;
  }

  const renderTombolDaftar = () => {
    if (isExternalUrl) {
      return (
        <a
          href={urlPendaftaran}
          className="block w-full p-3 bg-[#1a2744] hover:bg-[#243560] text-white rounded-lg text-[15px] font-bold text-center transition-colors mb-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          Kunjungi Website
        </a>
      );
    }

    return (
      <a
        href={urlPendaftaran}
        className="block w-full p-3 bg-[#1a2744] hover:bg-[#243560] text-white rounded-lg text-[15px] font-bold text-center transition-colors mb-4"
      >
        {isLoggedIn ? "Daftar" : "Login untuk Daftar"}
      </a>
    );
  };

  const navItems: { id: SectionId; label: string }[] = [
    { id: "deskripsi", label: "Deskripsi" },
    { id: "pendaftaran", label: "Pendaftaran" },
    { id: "syarat", label: "Syarat dan Ketentuan" },
  ];

  return (
    <>
      <EventViewTracker eventId={event.id} />

      <section className="bg-[#1a2744] text-white py-12 px-0 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#1a2744] before:from-60% before:to-[#243560]">
        <div className="max-w-[1100px] mx-auto px-6 relative flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1">
            <span className="inline-block bg-white/15 text-[#a8c4f0] text-xs font-semibold tracking-[1px] uppercase px-3 py-1 rounded mb-4">
              {event.kategori}
            </span>

            <h1 className="text-3xl md:text-[28px] font-extrabold leading-tight mb-4 tracking-[-0.5px]">
              {event.nama}
            </h1>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-[#a8c4f0] flex items-center gap-2">
                {event.tipePlatform === "online" ? (
                  <Globe size={18} />
                ) : event.tipePlatform === "hybrid" ? (
                  <Shuffle size={18} />
                ) : (
                  <MapPin size={18} />
                )}{" "}
                <strong className="text-white font-bold">
                  {event.tipePlatform === "online"
                    ? "Online"
                    : event.tipePlatform === "hybrid"
                    ? "Hybrid"
                    : "Offline"}{" "}
                  ({event.penyelenggara})
                </strong>
              </span>

              <span className="text-sm text-[#a8c4f0] flex items-center gap-2">
                <Calendar size={18} /> {formatTanggal(event.tanggal)}
              </span>

              <span className="text-sm text-[#a8c4f0] flex items-center gap-2">
                <Tag size={18} /> {event.kategori}
              </span>
            </div>
          </div>

          <div className="w-full md:w-[220px] shrink-0">
            {event.gambar ? (
              <img
                src={event.gambar}
                alt={event.nama}
                className="w-full h-[160px] rounded-[10px] object-cover border-2 border-white/15"
              />
            ) : (
              <div className="w-full h-[160px] rounded-[10px] bg-white/5 flex items-center justify-center text-5xl">
                <Tent size={48} className="text-slate-400" />
              </div>
            )}
          </div>
        </div>
      </section>

      <nav
        className="sticky top-[64px] z-40 bg-white border-b border-gray-200"
        ref={navRef}
      >
        <div className="max-w-[1100px] mx-auto px-6 flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`px-3 md:px-5 py-3.5 text-[13px] md:text-sm font-medium bg-transparent border-b-2 cursor-pointer whitespace-nowrap transition-colors hover:text-gray-900 ${
                activeSection === item.id
                  ? "text-gray-900 font-bold border-gray-900"
                  : "text-gray-500 border-transparent"
              }`}
              onClick={() => scrollToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-[1100px] mx-auto px-6 py-8 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 min-w-0 flex flex-col">
          <section
            id="deskripsi"
            className="pb-12 border-b border-gray-100 mb-12 last:border-b-0 last:mb-0"
            ref={(el) => {
              sectionRefs.current.deskripsi = el;
            }}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Deskripsi
            </h2>

            <p className="text-sm text-gray-700 leading-relaxed mb-5">
              {teks}
            </p>

            {event.pembicara && (
              <div className="mb-4">
                <p className="text-[13px] font-bold text-gray-900 mb-1">
                  Special Speaker:
                </p>
                <p className="text-sm text-gray-700">{event.pembicara}</p>
              </div>
            )}

            <div className="mb-4">
              <p className="text-[13px] font-bold text-gray-900 mb-1">
                Pelaksanaan:
              </p>
              <p className="text-sm text-gray-700">
                {formatTanggal(event.tanggal)}
              </p>
              <p className="text-[13px] text-gray-500">{event.lokasi}</p>
            </div>

            {materi.length > 0 && (
              <div className="mb-4">
                <p className="text-[13px] font-bold text-gray-900 mb-1">
                  Materi yang Dipelajari:
                </p>
                <ol className="list-none p-0 mt-2 flex flex-col gap-1.5">
                  {materi.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-700 leading-relaxed"
                    >
                      {i + 1}. {item}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>

          <section
            id="pendaftaran"
            className="pb-12 border-b border-gray-100 mb-12 last:border-b-0 last:mb-0"
            ref={(el) => {
              sectionRefs.current.pendaftaran = el;
            }}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Pendaftaran
            </h2>

            <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-5 md:px-6 mb-4 last:mb-0">
              <div className="flex items-center gap-2.5 mb-4">
                <ClipboardList size={22} />
                <h3 className="text-base font-bold text-[#1a2744]">
                  Langkah Pendaftaran
                </h3>
              </div>

              <ol className="list-none p-0 flex flex-col gap-2.5">
                {event.langkahPendaftaran.map((langkah, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed"
                  >
                    <span className="w-6 h-6 bg-[#1a2744] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-[1px]">
                      {i + 1}
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: langkah }} />
                  </li>
                ))}
              </ol>
            </div>

            {event.loket.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-5 md:px-6 mb-4 last:mb-0">
                <div className="flex items-center gap-2.5 mb-4">
                  <Ticket size={22} />
                  <h3 className="text-base font-bold text-[#1a2744]">
                    Loket Platform
                  </h3>
                </div>

                <p className="text-[13px] text-gray-500 mb-4">
                  {event.loket.length} kategori pendaftaran – harga mulai
                  dari {formatRupiah(event.harga)}
                </p>

                <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
                  {event.loket.map((tiket, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 py-3.5 px-4 border-b border-gray-200 bg-white last:border-b-0"
                    >
                      <div className="text-[15px] font-bold text-[#1a2744] min-w-[90px]">
                        {formatRupiah(tiket.harga)}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {tiket.nama}
                        </p>
                        <p className="text-xs text-gray-400">
                          {tiket.keterangan}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section
            id="syarat"
            className="pb-12 border-b border-gray-100 mb-12 last:border-b-0 last:mb-0"
            ref={(el) => {
              sectionRefs.current.syarat = el;
            }}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Syarat dan Ketentuan
            </h2>

            <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-5 md:px-6 mb-4 last:mb-0">
              <div className="flex items-center gap-2.5 mb-4">
                <ScrollText size={22} />
                <h3 className="text-base font-bold text-[#1a2744]">
                  Ketentuan Peserta
                </h3>
              </div>

              <ol className="list-none p-0 flex flex-col gap-3">
                {event.syaratKetentuan.map((syarat, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-700 leading-relaxed pl-1"
                  >
                    {i + 1}. {syarat}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>

        <aside className="w-full md:w-[280px] shrink-0 static md:sticky md:top-[128px] self-start">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Harga mulai dari</p>

            <p className="text-[22px] font-extrabold text-[#1a2744] mb-4">
              {formatRupiah(event.harga)}
            </p>

            {renderTombolDaftar()}

            <hr className="border-0 border-t border-gray-100 my-4" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-lg shrink-0">
                <User size={20} className="text-slate-500" />
              </div>

              <div>
                <p className="text-[11px] text-gray-400">
                  Diselenggarakan oleh
                </p>
                <p className="text-[13px] font-bold text-gray-900">
                  {event.penyelenggara}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {event.eventTerkait.length > 0 && (
        <div className="max-w-[1100px] mx-auto px-6 pb-24 mt-16 border-t border-slate-100 pt-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-10 text-center">
            Event Untuk Kamu
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {event.eventTerkait.map((ev) => (
              <EventCard key={ev.id} {...ev} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}