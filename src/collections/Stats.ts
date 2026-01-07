import type { CollectionConfig } from 'payload'

export const Stats: CollectionConfig = {
  slug: 'stats',
  admin: {
    useAsTitle: 'label',
    description: 'Manage statistics displayed on the home page',
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'label',
      label: 'Label',
      type: 'text',
      required: true,
      admin: {
        description: 'Stat label (e.g., "Projects Completed", "Happy Clients")',
      },
    },
    {
      name: 'number',
      label: 'Number',
      type: 'text',
      required: true,
      admin: {
        description: 'The statistic number (e.g., "500+", "98%", "15")',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      admin: {
        description: 'Optional description or context for this stat',
      },
    },
    {
      name: 'icon',
      label: 'Icon',
      type: 'select',
      options: [
        { label: 'Award', value: 'Award' },
        { label: 'Building2', value: 'Building2' },
        { label: 'Users', value: 'Users' },
        { label: 'TrendingUp', value: 'TrendingUp' },
        { label: 'Star', value: 'Star' },
        { label: 'CheckCircle', value: 'CheckCircle' },
        { label: 'Leaf', value: 'Leaf' },
        { label: 'Heart', value: 'Heart' },
      ],
      admin: {
        description: 'Optional icon to display with this stat',
      },
    },
    {
      name: 'displayOrder',
      label: 'Display Order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first',
      },
    },
  ],
}

