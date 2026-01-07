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

async function seedAboutPageDefaults() {
  console.log('👥 Seeding About Page defaults...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Default data
    const defaultData = {
      heroSection: {
        headline: 'About District Interiors',
        description:
          'A design-driven approach to greenery, merging natural aesthetics with architectural precision.',
      },
      storySection: {
        enabled: true,
        eyebrow: 'Our Story',
        headline: 'Designed to Breathe Life Into Spaces',
        paragraph1:
          'District Interiors was founded with a singular vision: to transform indoor and outdoor environments through expert plantscaping, luxury softscaping, and custom tree fabrication.',
        paragraph2:
          'We partner with architects, interior designers, and fit-out specialists across the region to deliver greenery solutions that enhance both aesthetic appeal and human wellbeing. Our mission is simple: to merge natural aesthetics with architectural precision to deliver beauty, sustainability, and comfort.',
        paragraph3:
          'From concept to installation to ongoing care, we bring decades of combined expertise to every project, ensuring each space we touch is transformed into something extraordinary.',
      },
      valuesSection: {
        enabled: true,
        headline: 'Our Values',
        description: 'The principles that guide every project we undertake.',
        values: [
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
      teamSection: {
        enabled: true,
        eyebrow: 'Our Team',
        headline: 'Experts in Green Design',
        paragraph1:
          'Our team brings together horticultural specialists, designers, craftsmen, and project managers who share a passion for bringing nature into built environments.',
        paragraph2:
          'With expertise spanning artificial and natural plantscaping, custom fabrication, and long-term maintenance, we ensure every project receives the attention it deserves.',
        ctaText: 'Work With Us',
        ctaLink: '/contact',
      },
    }

    // Update global
    await payload.updateGlobal({
      slug: 'about-page',
      data: defaultData,
    })

    console.log('✅ About Page defaults seeded successfully!')
    console.log('   All sections enabled with default content')
    console.log('   4 values added')
  } catch (error: any) {
    console.error('❌ Error seeding About Page:', error.message)
    process.exit(1)
  }
}

seedAboutPageDefaults()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))


