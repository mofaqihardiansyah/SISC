# Blueprint & Roadmap: Fitur Web Scraping Produksi

Dokumen ini mendefinisikan arsitektur dan roadmap pengembangan fitur scraping skala produksi untuk agregasi data event (seminar & konferensi).

## Status Implementasi Saat Ini
- [x] **Infrastruktur Dasar**: PostgreSQL (drizzle), `raw_scraped_data`, `log_scraping`.
- [x] **Backend & Queue**: Menggunakan **Inngest** (asynchronous).
- [x] **Scraper Engine**: Playwright + Cheerio (v1) dengan Zod Validation.
- [x] **Frontend Control Panel**: CRUD Data mentah, Publishing ke event table.

## Gap Analysis (Apa yang Kurang?)

### 1. Backend & Pipeline
- **Pembersihan Data (Cleaning Pipeline)**: Data dari web sering kotor. Butuh fungsi untuk standarisasi format tanggal (`parseIndoDate`), pembersihan HTML (sanitize), dan normalisasi kategori/kota.
- **Deduplikasi Cerdas**: Saat ini hanya cek `linkEksternal`. Perlu pengecekan berdasarkan *fuzzy matching* judul agar tidak ada duplikasi data dari sumber berbeda.
- **Log Scraping**: Sudah ada, tapi belum menyertakan detail error spesifik pada level item (hanya level request).

### 2. Frontend & UI
- **Data Sanitization Preview**: Admin seharusnya bisa mengedit data di tabel *scraping* sebelum di-publish. Saat ini admin hanya bisa klik "Publish".
- **Batch Processing**: Belum ada aksi *Bulk Publish* atau *Bulk Delete* di halaman scraping admin.
- **Monitoring Visual**: Admin perlu melihat riwayat `log_scraping` di UI agar tahu scraper sedang aktif atau gagal.

### 3. Fitur Lanjutan
- **Proxy Rotation**: Untuk target yang memblokir IP server.
- **Dynamic Content Support**: Jika target menggunakan React/Vue yang me-*render* data via JS, cheerio akan gagal total. Perlu *full headless browser* (Playwright) di semua proses.
- **Export**: Fitur export (CSV/Excel) belum ada.

---

## Roadmap Fase Mendatang (Update)

### Fase 1: Data Quality & Cleaning (Prioritas Tinggi)
1. **Cleaning Service**: Buat library `@/lib/scraper/cleaner.ts` untuk normalisasi judul, harga, dan format tanggal dari `tanggalMentah` ke `Date` object yang valid.
2. **Schema Update**: Update `raw_scraped_data` agar memiliki field `status` (`pending`, `processed`, `published`, `error`).

### Fase 2: Admin UX & Curation
1. **Interactive Preview**: Tambahkan modal edit di halaman Scraping agar admin bisa mengoreksi data (misal: menentukan `kategoriId` dan `kotaId`) sebelum publish.
2. **Bulk Actions**: Tambahkan checkbox di tabel Scraping untuk "Publish Terpilih" dan "Hapus Terpilih".
3. **Log View**: Tambahkan tab "Log Scraping" di halaman admin yang menampilkan isi tabel `log_scraping`.

### Fase 3: Hardening
1. **Proxy Service**: Integrasi dengan layanan *proxy rotation* jika proses mulai sering diblokir.
2. **Advanced Scraping**: Jika website target kompleks (dinamis), beralih dari cheerio ke full Playwright browser context untuk seluruh engine.
3. **Load Testing**: Monitor performa server saat scraping massal.
