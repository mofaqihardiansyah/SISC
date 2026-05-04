## INI IMPLEMENTASI PLAN SCRAPPING BARU DENGAN MENGGUNAKAN TEKNOLOGI BARU DAN MENGGANTI CHEERIO

# 🚀 Scraping Engine Implementation Plan: Seminar & Conference System

Dokumen ini menjelaskan strategi teknis untuk mengintegrasikan fitur scraping ke dalam projek Next.js menggunakan _stack_ yang 100% gratis namun memiliki kapabilitas tingkat industri.

---

## 🏗️ 1. The Technology Stack (Full Free)

| Komponen               | Teknologi                 | Alasan                                                                                               |
| :--------------------- | :------------------------ | :--------------------------------------------------------------------------------------------------- |
| **Scraping Framework** | **Crawlee**               | Framework scraping Node.js nomor satu. Mengatur antrean URL dan _retries_ secara otomatis.           |
| **Automation Engine**  | **Playwright**            | Menjalankan _headless browser_ untuk menembus website seminar yang berbasis JavaScript (SPA).        |
| **Stealth Engine**     | **Fingerprint-Generator** | Bawaan Crawlee untuk memalsukan identitas browser agar tidak terdeteksi sebagai bot.                 |
| **Background Job**     | **Inngest**               | Mengelola antrean scraping di luar _request-response cycle_ Next.js (Gratis untuk penggunaan wajar). |
| **Database/ORM**       | **PostgreSQL + Drizzle**  | Sinkronisasi data hasil scraping langsung ke skema database utama kamu.                              |

---

## 🔄 2. Cara Kerja Sistem (Workflow)

1.  **Triggering:** Next.js (lewat Admin Dashboard atau Cron Job) mengirim perintah scraping ke **Inngest**.
2.  **Orchestration:** **Crawlee** mengambil alih. Ia mengecek daftar URL yang harus di-scrape dan memasukkannya ke dalam `RequestQueue`.
3.  **Human Emulation:** **Playwright** membuka browser secara _headless_ (di belakang layar). Ia menggunakan _fingerprint_ acak (misal: pura-pura jadi Chrome di MacOS atau Edge di Windows).
4.  **Data Extraction:** Skrip masuk ke elemen HTML web target (misal: cari tag `<h1>` buat judul, `.date` buat waktu).
5.  **Data Validation:** Data dicek apakah sudah ada di **PostgreSQL**. Jika belum, **Drizzle ORM** akan melakukan `insert` data seminar baru.
6.  **Auto-Scaling:** Crawlee akan memantau penggunaan RAM laptop/server. Jika RAM hampir penuh (karena spek 8GB), ia akan memperlambat proses secara otomatis agar sistem tidak _crash_.

---

## 🛠️ 3. Langkah-Langkah Implementasi

### Fase 1: Setup Environment

Install dependencies utama di root projek Next.js kamu:

```bash
npm install crawlee playwright inngest drizzle-orm
npx playwright install chromium
```

### Fase 2: Konfigurasi Crawler (Crawler Engine)

Buat file `lib/scraper/engine.ts`. Gunakan `maxConcurrency` rendah (misal: 2 atau 3) agar laptop 8GB kamu tetap stabil.

```typescript
import { PlaywrightCrawler } from "crawlee";

export const seminarCrawler = new PlaywrightCrawler({
  maxConcurrency: 2, // Biar RAM 8GB gak jebol
  browserPoolOptions: {
    useFingerprints: true, // Biar gak ketahuan bot
  },
  async requestHandler({ page, request, log }) {
    log.info(`Processing ${request.url}...`);

    // Contoh scraping data seminar
    const results = await page.evaluate(() => {
      return {
        title: document.querySelector("h1")?.innerText,
        location: document.querySelector(".venue")?.innerText,
        date: document.querySelector(".date")?.innerText,
      };
    });

    // Simpan ke DB pakai Drizzle di sini
    // await db.insert(seminars).values(results);
  },
});
```

### Fase 3: Integrasi Background Job (Inngest)

Agar proses scraping tidak membuat web kamu _loading_ selamanya, jalankan sebagai fungsi background di `pages/api/inngest.ts`.
contoh:

```typescript
export const scrapeTask = inngest.createFunction(
  { id: "run-seminar-scrape" },
  { event: "app/scrape.start" },
  async ({ event, step }) => {
    await step.run("execute-crawlee", async () => {
      return await seminarCrawler.run(["https://target-seminar.com"]);
    });
  },
);
```

---

## ⚠️ 4. Tips Agar Tetap "Gratis" & Aman

- **Hindari Proxy Berbayar:** Untuk skala awal, manfaatkan fitur `useFingerprints` dari Crawlee. Ini sudah cukup untuk menembus proteksi dasar.
- **Sequential Scraping:** Jangan paksa buka 10 tab sekaligus. Gunakan antrean (Queue) agar prosesnya satu per satu namun pasti selesai.
- **Respect Robots.txt:** Selalu cek apakah website target mengizinkan scraping untuk menghindari masalah legal.

---

## 📅 5. Timeline Eksekusi

- **Quest quest ke 3:** Instalasi library dan testing satu URL target sederhana.
- **Quest quest ke 4:** Integrasi dengan Drizzle ORM untuk simpan hasil ke PostgreSQL.
- **Quest quest ke 5:** Setup Inngest untuk otomasi (misal: scrape ulang setiap jam 12 malam).
