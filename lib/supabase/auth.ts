import { NextRequest } from 'next/server';
import { getUserClient } from './server';

export interface AuthUser {
  id: string;
  email: string | undefined;
  role: string | undefined;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
  accessToken: string | null;
}

export async function getAuthUser(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'Missing or invalid Authorization header', accessToken: null };
  }

  const accessToken = authHeader.replace('Bearer ', '');

  if (!accessToken) {
    return { user: null, error: 'Empty access token', accessToken: null };
  }

  try {
    const supabase = getUserClient(accessToken);
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return {
        user: null,
        error: error?.message || 'Invalid or expired token',
        accessToken,
      };
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
      },
      error: null,
      accessToken,
    };
  } catch (err) {
    return {
      user: null,
      error: err instanceof Error ? err.message : 'Authentication failed',
      accessToken,
    };
  }
}

export async function requireAuth(request: NextRequest): Promise<{ user: AuthUser; accessToken: string }> {
  const result = await getAuthUser(request);

  if (!result.user || !result.accessToken) {
    throw new Response(
      JSON.stringify({ error: result.error || 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return { user: result.user, accessToken: result.accessToken };
}
