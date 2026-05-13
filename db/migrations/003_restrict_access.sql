-- =============================================================================
-- Migration 003: Restrict grants to authenticated users only
-- =============================================================================

-- Remove anon access to the public_grants view
REVOKE SELECT ON public_grants FROM anon;

-- Ensure only authenticated users can access the view
GRANT SELECT ON public_grants TO authenticated;

-- Update the grants table policy to be even more explicit
DROP POLICY IF EXISTS "Authenticated users can read published grants" ON grants;
CREATE POLICY "Authenticated users can read published grants"
  ON grants FOR SELECT
  TO authenticated
  USING (published_at IS NOT NULL);

-- Restrict the RPC function as well
REVOKE EXECUTE ON FUNCTION get_public_grants FROM anon;
GRANT EXECUTE ON FUNCTION get_public_grants TO authenticated;

-- Add a comment to the table to document this
COMMENT ON TABLE grants IS 'Grants table - Restricted to authenticated users for full details via RLS.';
