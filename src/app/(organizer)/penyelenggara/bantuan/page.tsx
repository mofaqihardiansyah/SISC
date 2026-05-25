"use client";

import { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";

const TABS = [
  { label: "Semua", slug: "semua" },
  { label: "Informasi Akun", slug: "akun" },
  { label: "Kelola Event", slug: "event" },
];

const FAQ_LIST = [
  {
    id: 1,
    slug: "semua",
    pertanyaan: "Bagaimana cara mendaftar event?",
    jawaban:
      'Anda dapat mendaftar event dengan memilih event yang diinginkan, klik tombol "Daftar Sekarang", lengkapi data diri, dan pilih metode pembayaran yang tersedia.',
    defaultOpen: true,
  },
  {
    id: 2,
    slug: "semua",
    pertanyaan: "Berapa lama proses persetujuan pengajuan event?",
    jawaban:
      "Proses persetujuan pengajuan event biasanya memakan waktu 1–3 hari kerja. Anda akan mendapat notifikasi melalui email setelah event disetujui atau ditolak.",
    defaultOpen: false,
  },
  {
    id: 3,
    slug: "akun",
    pertanyaan: "Apakah saya bisa mengubah akun pengunjung menjadi penyelenggara?",
    jawaban:
      "Tidak. Peran pengunjung dan penyelenggara dipisahkan. Satu akun hanya dapat memiliki satu peran yang dipilih pada saat pendaftaran pertama kali.",
    defaultOpen: false,
  },
  {
    id: 4,
    slug: "event",
    pertanyaan: "Bagaimana cara membuat dan mempublikasikan event?",
    jawaban:
      "Buka menu Kelola Event lalu klik Buat Event Baru. Isi detail event seperti nama, tanggal, lokasi, dan deskripsi. Setelah selesai, submit event untuk direview dan dipublikasikan oleh admin.",
    defaultOpen: false,
  },
  {
    id: 5,
    slug: "event",
    pertanyaan: "Bagaimana cara membatalkan pendaftaran event?",
    jawaban:
      "Buka Dashboard > Event Saya > Batalkan. Kebijakan refund berlaku sesuai ketentuan penyelenggara event masing-masing.",
    defaultOpen: false,
  },
  {
    id: 6,
    slug: "event",
    pertanyaan: "Bagaimana cara melihat daftar peserta yang mendaftar event saya?",
    jawaban:
      "Masuk ke menu Kelola Event, pilih event yang ingin dilihat, lalu klik tab Informasi Peserta. Di sana Anda dapat melihat seluruh data peserta yang telah mendaftar.",
    defaultOpen: false,
  },
  {
    id: 7,
    slug: "event",
    pertanyaan: "Apakah saya bisa mengedit event yang sudah dipublikasikan?",
    jawaban:
      "Ya, Anda bisa mengedit event yang sudah dipublikasikan melalui menu Kelola Event > Edit. Namun perubahan tertentu mungkin memerlukan persetujuan ulang dari admin.",
    defaultOpen: false,
  },
];

function FaqItem({
  pertanyaan,
  jawaban,
  defaultOpen = false,
}: {
  pertanyaan: string;
  jawaban: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded-2xl border bg-white transition-all duration-200 ${
        open ? "border-blue-300 shadow-sm" : "border-gray-200"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span
          className={`text-sm font-semibold ${
            open ? "text-gray-900" : "text-gray-700"
          }`}
        >
          {pertanyaan}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 ml-4 text-gray-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-6 pb-5 border-t border-gray-100">
          <p className="text-sm text-gray-500 leading-relaxed pt-3">
            {jawaban}
          </p>
        </div>
      )}
    </div>
  );
}

export default function BantuanPage() {
  const [activeTab, setActiveTab] = useState("semua");

  const filtered =
    activeTab === "semua"
      ? FAQ_LIST
      : FAQ_LIST.filter((f) => f.slug === activeTab || f.slug === "semua");

  return (
    <div className="p-8 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Bantuan</h2>

      <div className="flex gap-6 items-start">
        {/* FAQ Section */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex items-center gap-3 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => setActiveTab(tab.slug)}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${
                  activeTab === tab.slug
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          <div className="flex flex-col gap-3">
            {filtered.map((faq) => (
              <FaqItem
                key={faq.id}
                pertanyaan={faq.pertanyaan}
                jawaban={faq.jawaban}
                defaultOpen={faq.defaultOpen}
              />
            ))}
          </div>
        </div>

        {/* Pusat Bantuan Card */}
        <div className="w-[190px] shrink-0 bg-white rounded-2xl border border-gray-200 p-5 flex flex-col items-center text-center">
          <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-20 h-20 mb-2"
          >
            <circle cx="40" cy="30" r="16" fill="#DBEAFE" />
            <ellipse cx="40" cy="16" rx="11" ry="6" fill="#1B2D45" />
            <circle cx="35" cy="29" r="2" fill="#1B2D45" />
            <circle cx="45" cy="29" r="2" fill="#1B2D45" />
            <path
              d="M36 35.5 Q40 39 44 35.5"
              stroke="#1B2D45"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M24 28 Q20 28 20 34 L20 38 Q20 44 24 44"
              stroke="#1B2D45"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M56 28 Q60 28 60 34 L60 38 Q60 44 56 44"
              stroke="#1B2D45"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <rect x="22" y="46" width="36" height="22" rx="9" fill="#2563EB" />
            <rect x="30" y="48.5" width="20" height="3.5" rx="1.75" fill="#93C5FD" />
            <line x1="40" y1="68" x2="40" y2="74" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
            <line x1="34" y1="74" x2="46" y2="74" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <p className="font-bold text-gray-800 text-sm mb-1">Pusat Bantuan</p>
          <p className="font-semibold text-gray-700 text-xs mb-1">
            Masih Butuh Bantuan?
          </p>
          <p className="text-gray-400 text-[11px] leading-relaxed mb-4">
            Tim kami siap membantu Anda secara profesional. Kirim detail masalah
            anda:
          </p>

          <a
            href="mailto:bantuan@polivents.com"
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors duration-150"
          >
            <Mail size={13} />
            Kirim Email
          </a>
        </div>
      </div>
    </div>
  );
}
