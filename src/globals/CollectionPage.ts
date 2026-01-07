import type { GlobalConfig } from 'payload'

export const CollectionPage: GlobalConfig = {
  slug: 'collection-page',
  label: 'Collection Page',
  admin: {
    description: 'Manage all sections of the collection page',
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
          label: 'Hero Section',
          fields: [
            {
              name: 'heroSection',
              label: 'Hero Section',
              type: 'group',
              admin: {
                description: 'Hero section at the top of the collection page',
              },
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
                  defaultValue: 'Curated Greenery',
                  admin: {
                    description: 'Small text above the headline',
                  },
                },
                {
                  name: 'headline',
                  label: 'Headline',
                  type: 'text',
                  required: true,
                  defaultValue: 'Our Collection',
                  admin: {
                    description: 'Main headline text',
                  },
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                  defaultValue:
                    'Premium greenery solutions for every environment. Explore our curated selection of trees, plants, and planters.',
                  admin: {
                    description: 'Supporting description text below headline',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}


