import type { GlobalConfig } from 'payload'

export const FlowersPage: GlobalConfig = {
  slug: 'flowers-page',
  label: 'Flowers Page',
  admin: {
    description: 'Manage all sections of the flowers page',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Section',
          fields: [
            {
              name: 'heroSection',
              label: 'Hero Section',
              type: 'group',
              admin: {
                description: 'Hero section at the top of the flowers page',
              },
              fields: [
                {
                  name: 'enabled',
                  label: 'Enable Section',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'headline',
                  label: 'Headline',
                  type: 'text',
                  required: true,
                  defaultValue: 'Premium Wholesale Flowers,\nFresh from Source',
                  admin: {
                    description: 'Main headline (use \\n for line breaks)',
                  },
                },
                {
                  name: 'subheadline',
                  label: 'Subheadline',
                  type: 'textarea',
                  defaultValue:
                    'Direct imports from Holland & Kenya • Weekly shipments • Trusted supplier to Fairmont Hotels',
                  admin: {
                    description: 'Supporting description text',
                  },
                },
                {
                  name: 'badges',
                  label: 'Badges',
                  type: 'array',
                  fields: [
                    {
                      name: 'icon',
                      label: 'Icon Name',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Icon name from lucide-react (e.g., Plane, CalendarClock, Building2)',
                      },
                    },
                    {
                      name: 'text',
                      label: 'Badge Text',
                      type: 'text',
                      required: true,
                    },
                  ],
                  defaultValue: [
                    { icon: 'Plane', text: 'Holland & Kenya Direct Imports' },
                    { icon: 'CalendarClock', text: 'Fresh Weekly Arrivals' },
                    { icon: 'Building2', text: 'Fairmont Hotel Partner' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Catalog Section',
          fields: [
            {
              name: 'catalogSection',
              label: 'Catalog Download Section',
              type: 'group',
              admin: {
                description: 'Catalog download section with preview and download button',
              },
              fields: [
                {
                  name: 'enabled',
                  label: 'Enable Section',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'eyebrow',
                  label: 'Eyebrow Text',
                  type: 'text',
                  defaultValue: 'Download Now',
                },
                {
                  name: 'headline',
                  label: 'Headline',
                  type: 'text',
                  required: true,
                  defaultValue: "This Week's Wholesale Pricelist",
                },
                {
                  name: 'previewImage',
                  label: 'Catalog Preview Image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Preview image for the catalog',
                  },
                },
                {
                  name: 'catalogUrl',
                  label: 'Catalog PDF URL',
                  type: 'text',
                  required: true,
                  defaultValue:
                    'https://download1588.mediafire.com/qvunnvifx7ig90xjG3uF2EGBhSEvkIToAlTZkZTYwMAMpjcW9fIlb72B9BqVsQ2ovqC_EPkGuy6Wmkvgd--M-EzrkTr0AEN335sgo2_05pTiuGo_Bzv_K5f1RWDesQlsj5YWF6ARu9ShXTa5lQc67hHQk_tLqnMrPotvFL9ElP6f/488cgm2x4it6hit/DF — Dec 31 2025 — Wholesale Catalog.pdf',
                  admin: {
                    description: 'Direct download URL for the catalog PDF',
                  },
                },
                {
                  name: 'buttonText',
                  label: 'Download Button Text',
                  type: 'text',
                  defaultValue: 'Download the Full Catalogue for Latest Arrivals',
                },
              ],
            },
          ],
        },
        {
          label: 'Benefits Section',
          fields: [
            {
              name: 'benefitsSection',
              label: 'Why Choose District Flowers',
              type: 'group',
              admin: {
                description: 'Benefits section with 3 feature cards',
              },
              fields: [
                {
                  name: 'enabled',
                  label: 'Enable Section',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'eyebrow',
                  label: 'Eyebrow Text',
                  type: 'text',
                  defaultValue: 'The District Difference',
                },
                {
                  name: 'headline',
                  label: 'Headline',
                  type: 'text',
                  required: true,
                  defaultValue: 'Why Choose District Flowers',
                },
                {
                  name: 'benefits',
                  label: 'Benefits',
                  type: 'array',
                  minRows: 3,
                  maxRows: 3,
                  fields: [
                    {
                      name: 'icon',
                      label: 'Icon Name',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Icon name from lucide-react (e.g., Truck, Award, Flower2)',
                      },
                    },
                    {
                      name: 'title',
                      label: 'Title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'description',
                      label: 'Description',
                      type: 'textarea',
                      required: true,
                    },
                  ],
                  defaultValue: [
                    {
                      icon: 'Truck',
                      title: 'Reliable Supply',
                      description:
                        'Weekly shipments plus emergency backup stock ensure you never run short.',
                    },
                    {
                      icon: 'Award',
                      title: 'Premium Quality',
                      description:
                        'Hotel-grade flowers at wholesale prices, sourced from specialty farms.',
                    },
                    {
                      icon: 'Flower2',
                      title: 'Wide Selection',
                      description:
                        "Extensive variety from Holland and Kenya's finest specialty farms.",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}



