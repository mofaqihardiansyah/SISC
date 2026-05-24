import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  belum_submit: {
    label: 'Belum Submit',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  review: {
    label: 'Sedang Direview',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  accepted: {
    label: 'Diterima',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  rejected: {
    label: 'Ditolak',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
};

export function StatusBadge({ status }: { status: string }) {
  const { label, className } = STATUS_CONFIG[status] || STATUS_CONFIG.belum_submit;

  return (
    <span className={cn('inline-block px-2.5 py-1 text-[11px] font-semibold rounded border', className)}>
      {label}
    </span>
  );
}