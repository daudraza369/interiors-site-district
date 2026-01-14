import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    description: 'Manage service offerings displayed on the services page',
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Service Title',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the service (e.g., "Office & F&B Plantscaping")',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief description of the service',
      },
    },
    {
      name: 'image',
      label: 'Service Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Image displayed on the service card',
      },
    },
    {
      name: 'link',
      label: 'Link',
      type: 'text',
      required: true,
      defaultValue: '/services',
      admin: {
        description: 'URL path to the service detail page (e.g., "/services/plantscaping")',
      },
    },
    {
      name: 'displayOrder',
      label: 'Display Order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order in which services appear (lower numbers first)',
      },
    },
    {
      name: 'isPublished',
      label: 'Published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Only published services are displayed on the frontend',
      },
    },
  ],
}





