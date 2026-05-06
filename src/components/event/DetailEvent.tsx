"use client";

import { useState } from "react";

// ============================================================
// TIPE DATA
// ============================================================
type TabType = "deskripsi" | "pendaftaran" | "syarat";

interface LoketTiket {
  harga: number;
  nama: string;
  keterangan: string;
}

interface EventTerkait {
  id: number;
  nama: string;
  tanggal: string;
  harga: number | null;
  penyelenggara: string;
  gambar: string;
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
    loket: LoketTiket[];
    langkahPendaftaran: string[];
    syaratKetentuan: string[];
    eventTerkait: EventTerkait[];
  };
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
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
  const optionsDay: Intl.DateTimeFormatOptions = { weekday: "long" };
  const optionsDate: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  const hari = new Intl.DateTimeFormat("id-ID", optionsDay)
    .format(date)
    .toUpperCase();
  const tglBulan = new Intl.DateTimeFormat("id-ID", optionsDate)
    .format(date)
    .toUpperCase();
  return `${hari}, ${tglBulan}`;
};

// ============================================================
// HELPER: PISAHKAN DESKRIPSI DAN MATERI
// ============================================================
function parseDeskripsi(deskripsi: string | null) {
  if (!deskripsi) return { teks: "Tidak ada deskripsi.", materi: [] };

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

  return { teks, materi };
}

