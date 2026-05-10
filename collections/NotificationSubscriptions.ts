// =============================================================================
// Payload CMS — Notification Subscriptions Collection
// =============================================================================

import type { CollectionConfig } from 'payload';

export const NotificationSubscriptions: CollectionConfig = {
  slug: 'notification-subscriptions',
  admin: {
    useAsTitle: 'email',
    group: 'Submissions',
    description: 'Users who want to be notified of the next funding cycle.',
    defaultColumns: ['email', 'grant', 'createdAt'],
  },
  access: {
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
    },
    {
      name: 'user_id',
      type: 'text',
      admin: {
        description: 'Supabase Auth User ID (optional)',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'Where the subscription came from (e.g. "Grant Detail Page")',
      },
    },
  ],
  timestamps: true,
};
