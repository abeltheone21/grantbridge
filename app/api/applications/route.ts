import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth';
import { getUserClient } from '@/lib/supabase/server';
import { createApplicationSchema } from '@/lib/validation/schemas';
import { trackServerEvent } from '@/lib/analytics/posthog';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';

export async function POST(request: NextRequest) {
  try {
    const { user, accessToken } = await requireAuth(request);

    const body = await request.json();
    const parsed = createApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { grant_id, support_statement, source_page, submission_token } = parsed.data;

    const supabase = getUserClient(accessToken);

    if (submission_token) {
      const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('submission_token', submission_token)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { message: 'Application already submitted', id: existing.id },
          { status: 200 }
        );
      }
    }

    const { data: grant, error: grantError } = await supabase
      .from('grants')
      .select('id, status, title')
      .eq('id', grant_id)
      .maybeSingle();

    if (grantError || !grant) {
      return NextResponse.json({ error: 'Grant not found' }, { status: 404 });
    }

    if (grant.status === 'closed' || grant.status === 'archived') {
      return NextResponse.json(
        { error: 'This grant is no longer accepting applications' },
        { status: 422 }
      );
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const ipHash = ip ? Buffer.from(ip).toString('base64').slice(0, 44) : null;
    const userAgent = request.headers.get('user-agent')?.slice(0, 500) || null;

    const { data, error } = await supabase
      .from('applications')
      .insert({
        grant_id,
        user_id: user.id,
        support_statement,
        source_page: source_page || null,
        submission_token: submission_token || null,
        ip_hash: ipHash,
        user_agent: userAgent,
      })
      .select('id, created_at')
      .single();

    if (error) {
      console.error('[Applications] Insert failed:', error.message);
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }

    trackServerEvent(
      ANALYTICS_EVENTS.SUPPORT_STATEMENT_SUBMITTED,
      { grant_id, statement_length: support_statement.length },
      user.id
    );

    return NextResponse.json(
      { message: 'Application submitted successfully', id: data.id, created_at: data.created_at },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Response) return err;
    console.error('[Applications] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
