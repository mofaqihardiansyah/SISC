# Rancangan Implementasi UX/UI + User Feedback — SISC

## A. Problematika Saat Ini (SEBELUM Perbaikan)

Berdasarkan analisis kode awal, ada 3 masalah utama:

1. **Tidak ada design system** — warna, button, input, spacing tidak konsisten
2. **Feedback pattern kacau** — 3 varian feedback (sonner toast, react-hot-toast broken, custom modal, inline banner) campur aduk tanpa aturan
3. **12 action functions return value diabaikan** — user tidak lihat feedback sama sekali

---

## B. Matriks Feedback Pattern

Setiap action harus menggunakan **satu pattern yang tepat**, bukan asal pakai.

| Kategori Action | Feedback Pattern | Rationale |
|---|---|---|
| **Auth** (login, register, forgot/reset password, verify OTP) | **Toast** + Redirect | Multi-step flow |
| **Create Event** (form panjang) | **Inline field error** + **Success banner** | User butuh lihat error per-field |
| **Edit Event** (inline edit) | **Toast** | Action sederhana |
| **Daftar Event** (registrasi) | **Custom confirmation modal** | High-stakes |
| **Bookmark** (toggle) | **Silent visual** (icon fill change) | Low-stakes |
| **Submit Paper** (form + upload file) | **Progress bar upload** + **Form → confirmation card** | Upload butuh progress |
| **CRUD Master Data** (kategori, tag, provinsi, kota) | **Toast** + **Table refresh** | Simple one-click |
| **Approve/Reject Event** (admin) | **Toast** | Single action |
| **Approve/Reject Organizer** (admin) | **Toast** | Single action |
| **Hapus Data** (event, user, kategori) | **Confirmation dialog** + **Toast** | Destructive |
| **Update Profil / Password** | **Toast** | Simple form |
| **Upload File** (avatar, banner, dokumen) | **Progress indicator** + **Toast** | Upload feedback |
| **Page Navigation** | **Skeleton loader** | Layout tetap terlihat |
| **Error Jaringan** (fetch failed) | **Inline banner** (sticky top) | Pesan harus stay |

---

## C. Standarisasi Komponen (SUDAH DIIMPLEMENTASIKAN)

### 1. Design Tokens (`globals.css` — Tailwind v4 @theme)

```css
@theme {
  /* Brand Colors */
  --color-brand-dark: #0F172B;
  --color-brand-primary: #2563eb;
  --color-brand-primary-hover: #1d4ed8;
  --color-brand-accent: #7c3aed;
  --color-brand-success: #16a34a;
  --color-brand-warning: #d97706;
  --color-brand-error: #dc2626;
  --color-brand-surface: #f8fafc;
  --color-brand-text-primary: #1e293b;
  --color-brand-text-secondary: #64748b;
  --color-brand-text-muted: #94a3b8;
  /* SISC legacy colors tetap dipertahankan */
}
```

### 2. Component Tree (TERWUJUD)

```
components/
  ui/                       # Design system (15 komponen)
    Button.tsx              # variant: default|outline|secondary|ghost|destructive|success|link
                            # size: default|xs|sm|lg|icon
                            # + loading prop (spinner + auto-disable)
    Input.tsx               # Styled input (Base UI)
    FormField.tsx           # BARU: label + required * + error message
    Modal.tsx               # BARU: variant center|side|side-left
    Skeleton.tsx            # BARU: loading placeholder
    badge.tsx               # 6 variant
    status-badge.tsx        # Status dengan warna (sentence case)
    card.tsx, table.tsx, tabs.tsx, breadcrumb.tsx, stepper.tsx, Portal.tsx, input-otp.tsx, label.tsx

  feedback/                 # Feedback components (4 komponen — BARU)
    InlineBanner.tsx        # variant: success|error|warning|info + dismiss
    ConfirmationModal.tsx   # variant: danger|warning|info + loading state
    ProgressOverlay.tsx     # Progress bar + processed/total
    FormState.tsx           # Form → confirmation card transition
```

### 3. Hamburger Menu (SUDAH DIIMPLEMENTASIKAN)

```tsx
// Navbar.tsx — mobile drawer
const [mobileOpen, setMobileOpen] = useState(false);

<button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
  {mobileOpen ? <X /> : <Menu />}
</button>
```

---

## D. Status Implementasi

### P1 (Critical — Feedback broken/missing) — ✅ SELESAI

| # | Task | Files | Pattern | Status |
|---|---|---|---|---|
| 1 | Ganti `react-hot-toast` → `sonner` | `DataEvent.tsx`, `EditEvent.tsx`, `ClientPage.tsx`, `SubmissionForm.tsx` | Fix broken toast | ✅ |
| 2 | Feedback Categories/Locations CRUD | `CategoryClient.tsx`, `LocationClient.tsx` | Toast (12 action) | ✅ |
| 3 | Feedback Admin Persetujuan | `ClientPage.tsx` | Toast approve/reject | ✅ |
| 4 | Feedback Organizer Edit Event | `KelolaEventClient.tsx` | Toast | ✅ |

