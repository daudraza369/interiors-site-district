import type { GlobalConfig } from 'payload'

export const ServicesPage: GlobalConfig = {
  slug: 'services-page',
  label: 'Services Page',
  admin: {
    description: 'Manage all sections of the services page',
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
                description: 'Hero section at the top of the services page',
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
                  defaultValue: 'Our Services',
                  admin: {
                    description: 'Main headline text',
                  },
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                  defaultValue: 'Comprehensive greenery solutions for every space, from bespoke installations to ongoing maintenance.',
                  admin: {
                    description: 'Supporting description text below headline',
                  },
                },
                {
                  name: 'backgroundImage',
                  label: 'Background Image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Background image for the hero section',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Services Section',
          fields: [
            {
              name: 'servicesSection',
              label: 'Services Section',
              type: 'group',
              admin: {
                description: 'Services grid section',
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
                  label: 'Headline (Optional)',
                  type: 'text',
                  admin: {
                    description: 'Optional headline for the services section',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'CTA Section',
          fields: [
            {
              name: 'ctaSection',
              label: 'CTA Section',
              type: 'group',
              admin: {
                description: 'Call-to-action section at the bottom',
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
                  defaultValue: 'Ready to Transform Your Space?',
                  admin: {
                    description: 'Main headline text',
                  },
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                  defaultValue: "Let's discuss how our services can bring your vision to life.",
                  admin: {
                    description: 'Supporting description text',
                  },
                },
                {
                  name: 'ctaText',
                  label: 'CTA Button Text',
                  type: 'text',
                  defaultValue: 'Request a Consultation',
                },
                {
                  name: 'ctaLink',
                  label: 'CTA Button Link',
                  type: 'text',
                  defaultValue: '/contact',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}




