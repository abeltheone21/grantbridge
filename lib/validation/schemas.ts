import { z } from 'zod';

const uuidSchema = z.string().uuid('Must be a valid UUID');

const sanitizedText = z
  .string()
  .trim()
  .transform((val) => val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''));

export const createApplicationSchema = z.object({
  grant_id: uuidSchema,
  support_statement: sanitizedText
    .pipe(z.string().min(50, 'Support statement must be at least 50 characters'))
    .pipe(z.string().max(5000, 'Support statement must not exceed 5000 characters')),
  source_page: z.string().url().optional().nullable(),
  submission_token: z.string().max(255).optional().nullable(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

const commentCategories = [
  'Technical Issue',
  'Document Question',
  'Deadline Clarification',
  'Other',
] as const;

export const createCommentSchema = z.object({
  grant_id: uuidSchema,
  message: sanitizedText
    .pipe(z.string().min(10, 'Message must be at least 10 characters'))
    .pipe(z.string().max(3000, 'Message must not exceed 3000 characters')),
  category: z.enum(commentCategories),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const createNotificationSchema = z.object({
  grant_id: uuidSchema,
  email: z.string().email('Must be a valid email address').max(320),
  source: z.string().max(100).optional().nullable(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;

export const createGrantViewSchema = z.object({
  grant_id: uuidSchema,
  session_id: z.string().max(255).optional().nullable(),
});

export type CreateGrantViewInput = z.infer<typeof createGrantViewSchema>;

export const publicGrantsQuerySchema = z.object({
  status: z.enum(['active', 'urgent', 'archived', 'closed']).optional(),
  sector: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  implementation_area: z.string().max(100).optional(),
  min_amount: z.coerce.number().min(0).optional(),
  max_amount: z.coerce.number().min(0).optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['deadline', 'created_at', 'title', 'max_amount']).default('deadline'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export type PublicGrantsQuery = z.infer<typeof publicGrantsQuerySchema>;
