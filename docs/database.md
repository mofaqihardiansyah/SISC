# Database — SISC

Database menggunakan **PostgreSQL 16** via Docker dengan **Drizzle ORM** (v0.45.2).

---

## Koneksi

Definisi di `src/db/index.ts`:

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);
```

Config di `drizzle.config.ts`:

```typescript
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

---

## Enums (10)

| Enum | Values |
|------|--------|
| `event_status` | `draft`, `pending`, `published`, `rejected` |
| `jenis_event` | `seminar`, `conference` |
| `tipe_platform` | `online`, `offline`, `hybrid` |
| `tipe_harga` | `free`, `paid` — kolom nullable, `null` = tidak diketahui |
| `paper_status` | `review`, `accepted`, `rejected` |
| `user_role` | `admin`, `organizer`, `visitor` |
| `pendaftaran_status` | `terdaftar`, `menunggu_verifikasi`, `lunas`, `dibatalkan`, `hadir` |
| `jenis_kelamin` | `Laki-laki`, `Perempuan` |
| `tipe_pembayaran` | `bank_transfer`, `qris` |
| `log_scraping_status` | `pending`, `processing`, `success`, `failed` |

---

## Tabel (24)

### 1. `users`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | serial PK | |
| nama_lengkap | varchar(255) | |
| email | varchar(255) unique | |
| nomor_telepon | varchar(20) | |
| institusi | varchar(255) | |
| pekerjaan | varchar(255) | |
| password | varchar(255) | bcrypt hash |
| email_terverifikasi | timestamp | Null = belum verifikasi |
| tanggal_lahir | timestamp | |
| jenis_kelamin | enum | Laki-laki / Perempuan |
| role | enum | admin / organizer / visitor |
| disetujui | boolean | Approval status |
| diblokir | boolean | Suspended |
| terakhir_aktif_pada | timestamp | |
| url_avatar | varchar(512) | Default: `/uploads/avatars/fotodummy.jpg` |
| dibuat_pada | timestamp | default now |
| diperbarui_pada | timestamp | |
| dihapus_pada | timestamp | Soft delete |

### 2. `otp_codes`
OTP untuk verifikasi email. Field: `email`, `code` (6 digit), `kedaluwarsa_pada`, `dibuat_pada`.

### 3. `profil_penyelenggara`
Profil organizer. Field: `user_id` (unique FK → users), `nama_instansi`, `deskripsi_instansi`, `url_dokumen_legalitas`, `url_website`, `dibuat_pada`, `diperbarui_pada`.

### 4. `provinsi`
Field: `id`, `nama` (unique). Data awal: 38 provinsi Indonesia.

### 5. `kota`
Field: `id`, `provinsi_id` (FK → provinsi), `nama`. Unique index pada `(provinsi_id, nama)`.

### 6. `kategori`
Field: `id`, `nama`, `slug` (unique), `url_ikon`. Digunakan untuk kategorisasi event.

### 7. `tag`
Field: `id`, `nama` (unique). Tag untuk event.

### 8. `event_tag`
Relasi M:N antara event dan tag. Composite PK: (`event_id`, `tag_id`).

### 9. `event`
Tabel utama menyimpan seluruh data event:

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| organizer_id | FK → users | Pembuat event |
| kategori_id | FK → kategori | |
| kota_id | FK → kota | |
| judul | varchar(255) not null | |
| slug | varchar(255) unique | |
| deskripsi | text | |
| syarat_dan_ketentuan | text | |
| url_banner | varchar(512) | |
| penyelenggara | varchar(255) | Nama instansi penyelenggara |
| tanggal_mulai | timestamp not null | |
| tanggal_selesai | timestamp | |
| batas_registrasi | timestamp | |
| event_polines | boolean | Event dari Polines |
| jenis_event | enum | seminar / conference |
| tipe_platform | enum | online / offline / hybrid |
| tipe_harga | enum | free / paid |
| harga | integer | |
| detail_lokasi | text | |
| link_eksternal | varchar(512) | |
| kuota | integer | Batas kuota pendaftar |
| status | enum | draft / pending / published / rejected |
| hasil_scraping | boolean | Dari EventKampus |
| website_sumber | varchar(255) | |
| jumlah_tayangan | integer | View counter |
| alasan_penolakan | text | |
| dibuat_pada, diperbarui_pada, dihapus_pada | timestamp | Soft delete |

Index: `organizer_idx`, `kategori_idx`, `status_idx`.

### 10. `info_pembayaran`
Info pembayaran global (bukan per-event). Ditampilkan ke visitor saat bayar.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | serial PK | |
| tipe | enum | bank_transfer / qris |
| nama_bank | varchar(100) | Untuk bank |
| nomor_rekening | varchar(50) | Untuk bank |
| pemilik_rekening | varchar(255) | Untuk bank |
| url_gambar_qris | varchar(512) | Untuk QRIS |
| aktif | boolean | Enable/disable |
| dibuat_pada | timestamp | |
| diperbarui_pada | timestamp | |

### 11. `pembicara`
Data pembicara per event (1 event bisa >1 pembicara).

Field: `event_id` (FK → event, not null), `nama` (not null), `peran`, `url_foto`, `dibuat_pada`, `diperbarui_pada`.

### 12. `lampiran_event`
Lampiran file event. Field: `event_id` (FK), `url_file`, `tipe_file`, `urutan` (integer), `dibuat_pada`.

