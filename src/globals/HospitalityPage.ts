import type { GlobalConfig } from 'payload'

export const HospitalityPage: GlobalConfig = {
  slug: 'hospitality-page',
  label: 'Hospitality Page',
  admin: {
    description: 'Manage content for the Hospitality page',
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
                  name: 'badgeText',
                  label: 'Badge Text',
                  type: 'text',
                  defaultValue: 'Coming Soon',
                },
                {
                  name: 'headline',
                  label: 'Headline',
                  type: 'text',
                  defaultValue: 'HOSPITALITY',
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                  defaultValue:
                    "We're crafting exceptional greenery solutions tailored for the hospitality industry. Premium plantscaping for hotels, resorts, and luxury venues is on its way.",
                },
                {
                  name: 'primaryCtaText',
                  label: 'Primary CTA Text',
                  type: 'text',
                  defaultValue: 'Get in Touch',
                },
                {
                  name: 'primaryCtaLink',
                  label: 'Primary CTA Link',
                  type: 'text',
                  defaultValue: '/contact',
                },
                {
                  name: 'secondaryCtaText',
                  label: 'Secondary CTA Text',
                  type: 'text',
                  defaultValue: 'Explore Interiors',
                },
                {
                  name: 'secondaryCtaLink',
                  label: 'Secondary CTA Link',
                  type: 'text',
                  defaultValue: '/',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}




