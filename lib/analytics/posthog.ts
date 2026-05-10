// =============================================================================
// PostHog Server-Side Helper — lean event ingestion
// =============================================================================

import { PostHog } from 'posthog-node';
import { type AnalyticsEventName, type EventProperties } from './events';

let _client: PostHog | null = null;

function getPostHogClient(): PostHog | null {
  if (_client) return _client;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.POSTHOG_HOST;

  if (!apiKey) {
    console.warn('[PostHog] No API key configured — events will not be sent.');
    return null;
  }

  _client = new PostHog(apiKey, {
    host: host || 'https://us.i.posthog.com',
    flushAt: 10,
    flushInterval: 5000,
  });

  return _client;
}

/**
 * Track a server-side analytics event.
 * Fails silently if PostHog is not configured — never blocks the request.
 */
export function trackServerEvent<E extends AnalyticsEventName>(
  event: E,
  properties: E extends keyof EventProperties ? EventProperties[E] : Record<string, unknown>,
  distinctId: string = 'server',
): void {
  try {
    const client = getPostHogClient();
    if (!client) return;

    client.capture({
      distinctId,
      event,
      properties: {
        ...properties,
        source: 'server',
      },
    });
  } catch (err) {
    // Never let analytics errors break the app
    console.error('[PostHog] Failed to track event:', err);
  }
}

/**
 * Flush pending events. Call this in API route cleanup or shutdown hooks.
 */
export async function flushPostHog(): Promise<void> {
  try {
    const client = getPostHogClient();
    if (client) await client.shutdown();
  } catch {
    // Ignore flush errors
  }
}
