# Sistem Informasi Seminar & Conference (SISC)

Aplikasi SISC dibangun menggunakan **Next.js (App Router)**, **PostgreSQL (Docker)**, dan **Drizzle ORM**. Ikuti panduan singkat ini untuk menyiapkan *environment* lokal Anda.

---

## 📌 1. Persiapan Instalasi Wajib

Pastikan Anda telah menginstal software berikut:
1. **[Node.js](https://nodejs.org/)** (v20+ LTS)
2. **[Git](https://git-scm.com/)**
3. **[Docker Desktop](https://www.docker.com/products/docker-desktop)** (Wajib untuk database lokal)

---

## 🚀 2. Cara Install & Setup Proyek

### Kloning & Install Dependencies
Buka terminal dan jalankan:
```bash
git clone https://github.com/mofaqihardiansyah/SISC.git
cd SISC
npm install
```

### Konfigurasi `.env`
Buat file bernama `.env` di root proyek Anda, lalu *copy-paste* teks berikut (sesuai dengan konfigurasi Docker kita):
```env
DATABASE_URL="postgresql://sisc_user:sisc_password@localhost:5433/sisc_db"
```

---

## 🐳 3. Menjalankan Database PostgreSQL (Dgn Docker)

Kita menggunakan kontainer Docker untuk mempermudah. Pastikan aplikasi Docker Desktop Anda **sudah menyala**, lalu jalankan perintah ini di terminal proyek:

```bash
docker-compose up -d
```
> **Catatan**: Ini akan menjalankan server PostgreSQL `sisc_db` di *background*. Data Anda akan tersimpan aman di dalam *volume* Docker meskipun dijeda.

---

## 🗄️ 4. Migrasi Skema Drizzle ORM

Setelah kontainer database menyala, Anda wajib mensinkronisasi struktur/skema tabel menggunakan Drizzle:

```bash
# Untuk sinkronisasi otomatis skema tabel ke database
npx drizzle-kit push
```

**Melihat/Mengontrol Isi Database**:
Jika ingin melihat visualisasi tabel layaknya phpMyAdmin, jalankan ini di terminal baru:
```bash
npx drizzle-kit studio
```
*(Buka URL yang muncul di konsol, biasanya `https://local.drizzle.studio`)*

---

## ▶️ 5. Menjalankan Aplikasi Next.js

Setelah semua (*Docker berjalan & Drizzle sinkron*) sukses, nyalakan proyek:

```bash
npm run dev
```

Kunjungi **[http://localhost:3000](http://localhost:3000)** di *browser* Anda.

---

## ⚠️ Aturan Kolaborasi (Git Rules)

- **Jangan komit langsung ke `main`**. Selalu buat *branch* terpisah!
- Setiap mengerjakan fitur, jalankan: `git checkout -b feature/nama-fitur-anda`.
- Pastikan selalu melakukan `git pull origin main` di *branch* `main` Anda sebelum membuat *branch* fitur yang baru.
