# Paper Submission Feature Documentation

## Overview
Fitur Paper Submission memungkinkan pengunjung untuk mensubmit paper mereka ke konferensi yang tersedia di platform.

## Database Schema

### Table: `paper_submission`
```sql
CREATE TABLE paper_submission (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES event(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  judul VARCHAR NOT NULL,
  abstrak TEXT,
  penulis VARCHAR NOT NULL,
  email VARCHAR,
  file_url VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'submitted', -- submitted, accepted, rejected, reviewing
  feedback TEXT,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP
);
```

## File Structure

### Frontend Components

1. **`src/app/Profile/paper-submission/page.tsx`**
   - Halaman list konferensi yang menerima submission paper
   - Menampilkan daftar conference dengan tombol "Buka"
   - Fetch data dari `/api/events?type=conference`

2. **`src/app/Profile/paper-submission/[conferenceId]/page.tsx`**
   - Halaman detail untuk upload paper ke konferensi tertentu
   - Form untuk input: judul, abstrak, penulis, email, file
   - Fetch data dari `/api/events/{conferenceId}`
   - Submit ke `/api/paper-submission`

3. **`src/components/profile/PaperSubmissionComponents.tsx`**
   - Komponen reusable untuk paper submission UI:
     - `PaperSubmissionCard`: Card untuk display paper yang sudah disubmit
     - `PaperSubmissionList`: List paper submissions dengan status
     - `PaperUploadForm`: Form untuk upload paper

4. **`src/components/profile/Sidebar.tsx`**
   - Menu "Submit Paper" ditambahkan ke navigation sidebar

## API Endpoints Required

### 1. Get Conferences List
```
GET /api/events?type=conference
Response:
{
  "events": [
    {
      "id": 1,
      "judul": "Conference Title",
      "deskripsi": "Description",
      "tanggalMulai": "2026-06-15T09:00:00",
      "tanggalSelesai": "2026-06-17T17:00:00",
      "detailLokasi": "Location",
      "kuota": 500,
      "jenisEvent": "conference"
    }
  ]
}
```

### 2. Get Conference Details
```
GET /api/events/{conferenceId}
Response:
{
  "id": 1,
  "judul": "Conference Title",
  "deskripsi": "Description",
  "tanggalMulai": "2026-06-15T09:00:00",
  "tanggalSelesai": "2026-06-17T17:00:00",
  "detailLokasi": "Location",
  "jenisEvent": "conference"
}
```

### 3. Submit Paper
```
POST /api/paper-submission
Content-Type: multipart/form-data

Request:
- file: File (PDF, max 10MB)
- judul: string
- abstrak: string
- penulis: string
- email: string
- eventId: number

Response:
{
  "id": 1,
  "eventId": 1,
  "userId": 123,
  "judul": "Paper Title",
  "status": "submitted",
  "fileUrl": "https://...",
  "dibuatPada": "2026-05-10T10:00:00"
}

Error Response:
{
  "error": "Error message"
}
```

### 4. Get User Paper Submissions
```
GET /api/paper-submission/user
Response:
{
  "submissions": [
    {
      "id": 1,
      "judul": "Paper Title",
      "konferensi": "Conference Name",
      "penulis": "Author Name",
      "status": "reviewing",
      "tanggalSubmit": "2026-05-10T10:00:00",
      "feedback": null
    }
  ]
}
```

### 5. Get Paper Submission Details
```
GET /api/paper-submission/{paperId}
Response:
{
  "id": 1,
  "eventId": 1,
  "judul": "Paper Title",
  "abstrak": "Abstract",
  "penulis": "Author",
  "email": "author@email.com",
  "fileUrl": "https://...",
  "status": "reviewing",
  "feedback": null,
  "dibuatPada": "2026-05-10T10:00:00"
}
```

## Implementation Notes

### File Upload
- Maximum file size: 10MB
- Supported format: PDF only
- Store files using UploadThing (sudah ada di project)
- Simpan URL file di database

### Validation
- Email format validation
- File type & size validation di frontend dan backend
- Require abstract minimal 100 characters (optional)
- Require all fields sebelum submit

### User Experience
- Show loading state saat upload
- Show success message setelah submit
- Redirect ke list confer setelah 2 detik
- Clear form setelah successful submission

### Status Flow
```
submitted → reviewing → accepted/rejected
                    ↓
                feedback
```

## Database Migration Script

```typescript
// File: drizzle/[number]_add_paper_submission.sql
CREATE TABLE IF NOT EXISTS paper_submission (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  judul VARCHAR NOT NULL,
  abstrak TEXT,
  penulis VARCHAR NOT NULL,
  email VARCHAR,
  file_url VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'submitted',
  feedback TEXT,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP,
  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_paper_submission_user_id ON paper_submission(user_id);
CREATE INDEX idx_paper_submission_event_id ON paper_submission(event_id);
```

## Future Enhancements

1. **Admin Dashboard**
   - Review paper submissions
   - Accept/reject dengan feedback
   - Export paper list

2. **Notifications**
   - Email notification saat status berubah
   - In-app notifications untuk user

3. **Paper History**
   - Show all submissions dengan history perubahan status
   - Download paper yang sudah disubmit

4. **Multiple Authors**
   - Support untuk co-authors
   - Author affiliation

5. **Paper Revision**
   - Allow user untuk resubmit if rejected
   - Track revision history
