import { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  admin: {
    group: 'Pages',
  },
  fields: [
    {
      type: 'group',
      name: 'heroSection',
      label: 'Hero Section',
      fields: [
        {
          type: 'text',
          name: 'headline',
          label: 'Headline',
          defaultValue: 'About District Interiors',
          required: true,
        },
        {
          type: 'textarea',
          name: 'description',
          label: 'Description',
          defaultValue:
            'A design-driven approach to greenery, merging natural aesthetics with architectural precision.',
        },
        {
          type: 'upload',
          name: 'backgroundImage',
          relationTo: 'media',
          label: 'Background Image',
        },
      ],
    },
    {
      type: 'group',
      name: 'storySection',
      label: 'Story Section',
      fields: [
        {
          type: 'checkbox',
          name: 'enabled',
          label: 'Enable Section',
          defaultValue: true,
        },
        {
          type: 'text',
          name: 'eyebrow',
          label: 'Eyebrow Text',
          defaultValue: 'Our Story',
        },
        {
          type: 'text',
          name: 'headline',
          label: 'Headline',
          defaultValue: 'Designed to Breathe Life Into Spaces',
        },
        {
          type: 'textarea',
          name: 'paragraph1',
          label: 'First Paragraph',
          defaultValue:
            'District Interiors was founded with a singular vision: to transform indoor and outdoor environments through expert plantscaping, luxury softscaping, and custom tree fabrication.',
        },
        {
          type: 'textarea',
          name: 'paragraph2',
          label: 'Second Paragraph',
          defaultValue:
            'We partner with architects, interior designers, and fit-out specialists across the region to deliver greenery solutions that enhance both aesthetic appeal and human wellbeing. Our mission is simple: to merge natural aesthetics with architectural precision to deliver beauty, sustainability, and comfort.',
        },
        {
          type: 'textarea',
          name: 'paragraph3',
          label: 'Third Paragraph',
          defaultValue:
            'From concept to installation to ongoing care, we bring decades of combined expertise to every project, ensuring each space we touch is transformed into something extraordinary.',
        },
        {
          type: 'upload',
          name: 'image',
          relationTo: 'media',
          label: 'Story Image',
        },
      ],
    },
    {
      type: 'group',
      name: 'valuesSection',
      label: 'Values Section',
      fields: [
        {
          type: 'checkbox',
          name: 'enabled',
          label: 'Enable Section',
          defaultValue: true,
        },
        {
          type: 'text',
          name: 'headline',
          label: 'Headline',
          defaultValue: 'Our Values',
        },
        {
          type: 'textarea',
          name: 'description',
          label: 'Description',
          defaultValue: 'The principles that guide every project we undertake.',
        },
        {
          type: 'array',
          name: 'values',
          label: 'Values',
          minRows: 1,
          fields: [
            {
              type: 'text',
              name: 'title',
              label: 'Title',
              required: true,
            },
            {
              type: 'textarea',
              name: 'description',
              label: 'Description',
              required: true,
            },
          ],
          defaultValue: [
            {
              title: 'Craftsmanship',
              description:
                'Every installation reflects meticulous attention to detail and premium quality materials.',
            },
            {
              title: 'Innovation',
              description:
                'We continuously explore new techniques and materials to push the boundaries of what\'s possible.',
            },
            {
              title: 'Sustainability',
              description:
                'Our solutions are designed for longevity, reducing waste and environmental impact.',
            },
            {
              title: 'Partnership',
              description:
                'We work as an extension of your design team, bringing your vision to life with expertise.',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'teamSection',
      label: 'Team Section',
      fields: [
        {
          type: 'checkbox',
          name: 'enabled',
          label: 'Enable Section',
          defaultValue: true,
        },
        {
          type: 'text',
          name: 'eyebrow',
          label: 'Eyebrow Text',
          defaultValue: 'Our Team',
        },
        {
          type: 'text',
          name: 'headline',
          label: 'Headline',
          defaultValue: 'Experts in Green Design',
        },
        {
          type: 'textarea',
          name: 'paragraph1',
          label: 'First Paragraph',
          defaultValue:
            'Our team brings together horticultural specialists, designers, craftsmen, and project managers who share a passion for bringing nature into built environments.',
        },
        {
          type: 'textarea',
          name: 'paragraph2',
          label: 'Second Paragraph',
          defaultValue:
            'With expertise spanning artificial and natural plantscaping, custom fabrication, and long-term maintenance, we ensure every project receives the attention it deserves.',
        },
        {
          type: 'upload',
          name: 'image',
          relationTo: 'media',
          label: 'Team Image',
        },
        {
          type: 'text',
          name: 'ctaText',
          label: 'CTA Button Text',
          defaultValue: 'Work With Us',
        },
        {
          type: 'text',
          name: 'ctaLink',
          label: 'CTA Button Link',
          defaultValue: '/contact',
        },
      ],
    },
  ],
}




