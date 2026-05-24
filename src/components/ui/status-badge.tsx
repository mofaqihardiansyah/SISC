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
    <span className={cn('inline-block px-2 py-0.5 text-[10px] font-bold rounded-md border tracking-wide whitespace-nowrap', className)}>
      {label}
    </span>
  );
}