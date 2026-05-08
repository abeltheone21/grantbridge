# GrantBridge — Backend Setup & Deployment Guide

## Overview

GrantBridge is a grant discovery and application portal for NGOs, CSOs, startups, researchers, and social impact teams in Ethiopia and across Africa. This backend provides:

- **Payload CMS** for admin grant management at `/admin`
- **Supabase Postgres** with RLS for secure data access
- **Supabase Auth** (Google OAuth + email/password)
- **S3-compatible storage** for media uploads
- **PostHog** analytics integration
- **Secure API routes** for applications, comments, notifications

## Architecture

```
┌─────────────────────────────────────────────┐
│              Next.js App Router             │
│  ┌───────────┐  ┌────────┐  ┌───────────┐  │
│  │ Payload   │  │ API    │  │ Public    │  │
│  │ CMS Admin │  │ Routes │  │ Frontend  │  │
│  └─────┬─────┘  └───┬────┘  └─────┬─────┘  │
│        │            │              │        │
│  Service Role   User JWT      Anon Key     │
│        │            │              │        │
│  ┌─────▼────────────▼──────────────▼─────┐  │
│  │          Supabase Postgres            │  │
│  │  grants (RLS) → public_grants (view)  │  │
│  │  applications (RLS) │ comments (RLS)  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Security Model (Option A — Secure View Pattern)

- **`grants` table**: All fields, RLS-protected. No anonymous direct access.
- **`public_grants` view**: Teaser-only fields, readable by anon + authenticated.
- **Authenticated users**: Can read full grant details from `grants` table via RLS.
- **Payload CMS**: Uses service role key server-side to bypass RLS for admin ops.

## Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase project (free tier works for MVP)
- PostHog account (optional)

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url> && cd grantbridge
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in your `.env.local` with values from your Supabase dashboard:

| Variable | Where to find |
|----------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (⚠️ server-only) |
| `DATABASE_URI` | Supabase → Settings → Database → Connection string |
| `PAYLOAD_SECRET` | Generate: `openssl rand -hex 32` |
| `S3_*` variables | Your S3-compatible storage provider |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog → Project Settings |

### 3. Run database migrations

Go to **Supabase Dashboard → SQL Editor** and run in order:

1. `db/migrations/001_schema.sql` — Creates all tables, indexes, triggers
2. `db/migrations/002_rls_and_views.sql` — Creates public_grants view, RLS policies, get_public_grants RPC

### 4. Seed the database

```bash
npm run seed
```

This inserts 12 realistic grants (6 active, 6 closed/archived).

### 5. Start the dev server

```bash
npm run dev
```

### 6. Create your first admin user

Navigate to `http://localhost:3000/admin` and create the first admin account through the Payload CMS setup wizard.

## Project Structure

```
grantbridge/
├── app/
│   ├── (payload)/        # Payload CMS admin UI (auto-generated)
│   ├── api/
│   │   ├── grants/
│   │   │   ├── public/route.ts    # GET  — public grant listing with filters
│   │   │   └── [slug]/route.ts    # GET  — grant detail (auth-aware)
│   │   ├── applications/route.ts  # POST — submit support statement (auth required)
│   │   ├── comments/route.ts      # POST — submit help desk inquiry (auth required)
│   │   ├── grant-views/route.ts   # POST — track grant page views
│   │   └── notifications/route.ts # POST — subscribe to "Notify Me"
│   └── layout.tsx
├── collections/
│   ├── Grants.ts           # Payload CMS grants collection (tabbed admin UI)
│   ├── Media.ts            # Payload CMS media/uploads collection
│   ├── Users.ts            # Payload CMS admin users
│   ├── Applications.ts     # Support statement submissions
│   ├── Comments.ts         # Help desk inquiries
│   └── NotificationSubscriptions.ts
├── db/
│   ├── migrations/
│   │   ├── 001_schema.sql  # Core tables, enums, indexes, triggers
│   │   └── 002_rls_and_views.sql  # RLS policies, public view, RPC
│   └── seed.ts             # 12 realistic sample grants
├── lib/
│   ├── analytics/
│   │   ├── events.ts       # Typed event contract + constants
│   │   └── posthog.ts      # Server-side PostHog helper
│   ├── supabase/
│   │   ├── server.ts       # Service role + user-scoped clients
│   │   ├── client.ts       # Browser client (anon key)
│   │   └── auth.ts         # JWT validation + user extraction
│   ├── validation/
│   │   └── schemas.ts      # Zod schemas for all write operations
│   ├── audit.ts            # CMS audit logging hook
│   ├── currency.ts         # Currency conversion helpers
│   └── media.ts            # Media URL resolution
├── types/
│   └── index.ts            # Shared TypeScript types
├── payload.config.ts       # Payload CMS configuration
├── next.config.ts          # Next.js + Payload integration
└── .env.example            # Environment variable template
```

## API Reference

### Public Endpoints

#### `GET /api/grants/public`
Returns paginated, filtered grant teasers. No auth required.

Query params: `status`, `sector`, `category`, `implementation_area`, `min_amount`, `max_amount`, `search`, `page`, `limit`, `sort`, `order`

#### `GET /api/grants/[slug]`
Returns grant by slug. Anonymous users get teaser-only. Authenticated users get full details (minus private_notes).

#### `POST /api/grant-views`
Track a grant page view. Auth optional.
Body: `{ grant_id, session_id? }`

#### `POST /api/notifications`
Subscribe to "Notify Me of Next Cycle". Auth optional.
Body: `{ grant_id, email, source? }`

### Authenticated Endpoints (require `Authorization: Bearer <token>`)

#### `POST /api/applications`
Submit a support statement.
Body: `{ grant_id, support_statement, source_page?, submission_token? }`

#### `POST /api/comments`
Submit a help desk inquiry.
Body: `{ grant_id, message, category }`

Categories: `Technical Issue`, `Document Question`, `Deadline Clarification`, `Other`

## Database Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `grants` | All grant data | Auth read, no anon direct |
| `public_grants` (view) | Teaser-only view | Anon + auth read |
| `applications` | Support statements | Auth insert, own-read |
| `comments` | Help desk inquiries | Auth insert only |
| `grant_views` | Analytics tracking | Insert only |
| `notification_subscriptions` | Notify-me signups | Insert, own-read/delete |
| `admin_audit_logs` | CMS change tracking | Service role only |

## Supabase Auth Setup

### Email/Password
Enabled by default in Supabase. No additional configuration needed.

### Google OAuth
1. Go to Supabase Dashboard → Authentication → Providers → Google
2. Add your Google Client ID and Client Secret
3. Set redirect URL to `https://<your-supabase-url>/auth/v1/callback`

## Currency Handling

- Currency code stored per grant (`EUR`, `USD`, `ETB`, `GBP`)
- Static FX rates in `lib/currency.ts` for MVP
- `convertCurrency()` and `formatFundingRange()` utilities available
- Designed for easy swap to live FX API in future

## Deployment

### Vercel (Recommended)
1. Connect your repo to Vercel
2. Set all environment variables from `.env.example`
3. Deploy — Payload CMS admin will be at `/admin`

### Important: Production Checklist
- [ ] Set strong `PAYLOAD_SECRET` (32+ chars)
- [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` is never exposed client-side
- [ ] Run both SQL migrations in Supabase
- [ ] Configure Google OAuth in Supabase dashboard
- [ ] Set up S3/R2 storage bucket with correct CORS
- [ ] Create first admin user at `/admin`
- [ ] Run seed script if needed
