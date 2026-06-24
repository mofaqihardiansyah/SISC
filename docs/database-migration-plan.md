# Database Migration Plan — SISC

Panduan langkah demi langkah untuk menjalankan migrasi database di produksi.

---

## Prasyarat

- PostgreSQL 16 berjalan (Docker atau managed)
- `DATABASE_URL` ter-set di `.env`
- Drizzle Kit terinstall (`npx drizzle-kit`)

---

## Langkah 1: Backup Database

```bash
pg_dump -U postgres -d sisc > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

## Langkah 2: Push Schema ke Database

```bash
npx drizzle-kit push
```

Perintah ini akan:
- Membuat tabel baru jika belum ada
- Menambahkan kolom baru yang belum ada
- Menambahkan index baru

**Catatan:** `drizzle-kit push` tidak menghapus kolom atau tabel yang sudah ada di DB tapi tidak ada di schema. Untuk penghapusan, perlu migrasi manual.

---

## Langkah 3: Verifikasi Index Baru

Index yang ditambahkan dalam sesi ini:

| Index | Tabel | Kolom | Keterangan |
|-------|-------|-------|------------|
| `raw_scraped_url_target_idx` | `raw_scraped_data` | `url_target` | Query scraping lookup |
| `raw_scraped_status_idx` | `raw_scraped_data` | `status` | Filter by status |

Verifikasi:

```sql
SELECT indexname, tablename FROM pg_indexes
WHERE tablename = 'raw_scraped_data';
```

---

## Langkah 4: Re-seed Database

```bash
npm run seed
```

Seed yang diperbarui:
- `seed-master.ts`: 514 kabupaten/kota Indonesia
- `seed-event.ts`: 10 events dengan field `penyelenggara` terisi

---

## Langkah 5: Verifikasi Data

```sql
-- Cek jumlah kota
SELECT COUNT(*) FROM kota;

-- Cek penyelenggara terisi
SELECT id, judul, penyelenggara FROM event;

-- Cek index
SELECT indexname FROM pg_indexes WHERE tablename = 'raw_scraped_data';
```

---

## Rollback

Jika ada masalah, restore dari backup:

```bash
psql -U postgres -d sisc < backup_YYYYMMDD_HHMMSS.sql
```

---

## Catatan Produksi

- **Tidak ada kolom dihapus** dalam sesi ini — semua perubahan bersifat addition-only
- **Tidak ada tabel dihapus** — 3 tabel scraping config (`scraping_sources`, `scraping_validation_rules`, `scraping_auto_approval_rules`) sudah ada di schema
- **`drizzle-kit push` aman** untuk production karena hanya menambah (tidak menghapus)
- Seed data aman dijalankan ulang karena menggunakan `ON CONFLICT DO NOTHING`
