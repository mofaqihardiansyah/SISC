import React from 'react';
import { db } from "@/db";
// 1. IMPORT TABEL: Sesuaikan "kategori" dan "tag" dengan nama export di schema.ts kelompokmu
import { kategori, tag } from "@/db/schema"; 
import { Plus, Edit2, Trash2, Layers, Tag as TagIcon } from 'lucide-react';

export default async function MasterCategoriesPage() {
  // 2. QUERY DATA: Mengambil data riil dari database secara paralel
  const [dataKategori, dataTag] = await Promise.all([
    db.select().from(kategori),
    db.select().from(tag)
  ]);

  return (
    <div className="space-y-6">
      {/* Header Utama */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Master Referensi</h1>
          <p className="text-xs text-slate-500 mt-1">Kelola data kategori dan tag klasifikasi event POLIVENTS.</p>
        </div>
      </div>

      {/* Grid Sistem 2 Kolom */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* ================= DATA TABEL KATEGORI ================= */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
            <div className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
              <Layers size={16} className="text-indigo-600" />
              {/* Menampilkan jumlah data dinamis dari database */}
              <h2>Daftar Kategori ({dataKategori.length})</h2>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-all">
              <Plus size={14} /> Tambah Kategori
            </button>
          </div>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50/80">
                <th className="px-6 py-3">Nama Kategori</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {dataKategori.map((kat) => (
                <tr key={kat.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-slate-800">{kat.nama}</td>
                  <td className="px-6 py-3.5">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono text-[11px]">
                      {kat.slug}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Tombol Edit - Bingkai Kotak Tumpul Biru */}
                      <button className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-colors" title="Edit">
                        <Edit2 size={13} />
                      </button>
                      {/* Tombol Hapus - Bingkai Kotak Tumpul Merah */}
                      <button className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors" title="Hapus">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {dataKategori.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-slate-400 italic">Belum ada data kategori.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= DATA TABEL TAG ================= */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
            <div className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
              <TagIcon size={16} className="text-emerald-600" />
              <h2>Daftar Tag ({dataTag.length})</h2>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-all">
              <Plus size={14} /> Tambah Tag
            </button>
          </div>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50/80">
                <th className="px-6 py-3">Nama Tag</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {dataTag.map((tg) => (
                <tr key={tg.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-slate-800">{tg.nama}</td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Tombol Edit - Bingkai Kotak Tumpul Biru */}
                      <button className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-colors" title="Edit">
                        <Edit2 size={13} />
                      </button>
                      {/* Tombol Hapus - Bingkai Kotak Tumpul Merah */}
                      <button className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors" title="Hapus">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {dataTag.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-8 text-slate-400 italic">Belum ada data tag.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}