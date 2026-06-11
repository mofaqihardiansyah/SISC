# UX Feedback Patterns — SISC

Panduan pola feedback untuk setiap interaksi pengguna di **Sistem Informasi Seminar & Conference (SISC)**.

---

## Matriks Feedback Pattern

Setiap action harus menggunakan **satu pattern yang tepat** berdasarkan jenis dan konteksnya.

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

## Implementasi per Pattern

### 1. Toast (sonner)
Untuk simple CRUD, auth, profile update.

```tsx
import { toast } from "sonner";

const result = await addKategoriAction(nama);
if (result.success) {
  toast.success("Kategori berhasil ditambahkan");
} else {
  toast.error(result.error);
}
```

> **Catatan**: Migrasi dari `react-hot-toast` ke `sonner` sudah selesai di 4 file. `react-hot-toast` masih ada di package.json tapi tidak digunakan.

### 2. Inline Banner
Untuk error form kompleks, network error.

```tsx
<InlineBanner variant="error" message={errorMsg} onDismiss={() => setErrorMsg(null)} />
```

Variants: `success`, `error`, `warning`, `info` — dengan tombol dismiss.

### 3. Confirmation Modal
Untuk delete dan destructive actions.

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

Variants: `danger`, `warning`, `info`. Mendukung loading state.

### 4. Form → Confirmation Card (FormState)
Untuk paper submit dan form multi-step.

```tsx
<FormState submitted={submitted} successTitle="Paper Berhasil Disubmit!" successMessage="Akan direview oleh tim reviewer.">
  <Form ... />
</FormState>
```

Transisi otomatis dari form ke confirmation card setelah submit sukses.

### 5. Progress Overlay
Untuk bulk action processing.

```tsx
<ProgressOverlay open={bulkProcessing} processed={5} total={10} message="Memproses..." />
```

Menampilkan progress bar + `processed/total (percentage%)`.

### 6. Silent Visual
Untuk low-stakes toggle actions (bookmark, favorit).

```tsx
// BookmarkButton.tsx — icon fill change, tanpa toast
```

---

## Status Implementasi

### P1 — Critical (Feedback broken/missing) — SELESAI

| Task | Files | Pattern |
|------|-------|---------|
| Ganti `react-hot-toast` → `sonner` | `DataEvent.tsx`, `EditEvent.tsx`, `ClientPage.tsx`, `SubmissionForm.tsx` | Toast |
| Feedback Categories/Locations CRUD | `CategoryClient.tsx`, `LocationClient.tsx` | Toast (12 action) |
| Feedback Admin Persetujuan | `ClientPage.tsx` | Toast approve/reject |
| Feedback Organizer Edit Event | `KelolaEventClient.tsx` | Toast |

### P2 — Design System — SELESAI

| Task | Detail |
|------|--------|
| Design tokens | brand-* colors |
| Button.loading | Spinner + auto-disable |
| Input standardization | 31 file → `<Input>` |
| Button standardization | 30 file → `<Button>` + aria-label |
| FormField, Modal, Skeleton | 3 komponen baru |
| Heading konsisten | 18 pages |
| Empty states | 5 pages |
| All-caps → sentence case | Badges, legends, labels |
| Hamburger menu mobile | Navbar drawer |

### P3 — Feedback Components — SELESAI

| Komponen | File |
|----------|------|
| InlineBanner | `feedback/InlineBanner.tsx` |
| ConfirmationModal | `feedback/ConfirmationModal.tsx` |
| ProgressOverlay | `feedback/ProgressOverlay.tsx` |
| FormState | `feedback/FormState.tsx` |

---

## Yang TIDAK Boleh Dilakukan

| Praktek Salah | Seharusnya | Alasan |
|---|---|---|
| Toast buat bookmark toggle | Silent icon change | Toast akan muncul setiap klik = spam |
| Modal buat simpan profil | Toast "Tersimpan" | Overkill, user harus klik tutup |
| Inline banner buat error yang ilang 5 detik | Sticky banner sampai dismiss | Pesan penting harus stay |
| Toast buat error validasi per-field | Inline error di bawah field | User perlu lihat error sambil perbaiki |
| Pakai react-hot-toast + sonner barengan | Pilih SATU (sonner) | Yang satunya silent broken |
| Nggak ngasih feedback sama sekali | Sesuai pattern di matriks | User bingung apakah action berhasil |
