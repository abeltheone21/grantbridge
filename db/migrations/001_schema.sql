-- =============================================================================
-- Migration 001: Core grants table + supporting tables
-- =============================================================================
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- This creates the grants table that Payload CMS will also manage,
-- plus all supporting tables for the application.
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Trigram index for fuzzy search

-- ---------------------------------------------------------------------------
-- ENUM TYPES
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE grant_status AS ENUM ('active', 'urgent', 'archived', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE grant_priority AS ENUM ('high', 'normal', 'low');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('submitted', 'reviewed', 'flagged');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE comment_category AS ENUM (
    'Technical Issue',
    'Document Question',
    'Deadline Clarification',
    'Other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- GRANTS TABLE
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS grants (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                    TEXT NOT NULL UNIQUE,
  title                   TEXT NOT NULL,
  funding_org             TEXT NOT NULL,
  opportunity_id          TEXT,

  -- Deadline
  deadline                TIMESTAMPTZ NOT NULL,
  deadline_timezone       TEXT DEFAULT 'Africa/Addis_Ababa',
  deadline_display_text   TEXT,

  -- Financials
  min_amount              NUMERIC(15, 2),
  max_amount              NUMERIC(15, 2),
  currency                TEXT NOT NULL DEFAULT 'USD',
  funding_rate            TEXT,
  funding_type            TEXT NOT NULL DEFAULT 'Grant',

  -- Location & Classification
  location                TEXT NOT NULL DEFAULT 'Ethiopia',
  sector                  TEXT NOT NULL DEFAULT 'Other',
  implementation_area     TEXT NOT NULL DEFAULT 'Ethiopia',
  category                TEXT NOT NULL DEFAULT 'Other',

  -- Content
  teaser                  TEXT NOT NULL,
  full_description        TEXT NOT NULL,
  eligibility_summary     TEXT,
  eligibility_checklist   JSONB DEFAULT '[]'::jsonb,
  target_audience         TEXT,

  -- Duration & Requirements
  duration_months         INTEGER,
  co_financing_required   BOOLEAN DEFAULT false,

  -- Links
  application_link        TEXT,
  application_platform    TEXT,
  external_application_url TEXT,
  source_name             TEXT,
  source_link             TEXT,

  -- Media
  image                   TEXT,

  -- Status & Admin
  status                  grant_status NOT NULL DEFAULT 'active',
  priority                grant_priority NOT NULL DEFAULT 'normal',
  is_featured             BOOLEAN DEFAULT false,
  notify_me_enabled       BOOLEAN DEFAULT true,
  archived_reason         TEXT,

  -- Taxonomy
  tags                    TEXT[] DEFAULT '{}',
  countries               TEXT[] DEFAULT '{Ethiopia}',
  regions                 TEXT[] DEFAULT '{East Africa}',

  -- Admin-only
  private_notes           TEXT,

  -- Full-text search
  search_vector           TSVECTOR,

  -- Timestamps
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at            TIMESTAMPTZ,
  created_by              UUID,
  updated_by              UUID
);

-- Auto-update search_vector on insert/update
CREATE OR REPLACE FUNCTION grants_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.funding_org, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.teaser, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.sector, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS grants_search_vector_trigger ON grants;
CREATE TRIGGER grants_search_vector_trigger
  BEFORE INSERT OR UPDATE ON grants
  FOR EACH ROW EXECUTE FUNCTION grants_search_vector_update();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS grants_updated_at ON grants;
CREATE TRIGGER grants_updated_at
  BEFORE UPDATE ON grants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ---------------------------------------------------------------------------
-- APPLICATIONS TABLE (Support Statements)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS applications (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grant_id          UUID NOT NULL REFERENCES grants(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL,
  support_statement TEXT NOT NULL,
  status            application_status NOT NULL DEFAULT 'submitted',
  submission_token  TEXT,
  source_page       TEXT,
  ip_hash           TEXT,
  user_agent        TEXT,
  admin_notes       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS applications_updated_at ON applications;
CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ---------------------------------------------------------------------------
-- COMMENTS TABLE (Help Desk Inquiries)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grant_id    UUID NOT NULL REFERENCES grants(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL,
  message     TEXT NOT NULL,
  category    comment_category NOT NULL DEFAULT 'Other',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS comments_updated_at ON comments;
CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ---------------------------------------------------------------------------
-- GRANT VIEWS TABLE (Analytics)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS grant_views (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grant_id         UUID NOT NULL REFERENCES grants(id) ON DELETE CASCADE,
  user_id          UUID,
  session_id       TEXT,
  viewed_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_authenticated BOOLEAN NOT NULL DEFAULT false
);

-- ---------------------------------------------------------------------------
-- ADMIN AUDIT LOGS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id    UUID NOT NULL,
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   TEXT NOT NULL,
  before      JSONB,
  after       JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- NOTIFICATION SUBSCRIPTIONS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notification_subscriptions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grant_id    UUID NOT NULL REFERENCES grants(id) ON DELETE CASCADE,
  user_id     UUID,
  email       TEXT NOT NULL,
  source      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Prevent duplicate subscriptions per email per grant
  UNIQUE (grant_id, email)
);

-- ---------------------------------------------------------------------------
-- INDEXES (Performance)
-- ---------------------------------------------------------------------------

-- Grants: filtered & sorted queries
CREATE INDEX IF NOT EXISTS idx_grants_status ON grants(status);
CREATE INDEX IF NOT EXISTS idx_grants_sector ON grants(sector);
CREATE INDEX IF NOT EXISTS idx_grants_category ON grants(category);
CREATE INDEX IF NOT EXISTS idx_grants_implementation_area ON grants(implementation_area);
CREATE INDEX IF NOT EXISTS idx_grants_deadline ON grants(deadline);
CREATE INDEX IF NOT EXISTS idx_grants_priority ON grants(priority);
CREATE INDEX IF NOT EXISTS idx_grants_is_featured ON grants(is_featured);
CREATE INDEX IF NOT EXISTS idx_grants_slug ON grants(slug);
CREATE INDEX IF NOT EXISTS idx_grants_published_at ON grants(published_at);
CREATE INDEX IF NOT EXISTS idx_grants_search ON grants USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_grants_tags ON grants USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_grants_countries ON grants USING GIN(countries);
CREATE INDEX IF NOT EXISTS idx_grants_amount_range ON grants(min_amount, max_amount);

-- Applications
CREATE INDEX IF NOT EXISTS idx_applications_grant ON applications(grant_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_token ON applications(submission_token);

-- Comments
CREATE INDEX IF NOT EXISTS idx_comments_grant ON comments(grant_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);

-- Grant views
CREATE INDEX IF NOT EXISTS idx_grant_views_grant ON grant_views(grant_id);
CREATE INDEX IF NOT EXISTS idx_grant_views_viewed_at ON grant_views(viewed_at);

-- Notification subscriptions
CREATE INDEX IF NOT EXISTS idx_notif_subs_grant ON notification_subscriptions(grant_id);
CREATE INDEX IF NOT EXISTS idx_notif_subs_email ON notification_subscriptions(email);
