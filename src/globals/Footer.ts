import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    description: 'Manage site footer content, contact information, and links',
    group: 'Site Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      label: 'Footer Logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      defaultValue: 'Transforming spaces through expert plantscaping, luxury softscaping, and custom tree fabrication.',
    },
    {
      name: 'contactInfo',
      label: 'Contact Information',
      type: 'group',
      fields: [
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          defaultValue: 'Sales@district.sa',
        },
        {
          name: 'phone',
          label: 'Phone',
          type: 'text',
          required: true,
          defaultValue: '+966 056 228 8177',
        },
        {
          name: 'whatsapp',
          label: 'WhatsApp',
          type: 'text',
          required: true,
          defaultValue: '+966 50 060 6506',
        },
        {
          name: 'address',
          label: 'Address',
          type: 'text',
          required: true,
          defaultValue: 'Al Zoubair Ibn Al Awwam, Ar Rawabi, Riyadh 14214',
        },
        {
          name: 'googleMapsLink',
          label: 'Google Maps Link',
          type: 'text',
          required: true,
          defaultValue: 'https://share.google/OwSIbmaVwv0vXcatO',
        },
      ],
    },
    {
      name: 'socialLinks',
      label: 'Social Media Links',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'label',
          label: 'Platform Name',
          type: 'text',
          required: true,
        },
        {
          name: 'abbr',
          label: 'Abbreviation (for icon)',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., IG, TT, SC',
          },
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
        },
      ],
      defaultValue: [
        {
          label: 'Instagram',
          abbr: 'IG',
          url: 'https://www.instagram.com/districtflora',
        },
        {
          label: 'TikTok',
          abbr: 'TT',
          url: 'https://www.tiktok.com/@districtflora',
        },
        {
          label: 'Snapchat',
          abbr: 'SC',
          url: '#',
        },
      ],
    },
    {
      name: 'quickLinks',
      label: 'Quick Links',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Link Label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          label: 'Link URL',
          type: 'text',
          required: true,
        },
      ],
      defaultValue: [
        { label: 'Services', href: '/services' },
        { label: 'Collection', href: '/collection' },
        { label: 'Projects', href: '/projects' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      name: 'serviceLinks',
      label: 'Service Links',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Service Name',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          label: 'Service URL',
          type: 'text',
          required: true,
        },
      ],
      defaultValue: [
        { label: 'Plantscaping', href: '/services/plantscaping' },
        { label: 'Tree Customization', href: '/services/tree-customization' },
        { label: 'Tree Restoration', href: '/services/tree-restoration' },
        { label: 'Green Walls', href: '/services/green-walls' },
        { label: 'Custom Planter Design', href: '/services/planters' },
        { label: 'Maintenance', href: '/services/maintenance' },
      ],
    },
    {
      name: 'legalLinks',
      label: 'Legal Links',
      type: 'group',
      fields: [
        {
          name: 'privacyPolicy',
          label: 'Privacy Policy URL',
          type: 'text',
          defaultValue: '/privacy',
        },
        {
          name: 'termsOfService',
          label: 'Terms of Service URL',
          type: 'text',
          defaultValue: '/terms',
        },
      ],
    },
    {
      name: 'copyright',
      label: 'Copyright Text',
      type: 'text',
      required: true,
      defaultValue: '© {year} District Interiors. All rights reserved.',
      admin: {
        description: 'Use {year} as placeholder for current year',
      },
    },
  ],
}

