# Deployment — SISC

Panduan konfigurasi deployment untuk **Sistem Informasi Seminar & Conference (SISC)** di Vercel.

---

## Vercel Configuration

### `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/scrape",
      "schedule": "0 0 * * *"
    }
  ]
}
```

Cron job scraping berjalan setiap hari pukul 00:00 UTC.

### `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  serverExternalPackages: ["inngest", "playwright"],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Upload limit
    },
  },
};
```

---

## Environment Variables (required)

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/db"

# NextAuth
AUTH_SECRET="your-secret-key"

# Email (OTP)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your-blob-token"

# Inngest (Event-driven scraping)
INGEST_SIGNING_KEY="your-signing-key"
NEXT_PUBLIC_INNGEST_SIGNING_KEY="your-signing-key"

# App URL
NEXT_PUBLIC_URL="https://your-domain.vercel.app"
```

---

## Services

### 1. Database (PostgreSQL)
- **Local**: Docker Compose (`docker-compose.yml`) — PostgreSQL 16 Alpine
- **Production**: Vercel Postgres, Neon, Supabase, atau provider PostgreSQL lainnya
- Port local: `5433`
- Credentials local: `sisc_user` / `sisc_password` / `sisc_db`

### 2. File Storage (Vercel Blob)
Semua file upload menggunakan **Vercel Blob Store**:
- Avatar pengguna
- Banner event
- Dokumen legalitas penyelenggara
- File paper submission
- Gambar QRIS pembayaran

**Validasi keamanan**: Magic bytes check untuk mencegah upload file berbahaya. Mendukung:
- `image/jpeg` (FF D8 FF)
- `image/png` (89 50 4E 47)
- `image/webp` (52 49 46 46)
- `application/pdf` (25 50 44 46)

**Upload limits** (server-side):
- Avatar: 2MB
- Dokumen: 4MB
- Banner: 5MB
- Server Actions body: 10MB

### 3. Event Scraping (Inngest + Crawlee/Playwright)
Scraping otomatis dari **EventKampus.com**:
- **Trigger**: Vercel Cron (harian) dan Inngest event `app/scrape.start`
- **Engine**: Crawlee PlaywrightCrawler dengan fingerprint anti-bot
- **Concurrency**: 2 browser (RAM-friendly, cocok 8GB)
- **Timeout**: 60 detik per request
- **Storage**: Data scraping disimpan di `storage/` folder lokal

### 4. Authentication (NextAuth.js)
- JWT strategy
- Session max age: 24 jam
- Credentials provider dengan bcryptjs

---

## Build & Deploy

```bash
# Build production
npm run build

# Deploy ke Vercel (via Vercel CLI atau Git integration)
vercel --prod
```

**Important**: Pastikan semua environment variables terisi di dashboard Vercel sebelum deploy.

---

## Docker (Local Development)

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: sisc-postgres
    restart: always
    environment:
      POSTGRES_USER: sisc_user
      POSTGRES_PASSWORD: sisc_password
      POSTGRES_DB: sisc_db
    ports:
      - "5433:5432"
    volumes:
      - sisc-postgres-data:/var/lib/postgresql/data
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 128M
```

---

## Dependencies yang Perlu Dicatat

### Server External Packages (tidak di-bundle oleh Vercel)
- `inngest` — Event-driven task orchestration
- `playwright` — Browser automation untuk scraping

### Production Dependencies Utama
| Package | Versi | Fungsi |
|---------|-------|--------|
| `next` | 16.2.2 | Framework |
| `react` | 19.2.4 | UI Library |
| `next-auth` | 5.0.0-beta.31 | Authentication |
| `drizzle-orm` | 0.45.2 | ORM |
| `postgres` | 3.4.9 | Database driver |
| `@vercel/blob` | 2.4.0 | File storage |
| `inngest` | 4.4.0 | Task orchestration |
| `@crawlee/playwright` | 3.16.0 | Web scraping |
| `nodemailer` | 7.0.13 | Email (OTP) |
| `zod` | 4.3.6 | Validation |
| `sonner` | 2.0.7 | Toast notifications |
| `recharts` | 3.8.1 | Charts |
| `lucide-react` | 1.17.0 | Icons |
