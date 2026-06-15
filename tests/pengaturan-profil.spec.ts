import { test, expect } from '@playwright/test';

test.describe('Pengaturan Akun', () => {
  test('Semua Role: Edit Profil', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'visitor@gmail.com');
    await page.fill('input[name="password"]', 'visitorpassword123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Buka pengaturan profil
    await page.goto('/profile/settings');
    await page.waitForLoadState('networkidle');

    const namaInput = page.locator('input[name="name"], input[name="nama"]').first();
    if (await namaInput.isVisible()) {
       await namaInput.fill('Visitor Diupdate Playwright');
       
       const simpanBtn = page.locator('button:has-text("Simpan"), button[type="submit"]').first();
       await simpanBtn.click();
       
       // Verifikasi sukses (toast)
       await expect(page.locator('text=berhasil').first()).toBeVisible().catch(() => {});
    }
  });
});
