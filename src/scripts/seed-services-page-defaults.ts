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

async function seedServicesPageDefaults() {
  console.log('🌱 Starting Services Page defaults seed...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Fetch current ServicesPage
    const currentPage = await payload.findGlobal({
      slug: 'services-page',
      depth: 1,
    })

    // Update ServicesPage with default values
    await payload.updateGlobal({
      slug: 'services-page',
      data: {
        heroSection: {
          enabled: currentPage?.heroSection?.enabled ?? true,
          headline: currentPage?.heroSection?.headline || 'Our Services',
          description:
            currentPage?.heroSection?.description ||
            'Comprehensive greenery solutions for every space, from bespoke installations to ongoing maintenance.',
          backgroundImage: currentPage?.heroSection?.backgroundImage || null,
        },
        servicesSection: {
          enabled: currentPage?.servicesSection?.enabled ?? true,
          headline: currentPage?.servicesSection?.headline || null,
        },
        ctaSection: {
          enabled: currentPage?.ctaSection?.enabled ?? true,
          headline: currentPage?.ctaSection?.headline || 'Ready to Transform Your Space?',
          description: currentPage?.ctaSection?.description || "Let's discuss how our services can bring your vision to life.",
          ctaText: currentPage?.ctaSection?.ctaText || 'Request a Consultation',
          ctaLink: currentPage?.ctaSection?.ctaLink || '/contact',
        },
      },
    })

    console.log('✅ Services Page defaults seeded successfully!')
  } catch (error: any) {
    console.error('❌ Error seeding Services Page defaults:', error.message)
    process.exit(1)
  }
}

seedServicesPageDefaults()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))




