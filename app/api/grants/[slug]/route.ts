// =============================================================================
// API Route: GET /api/grants/[slug] — Authenticated grant detail
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/supabase/auth';
import { getServiceClient } from '@/lib/supabase/server';
import { trackServerEvent } from '@/lib/analytics/posthog';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const authResult = await getAuthUser(request);
    const supabase = getServiceClient();

    if (authResult.user) {
      // Authenticated: return full grant details
      const { data, error } = await supabase
        .from('grants')
        .select('*')
        .eq('slug', slug)
        .not('published_at', 'is', null)
        .maybeSingle();

      if (error || !data) {
        return NextResponse.json({ error: 'Grant not found' }, { status: 404 });
      }

      // Strip admin-only fields
      const { private_notes, ...publicData } = data;

      // Track view server-side
      trackServerEvent(
        ANALYTICS_EVENTS.FULL_GRANT_VIEWED,
        {
          grant_id: data.id,
          grant_slug: slug,
          grant_status: data.status,
          is_authenticated: true,
        },
        authResult.user.id
      );

      return NextResponse.json({ grant: publicData }, { status: 200 });
    } else {
      // Anonymous: return teaser-only via the public view
      const { data, error } = await supabase
        .from('public_grants')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error || !data) {
        return NextResponse.json({ error: 'Grant not found' }, { status: 404 });
      }

      return NextResponse.json(
        {
          grant: data,
          requires_auth: true,
          message: 'Sign in to view full grant details',
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
          },
        }
      );
    }
  } catch (err) {
    console.error('[GrantDetail] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
