import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  admin: {
    description: 'Manage site header navigation, logos, and CTA button',
    group: 'Site Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navigation',
      label: 'Navigation Items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          label: 'Link (URL)',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., /, /services, /collection',
          },
        },
        {
          name: 'hasDropdown',
          label: 'Has Dropdown Menu',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'dropdownItems',
          label: 'Dropdown Items',
          type: 'array',
          admin: {
            condition: (_, siblingData) => siblingData.hasDropdown === true,
          },
          fields: [
            {
              name: 'label',
              label: 'Label',
              type: 'text',
              required: true,
            },
            {
              name: 'href',
              label: 'Link (URL)',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
      defaultValue: [
        {
          label: 'DISTRICT',
          href: '/',
          hasDropdown: false,
        },
        {
          label: 'FLOWERS',
          href: '/flowers',
          hasDropdown: false,
        },
        {
          label: 'GREENERY',
          href: '/services',
          hasDropdown: true,
          dropdownItems: [
            { label: 'PLANTSCAPING', href: '/services/plantscaping' },
            { label: 'TREE SOLUTIONS', href: '/tree-solutions' },
            { label: 'PLANT MAINTENANCE', href: '/services/maintenance' },
            { label: 'CUSTOM PLANTERS', href: '/services/planters' },
            { label: 'GREEN WALLS', href: '/services/green-walls' },
          ],
        },
        {
          label: 'DESIGN',
          href: '/design',
          hasDropdown: false,
        },
        {
          label: 'COLLECTION',
          href: '/collection',
          hasDropdown: false,
        },
      ],
    },
    {
      name: 'logos',
      label: 'Logo Variants',
      type: 'group',
      fields: [
        {
          name: 'brandmark',
          label: 'Brandmark (Default)',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'brandmarkNightGreen',
          label: 'Brandmark Night Green (Scrolled Header)',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'brandmarkPear',
          label: 'Brandmark Pear (Transparent Header)',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'logoLockup',
          label: 'Logo Lockup (Default)',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'logoLockupNightGreen',
          label: 'Logo Lockup Night Green',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'ctaButton',
      label: 'CTA Button',
      type: 'group',
      fields: [
        {
          name: 'text',
          label: 'Button Text',
          type: 'text',
          required: true,
          defaultValue: 'VIEW OUR PORTFOLIO',
        },
        {
          name: 'link',
          label: 'Button Link',
          type: 'text',
          required: true,
          defaultValue: '/projects',
        },
      ],
    },
    {
      name: 'heroPages',
      label: 'Hero Pages (Transparent Header)',
      type: 'array',
      admin: {
        description: 'Pages that use transparent header (dark hero sections)',
      },
      fields: [
        {
          name: 'path',
          label: 'Page Path',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., /, /flowers, /projects',
          },
        },
      ],
      defaultValue: [
        { path: '/' },
        { path: '/flowers' },
        { path: '/hospitality' },
        { path: '/projects' },
        { path: '/tree-solutions' },
      ],
    },
  ],
}

