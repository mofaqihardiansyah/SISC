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

## Enums (8)

| Enum | Values |
|------|--------|
| `event_status` | `draft`, `pending`, `published`, `rejected` |
| `jenis_event` | `seminar`, `conference` |
| `tipe_platform` | `online`, `offline`, `hybrid` |
| `tipe_harga` | `free`, `paid` |
| `paper_status` | `review`, `accepted`, `rejected` |
| `user_role` | `admin`, `organizer`, `visitor` |
| `pendaftaran_status` | `terdaftar`, `dibatalkan`, `hadir` |
| `jenis_kelamin` | `Laki-laki`, `Perempuan` |

---

## Tabel (20)

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
Profil organizer. Field: `user_id` (unique FK → users), `nama_instansi`, `deskripsi_instansi`, `url_dokumen_legalitas`, `url_website`.

### 4. `provinsi`
Field: `id`, `nama` (unique). Data awal: 38 provinsi Indonesia.

### 5. `kota`
Field: `id`, `provinsi_id` (FK → provinsi), `nama`.

### 6. `kategori`
Field: `id`, `nama`, `slug` (unique), `url_ikon`. Digunakan untuk kategorisasi event.

### 7. `tag`
Field: `id`, `nama` (unique). Tag untuk event.

### 8. `event_tag`
Relasi M:N antara event dan tag. Composite PK: (`event_id`, `tag_id`).

### 9. `event` — Tabel utama (35 kolom)
Menyimpan seluruh data event termasuk detail pembayaran:

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
| nama_kontak, email_kontak, telepon_kontak | | Kontak person |
| kuota, maks_tiket_per_transaksi | integer | |
| satu_akun_satu_transaksi | boolean | |
| status | enum | draft / pending / published / rejected |
| hasil_scraping | boolean | Dari EventKampus |
| jumlah_tayangan | integer | View counter |
| alasan_penolakan | text | |
| nama_pembicara, peran_pembicara, url_foto_pembicara | | Speaker info |
| nama_bank, nomor_rekening, pemilik_rekening | | Bank payment |
| nama_bank_alternatif, nomor_rekening_alternatif, pemilik_rekening_alternatif | | Bank alternatif |
| nama_ewallet, nomor_ewallet, pemilik_ewallet | | E-Wallet payment |
| url_gambar_qris | varchar(512) | QRIS payment |

### 10. `lampiran_event`
Lampiran file event. Field: `event_id` (FK), `url_file`, `tipe_file`.

### 11. `bookmark`
Bookmark event oleh user. Unique index on (`user_id`, `event_id`).

### 12. `log_admin`
Log aktivitas admin. Field: `admin_id`, `event_id`, `aksi`, `data_sebelumnya` (jsonb).

### 13. `pendaftaran`
Pendaftaran event. Field: `event_id`, `user_id`, `kode_pendaftaran` (unique), `status` (terdaftar/dibatalkan/hadir), `bukti_pembayaran`.

### 14. `transaksi`
Transaksi pembayaran. Field: `event_id`, `user_id`, `kode_transaksi` (unique), `status`, `total_harga`.

### 15. `peserta`
Data peserta per pendaftaran/transaksi. Field: `pendaftaran_id`, `transaksi_id`, `kode_peserta` (unique), `nama_lengkap`, `email`, `nomor_telepon`, `jenis_kelamin`.

### 16. `paper_submission`
Submit paper. Field: `event_id`, `user_id`, `judul`, `kata_kunci`, `track`, `penulis` (jsonb), `url_file`, `status` (review/accepted/rejected), `komentar_penolakan`.

### 17. `jadwal_event`
Jadwal acara event. Field: `event_id`, `waktu_mulai`, `waktu_selesai`, `deskripsi`.

### 18. `pemberitahuan`
Notifikasi sistem. Field: `tag`, `isi`.

### 19. `favorit`
Favorit event. Composite PK: (`user_id`, `event_id`).

### 20. `tayangan_log`
Log tayangan per event per hari. Index on (`event_id`, `tanggal`).

---

## Relasi Database

```
users ──┬── profil_penyelenggara (1:1)
         ├── event (1:N, organizerId)
         ├── bookmark (1:N)
         ├── log_admin (1:N)
         ├── pendaftaran (1:N)
         ├── transaksi (1:N)
         ├── paper_submission (1:N)
event ──┬── event_tag (M:N via tag)
         ├── lampiran_event (1:N)
         ├── bookmark (1:N)
         ├── log_admin (1:N)
         ├── pendaftaran (1:N)
         ├── transaksi (1:N)
         ├── jadwal_event (1:N)
         ├── paper_submission (1:N)
         ├── favorit (1:N)
         ├── tayangan_log (1:N)
kategori ── event (1:N)
kota ── event (1:N)
provinsi ── kota (1:N)
pendaftaran ── peserta (1:N)
transaksi ── peserta (1:N)
```

---

## Migrasi (6 file)

| File | Deskripsi |
|------|-----------|
| `0000_funny_sentinel.sql` | Initial schema: 15 tabel + 8 enums |
| `0001_ambitious_wraith.sql` | Alter users: tambah pekerjaan, is_approved, dll |
| `0002_parched_miss_america.sql` | Alter event_status: tambah 'draft' |
| `0003_add_kata_kunci_track.sql` | Buat tabel favorit, pemberitahuan, transaksi |
| `0004_add_tayangan_log.sql` | Buat tabel tayangan_log |
| `0005_rename_columns_ke_indonesia.sql` | Rename semua kolom ke Bahasa Indonesia |

---

## Seed Data

| File | Isi |
|------|-----|
| `seed.ts` | Unified runner: seedMaster → seedEvent → seedDemo |
| `seed-master.ts` | Reset DB + 38 provinsi + kategori + tags + users |
| `seed-event.ts` | 24 events + profil penyelenggara + tags + jadwal + log |
| `seed-demo.ts` | Bookmarks + pendaftaran & peserta + paper submissions |

Semua URL file menggunakan placeholder eksternal (picsum.photos, W3C sample PDF).
