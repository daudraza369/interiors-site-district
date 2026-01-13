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

async function updateFlowersPageBadges() {
  try {
    console.log('🔄 Updating Flowers Page badge content...\n')

    const payload = await getPayload({ config: config.default })

    // Fetch current flowers page
    const flowersPage = await payload.findGlobal({
      slug: 'flowers-page',
      depth: 1,
    })

    if (!flowersPage) {
      console.error('❌ Flowers page not found!')
      process.exit(1)
    }

    // Check if badges exist and need updating
    const currentBadges = flowersPage.heroSection?.badges || []
    console.log('📋 Current badges:', JSON.stringify(currentBadges, null, 2))

    // Define the correct badge content
    const correctBadges = [
      { icon: 'Globe', text: 'Global Direct Imports' },
      { icon: 'CalendarClock', text: 'Fresh Weekly Arrivals' },
      { icon: 'Star', text: '5-Star Hotel Partner' },
    ]

    // Check if update is needed
    const needsUpdate =
      currentBadges.length !== correctBadges.length ||
      currentBadges.some(
        (badge: any, index: number) =>
          badge?.icon !== correctBadges[index].icon ||
          badge?.text !== correctBadges[index].text
      )

    if (!needsUpdate) {
      console.log('✅ Badges are already correct!')
      return
    }

    // Update the badges
    const updated = await payload.updateGlobal({
      slug: 'flowers-page',
      data: {
        heroSection: {
          ...flowersPage.heroSection,
          badges: correctBadges,
        },
      },
    })

    console.log('✅ Successfully updated badges!')
    console.log('📋 New badges:', JSON.stringify(updated.heroSection?.badges, null, 2))
  } catch (error: any) {
    console.error('❌ Error updating badges:', error)
    process.exit(1)
  }
}

updateFlowersPageBadges()
  .then(() => {
    console.log('\n✅ Script completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })

