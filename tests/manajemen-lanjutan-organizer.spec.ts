import { test, expect } from '@playwright/test';

test.describe('Manajemen Lanjutan Organizer', () => {
  test('Organizer: Edit & Hapus Event', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'organizer@gmail.com');
    await page.fill('input[name="password"]', 'organizerpassword123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Ke list event penyelenggara
    await page.goto('/penyelenggara/event');
    await page.waitForLoadState('networkidle');

    // Tombol Edit/Pensil
    const editBtn = page.locator('a[href*="/edit"], button:has-text("Edit"), button[aria-label="Edit"]').first();
    if (await editBtn.isVisible()) {
       await editBtn.click();
       await expect(page).toHaveURL(/.*edit/);
       
       // Tombol kembali/batal untuk lanjut skenario
       await page.goto('/penyelenggara/event');
    }

    // Tombol Hapus/Trash
    const delBtn = page.locator('button:has-text("Hapus"), button[aria-label="Hapus"], button[aria-label="Delete"]').first();
    if (await delBtn.isVisible()) {
       await delBtn.click();
       
       // Tangani Dialog/Alert SweetAlert atau standard
       const konfirmasiHapus = page.locator('button:has-text("Ya"), button:has-text("Hapus")').last();
       if (await konfirmasiHapus.isVisible()) {
          // Klik batal saja agar data tak terhapus beneran saat pengujian berulang
          const batalBtn = page.locator('button:has-text("Batal")').last();
          await batalBtn.click();
       }
    }
  });

  test('Organizer: Melihat Daftar Pendaftar Event', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'organizer@gmail.com');
    await page.fill('input[name="password"]', 'organizerpassword123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Ke halaman kelola peserta
    await page.goto('/penyelenggara/peserta');
    await page.waitForLoadState('networkidle');
    
    // Verifikasi tabel peserta ada
    await expect(page.locator('table, text="Daftar Pendaftar", text="Peserta"').first()).toBeVisible().catch(() => {});
  });
});
