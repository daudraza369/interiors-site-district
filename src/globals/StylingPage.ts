import type { GlobalConfig } from 'payload'

export const StylingPage: GlobalConfig = {
  slug: 'styling-page', // Keep slug unchanged to preserve CMS data
  label: 'Design Page',
  admin: {
    description: 'Manage content for the Design page',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Coming Soon',
          fields: [
            {
              name: 'comingSoonSection',
              label: 'Coming Soon Section',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  label: 'Enable Section',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'eyebrow',
                  label: 'Eyebrow Text',
                  type: 'text',
                  defaultValue: 'Interior Design',
                },
                {
                  name: 'headline',
                  label: 'Headline',
                  type: 'text',
                  defaultValue: 'Design',
                },
                {
                  name: 'description',
                  label: 'Hero Description',
                  type: 'textarea',
                  defaultValue:
                    "Bespoke interior design solutions that seamlessly integrate living greenery into your architectural vision.",
                },
                {
                  name: 'contentText',
                  label: 'Content Section Text',
                  type: 'textarea',
                  defaultValue:
                    "Content coming soon. We're crafting something beautiful for this page.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
