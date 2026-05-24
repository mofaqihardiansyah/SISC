import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string | null;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'published':
      case 'accepted':
      case 'terdaftar':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'pending':
      case 'review':
      case 'sedang direview':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'rejected':
      case 'ditolak':
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'Published';
      case 'accepted': return 'Diterima';
      case 'terdaftar': return 'Terdaftar';
      case 'pending': return 'Pending';
      case 'review': return 'Dalam Review';
      case 'sedang direview': return 'Sedang Direview';
      case 'rejected': return 'Ditolak';
      case 'ditolak': return 'Ditolak';
      case 'cancelled': return 'Dibatalkan';
      default: return status || 'Unknown';
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
      getStatusStyles(status),
      className
    )}>
      {getStatusLabel(status)}
    </span>
  );
}