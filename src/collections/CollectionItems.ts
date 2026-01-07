import { CollectionConfig } from 'payload'

export const CollectionItems: CollectionConfig = {
  slug: 'collection-items',
  labels: {
    singular: 'Collection Item',
    plural: 'Collection Items',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'displayOrder', 'isPublished'],
    description: 'Manage products and items displayed on the Collection page',
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'text',
      name: 'name',
      label: 'Name',
      required: true,
      admin: {
        description: 'Product/item name (e.g., "Premium Olive Tree")',
      },
    },
    {
      type: 'select',
      name: 'category',
      label: 'Category',
      required: true,
      options: [
        { label: 'Trees', value: 'Trees' },
        { label: 'Flowers', value: 'Flowers' },
        { label: 'Leaves/Foliage', value: 'Leaves/Foliage' },
        { label: 'Green Walls', value: 'Green Walls' },
        { label: 'Trunks & Branches', value: 'Trunks & Branches' },
        { label: 'Planters', value: 'Planters' },
      ],
      defaultValue: 'Trees',
      admin: {
        description: 'Category for filtering on the Collection page',
      },
    },
    {
      type: 'upload',
      name: 'image',
      relationTo: 'media',
      label: 'Image',
      required: true,
      admin: {
        description: 'Main product image displayed in the collection grid',
      },
    },
    {
      type: 'text',
      name: 'price',
      label: 'Price',
      required: true,
      defaultValue: 'Price on Request',
      admin: {
        description: 'e.g., "Price on Request", "From SAR 850", "SAR 1,200"',
      },
    },
    {
      type: 'number',
      name: 'displayOrder',
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first in the collection grid',
      },
    },
    {
      type: 'checkbox',
      name: 'isPublished',
      label: 'Published',
      defaultValue: true,
      admin: {
        description: 'Only published items are displayed on the frontend',
      },
    },
  ],
}

