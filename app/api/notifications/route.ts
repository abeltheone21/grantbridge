// =============================================================================
// API Route: POST /api/notifications — Subscribe to "Notify Me of Next Cycle"
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/supabase/auth';
import { getServiceClient } from '@/lib/supabase/server';
import { createNotificationSchema } from '@/lib/validation/schemas';
import { trackServerEvent } from '@/lib/analytics/posthog';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';

export async function POST(request: NextRequest) {
  try {
    // Auth is optional — both anon and authenticated users can subscribe
    const authResult = await getAuthUser(request);

    // Validate input
    const body = await request.json();
    const parsed = createNotificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { grant_id, email, source } = parsed.data;

    // Use service client for insert (anon users can subscribe too)
    const supabase = getServiceClient();

    // Verify grant exists
    const { data: grant, error: grantError } = await supabase
      .from('grants')
      .select('id, title')
      .eq('id', grant_id)
      .maybeSingle();

    if (grantError || !grant) {
      return NextResponse.json({ error: 'Grant not found' }, { status: 404 });
    }

    // Upsert subscription (unique on grant_id + email)
    const { error } = await supabase
      .from('notification_subscriptions')
      .upsert(
        {
          grant_id,
          user_id: authResult.user?.id || null,
          email,
          source: source || null,
        },
        { onConflict: 'grant_id,email' }
      );

    if (error) {
      console.error('[Notifications] Upsert failed:', error.message);
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }

    // Track analytics
    trackServerEvent(
      ANALYTICS_EVENTS.NOTIFY_ME_SUBSCRIBED,
      { grant_id },
      authResult.user?.id || 'anonymous'
    );

    return NextResponse.json(
      { message: 'Successfully subscribed to notifications' },
      { status: 201 }
    );
  } catch (err) {
    console.error('[Notifications] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
