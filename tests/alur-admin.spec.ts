import { test, expect } from '@playwright/test';

test.describe('Alur Admin', () => {
  test.beforeEach(async ({ page }) => {
    // Login sebagai admin
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', 'poliventsofficial@gmail.com');
    await page.fill('input[name="password"]', 'adminpassword123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
  });

  test('Melihat dashboard admin utama', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/.*admin\/dashboard/);
  });

  test('Mengakses manajemen user', async ({ page }) => {
    await page.goto('/admin/manajemen-user');
    await expect(page).toHaveURL(/.*admin\/manajemen-user/);
  });

  test('Mengakses manajemen event (approval)', async ({ page }) => {
    await page.goto('/admin/persetujuan');
    await expect(page).toHaveURL(/.*admin\/persetujuan/);
  });
});
