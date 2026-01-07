import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const rootDir = path.resolve(dirname, '../../')
const envPath = path.join(rootDir, '.env')

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log(`✅ Loaded .env from: ${envPath}`)
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in .env file')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

const comparisonPointsData = [
  {
    label: 'Design Approach',
    us: 'Custom concepts tailored to your space and brand',
    them: 'Generic catalog selections',
    displayOrder: 0,
  },
  {
    label: 'Plant Quality',
    us: 'Premium specimens with health guarantees',
    them: 'Standard nursery stock',
    displayOrder: 1,
  },
  {
    label: 'Installation',
    us: 'White-glove service with minimal disruption',
    them: 'Basic drop-off delivery',
    displayOrder: 2,
  },
  {
    label: 'Maintenance',
    us: 'Proactive care plans with dedicated technicians',
    them: 'Reactive service on request',
    displayOrder: 3,
  },
  {
    label: 'Consultation',
    us: 'In-depth discovery and strategic planning',
    them: 'Quick product recommendations',
    displayOrder: 4,
  },
]

async function seedDifferentiation() {
  console.log('🌱 Starting differentiation section seed...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Get the HomePage global
    const homePage = await payload.findGlobal({
      slug: 'home-page',
    })

    // Clear invalid refs first, then update
    const updateData: any = {
      ...homePage,
      differentiationSection: {
        ...homePage.differentiationSection,
        enabled: true,
        headline: homePage.differentiationSection?.headline || 'Not All Plantscaping',
        subheadline:
          homePage.differentiationSection?.subheadline ||
          'The difference between commodity plants and strategic biophilic design is the difference between filling space and transforming it.',
        comparisonPoints: comparisonPointsData,
        ctaText: homePage.differentiationSection?.ctaText || "Ready to experience the difference? Let's talk →",
        ctaLink: homePage.differentiationSection?.ctaLink || '/contact',
      },
    }
    
    // Clear invalid image refs if they exist
    if (updateData.heroSection?.heroSlides) {
      updateData.heroSection.heroSlides = []
    }
    if (updateData.portfolioSection?.projects) {
      updateData.portfolioSection.projects = []
    }
    
    await payload.updateGlobal({
      slug: 'home-page',
      data: updateData,
    })

    console.log(`✅ Added ${comparisonPointsData.length} comparison points to HomePage global`)
    console.log(`\n✨ Seed complete!`)
    console.log(`   The differentiation section is now populated with default data.`)

    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error seeding differentiation section:', error.message || error)
    process.exit(1)
  }
}

seedDifferentiation()

