// =============================================================================
// API Route: POST /api/comments — Submit a Help Desk Inquiry
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth';
import { getUserClient } from '@/lib/supabase/server';
import { createCommentSchema } from '@/lib/validation/schemas';
import { trackServerEvent } from '@/lib/analytics/posthog';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const { user, accessToken } = await requireAuth(request);

    // 2. Validate input
    const body = await request.json();
    const parsed = createCommentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { grant_id, message, category } = parsed.data;

    // 3. Verify the grant exists
    const supabase = getUserClient(accessToken);

    const { data: grant, error: grantError } = await supabase
      .from('grants')
      .select('id')
      .eq('id', grant_id)
      .maybeSingle();

    if (grantError || !grant) {
      return NextResponse.json({ error: 'Grant not found' }, { status: 404 });
    }

    // 4. Insert the comment (RLS ensures user_id = auth.uid())
    const { data, error } = await supabase
      .from('comments')
      .insert({
        grant_id,
        user_id: user.id,
        message,
        category,
      })
      .select('id, created_at')
      .single();

    if (error) {
      console.error('[Comments] Insert failed:', error.message);
      return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 });
    }

    // 5. Track analytics
    trackServerEvent(
      ANALYTICS_EVENTS.HELP_DESK_COMMENT_SENT,
      { grant_id, category },
      user.id
    );

    return NextResponse.json(
      { message: 'Help desk inquiry submitted successfully', id: data.id },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Response) return err;
    console.error('[Comments] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
