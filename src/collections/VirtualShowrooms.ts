import type { CollectionConfig } from 'payload'

export const VirtualShowrooms: CollectionConfig = {
  slug: 'virtual-showrooms',
  admin: {
    useAsTitle: 'title',
    description: 'Manage virtual tour showrooms for 360° experiences',
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Showroom Title',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the showroom/project',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the showroom',
      },
    },
    {
      name: 'tourUrl',
      label: 'Virtual Tour URL',
      type: 'text',
      required: true,
      admin: {
        description: 'Full URL to the virtual tour (e.g., iStaging LiveTour URL)',
      },
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      admin: {
        description: 'Location of the showroom (e.g., "Riyadh", "Jeddah")',
      },
    },
    {
      name: 'thumbnail',
      label: 'Thumbnail Image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Preview image for the virtual tour card (optional)',
      },
    },
    {
      name: 'displayOrder',
      label: 'Display Order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order in which showrooms appear (lower numbers first)',
      },
    },
    {
      name: 'isPublished',
      label: 'Published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Only published showrooms are displayed on the frontend',
      },
    },
  ],
}

