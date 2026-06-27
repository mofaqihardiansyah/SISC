'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { saveScrapedResultsAction, type ScrapedDataField } from '@/actions/admin-scraping';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Globe,
  FileText,
  ExternalLink,
} from 'lucide-react';

interface ScrapeResultModalProps {
  open: boolean;
  onClose: () => void;
  results: ScrapedDataField[];
  sourceName: string;
  onSaved: () => void;
}

export default function ScrapeResultModal({
  open,
  onClose,
  results,
  sourceName,
  onSaved,
}: ScrapeResultModalProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set(results.map((_, i) => i)));
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const toggleSelect = (idx: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === results.length) setSelected(new Set());
    else setSelected(new Set(results.map((_, i) => i)));
  };

  const handleSave = async () => {
    const toSave = results.filter((_, i) => selected.has(i));
    if (!toSave.length) return toast.error('Pilih minimal satu event');
    setSaving(true);
    const res = await saveScrapedResultsAction(toSave);
    if (res.success) {
      toast.success(`${res.count} event disimpan ke tabel!`);
      onSaved();
      onClose();
    } else {
      toast.error('Gagal menyimpan data');
    }
    setSaving(false);
  };

  const allSelected = selected.size === results.length;

  return (
    <Modal open={open} onClose={onClose} title={`Hasil Scrape: ${sourceName} (${results.length} event)`} className="max-w-3xl">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4 cursor-pointer" />
            Pilih semua ({results.length})
          </label>
          <span>{selected.size} dipilih</span>
        </div>

        <div className="space-y-1.5 max-h-[55vh] overflow-y-auto border rounded-lg divide-y divide-slate-100">
          {results.map((item, idx) => {
            const isOpen = expandedId === idx;
            return (
              <div key={idx} className={`transition-colors ${isOpen ? 'bg-slate-50' : ''}`}>
                <div className="flex items-start gap-2 px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={selected.has(idx)}
                    onChange={() => toggleSelect(idx)}
                    className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4 cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => setExpandedId(isOpen ? null : idx)}
                    >
                      <div className="flex items-center gap-1.5">
                        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                        <span className="font-semibold text-sm text-slate-800 truncate">{item.judul || '(Tanpa judul)'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xxs text-slate-400 mt-0.5 ml-5">
                        {item.tanggalMentah && <span>{item.tanggalMentah}</span>}
                        {item.detailLokasi && <span>{item.detailLokasi}</span>}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="ml-5 mt-2 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-2">
                        {item.deskripsi && (
                          <div className="flex items-start gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                            <span className="line-clamp-4">{item.deskripsi}</span>
                          </div>
                        )}
                        {item.linkEksternal && (
                          <div className="flex items-center gap-1.5">
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a href={item.linkEksternal} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline truncate">{item.linkEksternal}</a>
                          </div>
                        )}
                        {item.websiteSumber && (
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.websiteSumber}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {selected.has(idx) && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400">{selected.size} event akan disimpan</span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>Batal</Button>
            <Button onClick={handleSave} disabled={saving || selected.size === 0} loading={saving}>
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Simpan {selected.size > 0 ? `${selected.size} ` : ''}Event ke Tabel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
