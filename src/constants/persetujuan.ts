import { STATUS_OPTIONS, STATUS_LABEL, PAGINATION, UI, BANNER } from "@/lib/constants";
export { STATUS_OPTIONS as statusOptions, STATUS_LABEL as statusLabel };
export const PAGE_SIZE = PAGINATION.PAGE_SIZE;
export const DEBOUNCE_MS = UI.DEBOUNCE_MS;
export const SEARCH_MIN_LENGTH = UI.SEARCH_MIN_LENGTH;
export const BANNER_HEIGHT = BANNER.HEIGHT;
export const MODAL_MAX_HEIGHT = BANNER.MODAL_MAX_HEIGHT;

export function getPlatformColor(platform: string | null) {
  switch (platform) {
    case "Offline":
    case "Luring":
      return "bg-indigo-50 text-indigo-700 border border-indigo-200/60";
    case "Online":
    case "Daring":
      return "bg-rose-50 text-rose-700 border border-rose-200/60";
    case "Hybrid":
    case "Hibrida":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
    default:
      return "bg-slate-50 text-slate-700 border border-slate-200/60";
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border border-amber-200/60";
    case "published":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
    case "rejected":
      return "bg-rose-50 text-rose-700 border border-rose-200/60";
    default:
      return "bg-slate-50 text-slate-700 border border-slate-200/60";
  }
}

export function formatDateDisplay(d: Date | string | null): string {
  if (!d) return "-";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function formatPlatform(platform: string | null): string {
  if (platform === "Offline") return "Luring";
  if (platform === "Online") return "Daring";
  if (platform === "Hybrid") return "Hibrida";
  return platform || "-";
}