// ============================================================
// KOMPONEN TAB DESKRIPSI
// ============================================================
function TabDeskripsi({ event }: { event: DetailEventProps["event"] }) {
  const { teks, materi } = parseDeskripsi(event.deskripsi);

  return (
    <div className="tab-content">
      {<p className="deskripsi-text">{teks}</p>}

      {event.pembicara && (
        <div className="info-block">
          <p className="info-label">Special Speaker:</p>
          <p className="info-value">{event.pembicara}</p>
        </div>
      )}

      <div className="info-block">
        <p className="info-label">Pelaksanaan:</p>
        <p className="info-value">{formatTanggal(event.tanggal)}</p>
        <p className="info-value lokasi">{event.lokasi}</p>
      </div>

      {materi.length > 0 && (
        <div className="info-block">
          <p className="info-label">Materi yang Dipelajari:</p>
          <ol className="materi-list">
            {materi.map((item, i) => (
              <li key={i} className="materi-item">
                {i + 1}. {item}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ============================================================
// KOMPONEN TAB PENDAFTARAN
// ============================================================
function TabPendaftaran({ event }: { event: DetailEventProps["event"] }) {
  return (
    <div className="tab-content">
      {/* Langkah Pendaftaran */}
      <div className="section-card">
        <div className="section-header">
          <span className="section-icon">📋</span>
          <h3 className="section-title">Langkah Pendaftaran</h3>
        </div>
        <ol className="langkah-list">
          {event.langkahPendaftaran.map((langkah, i) => (
            <li key={i} className="langkah-item">
              <span className="langkah-num">{i + 1}</span>
              <span dangerouslySetInnerHTML={{ __html: langkah }} />
            </li>
          ))}
        </ol>
      </div>

      {/* Loket Tiket */}
      {event.loket.length > 0 && (
        <div className="section-card">
          <div className="section-header">
            <span className="section-icon">🎟️</span>
            <h3 className="section-title">Loket Platform</h3>
          </div>
          <p className="loket-subtitle">
            {event.loket.length} kategori pendaftaran – harga mulai dari{" "}
            {formatRupiah(event.harga)}
          </p>
          <div className="loket-list">
            {event.loket.map((tiket, i) => (
              <div key={i} className="loket-item">
                <div className="loket-harga">{formatRupiah(tiket.harga)}</div>
                <div className="loket-info">
                  <p className="loket-nama">{tiket.nama}</p>
                  <p className="loket-keterangan">{tiket.keterangan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// KOMPONEN TAB SYARAT & KETENTUAN
// ============================================================
function TabSyarat({ event }: { event: DetailEventProps["event"] }) {
  return (
    <div className="tab-content">
      <div className="section-card">
        <div className="section-header">
          <span className="section-icon">📜</span>
          <h3 className="section-title">Syarat dan Ketentuan</h3>
        </div>
        <ol className="syarat-list">
          {event.syaratKetentuan.map((syarat, i) => (
            <li key={i} className="syarat-item">
              {i + 1}. {syarat}
            </li>
          ))}
        </ol>
      </div>

      {/* Event Terkait */}
      {event.eventTerkait.length > 0 && (
        <div className="event-terkait-section">
          <h3 className="event-terkait-title">Event Untuk Kamu</h3>
          <div className="event-terkait-grid">
            {event.eventTerkait.map((ev) => (
              <div key={ev.id} className="event-terkait-card">
                <div className="event-terkait-img">
                  {ev.gambar ? (
                    <img src={ev.gambar} alt={ev.nama} />
                  ) : (
                    <div className="img-placeholder">📅</div>
                  )}
                </div>
                <div className="event-terkait-info">
                  <p className="ev-nama">{ev.nama}</p>
                  <p className="ev-tanggal">{ev.tanggal}</p>
                  <p className="ev-harga">{formatRupiah(ev.harga)}</p>
                  <p className="ev-penyelenggara">👤 {ev.penyelenggara}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// KOMPONEN UTAMA: DETAIL EVENT
// ============================================================
export default function DetailEvent({ event }: DetailEventProps) {
  const [activeTab, setActiveTab] = useState<TabType>("deskripsi");

  const tabs: { id: TabType; label: string }[] = [
    { id: "deskripsi", label: "Deskripsi" },
    { id: "pendaftaran", label: "Pendaftaran" },
    { id: "syarat", label: "Syarat dan Ketentuan" },
  ];

  return (
    <>
      <style>{`
        /* ==============================
           HERO SECTION
        ============================== */
        .hero-section {
          background-color: #1a2744;
          color: white;
          padding: 48px 0 32px;
          position: relative;
          overflow: hidden;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1a2744 60%, #243560 100%);
        }
        .hero-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          display: flex;
          gap: 40px;
          align-items: flex-start;
        }
        .hero-left {
          flex: 1;
        }
        .hero-kategori {
          display: inline-block;
          background: rgba(255,255,255,0.15);
          color: #a8c4f0;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 4px;
          margin-bottom: 16px;
        }
        .hero-judul {
          font-size: 28px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }
        .hero-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .hero-meta-item {
          font-size: 14px;
          color: #a8c4f0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hero-meta-item strong {
          color: white;
        }
        .hero-right {
          width: 220px;
          flex-shrink: 0;
        }
        .hero-img {
          width: 100%;
          height: 160px;
          border-radius: 10px;
          object-fit: cover;
          border: 2px solid rgba(255,255,255,0.15);
        }
        .hero-img-placeholder {
          width: 100%;
          height: 160px;
          border-radius: 10px;
          background: rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
        }

        /* ==============================
           LAYOUT UTAMA
        ============================== */
        .detail-layout {
          max-width: 1100px;
          margin: 0 auto;
          padding: 32px 24px;
          display: flex;
          gap: 32px;
          align-items: flex-start;
        }
        .detail-main {
          flex: 1;
          min-width: 0;
        }

        /* ==============================
           TAB NAVIGATION
        ============================== */
        .tab-nav {
          display: flex;
          border-bottom: 2px solid #e5e7eb;
          margin-bottom: 28px;
          gap: 0;
        }
        .tab-btn {
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .tab-btn:hover {
          color: #1a2744;
        }
        .tab-btn.active {
          color: #1a2744;
          border-bottom-color: #1a2744;
        }

        /* ==============================
           TAB CONTENT UMUM
        ============================== */
        .tab-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .deskripsi-text {
          font-size: 14px;
          color: #374151;
          line-height: 1.7;
        }
        .info-block {
          margin-top: 4px;
        }
        .info-label {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
        }
        .info-value {
          font-size: 14px;
          color: #374151;
        }
        .info-value.lokasi {
          color: #6b7280;
          font-size: 13px;
        }
        .materi-list {
          list-style: none;
          padding: 0;
          margin: 8px 0 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .materi-item {
          font-size: 14px;
          color: #374151;
          line-height: 1.6;
        }

        /* ==============================
           SECTION CARD
        ============================== */
        .section-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px 24px;
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .section-icon {
          font-size: 18px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a2744;
        }

        /* ==============================
           LANGKAH PENDAFTARAN
        ============================== */
        .langkah-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .langkah-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          color: #374151;
          line-height: 1.5;
        }
        .langkah-num {
          width: 24px;
          height: 24px;
          background: #1a2744;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* ==============================
           LOKET TIKET
        ============================== */
        .loket-subtitle {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 16px;
        }
        .loket-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        .loket-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 16px;
          border-bottom: 1px solid #e5e7eb;
          background: white;
        }
        .loket-item:last-child {
          border-bottom: none;
        }
        .loket-harga {
          font-size: 15px;
          font-weight: 700;
          color: #1a2744;
          min-width: 90px;
        }
        .loket-nama {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }
        .loket-keterangan {
          font-size: 12px;
          color: #9ca3af;
        }

        /* ==============================
           SYARAT & KETENTUAN
        ============================== */
        .syarat-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .syarat-item {
          font-size: 14px;
          color: #374151;
          line-height: 1.6;
          padding-left: 4px;
        }

        /* ==============================
           EVENT TERKAIT
        ============================== */
        .event-terkait-section {
          margin-top: 8px;
        }
        .event-terkait-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a2744;
          margin-bottom: 16px;
        }
        .event-terkait-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .event-terkait-card {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          background: white;
          cursor: pointer;
          transition: box-shadow 0.2s;
        }
        .event-terkait-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        .event-terkait-img {
          height: 120px;
          overflow: hidden;
          background: #f3f4f6;
        }
        .event-terkait-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
        }
        .event-terkait-info {
          padding: 12px;
        }
        .ev-nama {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
          line-height: 1.3;
        }
        .ev-tanggal {
          font-size: 11px;
          color: #9ca3af;
          margin-bottom: 6px;
        }
        .ev-harga {
          font-size: 13px;
          font-weight: 600;
          color: #1a2744;
          margin-bottom: 4px;
        }
        .ev-penyelenggara {
          font-size: 11px;
          color: #6b7280;
        }

        /* ==============================
           SIDEBAR KANAN
        ============================== */
        .detail-sidebar {
          width: 260px;
          flex-shrink: 0;
          position: sticky;
          top: 24px;
        }
        .sidebar-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .sidebar-harga-label {
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 4px;
        }
        .sidebar-harga {
          font-size: 22px;
          font-weight: 800;
          color: #1a2744;
          margin-bottom: 16px;
        }
        .btn-daftar {
          display: block;
          width: 100%;
          padding: 12px;
          background: #1a2744;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          transition: background 0.2s;
          margin-bottom: 16px;
        }
        .btn-daftar:hover {
          background: #243560;
        }
        .sidebar-divider {
          border: none;
          border-top: 1px solid #f3f4f6;
          margin: 16px 0;
        }
        .sidebar-penyelenggara {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .penyelenggara-avatar {
          width: 36px;
          height: 36px;
          background: #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .penyelenggara-label {
          font-size: 11px;
          color: #9ca3af;
        }
        .penyelenggara-nama {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
        }

        /* ==============================
           RESPONSIVE
        ============================== */
        @media (max-width: 768px) {
          .hero-container {
            flex-direction: column-reverse;
          }
          .hero-right {
            width: 100%;
          }
          .detail-layout {
            flex-direction: column;
          }
          .detail-sidebar {
            width: 100%;
            position: static;
          }
          .event-terkait-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .tab-btn {
            padding: 10px 12px;
            font-size: 13px;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-left">
            <span className="hero-kategori">{event.kategori}</span>
            <h1 className="hero-judul">{event.nama}</h1>
            <div className="hero-meta">
              <span className="hero-meta-item">
                {event.tipePlatform === "online" ? "🌐" : event.tipePlatform === "hybrid" ? "🔀" : "📍"}{" "}
                <strong>
                  {event.tipePlatform === "online"
                    ? "Online"
                    : event.tipePlatform === "hybrid"
                    ? "Hybrid"
                    : "Offline"}{" "}
                  ({event.penyelenggara})
                </strong>
              </span>
              <span className="hero-meta-item">
                📅 {formatTanggal(event.tanggal)}
              </span>
              <span className="hero-meta-item">
                🏷️ {event.kategori}
              </span>
            </div>
          </div>
          <div className="hero-right">
            {event.gambar ? (
              <img src={event.gambar} alt={event.nama} className="hero-img" />
            ) : (
              <div className="hero-img-placeholder">🎪</div>
            )}
          </div>
        </div>
      </section>

      {/* KONTEN + SIDEBAR */}
      <div className="detail-layout">
        {/* KONTEN UTAMA */}
        <div className="detail-main">
          {/* TAB NAVIGATION */}
          <nav className="tab-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* KONTEN TAB */}
          {activeTab === "deskripsi" && <TabDeskripsi event={event} />}
          {activeTab === "pendaftaran" && <TabPendaftaran event={event} />}
          {activeTab === "syarat" && <TabSyarat event={event} />}
        </div>

        {/* SIDEBAR */}
        <aside className="detail-sidebar">
          <div className="sidebar-card">
            <p className="sidebar-harga-label">Harga mulai dari</p>
            <p className="sidebar-harga">{formatRupiah(event.harga)}</p>
            <a href={`/registrasi-event/${event.id}`} className="btn-daftar">
              Daftar
            </a>
            <hr className="sidebar-divider" />
            <div className="sidebar-penyelenggara">
              <div className="penyelenggara-avatar">👤</div>
              <div>
                <p className="penyelenggara-label">Diselenggarakan oleh</p>
                <p className="penyelenggara-nama">{event.penyelenggara}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
