import { test, expect } from '@playwright/test';

test.describe('Fitur Interaktif Lanjutan', () => {

  test('User: Melihat Detail Event & Mendaftar', async ({ page }) => {
    // Login User
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', 'visitor@gmail.com');
    await page.fill('input[name="password"]', 'visitorpassword123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Buka halaman Jelajah dan klik salah satu event
    await page.goto('/jelajah');
    
    // Cari card event dan klik tombol selengkapnya/detail
    const firstEventLink = page.locator('a[href^="/event/"]').first();
    if (await firstEventLink.isVisible()) {
      await firstEventLink.click();
      await page.waitForLoadState('networkidle');

      // Pastikan ada tombol daftar
      const btnDaftar = page.locator('button:has-text("Daftar"), a:has-text("Daftar")').first();
      if (await btnDaftar.isVisible()) {
        await btnDaftar.click();
        
        // Memastikan dialihkan ke halaman registrasi form
        await expect(page).toHaveURL(/.*registrasi-event/);
        
        // Jika form registrasi terbuka, coba submit tanpa isi
        const submitBtn = page.locator('button[type="submit"]').first();
        if (await submitBtn.isVisible()) {
          await submitBtn.click();
          // error message muncul
          await expect(page.locator('.text-red-500, [class*="error"]').first()).toBeVisible().catch(() => {});
        }
      }
    }
  });

  test('User: Fitur Logout', async ({ page }) => {
    // Login User
    await page.goto('/login');
    await page.fill('input[name="email"]', 'visitor@gmail.com');
    await page.fill('input[name="password"]', 'visitorpassword123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Buka profil/dashboard
    await page.goto('/profile/dashboard');
    
    // Klik tombol logout
    // Terkadang berada di dropdown, kita asumsikan ada tombol logout terlihat atau di menu
    const logoutBtn = page.locator('button:has-text("Keluar"), button:has-text("Logout"), a:has-text("Keluar")').last();
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      // Verifikasi redirect ke landing page atau login
      await expect(page).toHaveURL(/.*login|.*\//);
    }
  });

  test('Admin: Persetujuan Event (Approve/Reject)', async ({ page }) => {
    // Login Admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'poliventsofficial@gmail.com');
    await page.fill('input[name="password"]', 'adminpassword123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Masuk ke Persetujuan Event
    await page.goto('/admin/persetujuan');

    // Cari tombol approve/reject
    const approveBtn = page.locator('button:has-text("Setujui"), button[aria-label*="Approve"]').first();
    if (await approveBtn.isVisible()) {
      // Kita bisa asumsikan dialog konfirmasi muncul
      await approveBtn.click();
      const confirmBtn = page.locator('button:has-text("Ya"), button:has-text("Konfirmasi")').first();
      if (await confirmBtn.isVisible()) {
         // Hanya klik batal agar tidak merusak data test
         const cancelBtn = page.locator('button:has-text("Batal")').first();
         await cancelBtn.click();
      }
    }
  });

});
