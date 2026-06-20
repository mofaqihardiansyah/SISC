# Blueprint & Roadmap: Fitur Web Scraping Produksi

Dokumen ini mendefinisikan arsitektur dan roadmap pengembangan fitur scraping skala produksi untuk agregasi data event (seminar & konferensi).

## Status Implementasi Saat Ini
- [x] **Infrastruktur Dasar**: PostgreSQL (drizzle), `raw_scraped_data`, `log_scraping`.
- [x] **Backend & Queue**: Menggunakan **Inngest** (asynchronous).
- [x] **Scraper Engine**: Playwright + Cheerio (v1) dengan Zod Validation.
- [x] **Frontend Control Panel**: CRUD Data mentah, Publishing ke event table.
- [x] **Pembersihan Data (Auto-Clean & Confidence Score)**: Normalisasi otomatis saat ingestion dengan penghitungan skor kepercayaan kualitas data (0-100).
- [x] **Pencegahan Duplikasi**: Validasi ketersediaan URL target sebelum merekam data baru untuk mencegah duplikasi event.
- [x] **Form Edit Interaktif**: Suntingan detail event secara langsung pada modal pratinjau sebelum diterbitkan.
- [x] **Aksi Masal (Bulk Actions)**: Terbitkan, bersihkan, dan hapus banyak data sekaligus secara masal.
- [x] **Sanitasi HTML & Auto-Retry**: Menghapus tag formatting kotor untuk keamanan XSS, serta melakukan percobaan ulang HTTP fetch jika koneksi putus sementara.

## Gap Analysis (Telah Diselesaikan)

Seluruh poin pada analisis kesenjangan (*gap analysis*) sebelumnya telah diimplementasikan sepenuhnya:
1. **Pembersihan Data**: Selesai lewat normalisasi otomatis saat data disimpan ([cleaner.ts](file:///d:/Documents/PBL_smt_4/sisc/src/lib/scraper/cleaner.ts)).
2. **Batch Processing & Log Monitoring**: Ditambahkan ke antarmuka pengguna admin ([ScrapingClient.tsx](file:///d:/Documents/PBL_smt_4/sisc/src/app/%28admin%29/admin/scraping/ScrapingClient.tsx)).
3. **Data Sanitization Preview**: Admin dapat mengoreksi data secara interaktif di modal sebelum diterbitkan.

---

## Roadmap Fase Mendatang (Update)

### Fase 1: Data Quality & Cleaning (Selesai ✅)
- [x] **Cleaning Service**: Implementasi `@/lib/scraper/cleaner.ts` untuk normalisasi judul, harga, dan format tanggal dari `tanggalMentah` ke `Date` object yang valid.
- [x] **Schema Update**: Menambahkan kolom `status` (`pending`, `processed`, `error`) pada tabel `raw_scraped_data`.

### Fase 2: Admin UX & Curation (Selesai ✅)
- [x] **Interactive Preview**: Modal form edit interaktif bagi admin untuk mengoreksi data sebelum klik terbitkan.
- [x] **Bulk Actions**: Tombol aksi masal untuk terbitkan, bersihkan, dan hapus baris terpilih.
- [x] **Log View**: Tab visual riwayat eksekusi scraping di halaman admin.
- [x] **Auto-Publish (Auto-Approved)**: Tombol sekali klik untuk menerbitkan seluruh event berkualitas tinggi (skor 100/100) secara otomatis.

### Fase 3: Hardening & Skalabilitas (Fokus Selanjutnya 🚀)
1. **Proxy Service / Rotate**: Integrasi dengan layanan *proxy rotation* jika proses mulai sering diblokir atau dibatasi rate limit oleh eventkampus.com.
2. **Advanced Scraping**: Beralih sepenuhnya ke Playwright headless browser cluster eksternal (misal: Browserless.io) jika Next.js dideploy ke Vercel agar engine Playwright tidak crash karena batasan *serverless constraints*.
3. **Load Testing**: Pantau utilitas memori server saat melakukan penarikan data dalam volume masal.
