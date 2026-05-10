// =============================================================================
// API Route: POST /api/grant-views — Track grant detail page views
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/supabase/auth';
import { getServiceClient } from '@/lib/supabase/server';
import { createGrantViewSchema } from '@/lib/validation/schemas';

export async function POST(request: NextRequest) {
  try {
    const authResult = await getAuthUser(request);

    const body = await request.json();
    const parsed = createGrantViewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { grant_id, session_id } = parsed.data;
    const supabase = getServiceClient();

    // Fire-and-forget insert — don't block the response
    supabase
      .from('grant_views')
      .insert({
        grant_id,
        user_id: authResult.user?.id || null,
        session_id: session_id || null,
        is_authenticated: !!authResult.user,
      })
      .then(({ error }) => {
        if (error) console.error('[GrantViews] Insert failed:', error.message);
      });

    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
