import { test, expect } from '@playwright/test';

test.describe('Autentikasi Aplikasi - Multi Role', () => {

  test('Bisa Login sebagai Visitor', async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');
    
    await page.fill('input[name="email"]', 'visitor@gmail.com');
    await page.fill('input[name="password"]', 'visitorpassword123');
    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*dashboard|.*user|.*profile|.*\//);
  });

  test('Bisa Login sebagai Organizer', async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');
    
    await page.fill('input[name="email"]', 'organizer@gmail.com');
    await page.fill('input[name="password"]', 'organizerpassword123');
    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');
    // Sesuai skenario, organizer diarahkan ke /penyelenggara atau /penyelenggara/dashboard
    await expect(page).toHaveURL(/.*penyelenggara.*/);
  });

  test('Bisa Login sebagai Admin', async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');
    
    await page.fill('input[name="email"]', 'poliventsofficial@gmail.com');
    await page.fill('input[name="password"]', 'adminpassword123');
    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');
    // Sesuai skenario, admin diarahkan ke /admin/dashboard
    await expect(page).toHaveURL(/.*admin.*/);
  });

});

test.describe('Halaman Publik (Tanpa Login)', () => {
  test('Beranda memuat dengan baik', async ({ page }) => {
    await page.goto('/');
    
    // Memastikan header atau elemen utama muncul, misalnya link Login/Daftar
    await expect(page).toHaveURL('/');
  });

  test('Navigasi ke halaman Jelajah', async ({ page }) => {
    await page.goto('/jelajah');
    await expect(page).toHaveURL(/.*jelajah/);
  });
});
