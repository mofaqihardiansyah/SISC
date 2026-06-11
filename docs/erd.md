# ERD — SISC (Sistem Informasi Seminar dan Conference)

```mermaid
erDiagram
    %% ENUMS (not directly represented but shown as attributes)

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
        integer user_id FK, UK
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
        varchar nama_pembicara
        varchar peran_pembicara
        varchar url_foto_pembicara
        varchar nama_bank
        varchar nomor_rekening
        varchar pemilik_rekening
        varchar nama_bank_alternatif
        varchar nomor_rekening_alternatif
        varchar pemilik_rekening_alternatif
        varchar nama_ewallet
        varchar nomor_ewallet
        varchar pemilik_ewallet
        varchar url_gambar_qris
        timestamp dibuat_pada
        timestamp diperbarui_pada
        timestamp dihapus_pada
    }

    %% 10. LAMPIRAN EVENT
    lampiran_event {
        serial id PK
        integer event_id FK
        varchar url_file
        varchar tipe_file
    }

    %% 11. BOOKMARK
    bookmark {
        serial id PK
        integer userId FK
        integer eventId FK
        timestamp dibuat_pada
    }

    %% 12. LOG ADMIN
    log_admin {
        serial id PK
        integer admin_id FK
        integer event_id FK
        varchar aksi
        jsonb data_sebelumnya
        timestamp dibuat_pada
    }

    %% 13. PENDAFTARAN
    pendaftaran {
        serial id PK
        integer event_id FK
        integer user_id FK
        varchar kode_pendaftaran UK
        enum status
        text bukti_pembayaran
        timestamp dibuat_pada
        timestamp diperbarui_pada
        timestamp dihapus_pada
    }

    %% 14. TRANSAKSI
    transaksi {
        serial id PK
        integer event_id FK
        integer user_id FK
        varchar kode_transaksi UK
        varchar status
        integer total_harga
        timestamp dibuat_pada
        timestamp diperbarui_pada
    }

    %% 15. PESERTA
    peserta {
        serial id PK
        integer pendaftaran_id FK
        integer transaksi_id FK
        varchar kode_peserta UK
        varchar nama_lengkap
        varchar email
        varchar nomor_telepon
        enum jenis_kelamin
    }

    %% 16. PAPER SUBMISSION
    paper_submission {
        serial id PK
        integer event_id FK
        integer user_id FK
        varchar judul
        varchar kata_kunci
        varchar track
        jsonb penulis
        varchar url_file
        enum status
        text komentar_penolakan
        timestamp dibuat_pada
        timestamp diperbarui_pada
    }

    %% 17. JADWAL EVENT
    jadwal_event {
        serial id PK
        integer event_id FK
        timestamp waktu_mulai
        timestamp waktu_selesai
        text deskripsi
    }

    %% 18. PEMBERITAHUAN
    pemberitahuan {
        serial id PK
        text tag
        text isi
        timestamp dibuat_pada
    }

    %% 19. FAVORIT
    favorit {
        integer user_id FK
        integer event_id FK
        timestamp dibuat_pada
    }

    %% 20. TAYANGAN LOG
    tayangan_log {
        integer event_id FK
        timestamp tanggal
    }

    %% ── RELATIONS ──

    %% users relations
    users ||--o| profil_penyelenggara : "1:1"
    users ||--o{ event : "1:N (organizer)"
    users ||--o{ bookmark : "1:N"
    users ||--o{ log_admin : "1:N (admin)"
    users ||--o{ pendaftaran : "1:N"
    users ||--o{ transaksi : "1:N"
    users ||--o{ paper_submission : "1:N"
    users ||--o{ favorit : "1:N"

    %% provinsi & kota
    provinsi ||--o{ kota : "1:N"

    %% kategori
    kategori ||--o{ event : "1:N"

    %% kota
    kota ||--o{ event : "1:N"

    %% event_tag junction
    event_tag }o--|| event : "N:1"
    event_tag }o--|| tag : "N:1"

    %% event relations
    event ||--o{ lampiran_event : "1:N"
    event ||--o{ bookmark : "1:N"
    event ||--o{ log_admin : "1:N"
    event ||--o{ pendaftaran : "1:N"
    event ||--o{ transaksi : "1:N"
    event ||--o{ jadwal_event : "1:N"
    event ||--o{ paper_submission : "1:N"
    event ||--o{ favorit : "1:N"
    event ||--o{ tayangan_log : "1:N"

    %% pendaftaran & transaksi → peserta
    pendaftaran ||--o{ peserta : "1:N"
    transaksi ||--o{ peserta : "1:N"
```

---

