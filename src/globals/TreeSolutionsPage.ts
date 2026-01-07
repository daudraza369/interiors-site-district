import { GlobalConfig } from 'payload'

export const TreeSolutionsPage: GlobalConfig = {
  slug: 'tree-solutions-page',
  label: 'Tree Solutions Page',
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
          defaultValue: 'Trees that Transform Spaces',
          required: true,
        },
        {
          type: 'textarea',
          name: 'description',
          label: 'Description',
          defaultValue: 'From custom creation to restoration, we design, craft, and install trees that bring enduring beauty to homes and businesses alike.',
        },
        {
          type: 'textarea',
          name: 'subDescription',
          label: 'Sub Description',
          defaultValue: 'Every project starts with a conversation. Our consultation experience makes tree selection effortless, guiding you from defining your vision to fine-tuning size, species, and finishes.',
        },
        {
          type: 'upload',
          name: 'backgroundImage',
          relationTo: 'media',
          label: 'Background Image',
        },
        {
          type: 'text',
          name: 'ctaText',
          label: 'CTA Button Text',
          defaultValue: 'Book Your Consultation',
        },
      ],
    },
    {
      type: 'group',
      name: 'processSection',
      label: 'Process Section',
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
          defaultValue: 'Our Process',
        },
        {
          type: 'text',
          name: 'headline',
          label: 'Headline',
          defaultValue: 'How We Bring Tree Projects to Life',
        },
        {
          type: 'array',
          name: 'steps',
          label: 'Process Steps',
          minRows: 1,
          fields: [
            {
              type: 'number',
              name: 'step',
              label: 'Step Number',
              required: true,
            },
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
              step: 1,
              title: 'Understanding Your Space',
              description: 'Share photos, dimensions, and layout details so our team can design trees that fit perfectly within your environment.',
            },
            {
              step: 2,
              title: 'Choosing Tree Type',
              description: 'Select from our premium olive, ficus, and palm models, or request a fully custom species.',
            },
            {
              step: 3,
              title: 'Defining Size & Scale',
              description: 'We assess ceiling heights and proportions to propose tree heights that look visually balanced.',
            },
            {
              step: 4,
              title: 'Customization & Detailing',
              description: 'Pick trunk type, leaf density, and color tone, blending authenticity with your design palette.',
            },
            {
              step: 5,
              title: 'Scheduling & Installation',
              description: 'Once approved, our technicians complete installation within 3 to 5 working days.',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'materialsSection',
      label: 'Materials Section',
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
          defaultValue: 'Built for Beauty and Longevity',
        },
        {
          type: 'textarea',
          name: 'description',
          label: 'Description',
          defaultValue: 'We engineer every tree to thrive where it\'s planted, indoors or out.',
        },
        {
          type: 'textarea',
          name: 'subDescription',
          label: 'Sub Description',
          defaultValue: 'From UV-resistant foliage to fire-rated olive leaves, each material is chosen for safety, durability, and realism. Whether exposed to sunlight, humidity, or heavy foot traffic, our trees are crafted to endure.',
        },
        {
          type: 'upload',
          name: 'image',
          relationTo: 'media',
          label: 'Image',
        },
        {
          type: 'array',
          name: 'features',
          label: 'Features',
          minRows: 1,
          fields: [
            {
              type: 'text',
              name: 'icon',
              label: 'Icon Name',
              admin: {
                description: 'Icon name from lucide-react (e.g., Sun, Shield, Eye, TreeDeciduous)',
              },
            },
            {
              type: 'text',
              name: 'label',
              label: 'Label',
              required: true,
            },
          ],
          defaultValue: [
            { icon: 'Sun', label: 'UV-Resistant Foliage' },
            { icon: 'Shield', label: 'Fire-Rated Materials' },
            { icon: 'Eye', label: 'High-Realism Details' },
            { icon: 'TreeDeciduous', label: 'Indoor & Outdoor Ready' },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'maintenanceSection',
      label: 'Maintenance Section',
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
          defaultValue: 'We Don\'t Just Install. We Preserve.',
        },
        {
          type: 'textarea',
          name: 'description',
          label: 'Description',
          defaultValue: 'Because every great tree deserves lasting care.',
        },
        {
          type: 'textarea',
          name: 'subDescription',
          label: 'Sub Description',
          defaultValue: 'Our maintenance programs include scheduled cleaning, leaf replacement, and branch realignment to ensure your trees stay flawless over time. We also offer upgrade options for clients expanding their greenery portfolio.',
        },
        {
          type: 'upload',
          name: 'image',
          relationTo: 'media',
          label: 'Image',
        },
        {
          type: 'text',
          name: 'ctaText',
          label: 'CTA Button Text',
          defaultValue: 'Ask About Maintenance',
        },
      ],
    },
    {
      type: 'group',
      name: 'consultationSection',
      label: 'Consultation Form Section',
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
          defaultValue: 'Ready to Begin Your Tree Project?',
        },
        {
          type: 'textarea',
          name: 'description',
          label: 'Description',
          defaultValue: 'Let\'s design something extraordinary together.',
        },
        {
          type: 'textarea',
          name: 'subDescription',
          label: 'Sub Description',
          defaultValue: 'Whether you\'re outfitting a villa courtyard, a restaurant lobby, or a corporate space, our team is ready to guide you.',
        },
        {
          type: 'text',
          name: 'ctaText',
          label: 'CTA Button Text',
          defaultValue: 'Book a Free Consultation',
        },
        {
          type: 'array',
          name: 'projectTypeOptions',
          label: 'Project Type Options',
          minRows: 1,
          fields: [
            {
              type: 'text',
              name: 'value',
              label: 'Value',
              required: true,
            },
            {
              type: 'text',
              name: 'label',
              label: 'Label',
              required: true,
            },
          ],
          defaultValue: [
            { value: 'villa', label: 'Villa' },
            { value: 'office', label: 'Office' },
            { value: 'hotel', label: 'Hotel' },
            { value: 'restaurant', label: 'Restaurant' },
            { value: 'mall', label: 'Mall' },
            { value: 'public', label: 'Public Space' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          type: 'array',
          name: 'treeTypeOptions',
          label: 'Preferred Tree Type Options',
          minRows: 1,
          fields: [
            {
              type: 'text',
              name: 'value',
              label: 'Value',
              required: true,
            },
            {
              type: 'text',
              name: 'label',
              label: 'Label',
              required: true,
            },
          ],
          defaultValue: [
            { value: 'olive', label: 'Olive' },
            { value: 'ficus', label: 'Ficus' },
            { value: 'palm', label: 'Palm' },
            { value: 'custom', label: 'Custom' },
            { value: 'not-sure', label: 'Not sure yet' },
          ],
        },
        {
          type: 'array',
          name: 'timelineOptions',
          label: 'Timeline Options',
          minRows: 1,
          fields: [
            {
              type: 'text',
              name: 'value',
              label: 'Value',
              required: true,
            },
            {
              type: 'text',
              name: 'label',
              label: 'Label',
              required: true,
            },
          ],
          defaultValue: [
            { value: 'immediate', label: 'Immediately' },
            { value: '1-3', label: '1–3 months' },
            { value: '3-6', label: '3–6 months' },
            { value: 'flexible', label: 'Flexible' },
          ],
        },
      ],
    },
  ],
}

