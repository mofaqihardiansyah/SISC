# 📋 POLIVENTS Web Scraping System - Kritik, Saran & Roadmap Perbaikan

**Document Version:** 1.0  
**Last Updated:** June 20, 2026  
**Author:** Critical System Review  
**Status:** Actionable Recommendations

---

## 📑 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Critical Issues](#critical-issues)
4. [Missing Features](#missing-features)
5. [UI/UX Improvements](#uiux-improvements)
6. [Technical Recommendations](#technical-recommendations)
7. [Configuration Panel Design](#configuration-panel-design)
8. [Database Schema Extensions](#database-schema-extensions)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Testing & Quality Assurance](#testing--quality-assurance)
11. [Monitoring & Logging](#monitoring--logging)

---

## Executive Summary

### ⚠️ Current Status: **INCOMPLETE IMPLEMENTATION**

Tech stack sudah sophisticated (Cheerio + Crawlee/Playwright, Inngest, Zod, Confidence Scoring), **tetapi admin UI hanya menampilkan hasil scraping tanpa kemampuan konfigurasi**.

### 🔴 Severity Distribution

| Level | Count | Examples |
|-------|-------|----------|
| 🔴 Critical | 6 | Configuration panel missing, no error visibility, hardcoded settings |
| 🟡 Major | 8 | Data quality visibility, raw data comparison, bulk operations |
| 🟠 Minor | 5 | UI polish, additional metrics, accessibility |

### 💡 Bottom Line

**Sistem scraping sekarang seperti "black box"** - data keluar saja, admin tidak bisa:
- ✅ Memilih website apa yang discrape
- ✅ Mengatur jadwal scraping
- ✅ Konfigurasi validation rules
- ✅ Adjust confidence thresholds
- ✅ Debug kegagalan scraping
- ✅ Melihat raw data vs cleaned data

---

## Current State Analysis

### ✅ What Works

#### **Backend Infrastructure (Solid)**
```
Tech Stack Yang Ada:
├─ Dual Scraper System
│  ├─ Cheerio (v1.2.0): Serverless-safe, lightweight HTML parsing
│  └─ Crawlee + Playwright (v3.16.0): JavaScript execution, complex rendering
│
├─ Data Processing
│  ├─ Zod Validation: Schema validation untuk raw data
│  ├─ Auto-Cleaning Service: Regex-based normalization
│  └─ Confidence Scoring: Perhitungan tingkat kepercayaan data
│
├─ Infrastructure
│  ├─ Inngest (v4.4.0): Event-driven serverless queue
│  ├─ Cron Jobs: API Route (`/api/cron/scrape`)
│  └─ PostgreSQL JSONB: Raw data storage
│
└─ Database
   └─ Drizzle ORM (v0.45.2): Type-safe SQL queries
```

**Assessment:** Backend sudah mature dan capable.

#### **Frontend UI (Partial)**
```
Halaman Manajemen Scraping:
├─ ✅ Data table dengan 78 items
├─ ✅ Search by event title
├─ ✅ Filter by status (dropdown)
├─ ✅ Action buttons (Detail & Terbit)
├─ ✅ Publish Auto-Approved button
├─ ✅ Start New Scraping button
└─ ⚠️ Activity log (sparse, hanya 4 entries)

Detail/Edit Modal:
├─ ✅ Event form dengan fields lengkap
├─ ✅ Dropdown untuk Kota & Kategori
├─ ⚠️ Tapi banyak field kosong (manual fill required)
└─ ❌ Tanpa confidence score, raw data preview, validation feedback
```

**Assessment:** Frontend minimal, hanya untuk publish data yang sudah di-scrape.

---

### ❌ What's Missing

#### **Admin Configuration Panel**
- ❌ Scraping source management
- ❌ Scheduler/cron configuration
- ❌ Validation rules configuration
- ❌ Confidence threshold settings
- ❌ Auto-approval rules
- ❌ Filter/exclusion rules
- ❌ Rate limiting & retry policy settings
- ❌ Scraper type selection (Cheerio vs Crawlee)

#### **Data Quality & Debugging**
- ❌ Confidence score visibility
- ❌ Raw data vs cleaned data comparison
- ❌ Field-level confidence indicators
- ❌ Error messages & failure reasons
- ❌ Validation feedback per field
- ❌ Data transformation history

#### **Operational Features**
- ❌ Bulk operations (approve, reject, delete)
- ❌ Retry mechanism with UI
- ❌ Dry-run / test scraping
- ❌ Performance metrics & analytics
- ❌ Advanced filtering (by source, date, confidence)
- ❌ Reject/delete actions in detail modal

---

## Critical Issues

### 🔴 Issue #1: No Scraping Configuration Panel

**Severity:** CRITICAL  
**Impact:** Operator tidak bisa customize scraping behavior

#### Problem
```
Sekarang:
┌─────────────────────────┐
│ Admin Dashboard         │
├─────────────────────────┤
│ [Mulai Scraping Baru]   │ ← Click, tapi apa? Config mana?
│ [Publish Auto-Approved] │ ← Threshold settings mana?
│                         │
│ [Data Table]            │ ← Hanya hasil saja
└─────────────────────────┘

Seharusnya:
┌──────────────────────────────────────┐
│ Admin Dashboard                      │
├──────────────────────────────────────┤
│ [Settings] [Sources] [Rules] [Logs]  │
│                                      │
│ Sources Tab:                         │
│ ├─ eventkampus.com (Active)          │
│ │  ├─ Scraper: Cheerio               │
│ │  ├─ Schedule: Every 6 hours        │
│ │  ├─ Last run: 2 hours ago          │
│ │  └─ [Edit] [Test] [Delete]         │
│ ├─ (+ Add Source)                    │
│                                      │
│ Rules Tab:                           │
│ ├─ Min Confidence: 75%               │
│ ├─ Auto-publish if: >= 85%           │
│ ├─ Required fields: [Title, Date]    │
│ └─ [Save]                            │
└──────────────────────────────────────┘
```

#### Root Cause
- Semua config hardcoded di backend code
- No database table untuk `scraping_sources`, `scraping_rules`, dll
- No admin UI untuk CRUD operations

#### Solution
**Buat scraping configuration management system** (lihat [Configuration Panel Design](#configuration-panel-design))

---

### 🔴 Issue #2: Zero Confidence Score Visibility

**Severity:** CRITICAL  
**Impact:** Admin publish data tanpa tahu kualitasnya

#### Problem
```
Tech stack ada:
├─ Confidence scoring calculation di cleaner.ts ✅
└─ JSONB raw data storage ✅

Tapi UI:
├─ Tidak show confidence score ❌
├─ Tidak show field-level confidence ❌
├─ Tidak show why score rendah ❌
└─ Admin publish "sembarangan" ❌

Contoh ideal:
┌──────────────────────────────────────┐
│ Event: WEBINAR NASIONAL ... #4 2023   │
├──────────────────────────────────────┤
│ Overall Confidence: 78% ⚠️            │
│                                      │
│ Field Breakdown:                     │
│ ├─ Title: 95% ✅ (matched perfectly) │
│ ├─ Date: 65% ⚠️ (ambiguous format)   │
│ ├─ Location: 0% ❌ (not found)       │
│ ├─ Category: 82% ✅ (auto-matched)   │
│ └─ Description: 70% ⚠️ (partial)     │
│                                      │
│ Issues Detected:                     │
│ • Location field empty               │
│ • Date format inconsistent           │
│ • HTML tags in description           │
└──────────────────────────────────────┘
```

#### Root Cause
- Confidence score calculated but not displayed
- Frontend tidak query confidence metadata
- Modal form tidak show field-level indicators

#### Solution
**Expose confidence scoring di admin UI** dengan visual indicators (badges, colors, tooltips)

---

### 🔴 Issue #3: No Raw Data vs Cleaned Data Comparison

**Severity:** CRITICAL  
**Impact:** Admin tidak bisa validate kalau parsing benar

#### Problem
```
Backend menyimpan:
├─ raw_scraped_data table (JSONB: raw HTML payload) ✅
└─ event table (cleaned, normalized) ✅

Frontend menampilkan:
├─ Hanya cleaned data ❌
├─ Tidak ada raw data visibility ❌
├─ Tidak ada before/after comparison ❌

Contoh kasus:
Raw HTML dari website:
<div class="event-item">
  <h2>WEBINAR NASIONAL  EKSPEDISI   SERIBU PULAU #4   2023</h2>
  <span class="date">19 - Jun - 2026</span>
  <p>Lokasi: <a href="#">Gedung Olahraga Senayan, Jakarta</a></p>
</div>

Setelah cleaning:
{
  "title": "WEBINAR NASIONAL EKSPEDISI SERIBU PULAU #4 2023",
  "date_start": "2026-06-19",
  "location": "Gedung Olahraga Senayan, Jakarta"
}

Admin perlu tahu:
❓ Apakah title parsing benar?
❓ Berapa confidence score-nya?
❓ Apakah ada text yang hilang?
❓ Apakah normalisasi tanggal valid?

Sekarang: TIDAK BISA VALIDASI
```

#### Root Cause
- Frontend hanya query cleaned event data
- Raw JSONB data tidak di-expose di API
- No comparison view/modal

#### Solution
**Buat comparison tab/modal** untuk side-by-side view raw vs cleaned data

---

### 🔴 Issue #4: Hardcoded Configuration Settings

**Severity:** CRITICAL  
**Impact:** Tidak bisa adjust scraping behavior tanpa code deployment

#### Problem
```
Sekarang di backend code:

src/lib/scraper/cleaner.ts:
├─ Confidence threshold: hardcoded values ❌
├─ Regex patterns: hardcoded ❌
└─ Field validation rules: hardcoded ❌

src/app/api/cron/scrape/route.ts:
├─ Schedule: hardcoded cron expression ❌
├─ Rate limiting: hardcoded delay ❌
├─ Retry policy: hardcoded attempts ❌
├─ User-Agent: hardcoded string ❌
└─ Timeout: hardcoded milliseconds ❌

Auto-approval logic:
├─ Confidence threshold: hardcoded ❌
└─ Auto-publish conditions: hardcoded ❌

Result: Admin TIDAK BISA ubah behavior tanpa developer deploy ulang
```

#### Root Cause
- Konfigurasi langsung di code, bukan di database
- No `scraping_config` atau `scraping_rules` table
- No admin UI untuk manage settings

#### Solution
**Migrate semua configuration ke database** dengan admin CRUD interface

---

### 🔴 Issue #5: No Error/Failure Visibility

**Severity:** CRITICAL  
**Impact:** Admin tidak tahu kenapa scraping gagal

#### Problem
```
Semua status di table: "PROCESSED" ✅

Tapi bagaimana dengan:
❌ FAILED items? (Tidak terlihat)
❌ Error messages? (Tidak ada)
❌ Retry attempts? (Invisible)
❌ Rate limit hits? (Silent)
❌ Validation failures? (No feedback)

Activity Log hanya 4 entries untuk 78 data:
├─ Terlalu sparse ❌
├─ Tidak detail ❌
└─ Tidak actionable ❌
```

#### Root Cause
- Logging infrastructure incomplete
- No error tracking/display in UI
- Activity log queries tidak comprehensive

#### Solution
**Implement comprehensive logging & error tracking system** dengan detailed UI

---

### 🔴 Issue #6: Form Has Many Empty Fields Requiring Manual Fill

**Severity:** CRITICAL  
**Impact:** Auto-scraping becomes semi-manual workflow

#### Problem
```
Detail modal form fields:

✅ Auto-populated:
├─ Judul Event: "WEBINAR NASIONAL EKSPEDISI SERIBU PULAU #4 2023"
├─ Tanggal Mulai: "19/06/2026"
└─ Jenis Event: "Seminar"

❌ Empty, requires manual fill:
├─ Kota: [Pilih Kota...] ← dropdown, admin must select
├─ Kategori: [Pilih Kategori...] ← dropdown, admin must select
├─ Detail Lokasi: [placeholder] ← completely empty
├─ Platform: [Belum Ditentukan] ← empty, no auto-detection
└─ Tanggal Selesai: [optional but empty]

Result: 
Supposed to be AUTO-SCRAPING tapi admin harus manual fill 40% fields
= Defeats purpose of automation
```

#### Root Cause
- Scraper tidak extract semua fields
- No field mapping configuration
- No auto-suggestion/matching logic

#### Solution
**Improve scraper extraction logic** + **add field auto-suggestion feature**

---

## Missing Features

### 🟡 Feature #1: Scraping Sources Management

**Priority:** CRITICAL  
**Effort:** MEDIUM

#### Description
Admin bisa manage website sources yang akan di-scrape dengan UI.

#### Requirements
```
Functionality:
✓ View list of active scraping sources
✓ Add new scraping source (URL pattern, selectors, etc)
✓ Edit source configuration
✓ Enable/disable sources
✓ Delete sources
✓ Test scrape per source
✓ View last scrape details (date, count, status)

Fields per source:
├─ Source name
├─ Base URL / domain
├─ URL patterns (regex or wildcard)
├─ Scraper type (Cheerio / Crawlee+Playwright)
├─ Schedule (cron expression or preset: every 6h, daily, etc)
├─ Max results per run
├─ Rate limiting (delay between requests, concurrent limit)
├─ Active/inactive toggle
├─ Last scraped timestamp
├─ Last success count
└─ Last error message
```

#### UI Mockup
```
┌────────────────────────────────────────────────┐
│ Scraping Sources Management                    │
├────────────────────────────────────────────────┤
│ [+ Add New Source]                             │
│                                                │
│ Source | Schedule | Scraper | Last Scrape | Status │
├────────────────────────────────────────────────┤
│ eventkampus.com                                │
│ │ Every 6h | Cheerio | 2h ago | ✅ Active     │
│ │ Results: 78 items | Errors: 0               │
│ │ [Edit] [Test Scrape] [Delete]               │
│                                                │
│ (+ Add New Source)                             │
└────────────────────────────────────────────────┘
```

#### Database Schema
```sql
CREATE TABLE scraping_sources (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  base_url VARCHAR(500) NOT NULL,
  url_patterns TEXT[], -- regex or wildcards
  scraper_type ENUM('cheerio', 'crawlee_playwright'),
  cron_schedule VARCHAR(100),
  max_results_per_run INT DEFAULT 100,
  rate_limit_delay_ms INT DEFAULT 1000,
  max_concurrent_requests INT DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  last_scraped_at TIMESTAMP,
  last_successful_count INT,
  last_error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scraping_source_selectors (
  id UUID PRIMARY KEY,
  source_id UUID REFERENCES scraping_sources,
  field_name VARCHAR(100), -- title, date, location, etc
  css_selector VARCHAR(500),
  attribute VARCHAR(100), -- text, href, data-*, etc
  regex_pattern VARCHAR(500),
  confidence_weight NUMERIC(3,2), -- weight dalam scoring
  created_at TIMESTAMP
);
```

---

### 🟡 Feature #2: Validation Rules Management

**Priority:** CRITICAL  
**Effort:** MEDIUM

#### Description
Admin bisa configure validation rules untuk scraped data.

#### Requirements
```
Rules yang bisa dikonfigure:
├─ Required fields: title, date, location, category, etc
├─ Field format: min/max length, regex pattern, date format
├─ Confidence thresholds: per field, overall
├─ Category whitelist/blacklist
├─ Location validation (kota must exist in DB)
├─ Date range validation
├─ HTML/text cleanup rules
└─ Custom validation logic

Auto-approval conditions:
├─ If overall confidence >= 85% → auto-publish
├─ If all required fields present → auto-publish
├─ If confidence >= 75% AND no validation errors → publish with review
├─ Else → hold for manual review
```

#### UI Mockup
```
┌────────────────────────────────────────────────┐
│ Validation Rules & Auto-Approval Config        │
├────────────────────────────────────────────────┤
│                                                │
│ 📋 Field Validation Rules                      │
│                                                │
│ Title:                                         │
│ ├─ Required: [ON/OFF toggle]                   │
│ ├─ Min length: [10] chars                      │
│ ├─ Max length: [500] chars                     │
│ └─ Pattern: [any] dropdown                     │
│                                                │
│ Date:                                          │
│ ├─ Required: [ON/OFF]                          │
│ ├─ Format: [DD/MM/YYYY] dropdown               │
│ └─ Allow past dates: [OFF] toggle              │
│                                                │
│ Location:                                      │
│ ├─ Required: [ON/OFF]                          │
│ ├─ Must match Kota in DB: [ON]                 │
│ └─ Confidence threshold: [70%] slider          │
│                                                │
│ Category:                                      │
│ ├─ Required: [ON/OFF]                          │
│ ├─ Whitelist: [Seminar, Workshop, ...] checkboxes
│ └─ Confidence threshold: [80%] slider          │
│                                                │
│ ─────────────────────────────────────────────  │
│                                                │
│ 🤖 Auto-Approval Rules                        │
│                                                │
│ [ ] Auto-publish if overall confidence >= [85]% │
│ [ ] Auto-publish if all required fields OK      │
│ [ ] Manual review if confidence 75-85%          │
│ [ ] Reject if confidence < 50%                  │
│                                                │
│ [Save] [Reset to Default]                      │
└────────────────────────────────────────────────┘
```

#### Database Schema
```sql
CREATE TABLE scraping_validation_rules (
  id UUID PRIMARY KEY,
  field_name VARCHAR(100),
  is_required BOOLEAN DEFAULT true,
  min_length INT,
  max_length INT,
  regex_pattern VARCHAR(500),
  date_format VARCHAR(50),
  allow_past_dates BOOLEAN DEFAULT false,
  confidence_threshold NUMERIC(3,2),
  created_at TIMESTAMP
);

CREATE TABLE scraping_auto_approval_rules (
  id UUID PRIMARY KEY,
  rule_name VARCHAR(255),
  condition_type ENUM('confidence', 'required_fields', 'no_errors'),
  threshold_value NUMERIC(5,2),
  auto_publish BOOLEAN,
  require_manual_review BOOLEAN,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP
);
```

---

### 🟡 Feature #3: Filter & Exclusion Rules

**Priority:** HIGH  
**Effort:** MEDIUM

#### Description
Admin bisa set whitelist/blacklist rules untuk scraping.

#### Requirements
```
Filters:
├─ Title filters: exclude keywords (spam, test, demo, etc)
├─ Date filters: exclude past dates, far future dates
├─ Location filters: include/exclude specific locations
├─ Category filters: only scrape certain categories
├─ Confidence filters: only accept scores >= threshold
└─ Source filters: only scrape specific sources

Exclusion examples:
├─ Title contains: "SPAM", "TEST", "DUMMY" → skip
├─ Event date is past → skip
├─ Location not in [Semarang, Jakarta, Bandung] → skip
├─ Category not in [Seminar, Workshop, Conference] → skip
├─ Confidence < 60% → skip (or hold for review)
```

#### UI Mockup
```
┌────────────────────────────────────────────────┐
│ Scraping Filters & Exclusion Rules             │
├────────────────────────────────────────────────┤
│                                                │
│ 🚫 Title Filters                               │
│                                                │
│ Exclude titles containing:                     │
│ [spam] [test] [demo] [promo] [X] [+ Add]       │
│                                                │
│ Include titles matching:                       │
│ [seminar] [workshop] [conference] [X] [+ Add]  │
│                                                │
│ ─────────────────────────────────────────────  │
│                                                │
│ 📅 Date Filters                                │
│                                                │
│ ☑ Exclude past dates                           │
│ ☑ Exclude dates too far in future (> 2 years)  │
│                                                │
│ ─────────────────────────────────────────────  │
│                                                │
│ 📍 Location Filters                            │
│                                                │
│ Include locations: [dropdown: select cities]   │
│ Exclude locations: [Terpencil] [X] [+ Add]     │
│                                                │
│ ─────────────────────────────────────────────  │
│                                                │
│ 🏷️ Category Filters                            │
│                                                │
│ Only scrape categories: [checkboxes for all]   │
│ ☑ Seminar                                      │
│ ☑ Workshop                                     │
│ ☑ Conference                                   │
│ ☐ Competition                                  │
│                                                │
│ [Save] [Reset to Default]                      │
└────────────────────────────────────────────────┘
```

---

### 🟡 Feature #4: Data Quality Dashboard & Analytics

**Priority:** HIGH  
**Effort:** MEDIUM-HIGH

#### Description
Real-time metrics dan analytics tentang scraping performance.

#### Metrics to Display
```
📊 Overall Metrics:
├─ Total scraped events (today, week, month)
├─ Success rate (%)
├─ Average confidence score
├─ Failed scrapes (count, %)
├─ Processing time stats (min, avg, max)
└─ Error distribution

📈 Trends:
├─ Scraping volume over time (chart)
├─ Confidence score distribution (histogram)
├─ Error types over time
└─ Source performance comparison (table)

🔴 Recent Issues:
├─ Top 5 common errors
├─ Failed scraping runs
├─ Low confidence items (< threshold)
└─ Items requiring manual review
```

#### UI Mockup
```
┌────────────────────────────────────────────────┐
│ Scraping Performance Dashboard                 │
├────────────────────────────────────────────────┤
│                                                │
│ 📊 Today's Stats                               │
│                                                │
│ ┌──────────┬──────────┬──────────┐             │
│ │ Scraped  │ Success  │ Avg      │             │
│ │ 125      │ 94.4%    │ 82.5%    │             │
│ │ items    │ rate     │ confidence
│ └──────────┴──────────┴──────────┘             │
│                                                │
│ 📈 Confidence Score Distribution               │
│                                                │
│ 90-100%: ████████████████ 45 items (36%)       │
│ 75-90%:  ███████████ 28 items (22%)            │
│ 60-75%:  ████████ 20 items (16%)               │
│ < 60%:   ███ 12 items (10%)                    │
│ Failed:  ██ 10 items (8%)                      │
│                                                │
│ 🔴 Recent Issues                               │
│                                                │
│ Error Type          | Count | Last Occurrence │
│ ─────────────────────────────────────────────  │
│ Rate limit hit      | 5     | 1 hour ago      │
│ Timeout             | 3     | 2 hours ago     │
│ Invalid date format | 7     | 30 min ago      │
│ Missing location    | 12    | 15 min ago      │
│                                                │
│ 📊 Source Performance                          │
│                                                │
│ Source          | Items | Success | Avg Score │
│ ────────────────────────────────────────────── │
│ eventkampus.com | 120   | 98%     | 85.2%    │
│ eventful.com    | 40    | 87%     | 78.5%    │
│ others          | 15    | 73%     | 65.3%    │
└────────────────────────────────────────────────┘
```

---

### 🟡 Feature #5: Raw Data & Comparison Viewer

**Priority:** HIGH  
**Effort:** MEDIUM

#### Description
Modal untuk side-by-side comparison raw vs cleaned data.

#### Requirements
```
Tabs:
├─ Raw HTML: Original HTML dari website
├─ Cleaned Data: Hasil setelah extraction & cleaning
├─ Comparison: Side-by-side diff view
├─ Field Mapping: Show source selector untuk setiap field
└─ History: Changes made ke data

Raw HTML:
├─ Pretty-printed HTML dengan syntax highlighting
├─ Show relevant selectors highlighted
└─ Copy to clipboard

Cleaned Data:
├─ JSON format dengan pretty printing
├─ Field-level confidence scores
└─ Validation status per field

Comparison:
├─ Side-by-side: Raw vs Cleaned
├─ Highlights changes dan transformations
└─ Show regex patterns applied

Field Mapping:
├─ Judul Event: <h2 class="event-title"> → extracted via CSS selector
├─ Date: <span class="date"> (19 - Jun - 2026) → normalized to 2026-06-19
└─ etc
```

#### UI Mockup
```
┌──────────────────────────────────────────────────────┐
│ Event Data: WEBINAR NASIONAL EKSPEDISI ...#4 2023    │
├──────────────────────────────────────────────────────┤
│ [Raw HTML] [Cleaned Data] [Comparison] [Mapping]     │
│                                                      │
│ CLEANED DATA TAB:                                    │
│                                                      │
│ Overall Confidence: 78% ⚠️                           │
│                                                      │
│ {                                                    │
│   "title": "WEBINAR NASIONAL EKSPEDISI ..." ✅ 95%   │
│   "date_start": "2026-06-19" ⚠️ 65%                  │
│   "date_end": null ❌ 0%                             │
│   "location": null ❌ 0%                             │
│   "category": "Seminar" ✅ 90%                       │
│   "description": "...",✅ 75%                        │
│   "platform": "Belum Ditentukan" ⚠️ 40%              │
│ }                                                    │
│                                                      │
│ Issues:                                              │
│ • Location not found in source ❌                     │
│ • Date format ambiguous (19 - Jun - 2026) ⚠️         │
│ • Platform field missing ❌                          │
│                                                      │
│ [Edit] [Compare with Raw] [Retry] [Publish]         │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ COMPARISON TAB (Raw vs Cleaned):                     │
├─────────────────────────────┬─────────────────────────┤
│ Raw HTML                    │ Cleaned Data             │
├─────────────────────────────┼─────────────────────────┤
│ <h2 class=                  │ Title:                  │
│ "event-title">              │ "WEBINAR NASIONAL ..." │
│ WEBINAR NASIONAL            │ (Normalized from raw)   │
│ EKSPEDISI SERIBU            │                         │
│ PULAU #4 2023</h2>          │ • Extra spaces removed  │
│                             │ • Newlines cleaned      │
│ Transformation:             │                         │
│ regex: /\s+/g → ' '         │ Confidence: 95% ✅      │
│ trim()                      │                         │
├─────────────────────────────┼─────────────────────────┤
│ <span class="date">         │ Date Start:             │
│ 19 - Jun - 2026</span>      │ "2026-06-19"            │
│                             │ (Normalized from raw)   │
│ Transformation:             │                         │
│ Parse: 19-Jun-2026 →        │ • Detected: 19-Jun-2026 │
│ Convert to YYYY-MM-DD       │ • Converted: 2026-06-19 │
│                             │                         │
│                             │ Confidence: 65% ⚠️      │
│                             │ (Ambiguous format)      │
└─────────────────────────────┴─────────────────────────┘
```

#### Database Schema
```sql
CREATE TABLE raw_scraped_data (
  id UUID PRIMARY KEY,
  scraping_source_id UUID REFERENCES scraping_sources,
  raw_html JSONB, -- full HTML payload
  extracted_data JSONB, -- data sebelum cleaning
  cleaned_data JSONB, -- data setelah cleaning
  field_confidence JSONB, -- {title: 0.95, date: 0.65, ...}
  overall_confidence NUMERIC(3,2),
  validation_status ENUM('valid', 'warning', 'error'),
  validation_messages JSONB,
  transformation_log JSONB, -- track transformations applied
  status ENUM('raw', 'processed', 'published', 'rejected'),
  scraped_at TIMESTAMP,
  published_at TIMESTAMP,
  created_at TIMESTAMP
);

CREATE TABLE data_transformation_history (
  id UUID PRIMARY KEY,
  raw_data_id UUID REFERENCES raw_scraped_data,
  transformation_type VARCHAR(100), -- regex, normalization, etc
  input_value TEXT,
  output_value TEXT,
  applied_at TIMESTAMP
);
```

---

### 🟡 Feature #6: Bulk Operations & Actions

**Priority:** HIGH  
**Effort:** MEDIUM

#### Description
Bulk approve, reject, delete, atau retry multiple items.

#### Requirements
```
Bulk Actions Available:
├─ Publish (move to event table)
├─ Reject (mark as rejected)
├─ Delete (remove from raw_scraped_data)
├─ Retry Scraping (re-scrape dari source)
├─ Export to CSV (for external processing)
└─ Manual Review Flag (mark for review)

Supported Filters for Bulk:
├─ All items matching current filters
├─ Selected checkbox items
├─ By date range
├─ By confidence range
├─ By status
└─ By source
```

#### UI Mockup
```
┌────────────────────────────────────────────────┐
│ Manajemen Scraping                             │
├────────────────────────────────────────────────┤
│                                                │
│ Search & Filter                                │
│ [☐ Select All (78 items)]                      │
│                                                │
│ [Bulk Actions dropdown: ]                       │
│ ├─ Publish Selected                            │
│ ├─ Reject Selected                             │
│ ├─ Delete Selected                             │
│ ├─ Retry Scraping                              │
│ ├─ Export to CSV                               │
│ └─ Clear Selection                             │
│                                                │
│ Data Table:                                    │
│ ┌────────────────────────────────────────┐    │
│ │[☐] | Title | Source | Confidence | ...│    │
│ ├────────────────────────────────────────┤    │
│ │[☑] | Webinar 1 | ... | 95% ✅ | ...   │    │
│ │[☑] | Event 2 | ... | 78% ⚠️ | ...    │    │
│ │[☐] | Failed 3 | ... | 45% ❌ | ...   │    │
│ │[☑] | Seminar 4 | ... | 82% ✅ | ...  │    │
│ └────────────────────────────────────────┘    │
│                                                │
│ Selection Summary:                             │
│ 3 items selected (all with Confidence >= 78%) │
│ [Publish 3] [Reject 3] [Delete 3]             │
└────────────────────────────────────────────────┘
```

---

### 🟡 Feature #7: Detailed Activity & Audit Log

**Priority:** MEDIUM  
**Effort:** SMALL

#### Description
Comprehensive logging dari semua scraping activities.

#### Requirements
```
Log Events:
├─ Scraping started/completed per source
├─ Items extracted count
├─ Validation failures (detail)
├─ Auto-approval/rejection decisions
├─ Manual publish/reject by admin
├─ Retries dan reason
├─ Configuration changes
├─ Error/warning messages
└─ User actions (who did what when)

Log Details:
├─ Timestamp (precise)
├─ Event type (scrape_start, scrape_complete, etc)
├─ Source (if applicable)
├─ Items count
├─ Status (success, warning, error)
├─ Error message (if any)
├─ Admin user (if manual action)
├─ Duration / performance metrics
└─ Detailed JSON payload
```

#### UI Mockup
```
┌────────────────────────────────────────────────┐
│ Activity Log                                   │
├────────────────────────────────────────────────┤
│                                                │
│ Filter: [All] [Scraping] [Publishing] [Errors]│
│ Time range: [Last 24h] [Last 7d] [All]        │
│                                                │
│ Timestamp | Event | Source | Status | Details │
├────────────────────────────────────────────────┤
│ 14:32     │ Scraping completed          │      │
│           │ Source: eventkampus.com     │ ✅   │
│           │ Items extracted: 78         │      │
│           │ Errors: 0                   │      │
│           │ Duration: 2m 34s            │      │
│           │ [View Details]              │      │
│                                                │
│ 14:00     │ Scraping started            │      │
│           │ Source: eventkampus.com     │ 🔄   │
│           │ Scraper type: Cheerio       │      │
│           │                             │      │
│ 13:45     │ Auto-approval triggered     │      │
│           │ Items published: 23         │ ✅   │
│           │ Reason: Confidence >= 85%   │      │
│           │                             │      │
│ 13:30     │ Configuration changed       │      │
│           │ By: Admin User              │ ℹ️   │
│           │ Field: Min confidence       │      │
│           │ From: 75% → To: 80%         │      │
│           │                             │      │
│ 12:50     │ Scraping failed             │      │
│           │ Source: external.com        │ ❌   │
│           │ Error: Rate limit exceeded  │      │
│           │ Retry in: 1 hour            │      │
│           │ [View Error Log]            │      │
└────────────────────────────────────────────────┘
```

#### Database Schema
```sql
CREATE TABLE scraping_activity_log (
  id UUID PRIMARY KEY,
  event_type VARCHAR(100), -- scraping_start, scraping_complete, etc
  source_id UUID REFERENCES scraping_sources,
  status ENUM('success', 'warning', 'error'),
  items_count INT,
  error_message TEXT,
  error_details JSONB,
  admin_user_id UUID REFERENCES users,
  duration_seconds INT,
  metadata JSONB,
  created_at TIMESTAMP,
  INDEX (event_type, created_at),
  INDEX (source_id, created_at)
);
```

---

### 🟡 Feature #8: Scraping Configuration Backup & Versioning

**Priority:** MEDIUM  
**Effort:** MEDIUM

#### Description
Backup dan version control untuk scraping configurations.

#### Requirements
```
Versioning:
├─ Auto-save config snapshots on changes
├─ View config history (who changed what when)
├─ Compare config versions (diff view)
├─ Rollback to previous config
└─ Config export/import (for disaster recovery)

Backup Strategy:
├─ Daily automatic backup
├─ On-demand manual backup
├─ Store in separate table with timestamps
└─ Retain last 30 versions
```

---

## UI/UX Improvements

### 📐 Improvement #1: Add Confidence Score Indicators

**Current State:**
```
Status badge only shows "PROCESSED" ✅
No visibility into data quality
```

**Proposed Solution:**
```
┌──────────────────────────────────────────────┐
│ Event Title | Source | Confidence | Status   │
├──────────────────────────────────────────────┤
│ Webinar 1   | evt... | 95% ✅     | PROCESSED│
│ Event 2     | evt... | 78% ⚠️     | PROCESSED│
│ Seminar 3   | evt... | 62% ❌     | PENDING  │
│ Failed 4    | evt... | 0% ❌      | ERROR    │
└──────────────────────────────────────────────┘

Visual indicators:
├─ 90-100%: Green (✅) - Confidence high
├─ 75-90%: Yellow (⚠️) - Confidence ok, needs check
├─ 50-75%: Orange (❌) - Confidence low, manual review
└─ <50%: Red (❌) - Confidence very low, likely error

Tooltip on hover:
"Confidence 78%: Title extracted with high accuracy,
but location field not found. Click to review raw data."
```

---

### 📐 Improvement #2: Modal Form Validation Feedback

**Current State:**
```
Form fields have placeholders tapi tidak ada validation feedback
Admin tidak tahu field mana yang required
```

**Proposed Solution:**
```
┌──────────────────────────────────────────────┐
│ Validasi & Publikasi Event                   │
├──────────────────────────────────────────────┤
│                                              │
│ Judul Event *                                │
│ [WEBINAR NASIONAL...] ✅ Valid               │
│ 500 characters max | 125 used                │
│                                              │
│ Tanggal Mulai *                              │
│ [19/06/2026] ✅ Valid                        │
│ Format: DD/MM/YYYY                           │
│                                              │
│ Tanggal Selesai                              │
│ [empty] ⚠️ Optional (leave empty if same day)│
│                                              │
│ Detail Lokasi *                              │
│ [empty] ❌ Required!                         │
│ Contoh: Gedung A, Lantai 3, Ruang 301       │
│                                              │
│ Platform                                     │
│ [Belum Ditentukan] ❌ Required!              │
│ Pilih: Offline / Online / Hybrid             │
│                                              │
│ Kota (Database) *                            │
│ [Pilih Kota...] ❌ Required!                 │
│ Show: Semarang, Jakarta, Bandung, ...        │
│                                              │
│ Kategori (Database) *                        │
│ [Pilih Kategori...] ❌ Required!             │
│ Show: Seminar, Workshop, Conference, ...     │
│                                              │
│ Validation Summary:                          │
│ ✅ 3 fields valid                            │
│ ⚠️ 1 field optional                          │
│ ❌ 3 fields required (missing)               │
│                                              │
│ [Publish] (disabled) [Save as Draft] [Cancel]│
│                                              │
│ Error: Form has 3 validation errors.         │
│ Please complete required fields.             │
└──────────────────────────────────────────────┘
```

---

### 📐 Improvement #3: Better Empty State & Messaging

**Current State:**
```
Table shows 78 items tapi semua status "PROCESSED"
Tidak ada distinction antara success, warning, error, failed
```

**Proposed Solution:**
```
Status legend:
┌─────────────────────────────────────────┐
│ 🟢 PROCESSED (95): Extracted & ready    │
│ 🟡 PENDING (5): Awaiting review         │
│ 🔴 FAILED (3): Scraping error           │
│ ⚫ REJECTED (2): Admin rejected          │
│ 🔵 PUBLISHED (78): Moved to event table │
└─────────────────────────────────────────┘

Filter buttons untuk quick view:
[All (78)] [Processed (95)] [Pending (5)] [Failed (3)] 
[Rejected (2)] [Published (78)]
```

---

### 📐 Improvement #4: Add Pagination & Performance

**Current State:**
```
Table bisa jadi scrolls ke 78 items (atau lebih)
Tidak ada pagination info
```

**Proposed Solution:**
```
Pagination controls:
[← Previous] [1] [2] [3] [4] [Next →]
Showing 1-20 of 78 items | [Show 20 ▼] per page
Jump to page: [3] [Go]

Performance:
├─ Server-side pagination
├─ Virtual scrolling untuk large lists
└─ Debounced search/filter
```

---

### 📐 Improvement #5: Enhanced Search & Filter UX

**Current State:**
```
Hanya search by title + filter by status
```

**Proposed Solution:**
```
Advanced Filter Panel (collapsible):

┌────────────────────────────────────┐
│ [🔍 Filters] [Advanced ▼]          │
├────────────────────────────────────┤
│ Title: [search...]                 │
│ Status: [dropdown with options]    │
│ Source: [dropdown]                 │
│ Confidence: [min] 50% ←→ [max] 100%│
│ Date Range: [from] to [to]         │
│ Has Errors: [Yes/No/Any]           │
│                                    │
│ [Apply Filters] [Reset] [Save View]│
└────────────────────────────────────┘

Saved filter views:
├─ High Confidence (>= 85%)
├─ Needs Review (60-85%)
├─ Errors (< 60%)
├─ Published Today
└─ [+ Create View]
```

---

## Technical Recommendations

### 🔧 Recommendation #1: Refactor Configuration to Database

**Current:** Configuration hardcoded in backend code  
**Target:** Configuration in database with admin CRUD UI  
**Priority:** CRITICAL

#### Implementation Steps

```typescript
// 1. Create database tables (see schema in Feature sections)
// 2. Create backend services for config management

// src/lib/services/scraping-config.service.ts
export class ScrapingConfigService {
  // Get config
  async getSourceConfig(sourceId: UUID): Promise<ScrapingSource> {
    return db.query.scrapingSources.findById(sourceId);
  }

  // Update config
  async updateSourceConfig(sourceId: UUID, config: Partial<ScrapingSource>) {
    await db.update(scrapingSources).set(config).where(eq(id, sourceId));
    // Trigger config reload in scraper
    await this.invalidateScraperCache(sourceId);
  }

  // Get validation rules
  async getValidationRules(): Promise<ValidationRule[]> {
    return db.query.validationRules.findAll();
  }
}

// 3. Update scraper to load config from database
// src/lib/scraper/engine.ts
export async function createScraperInstance(sourceId: UUID) {
  // Load config from DB instead of hardcoded
  const config = await ScrapingConfigService.getSourceConfig(sourceId);
  
  return new Cheerio({
    userAgent: config.user_agent,
    rateLimit: config.rate_limit_delay_ms,
    maxRetries: config.max_retries,
    timeout: config.timeout_ms
  });
}

// 4. Create API routes for config CRUD
// src/app/api/admin/scraping/sources/route.ts
export async function GET(req: Request) {
  const sources = await ScrapingConfigService.getAllSources();
  return Response.json(sources);
}

export async function POST(req: Request) {
  const newSource = await req.json();
  const created = await ScrapingConfigService.createSource(newSource);
  return Response.json(created, { status: 201 });
}

// src/app/api/admin/scraping/sources/[id]/route.ts
export async function PUT(req: Request, { params }) {
  const updates = await req.json();
  const updated = await ScrapingConfigService.updateSourceConfig(params.id, updates);
  return Response.json(updated);
}

export async function DELETE(req: Request, { params }) {
  await ScrapingConfigService.deleteSource(params.id);
  return new Response(null, { status: 204 });
}
```

#### Timeline: 2-3 weeks

---

### 🔧 Recommendation #2: Implement Comprehensive Logging

**Current:** Sparse activity log (only 4 entries for 78 items)  
**Target:** Detailed audit log for all operations  
**Priority:** CRITICAL

#### Implementation

```typescript
// src/lib/services/logging.service.ts
export class ScrapingLoggingService {
  async logScrapingStart(sourceId: UUID, metadata: any) {
    await db.insert(scrapingActivityLog).values({
      event_type: 'scraping_start',
      source_id: sourceId,
      status: 'info',
      metadata: metadata,
      created_at: new Date()
    });
  }

  async logScrapingComplete(sourceId: UUID, itemsCount: number, errors: any[]) {
    await db.insert(scrapingActivityLog).values({
      event_type: 'scraping_complete',
      source_id: sourceId,
      status: errors.length > 0 ? 'warning' : 'success',
      items_count: itemsCount,
      error_details: errors,
      metadata: { items_extracted: itemsCount, errors_found: errors.length }
    });
  }

  async logValidationFailure(dataId: UUID, failures: any[]) {
    await db.insert(scrapingActivityLog).values({
      event_type: 'validation_failed',
      status: 'warning',
      error_details: failures,
      metadata: { data_id: dataId, validation_failures: failures }
    });
  }

  async logAutoApproval(dataIds: UUID[], reason: string) {
    for (const dataId of dataIds) {
      await db.insert(scrapingActivityLog).values({
        event_type: 'auto_approval',
        status: 'success',
        metadata: { data_id: dataId, reason }
      });
    }
  }

  async logManualPublish(dataId: UUID, adminId: UUID) {
    await db.insert(scrapingActivityLog).values({
      event_type: 'manual_publish',
      status: 'success',
      admin_user_id: adminId,
      metadata: { data_id: dataId }
    });
  }

  async getActivityLog(filters: LogFilters): Promise<ActivityLog[]> {
    let query = db.query.scrapingActivityLog;
    if (filters.sourceId) query = query.where(eq(sourceId, filters.sourceId));
    if (filters.eventType) query = query.where(eq(eventType, filters.eventType));
    return query.orderBy(desc(createdAt)).limit(filters.limit || 100);
  }
}

// Integration dengan scraper
// src/lib/scraper/engine.ts
export async function runScraper(sourceId: UUID) {
  const logger = new ScrapingLoggingService();
  
  try {
    await logger.logScrapingStart(sourceId, { scraper_type: 'cheerio' });
    
    const items = await scrapeSource(sourceId);
    const validated = await validateItems(items);
    const cleaned = await cleanData(validated);
    
    await logger.logScrapingComplete(sourceId, cleaned.length, []);
    
    return cleaned;
  } catch (error) {
    await logger.logScrapingComplete(sourceId, 0, [error.message]);
    throw error;
  }
}
```

#### Timeline: 1-2 weeks

---

### 🔧 Recommendation #3: Expose Confidence Scoring in Frontend

**Current:** Confidence calculated but not displayed  
**Target:** Confidence visible with field-level breakdown  
**Priority:** CRITICAL

#### Implementation

```typescript
// Backend: Update API to include confidence
// src/app/api/admin/scraping/data/[id]/route.ts
export async function GET(req: Request, { params }) {
  const data = await db.query.rawScrapedData.findById(params.id);
  
  return Response.json({
    ...data,
    overall_confidence: data.overall_confidence,
    field_confidence: data.field_confidence, // { title: 0.95, date: 0.65, ... }
    validation_status: data.validation_status,
    validation_messages: data.validation_messages,
    transformation_log: data.transformation_log
  });
}

// Frontend: Display in detail modal
// src/components/admin/scraping/DetailModal.tsx
export function ScrappingDetailModal({ dataId }) {
  const { data, loading } = useQuery(GET_SCRAPING_DATA, { variables: { id: dataId } });
  
  const confidenceColor = (score: number) => {
    if (score >= 0.90) return 'bg-green-100 text-green-800';
    if (score >= 0.75) return 'bg-yellow-100 text-yellow-800';
    if (score >= 0.60) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Modal>
      <div className="space-y-4">
        {/* Confidence Summary */}
        <div className="bg-blue-50 p-4 rounded">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Overall Confidence</span>
            <span className={`px-3 py-1 rounded text-lg font-bold ${confidenceColor(data.overall_confidence)}`}>
              {(data.overall_confidence * 100).toFixed(0)}%
            </span>
          </div>
          
          {/* Field-level confidence */}
          <div className="mt-4 space-y-2">
            {Object.entries(data.field_confidence).map(([field, score]) => (
              <div key={field} className="flex items-center justify-between text-sm">
                <span className="capitalize text-gray-600">{field}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded">
                    <div 
                      className={`h-full rounded ${confidenceColor(score)}`}
                      style={{ width: `${score * 100}%` }}
                    />
                  </div>
                  <span className={`w-12 text-right font-mono ${confidenceColor(score)}`}>
                    {(score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Validation issues */}
          {data.validation_messages?.length > 0 && (
            <div className="mt-4 bg-white p-3 rounded border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Issues Found:</h4>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                {data.validation_messages.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Form with field indicators */}
        <div className="space-y-3">
          <div>
            <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1">
              Judul Event
              <span className={`px-2 py-0.5 text-xs rounded ${confidenceColor(data.field_confidence.title)}`}>
                {(data.field_confidence.title * 100).toFixed(0)}%
              </span>
            </label>
            <input type="text" defaultValue={data.cleaned_data.title} className="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai
              <span className={`px-2 py-0.5 text-xs rounded ${confidenceColor(data.field_confidence.date_start)}`}>
                {(data.field_confidence.date_start * 100).toFixed(0)}%
              </span>
            </label>
            <input type="date" defaultValue={data.cleaned_data.date_start} className="w-full px-3 py-2 border rounded" />
          </div>

          {/* ... other fields */}
        </div>

        {/* Tabs for Raw Data, Comparison */}
        <div className="border-t pt-4">
          <Tabs>
            <Tab label="Cleaned Data">
              {/* Current form */}
            </Tab>
            <Tab label="Raw HTML">
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(data.raw_html, null, 2)}
              </pre>
            </Tab>
            <Tab label="Transformation Log">
              {data.transformation_log?.map((transform, idx) => (
                <div key={idx} className="text-sm p-2 border-b">
                  <span className="font-mono text-gray-600">{transform.transformation_type}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    From: <code>{transform.input_value}</code>
                  </div>
                  <div className="text-xs text-gray-500">
                    To: <code>{transform.output_value}</code>
                  </div>
                </div>
              ))}
            </Tab>
          </Tabs>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded">Publish</button>
          <button className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded">Save Draft</button>
          <button className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded">Reject</button>
          <button className="px-4 py-2 border rounded">Compare</button>
        </div>
      </div>
    </Modal>
  );
}
```

#### Timeline: 1 week

---

### 🔧 Recommendation #4: Implement Inngest Integration for Automation

**Current:** Inngest is in tech stack but not utilized for scraping automation  
**Target:** Use Inngest for scheduled scraping, auto-approval, notifications  
**Priority:** HIGH

#### Implementation

```typescript
// src/inngest/scraping.ts
import { inngest } from './client';

// Scheduled scraping trigger
export const scheduledScraping = inngest.createFunction(
  { id: 'scheduled-scraping' },
  { cron: '0 */6 * * *' }, // Every 6 hours
  async ({ step }) => {
    // Get all active sources
    const sources = await step.run('get-active-sources', async () => {
      return db.query.scrapingSources.findWhere({ is_active: true });
    });

    // Scrape each source
    for (const source of sources) {
      await step.invoke('scrape-source', {
        function: scrapeSingleSource,
        data: { sourceId: source.id }
      });
    }
  }
);

export const scrapeSingleSource = inngest.createFunction(
  { id: 'scrape-single-source' },
  { event: 'scraping/single-source' },
  async ({ event, step }) => {
    const sourceId = event.data.sourceId;

    // Get config
    const config = await step.run('load-config', async () => {
      return ScrapingConfigService.getSourceConfig(sourceId);
    });

    // Run scraper
    const items = await step.run('execute-scraper', async () => {
      return ScrapingEngine.scrape(sourceId, config);
    });

    // Clean & validate
    const validated = await step.run('validate-data', async () => {
      return ValidatorService.validateItems(items);
    });

    // Auto-approve if confidence high
    const autoApproved = await step.run('auto-approve', async () => {
      return AutoApprovalService.process(validated, config);
    });

    // Notify admin of failures
    if (validated.failed.length > 0) {
      await step.run('send-notification', async () => {
        return NotificationService.notifyAdminOfFailures(sourceId, validated.failed);
      });
    }

    return { processed: validated.length, failed: validated.failed.length };
  }
);

// Auto-publish based on rules
export const autoPublishScraping = inngest.createFunction(
  { id: 'auto-publish-scraping' },
  { event: 'scraping/data-validated' },
  async ({ event, step }) => {
    const data = event.data;

    // Check auto-approval rules
    const rules = await step.run('get-approval-rules', async () => {
      return AutoApprovalService.getRules();
    });

    // Publish if meets criteria
    if (data.overall_confidence >= rules.confidence_threshold && data.validation_status === 'valid') {
      await step.run('publish-event', async () => {
        return PublishService.publishEvent(data);
      });

      // Send confirmation
      await step.run('send-confirmation', async () => {
        return NotificationService.notifyAutoPublished(data);
      });
    }
  }
);

// Usage: Trigger from API
// src/app/api/admin/scraping/trigger/route.ts
export async function POST(req: Request) {
  const { sourceId } = await req.json();

  // Trigger via Inngest
  await inngest.send({
    name: 'scraping/single-source',
    data: { sourceId }
  });

  return Response.json({ status: 'triggered' });
}
```

#### Timeline: 1-2 weeks

---

## Configuration Panel Design

### 📐 Complete Admin Configuration Dashboard Structure

```
/admin/scraping/

├─ [Dashboard] - Overview & metrics
├─ [Sources] - Manage scraping sources
├─ [Rules] - Validation & auto-approval rules
├─ [Filters] - Include/exclude rules
├─ [Logs] - Activity log
└─ [Settings] - General scraping settings
```

---

## Database Schema Extensions

```sql
-- New tables needed:

CREATE TABLE scraping_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  base_url VARCHAR(500) NOT NULL,
  url_patterns TEXT[],
  scraper_type ENUM('cheerio', 'crawlee_playwright'),
  cron_schedule VARCHAR(100),
  max_results_per_run INT DEFAULT 100,
  rate_limit_delay_ms INT DEFAULT 1000,
  max_concurrent_requests INT DEFAULT 5,
  user_agent VARCHAR(500),
  request_timeout_ms INT DEFAULT 30000,
  max_retries INT DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  last_scraped_at TIMESTAMP,
  last_successful_count INT,
  last_error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scraping_validation_rules (
  id UUID PRIMARY KEY,
  field_name VARCHAR(100),
  is_required BOOLEAN,
  min_length INT,
  max_length INT,
  regex_pattern VARCHAR(500),
  confidence_threshold NUMERIC(3,2),
  created_at TIMESTAMP
);

CREATE TABLE scraping_auto_approval_rules (
  id UUID PRIMARY KEY,
  rule_name VARCHAR(255),
  condition_type ENUM('confidence', 'required_fields'),
  threshold_value NUMERIC(5,2),
  auto_publish BOOLEAN,
  require_manual_review BOOLEAN,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP
);

CREATE TABLE scraping_filter_rules (
  id UUID PRIMARY KEY,
  rule_type ENUM('title_exclude', 'date_exclude', 'location_include'),
  pattern VARCHAR(500),
  is_regex BOOLEAN,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP
);

CREATE TABLE scraping_activity_log (
  id UUID PRIMARY KEY,
  event_type VARCHAR(100),
  source_id UUID REFERENCES scraping_sources,
  status ENUM('success', 'warning', 'error'),
  items_count INT,
  error_message TEXT,
  admin_user_id UUID REFERENCES users,
  duration_seconds INT,
  metadata JSONB,
  created_at TIMESTAMP
);

CREATE TABLE raw_scraped_data (
  id UUID PRIMARY KEY,
  scraping_source_id UUID REFERENCES scraping_sources,
  raw_html JSONB,
  extracted_data JSONB,
  cleaned_data JSONB,
  field_confidence JSONB,
  overall_confidence NUMERIC(3,2),
  validation_status ENUM('valid', 'warning', 'error'),
  validation_messages JSONB,
  transformation_log JSONB,
  status ENUM('raw', 'processed', 'published', 'rejected'),
  scraped_at TIMESTAMP,
  published_at TIMESTAMP,
  created_at TIMESTAMP
);
```

---

## Implementation Roadmap

### 🗺️ Phase 1: Foundation (Weeks 1-3)

**Goal:** Build core configuration infrastructure

- [x] Create database tables for sources, rules, config
- [x] Implement ScrapingConfigService backend
- [x] Create API routes for CRUD operations
- [x] Add comprehensive logging system
- [x] Refactor scraper to load config from DB
- [x] Create basic admin UI for sources management

**Deliverable:** Functional sources CRUD + activity logging  
**Effort:** 3 weeks

---

### 🗺️ Phase 2: Visibility & Control (Weeks 4-6)

**Goal:** Make data quality visible + enable configuration

- [x] Expose confidence scoring in frontend
- [x] Implement raw data comparison view
- [x] Add validation rules management UI
- [x] Add filter rules management UI
- [x] Implement bulk operations
- [x] Create data quality dashboard

**Deliverable:** Admin can see confidence scores, compare data, manage rules  
**Effort:** 3 weeks

---

### 🗺️ Phase 3: Automation & Intelligence (Weeks 7-9)

**Goal:** Automate workflows with Inngest

- [x] Integrate Inngest for scheduled scraping
- [x] Implement auto-approval based on rules
- [x] Add notification system
- [x] Create Inngest workflow monitoring UI
- [x] Implement retry mechanism with UI

**Deliverable:** Automated scraping & publishing workflows  
**Effort:** 3 weeks

---

### 🗺️ Phase 4: Advanced Features (Weeks 10-12)

**Goal:** Polish + advanced capabilities

- [x] Config backup & versioning
- [x] Performance optimizations
- [x] AI-powered field suggestions
- [x] Advanced analytics & reporting
- [x] Export/import capabilities
- [x] Testing & documentation

**Deliverable:** Production-ready scraping system  
**Effort:** 3 weeks

---

## Testing & Quality Assurance

### 🧪 Test Strategy

```
Unit Tests:
├─ ScrapingEngine (Cheerio & Crawlee)
├─ DataValidator (Zod schemas)
├─ DataCleaner (regex transformations)
├─ ConfidenceScorer (scoring logic)
└─ AutoApprovalService (decision logic)

Integration Tests:
├─ End-to-end scraping workflow
├─ Database transactions
├─ Configuration loading & caching
├─ Inngest event processing
└─ API endpoints (CRUD)

E2E Tests (Selenium/Playwright):
├─ Admin UI for sources management
├─ Detail modal with confidence display
├─ Bulk operations
├─ Filter & search functionality
└─ Configuration changes

Performance Tests:
├─ Scraping large datasets (1000+ items)
├─ Database query optimization
├─ Memory leaks in long-running scrapers
└─ Concurrent request handling

Manual QA Checklist:
├─ Data accuracy (sample 100 items)
├─ Confidence score correctness
├─ Error handling & recovery
├─ Notification delivery
└─ UI/UX polish
```

---

## Monitoring & Logging

### 📊 Metrics to Track

```
Performance Metrics:
├─ Scraping duration (min, avg, max)
├─ Items processed per hour
├─ Success rate (%)
├─ Average confidence score
├─ Error rate (%)
└─ Request latency distribution

Quality Metrics:
├─ Confidence score distribution
├─ Validation failure rate
├─ Field-level extraction success
├─ Auto-approval rate
└─ Manual review rate

System Metrics:
├─ CPU usage (scraper process)
├─ Memory usage
├─ Database connection pool
├─ Queue processing time
└─ Notification delivery time
```

### 🔔 Alerting Rules

```
Alert when:
├─ Success rate < 90% in 24h
├─ Average confidence < 75%
├─ Error rate > 5%
├─ Scraper timeout occurs
├─ Database connection failed
├─ Queue processing delayed > 1h
└─ Manual review queue > 100 items
```

---

## Summary & Recommendations

### ✅ Immediate Actions (Next Sprint)

1. **Create database schema extensions** (2-3 days)
2. **Implement ScrapingConfigService** (3-4 days)
3. **Add activity logging** (2-3 days)
4. **Expose confidence scoring in frontend** (2-3 days)

**Total: ~2 weeks to make significant impact**

---

### 🎯 Success Metrics

After implementation, system should support:

- ✅ Admin can configure ANY website for scraping without code changes
- ✅ Admin can see confidence scores & understand data quality
- ✅ Admin can compare raw vs cleaned data
- ✅ Admin can set validation rules & auto-approval thresholds
- ✅ System automatically scrapes on schedule
- ✅ System automatically approves high-confidence data
- ✅ Admin can see detailed audit trail of all operations
- ✅ Scraping is fully configurable, auditable, and production-ready

---

### 📝 Document Info

**Version:** 1.0  
**Last Updated:** June 20, 2026  
**Status:** Ready for Implementation  
**Estimated Total Effort:** 12 weeks (3 months)  
**Priority:** CRITICAL - System currently incomplete

---

**End of Document**