## Relasi dalam Teks

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ERD SISC                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  otp_codes (no relasi)         pemberitahuan (no relasi)                   │
│                                                                             │
│  ┌──────────┐       ┌──────────────────────┐                               │
│  │ provinsi │1──N┐  │      kategori        │                               │
│  └──────────┘    │  └──────────────────────┘                               │
│                  │         │                                                │
│                  ▼         │ 1:N                                            │
│  ┌──────────┐    N┌──┐    ▼                                                │
│  │   kota   │──N─┤  │ event_tag (M:N) ── tag                              │
│  └──────────┘    │  │                                                       │
│         │        │  │                                                       │
│         │ 1:N    │  │                                                       │
│         ▼        │  │                                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                              event                                    │  │
│  │  organizer_id ────┐                                                  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│     │ 1:N    │ 1:N   │ 1:N   │ 1:N    │ 1:N    │ 1:N    │ 1:N    │ 1:N   │
│     ▼        ▼       ▼       ▼        ▼        ▼        ▼        ▼       │
│  ┌──────┐ ┌──────┐ ┌────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │lamp  │ │jadwal│ │bk  │ │log   │ │pendaf│ │trans │ │paper │ │tayang│  │
│  │_event│ │_event│ │mark│ │admin │ │taratan│ │aksi  │ │submit│ │_log  │  │
│  └──────┘ └──────┘ └────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │
│                                          │         │                       │
│                                          │ 1:N     │ 1:N                   │
│                                          ▼         ▼                       │
│                                     ┌──────────────────┐                   │
│                                     │     peserta      │                   │
│                                     │ pendaftaran_id   │                   │
│                                     │ transaksi_id     │                   │
│                                     └──────────────────┘                   │
│                                                                             │
│  ┌──────────┐   1:1   ┌──────────────────────┐                             │
│  │   users  │◄────────│ profil_penyelenggara  │                             │
│  └──────────┘         └──────────────────────┘                             │
│       │                                                                     │
│       │ 1:N (sebagai organizer_id di event)                                │
│       │ 1:N (sebagai admin_id di log_admin)                                │
│       │ 1:N (sebagai user_id di bookmark, pendaftaran, transaksi,          │
│       │      paper_submission, favorit)                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Ringkasan Relasi

| # | Tabel | Relasi | Target | Tipe |
|---|-------|--------|--------|------|
| 1 | `users` | 1:1 | `profil_penyelenggara` | Satu user (organizer) punya satu profil |
| 2 | `users` | 1:N | `event` | Satu user bisa membuat banyak event (sebagai organizer) |
| 3 | `users` | 1:N | `bookmark` | Satu user bisa punya banyak bookmark |
| 4 | `users` | 1:N | `log_admin` | Satu admin bisa punya banyak log aktivitas |
| 5 | `users` | 1:N | `pendaftaran` | Satu user bisa daftar ke banyak event |
| 6 | `users` | 1:N | `transaksi` | Satu user bisa punya banyak transaksi |
| 7 | `users` | 1:N | `paper_submission` | Satu user bisa submit banyak paper |
| 8 | `users` | 1:N | `favorit` | Satu user bisa favoritkan banyak event |
| 9 | `provinsi` | 1:N | `kota` | Satu provinsi punya banyak kota |
| 10 | `kota` | 1:N | `event` | Satu kota bisa jadi lokasi banyak event |
| 11 | `kategori` | 1:N | `event` | Satu kategori bisa dipakai banyak event |
| 12 | `tag` | M:N | `event` | (via `event_tag`) Banyak tag bisa dipakai banyak event |
| 13 | `event` | 1:N | `event_tag` | Satu event punya banyak tag |
| 14 | `event` | 1:N | `lampiran_event` | Satu event punya banyak lampiran |
| 15 | `event` | 1:N | `bookmark` | Satu event bisa di-bookmark banyak user |
| 16 | `event` | 1:N | `log_admin` | Satu event punya banyak log admin |
| 17 | `event` | 1:N | `pendaftaran` | Satu event punya banyak pendaftar |
| 18 | `event` | 1:N | `transaksi` | Satu event punya banyak transaksi |
| 19 | `event` | 1:N | `jadwal_event` | Satu event punya banyak jadwal |
| 20 | `event` | 1:N | `paper_submission` | Satu event terima banyak paper |
| 21 | `event` | 1:N | `favorit` | Satu event bisa difavoritkan banyak user |
| 22 | `event` | 1:N | `tayangan_log` | Satu event punya banyak log tayangan |
| 23 | `pendaftaran` | 1:N | `peserta` | Satu pendaftaran bisa punya banyak peserta |
| 24 | `transaksi` | 1:N | `peserta` | Satu transaksi bisa untuk banyak peserta |

## Tabel Standalone (tanpa FK)

| Tabel | Keterangan |
|-------|-----------|
| `otp_codes` | Kode OTP verifikasi email (tidak terikat relasi FK) |
| `pemberitahuan` | Notifikasi sistem (tidak terikat relasi FK) |

## Tabel Junction (Composite PK)

| Tabel | Kolom PK | Relasi |
|-------|----------|--------|
| `event_tag` | (`event_id`, `tag_id`) | M:N antara event dan tag |
| `favorit` | (`user_id`, `event_id`) | M:N antara user dan event |
