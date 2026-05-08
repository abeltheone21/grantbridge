-- =============================================================================
-- Migration 002: Public grants view + RLS policies
-- =============================================================================
-- This creates the secure access layer:
--   1. public_grants VIEW — exposes only teaser-safe fields (anon-readable)
--   2. RLS policies — fine-grained access control per table
--
-- Architecture: Option A (Secure View Pattern)
--   - Anonymous users read from public_grants view (teaser only)
--   - Authenticated users read from grants table (full details via RLS)
--   - Service role bypasses RLS for Payload CMS admin operations
-- =============================================================================

-- ---------------------------------------------------------------------------
-- PUBLIC GRANTS VIEW (teaser-only, safe for anonymous access)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW public_grants AS
SELECT
  id,
  slug,
  title,
  funding_org,
  opportunity_id,
  deadline,
  deadline_display_text,
  min_amount,
  max_amount,
  currency,
  funding_type,
  location,
  sector,
  implementation_area,
  category,
  teaser,
  target_audience,
  image,
  status,
  priority,
  is_featured,
  notify_me_enabled,
  tags,
  countries,
  published_at
FROM grants
WHERE published_at IS NOT NULL;

-- Grant the anon role read access to the view
GRANT SELECT ON public_grants TO anon;
GRANT SELECT ON public_grants TO authenticated;

-- ---------------------------------------------------------------------------
-- RLS: GRANTS TABLE
-- ---------------------------------------------------------------------------

ALTER TABLE grants ENABLE ROW LEVEL SECURITY;

-- Anon: NO direct access to grants table (must use public_grants view)
-- This is intentional: full_description, private_notes, eligibility details
-- are not exposed to anonymous users.

-- Authenticated: can read published grants (includes full_description)
CREATE POLICY "Authenticated users can read published grants"
  ON grants FOR SELECT
  TO authenticated
  USING (published_at IS NOT NULL);

-- Service role bypasses RLS automatically (no policy needed)

-- ---------------------------------------------------------------------------
-- RLS: APPLICATIONS TABLE
-- ---------------------------------------------------------------------------

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Authenticated: can insert their own applications
CREATE POLICY "Authenticated users can submit applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated: can read only their own applications
CREATE POLICY "Users can read own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- No UPDATE or DELETE for regular users
-- Service role can do everything (bypasses RLS)

-- ---------------------------------------------------------------------------
-- RLS: COMMENTS TABLE (Help Desk)
-- ---------------------------------------------------------------------------

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Authenticated: can insert comments
CREATE POLICY "Authenticated users can submit comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- NO SELECT policy for users — help desk comments are admin-only
-- Users do not see their own help desk history on the frontend
-- Service role can read all (bypasses RLS)

-- ---------------------------------------------------------------------------
-- RLS: GRANT VIEWS TABLE
-- ---------------------------------------------------------------------------

ALTER TABLE grant_views ENABLE ROW LEVEL SECURITY;

-- Both anon and authenticated can insert views (analytics tracking)
CREATE POLICY "Anyone can log grant views"
  ON grant_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No SELECT for regular users
-- Service role can read for analytics

-- ---------------------------------------------------------------------------
-- RLS: NOTIFICATION SUBSCRIPTIONS
-- ---------------------------------------------------------------------------

ALTER TABLE notification_subscriptions ENABLE ROW LEVEL SECURITY;

-- Both anon and authenticated can subscribe
CREATE POLICY "Anyone can subscribe to notifications"
  ON notification_subscriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated users can see their own subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON notification_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can delete their own subscriptions (unsubscribe)
CREATE POLICY "Users can unsubscribe"
  ON notification_subscriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- RLS: ADMIN AUDIT LOGS
-- ---------------------------------------------------------------------------

ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- No public access at all — admin/service role only
-- Service role bypasses RLS automatically

