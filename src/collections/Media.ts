import type { CollectionConfig } from 'payload'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'mimeType', 'filesize', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      required: true,
      admin: {
        description: 'Alternative text for accessibility and SEO',
      },
    },
    {
      name: 'caption',
      label: 'Caption',
      type: 'text',
      admin: {
        description: 'Optional caption for the image',
      },
    },
  ],
  upload: {
    staticDir: path.resolve(process.cwd(), 'media'),
    staticURL: '/media',
  },
}
