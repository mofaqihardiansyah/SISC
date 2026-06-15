# Rancangan Fase Pembuatan Fitur Web Scraping

Dokumen ini berisi tahapan (fase) pengembangan fitur web scraping skala produksi untuk agregasi data event, seminar, dan konferensi.

## Arsitektur & Tech Stack
- **Scraper Engine**: Python (Playwright + BeautifulSoup) atau Node.js (Playwright + Cheerio)
- **Backend & Queue**: Node.js (NestJS/Express) + Redis (BullMQ) atau Python (FastAPI + Celery)
- **Database**: PostgreSQL (menggunakan fitur tipe data JSONB untuk *raw data* dan relasional untuk data terstruktur) dengan Drizzle ORM
- **Frontend**: Next.js / React (Dashboard) + Socket.io (Real-time monitoring)

---

## Fase 1: Persiapan, Analisis, & Infrastruktur Dasar
**Fokus:** Menyiapkan fondasi data, infrastruktur, dan batasan masalah untuk MVP (Minimum Viable Product).
1. **Desain Skema Database (PostgreSQL + Drizzle):** 
   - Membuat tabel khusus `raw_scraped_data` dengan kolom `data JSONB` yang tidak memiliki relasi/Foreign Key ke tabel utama untuk menampung hasil mentah.
   - Membuat tabel `log_scraping` untuk memonitor riwayat (kapan mulai/selesai, status, error).
2. **Pemilihan Target MVP:** Menentukan 2-3 target awal dengan tingkat kesulitan rendah-menengah (contoh: Meetup, Loket.com, Dicoding Events) untuk *proof of concept*.
3. **Setup Infrastruktur:** Menjalankan Redis (untuk antrean queue) dan instance PostgreSQL yang sudah ada di *development environment* (via Docker).

## Fase 2: Pengembangan Core Backend & Queue System
**Fokus:** Membuat sistem antrean asynchronous yang tangguh agar server tidak terbebani saat proses scraping berjalan.
1. **Setup Message Broker:** Mengimplementasikan BullMQ (Node.js) atau Celery (Python) dengan Redis.
2. **Pembuatan Worker Node:** Mengembangkan *background worker* yang akan mendengarkan instruksi (*job*) dari antrean di luar main thread.
3. **Strategi Sinkronisasi (Throttling/Batching):** Membuat fungsi/antrean terpisah untuk memindahkan data dari tabel `raw_scraped_data` ke tabel utama `event` secara bertahap (misal 50 baris per menit) agar performa website (read/write user) tidak terganggu (*bottleneck*).
4. **API Endpoints:**
   - `POST /api/scrape/start`: Memicu/menjadwalkan task scraping baru.
   - `GET /api/scrape/status/:id`: Mengecek status dari job scraping tertentu.
   - `GET /api/events/raw`: Mengambil data mentah (JSONB) hasil scraping.

## Fase 3: Pengembangan Script Scraper (Scraping Engine)
**Fokus:** Mengeksekusi ekstraksi data dari website target secara efisien dan aman.
1. **Analisis Network (Reverse Engineering):** Memeriksa *Hidden API* dari target melalui Network tab (XHR/Fetch) untuk mengambil data JSON mentah tanpa harus parsing HTML UI (jika memungkinkan).
2. **Scripting (HTML Parsing / Headless Browser):** Menulis script dengan Playwright/BeautifulSoup untuk mengekstrak data dari target.
3. **Pipeline Pembersihan Data:** Membuat fungsi standarisasi (cleaning) untuk merapikan JSON yang didapat (misal: standarisasi format tanggal, pembersihan tag HTML pada deskripsi).
4. **Implementasi Anti-Blocking Dasar:** Menerapkan *rate-limiting*, *random delay*, dan *User-Agent rotation* untuk mencegah IP diblokir.

## Fase 4: Pengembangan Frontend Dashboard (Control Panel)
**Fokus:** Memberikan antarmuka (UI) bagi pengguna/admin untuk mengontrol dan melihat data scraping.
1. **UI Control Panel:** Form untuk memicu proses scraping (pilih target, filter lokasi, dll).
2. **Real-time Monitoring:** Integrasi Socket.io / WebSockets untuk memberikan indikator status visual (Pending, Extracting, Saving, Success, Failed) dengan *progress bar*.
3. **Data Visualization:** Tabel interaktif (sorting, filtering, pagination) untuk menampilkan daftar event dari `raw_scraped_data` dan tombol untuk "Publish" (memasukkannya ke tabel `event`).
4. **Fitur Export:** Tombol untuk mengunduh hasil data ke dalam format CSV, Excel, atau JSON.

## Fase 5: Testing, Optimasi, & Deployment
**Fokus:** Memastikan fitur dapat berjalan di *production* tanpa mengganggu performa layanan utama.
1. **Error Handling & Retry Mechanism:** Mengimplementasikan *auto-retry* jika koneksi scraping gagal atau *timeout*, dan penyimpanan log error.
2. **Advanced Anti-Bot (Opsional):** Integrasi layanan Proxy Premium (Residential IP) atau API Scraper (ZenRows/ScrapingBee) jika target utama memiliki proteksi level tinggi.
3. **Load Testing:** Memantau resource CPU/RAM dan beban Database (Write-Locks) saat menjalankan worker secara bersamaan.
4. **Deployment:** Pemisahan *resource* / container (Docker) antara Web Server, Worker Scraper, Database, dan Redis di server production (misal: AWS/GCP/VPS).
5. **Penjadwalan (Cron Job):** Mengatur *scheduler* agar scraper berjalan otomatis secara berkala di luar jam sibuk / *low-traffic* (misal: setiap hari jam 2 pagi) agar beban *batch-insert* database tidak mengganggu user.