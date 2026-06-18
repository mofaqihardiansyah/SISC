"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Navigation, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from "@/components/ui/modal";
import { ConfirmationModal } from "@/components/feedback/ConfirmationModal";
import { 
  addProvinsiAction, editProvinsiAction, deleteProvinsiAction,
  addKotaAction, editKotaAction, deleteKotaAction 
} from '@/actions/categories-locations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ProvinsiItem {
  id: number;
  nama: string | null;
}

interface KotaItem {
  id: number;
  namaKota: string | null;
  provinsiId: number | null;
  namaProvinsi: string | null;
}

interface LocationClientProps {
  initialProvinsi: ProvinsiItem[];
  initialKota: KotaItem[];
}

export default function LocationClient({ initialProvinsi, initialKota }: LocationClientProps) {
  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Modal states
  const [modalType, setModalType] = useState<'addProvinsi' | 'editProvinsi' | 'deleteProvinsi' | 'addKota' | 'editKota' | 'deleteKota' | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selected item / form inputs
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [inputNama, setInputNama] = useState('');
  const [selectedProvinsiId, setSelectedProvinsiId] = useState<number | null>(null);

  // Search & Pagination for Provinsi
  const [provSearch, setProvSearch] = useState('');
  const [provPage, setProvPage] = useState(1);
  const PROV_PER_PAGE = 10;

  const filteredProvinsi = initialProvinsi.filter(p => 
    p.nama?.toLowerCase().includes(provSearch.toLowerCase())
  );
  const totalProvPages = Math.ceil(filteredProvinsi.length / PROV_PER_PAGE) || 1;
  const startProvIndex = (provPage - 1) * PROV_PER_PAGE;
  const paginatedProvinsi = filteredProvinsi.slice(startProvIndex, startProvIndex + PROV_PER_PAGE);

  // Search & Pagination for Kota
  const [kotaSearch, setKotaSearch] = useState('');
  const [kotaPage, setKotaPage] = useState(1);
  const KOTA_PER_PAGE = 10;

  const filteredKota = initialKota.filter(k => 
    k.namaKota?.toLowerCase().includes(kotaSearch.toLowerCase()) ||
    k.namaProvinsi?.toLowerCase().includes(kotaSearch.toLowerCase())
  );
  const totalKotaPages = Math.ceil(filteredKota.length / KOTA_PER_PAGE) || 1;
  const startKotaIndex = (kotaPage - 1) * KOTA_PER_PAGE;
  const paginatedKota = filteredKota.slice(startKotaIndex, startKotaIndex + KOTA_PER_PAGE);

  const handleOpenModal = (
    type: typeof modalType, 
    id: number | null = null, 
    currentName: string = '', 
    provId: number | null = null
  ) => {
    setModalType(type);
    setSelectedId(id);
    setInputNama(currentName);
    setSelectedProvinsiId(provId || (initialProvinsi[0]?.id || null));
    setErrorMsg(null);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedId(null);
    setInputNama('');
    setSelectedProvinsiId(null);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNama.trim() && modalType !== 'deleteProvinsi' && modalType !== 'deleteKota') {
      setErrorMsg("Nama tidak boleh kosong");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    let res: { success: boolean; error?: string } = { success: false, error: "Aksi tidak dikenal" };

    try {
      if (modalType === 'addProvinsi') {
        res = await addProvinsiAction(inputNama);
      } else if (modalType === 'editProvinsi' && selectedId !== null) {
        res = await editProvinsiAction(selectedId, inputNama);
      } else if (modalType === 'deleteProvinsi' && selectedId !== null) {
        res = await deleteProvinsiAction(selectedId);
      } else if (modalType === 'addKota' && selectedProvinsiId !== null) {
        res = await addKotaAction(selectedProvinsiId, inputNama);
      } else if (modalType === 'editKota' && selectedId !== null && selectedProvinsiId !== null) {
        res = await editKotaAction(selectedId, selectedProvinsiId, inputNama);
      } else if (modalType === 'deleteKota' && selectedId !== null) {
        res = await deleteKotaAction(selectedId);
      }

      if (res.success) {
        handleCloseModal();
        const msgs: Record<string, string> = {
          addProvinsi: "Provinsi berhasil ditambahkan",
          editProvinsi: "Provinsi berhasil diperbarui",
          deleteProvinsi: "Provinsi berhasil dihapus",
          addKota: "Kota berhasil ditambahkan",
          editKota: "Kota berhasil diperbarui",
          deleteKota: "Kota berhasil dihapus",
        };
        if (modalType) toast.success(msgs[modalType] || "Berhasil");
      } else {
        setErrorMsg(res.error || "Gagal memproses aksi");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        
        {/* ================= DATA PROVINSI ================= */}
        <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/40 shrink-0">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 text-xs">
              <MapPin size={16} className="text-slate-900" />
              <h2>Provinsi ({filteredProvinsi.length})</h2>
            </div>
            <Button 
              onClick={() => handleOpenModal('addProvinsi')}
              variant="default"
              size="sm"
            >
              <Plus size={12} /> Tambah
            </Button>
          </div>

          {/* Search Bar for Provinsi */}
          <div className="p-3 bg-slate-50/30 border-b border-slate-100 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <Input 
                type="text" 
                placeholder="Cari provinsi..."
                value={provSearch}
                onChange={(e) => {
                  setProvSearch(e.target.value);
                  setProvPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-100 text-slate-700 font-medium"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50">
                  <th className="px-4 py-2.5">Nama Provinsi</th>
                  <th className="px-4 py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {paginatedProvinsi.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{p.nama}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button 
                          onClick={() => handleOpenModal('editProvinsi', p.id, p.nama || '')}
                          variant="ghost"
                          size="icon"
                          aria-label="Edit"
                        >
                          <Edit2 size={12} />
                        </Button>
                        <Button 
                          onClick={() => handleOpenModal('deleteProvinsi', p.id, p.nama || '')}
                          variant="destructive"
                          size="icon"
                          aria-label="Hapus"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedProvinsi.length === 0 && (
                  <tr>
                    <td colSpan={2} className="text-center py-6 text-slate-400 italic">Belum ada data provinsi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Provinsi */}
          <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-slate-50/20 mt-auto shrink-0 h-14">
            <span className="text-micro text-slate-400 font-medium">
              {filteredProvinsi.length > 0 ? (
                <>
                  Menampilkan <strong className="text-slate-600">{startProvIndex + 1}</strong> â€“ <strong className="text-slate-600">{Math.min(startProvIndex + PROV_PER_PAGE, filteredProvinsi.length)}</strong> dari <strong className="text-slate-600">{filteredProvinsi.length}</strong> provinsi
                </>
              ) : (
                "Tidak ada data"
              )}
            </span>
            {totalProvPages > 1 && (
              <div className="flex gap-1 items-center">
                <Button 
                  type="button"
                  onClick={() => setProvPage(p => Math.max(1, p - 1))} 
                  disabled={mounted ? (provPage === 1) : false}
                  variant="ghost"
                  size="icon"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                
                {Array.from({ length: totalProvPages }, (_, i) => i + 1).map((p) => {
                  if (totalProvPages > 5) {
                    if (p !== 1 && p !== totalProvPages && Math.abs(p - provPage) > 1) {
                      if (p === 2 && provPage > 3) return <span key={p} className="text-slate-400 px-0.5 text-xxs">...</span>;
                      if (p === totalProvPages - 1 && provPage < totalProvPages - 2) return <span key={p} className="text-slate-400 px-0.5 text-xxs">...</span>;
                      return null;
                    }
                  }
                  
                  return (
                    <Button 
                      type="button"
                      key={p} 
                      onClick={() => setProvPage(p)}
                      variant={provPage === p ? "default" : "outline"}
                      size="icon-xs"
                      className={provPage === p ? "" : "border-slate-200"}
                    >
                      {p}
                    </Button>
                  );
                })}
                
                <Button 
                  type="button"
                  onClick={() => setProvPage(p => Math.min(totalProvPages, p + 1))} 
                  disabled={mounted ? (provPage === totalProvPages) : false}
                  variant="ghost"
                  size="icon"
                  aria-label="Halaman selanjutnya"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ================= DATA KOTA ================= */}
        <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/40 shrink-0">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 text-xs">
              <Navigation size={16} className="text-slate-900" />
              <h2>Kota / Kabupaten ({filteredKota.length})</h2>
            </div>
            <Button 
              onClick={() => handleOpenModal('addKota')}
              variant="default"
              size="sm"
            >
              <Plus size={14} /> Tambah Kota
            </Button>
          </div>

          {/* Search Bar for Kota */}
          <div className="p-3 bg-slate-50/30 border-b border-slate-100 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <Input 
                type="text" 
                placeholder="Cari kota atau provinsi..."
                value={kotaSearch}
                onChange={(e) => {
                  setKotaSearch(e.target.value);
                  setKotaPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-100 text-slate-700 font-medium"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50">
                  <th className="px-6 py-3">Nama Kota</th>
                  <th className="px-6 py-3">Provinsi</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {paginatedKota.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-800">{k.namaKota}</td>
                    <td className="px-6 py-3.5">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-micro">
                        {k.namaProvinsi || "Provinsi Tidak Diketahui"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => handleOpenModal('editKota', k.id, k.namaKota || '', k.provinsiId)}
                          variant="ghost"
                          size="icon"
                          aria-label="Edit"
                        >
                          <Edit2 size={13} />
                        </Button>
                        <Button 
                          onClick={() => handleOpenModal('deleteKota', k.id, k.namaKota || '')}
                          variant="destructive"
                          size="icon"
                          aria-label="Hapus"
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedKota.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-slate-400 italic">Belum ada data kota/kabupaten.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Kota */}
          <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-slate-50/20 mt-auto shrink-0 h-14">
            <span className="text-micro text-slate-400 font-medium">
              {filteredKota.length > 0 ? (
                <>
                  Menampilkan <strong className="text-slate-600">{startKotaIndex + 1}</strong> â€“ <strong className="text-slate-600">{Math.min(startKotaIndex + KOTA_PER_PAGE, filteredKota.length)}</strong> dari <strong className="text-slate-600">{filteredKota.length}</strong> kota
                </>
              ) : (
                "Tidak ada data"
              )}
            </span>
            {totalKotaPages > 1 && (
              <div className="flex gap-1 items-center">
                <Button 
                  type="button"
                  onClick={() => setKotaPage(p => Math.max(1, p - 1))} 
                  disabled={mounted ? (kotaPage === 1) : false}
                  variant="ghost"
                  size="icon"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                
                {Array.from({ length: totalKotaPages }, (_, i) => i + 1).map((p) => {
                  if (totalKotaPages > 5) {
                    if (p !== 1 && p !== totalKotaPages && Math.abs(p - kotaPage) > 1) {
                      if (p === 2 && kotaPage > 3) return <span key={p} className="text-slate-400 px-0.5 text-xxs">...</span>;
                      if (p === totalKotaPages - 1 && kotaPage < totalKotaPages - 2) return <span key={p} className="text-slate-400 px-0.5 text-xxs">...</span>;
                      return null;
                    }
                  }
                  
                  return (
                    <Button 
                      type="button"
                      key={p} 
                      onClick={() => setKotaPage(p)}
                      variant={kotaPage === p ? "default" : "outline"}
                      size="icon-xs"
                      className={kotaPage === p ? "" : "border-slate-200"}
                    >
                      {p}
                    </Button>
                  );
                })}
                
                <Button 
                  type="button"
                  onClick={() => setKotaPage(p => Math.min(totalKotaPages, p + 1))} 
                  disabled={mounted ? (kotaPage === totalKotaPages) : false}
                  variant="ghost"
                  size="icon"
                  aria-label="Halaman selanjutnya"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ================= FORM MODALS (Add/Edit) ================= */}
      {(modalType !== null && modalType !== 'deleteProvinsi' && modalType !== 'deleteKota') && (
        <Modal open={true} onClose={handleCloseModal} title={
          modalType === 'addProvinsi' ? 'Tambah Provinsi Baru' :
          modalType === 'editProvinsi' ? 'Ubah Provinsi' :
          modalType === 'addKota' ? 'Tambah Kota Baru' : 'Ubah Kota'
        }>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3">
              {modalType && modalType.toLowerCase().includes('kota') && (
                <div>
                  <label className="block text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Pilih Provinsi
                  </label>
                  <select
                    value={selectedProvinsiId || ''}
                    onChange={(e) => setSelectedProvinsiId(parseInt(e.target.value))}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-700 font-semibold"
                  >
                    {initialProvinsi.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama}
                      </option>
                    ))}
                    {initialProvinsi.length === 0 && (
                      <option value="">Belum ada provinsi (tambah provinsi dahulu)</option>
                    )}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xxs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Nama {modalType && modalType.toLowerCase().includes('provinsi') ? 'Provinsi' : 'Kota'}
                </label>
                <Input 
                  type="text" 
                  value={inputNama}
                  onChange={(e) => setInputNama(e.target.value)}
                  placeholder={modalType && modalType.toLowerCase().includes('provinsi') ? 'contoh: Jawa Tengah' : 'contoh: Semarang'}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-700 font-medium"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button 
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
                variant="outline"
              >
                Batal
              </Button>
              <Button 
                type="submit"
                disabled={loading || (modalType && modalType.toLowerCase().includes('kota') && selectedProvinsiId === null)}
                loading={loading}
                variant="default"
              >
                Simpan
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= DELETE CONFIRMATION MODALS ================= */}
      {(modalType === 'deleteProvinsi' || modalType === 'deleteKota') && (
        <ConfirmationModal
          open={true}
          title={modalType === 'deleteProvinsi' ? 'Hapus Provinsi' : 'Hapus Kota'}
          message={`Apakah Anda yakin ingin menghapus ${modalType === 'deleteProvinsi' ? 'provinsi' : 'kota'} "${inputNama}"? Tindakan ini tidak bisa dibatalkan.`}
          confirmLabel="Hapus"
          variant="danger"
          loading={loading}
          onConfirm={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
}
