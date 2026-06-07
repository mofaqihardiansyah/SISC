import React from 'react';
import { db } from "@/db";
// 1. Ambil tabel sesuai yang diexport dari schema kelompokmu
import { provinsi, kota } from "@/db/schema"; 
import { eq } from "drizzle-orm";
import { Plus, Edit2, MapPin, Navigation } from 'lucide-react';

export default async function MasterLocationsPage() {
  // 2. Query mengambil data asli dari database
  const dataProvinsi = await db.select().from(provinsi) || [];

  // 3. Query Left Join dengan penyesuaian nama kolom database kamu (.nama)
  const dataKota = await db
    .select({
      id: kota.id,
      namaKota: kota.nama,       // Menyesuaikan kolom 'nama' di tabel kota
      namaProvinsi: provinsi.nama, // Menyesuaikan kolom 'nama' di tabel provinsi
    })
    .from(kota)
    .leftJoin(provinsi, eq(kota.provinsiId, provinsi.id)) || [];

  return (
    <div className="space-y-6">
      {/* Header Utama */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Master Wilayah</h1>
          <p className="text-xs text-slate-500 mt-1">Kelola cakupan wilayah operasional provinsi dan kota pelaksanaan event POLIVENTS.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ================= DATA PROVINSI ================= */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm h-fit overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 text-xs">
              <MapPin size={16} className="text-blue-600" />
              <h2>Provinsi ({dataProvinsi.length})</h2>
            </div>
            <button className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all">
              <Plus size={12} /> Tambah
            </button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50">
                <th className="px-4 py-2.5">Nama Provinsi</th>
                <th className="px-4 py-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {dataProvinsi.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Diubah dari p.namaProvinsi menjadi p.nama sesuai isi DB */}
                  <td className="px-4 py-3 font-medium text-slate-800">{p.nama}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      {/* Tombol Edit - Bingkai Kotak Tumpul Biru */}
                      <button className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-colors" title="Edit">
                        <Edit2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= DATA KOTA ================= */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 text-xs">
              <Navigation size={16} className="text-violet-600" />
              <h2>Kota / Kabupaten ({dataKota.length})</h2>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-semibold hover:bg-violet-700 transition-all">
              <Plus size={14} /> Tambah Kota
            </button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50">
                <th className="px-6 py-3">Nama Kota</th>
                <th className="px-6 py-3">Provinsi</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {dataKota.map((k) => (
                <tr key={k.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-slate-800">{k.namaKota}</td>
                  <td className="px-6 py-3.5">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px]">
                      {k.namaProvinsi || "Provinsi Tidak Diketahui"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Tombol Edit - Bingkai Kotak Tumpul Biru */}
                      <button className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-colors" title="Edit">
                        <Edit2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}