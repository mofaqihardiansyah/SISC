# 🎨 POLIVENTS Style Guide & Design System

Panduan ini mendokumentasikan aturan visual, standarisasi komponen, skema warna, dan kebijakan ikon untuk menjaga konsistensi antarmuka (UI/UX) di seluruh project **POLIVENTS**. 

> [!IMPORTANT]
> **ATURAN MERGE TIM**
> Setiap anggota tim pengembang wajib mematuhi standar di bawah ini sebelum mengajukan *Pull Request* atau melakukan *Merge* perubahan.

---

## 1. Skema Warna (Dark Blue Minimalist Theme)

Skema warna POLIVENTS disatukan ke palet **Dark Blue (Biru Tua)** minimalis untuk menghadirkan kesan modern, profesional, dan berorientasi teknologi.

| Token Warna | Variabel CSS | Class Tailwind | Nilai Hex | Penggunaan Utama |
| :--- | :--- | :--- | :--- | :--- |
| **Primary** | `--primary` | `bg-primary` / `text-primary` | `#1E3A8A` (Biru Tua) | Tombol utama, header sidebar, teks dominan |
| **Primary Foreground** | `--primary-foreground` | `text-primary-foreground` | `#FFFFFF` | Teks di atas warna primary |
| **Secondary** | `--secondary` | `bg-secondary` / `text-secondary` | `#E2E8F0` (Slate 200) | Tombol sekunder, background badge aktif |
| **Background** | `--background` | `bg-background` | `#FFFFFF` | Latar belakang halaman / card |
| **Neutral Light** | `--muted` / `--accent` | `bg-slate-50` / `bg-slate-100` | `#F8FAFC` / `#F1F5F9` | Latar belakang sub-dashboard, panel samping |
| **Borders** | `--border` | `border-border` / `border-slate-200` | `#E2E8F0` (Slate 200) | Bingkai input, pembatas tabel, outline card |

---

## 2. Standarisasi Tombol (Standard Buttons)

Seluruh tombol di antarmuka harus menggunakan spesifikasi visual premium yang sama.

### 📐 Spesifikasi Tombol Utama & Sekunder:
- **Border Radius**: Wajib `rounded-xl` (12px). Jangan gunakan `rounded-md`, `rounded-lg`, atau `rounded-full` (kecuali untuk tombol lingkaran ikon).
- **Efek Transisi**: Gunakan `transition-all duration-200` agar transisi terasa responsif dan ringan.
- **Micro-Interaction (Scaling)**: Tambahkan class `hover:scale-[1.02] active:scale-[0.98]` untuk memberikan *haptic-feedback* visual saat diklik.
- **Bayangan (Shadow)**: Gunakan `shadow-sm hover:shadow-md`.

### ❌ Contoh Buruk (Vibe Coding):
```tsx
// JANGAN LAKUKAN INI! (Warna tidak beraturan, border-radius kecil, tidak ada transisi & scaling)
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
  Simpan
</button>
```

###  Contoh Benar (Standar Baru):
```tsx
// REKOMENDASI UTAMA: Gunakan komponen UI Button standar
import { Button } from "@/components/ui/button";

<Button variant="default" size="default">
  Simpan
</Button>

// Jika menggunakan tag HTML button mentah (misal kustomisasi khusus):
<button className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#1a3a8a] text-white rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md">
  Simpan
</button>
```

---

## 3. Kebijakan Ikon (No Keyboard Emojis!)

Untuk mempertahankan tampilan professional dan premium, **dilarang keras memasukkan emoji keyboard langsung ke dalam kode UI** (contoh: `📅`, `📋`, `🖼️`, `📎`, `🎨`, `🚀`).

### 🛠️ Solusi:
Gunakan library **`lucide-react`** yang sudah terinstal di dalam project.

| Emoji Keyboard | Lucide React Icon | Import Class |
| :---: | :---: | :--- |
| `📅` / `🗓️` | Calendar | `import { Calendar } from "lucide-react";` |
| `📋` | ClipboardList | `import { ClipboardList } from "lucide-react";` |
| `🖼️` | ImageIcon | `import { Image as ImageIcon } from "lucide-react";` |
| `📎` | Paperclip | `import { Paperclip } from "lucide-react";` |
| `🎨` | Palette | `import { Palette } from "lucide-react";` |
| `ℹ️` | Info | `import { Info } from "lucide-react";` |
| `🔗` | Link2 | `import { Link2 } from "lucide-react";` |

### ❌ Contoh Buruk:
```tsx
<div>📅 Senin, 7 Juni 2026</div>
```

###  Contoh Benar:
```tsx
import { Calendar } from "lucide-react";

<div className="flex items-center gap-2">
  <Calendar size={16} className="text-slate-400" />
  <span>Senin, 7 Juni 2026</span>
</div>
```

---

## 4. Animasi Transisi Halaman (Page Transitions)

Animasi transisi halaman CSS-only yang ringan telah ditambahkan ke dalam engine Tailwind. Setiap sub-dashboard halaman akan memudar masuk secara halus saat berpindah rute.

### Cara Penggunaan:
Pastikan membungkus layout utama halaman Anda atau div terluar component halaman dengan class **`animate-page-fade-in`**:
```tsx
export default function Page() {
  return (
    <div className="space-y-6 animate-page-fade-in">
      {/* Konten Halaman Anda */}
    </div>
  );
}
```
Animasi ini memanfaatkan `@keyframes fadeInUp` dengan durasi `0.35s` dan kurva percepatan *cubic-bezier* sehingga terasa sangat smooth dan tidak membebani performa browser.
