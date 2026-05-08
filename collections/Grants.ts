import type { CollectionConfig } from 'payload';
import { createAuditHooks } from '@/lib/audit';

const auditHooks = createAuditHooks('grants');

export const Grants: CollectionConfig = {
  slug: 'grants',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'funding_org', 'status', 'priority', 'deadline'],
    description: 'Manage grant & funding opportunities. Each grant appears in the public portal.',
    listSearchableFields: ['title', 'funding_org', 'opportunity_id', 'slug'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  hooks: {
    afterChange: [auditHooks.afterChange],
    afterDelete: [auditHooks.afterDelete],
  },
  timestamps: true,
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Information',
          description: 'Core details about the grant opportunity',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'The display title of the grant (e.g. "EU Action Grants: Strengthening Civil Society in Ethiopia")',
                  },
                },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  unique: true,
                  admin: {
                    description: 'URL-friendly identifier. Auto-generated from title if left blank.',
                    position: 'sidebar',
                  },
                  hooks: {
                    beforeValidate: [
                      ({ value, data }) => {
                        if (!value && data?.title) {
                          return data.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-|-$/g, '');
                        }
                        return value;
                      },
                    ],
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'funding_org',
                  label: 'Funding Organization',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Name of the funder (e.g. "European Commission", "UNICEF")',
                  },
                },
                {
                  name: 'opportunity_id',
                  label: 'Opportunity ID',
                  type: 'text',
                  admin: {
                    description: 'Official opportunity reference (e.g. "EuropeAid/182336/DD/ACT/ET")',
                  },
                },
              ],
            },
            {
              name: 'teaser',
              type: 'textarea',
              required: true,
              maxLength: 500,
              admin: {
                description: 'Short summary shown on the public card (max 500 chars). Visible to everyone.',
              },
            },
            {
              name: 'target_audience',
              label: 'Best For',
              type: 'text',
              admin: {
                description: 'Who this grant is ideal for (e.g. "Local CSOs in Ethiopia", "Ag-tech startups")',
              },
            },
          ],
        },
        {
          label: 'Full Description',
          description: 'Detailed content — only visible to authenticated users',
          fields: [
            {
              name: 'full_description',
              label: 'Full Grant Description',
              type: 'richText',
              required: true,
              admin: {
                description: 'Complete description including strategic focus. Only visible to signed-in users.',
              },
            },
            {
              name: 'eligibility_summary',
              label: 'Eligibility Summary',
              type: 'textarea',
              admin: {
                description: 'Brief text summary of eligibility requirements',
              },
            },
            {
              name: 'eligibility_checklist',
              label: 'Eligibility Checklist',
              type: 'array',
              admin: {
                description: 'Checklist items shown to applicants (e.g. "Must be a non-profit legal entity")',
              },
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Financials',
          description: 'Funding amounts, currency, and financial details',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'min_amount',
                  label: 'Minimum Amount',
                  type: 'number',
                  admin: {
                    description: 'Minimum grant amount (leave blank if not specified)',
                    step: 1,
                  },
                },
                {
                  name: 'max_amount',
                  label: 'Maximum Amount',
                  type: 'number',
                  admin: {
                    description: 'Maximum grant amount',
                    step: 1,
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'currency',
                  type: 'select',
                  required: true,
                  defaultValue: 'USD',
                  options: [
                    { label: 'US Dollar (USD)', value: 'USD' },
                    { label: 'Euro (EUR)', value: 'EUR' },
                    { label: 'Ethiopian Birr (ETB)', value: 'ETB' },
                    { label: 'British Pound (GBP)', value: 'GBP' },
                  ],
                  admin: {
                    description: 'EU-based funders should use EUR. Currency affects display order.',
                  },
                },
                {
                  name: 'funding_rate',
                  label: 'Funding Rate',
                  type: 'text',
                  admin: {
                    description: 'e.g. "Up to 90%" or "100% funded"',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'funding_type',
                  label: 'Funding Type',
                  type: 'select',
                  required: true,
                  defaultValue: 'Grant',
                  options: [
                    { label: 'Grant', value: 'Grant' },
                    { label: 'Seed Funding', value: 'Seed Funding' },
                    { label: 'Technical Assistance', value: 'Technical Assistance' },
                    { label: 'Fellowship', value: 'Fellowship' },
                    { label: 'Prize', value: 'Prize' },
                    { label: 'Operational Partnership', value: 'Operational Partnership' },
                    { label: 'Research Grant', value: 'Research Grant' },
                    { label: 'Other', value: 'Other' },
                  ],
                },
                {
                  name: 'co_financing_required',
                  label: 'Co-financing Required?',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Check if the grant requires matching funds from the applicant',
                  },
                },
              ],
            },
            {
              name: 'duration_months',
              label: 'Project Duration (Months)',
              type: 'number',
              admin: {
                description: 'Expected project duration in months',
                step: 1,
              },
            },
          ],
        },
        {
          label: 'Classification',
          description: 'Categorization for filtering and discovery',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'sector',
                  type: 'select',
                  required: true,
                  defaultValue: 'Other',
                  options: [
                    { label: 'Civil Society & Governance', value: 'Civil Society & Governance' },
                    { label: 'Agriculture & Nutrition', value: 'Agriculture & Nutrition' },
                    { label: 'Technology & Innovation', value: 'Technology & Innovation' },
                    { label: 'Health & WASH', value: 'Health & WASH' },
                    { label: 'Education & Research', value: 'Education & Research' },
                    { label: 'Climate & Environment', value: 'Climate & Environment' },
                    { label: 'Private Sector & Industry', value: 'Private Sector & Industry' },
                    { label: 'Human Rights & Gender', value: 'Human Rights & Gender' },
                    { label: 'Emergency & Resilience', value: 'Emergency & Resilience' },
                    { label: 'AI & Data Science', value: 'AI & Data Science' },
                    { label: 'Other', value: 'Other' },
                  ],
                },
                {
                  name: 'category',
                  type: 'select',
                  required: true,
                  defaultValue: 'Other',
                  options: [
                    { label: 'Governance', value: 'Governance' },
                    { label: 'Innovation', value: 'Innovation' },
                    { label: 'Global Impact', value: 'Global Impact' },
                    { label: 'Health', value: 'Health' },
                    { label: 'Private Sector', value: 'Private Sector' },
                    { label: 'Digital Justice', value: 'Digital Justice' },
                    { label: 'Agri-Nutrition', value: 'Agri-Nutrition' },
                    { label: 'Emergency Resilience', value: 'Emergency Resilience' },
                    { label: 'Biotech Research', value: 'Biotech Research' },
                    { label: "Women's Rights", value: "Women's Rights" },
                    { label: 'Deep Science', value: 'Deep Science' },
                    { label: 'Human Agency', value: 'Human Agency' },
                    { label: 'Other', value: 'Other' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'implementation_area',
                  label: 'Implementation Area',
                  type: 'select',
                  required: true,
                  defaultValue: 'Ethiopia',
                  options: [
                    { label: 'Ethiopia', value: 'Ethiopia' },
                    { label: 'East Africa', value: 'East Africa' },
                    { label: 'Sub-Saharan Africa', value: 'Sub-Saharan Africa' },
                    { label: 'Global', value: 'Global' },
                    { label: 'Other', value: 'Other' },
                  ],
                },
                {
                  name: 'location',
                  type: 'text',
                  required: true,
                  defaultValue: 'Ethiopia',
                  admin: {
                    description: 'Display location text (e.g. "Ethiopia", "Global (East Africa priority)")',
                  },
                },
              ],
            },
            {
              name: 'countries',
              type: 'select',
              hasMany: true,
              defaultValue: ['Ethiopia'],
              options: [
                'Ethiopia', 'Kenya', 'Uganda', 'Tanzania', 'Rwanda',
                'Somalia', 'Djibouti', 'South Sudan', 'Eritrea', 'Global',
              ].map((c) => ({ label: c, value: c })),
              admin: {
                description: 'Countries where this grant applies',
              },
            },
            {
              name: 'regions',
              type: 'select',
              hasMany: true,
              defaultValue: ['East Africa'],
              options: [
                { label: 'East Africa', value: 'East Africa' },
                { label: 'West Africa', value: 'West Africa' },
                { label: 'Southern Africa', value: 'Southern Africa' },
                { label: 'North Africa', value: 'North Africa' },
                { label: 'Central Africa', value: 'Central Africa' },
                { label: 'Global', value: 'Global' },
              ],
            },
            {
              name: 'tags',
              type: 'text',
              hasMany: true,
              admin: {
                description: 'Free-form tags for additional categorization',
              },
            },
          ],
        },
        {
          label: 'Deadline & Links',
          description: 'Application deadline and external links',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'deadline',
                  type: 'date',
                  required: true,
                  admin: {
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                    description: 'Application deadline date and time',
                  },
                },
                {
                  name: 'deadline_timezone',
                  label: 'Deadline Timezone',
                  type: 'text',
                  defaultValue: 'Africa/Addis_Ababa',
                  admin: {
                    description: 'IANA timezone (e.g. "Europe/Brussels", "Africa/Addis_Ababa")',
                  },
                },
              ],
            },
            {
              name: 'deadline_display_text',
              label: 'Deadline Display Text',
              type: 'text',
              admin: {
                description: 'Human-readable deadline (e.g. "May 13, 2026 — 15:30 Brussels Time / 16:30 EAT")',
              },
            },
            {
              name: 'application_link',
              label: 'Application Link',
              type: 'text',
              admin: {
                description: 'Direct URL to apply. Leave blank if archived.',
              },
            },
            {
              name: 'application_platform',
              label: 'Application Platform',
              type: 'text',
              admin: {
                description: 'Platform name (e.g. "EU Funding & Tenders", "UNICEF Innovation Portal")',
              },
            },
            {
              name: 'external_application_url',
              label: 'External Application URL (Archived)',
              type: 'text',
              admin: {
                description: 'Archive link for closed grants',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'source_name',
                  label: 'Source Name',
                  type: 'text',
                  admin: {
                    description: 'Where this grant was found',
                  },
                },
                {
                  name: 'source_link',
                  label: 'Source Link',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'Status & Admin',
          description: 'Publication status, priority, and admin notes',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'active',
                  options: [
                    { label: '🟢 Active', value: 'active' },
                    { label: '🔴 Urgent (Closing Soon)', value: 'urgent' },
                    { label: '📦 Archived (Past Deadline)', value: 'archived' },
                    { label: '⚫ Closed', value: 'closed' },
                  ],
                  admin: {
                    description: 'Active = open for applications. Urgent = closing this week. Archived/Closed = past deadline.',
                  },
                },
                {
                  name: 'priority',
                  type: 'select',
                  required: true,
                  defaultValue: 'normal',
                  options: [
                    { label: '⬆️ High Priority', value: 'high' },
                    { label: '➡️ Normal', value: 'normal' },
                    { label: '⬇️ Low', value: 'low' },
                  ],
                  admin: {
                    description: 'Controls sort order in the gallery. High priority grants appear first.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'is_featured',
                  label: 'Featured Grant',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Featured grants are highlighted in the gallery',
                  },
                },
                {
                  name: 'notify_me_enabled',
                  label: 'Enable "Notify Me" Button',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show "Notify Me of Next Cycle" button for closed/archived grants',
                  },
                },
              ],
            },
            {
              name: 'archived_reason',
              label: 'Archived Reason',
              type: 'text',
              admin: {
                description: 'Reason for archiving (e.g. "Deadline passed April 28")',
                condition: (data) => data?.status === 'archived' || data?.status === 'closed',
              },
            },
            {
              name: 'published_at',
              label: 'Published At',
              type: 'date',
              admin: {
                description: 'Set a date to make this grant visible on the public site. Leave blank for drafts.',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'private_notes',
              label: 'Private Admin Notes',
              type: 'textarea',
              admin: {
                description: '⚠️ Internal notes — never shown to the public or authenticated users',
              },
              access: {
                read: ({ req }) => !!req.user,
              },
            },
          ],
        },
        {
          label: 'Media',
          description: 'Images and visual assets',
          fields: [
            {
              name: 'image',
              label: 'Featured Image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Main image for this grant card',
              },
            },
            {
              name: 'images_gallery',
              label: 'Images Gallery',
              type: 'array',
              admin: {
                description: 'Additional images for the grant gallery',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'created_by',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ req, operation }) => {
            if (operation === 'create') {
              return req.user?.id;
            }
          },
        ],
      },
    },
    {
      name: 'updated_by',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ req }) => {
            return req.user?.id;
          },
        ],
      },
    },
  ],
};
