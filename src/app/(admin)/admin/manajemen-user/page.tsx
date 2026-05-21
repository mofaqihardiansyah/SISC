"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: number;
  namaLengkap: string;
  email: string;
  role: "admin" | "organizer" | "visitor";
  dibuatPada: string;
  avatarUrl: string | null;
}

interface ApiResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899",
  "#14b8a6", "#ef4444", "#22c55e", "#f97316",
];

function getAvatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const ROWS_PER_PAGE = 5;

const stats = [
  { icon: Users, label: "Total Users", value: "1,240", sub: "+12% dari bulan lalu", subColor: "#22c55e", iconColor: "#3b82f6", iconBg: "#eff6ff", subIcon: TrendingUp },
  { icon: UserCheck, label: "Aktif Sekarang", value: "856", sub: "Real-time sessions", subColor: "#6b7280", iconColor: "#22c55e", iconBg: "#f0fdf4", subIcon: null },
  { icon: Clock, label: "Menunggu Persetujuan", value: "14", sub: "Perlu diperhatikan", subColor: "#f59e0b", iconColor: "#f59e0b", iconBg: "#fffbeb", subIcon: null },
  { icon: UserX, label: "User Suspended", value: "3", sub: "Pelanggaran Ketentuan", subColor: "#ef4444", iconColor: "#ef4444", iconBg: "#fef2f2", subIcon: null },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ManajemenUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [tipe, setTipe] = useState("Semua Tipe");
  const [tipeInput, setTipeInput] = useState("Semua Tipe");
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Fetch data ──────────────────────────────────────────────────────────────

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        search,
        role: tipe === "Semua Tipe" ? "" : tipe,
      });
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("Gagal memuat data");
      const data: ApiResponse = await res.json();
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError("Gagal memuat data pengguna. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, tipe]);

  useEffect(() => {
    fetchUsers();
    setSelectedRows([]);
  }, [fetchUsers]);

  // ── Filter ──────────────────────────────────────────────────────────────────

  const applyFilter = () => {
    setSearch(searchInput);
    setTipe(tipeInput);
    setCurrentPage(1);
  };

  // ── Selection ───────────────────────────────────────────────────────────────

  const pageIds = users.map((u) => u.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedRows.includes(id));

  const toggleAll = () => {
    if (allPageSelected) {
      setSelectedRows((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // ── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/users?userId=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setDeleteModal(null);
      fetchUsers();
    } catch {
      alert("Gagal menghapus pengguna. Coba lagi.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Pagination buttons ───────────────────────────────────────────────────────

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
      {/* Page Title */}
      <h1 className="text-xl font-bold text-gray-800 mb-5">Manajemen User</h1>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <h2 className="text-base font-bold text-gray-800 mb-4">Daftar Pengguna</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-end mb-5">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Cari Pengguna
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Nama atau email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilter()}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-700"
              />
            </div>
          </div>

          <div className="min-w-[140px]">
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Peran
            </label>
            <select
              value={tipeInput}
              onChange={(e) => setTipeInput(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:outline-none text-gray-700"
            >
              <option>Semua Tipe</option>
              <option value="organizer">Organizer</option>
              <option value="visitor">Visitor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            onClick={applyFilter}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            Terapkan Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-2.5 px-3 w-10">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleAll}
                    className="accent-blue-600 cursor-pointer w-3.5 h-3.5"
                  />
                </th>
                {["Nama", "Peran", "Email", "Tanggal Bergabung", "Aksi"].map((h) => (
                  <th
                    key={h}
                    className="py-2.5 px-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-400" />
                    Memuat data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-red-400 text-xs">
                    {error}
                    <button onClick={fetchUsers} className="ml-2 underline">Coba lagi</button>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-b border-gray-50 transition-colors ${
                      selectedRows.includes(user.id) ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(user.id)}
                        onChange={() => toggleRow(user.id)}
                        className="accent-blue-600 cursor-pointer w-3.5 h-3.5"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.namaLengkap}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                            style={{ backgroundColor: getAvatarColor(user.id) }}
                          >
                            {getInitials(user.namaLengkap)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-800 text-xs">{user.namaLengkap}</div>
                          <div className="text-[10px] text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          user.role === "organizer"
                            ? "bg-blue-50 text-blue-600"
                            : user.role === "admin"
                            ? "bg-purple-50 text-purple-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500">{user.email}</td>
                    <td className="py-2.5 px-3 text-gray-500 whitespace-nowrap">
                      {formatDate(user.dibuatPada)}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex gap-1.5">
                        <button className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(user.id)}
                          className="w-6 h-6 rounded-md bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors"
                        >
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
            Menampilkan <b className="text-gray-600">{showFrom}</b> –{" "}
            <b className="text-gray-600">{showTo}</b> dari{" "}
            <b className="text-gray-600">{total.toLocaleString("id-ID")}</b> pengguna
          </span>
          <div className="flex gap-1 items-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
            </button>
            {getPageButtons().map((p, i) =>
              p === "..." ? (
                <span key={`dots-${i}`} className="text-gray-400 px-1 text-xs">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p as number)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === p
                      ? "bg-blue-600 text-white border-none"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5"
              style={{ backgroundColor: s.iconBg }}
            >
              <s.icon className="w-5 h-5" style={{ color: s.iconColor }} />
            </div>
            <div className="text-[10px] text-gray-400 font-medium">{s.label}</div>
            <div className="text-2xl font-extrabold text-gray-900 my-1">{s.value}</div>
            <div
              className="text-[10px] font-medium flex items-center gap-1"
              style={{ color: s.subColor }}
            >
              {s.subIcon && <s.subIcon className="w-3 h-3" />}
              {s.label === "User Suspended" && <span>⊘</span>}
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-80">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Hapus Pengguna</h3>
            <p className="text-xs text-gray-500 mb-5">
              Apakah kamu yakin ingin menghapus pengguna ini? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={deleteLoading}
                className="px-4 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
                disabled={deleteLoading}
                className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {deleteLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}