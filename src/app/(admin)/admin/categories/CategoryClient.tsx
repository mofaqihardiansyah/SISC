"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers, Tag as TagIcon, Loader2, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Portal from '@/components/ui/Portal';
import { 
  addKategoriAction, editKategoriAction, deleteKategoriAction,
  addTagAction, editTagAction, deleteTagAction 
} from '@/actions/categories-locations';

interface KategoriItem {
  id: number;
  nama: string | null;
  slug: string | null;
}

interface TagItem {
  id: number;
  nama: string | null;
}

interface CategoryClientProps {
  initialKategori: KategoriItem[];
  initialTag: TagItem[];
}

export default function CategoryClient({ initialKategori, initialTag }: CategoryClientProps) {
  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Modal states
  const [modalType, setModalType] = useState<'addKategori' | 'editKategori' | 'deleteKategori' | 'addTag' | 'editTag' | 'deleteTag' | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selected item / form inputs
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [inputNama, setInputNama] = useState('');

  // Pagination & Search for Kategori
  const [katSearch, setKatSearch] = useState('');
  const [katPage, setKatPage] = useState(1);
  const KATEGORI_PER_PAGE = 10;

  const filteredKategori = initialKategori.filter(k => 
    k.nama?.toLowerCase().includes(katSearch.toLowerCase())
  );
  const totalKatPages = Math.ceil(filteredKategori.length / KATEGORI_PER_PAGE) || 1;
  const startKatIndex = (katPage - 1) * KATEGORI_PER_PAGE;
  const paginatedKategori = filteredKategori.slice(startKatIndex, startKatIndex + KATEGORI_PER_PAGE);

  // Pagination & Search for Tags
  const [tagSearch, setTagSearch] = useState('');
  const [tagPage, setTagPage] = useState(1);
  const TAGS_PER_PAGE = 10;

  const filteredTags = initialTag.filter(t => 
    t.nama?.toLowerCase().includes(tagSearch.toLowerCase())
  );
  const totalTagPages = Math.ceil(filteredTags.length / TAGS_PER_PAGE) || 1;
  const startIndex = (tagPage - 1) * TAGS_PER_PAGE;
  const paginatedTags = filteredTags.slice(startIndex, startIndex + TAGS_PER_PAGE);

  const handleOpenModal = (type: typeof modalType, id: number | null = null, currentName: string = '') => {
    setModalType(type);
    setSelectedId(id);
    setInputNama(currentName);
    setErrorMsg(null);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedId(null);
    setInputNama('');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNama.trim() && modalType !== 'deleteKategori' && modalType !== 'deleteTag') {
      setErrorMsg("Nama tidak boleh kosong");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    let res: { success: boolean; error?: string } = { success: false, error: "Aksi tidak dikenal" };

    try {
      if (modalType === 'addKategori') {
        res = await addKategoriAction(inputNama);
      } else if (modalType === 'editKategori' && selectedId !== null) {
        res = await editKategoriAction(selectedId, inputNama);
      } else if (modalType === 'deleteKategori' && selectedId !== null) {
        res = await deleteKategoriAction(selectedId);
      } else if (modalType === 'addTag') {
        res = await addTagAction(inputNama);
      } else if (modalType === 'editTag' && selectedId !== null) {
        res = await editTagAction(selectedId, inputNama);
      } else if (modalType === 'deleteTag' && selectedId !== null) {
        res = await deleteTagAction(selectedId);
      }

      if (res.success) {
        handleCloseModal();
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
      {/* Grid Sistem 2 Kolom */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        
        {/* ================= DATA TABEL KATEGORI ================= */}
        <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40 shrink-0">
            <div className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
              <Layers size={16} className="text-indigo-600" />
              <h2>Daftar Kategori ({filteredKategori.length})</h2>
            </div>
            <button 
              onClick={() => handleOpenModal('addKategori')}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md cursor-pointer"
            >
              <Plus size={14} /> Tambah Kategori
            </button>
          </div>

          {/* Search Bar for Kategori */}
          <div className="p-3 bg-slate-50/30 border-b border-slate-100 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input 
                type="text" 
                placeholder="Cari kategori..."
                value={katSearch}
                onChange={(e) => {
                  setKatSearch(e.target.value);
                  setKatPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-100 text-slate-700 font-medium"
              />
            </div>
          </div>
          
          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50/80">
                  <th className="px-6 py-3">Nama Kategori</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {paginatedKategori.map((kat) => (
                  <tr key={kat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-800">{kat.nama}</td>
                    <td className="px-6 py-3.5">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono text-[11px]">
                        {kat.slug}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal('editKategori', kat.id, kat.nama || '')}
                          className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer" 
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => handleOpenModal('deleteKategori', kat.id, kat.nama || '')}
                          className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer" 
                          title="Hapus"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedKategori.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-slate-400 italic">Belum ada data kategori.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Kategori */}
          <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-slate-50/20 mt-auto shrink-0 h-[58px]">
            <span className="text-[11px] text-slate-400 font-medium">
              {filteredKategori.length > 0 ? (
                <>
                  Menampilkan <strong className="text-slate-600">{startKatIndex + 1}</strong> – <strong className="text-slate-600">{Math.min(startKatIndex + KATEGORI_PER_PAGE, filteredKategori.length)}</strong> dari <strong className="text-slate-600">{filteredKategori.length}</strong> kategori
                </>
              ) : (
                "Tidak ada kategori ditemukan"
              )}
            </span>
            {totalKatPages > 1 && (
              <div className="flex gap-1 items-center">
                <button 
                  type="button"
                  onClick={() => setKatPage(p => Math.max(1, p - 1))} 
                  disabled={mounted ? (katPage === 1) : false}
                  className="w-7 h-7 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                </button>
                
                {Array.from({ length: totalKatPages }, (_, i) => i + 1).map((p) => {
                  if (totalKatPages > 5) {
                    if (p !== 1 && p !== totalKatPages && Math.abs(p - katPage) > 1) {
                      if (p === 2 && katPage > 3) return <span key={p} className="text-slate-400 px-0.5 text-[10px]">...</span>;
                      if (p === totalKatPages - 1 && katPage < totalKatPages - 2) return <span key={p} className="text-slate-400 px-0.5 text-[10px]">...</span>;
                      return null;
                    }
                  }
                  
                  return (
                    <button 
                      type="button"
                      key={p} 
                      onClick={() => setKatPage(p)}
                      className={`w-7 h-7 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                        katPage === p 
                          ? "bg-slate-900 text-white shadow-sm shadow-slate-950/10" 
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                
                <button 
                  type="button"
                  onClick={() => setKatPage(p => Math.min(totalKatPages, p + 1))} 
                  disabled={mounted ? (katPage === totalKatPages) : false}
                  className="w-7 h-7 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= DATA TABEL TAG ================= */}
        <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40 shrink-0">
            <div className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
              <TagIcon size={16} className="text-emerald-600" />
              <h2>Daftar Tag ({filteredTags.length})</h2>
            </div>
            <button 
              onClick={() => handleOpenModal('addTag')}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md cursor-pointer"
            >
              <Plus size={14} /> Tambah Tag
            </button>
          </div>
          
          {/* Search Bar for Tags */}
          <div className="p-3 bg-slate-50/30 border-b border-slate-100 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input 
                type="text" 
                placeholder="Cari tag..."
                value={tagSearch}
                onChange={(e) => {
                  setTagSearch(e.target.value);
                  setTagPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-slate-100 text-slate-700 font-medium"
              />
            </div>
          </div>
          
          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase bg-slate-50/80">
                  <th className="px-6 py-3">Nama Tag</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {paginatedTags.map((tg) => (
                  <tr key={tg.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-800">{tg.nama}</td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal('editTag', tg.id, tg.nama || '')}
                          className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer" 
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => handleOpenModal('deleteTag', tg.id, tg.nama || '')}
                          className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer" 
                          title="Hapus"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedTags.length === 0 && (
                  <tr>
                    <td colSpan={2} className="text-center py-8 text-slate-400 italic">Belum ada data tag.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Tag */}
          <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-slate-50/20 mt-auto shrink-0 h-[58px]">
            <span className="text-[11px] text-slate-400 font-medium">
              {filteredTags.length > 0 ? (
                <>
                  Menampilkan <strong className="text-slate-600">{startIndex + 1}</strong> – <strong className="text-slate-600">{Math.min(startIndex + TAGS_PER_PAGE, filteredTags.length)}</strong> dari <strong className="text-slate-600">{filteredTags.length}</strong> tag
                </>
              ) : (
                "Tidak ada tag ditemukan"
              )}
            </span>
            {totalTagPages > 1 && (
              <div className="flex gap-1 items-center">
                <button 
                  type="button"
                  onClick={() => setTagPage(p => Math.max(1, p - 1))} 
                  disabled={mounted ? (tagPage === 1) : false}
                  className="w-7 h-7 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                </button>
                
                {Array.from({ length: totalTagPages }, (_, i) => i + 1).map((p) => {
                  if (totalTagPages > 5) {
                    if (p !== 1 && p !== totalTagPages && Math.abs(p - tagPage) > 1) {
                      if (p === 2 && tagPage > 3) return <span key={p} className="text-slate-400 px-0.5 text-[10px]">...</span>;
                      if (p === totalTagPages - 1 && tagPage < totalTagPages - 2) return <span key={p} className="text-slate-400 px-0.5 text-[10px]">...</span>;
                      return null;
                    }
                  }
                  
                  return (
                    <button 
                      type="button"
                      key={p} 
                      onClick={() => setTagPage(p)}
                      className={`w-7 h-7 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                        tagPage === p 
                          ? "bg-slate-900 text-white shadow-sm shadow-slate-950/10" 
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                
                <button 
                  type="button"
                  onClick={() => setTagPage(p => Math.min(totalTagPages, p + 1))} 
                  disabled={mounted ? (tagPage === totalTagPages) : false}
                  className="w-7 h-7 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ================= POPUP MODALS ================= */}
      {modalType !== null && (
        <Portal>
          <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 transition-all animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm border border-slate-100">
            
            {/* Modal Title */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800">
                {modalType === 'addKategori' && 'Tambah Kategori Baru'}
                {modalType === 'editKategori' && 'Ubah Kategori'}
                {modalType === 'deleteKategori' && 'Hapus Kategori'}
                {modalType === 'addTag' && 'Tambah Tag Baru'}
                {modalType === 'editTag' && 'Ubah Tag'}
                {modalType === 'deleteTag' && 'Hapus Tag'}
              </h3>
              <button 
                onClick={handleCloseModal}
                disabled={loading}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Form inputs if not delete mode */}
              {modalType !== 'deleteKategori' && modalType !== 'deleteTag' ? (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Nama {modalType.toLowerCase().includes('kategori') ? 'Kategori' : 'Tag'}
                  </label>
                  <input 
                    type="text" 
                    value={inputNama}
                    onChange={(e) => setInputNama(e.target.value)}
                    placeholder={modalType.toLowerCase().includes('kategori') ? 'contoh: Teknologi' : 'contoh: WebDev'}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-700 font-medium"
                    autoFocus
                  />
                </div>
              ) : (
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus {modalType === 'deleteKategori' ? 'kategori' : 'tag'}{" "}
                  <strong className="text-slate-800">&quot;{inputNama}&quot;</strong>? Tindakan ini tidak bisa dibatalkan.
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  disabled={loading}
                  className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm disabled:opacity-50 text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer ${
                    modalType.startsWith('delete') 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {modalType.startsWith('delete') ? 'Hapus' : 'Simpan'}
                </button>
              </div>
            </form>

          </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
