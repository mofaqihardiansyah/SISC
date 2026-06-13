# ERD — SISC (Sistem Informasi Seminar dan Conference)

```mermaid
erDiagram
    %% 1. USERS
    users {
        serial id PK
        varchar nama_lengkap
        varchar email UK
        varchar nomor_telepon
        varchar institusi
        varchar pekerjaan
        varchar password
        timestamp email_terverifikasi
        timestamp tanggal_lahir
        enum jenis_kelamin
        enum role
        boolean disetujui
        boolean diblokir
        timestamp terakhir_aktif_pada
        varchar url_avatar
        timestamp dibuat_pada
        timestamp diperbarui_pada
        timestamp dihapus_pada
    }

    %% 2. OTP CODES
    otp_codes {
        serial id PK
        varchar email
        varchar code
        timestamp kedaluwarsa_pada
        timestamp dibuat_pada
    }

    %% 3. PROFIL PENYELENGGARA
    profil_penyelenggara {
        serial id PK
        integer user_id FK
        varchar nama_instansi
        text deskripsi_instansi
        varchar url_dokumen_legalitas
        varchar url_website
        timestamp dibuat_pada
        timestamp diperbarui_pada
    }

    %% 4. PROVINSI
    provinsi {
        serial id PK
        varchar nama UK
    }

    %% 5. KOTA
    kota {
        serial id PK
        integer provinsi_id FK
        varchar nama
    }

    %% 6. KATEGORI
    kategori {
        serial id PK
        varchar nama
        varchar slug UK
        varchar url_ikon
    }

    %% 7. TAG
    tag {
        serial id PK
        varchar nama UK
    }

    %% 8. EVENT TAG (junction)
    event_tag {
        integer event_id FK
        integer tag_id FK
    }

    %% 9. EVENT
    event {
        serial id PK
        integer organizer_id FK
        integer kategori_id FK
        integer kota_id FK
        varchar judul
        varchar slug UK
        text deskripsi
        text syarat_dan_ketentuan
        varchar url_banner
        varchar penyelenggara
        timestamp tanggal_mulai
        timestamp tanggal_selesai
        timestamp batas_registrasi
        boolean event_polines
        enum jenis_event
        enum tipe_platform
        enum tipe_harga
        integer harga
        text detail_lokasi
        varchar link_eksternal
        varchar nama_kontak
        varchar email_kontak
        varchar telepon_kontak
        integer kuota
        integer maks_tiket_per_transaksi
        boolean satu_akun_satu_transaksi
        enum status
        boolean hasil_scraping
        varchar website_sumber
        integer jumlah_tayangan
        text alasan_penolakan
        timestamp dibuat_pada
        timestamp diperbarui_pada
        timestamp dihapus_pada
    }

    %% 10. INFO PEMBAYARAN (global)
    info_pembayaran {
        serial id PK
        enum tipe
        varchar nama_bank
        varchar nomor_rekening
        varchar pemilik_rekening
        varchar url_gambar_qris
        boolean aktif
        timestamp dibuat_pada
        timestamp diperbarui_pada
    }

    %% 11. PEMBICARA
    pembicara {
        serial id PK
        integer event_id FK
        varchar nama
        varchar peran
        varchar url_foto
        timestamp dibuat_pada
        timestamp diperbarui_pada
    }

    %% 12. LAMPIRAN EVENT
    lampiran_event {
        serial id PK
        integer event_id FK
        varchar url_file
        varchar tipe_file
        integer urutan
        timestamp dibuat_pada
    }

    %% 13. LOG ADMIN
    log_admin {
        serial id PK
        integer admin_id FK
        integer event_id FK
        varchar aksi
        jsonb data_sebelumnya
        timestamp dibuat_pada
    }

    %% 14. FAVORIT
    favorit {
        integer user_id FK
        integer event_id FK
        timestamp dibuat_pada
    }

    %% 15. PENDAFTARAN
    pendaftaran {
        serial id PK
        integer event_id FK
        integer user_id FK
        varchar kode_pendaftaran UK
        enum status
        integer metode_pembayaran_id FK
        text bukti_pembayaran
        integer total_harga
        timestamp dibuat_pada
        timestamp diperbarui_pada
        timestamp dihapus_pada
    }

    %% 16. PESERTA
    peserta {
        serial id PK
        integer pendaftaran_id FK
        integer user_id FK
        varchar kode_peserta UK
        varchar nama_lengkap
        varchar email
        varchar nomor_telepon
        enum jenis_kelamin
        timestamp dibuat_pada
        timestamp diperbarui_pada
    }

    %% 17. PAPER SUBMISSION
    paper_submission {
        serial id PK
        integer event_id FK
        integer user_id FK
        varchar judul
        varchar kata_kunci
        varchar track
        varchar url_file
        enum status
        text komentar_penolakan
        timestamp dibuat_pada
        timestamp diperbarui_pada
    }

    %% 18. PENULIS PAPER
    penulis_paper {
        serial id PK
        integer paper_submission_id FK
        varchar nama
        varchar email
        varchar institusi
        integer urutan
        timestamp dibuat_pada
    }

    %% 19. JADWAL EVENT
    jadwal_event {
        serial id PK
        integer event_id FK
        timestamp waktu_mulai
        timestamp waktu_selesai
        text deskripsi
        timestamp dibuat_pada
    }

    %% ── RELATIONS ──

    users ||--o| profil_penyelenggara : "1:1"
    users ||--o{ event : "1:N (organizer)"
    users ||--o{ log_admin : "1:N (admin)"
    users ||--o{ pendaftaran : "1:N"
    users ||--o{ paper_submission : "1:N"
    users ||--o{ favorit : "1:N"
    users ||--o{ peserta : "1:N (opsional)"

    provinsi ||--o{ kota : "1:N"
    kategori ||--o{ event : "1:N"
    kota ||--o{ event : "1:N"

    event_tag }o--|| event : "N:1"
    event_tag }o--|| tag : "N:1"

    event ||--o{ pembicara : "1:N"
    event ||--o{ lampiran_event : "1:N"
    event ||--o{ jadwal_event : "1:N"
    event ||--o{ log_admin : "1:N"
    event ||--o{ pendaftaran : "1:N"
    event ||--o{ paper_submission : "1:N"
    event ||--o{ favorit : "1:N"

    info_pembayaran ||--o{ pendaftaran : "1:N"
    pendaftaran ||--o{ peserta : "1:N"
    paper_submission ||--o{ penulis_paper : "1:N"
```

