// =============================================================================
// GrantBridge — Shared Types
// =============================================================================

/** Grant status options */
export type GrantStatus = 'active' | 'urgent' | 'archived' | 'closed';

/** Admin priority classification */
export type GrantPriority = 'high' | 'normal' | 'low';

/** Grant category for filtering */
export type GrantCategory =
  | 'Governance'
  | 'Innovation'
  | 'Global Impact'
  | 'Health'
  | 'Private Sector'
  | 'Digital Justice'
  | 'Agri-Nutrition'
  | 'Emergency Resilience'
  | 'Biotech Research'
  | 'Women\'s Rights'
  | 'Deep Science'
  | 'Human Agency'
  | 'Other';

/** Sector for filtering */
export type GrantSector =
  | 'Civil Society & Governance'
  | 'Agriculture & Nutrition'
  | 'Technology & Innovation'
  | 'Health & WASH'
  | 'Education & Research'
  | 'Climate & Environment'
  | 'Private Sector & Industry'
  | 'Human Rights & Gender'
  | 'Emergency & Resilience'
  | 'AI & Data Science'
  | 'Other';

/** Implementation area */
export type ImplementationArea =
  | 'Ethiopia'
  | 'East Africa'
  | 'Sub-Saharan Africa'
  | 'Global'
  | 'Other';

/** Funding type */
export type FundingType =
  | 'Grant'
  | 'Seed Funding'
  | 'Technical Assistance'
  | 'Fellowship'
  | 'Prize'
  | 'Operational Partnership'
  | 'Research Grant'
  | 'Other';

/** Currency codes used in grants */
export type CurrencyCode = 'EUR' | 'USD' | 'ETB' | 'GBP';

/** Application status */
export type ApplicationStatus = 'submitted' | 'reviewed' | 'flagged';

/** Help desk comment category */
export type CommentCategory =
  | 'Technical Issue'
  | 'Document Question'
  | 'Deadline Clarification'
  | 'Other';

// ---------------------------------------------------------------------------
// Database row types
// ---------------------------------------------------------------------------

/** Full grant record (authenticated + admin access) */
export interface Grant {
  id: string;
  slug: string;
  title: string;
  funding_org: string;
  opportunity_id: string | null;
  deadline: string;
  deadline_timezone: string | null;
  deadline_display_text: string | null;
  min_amount: number | null;
  max_amount: number | null;
  currency: CurrencyCode;
  funding_rate: string | null;
  funding_type: FundingType;
  location: string;
  sector: GrantSector;
  implementation_area: ImplementationArea;
  category: GrantCategory;
  teaser: string;
  full_description: string;
  eligibility_summary: string | null;
  eligibility_checklist: string[] | null;
  target_audience: string | null;
  duration_months: number | null;
  co_financing_required: boolean;
  application_link: string | null;
  application_platform: string | null;
  external_application_url: string | null;
  source_name: string | null;
  source_link: string | null;
  image: string | null;
  status: GrantStatus;
  priority: GrantPriority;
  is_featured: boolean;
  notify_me_enabled: boolean;
  archived_reason: string | null;
  tags: string[] | null;
  countries: string[] | null;
  regions: string[] | null;
  private_notes: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}

/** Public-safe grant teaser (anonymous access via view) */
export interface PublicGrant {
  id: string;
  slug: string;
  title: string;
  funding_org: string;
  opportunity_id: string | null;
  deadline: string;
  deadline_display_text: string | null;
  min_amount: number | null;
  max_amount: number | null;
  currency: CurrencyCode;
  funding_type: FundingType;
  location: string;
  sector: GrantSector;
  implementation_area: ImplementationArea;
  category: GrantCategory;
  teaser: string;
  target_audience: string | null;
  image: string | null;
  status: GrantStatus;
  priority: GrantPriority;
  is_featured: boolean;
  notify_me_enabled: boolean;
  tags: string[] | null;
  countries: string[] | null;
  published_at: string | null;
}

/** Application / Support Statement */
export interface Application {
  id: string;
  grant_id: string;
  user_id: string;
  support_statement: string;
  status: ApplicationStatus;
  submission_token: string | null;
  source_page: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Help Desk Comment */
export interface Comment {
  id: string;
  grant_id: string;
  user_id: string;
  message: string;
  category: CommentCategory;
  created_at: string;
  updated_at: string;
}

/** Grant view tracking */
export interface GrantView {
  id: string;
  grant_id: string;
  user_id: string | null;
  session_id: string | null;
  viewed_at: string;
  is_authenticated: boolean;
}

/** Notification subscription */
export interface NotificationSubscription {
  id: string;
  grant_id: string;
  user_id: string | null;
  email: string;
  source: string | null;
  created_at: string;
}

/** Admin audit log */
export interface AdminAuditLog {
  id: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  created_at: string;
}
