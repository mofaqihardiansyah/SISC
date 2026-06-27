'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import {
  Plus, Globe, Trash2, Play, Pencil, Check, AlertCircle, Search, Activity, Power, PowerOff
} from 'lucide-react';
import {
  createScrapingSource,
  deleteScrapingSource,
  toggleSourceActive,
  updateScrapingSource,
  createValidationRule,
  updateValidationRule,
  deleteValidationRule,
} from '@/actions/scraping-config';
import { triggerScrapeAction } from '@/actions/admin-scraping';

interface ScrapingSource {
  id: number;
  name: string;
  baseUrl: string;
  urlPattern: string | null;
  scraperType: 'cheerio' | 'crawlee_playwright' | null;

  maxResultsPerRun: number | null;
  rateLimitDelayMs: number | null;
  maxConcurrentRequests: number | null;
  isActive: boolean | null;
  lastScrapedAt: Date | null;
  lastSuccessfulCount: number | null;
  lastErrorMessage: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface ValidationRule {
  id: number;
  fieldName: string;
  isRequired: boolean | null;
  minLength: number | null;
  maxLength: number | null;
  regexPattern: string | null;
  confidenceThreshold: number | null;
  createdAt: Date | null;
}

interface Props {
  initialSources: ScrapingSource[];
  initialRules: ValidationRule[];
}

export default function SourcesClient({ initialSources, initialRules }: Props) {
  const [sources, setSources] = useState<ScrapingSource[]>(initialSources);
  const [rules, setRules] = useState<ValidationRule[]>(initialRules);
  const [activeTab, setActiveTab] = useState<'sources' | 'rules'>('sources');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editSource, setEditSource] = useState<ScrapingSource | null>(null);
  const [ruleModal, setRuleModal] = useState<{ open: boolean; edit: ValidationRule | null }>({ open: false, edit: null });
  const [deleteConfirm, setDeleteConfirm] = useState<ScrapingSource | null>(null);
  const [testingSource, setTestingSource] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'active' | 'inactive' | 'scraped-new' | 'scraped-old'>('name-asc');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'rules') {
      setActiveTab(hash);
    }
    const onHashChange = () => {
      const h = window.location.hash.replace('#', '');
      if (h === 'rules') setActiveTab(h);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const tabs: { key: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { key: 'sources', label: 'Sumber Scraping', icon: <Globe className="w-4 h-4" /> },
    { key: 'rules', label: 'Aturan Validasi', icon: <Check className="w-4 h-4" /> },
  ];

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const res = await deleteScrapingSource(deleteConfirm.id);
    if (res.success) {
      setSources(prev => prev.filter(s => s.id !== deleteConfirm.id));
      toast.success(`"${deleteConfirm.name}" berhasil dihapus`);
    } else {
      toast.error(res.error || 'Gagal menghapus');
    }
    setDeleteConfirm(null);
  };

  const handleToggleActive = async (id: number) => {
    const res = await toggleSourceActive(id);
    if (res.success) {
      setSources(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
      toast.success('Status berhasil diubah');
    } else {
      toast.error(res.error || 'Gagal mengubah status');
    }
  };

  // ponytail: triggerScrapeAction runs ALL active sources, not just the target.
  // Upgrade path: accept a sourceId param in the API to scope the scrape.
  const handleTestScrape = async (source: ScrapingSource) => {
    setTestingSource(source.id);
    try {
      const res = await triggerScrapeAction();
      if (res.success) {
        toast.success(`Scrapping "${source.name}" selesai! Cek log untuk detail.`);
      } else {
        toast.error(res.error || `Gagal scrapping ${source.name}`);
      }
    } catch {
      toast.error(`Gagal scrapping ${source.name}`);
    } finally {
      setTestingSource(null);
    }
  };

  const handleSaveRule = async (data: Partial<ValidationRule>) => {
    if (data.fieldName) {
      const duplicate = rules.find(r => r.fieldName === data.fieldName && r.id !== ruleModal.edit?.id);
      if (duplicate) {
        toast.error(`Field "${data.fieldName}" sudah memiliki aturan`);
        return;
      }
    }
    setSaving(true);
    try {
      if (ruleModal.edit) {
        const res = await updateValidationRule(ruleModal.edit.id, {
          fieldName: data.fieldName,
          isRequired: data.isRequired ?? undefined,
          minLength: data.minLength ?? null,
          maxLength: data.maxLength ?? null,
          regexPattern: data.regexPattern ?? null,
          confidenceThreshold: data.confidenceThreshold ?? 75,
        });
        if (res.success) {
          setRules(prev => prev.map(r => r.id === ruleModal.edit!.id ? { ...r, ...data } : r));
          toast.success('Aturan validasi diperbarui');
          setRuleModal({ open: false, edit: null });
        } else toast.error(res.error || 'Gagal memperbarui');
      } else {
        const res = await createValidationRule({
          fieldName: data.fieldName || '',
          isRequired: data.isRequired ?? undefined,
          minLength: data.minLength ?? null,
          maxLength: data.maxLength ?? null,
          regexPattern: data.regexPattern ?? null,
          confidenceThreshold: data.confidenceThreshold ?? 75,
        });
        if (res.success && res.data) {
          setRules(prev => [...prev, res.data as ValidationRule]);
          toast.success('Aturan validasi ditambahkan');
          setRuleModal({ open: false, edit: null });
        } else toast.error(res.error || 'Gagal menambahkan');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRule = async (id: number) => {
    const res = await deleteValidationRule(id);
    if (res.success) {
      setRules(prev => prev.filter(r => r.id !== id));
      toast.success('Aturan validasi dihapus');
    } else toast.error(res.error || 'Gagal menghapus');
  };

  const filteredSources = useMemo(() => {
    let result = sources;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.baseUrl.toLowerCase().includes(q) ||
        (s.urlPattern && s.urlPattern.toLowerCase().includes(q)) ||
        (s.scraperType && s.scraperType.toLowerCase().includes(q))
      );
    }
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'active': return a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1;
        case 'inactive': return a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1;
        case 'scraped-new': return new Date(b.lastScrapedAt ?? 0).getTime() - new Date(a.lastScrapedAt ?? 0).getTime();
        case 'scraped-old': return new Date(a.lastScrapedAt ?? 0).getTime() - new Date(b.lastScrapedAt ?? 0).getTime();
        default: return a.name.localeCompare(b.name);
      }
    });
  }, [sources, searchQuery, sortBy]);

  const stats = useMemo(() => ({
    total: sources.length,
    active: sources.filter(s => s.isActive).length,
    inactive: sources.filter(s => !s.isActive).length,
    errors: sources.filter(s => s.lastErrorMessage).length,
  }), [sources]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Konfigurasi Scraping</h1>
          <p className="text-sm text-slate-500 mt-1">Atur sumber scraping dan aturan validasi</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* SOURCES TAB */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
              <span className="text-xxs font-bold text-slate-400 tracking-wider">Total</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
              <span className="text-xxs font-bold text-slate-400 tracking-wider">Aktif</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.active}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
              <span className="text-xxs font-bold text-slate-400 tracking-wider">Nonaktif</span>
              <p className="text-2xl font-bold text-slate-500 mt-1">{stats.inactive}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)]">
              <span className="text-xxs font-bold text-slate-400 tracking-wider">Error</span>
              <p className="text-2xl font-bold text-rose-600 mt-1">{stats.errors}</p>
            </div>
          </div>

          {/* Search + Sort + Add button */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Cari sumber..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="h-9"
              >
                <option value="name-asc">Nama A-Z</option>
                <option value="name-desc">Nama Z-A</option>
                <option value="active">Aktif dulu</option>
                <option value="inactive">Nonaktif dulu</option>
                <option value="scraped-new">Terbaru discrape</option>
                <option value="scraped-old">Terlama discrape</option>
              </Select>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Tambah Sumber
            </Button>
          </div>

          {filteredSources.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-12 text-center">
              <Globe className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-500">
                {searchQuery ? 'Tidak ada sumber yang cocok' : 'Belum ada sumber scraping'}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {searchQuery ? 'Coba ubah kata kunci pencarian' : 'Tambahkan sumber website untuk discrape'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSources.map(source => (
                <div key={source.id} className="bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800 text-sm">{source.name}</h3>
                        <span className={`inline-flex items-center gap-1 text-xxs font-semibold px-1.5 py-0.5 rounded border ${
                          source.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {source.isActive ? <Power className="w-2.5 h-2.5" /> : <PowerOff className="w-2.5 h-2.5" />}
                          {source.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="inline-flex items-center text-xxs font-semibold px-1.5 py-0.5 rounded border bg-slate-50 text-slate-600 border-slate-200">
                          {source.scraperType === 'cheerio' ? 'Cheerio' : 'Playwright'}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-500 truncate">{source.baseUrl}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-xxs text-slate-400">

                        <span>Max: {source.maxResultsPerRun ?? 100}</span>
                        <span>Delay: {source.rateLimitDelayMs ?? 1000}ms</span>
                      </div>
                      {source.lastScrapedAt && (
                        <div className="mt-1.5 text-xxs text-slate-400 flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {new Date(source.lastScrapedAt).toLocaleString('id-ID')}
                          {source.lastSuccessfulCount !== null && <>({source.lastSuccessfulCount} items)</>}
                        </div>
                      )}
                      {source.lastErrorMessage && (
                        <div className="mt-1 text-xxs text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {source.lastErrorMessage}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="xs" variant="outline" onClick={() => setEditSource(source)} title="Edit">
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button size="xs" variant="outline" onClick={() => handleTestScrape(source)} title="Test Scrape" loading={testingSource === source.id}>
                        {testingSource !== source.id && <Play className="w-3 h-3" />}
                      </Button>
                      <Button size="xs" variant={source.isActive ? 'outline' : 'default'} onClick={() => handleToggleActive(source.id)}>
                        {source.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </Button>
                      <Button size="xs" variant="destructive" onClick={() => setDeleteConfirm(source)} title="Hapus">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RULES TAB */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">Aturan Validasi Field</h3>
              <p className="text-xs text-slate-500 mt-0.5">Konfigurasi field yang wajib diisi dan threshold kepercayaan</p>
            </div>
            <Button size="sm" onClick={() => setRuleModal({ open: true, edit: null })}>
              <Plus className="w-4 h-4 mr-1" /> Tambah Aturan
            </Button>
          </div>

          {rules.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] p-10 text-center">
              <Check className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-500">Belum ada aturan validasi</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] divide-y divide-slate-100 overflow-hidden">
              {rules.map(rule => (
                <div key={rule.id} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-1 rounded min-w-[90px] text-center">
                      {rule.fieldName}
                    </span>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                      <span className={rule.isRequired ? 'text-emerald-600 font-semibold' : ''}>
                        {rule.isRequired ? 'Required' : 'Optional'}
                      </span>
                      {rule.minLength !== null && <span>Min: {rule.minLength}</span>}
                      {rule.maxLength !== null && <span>Max: {rule.maxLength}</span>}
                      <span>Threshold: {rule.confidenceThreshold ?? 75}%</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-3">
                    <Button size="xs" variant="outline" onClick={() => setRuleModal({ open: true, edit: rule })}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button size="xs" variant="destructive" onClick={() => handleDeleteRule(rule.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Source Modal */}
      <Modal open={showAddModal || !!editSource} onClose={() => { setShowAddModal(false); setEditSource(null); }} title={editSource ? 'Edit Sumber Scraping' : 'Tambah Sumber Scraping'} className="max-w-lg">
        <SourceForm
          initialData={editSource}
          onSave={async (data) => {
            setSaving(true);
            try {
              if (editSource) {
                const res = await updateScrapingSource(editSource.id, {
                  name: data.name,
                  baseUrl: data.baseUrl,
                  urlPattern: data.urlPattern,
                  scraperType: data.scraperType === null ? undefined : data.scraperType,
                  isActive: data.isActive ?? undefined,
                  maxResultsPerRun: data.maxResultsPerRun ?? undefined,
                  rateLimitDelayMs: data.rateLimitDelayMs ?? undefined,
                  maxConcurrentRequests: data.maxConcurrentRequests ?? undefined,
                });
                if (res.success) {
                  setSources(prev => prev.map(s => s.id === editSource.id ? { ...s, ...data, updatedAt: new Date() } : s));
                  toast.success('Sumber berhasil diperbarui');
                  setEditSource(null);
                } else {
                  toast.error(res.error || 'Gagal memperbarui');
                }
              } else {
                const res = await createScrapingSource({
                  name: data.name || '',
                  baseUrl: data.baseUrl || '',
                  urlPattern: data.urlPattern ?? undefined,
                  scraperType: data.scraperType === null ? undefined : data.scraperType,
                  maxResultsPerRun: data.maxResultsPerRun ?? undefined,
                  rateLimitDelayMs: data.rateLimitDelayMs ?? undefined,
                  maxConcurrentRequests: data.maxConcurrentRequests ?? undefined,
                });
                if (res.success && res.data) {
                  setSources(prev => [res.data as ScrapingSource, ...prev]);
                  toast.success('Sumber berhasil ditambahkan');
                  setShowAddModal(false);
                } else {
                  toast.error(res.error || 'Gagal menambahkan');
                }
              }
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
          onCancel={() => { setShowAddModal(false); setEditSource(null); }}
        />
      </Modal>

      {/* Rule Form Modal */}
      <Modal
        open={ruleModal.open}
        onClose={() => setRuleModal({ open: false, edit: null })}
        title={ruleModal.edit ? 'Edit Aturan Validasi' : 'Tambah Aturan Validasi'}
        className="max-w-md"
      >
        <RuleForm
          initialData={ruleModal.edit}
          existingFieldNames={rules.filter(r => r.id !== ruleModal.edit?.id).map(r => r.fieldName)}
          onSave={handleSaveRule}
          saving={saving}
          onCancel={() => setRuleModal({ open: false, edit: null })}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Hapus Sumber Scraping"
        message={`Yakin ingin menghapus "${deleteConfirm?.name}"? Semua data scraping dari sumber ini tidak akan terpengaruh, tapi sumber tidak bisa digunakan lagi.`}
        confirmLabel="Hapus"
        variant="danger"
      />
    </div>
  );
}

function RuleForm({
  initialData,
  existingFieldNames,
  onSave,
  saving,
  onCancel,
}: {
  initialData: ValidationRule | null;
  existingFieldNames: string[];
  onSave: (data: Partial<ValidationRule>) => Promise<void>;
  saving: boolean;
  onCancel: () => void;
}) {
  const [fieldName, setFieldName] = useState(initialData?.fieldName ?? '');
  const [isRequired, setIsRequired] = useState(initialData?.isRequired ?? true);
  const [minLength, setMinLength] = useState<number | ''>(initialData?.minLength ?? '');
  const [maxLength, setMaxLength] = useState<number | ''>(initialData?.maxLength ?? '');
  const [regexPattern, setRegexPattern] = useState(initialData?.regexPattern ?? '');
  const [threshold, setThreshold] = useState(initialData?.confidenceThreshold ?? 75);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName.trim()) {
      toast.error('Nama field wajib diisi');
      return;
    }
    await onSave({
      fieldName: fieldName.trim(),
      isRequired,
      minLength: minLength === '' ? null : Number(minLength),
      maxLength: maxLength === '' ? null : Number(maxLength),
      regexPattern: regexPattern.trim() || null,
      confidenceThreshold: threshold,
    });
  };

  const KNOWN_FIELDS = [
    { value: 'judul', label: 'Judul' },
    { value: 'tanggalMulai', label: 'Tanggal Mulai' },
    { value: 'tanggalSelesai', label: 'Tanggal Selesai' },
    { value: 'tanggalMentah', label: 'Tanggal Mentah (raw)' },
    { value: 'tipePlatform', label: 'Platform (online/offline/hybrid)' },
    { value: 'kotaId', label: 'Kota' },
    { value: 'kategoriId', label: 'Kategori' },
    { value: 'detailLokasi', label: 'Detail Lokasi' },
    { value: 'deskripsi', label: 'Deskripsi' },
    { value: 'linkRegistrasi', label: 'Link Registrasi' },
    { value: 'linkEksternal', label: 'Link Eksternal' },
    { value: 'namaKontak', label: 'Nama Kontak' },
    { value: 'teleponKontak', label: 'Telepon Kontak' },
    { value: 'emailKontak', label: 'Email Kontak' },
    { value: 'harga', label: 'Harga' },
    { value: 'tipeHarga', label: 'Tipe Harga' },
    { value: 'kuota', label: 'Kuota' },
    { value: 'jenisEvent', label: 'Jenis Event' },
    { value: 'urlBanner', label: 'URL Banner' },
    { value: 'websiteSumber', label: 'Website Sumber' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">Nama Field <span className="text-rose-500">*</span></label>
        <select
          value={fieldName}
          onChange={e => setFieldName(e.target.value)}
          className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">-- Pilih field --</option>
          {KNOWN_FIELDS.map(f => {
            const taken = existingFieldNames.includes(f.value);
            const isCurrentEdit = initialData?.fieldName === f.value;
            return (
              <option key={f.value} value={f.value} disabled={taken && !isCurrentEdit}>
                {f.label} ({f.value}){taken && !isCurrentEdit ? ' \u2014 sudah digunakan' : ''}
              </option>
            );
          })}
        </select>
        <p className="text-[10px] text-slate-400">Nama field harus sesuai dengan key data scraped</p>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isRequired" checked={isRequired} onChange={e => setIsRequired(e.target.checked)}
          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4" />
        <label htmlFor="isRequired" className="text-sm text-slate-700">Field wajib diisi (Required)</label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Min Length</label>
          <Input type="number" value={minLength} onChange={e => setMinLength(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Kosongkan" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Max Length</label>
          <Input type="number" value={maxLength} onChange={e => setMaxLength(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Kosongkan" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">Regex Pattern</label>
        <Input value={regexPattern} onChange={e => setRegexPattern(e.target.value)} placeholder="/^[a-zA-Z]+$/" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">Confidence Threshold (%)</label>
        <Input type="number" value={threshold} onChange={e => setThreshold(Number(e.target.value))} min={0} max={100} />
      </div>
      <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
        <Button variant="outline" type="button" onClick={onCancel}>Batal</Button>
        <Button type="submit" loading={saving}>
          <Check className="w-4 h-4 mr-2" /> {initialData ? 'Simpan' : 'Tambah'}
        </Button>
      </div>
    </form>
  );
}

function SourceForm({
  initialData,
  onSave,
  saving,
  onCancel,
}: {
  initialData: ScrapingSource | null;
  onSave: (data: Partial<ScrapingSource>) => Promise<void>;
  saving: boolean;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [baseUrl, setBaseUrl] = useState(initialData?.baseUrl ?? '');
  const [urlPattern, setUrlPattern] = useState(initialData?.urlPattern ?? '');
  const [scraperType, setScraperType] = useState<'cheerio' | 'crawlee_playwright'>(initialData?.scraperType ?? 'cheerio');
  const [maxResults, setMaxResults] = useState(initialData?.maxResultsPerRun ?? 100);
  const [rateLimit, setRateLimit] = useState(initialData?.rateLimitDelayMs ?? 1000);
  const [maxConcurrent, setMaxConcurrent] = useState(initialData?.maxConcurrentRequests ?? 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !baseUrl.trim()) {
      toast.error('Nama dan URL wajib diisi');
      return;
    }
    await onSave({
      name: name.trim(),
      baseUrl: baseUrl.trim(),
      urlPattern: urlPattern.trim() || null,
      scraperType,
      maxResultsPerRun: maxResults,
      rateLimitDelayMs: rateLimit,
      maxConcurrentRequests: maxConcurrent,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">Nama Sumber <span className="text-rose-500">*</span></label>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="nama website" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">Base URL <span className="text-rose-500">*</span></label>
        <Input type="url" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} placeholder="URL Website" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">URL Pattern (Regex)</label>
        <Input value={urlPattern} onChange={e => setUrlPattern(e.target.value)} placeholder="Pola URL" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Scraper Type</label>
          <Select value={scraperType} onChange={e => setScraperType(e.target.value as 'cheerio' | 'crawlee_playwright')}>
            <option value="cheerio">Cheerio (Ringan)</option>
            <option value="crawlee_playwright">Crawlee + Playwright (Berat)</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Max Items</label>
          <Input type="number" value={maxResults} onChange={e => setMaxResults(Number(e.target.value))} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Delay (ms)</label>
          <Input type="number" value={rateLimit} onChange={e => setRateLimit(Number(e.target.value))} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Concurrent</label>
          <Input type="number" value={maxConcurrent} onChange={e => setMaxConcurrent(Number(e.target.value))} />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
        <Button variant="outline" type="button" onClick={onCancel}>Batal</Button>
        <Button type="submit" loading={saving}>
          <Check className="w-4 h-4 mr-2" /> {initialData ? 'Simpan' : 'Tambah'}
        </Button>
      </div>
    </form>
  );
}
