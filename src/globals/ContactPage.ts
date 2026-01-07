import type { GlobalConfig } from 'payload'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact Page',
  admin: {
    description: 'Manage all sections of the contact page',
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
                description: 'Hero section at the top of the contact page',
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
                  defaultValue: 'Contact Us',
                  admin: {
                    description: 'Main headline text',
                  },
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                  defaultValue: "Let's bring nature into your space. Connect with our design team to start your project.",
                  admin: {
                    description: 'Supporting description text below headline',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Contact Section',
          fields: [
            {
              name: 'contactSection',
              label: 'Contact Section',
              type: 'group',
              admin: {
                description: 'Contact form and contact information',
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
                  defaultValue: 'Get in Touch',
                  admin: {
                    description: 'Headline for the contact info section',
                  },
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                  defaultValue: "Whether you're planning a complete transformation or exploring options for your space, we're here to help. Reach out and let's discuss how we can bring your vision to life.",
                  admin: {
                    description: 'Description text for the contact info section',
                  },
                },
                {
                  name: 'contactInfo',
                  label: 'Contact Information',
                  type: 'group',
                  fields: [
                    {
                      name: 'email',
                      label: 'Email',
                      type: 'text',
                      defaultValue: 'Sales@district.sa',
                    },
                    {
                      name: 'phone',
                      label: 'Phone',
                      type: 'text',
                      defaultValue: '+966 056 228 8177',
                    },
                    {
                      name: 'whatsapp',
                      label: 'WhatsApp',
                      type: 'text',
                      defaultValue: '+966 50 060 6506',
                    },
                    {
                      name: 'address',
                      label: 'Address',
                      type: 'text',
                      defaultValue: 'Al Zoubair Ibn Al Awwam, Ar Rawabi, Riyadh 14214',
                    },
                    {
                      name: 'googleMaps',
                      label: 'Google Maps Link',
                      type: 'text',
                      defaultValue: 'https://share.google/OwSIbmaVwv0vXcatO',
                    },
                  ],
                },
                {
                  name: 'socialLinks',
                  label: 'Social Links',
                  type: 'array',
                  admin: {
                    description: 'Social media links to display',
                  },
                  fields: [
                    {
                      name: 'label',
                      label: 'Label',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Display label (e.g., "Instagram")',
                      },
                    },
                    {
                      name: 'href',
                      label: 'URL',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Social media URL',
                      },
                    },
                    {
                      name: 'abbr',
                      label: 'Abbreviation',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Short abbreviation for display (e.g., "IG", "TT", "SC")',
                      },
                    },
                  ],
                  defaultValue: [
                    { label: 'Instagram', href: 'https://www.instagram.com/districtflora', abbr: 'IG' },
                    { label: 'TikTok', href: 'https://www.tiktok.com/@districtflora', abbr: 'TT' },
                    { label: 'Snapchat', href: '#', abbr: 'SC' },
                  ],
                },
                {
                  name: 'projectTypes',
                  label: 'Project Type Options',
                  type: 'array',
                  admin: {
                    description: 'Project type options for the form dropdown',
                  },
                  fields: [
                    {
                      name: 'label',
                      label: 'Label',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'value',
                      label: 'Value',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Internal value (slug)',
                      },
                    },
                  ],
                  defaultValue: [
                    { label: 'Plantscaping', value: 'plantscaping' },
                    { label: 'Tree Customization', value: 'tree-customization' },
                    { label: 'Tree Restoration', value: 'tree-restoration' },
                    { label: 'Green Walls', value: 'green-walls' },
                    { label: 'Custom Planter Design', value: 'planters' },
                    { label: 'Maintenance', value: 'maintenance' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                {
                  name: 'formButtonText',
                  label: 'Form Button Text',
                  type: 'text',
                  defaultValue: 'Send Message',
                  admin: {
                    description: 'Text for the submit button',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