-- ---------------------------------------------------------------------------
-- RPC: Filtered public grants with pagination (performance-optimized)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_public_grants(
  p_status       TEXT DEFAULT NULL,
  p_sector       TEXT DEFAULT NULL,
  p_category     TEXT DEFAULT NULL,
  p_area         TEXT DEFAULT NULL,
  p_min_amount   NUMERIC DEFAULT NULL,
  p_max_amount   NUMERIC DEFAULT NULL,
  p_search       TEXT DEFAULT NULL,
  p_limit        INTEGER DEFAULT 20,
  p_offset       INTEGER DEFAULT 0,
  p_sort         TEXT DEFAULT 'deadline',
  p_order        TEXT DEFAULT 'asc'
)
RETURNS TABLE (
  id                    UUID,
  slug                  TEXT,
  title                 TEXT,
  funding_org           TEXT,
  opportunity_id        TEXT,
  deadline              TIMESTAMPTZ,
  deadline_display_text TEXT,
  min_amount            NUMERIC,
  max_amount            NUMERIC,
  currency              TEXT,
  funding_type          TEXT,
  location              TEXT,
  sector                TEXT,
  implementation_area   TEXT,
  category              TEXT,
  teaser                TEXT,
  target_audience       TEXT,
  image                 TEXT,
  status                grant_status,
  priority              grant_priority,
  is_featured           BOOLEAN,
  notify_me_enabled     BOOLEAN,
  tags                  TEXT[],
  countries             TEXT[],
  published_at          TIMESTAMPTZ,
  total_count           BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total BIGINT;
BEGIN
  -- Count total matching results
  SELECT count(*) INTO total
  FROM grants g
  WHERE g.published_at IS NOT NULL
    AND (p_status IS NULL OR g.status::TEXT = p_status)
    AND (p_sector IS NULL OR g.sector = p_sector)
    AND (p_category IS NULL OR g.category = p_category)
    AND (p_area IS NULL OR g.implementation_area = p_area)
    AND (p_min_amount IS NULL OR g.max_amount >= p_min_amount)
    AND (p_max_amount IS NULL OR g.min_amount <= p_max_amount)
    AND (p_search IS NULL OR g.search_vector @@ plainto_tsquery('english', p_search));

  RETURN QUERY
  SELECT
    g.id, g.slug, g.title, g.funding_org, g.opportunity_id,
    g.deadline, g.deadline_display_text,
    g.min_amount, g.max_amount, g.currency, g.funding_type,
    g.location, g.sector, g.implementation_area, g.category,
    g.teaser, g.target_audience, g.image,
    g.status, g.priority, g.is_featured, g.notify_me_enabled,
    g.tags, g.countries, g.published_at,
    total AS total_count
  FROM grants g
  WHERE g.published_at IS NOT NULL
    AND (p_status IS NULL OR g.status::TEXT = p_status)
    AND (p_sector IS NULL OR g.sector = p_sector)
    AND (p_category IS NULL OR g.category = p_category)
    AND (p_area IS NULL OR g.implementation_area = p_area)
    AND (p_min_amount IS NULL OR g.max_amount >= p_min_amount)
    AND (p_max_amount IS NULL OR g.min_amount <= p_max_amount)
    AND (p_search IS NULL OR g.search_vector @@ plainto_tsquery('english', p_search))
  ORDER BY
    CASE WHEN p_sort = 'deadline' AND p_order = 'asc' THEN g.deadline END ASC,
    CASE WHEN p_sort = 'deadline' AND p_order = 'desc' THEN g.deadline END DESC,
    CASE WHEN p_sort = 'created_at' AND p_order = 'asc' THEN g.created_at END ASC,
    CASE WHEN p_sort = 'created_at' AND p_order = 'desc' THEN g.created_at END DESC,
    CASE WHEN p_sort = 'title' AND p_order = 'asc' THEN g.title END ASC,
    CASE WHEN p_sort = 'title' AND p_order = 'desc' THEN g.title END DESC,
    CASE WHEN p_sort = 'max_amount' AND p_order = 'asc' THEN g.max_amount END ASC,
    CASE WHEN p_sort = 'max_amount' AND p_order = 'desc' THEN g.max_amount END DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Grant execute to all roles
GRANT EXECUTE ON FUNCTION get_public_grants TO anon, authenticated;
