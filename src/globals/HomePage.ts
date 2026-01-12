import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  admin: {
    description: 'Manage all sections of the home page',
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    // Tab 1: Hero Section
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
              fields: [
                {
                  name: 'slides',
                  label: 'Hero Slides',
                  type: 'array',
                  required: false,
                  minRows: 0,
                  admin: {
                    description: 'Add multiple slides for the hero carousel',
                  },
                  fields: [
                    {
                      name: 'image',
                      label: 'Background Image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                      admin: {
                        description: 'Upload hero background image',
                      },
                    },
                    {
                      name: 'title',
                      label: 'Title',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Main headline text',
                      },
                    },
                    {
                      name: 'eyebrow',
                      label: 'Eyebrow Text',
                      type: 'text',
                      admin: {
                        description: 'Small text above title (optional)',
                      },
                    },
                    {
                      name: 'subtitle',
                      label: 'Subtitle',
                      type: 'text',
                      admin: {
                        description: 'Subtitle text (optional)',
                      },
                    },
                    {
                      name: 'description',
                      label: 'Description',
                      type: 'textarea',
                      admin: {
                        description: 'Main description text',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Tab 2: Client Logos Section
        {
          label: 'Client Logos',
          fields: [
            {
              name: 'clientLogosSection',
              label: 'Client Logos Section',
              type: 'group',
              admin: {
                description: 'Manage client logos and section settings',
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
                  label: 'Section Headline',
                  type: 'text',
                  defaultValue: 'Industry Leaders',
                },
                {
                  name: 'maxLogos',
                  label: 'Maximum Logos to Display',
                  type: 'number',
                  defaultValue: 10,
                  admin: {
                    description: 'Limit number of logos shown in the marquee',
                  },
                },
                {
                  name: 'logos',
                  label: 'Client Logos',
                  type: 'array',
                  admin: {
                    description: 'Add client logos to display in the marquee',
                  },
                  fields: [
                    {
                      name: 'clientName',
                      label: 'Client Name',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'logo',
                      label: 'Logo Image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    {
                      name: 'websiteUrl',
                      label: 'Website URL',
                      type: 'text',
                      admin: {
                        description: 'Optional - link to client website',
                      },
                    },
                    {
                      name: 'displayOrder',
                      label: 'Display Order',
                      type: 'number',
                      defaultValue: 0,
                      admin: {
                        description: 'Lower numbers appear first',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Tab 3: Problem Framing Section
        {
          label: 'Problem Framing',
          fields: [
            {
              name: 'problemFramingSection',
              label: 'Problem Framing Section',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  label: 'Enable Section',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'badgeText',
                  label: 'Badge Text',
                  type: 'text',
                  defaultValue: 'The Hidden Cost',
                  admin: {
                    description: 'Text shown in the badge above headline',
                  },
                },
                {
                  name: 'headline',
                  label: 'Headline',
                  type: 'text',
                  defaultValue: 'The Hidden Cost of Sterile Spaces',
                  admin: {
                    description: 'Main headline for the problem framing section',
                  },
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                  defaultValue: 'Bland interiors are not neutral. They are actively suppressing your team\'s performance. Science confirms the difference.',
                  admin: {
                    description: 'Subheadline/description text below headline',
                  },
                },
                {
                  name: 'problems',
                  label: 'Problem Cards',
                  type: 'array',
                  required: true,
                  minRows: 1,
                  admin: {
                    description: 'Add problem cards with stats and research findings',
                  },
                  defaultValue: [
                    {
                      icon: 'Brain',
                      headline: 'Brainpower is Stifled',
                      stat: '61%',
                      label: 'Lower Cognitive Scores',
                      description: 'Harvard researchers found that employees in sterile, conventional offices scored 61% lower on cognitive function tests compared to those in green, enhanced environments.',
                      source: 'Harvard T.H. Chan School of Public Health',
                    },
                    {
                      icon: 'TrendingDown',
                      headline: 'Output is Lost',
                      stat: '15%',
                      label: 'Productivity Gap',
                      description: '"Lean" minimalist offices don\'t help focus—they hurt it. University of Exeter found that simply adding plants to a bare office increases productivity by 15%.',
                      source: 'University of Exeter',
                    },
                    {
                      icon: 'Flame',
                      headline: 'Talent Burns Out',
                      stat: '37%',
                      label: 'Higher Tension Levels',
                      description: 'Without natural release points, employee tension and anxiety levels remain 37% higher, fueling burnout and hidden turnover costs.',
                      source: 'University of Technology Sydney (UTS)',
                    },
                    {
                      icon: 'CalendarX',
                      headline: 'Sick Leave Spikes',
                      stat: '60%',
                      label: 'More Sick Days',
                      description: 'Poor indoor air quality and lack of greenery are linked to higher illness rates. Offices with plants can reduce sick leave absences by up to 60%.',
                      source: 'Green Building Council of Australia',
                    },
                  ],
                  fields: [
                    {
                      name: 'icon',
                      label: 'Icon Name',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Brain', value: 'Brain' },
                        { label: 'Trending Down', value: 'TrendingDown' },
                        { label: 'Flame', value: 'Flame' },
                        { label: 'Calendar X', value: 'CalendarX' },
                        { label: 'Alert Triangle', value: 'AlertTriangle' },
                      ],
                      defaultValue: 'Brain',
                    },
                    {
                      name: 'headline',
                      label: 'Headline',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'stat',
                      label: 'Statistic',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'e.g., "61%", "15%", "37%"',
                      },
                    },
                    {
                      name: 'label',
                      label: 'Label',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'e.g., "Lower Cognitive Scores"',
                      },
                    },
                    {
                      name: 'description',
                      label: 'Description',
                      type: 'textarea',
                      required: true,
                    },
                    {
                      name: 'source',
                      label: 'Source',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Research source citation',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Tab 4: Section Divider
        {
          label: 'Section Divider',
          fields: [
            {
              name: 'sectionDivider',
              label: 'Section Divider',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  label: 'Enable Divider',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'transitionText',
                  label: 'Transition Text',
                  type: 'text',
                  defaultValue: 'But the research goes deeper',
                  admin: {
                    description: 'Text displayed in the divider transition',
                  },
                },
              ],
            },
          ],
        },
        // Tab 5: Expert Quotes Carousel
        {
          label: 'Expert Quotes',
          fields: [
            {
              name: 'expertQuotesCarousel',
              label: 'Expert Quotes Carousel',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  label: 'Enable Section',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'quotes',
                  label: 'Expert Quotes',
                  type: 'array',
                  admin: {
                    description: 'Add expert quotes with author information',
                  },
                  fields: [
                    {
                      name: 'quote',
                      label: 'Quote',
                      type: 'textarea',
                      required: true,
                    },
                    {
                      name: 'author',
                      label: 'Author Name',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'authorTitle',
                      label: 'Author Title',
                      type: 'text',
                      admin: {
                        description: 'e.g., CEO, Director, etc.',
                      },
                    },
                    {
                      name: 'authorImage',
                      label: 'Author Image',
                      type: 'upload',
                      relationTo: 'media',
                      admin: {
                        description: 'Optional author photo',
                      },
                    },
                    {
                      name: 'type',
                      label: 'Quote Type',
                      type: 'select',
                      options: [
                        { label: 'Scientific', value: 'Scientific' },
                        { label: 'Visionary', value: 'Visionary' },
                        { label: 'Modern Business', value: 'Modern Business' },
                      ],
                      admin: {
                        description: 'Category badge for the quote (e.g., Scientific, Visionary)',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Tab 6: Our Approach Section
        {
          label: 'Our Approach',
          fields: [
            {
              name: 'ourApproachSection',
              label: 'Our Approach Section',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  label: 'Enable Section',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'badgeText',
                  label: 'Badge Text',
                  type: 'text',
                  defaultValue: 'The Solution',
                  admin: {
                    description: 'Text shown in the badge above headline (e.g., "The Solution")',
                  },
                },
                {
                  name: 'headline',
                  label: 'Headline',
                  type: 'text',
                  defaultValue: 'This Is Where District Steps In',
                  admin: {
                    description: 'Main headline for the approach section',
                  },
                },
                {
                  name: 'subheadline',
                  label: 'Subheadline',
                  type: 'text',
                  defaultValue: 'We\'ve seen the cost of sterile spaces—and we\'ve spent years perfecting the antidote.',
                  admin: {
                    description: 'Supporting subheadline text',
                  },
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                  defaultValue: 'Our approach transforms these hidden liabilities into competitive advantages. Through strategic biophilic design, we create environments where people don\'t just work—they thrive.',
                  admin: {
                    description: 'Detailed description text below subheadline',
                  },
                },
                {
                  name: 'approachPoints',
                  label: 'Approach Points',
                  type: 'array',
                  admin: {
                    description: 'Add key approach points/methods',
                  },
                  fields: [
                    {
                      name: 'number',
                      label: 'Number',
                      type: 'text',
                      admin: {
                        description: 'Step number (e.g., "01", "02")',
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
                      admin: {
                        description: 'Detailed description of this approach point',
                      },
                    },
                    {
                      name: 'icon',
                      label: 'Icon Name',
                      type: 'select',
                      options: [
                        { label: 'Lightbulb', value: 'Lightbulb' },
                        { label: 'Ruler', value: 'Ruler' },
                        { label: 'Wrench', value: 'Wrench' },
                        { label: 'Sparkles', value: 'Sparkles' },
                      ],
                      admin: {
                        description: 'Icon to display for this step',
                      },
                    },
                    {
                      name: 'accent',
                      label: 'Accent Text',
                      type: 'text',
                      admin: {
                        description: 'Accent text displayed next to icon (e.g., "Understand", "Envision")',
                      },
                    },
                  ],
                },
                {
                  name: 'images',
                  label: 'Images',
                  type: 'array',
                  admin: {
                    description: 'Add supporting images for this section',
                  },
                  fields: [
                    {
                      name: 'image',
                      label: 'Image',
                      type: 'upload',
                      relationTo: 'media',
                    },
                  ],
                },
                {
                  name: 'ctaText',
                  label: 'CTA Button Text',
                  type: 'text',
                  defaultValue: 'Start Your Transformation',
                  admin: {
                    description: 'Text for the call-to-action button',
                  },
                },
                {
                  name: 'ctaLink',
                  label: 'CTA Button Link',
                  type: 'text',
                  defaultValue: '/contact',
                  admin: {
                    description: 'Link for the call-to-action button',
                  },
                },
              ],
            },
          ],
        },
        // Tab 7: Why Choose Us Section
        {
          label: 'Why Choose Us',
          fields: [
            {
              name: 'whyChooseUsSection',
              label: 'Why Choose Us Section',
              type: 'group',
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
                  defaultValue: 'Why Leaders Choose District',
                  admin: {
                    description: 'Main headline for the benefits section',
                  },
                },
                {
                  name: 'benefits',
                  label: 'Benefits',
                  type: 'array',
                  admin: {
                    description: 'Add key benefits or advantages',
                  },
                  defaultValue: [
                    {
                      title: 'Dual Expertise',
                      description: 'Mastery in both living plants and premium artificial greenery for any environment.',
                      icon: 'Leaf',
                    },
                    {
                      title: 'Bespoke Design',
                      description: 'Every installation is custom-crafted to reflect your brand and spatial requirements.',
                      icon: 'Palette',
                    },
                    {
                      title: 'Sustainable Focus',
                      description: 'Eco-conscious materials and practices that minimize environmental impact.',
                      icon: 'Recycle',
                    },
                    {
                      title: 'Premium Quality',
                      description: 'Only the finest specimens and materials, backed by quality guarantees.',
                      icon: 'Award',
                    },
                    {
                      title: 'End-to-End Service',
                      description: 'From concept to installation to ongoing care, we handle everything.',
                      icon: 'Building2',
                    },
                  ],
                  fields: [
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
                      admin: {
                        description: 'Detailed description of this benefit',
                      },
                    },
                    {
                      name: 'icon',
                      label: 'Icon',
                      type: 'select',
                      required: true,
                      defaultValue: 'Leaf',
                      options: [
                        { label: 'Leaf', value: 'Leaf' },
                        { label: 'Palette', value: 'Palette' },
                        { label: 'Recycle', value: 'Recycle' },
                        { label: 'Award', value: 'Award' },
                        { label: 'Building2', value: 'Building2' },
                      ],
                      admin: {
                        description: 'Select an icon for this benefit',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Tab 8: Stats Section
        {
          label: 'Stats',
          fields: [
            {
              name: 'statsSection',
              label: 'Stats Section',
              type: 'group',
              admin: {
                description: 'Manage statistics displayed on the home page',
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
                  label: 'Section Headline',
                  type: 'text',
                  defaultValue: '',
                  admin: {
                    description: 'Optional headline for the stats section',
                  },
                },
                {
                  name: 'stats',
                  label: 'Stats',
                  type: 'array',
                  admin: {
                    description: 'Add statistics to display',
                  },
                  defaultValue: [
                    {
                      label: 'Projects Completed',
                      number: '500+',
                      displayOrder: 0,
                    },
                    {
                      label: 'Years Experience',
                      number: '12+',
                      displayOrder: 1,
                    },
                    {
                      label: 'Client Satisfaction',
                      number: '98%',
                      displayOrder: 2,
                    },
                    {
                      label: 'Corporate Clients',
                      number: '150+',
                      displayOrder: 3,
                    },
                  ],
                  fields: [
                    {
                      name: 'label',
                      label: 'Label',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Stat label (e.g., "Projects Completed")',
                      },
                    },
                    {
                      name: 'number',
                      label: 'Number',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'The statistic number (e.g., "500+", "98%", "12+")',
                      },
                    },
                    {
                      name: 'displayOrder',
                      label: 'Display Order',
                      type: 'number',
                      defaultValue: 0,
                      admin: {
                        description: 'Lower numbers appear first',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Tab 9: Portfolio Section
        {
          label: 'Portfolio',
          fields: [
            {
              name: 'portfolioSection',
              label: 'Portfolio Section',
              type: 'group',
              admin: {
                description: 'Manage portfolio projects displayed on the home page',
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
                  label: 'Section Headline',
                  type: 'text',
                  defaultValue: 'Transformations',
                  admin: {
                    description: 'Main headline (first line) - "In Action" is hardcoded as second line',
                  },
                },
                {
                  name: 'subheadline',
                  label: 'Subheadline',
                  type: 'text',
                  defaultValue: "A showcase of spaces we've brought to life across the region.",
                  admin: {
                    description: 'Supporting subheadline text',
                  },
                },
                {
                  name: 'projects',
                  label: 'Portfolio Projects',
                  type: 'array',
                  required: false,
                  minRows: 0,
                  admin: {
                    description: 'Add portfolio projects to display on the home page. Each project needs a title, type, description, and hero image.',
                  },
                  fields: [
                    {
                      name: 'title',
                      label: 'Project Title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'projectType',
                      label: 'Project Type / Category',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Offices', value: 'Offices' },
                        { label: 'F&B', value: 'F&B' },
                        { label: 'Private Villa', value: 'Private Villa' },
                        { label: 'Hospitality', value: 'Hospitality' },
                        { label: 'Retail', value: 'Retail' },
                        { label: 'Other', value: 'Other' },
                      ],
                      defaultValue: 'Offices',
                    },
                    {
                      name: 'description',
                      label: 'Description',
                      type: 'textarea',
                      required: true,
                    },
                    {
                      name: 'heroImage',
                      label: 'Hero Image',
                      type: 'upload',
                      relationTo: 'media',
                      required: false, // Made optional so defaults can be created without images
                      admin: {
                        description: 'Upload a hero image for this portfolio project. You can add this later if images haven\'t been seeded yet.',
                      },
                    },
                    {
                      name: 'displayOrder',
                      label: 'Display Order',
                      type: 'number',
                      defaultValue: 0,
                      admin: {
                        description: 'Lower numbers appear first',
                      },
                    },
                  ],
                  defaultValue: [
                    {
                      title: 'Modern Corporate Lobby',
                      description: 'Custom planters, preserved wall, and focal tree installation.',
                      projectType: 'Offices',
                      displayOrder: 0,
                    },
                    {
                      title: 'Fine Dining Restaurant',
                      description: 'Living green wall with preserved moss accents.',
                      projectType: 'F&B',
                      displayOrder: 1,
                    },
                    {
                      title: 'Private Villa Garden',
                      description: 'Custom olive trees and Mediterranean plantscaping.',
                      projectType: 'Private Villa',
                      displayOrder: 2,
                    },
                    {
                      title: 'Co-Working Space',
                      description: 'Biophilic design with desk planters and partition walls.',
                      projectType: 'Offices',
                      displayOrder: 3,
                    },
                  ],
                },
                {
                  name: 'ctaText',
                  label: 'CTA Button Text',
                  type: 'text',
                  defaultValue: 'View All Projects',
                },
                {
                  name: 'ctaLink',
                  label: 'CTA Button Link',
                  type: 'text',
                  defaultValue: '/projects',
                },
              ],
            },
          ],
        },
        // Tab 10: Differentiation Section
        {
          label: 'Differentiation',
          fields: [
            {
              name: 'differentiationSection',
              label: 'Differentiation Section',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  label: 'Enable Section',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'headline',
                  label: 'Headline (First Line)',
                  type: 'text',
                  defaultValue: 'Not All Plantscaping',
                  admin: {
                    description: 'First line of the headline',
                  },
                },
                {
                  name: 'headlineSecond',
                  label: 'Headline (Second Line)',
                  type: 'text',
                  defaultValue: 'Is Created Equal',
                  admin: {
                    description: 'Second line of the headline (with shimmer effect)',
                  },
                },
                {
                  name: 'subheadline',
                  label: 'Subheadline',
                  type: 'textarea',
                  defaultValue: 'The difference between commodity plants and strategic biophilic design is the difference between filling space and transforming it.',
                  admin: {
                    description: 'Supporting description text below the headline',
                  },
                },
                {
                  name: 'comparisonPoints',
                  label: 'Comparison Points',
                  type: 'array',
                  admin: {
                    description: 'Add comparison points showing District vs Others',
                  },
                  defaultValue: [
                    {
                      label: 'Design Approach',
                      us: 'Custom concepts tailored to your space and brand',
                      them: 'Generic catalog selections',
                    },
                    {
                      label: 'Plant Quality',
                      us: 'Premium specimens with health guarantees',
                      them: 'Standard nursery stock',
                    },
                    {
                      label: 'Installation',
                      us: 'White-glove service with minimal disruption',
                      them: 'Basic drop-off delivery',
                    },
                    {
                      label: 'Maintenance',
                      us: 'Proactive care plans with dedicated technicians',
                      them: 'Reactive service on request',
                    },
                    {
                      label: 'Consultation',
                      us: 'In-depth discovery and strategic planning',
                      them: 'Quick product recommendations',
                    },
                  ],
                  fields: [
                    {
                      name: 'label',
                      label: 'Label',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'The comparison criteria (e.g., "Design Approach")',
                      },
                    },
                    {
                      name: 'us',
                      label: 'District (Us)',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'What District offers',
                      },
                    },
                    {
                      name: 'them',
                      label: 'Others (Them)',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'What others typically offer',
                      },
                    },
                    {
                      name: 'displayOrder',
                      label: 'Display Order',
                      type: 'number',
                      defaultValue: 0,
                      admin: {
                        description: 'Lower numbers appear first',
                      },
                    },
                  ],
                },
                {
                  name: 'ctaText',
                  label: 'CTA Text',
                  type: 'text',
                  defaultValue: "Ready to experience the difference? Let's talk →",
                  admin: {
                    description: 'Call-to-action text at the bottom',
                  },
                },
                {
                  name: 'ctaLink',
                  label: 'CTA Link',
                  type: 'text',
                  defaultValue: '/contact',
                  admin: {
                    description: 'Link for the CTA',
                  },
                },
              ],
            },
          ],
        },
        // Tab 11: Tree Consultation Preview
        {
          label: 'Tree Consultation',
          fields: [
            {
              name: 'treeConsultationPreview',
              label: 'Tree Consultation Preview',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  label: 'Enable Section',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'badgeText',
                  label: 'Badge Text',
                  type: 'text',
                  defaultValue: 'Featured Service',
                  admin: {
                    description: 'Text shown in the badge above headline',
                  },
                },
                {
                  name: 'headline',
                  label: 'Headline (First Line)',
                  type: 'text',
                  defaultValue: 'Custom Tree',
                  admin: {
                    description: 'First line of the headline',
                  },
                },
                {
                  name: 'headlineSecond',
                  label: 'Headline (Second Line)',
                  type: 'text',
                  defaultValue: 'Solutions',
                  admin: {
                    description: 'Second line of the headline (with shimmer effect)',
                  },
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                  defaultValue: 'From concept to creation: trees tailored to your exact specifications.\n\nWhether you need a statement olive tree for your lobby, preserved botanicals for a restaurant, or a complete green wall installation, our team guides you through every decision. We match species, scale, and aesthetic to your space perfectly.',
                  admin: {
                    description: 'Description text (use double line break to separate paragraphs)',
                  },
                },
                {
                  name: 'ctaText',
                  label: 'Primary CTA Button Text',
                  type: 'text',
                  defaultValue: 'Explore Tree Solutions',
                },
                {
                  name: 'ctaLink',
                  label: 'Primary CTA Button Link',
                  type: 'text',
                  defaultValue: '/tree-solutions',
                },
                {
                  name: 'secondaryCtaText',
                  label: 'Secondary CTA Button Text',
                  type: 'text',
                  defaultValue: 'View Collection',
                },
                {
                  name: 'secondaryCtaLink',
                  label: 'Secondary CTA Button Link',
                  type: 'text',
                  defaultValue: '/collection',
                },
                {
                  name: 'backgroundImage',
                  label: 'Background Image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Main image for this section',
                  },
                },
                {
                  name: 'statNumber',
                  label: 'Stat Number',
                  type: 'text',
                  defaultValue: '50+',
                  admin: {
                    description: 'Number displayed in the stat card',
                  },
                },
                {
                  name: 'statLabel',
                  label: 'Stat Label',
                  type: 'text',
                  defaultValue: 'Tree species available',
                  admin: {
                    description: 'Label text for the stat card',
                  },
                },
              ],
            },
          ],
        },
        // Tab 12: Testimonials Section
        {
          label: 'Testimonials',
          fields: [
            {
              name: 'testimonialsSection',
              label: 'Testimonials Section',
              type: 'group',
              admin: {
                description: 'Uses Testimonials collection - configure display settings',
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
                  label: 'Section Headline',
                  type: 'text',
                  defaultValue: 'Trusted By Industry Leaders',
                  admin: {
                    description: 'Main headline for the testimonials section',
                  },
                },
                {
                  name: 'subheadline',
                  label: 'Subheadline',
                  type: 'text',
                  defaultValue: "What our clients say about working with District",
                  admin: {
                    description: 'Supporting subheadline text',
                  },
                },
                {
                  name: 'maxTestimonials',
                  label: 'Maximum Testimonials to Display',
                  type: 'number',
                  defaultValue: 5,
                  admin: {
                    description: 'Limit number of testimonials shown',
                  },
                },
              ],
            },
          ],
        },
        // Tab 13: Contact Section
        {
          label: 'Contact',
          fields: [
            {
              name: 'contactSection',
              label: 'Contact Section',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  label: 'Enable Section',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'badgeText',
                  label: 'Badge Text',
                  type: 'text',
                  defaultValue: 'Start Your Transformation',
                  admin: {
                    description: 'Text shown in the badge above headline',
                  },
                },
                {
                  name: 'headline',
                  label: 'Headline (First Line)',
                  type: 'text',
                  defaultValue: "Let's Create",
                  admin: {
                    description: 'First line of the headline',
                  },
                },
                {
                  name: 'headlineSecond',
                  label: 'Headline (Second Line)',
                  type: 'text',
                  defaultValue: 'Something Remarkable',
                  admin: {
                    description: 'Second line of the headline (with shimmer effect)',
                  },
                },
                {
                  name: 'subheadline',
                  label: 'Subheadline',
                  type: 'text',
                  defaultValue: "Every great space starts with a conversation. Tell us about your vision.",
                  admin: {
                    description: 'Supporting subheadline text',
                  },
                },
                {
                  name: 'ctaText',
                  label: 'CTA Button Text',
                  type: 'text',
                  defaultValue: 'Request Consultation',
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
                    description: 'Social media links',
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
                      label: 'URL',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'abbr',
                      label: 'Abbreviation',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Short abbreviation (e.g., IG, TT, SC)',
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
                  label: 'Project Types',
                  type: 'array',
                  admin: {
                    description: 'Available project types for the dropdown',
                  },
                  fields: [
                    {
                      name: 'type',
                      label: 'Type',
                      type: 'text',
                      required: true,
                    },
                  ],
                  defaultValue: [
                    { type: 'Corporate Office' },
                    { type: 'Hotel / Hospitality' },
                    { type: 'Restaurant / F&B' },
                    { type: 'Retail Space' },
                    { type: 'Private Residence' },
                    { type: 'Healthcare Facility' },
                    { type: 'Other' },
                  ],
                },
              ],
            },
          ],
        },
        // Tab 14: Virtual Showroom Section
        {
          label: 'Virtual Showrooms',
          fields: [
            {
              name: 'virtualShowroomSection',
              label: 'Virtual Showroom Section',
              type: 'group',
              admin: {
                description: 'Manage settings for the virtual showroom section on the home page',
              },
              fields: [
                {
                  name: 'enabled',
                  label: 'Enable Section',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'badgeText',
                  label: 'Badge Text',
                  type: 'text',
                  defaultValue: '360° Experience',
                  admin: {
                    description: 'Small text above headline (e.g., "360° Experience")',
                  },
                },
                {
                  name: 'headline',
                  label: 'Headline',
                  type: 'text',
                  required: true,
                  defaultValue: 'Explore Our Projects Virtually',
                  admin: {
                    description: 'Main headline text',
                  },
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                  defaultValue: 'Take a 360° virtual tour of our interior plantscaping projects, real spaces we\'ve styled with premium plants and floral arrangements',
                  admin: {
                    description: 'Supporting description text below headline',
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
