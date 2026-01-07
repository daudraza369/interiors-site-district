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

async function populateDefaults() {
  console.log('🌱 Populating Portfolio and Stats default values...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Get the HomePage global
    const homePage = await payload.findGlobal({
      slug: 'home-page',
    })

    // Update with default values
    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        portfolioSection: {
          ...homePage.portfolioSection,
          headline: homePage.portfolioSection?.headline || 'Transformations',
          subheadline: homePage.portfolioSection?.subheadline || "A showcase of spaces we've brought to life across the region.",
        },
        statsSection: {
          ...homePage.statsSection,
          headline: homePage.statsSection?.headline || '',
        },
      },
    })

    // Get the updated values
    const updatedHomePage = await payload.findGlobal({
      slug: 'home-page',
    })

    console.log('✅ Updated Portfolio Section:')
    console.log(`   - Headline: ${updatedHomePage.portfolioSection?.headline || 'Transformations'}`)
    console.log(`   - Subheadline: ${updatedHomePage.portfolioSection?.subheadline || "A showcase of spaces we've brought to life across the region."}`)
    console.log('\n✅ Updated Stats Section:')
    console.log(`   - Headline: "${updatedHomePage.statsSection?.headline || ''}" (empty by default, can be set in admin)`)
    console.log('\n✨ Default values populated!')
    console.log('   Refresh your admin panel to see the values.')

    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error populating defaults:', error.message || error)
    process.exit(1)
  }
}

populateDefaults()

