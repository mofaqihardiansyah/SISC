# Setup Pengujian Otomatis Menggunakan Playwright

Dokumen ini berisi panduan untuk menyiapkan dan menjalankan pengujian End-to-End (E2E) secara otomatis pada proyek web ini menggunakan alat **Playwright** yang dikembangkan oleh Microsoft. Playwright mendukung pengujian di Firefox, Chromium, dan WebKit secara bersamaan.

## 1. Instalasi Playwright

Untuk menginstal Playwright di dalam proyek Next.js ini, buka terminal baru di dalam *root directory* proyek (`d:\Documents\PBL smt 4\sisc`) dan jalankan perintah berikut:

```bash
npm init playwright@latest
```

Saat proses inisialisasi berjalan, Anda akan ditanya beberapa hal. Jawab seperti ini:
- **Do you want to use TypeScript or JavaScript?** `TypeScript`
- **Where to put your end-to-end tests?** `tests` (atau tekan Enter untuk default)
- **Add a GitHub Actions workflow?** `false` (bisa ditambahkan nanti)
- **Install Playwright browsers?** `true` (Tekan Enter, ini otomatis men-download Firefox, Chrome, dll)

---

## 2. Konfigurasi `playwright.config.ts`

Setelah instalasi, file `playwright.config.ts` akan terbuat secara otomatis. Ubah dan pastikan parameter berikut disesuaikan untuk server Next.js lokal:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: undefined,
  reporter: 'html', // Laporan hasil test dalam format HTML
  use: {
    baseURL: 'http://localhost:3000', // Server lokal Anda
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox', // Tes otomatis menggunakan Firefox
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  // Menyuruh playwright menjalankan Next.js secara otomatis sebelum dites (Opsi Tambahan)
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: true,
  // },
});
```

---

## 3. Membuat Skenario Tes (Contoh)

Buat file baru di dalam folder `tests` (misalnya `tests/auth.spec.ts`), dan gunakan kode berikut untuk melakukan tes login menggunakan akun Visitor:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Autentikasi Aplikasi', () => {
  test('Bisa Login sebagai Visitor', async ({ page }) => {
    // 1. Kunjungi halaman utama (atau halaman login)
    await page.goto('/login'); // Ganti URL ini dengan path halaman login sebenarnya jika berbeda

    // 2. Isi Formulir Login
    await page.fill('input[name="email"]', 'visitor@gmail.com');
    await page.fill('input[name="password"]', 'visitorpassword123');

    // 3. Klik tombol Login
    await page.click('button[type="submit"]');

    // 4. Verifikasi bahwa halaman berpindah ke Dashboard
    // Misalnya, URL berubah menjadi /dashboard atau /user
    await expect(page).toHaveURL(/.*dashboard|.*user/);

    // 5. Cek apakah nama Visitor tampil di layar
    await expect(page.getByText('visitor@gmail.com')).toBeVisible();
  });
});
```

---

## 4. Cara Menjalankan Pengujian

Jika Next.js server sudah berjalan di terminal lain (`npm run dev`), Anda bisa mulai mengujinya secara otomatis menggunakan terminal baru:

1. **Jalankan semua skenario tes di balik layar (Headless Mode):**
   ```bash
   npx playwright test
   ```

2. **Jalankan tes sambil melihat Browser (UI Mode / Tampak Visual):**
   ```bash
   npx playwright test --ui
   ```
   *Mode ini akan membuka UI Playwright. Anda bisa mengeklik tombol Play di sana, dan Anda akan melihat secara visual peramban Firefox atau Chrome otomatis terbuka, mengetik, mengeklik tombol, dan bernavigasi sesuai *script* yang ditulis.*

3. **Melihat Laporan (HTML Report):**
   Setelah proses selesai, Playwright akan membuat laporan indah berbasis web. Buka dengan perintah:
   ```bash
   npx playwright show-report
   ```
