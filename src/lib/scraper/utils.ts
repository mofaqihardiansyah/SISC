export const MONTH_MAP: Record<string, number> = {
  'jan': 0, 'januari': 0, 'feb': 1, 'februari': 1,
  'mar': 2, 'maret': 2, 'apr': 3, 'april': 3,
  'mei': 4, 'jun': 5, 'juni': 5, 'jul': 6, 'juli': 6,
  'agu': 7, 'agustus': 7, 'sep': 8, 'september': 8,
  'okt': 9, 'oktober': 9, 'nov': 10, 'nopember': 10,
  'des': 11, 'desember': 11,
};

export function parseIndoDate(str: string): Date | null {
  if (!str) return null;
  const cleaned = str.replace(/[,]/g, '').trim();

  // "12 Jan 2025" or "12 Januari 2025"
  const dmy = cleaned.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (dmy) {
    const month = MONTH_MAP[dmy[2].toLowerCase()];
    if (month !== undefined) return new Date(+dmy[3], month, +dmy[1]);
  }

  // "12-13 Januari 2025" or "12 s/d 13 Januari 2025" — take start date
  const rangeDmy = cleaned.match(/^(\d{1,2})\s*[-–s\/d]+\s*\d{1,2}\s+([A-Za-z]+)\s+(\d{4})$/);
  if (rangeDmy) {
    const month = MONTH_MAP[rangeDmy[2].toLowerCase()];
    if (month !== undefined) return new Date(+rangeDmy[3], month, +rangeDmy[1]);
  }

  // "12 Jan - 13 Jan 2025" — take start date
  const rangeDash = cleaned.match(/^(\d{1,2})\s+([A-Za-z]+)\s*[-–]\s*\d{1,2}\s+[A-Za-z]+\s+(\d{4})$/);
  if (rangeDash) {
    const month = MONTH_MAP[rangeDash[2].toLowerCase()];
    if (month !== undefined) return new Date(+rangeDash[3], month, +rangeDash[1]);
  }

  // ISO
  const iso = Date.parse(cleaned);
  if (!isNaN(iso)) return new Date(iso);

  return null;
}

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*\/?>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    .replace(/\s+on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '')
    .trim();
}

export function categorizeEvent(judul: string): 'seminar' | 'conference' {
  if (/konferensi|conference|call\s*for\s*paper|cfp/i.test(judul)) return 'conference';
  return 'seminar';
}

export function guessPlatform(detailLokasi: string | null): 'online' | 'offline' | 'hybrid' | null {
  if (!detailLokasi) return null;
  const lower = detailLokasi.toLowerCase();
  const hasOnline = /online|zoom|meet|daring|virtual/i.test(lower);
  const hasOffline = /offline|luring|gedung|ruangan|aula|hotel|lapangan/i.test(lower);
  if (hasOnline && hasOffline) return 'hybrid';
  if (hasOnline) return 'online';
  if (hasOffline) return 'offline';
  return null;
}

/**
 * Extract likely city name from a location string.
 * "Gedung Serba Guna, Semarang" → "Semarang"
 * "Grand Ballroom, Jakarta Pusat" → "Jakarta Pusat"
 * "Online via Zoom" → null
 */
export function extractCityFromLocation(detailLokasi: string): string | null {
  if (!detailLokasi) return null;

  // If it's clearly online-only, skip
  if (/^(online|zoom|virtual|daring|meet)/i.test(detailLokasi.trim())) return null;

  // Split by comma, take the last meaningful segment
  const parts = detailLokasi.split(',').map(p => p.trim()).filter(Boolean);
  if (parts.length < 2) return null;

  // Last segment is usually the city
  const lastPart = parts[parts.length - 1];

  // If last part looks like a city/region (not a building name), use it
  // City names typically don't start with "Jl.", "Gedung", "Lt.", etc.
  if (/^(gedung|jalan|jl|lt|lantai|ruang|floor|area)/i.test(lastPart)) return null;

  return lastPart;
}

/**
 * Blocked URL patterns for SSRF prevention.
 * Matches private IPs, localhost, and cloud metadata endpoints.
 */
const SSRF_BLOCKED = [
  /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)/i,
  /^https?:\/\/10\./,
  /^https?:\/\/172\.(1[6-9]|2[0-9]|3[01])\./,
  /^https?:\/\/192\.168\./,
  /^https?:\/\/169\.254\./,
  /^https?:\/\/\[::1\]/i,
];

export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    return !SSRF_BLOCKED.some(re => re.test(url));
  } catch {
    return false;
  }
}
