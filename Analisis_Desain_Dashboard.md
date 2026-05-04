# Analisis Desain Dashboard Admin - POLIVENTS

Dokumen ini berisi analisis mendalam terhadap desain antarmuka (UI) dashboard admin untuk platform **POLIVENTS**, sesuai dengan gambar yang dilampirkan.

## 1. Identitas Visual & Branding
* **Nama Platform:** POLIVENTS (terlihat pada sidebar kiri atas).
* **Palet Warna:**
    * **Sidebar:** Biru Navy Gelap (Dark Mode style), memberikan kesan profesional dan fokus.
    * **Main Background:** Abu-abu sangat terang/Putih, memberikan kesan bersih (*clean look*).
    * **Aksen:** Biru Terang digunakan untuk grafis dan elemen aktif, serta kuning/ungu untuk ikon status.
* **Tipografi:** Menggunakan font Sans-Serif yang modern dan bersih. Hierarki teks terlihat jelas antara judul utama, sub-judul, dan data angka.

## 2. Struktur Navigasi (Sidebar)
Sidebar di sisi kiri memiliki struktur yang sangat jelas:
* **Menu Utama:** Dashboard (aktif), Persetujuan, Penyelenggara, Events, dan Settings.
* **Status Aktif:** Menu "Dashboard" ditandai dengan latar belakang putih dan teks biru, menunjukkan posisi pengguna saat ini.
* **Logout:** Tombol keluar diletakkan di bagian paling bawah untuk menghindari kesalahan klik.

## 3. Komponen Utama Dashboard
### A. Statistik Ringkas (Stat Cards)
Terdapat empat kartu informasi utama di bagian atas:
1.  **Event Menunggu Approval (24):** Ikon kalender kuning.
2.  **Total Penyelenggara Aktif (1.280):** Ikon user biru.
3.  **Total Event Berjalan (842):** Ikon kalender biru muda.
4.  **Total Tiket Terjual (1.042):** Ikon tiket abu-abu.
*Setiap kartu menggunakan bayangan halus (soft shadow) untuk memberikan efek kedalaman.*

### B. Grafik Visualisasi Data
* **Judul:** "Pertumbuhan Event Seminar & Conference Bulanan".
* **Jenis Grafik:** Kombinasi *Bar Chart* (batang) dan *Line Chart* (garis).
* **Rentang Waktu:** 6 bulan terakhir (Januari - Juni).
* **Interaksi:** Terdapat fitur filter dropdown (saat ini terpilih "6 Bulan Terakhir").
* **Analisis Visual:** Batang grafik memiliki sudut membulat (*rounded corners*) yang memberikan kesan modern.

### C. Daftar Event Terbaru
Di sisi kanan terdapat panel "Event Terbaru" dengan fitur "Lihat Semua":
* Menampilkan event seperti **Tech Pulse 2024**, **Polines Fest**, **Mastering UX Workshop**, dan **Undip Fest**.
* Tiap baris menyertakan: Thumbnail gambar, lokasi (Jakarta/Semarang/Online), jumlah tiket, dan indikator status (titik hijau/abu-abu).

## 4. Evaluasi Desain (UX/UI)
* **Whitespace:** Penggunaan ruang kosong sangat baik, sehingga informasi tidak terasa sesak.
* **Konsistensi:** Ikonografi dan gaya kartu konsisten di seluruh dashboard.
* **Fungsi:** Dashboard ini sangat efektif untuk admin dalam memantau pertumbuhan platform secara *real-time* dan melakukan aksi cepat (seperti melihat event yang butuh *approval*).

---
*Analisis ini dibuat berdasarkan gambar desain Dashboard.png yang dilampirkan.*
