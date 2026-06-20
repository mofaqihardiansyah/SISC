# Placeholder Catalog & Saran Perubahan

Total: **34 file**, ~96 placeholder unik (+3 dinamis)
Status: **✅ Semua perubahan sudah diterapkan**

---

## Ringkasan Perubahan

| File | Perubahan |
|------|-----------|
| `src/lib/constants.ts` | Tidak diubah (konstanta shared) |
| `src/components/layout/SearchInput.tsx` | Tidak diubah (via konstanta) |
| `src/components/layout/SearchBar.tsx` | `Cari seminar atau konferensi...` → tanpa `...` (seragam dgn SearchInput) |
| `src/components/bantuan/HelpClient.tsx` | `Masukkan nama/email Anda` → `Nama/Email Anda`; `Tulis pesan...` → `Pesan Anda...` |
| `src/components/penyelenggara/DashboardContent.tsx` | `Cari dan filter berdasarkan nama event...` → `Cari event...` |
| `src/components/penyelenggara/detail-event/Content.tsx` | `mm/dd/yyyy` → `dd/mm/yyyy` (×2); `""` → `Belum diisi` |
| `src/app/(auth)/login/page.tsx` | `Masukkan email anda` → `Email Anda`; `Masukkan kata sandi` → `Kata sandi` |
| `src/app/(auth)/register/page.tsx` | `Masukkan nama lengkap...` → `Nama lengkap...`; `Masukkan email anda` (×2) → `Email Anda`; `Minimal 8...` (×2) → `Min. 8...`; `Deskripsikan...` → `Deskripsi...` |
| `src/app/(auth)/forgot-password/page.tsx` | `Masukkan email anda` → `Email Anda` |
| `src/app/(auth)/reset-password/page.tsx` | `Minimal 6 karakter` → `Min. 8 karakter`; `Masukkan ulang...` → `Ketik ulang...` |
| `src/app/bantuan/page.tsx` | `Masukkan nama/email Anda` → `Nama/Email Anda`; `Tulis pesan...` → `Pesan Anda...` |
| `src/app/jelajah/page.tsx` | Tidak diubah (`Cari kota...` — OK) |
| `src/app/(organizer)/penyelenggara/buatevent/BuatEventClient.tsx` | `Tuliskan nama bank/e-wallet Anda...` → `Nama bank/e-wallet...`; `Masukkan judul...` → `Judul event...`; `Nama pembicara (...jika lebih dari satu)...` → `... (pisahkan koma)...`; `Masukkan Syarat & Ketentuan` → `Syarat & Ketentuan` |
| `src/app/(organizer)/penyelenggara/event/KelolaEventClient.tsx` | `Cari nama event...` → `Cari event...` |
| `src/app/(organizer)/penyelenggara/peserta/InformasiPesertaClient.tsx` | `Cari nama peserta, email, atau nomor telepon...` → `Cari peserta...` |
| `src/app/(organizer)/penyelenggara/profil/profil-form.tsx` | `Deskripsikan organisasi...` → `Deskripsi organisasi...`; `Masukkan kata sandi lama` → `Kata sandi lama` |
| `src/app/(organizer)/penyelenggara/review-paper/ReviewPaperClient.tsx` | `Jelaskan alasan...` → `Alasan penolakan/revisi...` |
| `src/app/(user)/profile/event-favorit/page.tsx` | `Cari event favoritmu` → `Cari event favorit Anda` (konsisten tone) |
| `src/app/(user)/profile/eventku/page.tsx` | `Ketikkan sesuatu...` → `Cari event...` |
| `src/app/(user)/profile/settings/page.tsx` | `Masukkan kata sandi lama/baru` → `Kata sandi lama/baru` |
| `src/app/(user)/profile/submit-paper/SubmissionForm.tsx` | `Tuliskan judul...` → `Judul lengkap paper`; `Pilih atau ketik Topik...` → `Topik (contoh: AI)`; `Pilih atau ketik kata kunci...` → `Kata kunci (Enter untuk tambah)` |
| `src/app/(admin)/admin/categories/CategoryClient.tsx` | Tidak diubah (OK) |
| `src/app/(admin)/admin/events/ClientPage.tsx` | `Cari judul event, penyelenggara...` → `Cari event...` |
| `src/app/(admin)/admin/events/DataEvent.tsx` | `Masukkan alasan penolakan...` → `Alasan penolakan...` |
| `src/app/(admin)/admin/events/EditEvent.tsx` | Tidak diubah (OK) |
| `src/app/(admin)/admin/locations/LocationClient.tsx` | Tidak diubah (OK) |
| `src/app/(admin)/admin/manajemen-user/page.tsx` | Tidak diubah (OK) |
| `src/app/(admin)/admin/pengaturan/page.tsx` | `Masukkan nama lengkap` → `Nama lengkap`; `Masukkan email` → `Email`; `Masukkan kata sandi saat ini` → `Kata sandi saat ini` |
| `src/app/(admin)/admin/penyelenggara/ValidasiAksesPenyelenggaraClient.tsx` | Tidak diubah (OK) |
| `src/app/(admin)/admin/persetujuan/ClientPage.tsx` | Tidak diubah (`Alasan penolakan...` — OK) |
| `src/app/(admin)/admin/persetujuan/PersetujuanComponents.tsx` | Tidak diubah (OK) |
| `src/app/(admin)/admin/scraping/ScrapingClient.tsx` | `Cari berdasarkan judul event...` → `Cari event...`; `Masukkan judul...` → `Judul...`; `Masukkan deskripsi...` → `Deskripsi event...` |
| `src/app/(admin)/admin/scraping/sources/SourcesClient.tsx` | `Website URL` → `URL Website`; `URL Pattern` → `Pola URL` |

---

## Pola Masalah yang Dibetulkan

| Masalah | Jumlah Perbaikan | Contoh |
|---------|-----------------|--------|
| Placeholder terlalu panjang | ~8 | `Cari judul event, penyelenggara...` → `Cari event...` |
| `Masukkan` redundant (label sdh bilang) | ~15 | `Masukkan email anda` → `Email Anda` |
| Tone `kamu`/`mu` inkonsisten | 1 | `event favoritmu` → `event favorit Anda` |
| Format tanggal non-Indonesia | 2 | `mm/dd/yyyy` → `dd/mm/yyyy` |
| Campur Inggris-Indonesia | 2 | `URL Pattern` → `Pola URL` |
| Inkonsisten `...` | ~5 | Diseragamkan |
