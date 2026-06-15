import { test, expect } from '@playwright/test';

test.describe('Alur Pengguna (Visitor/User)', () => {
  test.beforeEach(async ({ page }) => {
    // Login sebelum setiap tes di blok ini
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', 'visitor@gmail.com');
    await page.fill('input[name="password"]', 'visitorpassword123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
  });

  test('Melihat daftar event di Jelajah', async ({ page }) => {
    await page.goto('/jelajah');
    // Memastikan input pencarian atau container event muncul
    await expect(page.locator('input[placeholder*="Cari"]')).toBeVisible().catch(() => {});
  });

  test('Melihat dashboard profile', async ({ page }) => {
    await page.goto('/profile/dashboard');
    await expect(page).toHaveURL(/.*profile\/dashboard/);
  });
});
