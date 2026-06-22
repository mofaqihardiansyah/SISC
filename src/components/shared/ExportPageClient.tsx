'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileDown, FileSpreadsheet } from 'lucide-react';

interface ExportPageClientProps {
  role: 'admin' | 'organizer';
  fetchData: () => Promise<unknown>;
  exportPdf: (data: unknown) => Promise<void>;
  exportExcel: (data: unknown) => Promise<void>;
}

export default function ExportPageClient({ role, fetchData, exportPdf, exportExcel }: ExportPageClientProps) {
  const [loading, setLoading] = useState<'pdf' | 'excel' | null>(null);

  const handleExport = async (format: 'pdf' | 'excel') => {
    setLoading(format);
    try {
      const data = await fetchData();
      if (format === 'pdf') await exportPdf(data);
      else await exportExcel(data);
      toast.success(`Export ${format.toUpperCase()} berhasil!`);
    } catch (err) {
      toast.error(`Gagal export: ${err instanceof Error ? err.message : 'Terjadi kesalahan'}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-500 space-y-6">
      <div>
        <p className="text-slate-500 mt-2 text-sm max-w-2xl">
          Unduh salinan seluruh data {role === 'admin' ? 'platform' : 'Anda'} untuk keperluan pencadangan, pelaporan, atau analisis lebih lanjut di luar sistem.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {/* PDF Export Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-6 border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50/80 text-indigo-600 rounded-xl shrink-0 mt-0.5">
              <FileDown className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Dokumen PDF</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                Rekapitulasi data dalam format PDF. Cocok untuk dibagikan secara langsung, dicetak, atau disisipkan sebagai lampiran dokumen resmi.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Button
              onClick={() => handleExport('pdf')}
              loading={loading === 'pdf'}
              disabled={loading !== null}
              variant="outline"
              className="w-full sm:w-auto hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
            >
              {!loading && <FileDown className="w-4 h-4 mr-2" />}
              Export PDF
            </Button>
          </div>
        </div>

        {/* Excel Export Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-6 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50/80 text-emerald-600 rounded-xl shrink-0 mt-0.5">
              <FileSpreadsheet className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Spreadsheet Excel</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                Data lengkap dalam format .xlsx (Excel). Sangat direkomendasikan jika Anda ingin melakukan filter, perhitungan, atau analisis data mendalam.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Button
              onClick={() => handleExport('excel')}
              loading={loading === 'excel'}
              disabled={loading !== null}
              variant="outline"
              className="w-full sm:w-auto hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
            >
              {!loading && <FileSpreadsheet className="w-4 h-4 mr-2" />}
              Export Excel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
