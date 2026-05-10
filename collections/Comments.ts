// =============================================================================
// Payload CMS — Comments Collection (Help Desk Inquiries)
// =============================================================================

import type { CollectionConfig } from 'payload';

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'message',
    group: 'Submissions',
    description: 'Help Desk inquiries submitted by authenticated users.',
    defaultColumns: ['grant', 'user_id', 'category', 'createdAt'],
  },
  access: {
    // Only admins can read help desk inquiries
    read: ({ req }) => !!req.user,
    create: () => true,
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
        description: 'The grant this inquiry is related to',
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
      name: 'message',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The content of the help desk inquiry',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Technical Issue', value: 'Technical Issue' },
        { label: 'Document Question', value: 'Document Question' },
        { label: 'Deadline Clarification', value: 'Deadline Clarification' },
        { label: 'Other', value: 'Other' },
      ],
    },
  ],
  timestamps: true,
};
