import type { CollectionConfig } from 'payload'

export const ClientLogos: CollectionConfig = {
  slug: 'client-logos',
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'displayOrder', 'websiteUrl'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'clientName',
      label: 'Client Name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      label: 'Logo Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'websiteUrl',
      label: 'Website URL',
      type: 'text',
      admin: {
        description: 'Optional - link to client website',
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




