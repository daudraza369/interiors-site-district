import type { GlobalConfig } from 'payload'

export const ProjectsPage: GlobalConfig = {
  slug: 'projects-page',
  label: 'Projects Page',
  admin: {
    description: 'Manage all sections of the projects page',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // Tab 1: Hero Section
        {
          label: 'Hero Section',
          fields: [
            {
              name: 'heroSection',
              label: 'Hero Section',
              type: 'group',
              admin: {
                description: 'Hero section at the top of the projects page',
              },
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
                  defaultValue: 'Portfolio',
                  admin: {
                    description: 'Small text above headline (e.g., "Portfolio")',
                  },
                },
                {
                  name: 'headline',
                  label: 'Headline',
                  type: 'text',
                  required: true,
                  defaultValue: 'Our Projects',
                  admin: {
                    description: 'Main headline text',
                  },
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                  defaultValue: 'Spaces transformed through green design. A showcase of curated interiors and custom installations.',
                  admin: {
                    description: 'Supporting description text below headline',
                  },
                },
              ],
            },
          ],
        },
        // Tab 2: Gallery Section
        {
          label: 'Gallery Section',
          fields: [
            {
              name: 'gallerySection',
              label: 'Gallery Section',
              type: 'group',
              admin: {
                description: 'Filterable projects gallery with category filters',
              },
              fields: [
                {
                  name: 'enabled',
                  label: 'Enable Section',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'headline',
                  label: 'Section Headline',
                  type: 'text',
                  admin: {
                    description: 'Optional headline for the gallery section (leave empty to hide)',
                  },
                },
                {
                  name: 'categories',
                  label: 'Filter Categories',
                  type: 'array',
                  admin: {
                    description: 'Category filter options (e.g., All, Office, Hospitality, F&B, Villa)',
                  },
                  fields: [
                    {
                      name: 'label',
                      label: 'Category Label',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Display name (e.g., "Office", "Hospitality")',
                      },
                    },
                    {
                      name: 'value',
                      label: 'Category Value',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Internal value used for filtering (should match project_type in Projects collection)',
                      },
                    },
                  ],
                  defaultValue: [
                    { label: 'All', value: 'All' },
                    { label: 'Office', value: 'Office' },
                    { label: 'Hospitality', value: 'Hospitality' },
                    { label: 'F&B', value: 'F&B' },
                    { label: 'Villa', value: 'Villa' },
                  ],
                },
              ],
            },
          ],
        },
        // Tab 3: Virtual Showroom Section
        {
          label: 'Virtual Showroom Section',
          fields: [
            {
              name: 'virtualShowroomSection',
              label: 'Virtual Showroom Section',
              type: 'group',
              admin: {
                description: '360° virtual tour showrooms section',
              },
              fields: [
                {
                  name: 'enabled',
                  label: 'Enable Section',
                  type: 'checkbox',
                  defaultValue: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

