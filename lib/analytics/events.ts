// =============================================================================
// PostHog Event Contract — shared event name constants & typed properties
// =============================================================================

/**
 * All analytics event names as constants.
 * Both frontend and backend should import from here for consistency.
 */
export const ANALYTICS_EVENTS = {
  // Page views
  GALLERY_PAGE_VIEW: 'gallery_page_view',
  FULL_GRANT_VIEWED: 'full_grant_viewed',

  // Interactions
  FILTER_APPLIED: 'filter_applied',
  GRANT_CARD_CLICKED: 'grant_card_clicked',
  TIME_SPENT_ON_DETAIL_PAGE: 'time_spent_on_detail_page',

  // Auth
  SIGN_IN_SUCCESS: 'sign_in_success',

  // Submissions
  SUPPORT_STATEMENT_SUBMITTED: 'support_statement_submitted',
  HELP_DESK_COMMENT_SENT: 'help_desk_comment_sent',

  // Notifications
  NOTIFY_ME_SUBSCRIBED: 'notify_me_subscribed',
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

// ---------------------------------------------------------------------------
// Typed property maps for each event
// ---------------------------------------------------------------------------

export interface EventProperties {
  [ANALYTICS_EVENTS.GALLERY_PAGE_VIEW]: {
    filters_active?: boolean;
    result_count?: number;
  };
  [ANALYTICS_EVENTS.FULL_GRANT_VIEWED]: {
    grant_id: string;
    grant_slug: string;
    grant_status: string;
    is_authenticated: boolean;
  };
  [ANALYTICS_EVENTS.FILTER_APPLIED]: {
    filter_type: 'sector' | 'category' | 'funding_range' | 'implementation_area' | 'search';
    filter_value: string;
  };
  [ANALYTICS_EVENTS.GRANT_CARD_CLICKED]: {
    grant_id: string;
    grant_slug: string;
    position_index?: number;
  };
  [ANALYTICS_EVENTS.TIME_SPENT_ON_DETAIL_PAGE]: {
    grant_id: string;
    grant_slug: string;
    duration_seconds: number;
  };
  [ANALYTICS_EVENTS.SIGN_IN_SUCCESS]: {
    method: 'google' | 'email';
  };
  [ANALYTICS_EVENTS.SUPPORT_STATEMENT_SUBMITTED]: {
    grant_id: string;
    statement_length: number;
  };
  [ANALYTICS_EVENTS.HELP_DESK_COMMENT_SENT]: {
    grant_id: string;
    category: string;
  };
  [ANALYTICS_EVENTS.NOTIFY_ME_SUBSCRIBED]: {
    grant_id: string;
  };
}
