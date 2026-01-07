// Load environment variables FIRST, before importing anything
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

// Ensure PAYLOAD_SECRET is set
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in .env file')
  process.exit(1)
}

// Now dynamically import Payload after .env is loaded
const { getPayload } = await import('payload')
const config = await import('@payload-config')

// Default stats data - matches reference repository
const statsData = [
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
]

async function seedStats() {
  console.log('🌱 Starting stats seed...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Get the HomePage global
    const homePage = await payload.findGlobal({
      slug: 'home-page',
    })

    // Get existing stats from the global
    const existingStats = homePage.statsSection?.stats || []

    // Check if stats already exist
    if (existingStats.length > 0) {
      console.log(`ℹ️  Stats already exist (${existingStats.length} stats)`)
      console.log('   Skipping seed - stats are already in HomePage global')
      process.exit(0)
    }

    // Update the HomePage global with stats array and default headline
    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        statsSection: {
          ...homePage.statsSection,
          enabled: true,
          headline: homePage.statsSection?.headline || '',
          stats: statsData,
        },
      },
    })

    console.log(`✅ Added ${statsData.length} stats to HomePage global`)
    console.log(`\n✨ Seed complete!`)
    console.log(`   📦 Total stats: ${statsData.length}`)

    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error seeding stats:', error.message || error)
    process.exit(1)
  }
}

seedStats()
