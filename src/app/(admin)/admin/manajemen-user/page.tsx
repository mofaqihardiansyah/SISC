"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, Trash2,
  Users, UserCheck, Clock, TrendingUp, Loader2,
  ChevronUp, ChevronDown, ChevronsUpDown, X, Eye,
} from "lucide-react";
import Image from "next/image";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { ConfirmationModal } from "@/components/feedback/ConfirmationModal";
import { PAGINATION } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Select } from '@/components/ui/select'
export const dynamic = 'force-dynamic';


// Types 
type SortField = "namaLengkap" | "dibuatPada" | "role";
type SortDir = "asc" | "desc";

interface User {
  id: number;
  namaLengkap: string;
  email: string;
  role: "organizer" | "visitor";
  diblokir: boolean;
  disetujui: boolean;
  dibuatPada: string;
  urlAvatar: string | null;
}

interface UserDetail extends User {
  nomorTelepon: string | null;
  institusi: string | null;
  pekerjaan: string | null;
  jenisKelamin: string | null;
  tanggalLahir: string | null;
  terakhirAktifPada: string | null;
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

//  Helpers 

const AVATAR_COLORS = ["#f59e0b","#3b82f6","#8b5cf6","#ec4899","#14b8a6","#ef4444","#22c55e","#f97316"];
const getAvatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];
const getInitials = (name: string) => name?.split(" ").slice(0,2).map((n)=>n[0]).join("").toUpperCase() ?? "?";
const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-";
const formatDateTime = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

const ROWS_PER_PAGE = PAGINATION.ROWS_PER_PAGE;

//  Sub-components 

