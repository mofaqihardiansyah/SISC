# Panduan Pengerjaan Sistem Informasi Seminar & Conference

Dokumen ini adalah satu panduan lengkap yang menyatukan alur **Setup Anggota**, **Kolaborasi (Git)**, dan **Manajemen Database**.

Sistem kita berjalan dengan **Next.js (App Router)** dan **Drizzle ORM** yang terkoneksi dengan **PostgreSQL**.

---

## TAHAP 1: Persiapan Software Wajib

Sebelum mulai, pastikan 4 hal ini sudah ter-install di laptop/komputer masing-masing:

1. **Node.js (Versi 20+ LTS)**
   - Wajib untuk bisa menjalankan sintaks _Javascript_ Next.js.
   - Download di: [nodejs.org](https://nodejs.org/) (Pilih yang tengahnya ada tulisan "LTS").
2. **Git**
   - Wajib agar bisa menarik / mengirim kode kelompok.
   - Download di: [git-scm.com](https://git-scm.com/)
3. **Code Editor (Direkomendasikan: Visual Studio Code)**
   - Pasang ekstensi ini di VSCode:
     - `Tailwind CSS IntelliSense` -> Auto-complete warna dan desain Tailwind.
     - `ESLint` -> Pemeriksa salah ketik/salah koding dasar otomatis.
4. **Docker Desktop (Opsional tapi SANGAT Direkomendasikan)**
   - Agar _database_ bisa langsung nyala tanpa _setup_ pgAdmin yang rumit: [docker.com](https://www.docker.com/products/docker-desktop/)

---

## TAHAP 2: Kloning & Install Proyek

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
   Tunggu sampai proses _download_ modul selesai.
   ```bash
   npm install
   ```

---

## TAHAP 3: Panduan Database & `.env`

File `.env` berisi _password_ dan jalur database lokal Anda. **Jangan pernah meng-commit file `.env` ke GitHub** agar tidak menabrak _settingan_ teman yang lain!

1. Buat file baru bernama tepat `.env` di **folder paling luar (root)** proyek.
2. Isinya bergantung pada cara menjalankan PostgreSQL dimana ada 2 cara:

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

## TAHAP 4: Migrasi & Manajemen Database (Drizzle ORM)

Bagi yang terbiasa dengan `php artisan migrate` di Laravel, logika di next.js sangat mirip:

1. **Tarik Skema Terbaru (Push Migrations)**
   Jika ada teman satu tim yang meng-update file `src/db/schema.ts` (misal menambah tabel/kolom), kalian wajib menjalankan ini setelah `git pull`:

   ```bash
   npx drizzle-kit push
   ```

   _Drizzle ORM akan otomatis membaca kodingan dan menyesuaikan tabel PostgreSQL Anda tanpa menghapus data yang sudah ada._

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

## TAHAP 5: Menjalankan Website SISC

Pastikan database sudah menyala (Docker / PostgreSQL aktif), lalu ketik:

```bash
npm run dev
```

Buka browser dan kunjungi `http://localhost:3000`. Jika halaman muncul, maka sistem SISC siap untuk dikerjakan!

---

## PANDUAN GIT/GIT RULES!

> [!CAUTION]
> **ATURAN WAJIB:**
>
> 1. Sebisa mungkin JANGAN MENULIS KODE dan KOMIT langsung di branch `main`.
> 2. Sebelum mulai mengerjakan fitur Anda, buat _branch_ baru:
>    ```bash
>    git checkout -b feature/nama-fitur-anda
>    ```
>    _(Contoh: `git checkout -b feature/cari-lokasi-seminar`)_
> 3. Setelah fitur selesai, lakukan _commit_ dan _push_, kemudian buat **Pull Request (PR)** ke `main`.
> 4. Selalu biasakan jalankan `git pull origin main` di _branch_ utama kmu sebeum membuat _branch_ baru!

**Tips Tambahan:**

- Selalu jalankan `docker-compose up -d` sebelum mengetik `npm run dev` kalau pakai Docker.
- Jika ada _error_ "_Connection refused_", cek ulang _Password_ dan _Port_ (`5432` / `5433`) di dalam file `.env`.
