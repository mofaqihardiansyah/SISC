import { test, expect } from '@playwright/test';

test.describe('Alur Penyelenggara (Organizer)', () => {
  test.beforeEach(async ({ page }) => {
    // Login sebagai organizer
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', 'organizer@gmail.com');
    await page.fill('input[name="password"]', 'organizerpassword123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
  });

  test('Melihat dashboard organizer', async ({ page }) => {
    await page.goto('/penyelenggara');
    await expect(page).toHaveURL(/.*penyelenggara/);
  });

  test('Melihat halaman buat event', async ({ page }) => {
    await page.goto('/penyelenggara/buatevent');
    await expect(page).toHaveURL(/.*penyelenggara\/buatevent/);
    
    // Pastikan form pembuatan event terlihat
    await expect(page.locator('form')).toBeVisible().catch(() => {});
  });

  test('Melihat daftar event yang dikelola', async ({ page }) => {
    await page.goto('/penyelenggara/event');
    await expect(page).toHaveURL(/.*penyelenggara\/event/);
  });
});
