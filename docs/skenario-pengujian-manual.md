# Skenario Pengujian Manual

Dokumen ini memuat langkah-langkah yang harus dilakukan untuk menguji fungsionalitas dan interaksi UI/UX pada proyek web SISC secara manual menggunakan browser Anda (mis. Firefox).

## Persiapan
- Pastikan server pengembangan berjalan (`npm run dev` pada terminal).
- Buka browser Anda pada alamat `http://localhost:3000`.

---

## 1. Halaman Publik (Tanpa Login)
- [ ] Buka `http://localhost:3000` (Beranda/Landing Page).
- [ ] Periksa responsivitas desain (coba perkecil ukuran layar *browser* seperti tampilan *mobile*).
- [ ] Pastikan animasi berjalan mulus dan semua tautan/tombol yang mengarah ke *Jelajah Event* dan *Bantuan* berfungsi dengan benar.
- [ ] Coba mendaftar menggunakan email baru atau periksa fungsionalitas *Lupa Password*.

---

## 2. Pengujian Role: VISITOR
Gunakan akun seed berikut untuk login:
- **Email**: `visitor@gmail.com`
- **Password**: `visitorpassword123`

### Skenario:
- [x] **Login:** Masuk melalui halaman login dengan kredensial di atas.
- [x] **Dashboard Visitor:** Periksa apakah Anda diarahkan ke dashboard khusus *user/visitor*.
- [x] **Jelajah Event:** Cari menu atau halaman *Event*. Uji fitur pencarian (Search) atau Filter Kategori Event.
- [x] **Detail Event:** Klik salah satu event. Pastikan deskripsi, gambar, jadwal, dan ketersediaan kuota muncul secara jelas.
- [x] **Registrasi Event:** Cobalah untuk mendaftar pada sebuah event. Cek apakah Anda mendapat konfirmasi pendaftaran berhasil.
- [x] **Event Saya / Favorit:** Buka profil atau dashboard personal. Pastikan event yang baru saja didaftar atau disimpan/favorit muncul di daftar.
- [x] **Logout:** Coba keluar dari aplikasi. Pastikan Anda kembali ke *Landing Page*.

---

## 3. Pengujian Role: ORGANIZER (Penyelenggara)
Gunakan akun seed berikut untuk login:
- **Email**: `organizer@gmail.com`
- **Password**: `organizerpassword123`

### Skenario:
- [x] **Login:** Masuk melalui halaman login dengan kredensial Organizer.
- [x] **Dashboard Organizer:** Periksa tampilan dashboard (apakah berisi analitik jumlah pendaftar, dll).
- [x] **Buat Event Baru:** Coba menu untuk menambah Event baru. Isi form lengkap (judul, deskripsi, tanggal, tiket, dll). 
- [x] **Validasi Form:** Coba kosongkan salah satu *field* penting saat *submit*, lalu periksa apakah *error message* muncul dengan jelas.
- [x] **Manajemen Event:** Edit salah satu event yang sudah dibuat. Coba ubah detail dan simpan. Pastikan datanya berubah.
- [x] **Daftar Peserta:** Buka detail salah satu event yang dimiliki Organizer ini, cek daftar pesertanya (jika ada).
- [x] **Logout.**

---

## 4. Pengujian Role: ADMIN
Gunakan akun seed berikut untuk login:
- **Email**: `poliventsofficial@gmail.com`
- **Password**: `adminpassword123`

### Skenario:
- [ ] **Login:** Masuk melalui halaman login.
- [ ] **Dashboard Admin:** Pastikan panel admin utama terbuka. Periksa ringkasan statistik (total *user*, *organizer*, dan *event*).
- [ ] **Manajemen User/Organizer:** Cari tabel atau menu pengelolaan pengguna. Coba blokir/non-aktifkan akun (jika fitur ini ada) atau ubah peran (*role*).
- [ ] **Manajemen Event (Master):** Coba fitur kelola data master event. Periksa daftar *Event* yang ada, setujui/tolak event yang masih *pending* (jika ada *workflow approval*).
- [ ] **Settings / Master Data:** Periksa menu pengaturan data Kategori atau Tag (jika tersedia untuk admin).
- [ ] **Logout.**
