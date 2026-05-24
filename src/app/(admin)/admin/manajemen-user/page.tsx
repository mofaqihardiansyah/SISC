"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, Trash2, MoreVertical, ChevronLeft, ChevronRight,
  Users, UserCheck, UserX, Clock, TrendingUp, Loader2,
  ChevronUp, ChevronDown, ChevronsUpDown, X, Eye,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortField = "namaLengkap" | "dibuatPada" | "role";
type SortDir = "asc" | "desc";

interface User {
  id: number;
  namaLengkap: string;
  email: string;
  role: "organizer" | "visitor";
  isSuspended: boolean;
  isApproved: boolean;
  dibuatPada: string;
  avatarUrl: string | null;
}

interface UserDetail extends User {
  nomorTelepon: string | null;
  institution: string | null;
  pekerjaan: string | null;
  jenisKelamin: string | null;
  tanggalLahir: string | null;
  lastActiveAt: string | null;
}

interface ApiResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

interface Stats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ["#f59e0b","#3b82f6","#8b5cf6","#ec4899","#14b8a6","#ef4444","#22c55e","#f97316"];
const getAvatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];
const getInitials = (name: string) => name?.split(" ").slice(0,2).map((n)=>n[0]).join("").toUpperCase() ?? "?";
const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-";
const formatDateTime = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

