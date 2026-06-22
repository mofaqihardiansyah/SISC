# POLIVENTS Scraping System — Kritik, Anomali & Roadmap

**Versi:** 2.0  
**Tanggal:** June 22, 2026  
**Fokus:** Manual-only admin scraping, kode audit

---

## 1. Eksekutif

Sistem scraping POLIVENTS sudah memiliki tech stack solid (Cheerio, Playwright, Zod, confidence scoring, JSONB storage) dan **config panel sudah ada** (sources, rules, auto-approval CRUD). Tapi setelah audit kode ditemukan **beberapa bug kritis** yang membuat fitur tidak berfungsi, plus **kode mati** dan **duplikasi besar**.

### Severity

| Level | Count | Contoh |
|---|---|---|
| 🔴 Critical | 2 | triggerScrapeAction 401, duplikasi ekstraktor |
| 🟡 Major | 4 | log order inconsistent, scrapeSingleUrl hardcode, shared.ts tanpa limit, config disimpan tapi tidak dipakai |
| 🟢 Minor | 3 | Dead code, cronSchedule column, auto-approval tab tidak relevan |

---

## 2. Bugs Kritis

### 🔴 Bug #1: `triggerScrapeAction()` selalu 401

**Lokasi:**
- `src/actions/admin-scraping.ts:261` — fetch ke API tanpa auth header
- `src/app/api/cron/scrape/route.ts:132` — API cek `Authorization: Bearer ${CRON_SECRET}`

**Akar masalah:**
```typescript
// admin-scraping.ts — fetch TANPA header Authorization
const res = await fetch(`${SITE.URL}/api/cron/scrape`, {
  method: 'GET',
  cache: 'no-store'
});

// route.ts — tapi API mewajibkan
if (authHeader !== `Bearer ${CRON_SECRET}`) {
  return new Response('Unauthorized', { status: 401 });
}
```

**Dampak:** Tombol "Test Scrape" di halaman Sources selalu gagal. Seluruh fitur test dari UI tidak bisa dipakai.

**Perbaikan:**
- Opsi A: Hapus auth di route.ts untuk request dari admin session (validasi via `auth()`)
- Opsi B: Kirim `Authorization` header dari action
- Opsi C (rekomendasi): **Hapus rute `/api/cron/scrape`** — karena sistem manual-only tidak butuh cron, dan `scrapeSingleUrl` sudah mencakup kebutuhan scraping

---

### 🔴 Bug #2: Duplikasi ekstraktor data

`scrapeSingleUrl` (`admin-scraping.ts:320-453`) dan `scrapeDetailPage` (`route.ts:15-127`) memiliki **≥95% kode identik**:

| Komponen | `scrapeSingleUrl` | `scrapeDetailPage` |
|---|---|---|
| Phone regex | `(?:\+62\|62\|0)8[1-9]...` ✅ | Sama persis ✅ |
| Contact name | Heuristic dari phone line ✅ | Sama persis ✅ |
| Registration link | Google forms, bit.ly, zfrmz ✅ | Sama persis ✅ |
| Price guessing | `HTM\|biaya\|bayar` + `Rp` regex ✅ | Sama persis ✅ |
| Quota regex | `kuota\|kapasitas\|limit` ✅ | Sama persis ✅ |
| HTML sanitasi | Sama ✅ | Sama persis ✅ |

**Perbaikan:** Ekstrak ke fungsi shared `extractDetailsFromHtml(html: string)` di satu file.

---

## 3. Anomali Arsitektur

### 🟡 Anomaly #1: Log order inconsistent

`admin-scraping.ts:252`:
```typescript
orderBy(logScraping.mulaiPada) // ascending — OLDEST first
```

`shared.ts:9`:
```typescript
orderBy(desc(logScraping.mulaiPada)) // descending — NEWEST first
```

UI (ScrapingClient) fetch dari `shared.ts`, jadi data tab log tampil benar. Tombol "Refresh Logs" manggil `getLogScraping()` yang urut ascending — **log terbaru muncul di bawah**.

**Perbaikan:** Konsistenkan ke `desc(logScraping.mulaiPada)`.

---

### 🟡 Anomaly #2: `scrapeSingleUrl` hardcode ke EventKampus

```typescript
// admin-scraping.ts:349
if (urlBanner && urlBanner.startsWith('/')) {
  urlBanner = 'https://eventkampus.com' + urlBanner; // hardcode domain
}

// Selector spesifik
const rawJudul = $('h1, .article-title, .title-event').first().text().trim()
const articleContent = $('.article-content, .event-content, .description');
```

Scraping hanya akurat untuk URL dari eventkampus.com. Domain lain → `judul` ambil `<title>` doang (fallback), `deskripsi` ambil `$('body').text()`.

**Perbaikan:** Tambah fallback selector generic: meta OG tags, JSON-LD, schema.org structured data.

---

### 🟡 Anomaly #3: `shared.ts` query tanpa limit

```typescript
// shared.ts
db.select().from(rawScrapedData) // ← FETCH ALL, no limit
```

Bisa ribuan baris. Pagination dilakukan di client (inefisien untuk data besar).

**Perbaikan:** `limit(50)` atau `limit(100)` + server-side pagination.

