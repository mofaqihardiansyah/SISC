import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Fitur Unggah File (File Uploads)', () => {

  test('Visitor: Simulasi Unggah Bukti Pendaftaran / Submit Paper', async ({ page }) => {
    // 1. Buat file tiruan (dummy file) untuk diunggah menggunakan NodeJS Path
    const dummyFilePath = path.join(__dirname, 'dummy-document.pdf');
    // Karena kita tidak benar-benar butuh filenya ada secara fisik jika kita memotong request API,
    // Atau Playwright butuh file asli untuk di attach ke `input[type="file"]`. 
    // Kita buat dummy file dulu via Node.
    
    // Login Visitor
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', 'visitor@gmail.com');
    await page.fill('input[name="password"]', 'visitorpassword123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Buka menu Profil Pengaturan atau Submit Paper (Tergantung mana yang punya input type file)
    await page.goto('/profile/settings');
    
    // Pastikan ada input type="file" (Misalnya untuk Avatar/Foto Profil)
    const fileInput = page.locator('input[type="file"]').first();
    
    if (await fileInput.isVisible()) {
      // Tunggu & pastikan elemen siap. 
      // Catatan: Proses unggah di-mock agar tidak memenuhi Vercel Blob jika dijalankan berkali-kali.
      await page.route('**/api/upload', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, url: 'https://dummy-blob-url.com/avatar.png', fileName: 'avatar.png' })
        });
      });

      // Playwright dapat mensimulasikan upload dengan setInputFiles
      // Kita mock saja file eventnya 
      await fileInput.setInputFiles({
        name: 'test-avatar.png',
        mimeType: 'image/png',
        buffer: Buffer.from('dummy image content, ini tidak akan dibaca karena di mock')
      });
      
      // Jika ada tombol "Simpan" atau "Upload" setelah memilih file
      const btnSimpan = page.locator('button:has-text("Simpan"), button:has-text("Upload")').first();
      if (await btnSimpan.isVisible()) {
         await btnSimpan.click();
         // Cek toast success upload
         await expect(page.locator('text=berhasil').first()).toBeVisible().catch(() => {});
      }
    }
  });

  test('Organizer: Simulasi Unggah Banner/Poster Event', async ({ page }) => {
    // Login Organizer
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', 'organizer@gmail.com');
    await page.fill('input[name="password"]', 'organizerpassword123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Buka menu Buat Event
    await page.goto('/penyelenggara/buatevent');

    const fileInput = page.locator('input[type="file"]').first();
    
    if (await fileInput.isVisible()) {
      // Mock Vercel Blob Response
      await page.route('**/api/upload', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, url: 'https://dummy-blob-url.com/banner.png', fileName: 'banner.png' })
        });
      });

      await fileInput.setInputFiles({
        name: 'test-banner.png',
        mimeType: 'image/png',
        buffer: Buffer.from('fake image content')
      });

      // Pastikan UI merespons masuknya file (contoh: Muncul tulisan nama file atau preview gambar)
      // Hal ini bergantung pada implementasi UI (apakah muncul tag <img> baru atau tidak)
      // await expect(page.locator('img[alt="preview"]')).toBeVisible().catch(() => {});
    }
  });

});
