import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';
import { publicGrantsQuerySchema } from '@/lib/validation/schemas';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    const parsed = publicGrantsQuerySchema.safeParse(rawParams);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      status, sector, category, implementation_area,
      min_amount, max_amount, search,
      page, limit, sort, order
    } = parsed.data;

    const offset = (page - 1) * limit;
    const supabase = getServiceClient();

    const { data, error } = await supabase.rpc('get_public_grants', {
      p_status: status || null,
      p_sector: sector || null,
      p_category: category || null,
      p_area: implementation_area || null,
      p_min_amount: min_amount || null,
      p_max_amount: max_amount || null,
      p_search: search || null,
      p_limit: limit,
      p_offset: offset,
      p_sort: sort,
      p_order: order,
    });

    if (error) {
      console.error('[PublicGrants] RPC error:', error.message);
      return NextResponse.json({ error: 'Failed to fetch grants' }, { status: 500 });
    }

    const totalCount = data?.[0]?.total_count ?? 0;

    const grants = (data || []).map(({ total_count, ...grant }: Record<string, unknown>) => grant);

    return NextResponse.json(
      {
        grants,
        pagination: {
          page,
          limit,
          total: Number(totalCount),
          totalPages: Math.ceil(Number(totalCount) / limit),
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (err) {
    console.error('[PublicGrants] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
