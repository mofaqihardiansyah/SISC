import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  belum_submit: {
    label: 'Belum Submit',
    className: 'bg-slate-50 text-slate-600 border-slate-200/60',
  },
  review: {
    label: 'Sedang Direview',
    className: 'bg-amber-50 text-amber-700 border-amber-200/60',
  },
  accepted: {
    label: 'Diterima',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  },
  rejected: {
    label: 'Ditolak',
    className: 'bg-rose-50 text-rose-700 border-rose-200/60',
  },
};

export function StatusBadge({ status }: { status: string }) {
  const { label, className } = STATUS_CONFIG[status] || STATUS_CONFIG.belum_submit;

  return (
    <span className={cn('inline-block px-2 py-0.5 text-xxs font-bold rounded-md border tracking-wide whitespace-nowrap', className)}>
      {label}
    </span>
  );
}