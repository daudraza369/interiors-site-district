import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    description: 'Manage projects displayed in the projects gallery',
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Project Title',
      type: 'text',
      required: true,
      admin: {
        description: 'Main title of the project',
      },
    },
    {
      name: 'projectType',
      label: 'Project Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Office', value: 'Office' },
        { label: 'Hospitality', value: 'Hospitality' },
        { label: 'F&B', value: 'F&B' },
        { label: 'Villa', value: 'Villa' },
      ],
      admin: {
        description: 'Category for filtering projects',
      },
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      admin: {
        description: 'Project location (e.g., "Riyadh, KSA")',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      admin: {
        description: 'Project description shown on hover',
      },
    },
    {
      name: 'heroImage',
      label: 'Hero Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main image displayed in the project card',
      },
    },
    {
      name: 'videoUrl',
      label: 'Video URL',
      type: 'text',
      admin: {
        description: 'Optional video URL (if provided, video will play on hover and can be opened in modal)',
      },
    },
    {
      name: 'galleryImages',
      label: 'Gallery Images',
      type: 'array',
      admin: {
        description: 'Additional images for project gallery (optional)',
      },
      fields: [
        {
          name: 'image',
          label: 'Image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'displayOrder',
      label: 'Display Order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order in which projects appear (lower numbers first)',
      },
    },
    {
      name: 'isPublished',
      label: 'Published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Only published projects are displayed on the frontend',
      },
    },
  ],
}