---

### 🟡 Anomaly #4: Config sources disimpan tapi tidak dipakai eksekusi

`scrapingSources` table menyimpan:
- `scraperType` (cheerio / playwright)
- `maxResultsPerRun`
- `rateLimitDelayMs`
- `maxConcurrentRequests`
- `isActive`
- `cronSchedule`

Tapi **tidak ada kode yang membaca konfigurasi ini saat eksekusi**. `triggerScrapeAction()` hanya panggil `/api/cron/scrape` yang pake `SCRAPER.DEFAULT_URL` hardcode. Source config murni "paper configuration".

---

### 🟢 Anomaly #5: Dead code

| Fungsi | File | Status |
|---|---|---|
| `publishAllAutoApproved()` | `admin-scraping.ts:285` | Tidak dipanggil oleh UI mana pun |
| `getScrapedItemsByIds()` | `admin-scraping.ts:278` | Tidak dipanggil oleh UI mana pun |
| `cronSchedule` column | `schema.ts:291` | Tidak dibaca kode mana pun |

---

## 4. Rekomendasi — Manual-Only Admin Scraping

Karena wajib **manual untuk admin**, sistem auto-scrape (cron, bulk, auto-approval otomatis) tidak relevan. Ini roadmap perbaikan:

### 🔥 Phase 1: Fix Critical Bugs (Hari 1-2)

| # | Perbaikan | File |
|---|---|---|
| 1 | Merge duplikasi ekstraktor ke fungsi shared `extractEventDetails(html)` | `admin-scraping.ts`, `route.ts` |
| 2 | Fix auth: rute API cron pakai session, bukan CRON_SECRET | `route.ts` |
| 3 | Konsistenkan `getLogScraping` ke descending | `admin-scraping.ts` |
| 4 | `shared.ts` tambah `limit(50)` | `shared.ts` |
| 5 | Hapus/matikan `publishAllAutoApproved`, `getScrapedItemsByIds` | `admin-scraping.ts` |

### 💡 Phase 2: Manual-Scrape UX (Hari 3-5)

| # | Fitur | Alasan |
|---|---|---|
| A | Multi-website: tambah fallback selector generic (meta OG, JSON-LD, schema.org) | Admin bisa scrape dari any domain |
| B | Preview card inline (bukan modal full) — langsung lihat extracted fields | UX lebih cepat |
| C | History log untuk setiap `scrapeSingleUrl` — simpan ke `logScraping` | Admin bisa lihat riwayat manual scrape |
| D | Batch paste URL (newline-separated) — scrape 1 per 1 | Kalau perlu >1 event |

### 🗑️ Phase 3: Cleanup (Hari 6)

| # | Hapus | Alasan |
|---|---|---|
| A | `publishAllAutoApproved()`, `getScrapedItemsByIds()` | Tidak dipakai |
| B | Kolom `cronSchedule` dari `scrapingSources` | Dead column |
| C | Tab "Auto-Approval Rules" (opsional — jika tidak ada rencana auto-publish) | Tidak relevan untuk manual flow |
| D | `/api/cron/scrape` route (jika sudah migrate ke session auth) | Tidak butuh cron |

---

## 5. Ringkasan File yang Terkena

| File | Baris | Masalah | Fix |
|---|---|---|---|
| `src/actions/admin-scraping.ts` | 257-276 | `triggerScrapeAction` tanpa auth header | Ganti auth method |
| `src/actions/admin-scraping.ts` | 285-311 | `publishAllAutoApproved` dead code | Hapus |
| `src/actions/admin-scraping.ts` | 278-283 | `getScrapedItemsByIds` dead code | Hapus |
| `src/actions/admin-scraping.ts` | 252-255 | `getLogScraping` ascending | Ganti ke `desc` |
| `src/actions/admin-scraping.ts` | 320-453 | `scrapeSingleUrl` duplikasi ekstraktor | Merge ke shared |
| `src/actions/admin-scraping.ts` | 349-351 | Banner URL hardcode eventkampus | Generic |
| `src/actions/admin-scraping.ts` | 345, 353 | Selector DOM spesifik eventkampus | Fallback generic |
| `src/app/api/cron/scrape/route.ts` | 129-325 | Auth via CRON_SECRET + duplikasi ekstraktor | Migrate ke session + shared fn |
| `src/app/(admin)/admin/scraping/shared.ts` | 8 | Query tanpa limit | `limit(50)` |
| `src/db/schema.ts` | 291 | `cronSchedule` column | Hapus (migration baru) |

---

## 6. Status Akhir Target

Setelah implementasi:

- ✅ Admin paste **any URL** → sistem ekstrak otomatis
- ✅ Tidak ada auto-scrape / cron — murni manual
- ✅ Tombol "Test Scrape" bekerja
- ✅ Log scraping konsisten (terbaru di atas)
- ✅ Data tab tidak overload (ada limit)
- ✅ Source config bisa dipakai untuk eksekusi
- ✅ Tidak ada kode mati / duplikasi

---

**Estimasi:** 3-5 hari kerja  
**Prioritas:** 🔴 Critical — bug yang bikin fitur tidak berfungsi harus diperbaiki sebelum nambah fitur baru.
