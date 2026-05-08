// =============================================================================
// Payload CMS — Admin Users Collection
// =============================================================================
// Manages admin access to the CMS. Only admins can log into /admin.
// Create the first admin via: npx payload create-first-user
// =============================================================================

import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
    description: 'Admin users who can manage content in Payload CMS.',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Super Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        update: ({ req }) => {
          const user = req.user as { role?: string } | null;
          return user?.role === 'admin';
        },
      },
    },
  ],
};