---

## Ringkasan Relasi (24)

| # | Tabel | Relasi | Target | Keterangan |
|---|-------|--------|--------|------------|
| 1 | `users` | 1:1 | `profil_penyelenggara` | Satu user organizer punya satu profil |
| 2 | `users` | 1:N | `event` | Organizer membuat banyak event |
| 3 | `users` | 1:N | `log_admin` | Admin punya banyak log aktivitas |
| 4 | `users` | 1:N | `pendaftaran` | User daftar ke banyak event |
| 5 | `users` | 1:N | `paper_submission` | User submit banyak paper |
| 6 | `users` | 1:N | `favorit` | User favoritkan banyak event |
| 7 | `users` | 1:N | `peserta` | User bisa jadi peserta (opsional FK) |
| 8 | `provinsi` | 1:N | `kota` | Satu provinsi punya banyak kota |
| 9 | `kota` | 1:N | `event` | Satu kota jadi lokasi banyak event |
| 10 | `kategori` | 1:N | `event` | Satu kategori dipakai banyak event |
| 11 | `tag` | M:N | `event` | Via `event_tag` |
| 12 | `event` | 1:N | `event_tag` | Satu event punya banyak tag |
| 13 | `event` | 1:N | `pembicara` | Satu event punya banyak pembicara |
| 14 | `event` | 1:N | `lampiran_event` | Satu event punya banyak lampiran |
| 15 | `event` | 1:N | `jadwal_event` | Satu event punya banyak jadwal |
| 16 | `event` | 1:N | `log_admin` | Satu event punya banyak log admin |
| 17 | `event` | 1:N | `pendaftaran` | Satu event punya banyak pendaftar |
| 18 | `event` | 1:N | `paper_submission` | Satu event terima banyak paper |
| 19 | `event` | 1:N | `favorit` | Satu event difavoritkan banyak user |
| 20 | `info_pembayaran` | 1:N | `pendaftaran` | Satu metode bayar dipakai banyak pendaftaran |
| 21 | `pendaftaran` | 1:N | `peserta` | Satu pendaftaran bisa banyak peserta |
| 22 | `paper_submission` | 1:N | `penulis_paper` | Satu paper punya banyak penulis |

## Tabel Standalone (tanpa FK)

| Tabel | Keterangan |
|-------|-----------|
| `otp_codes` | Kode OTP verifikasi email (relasi via email string) |

## Tabel Junction (Composite PK)

| Tabel | Kolom PK | Relasi |
|-------|----------|--------|
| `event_tag` | (`event_id`, `tag_id`) | M:N antara event dan tag |
| `favorit` | (`user_id`, `event_id`) | M:N antara user dan event |
