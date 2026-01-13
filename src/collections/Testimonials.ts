import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'role', 'company', 'displayOrder', 'isPublished'],
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'quote',
      label: 'Quote',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The testimonial quote text',
      },
    },
    {
      name: 'clientName',
      label: 'Client Name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the person giving the testimonial',
      },
    },
    {
      name: 'role',
      label: 'Role / Title',
      type: 'text',
      admin: {
        description: 'Job title or role of the client',
      },
    },
    {
      name: 'company',
      label: 'Company',
      type: 'text',
      admin: {
        description: 'Company name (optional)',
      },
    },
    {
      name: 'authorImage',
      label: 'Author Image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional image of the testimonial author',
      },
    },
    {
      name: 'displayOrder',
      label: 'Display Order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order in which testimonials appear (lower numbers first)',
      },
    },
    {
      name: 'isPublished',
      label: 'Published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Only published testimonials will appear on the frontend',
      },
    },
  ],
  timestamps: true,
}




