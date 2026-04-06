# Buku Saku Proyek SISC (Sistem Informasi Seminar & Conference)

Selamat datang di repositori SISC Kelompok 3! Dokumen ini adalah satu panduan lengkap yang menyatukan alur **Setup Anggota**, **Kolaborasi (Git)**, dan **Manajemen Database**.

Sistem kita berjalan dengan **Next.js (App Router)** dan **Drizzle ORM** yang terkoneksi dengan **PostgreSQL**.

---

## 🚀 TAHAP 1: Persiapan Software Wajib

Sebelum mulai *ngoding*, pastikan 4 hal ini sudah ter-install di laptop/komputer masing-masing:

1. **Node.js (Versi 20+ LTS)**
   - Wajib untuk bisa menjalankan sintaks *Javascript* Next.js.
   - Download di: [nodejs.org](https://nodejs.org/) (Pilih yang tengahnya ada tulisan "LTS").
2. **Git**
   - Wajib agar bisa menarik / mengirim kode kelompok.
   - Download di: [git-scm.com](https://git-scm.com/) 
3. **Code Editor (Direkomendasikan: Visual Studio Code)**
   - Pasang ekstensi ini di VSCode biar hidup lebih gampang:
     - `Tailwind CSS IntelliSense` -> Auto-complete warna dan desain Tailwind.
     - `ESLint` -> Pemeriksa salah ketik/salah koding dasar otomatis.
4. **Docker Desktop (Opsional tapi SANGAT Direkomendasikan)**
   - Agar *database* bisa langsung nyala tanpa *setup* pgAdmin yang rumit: [docker.com](https://www.docker.com/products/docker-desktop/)

---

## 💻 TAHAP 2: Kloning & Install Proyek

1. **Buka Terminal / Command Prompt / Git Bash**
2. **Kloning Proyek**:
   ```bash
   git clone https://github.com/mofaqihardiansyah/SISC.git
   ```
3. **Masuk ke Dalam Folder**:
   ```bash
   cd SISC
   ```
4. **Install Dependencies**:
   Tunggu sampai proses *download* modul selesai.
   ```bash
   npm install
   ```

---

## 🗄️ TAHAP 3: Panduan Database & `.env`

File `.env` berisi *password* dan jalur database lokal Anda. **Jangan pernah meng-commit file `.env` ke GitHub** agar tidak menabrak *settingan* teman yang lain!

1. Buat file baru bernama tepat `.env` di **folder paling luar (root)** proyek.
2. Isinya bergantung pada cara Anda menjalankan PostgreSQL:

**Cara A: Memakai Docker (Sangat Direkomendasikan)**
Jalankan kontainer dengan mengetik:
```bash
docker-compose up -d
```
Jika sukses menyala di latar belakang, salin ini ke dalam file `.env`:
```env
DATABASE_URL="postgresql://sisc_user:sisc_password@localhost:5433/sisc_db"
```

**Cara B: Memakai PostgreSQL Bawaan (Native)**
Jika teman-teman memakai pgAdmin di komputer kampus, pakai kredensial milik Anda sendiri:
```env
DATABASE_URL="postgresql://NAMA_USER_ANDA:PASSWORD_ANDA@localhost:5432/NAMA_DATABASE_BIKIN_SENDIRI"
```

---

## 🛠️ TAHAP 4: Migrasi & Manajemen Database (Drizzle ORM)

Bagi yang terbiasa dengan `php artisan migrate` di Laravel, logika di sini sangat mirip:

1. **Tarik Skema Terbaru (Push Migrations)**
   Jika ada teman satu tim yang meng-update file `src/db/schema.ts` (misal menambah tabel/kolom), kalian wajib menjalankan ini setelah `git pull`:
   ```bash
   npx drizzle-kit push
   ```
   *Drizzle ORM akan otomatis membaca kodingan dan menyesuaikan tabel PostgreSQL Anda tanpa menghapus data yang sudah ada.*

2. **Melihat Isi Database (Pengganti PhpMyAdmin)**
   Tidak perlu aplikasi berat, cukup jalankan perintah berikut untuk mengintip/mengedit data secara manual:
   ```bash
   npx drizzle-kit studio
   ```
   Lalu buka URL yang muncul `https://local.drizzle.studio`.

3. **Seeding (Data Dummy Dummy)**
   Ke depan jika kita punya file seeder di `src/db/seed.ts`, tinggal jalankan:
   ```bash
   npx tsx src/db/seed.ts
   ```

---

## 🌐 TAHAP 5: Menjalankan Website SISC

Pastikan database sudah menyala (Docker / PostgreSQL aktif), lalu ketik:
```bash
npm run dev
```
Buka browser dan kunjungi `http://localhost:3000`. Jika halaman muncul, maka sistem SISC siap untuk dikerjakan!

---

## 🤝 PANDUAN KOLABORASI (Git Rules!)

> [!CAUTION]
> **ATURAN WAJIB GRUP:**
> 1. Sebisa mungkin JANGAN MENULIS KODE dan KOMIT langsung di branch `main`.
> 2. Sebelum mulai mengerjakan fitur Anda, buat *branch* baru:
>    ```bash
>    git checkout -b feature/nama-fitur-anda
>    ```
>    *(Contoh: `git checkout -b feature/cari-lokasi-seminar`)*
> 3. Setelah fitur selesai, lakukan *commit* dan *push*, kemudian buat **Pull Request (PR)** ke `main`.
> 4. Selalu biasakan menjalankan `git pull origin main` di *branch* utama Anda sebeum membuat *branch* baru!

**Tips Tambahan:**
- Selalu jalankan `docker-compose up -d` sebelum mengetik `npm run dev` kalau pakai Docker.
- Jika ada *error* "*Connection refused*", cek ulang *Password* dan *Port* (`5432` / `5433`) di dalam file `.env` Anda.

*Semangat menggarap SISC, tim!*
