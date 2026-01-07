// Load environment variables FIRST, before importing anything
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const rootDir = path.resolve(dirname, '../../')
const envPath = path.join(rootDir, '.env')

// Load .env file BEFORE importing anything that uses env vars
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log(`✅ Loaded .env from: ${envPath}`)
} else {
  dotenv.config()
  console.log(`⚠️  .env not found at ${envPath}, using process.env`)
}

// Ensure PAYLOAD_SECRET is set
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in .env file')
  process.exit(1)
}

// Now dynamically import Payload after .env is loaded
const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function seedTreeSolutionsPageDefaults() {
  console.log('🌳 Seeding Tree Solutions Page defaults...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Get current global or create new one
    let treeSolutionsPage
    try {
      treeSolutionsPage = await payload.findGlobal({
        slug: 'tree-solutions-page',
      })
    } catch (error) {
      console.log('⚠️  Tree Solutions Page not found, will create new one')
    }

    // Default data
    const defaultData = {
      heroSection: {
        headline: 'Trees that Transform Spaces',
        description:
          'From custom creation to restoration, we design, craft, and install trees that bring enduring beauty to homes and businesses alike.',
        subDescription:
          'Every project starts with a conversation. Our consultation experience makes tree selection effortless, guiding you from defining your vision to fine-tuning size, species, and finishes.',
        ctaText: 'Book Your Consultation',
      },
      processSection: {
        enabled: true,
        eyebrow: 'Our Process',
        headline: 'How We Bring Tree Projects to Life',
        steps: [
          {
            step: 1,
            title: 'Understanding Your Space',
            description:
              'Share photos, dimensions, and layout details so our team can design trees that fit perfectly within your environment.',
          },
          {
            step: 2,
            title: 'Choosing Tree Type',
            description:
              'Select from our premium olive, ficus, and palm models, or request a fully custom species.',
          },
          {
            step: 3,
            title: 'Defining Size & Scale',
            description:
              'We assess ceiling heights and proportions to propose tree heights that look visually balanced.',
          },
          {
            step: 4,
            title: 'Customization & Detailing',
            description:
              'Pick trunk type, leaf density, and color tone, blending authenticity with your design palette.',
          },
          {
            step: 5,
            title: 'Scheduling & Installation',
            description:
              'Once approved, our technicians complete installation within 3 to 5 working days.',
          },
        ],
      },
      materialsSection: {
        enabled: true,
        headline: 'Built for Beauty and Longevity',
        description: 'We engineer every tree to thrive where it\'s planted, indoors or out.',
        subDescription:
          'From UV-resistant foliage to fire-rated olive leaves, each material is chosen for safety, durability, and realism. Whether exposed to sunlight, humidity, or heavy foot traffic, our trees are crafted to endure.',
        features: [
          { icon: 'Sun', label: 'UV-Resistant Foliage' },
          { icon: 'Shield', label: 'Fire-Rated Materials' },
          { icon: 'Eye', label: 'High-Realism Details' },
          { icon: 'TreeDeciduous', label: 'Indoor & Outdoor Ready' },
        ],
      },
      maintenanceSection: {
        enabled: true,
        headline: 'We Don\'t Just Install. We Preserve.',
        description: 'Because every great tree deserves lasting care.',
        subDescription:
          'Our maintenance programs include scheduled cleaning, leaf replacement, and branch realignment to ensure your trees stay flawless over time. We also offer upgrade options for clients expanding their greenery portfolio.',
        ctaText: 'Ask About Maintenance',
      },
      consultationSection: {
        enabled: true,
        headline: 'Ready to Begin Your Tree Project?',
        description: 'Let\'s design something extraordinary together.',
        subDescription:
          'Whether you\'re outfitting a villa courtyard, a restaurant lobby, or a corporate space, our team is ready to guide you.',
        ctaText: 'Book a Free Consultation',
        projectTypeOptions: [
          { value: 'villa', label: 'Villa' },
          { value: 'office', label: 'Office' },
          { value: 'hotel', label: 'Hotel' },
          { value: 'restaurant', label: 'Restaurant' },
          { value: 'mall', label: 'Mall' },
          { value: 'public', label: 'Public Space' },
          { value: 'other', label: 'Other' },
        ],
        treeTypeOptions: [
          { value: 'olive', label: 'Olive' },
          { value: 'ficus', label: 'Ficus' },
          { value: 'palm', label: 'Palm' },
          { value: 'custom', label: 'Custom' },
          { value: 'not-sure', label: 'Not sure yet' },
        ],
        timelineOptions: [
          { value: 'immediate', label: 'Immediately' },
          { value: '1-3', label: '1–3 months' },
          { value: '3-6', label: '3–6 months' },
          { value: 'flexible', label: 'Flexible' },
        ],
      },
    }

    // Update global
    await payload.updateGlobal({
      slug: 'tree-solutions-page',
      data: defaultData,
    })

    console.log('✅ Tree Solutions Page defaults seeded successfully!')
    console.log('   All sections enabled with default content')
  } catch (error: any) {
    console.error('❌ Error seeding Tree Solutions Page:', error.message)
    process.exit(1)
  }
}

seedTreeSolutionsPageDefaults()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))

