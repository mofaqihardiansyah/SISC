'use client';

import React, { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { bulkPublishRawEventsWithEdits } from '@/actions/admin-scraping';
import type { ScrapedData } from './ScrapingClient';
import type { ValidationRule } from './shared';
import {
  CheckCircle2,
  AlertCircle,
  Send,
} from 'lucide-react';

interface BulkPublishModalProps {
  open: boolean;
  onClose: () => void;
  items: ScrapedData[];
  validationRules: ValidationRule[];
  onPublished: (ids: number[]) => void;
}

export default function BulkPublishModal({
  open,
  onClose,
  items,
  validationRules,
  onPublished,
}: BulkPublishModalProps) {
  const [publishing, setPublishing] = useState(false);

  const readyItemIds = useMemo(() => {
    const dataRecord = items[0]?.data as Record<string, unknown>;
    return items.filter(i => {
      for (const rule of validationRules) {
        if (!rule.isRequired) continue;
        if (!(rule.fieldName in dataRecord)) continue;
        const v = dataRecord[rule.fieldName];
        if (v === null || v === undefined || v === '' || v === 'null') return false;
      }
      return true;
    }).map(i => i.id);
  }, [items, validationRules]);

  const readyCount = readyItemIds.length;

  const handlePublishAll = async () => {
    const toPublish = items.filter(i => readyItemIds.includes(i.id));
    if (!toPublish.length) return toast.error('Tidak ada event valid');

    setPublishing(true);
    const res = await bulkPublishRawEventsWithEdits(
      toPublish.map(i => ({ id: i.id }))
    );

    if (res.count > 0) {
      toast.success(`${res.count} event diterbitkan!`);
      onPublished(toPublish.map(i => i.id));
    }
    if (res.failed?.length) {
      toast.error(`${res.failed.length} event gagal`);
    }
    setPublishing(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Review & Publikasi (${items.length} Event)`} className="max-w-2xl">
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> {readyCount} Siap
          </span>
          {items.length - readyCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <AlertCircle className="w-3 h-3" /> {items.length - readyCount} Perlu Review
            </span>
          )}
        </div>

        <div className="space-y-1.5 max-h-60 overflow-y-auto border rounded-lg divide-y divide-slate-100">
          {items.map(item => (
            <div key={item.id} className="px-3 py-2 flex items-center gap-2 text-sm">
              <span className="truncate flex-1">{item.data.judul}</span>
              {readyItemIds.includes(item.id)
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                : <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400">{readyCount}/{items.length} siap</span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={publishing}>Batal</Button>
            <Button onClick={handlePublishAll} disabled={publishing || readyCount === 0} loading={publishing}>
              <Send className="w-4 h-4 mr-1.5" /> Terbitkan
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
