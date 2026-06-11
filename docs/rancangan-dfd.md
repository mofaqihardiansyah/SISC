# Rancangan DFD — SISC (Sistem Informasi Seminar dan Conference)

## 1. Entitas Eksternal

| Entitas | Peran |
|---|---|
| **Visitor** | Melihat event, mendaftar, upload bukti bayar, input peserta, submit paper, favorit |
| **Organizer** | Mengelola event, pembicara, jadwal, lampiran, lihat pendaftar |
| **Admin** | Verifikasi event, verifikasi pembayaran, kelola user, info pembayaran, lihat log |

## 2. Data Store (19 tabel → 14 store)

| Kode Store | Nama | Berisi dari tabel |
|---|---|---|
| D1 | Users | users, otp_codes |
| D2 | Profil Penyelenggara | profil_penyelenggara |
| D3 | Wilayah | provinsi, kota |
| D4 | Kategori & Tag | kategori, tag, event_tag |
| D5 | Event | event |
| D6 | Info Pembayaran | info_pembayaran |
| D7 | Pembicara | pembicara |
| D8 | Lampiran & Jadwal | lampiran_event, jadwal_event |
| D9 | Pendaftaran | pendaftaran |
| D10 | Peserta | peserta |
| D11 | Paper | paper_submission, penulis_paper |
| D12 | Favorit | favorit |
| D13 | Log Admin | log_admin |

## 3. Level 0 — Context Diagram

**0. SISC**

```
Visitor → data registrasi, data pendaftaran+pembayaran, data peserta, data paper, favorit
Visitor ← info event, status pendaftaran, status paper

Organizer → data event, data pembicara, data jadwal, data lampiran
Organizer ← status verifikasi event, daftar pendaftar

Admin → keputusan verifikasi, manajemen user, data info pembayaran
Admin ← log aktivitas, dashboard
```

## 4. Level 1 — Decomposition (6 proses)

| Proses | Input | Output | Store |
|---|---|---|---|
| P1 — Kelola Akun | data registrasi, login, OTP, profil | status login, profil user | D1, D2 |
| P2 — Kelola Event | data event, pembicara, jadwal, lampiran, kategori/kota | event siap tayang | D3, D4, D5, D7, D8 |
| P3 — Pendaftaran & Pembayaran | daftar event, upload bukti, data peserta | kode daftar, kode peserta | D5, D6, D9, D10 |
| P4 — Paper | file paper, data penulis | status review | D5, D11 |
| P5 — Favorit | pilih favorit | daftar favorit | D12 |
| P6 — Admin & Verifikasi | approve/reject, verif bayar, blokir user, kelola info pembayaran | log aktivitas, status event/pendaftaran | D1, D5, D6, D9, D13 |

## 5. Level 2 — Rincian Subproses

### P1: Kelola Akun & Otentikasi
```
1.1 Registrasi         → input data user → D1
1.2 Verifikasi Email   → kirim OTP → validasi → D1
1.3 Login              → cek kredensial → return session
1.4 Edit Profil        → update data user → D1
1.5 Kelola Profil Org  → input data instansi → D2
```

### P2: Kelola Event
```
2.1 Buat Event         → input detail, kategori, kota → D3/D4/D5
2.2 Kelola Pembicara   → input nama, peran, foto → D7
2.3 Upload Lampiran    → upload file → D8
2.4 Kelola Jadwal      → input sesi → D8
2.5 Ajukan Publikasi   → ubah status → kirim ke Admin
```

### P3: Pendaftaran & Pembayaran
```
3.1 Daftar Event       → pilih event, isi data → D9
3.2 Upload Bukti Bayar → upload file → update D9
3.3 Input Peserta      → data peserta → D10 (bisa >1 per pendaftaran)
```

### P4: Paper
```
4.1 Submit Paper       → upload file + data penulis → D11
4.2 Review Paper       → update status → D11
```

### P5: Favorit
```
5.1 Tambah Favorit     → simpan D12
5.2 Hapus Favorit      → hapus D12
```

### P6: Admin & Verifikasi
```
6.1 Verifikasi Event      → approve/reject → D5, catat D13
6.2 Verifikasi Pembayaran → verif bukti bayar → D9, catat D13
6.3 Kelola User           → blokir/approve user → D1, catat D13
6.4 Kelola Info Pembayaran→ CRUD rekening/QRIS → D6
6.5 Lihat Log             → baca D13
```

## 6. Matriks CRUD

| Store | P1 | P2 | P3 | P4 | P5 | P6 |
|---|---|---|---|---|---|---|
| D1 Users/OTP | CRUD | - | R | R | - | U |
| D2 Profil Org | CRUD | - | - | - | - | - |
| D3 Wilayah | - | R | - | - | - | R |
| D4 Kat & Tag | - | R | - | - | - | R |
| D5 Event | - | CRUD | R | R | - | U |
| D6 Info Bayar | - | - | R | - | - | CRUD |
| D7 Pembicara | - | CRUD | - | - | - | - |
| D8 Lamp & Jadwal | - | CRUD | - | - | - | - |
| D9 Pendaftaran | - | - | CRUD | - | - | U |
| D10 Peserta | - | - | CRUD | - | - | R |
| D11 Paper | - | - | - | CRUD | - | R |
| D12 Favorit | - | - | - | - | CRUD | - |
| D13 Log Admin | - | - | - | - | - | C |