### P2 (UX/UI components) — ✅ SELESAI

| # | Task | Detail | Status |
|---|---|---|---|
| 5 | Design tokens | `brand-*` colors di `globals.css` | ✅ |
| 6 | Button.tsx reusable | variant + loading + success | ✅ |
| 7 | Input standardization | ~31 file, raw `<input>` → `<Input>` | ✅ |
| 8 | Skeleton.tsx | Loading placeholder | ✅ |
| 9 | Hamburger menu mobile | Navbar mobile drawer | ✅ |

### P2 Additional — ✅ SELESAI

| Task | Detail |
|------|--------|
| Button standardization | ~30 file, raw `<button>` → `<Button>` |
| FormField.tsx | Label + required + error |
| Modal.tsx | 3 variant (center, side, side-left) |
| Heading styles | 18 page → `text-3xl font-bold text-slate-900 tracking-tight` |
| Admin layout responsive | `p-8` → `p-4 md:p-6 lg:p-8` |
| Empty states | 5 file → `<EmptyState>` |
| Aria-label | Di semua icon-only buttons |
| All-caps → sentence case | Status badges, chart legends, filter labels |
| Detail event page | Back button + sidebar indicator |

### P3 (Feedback refinement) — ✅ SELESAI

| # | Task | Pattern | Status |
|---|---|---|---|
| 10 | InlineBanner component | success/error/warning/info + dismiss | ✅ |
| 11 | ConfirmationModal component | danger/warning/info + loading | ✅ |
| 12 | ProgressOverlay component | Progress bar + count | ✅ |
| 13 | FormState component | Form → confirmation card | ✅ |

### Remaining Work (BELUM)

| # | Task | Priority |
|---|---|---|
| 14 | Hapus `react-hot-toast` dari package.json | Low |
| 15 | Ganti hardcoded HEX colors → design tokens (25+ file) | Medium |
| 16 | Tambah error boundaries (`error.tsx`) | Medium |
| 17 | Standarisasi date formatting (pilih satu: date-fns atau toLocaleDateString) | Low |

---

## E. Contoh Implementasi per Pattern

### Pattern: Toast (untuk simple CRUD, auth, profile)

```tsx
const result = await addKategoriAction(nama);
if (result.success) {
  toast.success("Kategori berhasil ditambahkan");
} else {
  toast.error(result.error);
}
```

### Pattern: Inline Banner (untuk create/edit form kompleks)

```tsx
<InlineBanner variant="error" message={errorMsg} onDismiss={() => setErrorMsg(null)} />
```

### Pattern: Confirmation Modal (untuk delete)

```tsx
<ConfirmationModal
  open={showDeleteModal}
  title="Hapus Event"
  message="Apakah kamu yakin?"
  variant="danger"
  onConfirm={handleDelete}
  onCancel={() => setShowDeleteModal(false)}
/>
```

### Pattern: Form → Confirmation Card (untuk paper submit)

```tsx
<FormState submitted={submitted} successTitle="Paper Berhasil Disubmit!" successMessage="Akan direview oleh tim reviewer.">
  <Form ... />
</FormState>
```

### Pattern: Progress Overlay (untuk bulk action)

```tsx
<ProgressOverlay open={bulkProcessing} processed={5} total={10} message="Memproses..." />
```

### Pattern: Silent Visual (untuk bookmark)

```tsx
// BookmarkButton.tsx — icon fill change, tanpa toast
```

---

## F. Yang TIDAK Boleh Dilakukan

| ❌ Praktek Salah | ✅ Seharusnya | Alasan |
|---|---|---|
| Toast buat bookmark toggle | Silent icon change | Toast akan muncul setiap klik = spam |
| Modal buat simpan profil | Toast "Tersimpan" | Overkill, user harus klik tutup |
| Inline banner buat notif "Koneksi terputus" yang ilang 5 detik | Sticky banner sampai dismiss | Pesan penting harus stay |
| Toast buat error validasi form per-field | Inline error di bawah field | User perlu lihat error sambil perbaiki |
| Pakai react-hot-toast + sonner barengan | Pilih SATU (sonner) | Yang satunya silent broken |
| Nggak ngasih feedback sama sekali | Sesuai pattern di matriks | User bingung apakah action berhasil |
| ALL-CAPS text di UI (DISETUJUI, PUBLISHED) | Sentence case (Disetujui, Published) | Lebih mudah dibaca |
| Raw `<button>`/`<input>` langsung | Pakai `<Button>`/`<Input>` component | Konsistensi styling + aksesibilitas |
