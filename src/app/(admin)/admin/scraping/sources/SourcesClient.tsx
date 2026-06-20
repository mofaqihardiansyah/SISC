'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';
import {
  Plus, Globe, Trash2, Play, Pencil, Sparkles, Check, AlertCircle
} from 'lucide-react';
import {
  createScrapingSource,
  deleteScrapingSource,
  toggleSourceActive,
  updateScrapingSource,
} from '@/actions/scraping-config';

interface ScrapingSource {
  id: number;
  name: string;
  baseUrl: string;
  urlPattern: string | null;
  scraperType: 'cheerio' | 'crawlee_playwright' | null;
  cronSchedule: string | null;
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

interface AutoApprovalRule {
  id: number;
  ruleName: string;
  conditionType: string;
  thresholdValue: number | null;
  autoPublish: boolean | null;
  enabled: boolean | null;
  createdAt: Date | null;
}

interface Props {
  initialSources: ScrapingSource[];
  initialRules: ValidationRule[];
  initialAutoApprovalRules: AutoApprovalRule[];
}

export default function SourcesClient({ initialSources, initialRules, initialAutoApprovalRules }: Props) {
  const [sources, setSources] = useState<ScrapingSource[]>(initialSources);
  const [rules] = useState<ValidationRule[]>(initialRules);
  const [autoRules] = useState<AutoApprovalRule[]>(initialAutoApprovalRules);
  const [activeTab, setActiveTab] = useState<'sources' | 'rules' | 'auto'>('sources');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editSource, setEditSource] = useState<ScrapingSource | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'rules' || hash === 'auto') {
      setActiveTab(hash);
    }
    const onHashChange = () => {
      const h = window.location.hash.replace('#', '');
      if (h === 'rules' || h === 'auto') setActiveTab(h);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const tabs: { key: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { key: 'sources', label: 'Sumber Scraping', icon: <Globe className="w-4 h-4" /> },
    { key: 'rules', label: 'Aturan Validasi', icon: <Check className="w-4 h-4" /> },
    { key: 'auto', label: 'Auto-Approval', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const handleDelete = async (id: number) => {
    const res = await deleteScrapingSource(id);
    if (res.success) {
      setSources(prev => prev.filter(s => s.id !== id));
      toast.success('Sumber scraping berhasil dihapus');
    } else {
      toast.error(res.error || 'Gagal menghapus');
    }
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

  const handleTestScrape = async (source: ScrapingSource) => {
    toast.info(`Tes scraping untuk ${source.name}... (simulasi)`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Konfigurasi Scraping</h1>
          <p className="text-sm text-slate-500 mt-1">Atur sumber scraping, aturan validasi, dan threshold auto-approval</p>
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
          <div className="flex justify-end">
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Tambah Sumber
            </Button>
          </div>

          {sources.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-500">Belum ada sumber scraping</p>
              <p className="text-sm text-slate-400 mt-1">Tambahkan sumber website untuk discrape</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sources.map(source => (
                <div key={source.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800">{source.name}</h3>
                        <Badge variant={source.isActive ? 'default' : 'secondary'} className={`shadow-none text-xxs font-bold uppercase tracking-wider ${
                          source.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {source.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="secondary" className="shadow-none text-xxs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border-indigo-100">
                          {source.scraperType === 'cheerio' ? 'Cheerio' : 'Crawlee+Playwright'}
                        </Badge>
                      </div>
                      <p className="text-xs font-mono text-slate-500 truncate">{source.baseUrl}</p>
                      {source.urlPattern && (
                        <p className="text-xxs text-slate-400 mt-0.5">Pattern: {source.urlPattern}</p>
                      )}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xxs text-slate-400">
                        {source.cronSchedule && <span>Schedule: {source.cronSchedule}</span>}
                        <span>Max: {source.maxResultsPerRun ?? 100} items</span>
                        <span>Delay: {source.rateLimitDelayMs ?? 1000}ms</span>
                      </div>
                      {source.lastScrapedAt && (
                        <div className="mt-2 text-xxs text-slate-400">
                          Last scrape: {new Date(source.lastScrapedAt).toLocaleString('id-ID')}
                          {source.lastSuccessfulCount !== null && ` (${source.lastSuccessfulCount} items)`}
                        </div>
                      )}
                      {source.lastErrorMessage && (
                        <div className="mt-1 text-xxs text-rose-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {source.lastErrorMessage}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Button size="xs" variant="outline" onClick={() => setEditSource(source)}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button size="xs" variant="outline" onClick={() => handleTestScrape(source)}>
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button size="xs" variant={source.isActive ? 'outline' : 'default'} onClick={() => handleToggleActive(source.id)}>
                        {source.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </Button>
                      <Button size="xs" variant="destructive" onClick={() => handleDelete(source.id)}>
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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-700">Aturan Validasi Field</h3>
            <p className="text-xs text-slate-400 mt-1">Konfigurasi field yang wajib diisi dan threshold kepercayaan per field</p>
          </div>
          {rules.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Belum ada aturan validasi</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {rules.map(rule => (
                <div key={rule.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="shadow-none font-bold uppercase text-xxs bg-slate-100 text-slate-700 border-slate-200 min-w-[100px]">
                      {rule.fieldName}
                    </Badge>
                    <div className="flex gap-3 text-xs text-slate-500">
                      <span className={rule.isRequired ? 'text-emerald-600 font-semibold' : ''}>
                        {rule.isRequired ? 'Required' : 'Optional'}
                      </span>
                      {rule.minLength !== null && <span>Min: {rule.minLength}</span>}
                      {rule.maxLength !== null && <span>Max: {rule.maxLength}</span>}
                      <span>Threshold: {rule.confidenceThreshold ?? 75}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AUTO-APPROVAL TAB */}
      {activeTab === 'auto' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-700">Aturan Auto-Approval</h3>
            <p className="text-xs text-slate-400 mt-1">Konfigurasi kapan event otomatis diterbitkan tanpa review manual</p>
          </div>
          {autoRules.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Belum ada aturan auto-approval</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {autoRules.map(rule => (
                <div key={rule.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-slate-700 text-sm">{rule.ruleName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {rule.conditionType} {rule.thresholdValue !== null ? `≥ ${rule.thresholdValue}%` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`shadow-none text-xxs font-bold uppercase tracking-wider ${
                      rule.enabled
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {rule.enabled ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                    {rule.autoPublish && (
                      <Badge variant="secondary" className="shadow-none text-xxs font-bold bg-indigo-50 text-indigo-700 border-indigo-100">
                        Auto-Publish
                      </Badge>
                    )}
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
                  cronSchedule: data.cronSchedule,
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
                  cronSchedule: data.cronSchedule ?? undefined,
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
    </div>
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
  const [cronSchedule, setCronSchedule] = useState(initialData?.cronSchedule ?? '');
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
      cronSchedule: cronSchedule.trim() || null,
      maxResultsPerRun: maxResults,
      rateLimitDelayMs: rateLimit,
      maxConcurrentRequests: maxConcurrent,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Nama Sumber <span className="text-rose-500">*</span></label>
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          placeholder="nama website" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Base URL <span className="text-rose-500">*</span></label>
        <input type="url" value={baseUrl} onChange={e => setBaseUrl(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          placeholder="URL Website" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">URL Pattern (Regex)</label>
        <input type="text" value={urlPattern} onChange={e => setUrlPattern(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          placeholder="Pola URL" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Scraper Type</label>
          <select value={scraperType} onChange={e => setScraperType(e.target.value as 'cheerio' | 'crawlee_playwright')}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
            <option value="cheerio">Cheerio (Ringan)</option>
            <option value="crawlee_playwright">Crawlee + Playwright (Berat)</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Cron Schedule</label>
          <input type="text" value={cronSchedule} onChange={e => setCronSchedule(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            placeholder="0 */6 * * * (setiap 6 jam)" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Max Items</label>
          <input type="number" value={maxResults} onChange={e => setMaxResults(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Delay (ms)</label>
          <input type="number" value={rateLimit} onChange={e => setRateLimit(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Concurrent</label>
          <input type="number" value={maxConcurrent} onChange={e => setMaxConcurrent(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
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
