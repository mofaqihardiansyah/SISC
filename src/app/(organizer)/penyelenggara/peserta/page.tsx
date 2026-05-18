"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Download, Users, Loader2, Check, X, Pencil, Trash2, Info, ChevronLeft, ChevronRight } from "lucide-react";

// ============================================================
// TIPE DATA
// ============================================================
type StatusPendaftaran = "terdaftar" | "dibatalkan" | "hadir";

interface PesertaData {
  pendaftaranId: number;
  kodePendaftaran: string;
  status: StatusPendaftaran;
  dibuatPada: string;
  namaEvent: string;
  peserta: {
    id: number;
    namaLengkap: string;
    email: string;
    nomorTelepon: string;
    jenisKelamin: string | null;
    sudahCheckIn: boolean;
    waktuCheckIn: string | null;
  } | null;
}

// ============================================================
// HELPERS
// ============================================================
const STATUS_LABEL: Record<StatusPendaftaran, { label: string; color: string }> = {
  terdaftar: { label: "MENUNGGU", color: "#f59e0b" },
  hadir:     { label: "TERVERIFIKASI", color: "#10b981" },
  dibatalkan:{ label: "DITOLAK", color: "#ef4444" },
};

const getInisial = (nama: string) => {
  const parts = nama.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : nama.slice(0, 2).toUpperCase();
};

const getBgColor = (nama: string) => {
  const colors = ["#6366f1","#0ea5e9","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899"];
  let hash = 0;
  for (let i = 0; i < nama.length; i++) hash = nama.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

// ============================================================
// KOMPONEN STATUS BADGE
// ============================================================
function StatusBadge({ status }: { status: StatusPendaftaran }) {
  const { label, color } = STATUS_LABEL[status];
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.5px",
      color: "white",
      backgroundColor: color,
    }}>
      {label}
    </span>
  );
}