### 13. `log_admin`
Log aktivitas admin. Field: `admin_id` (FK → users), `event_id` (FK → event), `aksi`, `data_sebelumnya` (jsonb), `dibuat_pada`.

### 14. `favorit`
Favorit event oleh user. Composite PK: (`user_id`, `event_id`). Field: `dibuat_pada`.

### 15. `pendaftaran`
Mencakup registrasi + pembayaran (gabungan dari pendaftaran & transaksi lama).

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | serial PK | |
| event_id | FK → event | |
| user_id | FK → users | |
| kode_pendaftaran | varchar(50) unique | |
| status | enum | terdaftar / menunggu_verifikasi / lunas / dibatalkan / hadir |
| metode_pembayaran_id | FK → info_pembayaran | Nullable, metode bayar yang dipilih |
| bukti_pembayaran | text | URL file bukti transfer |
| total_harga | integer | |
| dibuat_pada | timestamp | |
| diperbarui_pada | timestamp | |
| dihapus_pada | timestamp | Soft delete |

### 16. `peserta`
Data peserta per pendaftaran (1 pendaftaran bisa >1 peserta).

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | serial PK | |
| pendaftaran_id | FK → pendaftaran | |
| user_id | FK → users | Nullable, referensi ke user terdaftar |
| kode_peserta | varchar(50) unique | |
| nama_lengkap | varchar(255) | Override jika peserta bukan user itu sendiri |
| email | varchar(255) | |
| nomor_telepon | varchar(20) | |
| jenis_kelamin | enum | |
| dibuat_pada | timestamp | |
| diperbarui_pada | timestamp | |

### 17. `paper_submission`
Submit paper ke event. Field: `event_id` (FK, not null), `user_id` (FK, not null), `judul` (not null), `kata_kunci`, `track`, `url_file` (not null), `status` (review/accepted/rejected), `komentar_penolakan`, `dibuat_pada`, `diperbarui_pada`.

### 18. `penulis_paper`
Data penulis per paper submission (1 paper bisa >1 penulis).

Field: `paper_submission_id` (FK, not null), `nama` (not null), `email`, `institusi`, `is_corresponding` (boolean), `urutan` (integer), `dibuat_pada`.

### 19. `jadwal_event`
Jadwal acara event. Field: `event_id` (FK), `waktu_mulai`, `waktu_selesai`, `deskripsi`, `dibuat_pada`.

### 20. `raw_scraped_data`
Data mentah hasil scraping. Field: `id` (PK), `sumber` (not null), `url_target`, `data` (jsonb, not null), `status_integrasi` (boolean), `status` (varchar(20) — pending/processed/error), `dibuat_pada`.

Index: `raw_scraped_url_target_idx` (url_target), `raw_scraped_status_idx` (status).

### 21. `log_scraping`
Log proses scraping. Field: `id` (PK), `target_url`, `sumber`, `status` (pending/processing/success/failed), `jumlah_data`, `error_message`, `mulai_pada`, `selesai_pada`.

### 22. `scraping_sources`
Konfigurasi sumber scraping. Field: `id` (PK), `nama` (not null), `url` (not null), `tipe` (varchar — cheerio/playwright), `interval_menit` (integer), `aktif` (boolean, default true), `dibuat_pada`, `diperbarui_pada`.

### 23. `scraping_validation_rules`
Aturan validasi data scraped. Field: `id` (PK), `field` (varchar, not null), `operator` (varchar — required/min_length/contains), `value` (varchar), `aktif` (boolean, default true), `dibuat_pada`.

### 24. `scraping_auto_approval_rules`
Aturan auto-approval berdasarkan skor. Field: `id` (PK), `min_skor` (integer, not null), `aksi` (varchar — auto_approve/auto_reject), `aktif` (boolean, default true), `dibuat_pada`.

---

## Relasi Database

```
users ──┬── profil_penyelenggara (1:1)
        ├── event (1:N, organizer_id)
        ├── log_admin (1:N, admin_id)
        ├── pendaftaran (1:N)
        ├── paper_submission (1:N)
        ├── favorit (1:N)
        └── peserta (1:N, opsional)

event ──┬── event_tag → tag (M:N)
        ├── pembicara (1:N)
        ├── lampiran_event (1:N)
        ├── jadwal_event (1:N)
        ├── log_admin (1:N)
        ├── pendaftaran (1:N)
        ├── paper_submission (1:N)
        └── favorit (1:N)

info_pembayaran ── pendaftaran (1:N, metode_pembayaran_id)

pendaftaran ── peserta (1:N)

paper_submission ── penulis_paper (1:N)

provinsi ── kota (1:N)
kota ── event (1:N)
kategori ── event (1:N)
```

---

## Tabel Standalone (tanpa FK)

| Tabel | Keterangan |
|-------|-----------|
| `otp_codes` | Kode OTP verifikasi email (relasi via email string) |
| `info_pembayaran` | Info pembayaran global (di-FK dari pendaftaran) |
| `scraping_sources` | Konfigurasi sumber scraping |
| `scraping_validation_rules` | Aturan validasi data scraped |
| `scraping_auto_approval_rules` | Aturan auto-approval berdasarkan skor |

## Tabel Junction (Composite PK)

| Tabel | Kolom PK | Relasi |
|-------|----------|--------|
| `event_tag` | (`event_id`, `tag_id`) | M:N antara event dan tag |
| `favorit` | (`user_id`, `event_id`) | M:N antara user dan event |
