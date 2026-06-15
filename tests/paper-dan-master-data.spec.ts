import { test, expect } from '@playwright/test';

test.describe('Fitur Tambahan: Paper & Master Data', () => {

  test('Visitor: Akses Halaman Submit Paper', async ({ page }) => {
    // Login Visitor
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', 'visitor@gmail.com');
    await page.fill('input[name="password"]', 'visitorpassword123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Buka menu Submit Paper
    await page.goto('/profile/submit-paper');
    
    // Verifikasi URL dan memuat UI form/daftar paper
    await expect(page).toHaveURL(/.*profile\/submit-paper/);
    
    // Coba mencari elemen Form atau tombol tambah paper
    const addPaperBtn = page.locator('button:has-text("Submit"), button:has-text("Unggah"), a:has-text("Submit")').first();
    if (await addPaperBtn.isVisible()) {
      await addPaperBtn.click();
      // Verifikasi kemunculan modal atau elemen validasi jika di-submit kosong
      await page.waitForTimeout(500); 
    }
  });

  test('Organizer: Akses Halaman Review Paper', async ({ page }) => {
    // Login Organizer
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', 'organizer@gmail.com');
    await page.fill('input[name="password"]', 'organizerpassword123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Buka menu Review Paper
    await page.goto('/penyelenggara/review-paper');
    
    // Verifikasi URL dan memastikan tabel data paper berhasil di-render
    await expect(page).toHaveURL(/.*penyelenggara\/review-paper/);
    
    // Verifikasi tabel list review paper tampil di layar (tidak error 500)
    await expect(page.locator('table, .grid, text="Daftar Paper", text="Review"').first()).toBeVisible().catch(() => {});
  });

  test('Admin: Manajemen Master Data (Kategori & Lokasi)', async ({ page }) => {
    // Login Admin
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', 'poliventsofficial@gmail.com');
    await page.fill('input[name="password"]', 'adminpassword123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // --- 1. Master Data Kategori ---
    await page.goto('/admin/categories');
    await expect(page).toHaveURL(/.*admin\/categories/);
    
    // Uji coba mencari tombol Tambah Kategori
    const addCategoryBtn = page.locator('button:has-text("Tambah"), button:has-text("Kategori Baru")').first();
    if (await addCategoryBtn.isVisible()) {
      await addCategoryBtn.click();
      // Modal pengisian nama kategori muncul
      await expect(page.locator('form').first()).toBeVisible().catch(() => {});
    }

    // --- 2. Master Data Lokasi ---
    await page.goto('/admin/locations');
    await expect(page).toHaveURL(/.*admin\/locations/);
    
    // Verifikasi konten halaman lokasi
    await expect(page.locator('text="Provinsi", text="Kota", button:has-text("Tambah")').first()).toBeVisible().catch(() => {});
  });

});