const ROWS_PER_PAGE = 5;

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ user, size = "md" }: { user: { id: number; namaLengkap: string; avatarUrl: string | null }; size?: "md" | "lg" }) {
  const cls = size === "lg" ? "w-16 h-16 text-base" : "w-8 h-8 text-[10px]";
  return user.avatarUrl ? (
    <img src={user.avatarUrl} alt={user.namaLengkap} className={`${cls} rounded-full object-cover shrink-0`} />
  ) : (
    <div className={`${cls} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      style={{ backgroundColor: getAvatarColor(user.id) }}>
      {getInitials(user.namaLengkap)}
    </div>
  );
}

function StatusBadge({ user }: { user: Pick<User, "isSuspended" | "isApproved" | "role"> }) {
  if (user.isSuspended) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider bg-rose-50 text-rose-700 border-rose-200/60 whitespace-nowrap">Ditangguhkan</span>;
  if (user.role === "organizer" && !user.isApproved) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider bg-amber-50 text-amber-700 border-amber-200/60 whitespace-nowrap">Menunggu</span>;
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200/60 whitespace-nowrap">Aktif</span>;
}

function SortIcon({ field, sortBy, sortDir }: { field: SortField; sortBy: SortField; sortDir: SortDir }) {
  if (sortBy !== field) return <ChevronsUpDown className="w-3 h-3 text-gray-300 inline ml-1" />;
  return sortDir === "asc"
    ? <ChevronUp className="w-3 h-3 text-blue-500 inline ml-1" />
    : <ChevronDown className="w-3 h-3 text-blue-500 inline ml-1" />;
}

function StatCard({ icon: Icon, label, value, sub, subColor, iconColor, iconBg, subIcon: SubIcon, loading }: {
  icon: React.ElementType; label: string; value: number;
  sub: string; subColor: string; iconColor: string; iconBg: string;
  subIcon?: React.ElementType | null; loading?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-1" style={{ backgroundColor: iconBg }}>
        <Icon className="w-5 h-5" style={{ color: iconColor }} />
      </div>
      <div className="text-sm font-bold text-gray-800">{label}</div>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-gray-300 my-1" />
      ) : (
        <div className="text-lg font-semibold text-gray-500">{value.toLocaleString("id-ID")}</div>
      )}
      <div className="text-[10px] font-medium flex items-center gap-1" style={{ color: subColor }}>
        {SubIcon && <SubIcon className="w-3 h-3" />}
        {sub}
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ userId, onClose }: { userId: number; onClose: () => void }) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/users?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setUser(d))
      .finally(() => setLoading(false));
  }, [userId]);

  const rows: { label: string; value: string | null }[] = user ? [
    { label: "Email", value: user.email },
    { label: "Nomor Telepon", value: user.nomorTelepon },
    { label: "Institusi", value: user.institution },
    { label: "Pekerjaan", value: user.pekerjaan },
    { label: "Jenis Kelamin", value: user.jenisKelamin },
    { label: "Tanggal Lahir", value: formatDate(user.tanggalLahir) },
    { label: "Role", value: user.role === "organizer" ? "Organizer" : "Visitor" },
    { label: "Tanggal Bergabung", value: formatDate(user.dibuatPada) },
    { label: "Terakhir Aktif", value: formatDateTime(user.lastActiveAt) },
  ] : [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-800">Detail Pengguna</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          </div>
        ) : !user ? (
          <div className="py-10 text-center text-xs text-red-400">Gagal memuat data</div>
        ) : (
          <div className="p-5">
            {/* Avatar + nama + status */}
            <div className="flex items-center gap-4 mb-5">
              <Avatar user={user} size="lg" />
              <div>
                <div className="font-bold text-gray-800 text-sm">{user.namaLengkap}</div>
                <div className="text-xs text-gray-400 mb-1.5">{user.email}</div>
                <StatusBadge user={user} />
              </div>
            </div>

            {/* Data rows */}
            <div className="space-y-3">
              {rows.map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-[11px] text-gray-400 font-medium shrink-0 w-36">{label}</span>
                  <span className="text-[11px] text-gray-700 text-right">{value || "-"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManajemenUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [tipe, setTipe] = useState("Semua Tipe");
  const [tipeInput, setTipeInput] = useState("Semua Tipe");
  const [sortBy, setSortBy] = useState<SortField>("dibuatPada");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [detailUserId, setDetailUserId] = useState<number | null>(null);

  // ── Fetch stats ─────────────────────────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin/users?type=stats");
      if (res.ok) setStats(await res.json());
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // ── Fetch users ─────────────────────────────────────────────────────────────

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        search,
        role: tipe === "Semua Tipe" ? "" : tipe,
        sortBy,
        sortDir,
      });
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error();
      const data: ApiResponse = await res.json();
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setError("Gagal memuat data pengguna. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, tipe, sortBy, sortDir]);

  useEffect(() => {
    fetchUsers();
    setSelectedRows([]);
  }, [fetchUsers]);

  // ── Sort ────────────────────────────────────────────────────────────────────

  const handleSort = (field: SortField) => {
    if (sortBy === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortDir("asc"); }
    setCurrentPage(1);
  };

  // ── Filter ──────────────────────────────────────────────────────────────────

  const applyFilter = () => {
    setSearch(searchInput);
    setTipe(tipeInput);
    setCurrentPage(1);
  };

  // ── Selection ───────────────────────────────────────────────────────────────

  const pageIds = users.map((u) => u.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedRows.includes(id));
  const toggleAll = () => allPageSelected
    ? setSelectedRows((p) => p.filter((id) => !pageIds.includes(id)))
    : setSelectedRows((p) => [...new Set([...p, ...pageIds])]);
  const toggleRow = (id: number) =>
    setSelectedRows((p) => p.includes(id) ? p.filter((r) => r !== id) : [...p, id]);

  // ── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/users?userId=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setDeleteModal(null);
      fetchUsers(); fetchStats();
    } catch { alert("Gagal menghapus pengguna."); }
    finally { setDeleteLoading(false); }
  };

  const handleBulkDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/users?ids=${selectedRows.join(",")}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSelectedRows([]);
      setBulkDeleteModal(false);
      fetchUsers(); fetchStats();
    } catch { alert("Gagal menghapus pengguna."); }
    finally { setDeleteLoading(false); }
  };

  // ── Pagination ───────────────────────────────────────────────────────────────

  const getPageButtons = (): (number | string)[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1, 2, 3];
    if (currentPage > 4) pages.push("...");
    if (currentPage > 3 && currentPage < totalPages - 1) pages.push(currentPage);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const showFrom = total === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1;
  const showTo = Math.min(currentPage * ROWS_PER_PAGE, total);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen overflow-y-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-5">Manajemen User</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard icon={Users} label="Total Users" value={stats?.total ?? 0}
          sub="+12% dari bulan lalu" subColor="#22c55e" iconColor="#3b82f6" iconBg="#eff6ff" subIcon={TrendingUp} loading={statsLoading} />
        <StatCard icon={UserCheck} label="Aktif 30 Hari" value={stats?.active ?? 0}
          sub="Pengguna aktif bulan ini" subColor="#6b7280" iconColor="#22c55e" iconBg="#f0fdf4" loading={statsLoading} />
        <StatCard icon={Clock} label="Menunggu Persetujuan" value={stats?.pending ?? 0}
          sub="Organizer belum disetujui" subColor="#f59e0b" iconColor="#f59e0b" iconBg="#fffbeb" loading={statsLoading} />
        <StatCard icon={UserX} label="User Suspended" value={stats?.suspended ?? 0}
          sub="Pelanggaran Ketentuan" subColor="#ef4444" iconColor="#ef4444" iconBg="#fef2f2" loading={statsLoading} />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800">Daftar Pengguna</h2>

          {/* Bulk delete bar */}
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
              <span className="text-xs font-semibold text-red-600">
                {selectedRows.length} user dipilih
              </span>
              <button
                onClick={() => setBulkDeleteModal(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Hapus Massal
              </button>
              <button
                onClick={() => setSelectedRows([])}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-end mb-5">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Cari Pengguna</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input type="text" placeholder="Nama atau email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilter()}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-700"
              />
            </div>
          </div>
          <div className="min-w-[140px]">
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Peran</label>
            <select value={tipeInput} onChange={(e) => setTipeInput(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:outline-none text-gray-700">
              <option>Semua Tipe</option>
              <option value="organizer">Organizer</option>
              <option value="visitor">Visitor</option>
            </select>
          </div>
          <button onClick={applyFilter}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap">
            Terapkan Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-3 w-10 text-center">
                  <input type="checkbox" checked={allPageSelected} onChange={toggleAll}
                    className="accent-blue-600 cursor-pointer w-3.5 h-3.5" />
                </th>
                {/* Sortable columns */}
                {(["namaLengkap", "role", "dibuatPada"] as SortField[]).map((field) => {
                  const labels: Record<SortField, string> = { namaLengkap: "Nama", role: "Peran", dibuatPada: "Tanggal Bergabung" };
                  return (
                    <th key={field}
                      onClick={() => handleSort(field)}
                      className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600 select-none whitespace-nowrap">
                      {labels[field]}
                      <SortIcon field={field} sortBy={sortBy} sortDir={sortDir} />
                    </th>
                  );
                })}
                {["Status", "Email", "Aksi"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-400" />Memuat data...
                </td></tr>
              ) : error ? (
                <tr><td colSpan={8} className="py-8 text-center text-red-400 text-xs">
                  {error} <button onClick={fetchUsers} className="ml-2 underline">Coba lagi</button>
                </td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={8} className="py-8 text-center text-gray-400">Tidak ada data ditemukan</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}
                    className={`hover:bg-slate-50/25 transition-colors ${selectedRows.includes(user.id) ? "bg-blue-50/30" : ""}`}>
                    <td className="px-6 py-3.5 text-center">
                      <input type="checkbox" checked={selectedRows.includes(user.id)} onChange={() => toggleRow(user.id)}
                        className="accent-blue-600 cursor-pointer w-3.5 h-3.5" />
                    </td>
                    <td className="px-6 py-3.5">
                      <button className="flex items-center gap-2.5 text-left hover:opacity-80 transition-opacity"
                        onClick={() => setDetailUserId(user.id)}>
                        <Avatar user={user} />
                        <div>
                          <div className="font-semibold text-gray-800 text-[13px] hover:text-blue-600 transition-colors">{user.namaLengkap}</div>
                          <div className="text-[10px] text-gray-400">{user.email}</div>
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider whitespace-nowrap ${user.role === "organizer" ? "bg-indigo-50 text-indigo-700 border-indigo-200/60" : "bg-slate-50 text-slate-700 border-slate-200/60"}`}>
                        {user.role === "organizer" ? "Penyelenggara" : "Pengunjung"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 whitespace-nowrap text-xs">{formatDate(user.dibuatPada)}</td>
                    <td className="px-6 py-3.5"><StatusBadge user={user} /></td>
                    <td className="px-6 py-3.5 text-gray-500 text-xs">{user.email}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex gap-1.5">
                        <button onClick={() => setDetailUserId(user.id)}
                          className="w-6 h-6 rounded-md bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-500 transition-colors" title="Lihat Detail">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteModal(user.id)}
                          className="w-6 h-6 rounded-md bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
          <span className="text-xs text-gray-400">
            Menampilkan <b className="text-gray-600">{showFrom}</b> – <b className="text-gray-600">{showTo}</b> dari{" "}
            <b className="text-gray-600">{total.toLocaleString("id-ID")}</b> pengguna
          </span>
          <div className="flex gap-1 items-center">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
            </button>
            {getPageButtons().map((p, i) =>
              p === "..." ? (
                <span key={`d${i}`} className="text-gray-400 px-1 text-xs">...</span>
              ) : (
                <button key={p} onClick={() => setCurrentPage(p as number)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${currentPage === p ? "bg-blue-600 text-white" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
                  {p}
                </button>
              )
            )}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailUserId !== null && (
        <DetailModal userId={detailUserId} onClose={() => setDetailUserId(null)} />
      )}

      {/* Single Delete Modal */}
      {deleteModal !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-80">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Hapus Pengguna</h3>
            <p className="text-xs text-gray-500 mb-5">Apakah kamu yakin ingin menghapus pengguna ini? Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteModal(null)} disabled={deleteLoading}
                className="px-4 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                Batal
              </button>
              <button onClick={() => handleDelete(deleteModal)} disabled={deleteLoading}
                className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50">
                {deleteLoading && <Loader2 className="w-3 h-3 animate-spin" />}Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {bulkDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-80">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Hapus Massal</h3>
            <p className="text-xs text-gray-500 mb-5">
              Kamu akan menghapus <b>{selectedRows.length} pengguna</b> sekaligus. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setBulkDeleteModal(false)} disabled={deleteLoading}
                className="px-4 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                Batal
              </button>
              <button onClick={handleBulkDelete} disabled={deleteLoading}
                className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50">
                {deleteLoading && <Loader2 className="w-3 h-3 animate-spin" />}Hapus {selectedRows.length} User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}