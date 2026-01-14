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
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
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
    // Temporarily disabled - will be re-enabled after database migration
    // To enable: Uncomment this field and restart server to auto-migrate database
    // {
    //   name: 'video',
    //   label: 'Video File',
    //   type: 'upload',
    //   relationTo: 'media',
    //   admin: {
    //     description: 'Upload a video file (MP4, WebM, MOV, etc.) - OR use Video URL below for external links (YouTube, Vimeo, Google Drive, etc.)',
    //   },
    // },
    {
      name: 'videoUrl',
      label: 'Video URL (External)',
      type: 'text',
      admin: {
        description: 'External video URL (YouTube, Vimeo, Google Drive, direct video link, etc.) - OR upload Video File above',
        placeholder: 'https://youtube.com/watch?v=... or https://drive.google.com/file/d/FILE_ID/view',
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




