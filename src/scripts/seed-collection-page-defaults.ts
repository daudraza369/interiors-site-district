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

const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function seedCollectionPageDefaults() {
  console.log('🎨 Seeding Collection Page defaults...\n')

  try {
    const payload = await getPayload({ config: config.default })

    const defaultData = {
      heroSection: {
        enabled: true,
        eyebrow: 'Curated Greenery',
        headline: 'Our Collection',
        description:
          'Premium greenery solutions for every environment. Explore our curated selection of trees, plants, and planters.',
      },
    }

    // Update global
    await payload.updateGlobal({
      slug: 'collection-page',
      data: defaultData,
    })

    console.log('✅ Collection Page defaults seeded successfully!')
    console.log('   Hero section enabled with default content')
  } catch (error: any) {
    console.error('❌ Error seeding Collection Page:', error.message)
    process.exit(1)
  }
}

seedCollectionPageDefaults()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))



