// =============================================================================
// Payload CMS — Applications Collection (Support Statements)
// =============================================================================

import type { CollectionConfig } from 'payload';

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'id',
    group: 'Submissions',
    description: 'Support statements submitted by authenticated users for specific grants.',
    defaultColumns: ['grant', 'user_id', 'status', 'createdAt'],
  },
  access: {
    // Only admins can read all applications
    // Authenticated users can read their own (handled via filter or logic if needed)
    // For MVP, we restrict to admins for simplicity in CMS
    read: ({ req }) => !!req.user,
    create: () => true, // Anyone can submit via API if we handle auth there, but Payload admin usually restricted
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'grant',
      type: 'relationship',
      relationTo: 'grants',
      required: true,
      admin: {
        description: 'The grant this application is for',
      },
    },
    {
      name: 'user_id',
      type: 'text',
      required: true,
      admin: {
        description: 'Supabase Auth User ID',
      },
    },
    {
      name: 'support_statement',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The content of the support statement',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'submitted',
      options: [
        { label: 'Submitted', value: 'submitted' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Flagged', value: 'flagged' },
      ],
    },
    {
      name: 'ip_hash',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'user_agent',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'source_page',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'submission_token',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'admin_notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes for admins',
      },
    },
  ],
  timestamps: true,
};