// ============================================================
// KOMPONEN UTAMA
// ============================================================
export default function InformasiPesertaPage() {

  const [pesertaList, setPesertaList] = useState<PesertaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const PER_PAGE = 10;

  // ── Fetch data ──────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        status: filterStatus,
        page: String(page),
        perPage: String(PER_PAGE),
      });
      const res = await fetch(`/api/organizer/peserta?${params}`);
      const json = await res.json();
      setPesertaList(json.data ?? []);
      setTotalData(json.total ?? 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Reset page saat filter/search berubah
  useEffect(() => { setPage(1); }, [search, filterStatus]);

  // ── Update status ────────────────────────────────────────────
  const updateStatus = async (pendaftaranId: number, newStatus: StatusPendaftaran) => {
    setActionLoading(pendaftaranId);
    try {
      await fetch("/api/organizer/peserta", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendaftaranId, status: newStatus }),
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Export CSV ───────────────────────────────────────────────
  const exportCSV = () => {
    const header = ["Nama", "Email", "No. HP", "Event", "Status", "Kode Pendaftaran", "Tanggal Daftar"];
    const rows = pesertaList.map((p) => [
      p.peserta?.namaLengkap ?? "-",
      p.peserta?.email ?? "-",
      p.peserta?.nomorTelepon ?? "-",
      p.namaEvent,
      STATUS_LABEL[p.status]?.label ?? p.status,
      p.kodePendaftaran,
      new Date(p.dibuatPada).toLocaleDateString("id-ID"),
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "peserta.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Pagination ───────────────────────────────────────────────
  const totalPages = Math.ceil(totalData / PER_PAGE);
  const startItem = (page - 1) * PER_PAGE + 1;
  const endItem = Math.min(page * PER_PAGE, totalData);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      <style>{`
        .ip-page { padding: 32px 28px; background: #f8fafc; min-height: 100vh; }
        .ip-header { margin-bottom: 8px; }
        .ip-title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
        .ip-subtitle { font-size: 13px; color: #64748b; margin: 4px 0 0; }

        .ip-toolbar {
          display: flex;
          gap: 12px;
          margin: 24px 0 20px;
          align-items: center;
          flex-wrap: wrap;
        }
        .ip-search-wrap {
          position: relative;
          flex: 1;
          min-width: 240px;
        }
        .ip-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 15px;
          pointer-events: none;
        }
        .ip-search {
          width: 100%;
          padding: 10px 14px 10px 36px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          color: #0f172a;
          outline: none;
          box-sizing: border-box;
          transition: border 0.15s;
        }
        .ip-search:focus { border-color: #6366f1; }
        .ip-search::placeholder { color: #94a3b8; }

        .ip-select {
          padding: 10px 32px 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          color: #0f172a;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
        }

        .ip-btn-export {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .ip-btn-export:hover { background: #334155; }

        .ip-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .ip-section-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }
        .ip-total-badge {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        .ip-table-wrap {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        .ip-table {
          width: 100%;
          border-collapse: collapse;
        }
        .ip-table thead {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .ip-table th {
          padding: 12px 16px;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-align: left;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .ip-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        .ip-table tr:last-child td { border-bottom: none; }
        .ip-table tr:hover td { background: #fafafa; }

        .peserta-info { display: flex; align-items: center; gap: 10px; }
        .peserta-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }
        .peserta-nama {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.2;
        }
        .peserta-event {
          font-size: 12px;
          color: #64748b;
          margin-top: 2px;
        }
        .peserta-email { font-size: 13px; color: #374151; }
        .peserta-hp { font-size: 13px; color: #374151; }

        .aksi-wrap { display: flex; align-items: center; gap: 6px; }
        .btn-aksi {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          transition: opacity 0.15s;
        }
        .btn-aksi:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-verif { background: #d1fae5; color: #065f46; }
        .btn-verif:hover:not(:disabled) { background: #a7f3d0; }
        .btn-tolak { background: #fee2e2; color: #991b1b; }
        .btn-tolak:hover:not(:disabled) { background: #fecaca; }
        .btn-edit  { background: #f1f5f9; color: #475569; }
        .btn-edit:hover:not(:disabled)  { background: #e2e8f0; }
        .btn-hapus { background: #f1f5f9; color: #475569; }
        .btn-hapus:hover:not(:disabled) { background: #fee2e2; color: #991b1b; }

        .ip-empty {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
          font-size: 14px;
        }
        .ip-empty-icon { font-size: 40px; margin-bottom: 12px; }

        .ip-loading {
          text-align: center;
          padding: 60px;
          color: #94a3b8;
          font-size: 14px;
        }

        .ip-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .ip-pagination-info { font-size: 13px; color: #64748b; }
        .ip-pagination-btns { display: flex; gap: 4px; align-items: center; }
        .ip-page-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          background: white;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #374151;
          transition: all 0.15s;
        }
        .ip-page-btn:hover:not(:disabled) { background: #f8fafc; border-color: #6366f1; color: #6366f1; }
        .ip-page-btn.active { background: #1e293b; color: white; border-color: #1e293b; font-weight: 700; }
        .ip-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .ip-page-dots { font-size: 13px; color: #94a3b8; padding: 0 4px; }

        @media (max-width: 768px) {
          .ip-page { padding: 20px 16px; }
          .ip-table th:nth-child(3),
          .ip-table td:nth-child(3) { display: none; }
          .ip-table th:nth-child(4),
          .ip-table td:nth-child(4) { display: none; }
        }
      `}</style>

      <div className="ip-page">
        {/* HEADER */}
        <div className="ip-header">
          <h1 className="ip-title">Data & Validasi Peserta</h1>
          <p className="ip-subtitle">Validasi Peserta</p>
        </div>

        {/* TOOLBAR */}
        <div className="ip-toolbar">
          <div className="ip-search-wrap">
            <span className="ip-search-icon"><Search size={15} /></span>
            <input
              className="ip-search"
              placeholder="Cari nama peserta, email, atau nomor telepon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="ip-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="semua">Semua Status</option>
            <option value="terdaftar">Menunggu</option>
            <option value="hadir">Terverifikasi</option>
            <option value="dibatalkan">Ditolak</option>
          </select>
          <button className="ip-btn-export" onClick={exportCSV}>
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* SECTION HEADER */}
        <div className="ip-section-header">
          <span className="ip-section-title">
            Daftar Peserta{" "}
            <span className="ip-total-badge">({totalData} Total)</span>
          </span>
        </div>

        {/* TABEL */}
        <div className="ip-table-wrap">
          {loading ? (
            <div className="ip-loading flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={24} />
              <span>Memuat data...</span>
            </div>
          ) : pesertaList.length === 0 ? (
            <div className="ip-empty">
              <div className="ip-empty-icon flex justify-center"><Users size={40} /></div>
              <div>Tidak ada peserta ditemukan</div>
            </div>
          ) : (
            <table className="ip-table">
              <thead>
                <tr>
                  <th>PESERTA & EVENT</th>
                  <th>EMAIL</th>
                  <th>NOMOR HP</th>
                  <th>STATUS</th>
                  <th>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {pesertaList.map((item) => {
                  const nama = item.peserta?.namaLengkap ?? "Peserta";
                  const isLoading = actionLoading === item.pendaftaranId;
                  return (
                    <tr key={item.pendaftaranId}>
                      {/* Peserta & Event */}
                      <td>
                        <div className="peserta-info">
                          <div
                            className="peserta-avatar"
                            style={{ backgroundColor: getBgColor(nama) }}
                          >
                            {getInisial(nama)}
                          </div>
                          <div>
                            <div className="peserta-nama">{nama}</div>
                            <div className="peserta-event">{item.namaEvent}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td>
                        <span className="peserta-email">
                          {item.peserta?.email ?? "-"}
                        </span>
                      </td>

                      {/* No HP */}
                      <td>
                        <span className="peserta-hp">
                          {item.peserta?.nomorTelepon ?? "-"}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Aksi */}
                      <td>
                        <div className="aksi-wrap">
                          {item.status === "terdaftar" && (
                            <>
                              <button
                                className="btn-aksi btn-verif"
                                title="Verifikasi"
                                disabled={isLoading}
                                onClick={() => updateStatus(item.pendaftaranId, "hadir")}
                              >
                                <Check size={16} />
                              </button>
                              <button
                                className="btn-aksi btn-tolak"
                                title="Tolak"
                                disabled={isLoading}
                                onClick={() => updateStatus(item.pendaftaranId, "dibatalkan")}
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                          {item.status === "hadir" && (
                            <>
                              <button
                                className="btn-aksi btn-edit"
                                title="Edit"
                                disabled={isLoading}
                                onClick={() => updateStatus(item.pendaftaranId, "terdaftar")}
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                className="btn-aksi btn-hapus"
                                title="Hapus Verifikasi"
                                disabled={isLoading}
                                onClick={() => updateStatus(item.pendaftaranId, "dibatalkan")}
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                          {item.status === "dibatalkan" && (
                            <>
                              <button
                                className="btn-aksi btn-edit"
                                title="Info"
                                disabled
                              >
                                <Info size={16} />
                              </button>
                              <button
                                className="btn-aksi btn-edit"
                                title="Pulihkan"
                                disabled={isLoading}
                                onClick={() => updateStatus(item.pendaftaranId, "terdaftar")}
                              >
                                <Pencil size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        {totalData > 0 && (
          <div className="ip-pagination">
            <span className="ip-pagination-info">
              Menampilkan {startItem} - {endItem} dari {totalData} peserta
            </span>
            <div className="ip-pagination-btns">
              <button
                className="ip-page-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="ip-page-dots">...</span>
                ) : (
                  <button
                    key={p}
                    className={`ip-page-btn ${page === p ? "active" : ""}`}
                    onClick={() => setPage(p as number)}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                className="ip-page-btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
