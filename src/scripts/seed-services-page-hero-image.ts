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

// Helper to find media by filename, handling Payload's filename numbering
async function findMediaByFilename(payload: any, filename: string): Promise<string | null> {
  try {
    const justFilename = path.basename(filename) // Extract just the filename
    const baseName = justFilename.replace(/\.[^/.]+$/, '')
    const extension = justFilename.split('.').pop() || ''
    // Regex to match filename, optionally followed by -{number}.{extension}
    const pattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(-\\d+)?\\.${extension}$`, 'i')

    const result = await payload.find({
      collection: 'media',
      limit: 200, // Fetch a reasonable number of media items to search through
    })

    const matches = result.docs.filter((doc: any) =>
      doc.filename && pattern.test(doc.filename)
    )

    if (matches.length === 0) {
      return null
    }

    // If multiple matches, get the one with the highest number (latest version)
    if (matches.length > 1) {
      matches.sort((a: any, b: any) => {
        const getNumber = (name: string) => {
          const match = name.match(/-(\d+)\./)
          return match ? parseInt(match[1], 10) : 0
        }
        return getNumber(b.filename) - getNumber(a.filename)
      })
    }

    return matches[0].id
  } catch (error) {
    console.error(`Error finding media ${filename}:`, error)
    return null
  }
}

async function seedServicesPageHeroImage() {
  console.log('🌱 Starting Services Page hero image seed...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Find hero-interior.jpg image
    const heroImageId = await findMediaByFilename(payload, 'hero-interior.jpg')

    if (!heroImageId) {
      console.log('⚠️  Image not found: hero-interior.jpg')
      console.log('   Run: npm run seed:media first')
      return
    }

    // Fetch current ServicesPage
    const currentPage = await payload.findGlobal({
      slug: 'services-page',
      depth: 1,
    })

    // Update ServicesPage with hero image
    await payload.updateGlobal({
      slug: 'services-page',
      data: {
        heroSection: {
          enabled: currentPage?.heroSection?.enabled ?? true,
          headline: currentPage?.heroSection?.headline || 'Our Services',
          description:
            currentPage?.heroSection?.description ||
            'Comprehensive greenery solutions for every space, from bespoke installations to ongoing maintenance.',
          backgroundImage: heroImageId,
        },
        servicesSection: currentPage?.servicesSection || {
          enabled: true,
          headline: null,
        },
        ctaSection: currentPage?.ctaSection || {
          enabled: true,
          headline: 'Ready to Transform Your Space?',
          description: "Let's discuss how our services can bring your vision to life.",
          ctaText: 'Request a Consultation',
          ctaLink: '/contact',
        },
      },
    })

    console.log('✅ Services Page hero image seeded successfully!')
    console.log(`   Hero image ID: ${heroImageId}`)
  } catch (error: any) {
    console.error('❌ Error seeding Services Page hero image:', error.message)
    process.exit(1)
  }
}

seedServicesPageHeroImage()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))