function Avatar({ user, size = "md" }: { user: { id: number; namaLengkap: string; urlAvatar: string | null }; size?: "md" | "lg" }) {
  const cls = size === "lg" ? "w-16 h-16 text-base" : "w-8 h-8 text-xxs";
  const imgSize = size === "lg" ? 64 : 32;
  return user.urlAvatar ? (
    <Image src={user.urlAvatar} alt={user.namaLengkap} width={imgSize} height={imgSize} className={`${cls} rounded-full object-cover shrink-0`} />
  ) : (
    <div className={`${cls} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      style={{ backgroundColor: getAvatarColor(user.id) }}>
      {getInitials(user.namaLengkap)}
    </div>
  );
}

function StatusBadge({ user }: { user: Pick<User, "diblokir" | "disetujui" | "role"> }) {
  if (user.diblokir) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold border tracking-wider bg-rose-50 text-rose-700 border-rose-200/60 whitespace-nowrap">Ditangguhkan</span>;
  if (user.role === "organizer" && !user.disetujui) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold border tracking-wider bg-amber-50 text-amber-700 border-amber-200/60 whitespace-nowrap">Menunggu</span>;
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold border tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200/60 whitespace-nowrap">Aktif</span>;
}

function SortIcon({ field, sortBy, sortDir }: { field: SortField; sortBy: SortField; sortDir: SortDir }) {
  if (sortBy !== field) return <ChevronsUpDown className="w-3 h-3 text-slate-300 inline ml-1" />;
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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-1">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-1" style={{ backgroundColor: iconBg }}>
        <Icon className="w-5 h-5" style={{ color: iconColor }} />
      </div>
      <div className="text-sm font-bold text-slate-800">{label}</div>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-slate-300 my-1" />
      ) : (
        <div className="text-lg font-semibold text-slate-500">{value.toLocaleString("id-ID")}</div>
      )}
      <div className="text-xxs font-medium flex items-center gap-1" style={{ color: subColor }}>
        {SubIcon && <SubIcon className="w-3 h-3" />}
        {sub}
      </div>
    </div>
  );
}

//  Detail Modal 

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
    { label: "Institusi", value: user.institusi },
    { label: "Pekerjaan", value: user.pekerjaan },
    { label: "Jenis Kelamin", value: user.jenisKelamin },
    { label: "Tanggal Lahir", value: formatDate(user.tanggalLahir) },
    { label: "Role", value: user.role === "organizer" ? "Organizer" : "Visitor" },
    { label: "Tanggal Bergabung", value: formatDate(user.dibuatPada) },
    { label: "Terakhir Aktif", value: formatDateTime(user.terakhirAktifPada) },
  ] : [];

  return (
    <Modal open={true} onClose={onClose} title="Detail Pengguna">
      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
        </div>
      ) : !user ? (
        <div className="py-10 text-center text-xs text-red-400">Gagal memuat data</div>
      ) : (
        <div>
          <div className="flex items-center gap-4 mb-5">
            <Avatar user={user} size="lg" />
            <div>
              <div className="font-bold text-slate-800 text-sm">{user.namaLengkap}</div>
              <div className="text-xs text-slate-400 mb-1.5">{user.email}</div>
              <StatusBadge user={user} />
            </div>
          </div>

          <div className="space-y-3">
            {rows.map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4">
                <span className="text-micro text-slate-400 font-medium shrink-0 w-36">{label}</span>
                <span className="text-micro text-slate-700 text-right">{value || "-"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

//  Page 

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

  //  Fetch stats 

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

  //  Fetch users 

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

  //  Sort 

  const handleSort = (field: SortField) => {
    if (sortBy === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortDir("asc"); }
    setCurrentPage(1);
  };

  //  Filter 

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== searchInput || tipe !== tipeInput) {
        setSearch(searchInput);
        setTipe(tipeInput);
        setCurrentPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, tipeInput, search, tipe]);


  //  Selection 

  const pageIds = users.map((u) => u.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedRows.includes(id));
  const toggleAll = () => allPageSelected
    ? setSelectedRows((p) => p.filter((id) => !pageIds.includes(id)))
    : setSelectedRows((p) => [...new Set([...p, ...pageIds])]);
  const toggleRow = (id: number) =>
    setSelectedRows((p) => p.includes(id) ? p.filter((r) => r !== id) : [...p, id]);

  //  Delete 

  const handleDelete = async (id: number) => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/users?userId=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setDeleteModal(null);
      fetchUsers(); fetchStats();
      toast.success("Pengguna berhasil dihapus.");
    } catch { toast.error("Gagal menghapus pengguna."); }
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
      toast.success("Pengguna berhasil dihapus secara massal.");
    } catch { toast.error("Gagal menghapus pengguna."); }
    finally { setDeleteLoading(false); }
  };

  // Pagination 

  // Render 

  return (
    <div className="flex-1 p-6 bg-slate-50 min-h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manajemen User</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard icon={Users} label="Total Users" value={stats?.total ?? 0}
          sub={stats ? `Total: ${stats.total}` : "-"} subColor="#22c55e" iconColor="#3b82f6" iconBg="#eff6ff" subIcon={TrendingUp} loading={statsLoading} />
        <StatCard icon={UserCheck} label="Aktif 30 Hari" value={stats?.active ?? 0}
          sub="Pengguna aktif bulan ini" subColor="#6b7280" iconColor="#22c55e" iconBg="#f0fdf4" loading={statsLoading} />
        <StatCard icon={Clock} label="Menunggu Persetujuan" value={stats?.pending ?? 0}
          sub="Organizer belum disetujui" subColor="#f59e0b" iconColor="#f59e0b" iconBg="#fffbeb" loading={statsLoading} />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">Daftar Pengguna</h2>

          {/* Bulk delete bar */}
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
              <span className="text-xs font-semibold text-red-600">
                {selectedRows.length} user dipilih
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkDeleteModal(true)}
              >
                <Trash2 className="w-3 h-3" />
                Hapus Massal
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setSelectedRows([])}
                aria-label="Tutup"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-end mb-5">
          <div className="flex-1 min-w-44">
            <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider mb-1">Cari Pengguna</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <Input type="text" placeholder="Nama atau email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-100 text-slate-700"
              />
            </div>
          </div>
          <div className="min-w-36">
            <label className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider mb-1">Peran</label>
            <Select value={tipeInput} onChange={(e) => setTipeInput(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none text-slate-700">
              <option>Semua Tipe</option>
              <option value="organizer">Organizer</option>
              <option value="visitor">Visitor</option>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-3 w-10 text-center">
                  <input type="checkbox" checked={allPageSelected} onChange={toggleAll}
                    className="accent-slate-900 cursor-pointer w-3.5 h-3.5" />
                </th>
                {/* Sortable columns */}
                {(["namaLengkap", "role", "dibuatPada"] as SortField[]).map((field) => {
                  const labels: Record<SortField, string> = { namaLengkap: "Nama", role: "Peran", dibuatPada: "Tanggal Bergabung" };
                  return (
                    <th key={field}
                      onClick={() => handleSort(field)}
                      className="px-6 py-3 text-left text-xxs font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-600 select-none whitespace-nowrap">
                      {labels[field]}
                      <SortIcon field={field} sortBy={sortBy} sortDir={sortDir} />
                    </th>
                  );
                })}
                {["Status", "Email", "Aksi"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xxs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-400" />Memuat data...
                </td></tr>
              ) : error ? (
                <tr><td colSpan={8} className="py-8 text-center text-red-400 text-xs">
                  {error} <Button variant="link" onClick={fetchUsers} size="xs">Coba lagi</Button>
                </td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={8} className="py-8 text-center text-slate-400">Tidak ada data ditemukan</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}
                    className={`hover:bg-slate-50/25 transition-colors ${selectedRows.includes(user.id) ? "bg-blue-50/30" : ""}`}>
                    <td className="px-6 py-3.5 text-center">
                      <input type="checkbox" checked={selectedRows.includes(user.id)} onChange={() => toggleRow(user.id)}
                        className="accent-slate-900 cursor-pointer w-3.5 h-3.5" />
                    </td>
                    <td className="px-6 py-3.5">
                      <Button variant="ghost" className="flex items-center gap-2.5 text-left hover:opacity-80"
                        onClick={() => setDetailUserId(user.id)}>
                        <Avatar user={user} />
                        <div>
                          <div className="font-semibold text-slate-800 text-sm2 hover:text-slate-700 transition-colors">{user.namaLengkap}</div>
                          <div className="text-xxs text-slate-400">{user.email}</div>
                        </div>
                      </Button>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold border tracking-wider whitespace-nowrap ${user.role === "organizer" ? "bg-indigo-50 text-indigo-700 border-indigo-200/60" : "bg-slate-50 text-slate-700 border-slate-200/60"}`}>
                        {user.role === "organizer" ? "Penyelenggara" : "Pengunjung"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap text-xs">{formatDate(user.dibuatPada)}</td>
                    <td className="px-6 py-3.5"><StatusBadge user={user} /></td>
                    <td className="px-6 py-3.5 text-slate-500 text-xs">{user.email}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="icon-xs" onClick={() => setDetailUserId(user.id)} aria-label="Lihat Detail">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="destructive" size="icon-xs" onClick={() => setDeleteModal(user.id)} aria-label="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={ROWS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemLabel="pengguna"
        />
      </div>

      {/* Detail Modal */}
      {detailUserId !== null && (
        <DetailModal userId={detailUserId} onClose={() => setDetailUserId(null)} />
      )}

      {/* Single Delete Modal */}
      <ConfirmationModal
        open={deleteModal !== null}
        title="Hapus Pengguna"
        message="Apakah kamu yakin ingin menghapus pengguna ini? Tindakan ini tidak bisa dibatalkan."
        confirmLabel="Hapus"
        variant="danger"
        loading={deleteLoading}
        onConfirm={() => handleDelete(deleteModal!)}
        onCancel={() => setDeleteModal(null)}
      />

      {/* Bulk Delete Modal */}
      <ConfirmationModal
        open={bulkDeleteModal}
        title="Hapus Massal"
        message={`Kamu akan menghapus ${selectedRows.length} pengguna sekaligus. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel={`Hapus ${selectedRows.length} User`}
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteModal(false)}
      />
    </div>
  );
}
