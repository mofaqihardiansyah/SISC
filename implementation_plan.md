# Implementation Plan - Redesain Total Halaman Submit Paper

[Overview]
Merombak total antarmuka (UI) dan pengalaman pengguna (UX) pada modul pengiriman paper agar lebih minimalis, modern, dan berstandar industri.

Tujuan utama adalah menciptakan antarmuka yang bersih, fokus pada fungsionalitas, dan mengurangi beban kognitif pengguna saat melakukan pengiriman karya ilmiah. Desain akan mengikuti prinsip desain minimalis dengan tipografi yang kuat, penggunaan ruang putih yang efektif, dan palet warna brand SISC yang konsisten.

[Types]  
Pembaruan tipe data untuk mendukung state form multi-step dan metadata event yang lebih kaya.

```typescript
type SubmissionStep = 'select_event' | 'paper_details' | 'authors' | 'review_submit';

type EventWithMetadata = RegisteredEvent & {
  deadlineDate?: Date;
  submissionCount?: number;
  status: 'open' | 'closed' | 'review';
};
```

[Files]
Modifikasi file yang ada untuk mengimplementasikan arsitektur komponen yang lebih modular dan bersih.

Detailed breakdown:
- `src/app/(user)/profile/submit-paper/ClientPage.tsx`: Modifikasi untuk mengelola state navigasi antar langkah (multi-step) dan layout utama yang lebih bersih.
- `src/app/(user)/profile/submit-paper/EventList.tsx`: Redesain card event menjadi lebih minimalis dengan informasi yang lebih terstruktur.
- `src/app/(user)/profile/submit-paper/SubmissionForm.tsx`: Perubahan total menjadi form multi-step dengan transisi halus.
- `src/components/ui/stepper.tsx`: (Baru) Komponen pendukung untuk indikator langkah pada form.
- `src/app/(user)/profile/submit-paper/SubmissionTimeline.tsx`: (Baru) Komponen untuk menampilkan status progres paper yang sudah dikirim.

[Functions]
Pembaruan logika frontend untuk menangani validasi per langkah dan transisi state.

Detailed breakdown:
- `handleNextStep`: Mengatur transisi ke langkah berikutnya dengan validasi data di sisi client.
- `handlePrevStep`: Navigasi kembali tanpa kehilangan state data yang sudah diisi.
- `renderStepContent`: Fungsi switch untuk menampilkan konten form berdasarkan langkah aktif.
- `formatFileSize`: Utility baru untuk menampilkan ukuran file secara manusiawi di UI upload.

[Classes]
Penerapan utilitas Tailwind CSS yang lebih konsisten untuk gaya minimalis.

Detailed breakdown:
- Penggunaan `shadow-sm` dan `hover:shadow-md` dengan transisi halus (`duration-200`).
- Border tipis `border-slate-100` atau `border-slate-200` untuk memisahkan elemen.
- Penerapan `rounded-2xl` untuk elemen card agar terlihat modern namun tetap profesional.
- Tipografi: `font-heading` (Montserrat) untuk judul besar dan `font-sans` (Inter) untuk teks informatif.

[Dependencies]
Memanfaatkan library yang sudah ada secara maksimal.

- `lucide-react`: Untuk ikonografi minimalis.
- `framer-motion`: (Jika diizinkan/tersedia) Untuk animasi transisi antar langkah yang halus.
- `clsx` & `tailwind-merge`: Untuk manajemen class CSS yang dinamis.

[Testing]
Strategi validasi untuk memastikan integritas data dan fungsionalitas UI.

- Uji coba pengisian form multi-step dari awal hingga akhir.
- Validasi upload file (tipe file dan ukuran maksimal).
- Pengujian responsivitas pada layar mobile, tablet, dan desktop.
- Verifikasi sinkronisasi status paper setelah submission berhasil.

[Implementation Order]
Langkah-langkah logis untuk mengeksekusi redesain tanpa merusak fungsionalitas.

1. Persiapan komponen UI dasar (Stepper, Card minimalis).
2. Refactoring `ClientPage.tsx` untuk mendukung state multi-step.
3. Implementasi redesain `EventList.tsx` dengan gaya minimalis baru.
4. Pembangunan ulang `SubmissionForm.tsx` menjadi komponen multi-step.
5. Integrasi `SubmissionTimeline.tsx` untuk visualisasi status paper.
6. Final polishing: Penyesuaian spacing, warna, dan micro-interactions.