import type { GlobalConfig } from 'payload'

export const StylingPage: GlobalConfig = {
  slug: 'styling-page',
  label: 'Styling Page',
  admin: {
    description: 'Manage content for the Styling page',
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
                  defaultValue: 'Interior Styling',
                },
                {
                  name: 'headline',
                  label: 'Headline',
                  type: 'text',
                  defaultValue: 'Styling',
                },
                {
                  name: 'description',
                  label: 'Description',
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
