# Authentication & Authorization — SISC

Sistem autentikasi dan otorisasi untuk **Sistem Informasi Seminar & Conference (SISC)**.

---

## Stack

- **Library**: NextAuth.js v5 (`next-auth@^5.0.0-beta.31`)
- **Provider**: Credentials (email + password)
- **Strategy**: JWT-based sessions
- **Password Hashing**: bcryptjs (`bcrypt.compare`)
- **Email Verification**: OTP system via nodemailer

---

## Auth Flow

### 1. Registrasi
1. User mengisi form registrasi (nama, email, password, role)
2. Sistem mengirim OTP 6 digit ke email
3. User verifikasi OTP di `/register/verify`
4. `email_terverifikasi` di-set, user bisa login

### 2. Login
1. POST credentials ke NextAuth endpoint
2. Validasi: email exists → akun tidak diblokir → email terverifikasi (non-admin) → password match
3. JWT token dibuat dengan claims: `id`, `role`, `image`
4. Session disimpan di cookie (httpOnly)

### 3. Session Management
- Session max age: 24 jam (`AUTH.SESSION_MAX_AGE_SECONDS`)
- Refresh otomatis via JWT callback
- Session tersedia via `auth()` (server) dan `useSession()` (client)

---

## Route Protection

Middleware `proxy.ts` menggunakan Next.js 16 `matcher`:

```typescript
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### Access Rules (di `auth.config.ts`)

| Route | Role Required | Behavior |
|-------|---------------|----------|
| `/admin/*` | `admin` | Non-admin diarahkan ke dashboard masing-masing |
| `/penyelenggara/*` | `organizer` atau `admin` | Visitor diarahkan ke `/` |
| `/profile/*` | Semua login | Redirect ke `/login` jika belum login |
| `/registrasi-event/*` | Semua login | Redirect ke `/login` jika belum login |
| `/login`, `/register` | Guest only | Redirect ke dashboard jika sudah login |
| `/forgot-password`, `/reset-password` | Public | Bisa diakses siapa saja |

### Redirect Rules (Logged-in Users)

| Role | Auth Page Redirect |
|------|--------------------|
| `visitor` | `/` |
| `organizer` | `/penyelenggara` |
| `admin` | `/admin/dashboard` |

---

## OTP System

Tabel `otp_codes` menyimpan kode verifikasi:

- 6 digit numeric code
- Memiliki masa berlaku (`kedaluwarsa_pada`)
- Dihapus setelah verifikasi
- Dikirim via nodemailer (SMTP Gmail)

---

## JWT Token Structure

```typescript
// jwt callback
token = {
  role: "admin" | "organizer" | "visitor",
  id: number,
  picture: string, // urlAvatar
  sub: string,      // user.id
}

// session callback
session.user = {
  id: string,
  role: "admin" | "organizer" | "visitor",
  image: string,   // urlAvatar
  name: string,    // namaLengkap
  email: string,
}
```

---

## Auth Components

| File | Path | Fungsi |
|------|------|--------|
| `auth.ts` | `src/auth.ts` | NextAuth config + Credentials provider |
| `auth.config.ts` | `src/auth.config.ts` | Callbacks, JWT, authorized logic |
| `proxy.ts` | `src/proxy.ts` | Middleware export |
| `providers.tsx` | `src/providers.tsx` | Client-side SessionProvider |
| `auth-layout.tsx` | `src/components/auth/` | Layout untuk halaman auth |

---

## Environment Variables

```env
AUTH_SECRET="your-secret-key"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"
```
