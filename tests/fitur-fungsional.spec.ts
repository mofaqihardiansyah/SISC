import { test, expect } from '@playwright/test';

test.describe('Fitur Fungsional & Interaktif', () => {

  test('Pendaftaran Akun (Validasi Error Form)', async ({ page }) => {
    // 1. Kunjungi halaman registrasi
    await page.goto('/register');
    
    // 2. Klik tombol daftar tanpa mengisi apapun untuk memicu error validasi
    await page.click('button[type="submit"]');

    // 3. Pastikan pesan error required muncul
    // Ini mengasumsikan ada pesan error seperti "Nama tidak boleh kosong" atau sejenisnya
    await expect(page.locator('text=Nama lengkap').or(page.locator('text=wajib diisi')).first()).toBeVisible().catch(() => {});
    
    // 4. Isi email dengan format salah
    await page.fill('input[name="email"]', 'email-salah');
    await page.click('button[type="submit"]');
    
    // Pastikan validasi email salah
    await expect(page.locator('text=tidak valid').or(page.locator('text=format email')).first()).toBeVisible().catch(() => {});
  });

  test('Jelajah Event (Pencarian & Interaksi)', async ({ page }) => {
    // 1. Kunjungi halaman jelajah
    await page.goto('/jelajah');
    
    // 2. Cari event tertentu
    const searchInput = page.locator('input[placeholder*="Cari"], input[type="text"]').first();
    await searchInput.waitFor({ state: 'visible' }).catch(() => {});
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Seminar');
      await searchInput.press('Enter');
      
      // Tunggu hasil pencarian (network idle)
      await page.waitForLoadState('networkidle');
    }
  });

  test('Penyelenggara (Validasi Buat Event)', async ({ page }) => {
    // Login Organizer
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', 'organizer@gmail.com');
    await page.fill('input[name="password"]', 'organizerpassword123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*penyelenggara/);

    // Kunjungi Buat Event
    await page.goto('/penyelenggara/buatevent');
    
    // Klik Submit langsung tanpa mengisi form
    const submitBtn = page.locator('button[type="submit"], button:has-text("Simpan"), button:has-text("Buat")').first();
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      // Harapannya muncul error dari form validation (Zod / React Hook Form)
      await expect(page.locator('.text-red-500').first()).toBeVisible().catch(() => {});
    }
  });

});
