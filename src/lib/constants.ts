export const SITE = {
  NAME: "POLIVENTS",
  TAGLINE: "Sistem Informasi Seminar & Conference",
  DESCRIPTION: "Hubungkan koneksi anda dan tambah wawasan anda melalui seminar dan conference",
  URL: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
  YEAR: 2026,
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY: "/register/verify",
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ORGANIZER: "/penyelenggara",
  PROFILE: "/profile",
  EXPLORE: "/jelajah",
  BANTUAN: "/bantuan",
  FAQ: "/faq",
  KONTAK: "/kontak",
} as const;

export const HIDE_NAVBAR_PATHS = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.VERIFY,
  ROUTES.ORGANIZER,
  ROUTES.ADMIN,
  ROUTES.PROFILE,
] as const;

export const API = {
  UPLOAD: "/api/upload",
  BOOKMARK: "/api/bookmark",
  USER_PROFILE: "/api/user/profile",
  ADMIN_USERS: "/api/admin/users",
  ADMIN_PENGATURAN: "/api/admin/pengaturan",
  ORGANIZER_STATS: "/api/organizer/stats",
  ORGANIZER_GRAFIK: "/api/organizer/grafik",
  ORGANIZER_GRAFIK_TAYANGAN: "/api/organizer/grafik-tayangan",
  ORGANIZER_GRAFIK_PENDAPATAN: "/api/organizer/grafik-pendapatan",
  ORGANIZER_PESERTA: "/api/organizer/peserta",
  EVENTS_VIEW: (eventId: number) => `/api/events/${eventId}/view`,
} as const;

export const SCRAPER = {
  BASE_URL: "https://eventkampus.com",
  DEFAULT_URL: "https://eventkampus.com/event/kategori/seminar",
  MAX_CONCURRENCY: 2,
  TIMEOUT_SECONDS: 60,
  WAIT_TIMEOUT_MS: 15000,
} as const;

export const AUTH = {
  SESSION_MAX_AGE_SECONDS: 24 * 60 * 60,
  EMAIL_SENDER_NAME: "POLIVENTS",
} as const;

export const UPLOAD_LIMITS = {
  AVATAR_MAX_SIZE: 2 * 1024 * 1024,
  DOCUMENT_MAX_SIZE: 4 * 1024 * 1024,
  BANNER_MAX_SIZE: 5 * 1024 * 1024,
  SERVER_ACTIONS_BODY_SIZE: "10mb",
  MAX_FILE_COUNT: 1,
} as const;

export const PAGINATION = {
  ROWS_PER_PAGE: 5,
  PAGE_SIZE: 10,
  RELATED_EVENTS_LIMIT: 4,
  RECENT_EVENTS_LIMIT: 4,
  DASHBOARD_MONTHS_BACK: 11,
  TREND_MULTIPLIER: 0.8,
} as const;

export const UI = {
  HERO_AUTOPLAY_DELAY_MS: 5000,
  DEBOUNCE_MS: 400,
  SEARCH_MIN_LENGTH: 2,
  NAVBAR_HEIGHT: 64,
  STICKY_OFFSET: 128,
  INTERSECTION_ROOT_MARGIN: 16,
} as const;

export const ASSETS = {
  PLACEHOLDER_BANNER: "/placeholder-banner.png",
} as const;

export const EVENT_TYPES = {
  POLINES: "POLINES",
  UMUM: "UMUM",
} as const;

export const PLATFORM_LABELS: Record<string, string> = {
  online: "Online",
  hybrid: "Hybrid",
  offline: "Offline",
} as const;

export const PLATFORM_LABELS_ID: Record<string, string> = {
  Online: "Daring",
  Offline: "Luring",
  Hybrid: "Hibrida",
} as const;

export const EVENT_TYPE_LABELS: Record<string, string> = {
  seminar: "Seminar",
  conference: "Conference",
} as const;

export const PRICE_LABELS: Record<string, string> = {
  free: "Gratis",
  paid: "Berbayar",
} as const;

export const BANK_LIST = [
  "BCA", "BNI", "BRI", "Mandiri", "BSI",
  "CIMB Niaga", "OCBC NISP", "Permata", "BTN", "Danamon",
] as const;

export const E_WALLET_LIST = [
  "GoPay", "OVO", "DANA", "LinkAja", "ShopeePay",
] as const;

export const FILTER_OPTIONS = [
  { value: "bulan-ini", label: "Bulan Ini" },
  { value: "bulan-lalu", label: "Bulan Lalu" },
  { value: "tahun-ini", label: "Tahun Ini" },
] as const;

export const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "pending", label: "Menunggu" },
  { value: "published", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
] as const;

export const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu",
  published: "Disetujui",
  rejected: "Ditolak",
  draft: "Draft",
};

export const EVENT_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Dipublikasi" },
  { value: "rejected", label: "Ditolak" },
] as const;

export const PLATFORM_OPTIONS = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export const MONTHS_ID = [
  "JAN", "FEB", "MAR", "APR", "MEI", "JUN",
  "JUL", "AGU", "SEP", "OKT", "NOV", "DES",
] as const;

export const MONTH_MAP_ID: Record<string, string> = {
  "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
  "05": "Mei", "06": "Jun", "07": "Jul", "08": "Agu",
  "09": "Sep", "10": "Okt", "11": "Nov", "12": "Des",
};

export const ERROR_MESSAGES = {
  FETCH_PESERTA: "Gagal mengambil data grafik peserta",
  FETCH_TAYANGAN: "Gagal mengambil data grafik tayangan",
  FETCH_PENDAPATAN: "Gagal mengambil data grafik pendapatan",
  TRACK_VIEW: "Gagal mencatat tayangan",
  UPLOAD_FILE: "Gagal mengupload file",
  UPLOAD_ERROR: "Terjadi kesalahan saat mengupload",
  NETWORK_ERROR: "Terjadi kesalahan jaringan",
  FORM_REQUIRED: "Semua kolom wajib diisi",
} as const;

export const UI_TEXT = {
  SEARCH_PLACEHOLDER: "Cari seminar atau konferensi",
  NO_DESCRIPTION: "Tidak ada deskripsi.",
  NO_DATE: "TANGGAL BELUM DITENTUKAN",
  NO_DATE_SHORT: "Tanggal belum ditentukan",
  NO_DATE_FALLBACK: "TBA",
  NO_LOCATION_FALLBACK: "Lokasi TBA",
  NO_EVENT_FEATURED: "Belum ada event unggulan",
  POPULAR_EVENT: "Paling Banyak Diminati",
  REGISTER_NOW: "Daftar Sekarang",
  DROP_FILE_HERE: "Klik atau seret file ke sini",
  FILE_UPLOADED: "Dokumen Terunggah",
  FILE_HINT: "PDF, Maks 20MB",
  SELECT_FILE: "Pilih Berkas",
  VISIT_WEBSITE: "Kunjungi Website",
  REGISTER: "Daftar",
  LOGIN_TO_REGISTER: "Login untuk Daftar",
  NO_DESCRIPTION_FALLBACK: "Tidak ada deskripsi.",
  DOCUMENT_UPLOADED: "Dokumen Terunggah",
} as const;

export const BANNER = {
  HEIGHT: "h-48",
  MODAL_MAX_HEIGHT: "max-h-[90vh]",
} as const;

export const SEED = {
  DEFAULT_WEBSITE: "https://polines.ac.id",
  DEFAULT_TICKET_URL: "https://loket.com/",
} as const;
