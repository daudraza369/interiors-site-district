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

// Default approach points data
const approachPointsData = [
  {
    number: '01',
    icon: 'Lightbulb',
    title: 'Discovery',
    description: 'We analyze your space, brand identity, and objectives to understand what success looks like for you.',
    accent: 'Understand',
  },
  {
    number: '02',
    icon: 'Ruler',
    title: 'Design',
    description: 'Our designers create custom concepts that balance aesthetics, functionality, and maintenance requirements.',
    accent: 'Envision',
  },
  {
    number: '03',
    icon: 'Wrench',
    title: 'Installation',
    description: 'Expert craftsmen bring designs to life with precision, ensuring minimal disruption to your operations.',
    accent: 'Transform',
  },
  {
    number: '04',
    icon: 'Sparkles',
    title: 'Ongoing Care',
    description: 'Regular maintenance keeps your greenery thriving, with responsive support whenever you need it.',
    accent: 'Sustain',
  },
]

async function seedOurApproach() {
  console.log('🌱 Starting Our Approach section seed...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Fetch the current HomePage global
    const homePage = await payload.findGlobal({
      slug: 'home-page',
      depth: 0,
    })

    const currentPoints = homePage.ourApproachSection?.approachPoints || []
    let hasUpdates = false

    // Build the final points array from our source data
    // This ensures we only have exactly the 4 points we want (01-04)
    const finalPoints = approachPointsData.map((pointData) => {
      // Find existing point with this number
      const existingPoint = currentPoints.find((p: any) => p.number === pointData.number)
      
      if (existingPoint) {
        // Update existing point if accent is missing
        if (!existingPoint.accent || existingPoint.accent === '') {
          console.log(`🔄 Updating accent for Step ${pointData.number}: "${pointData.accent}"`)
          hasUpdates = true
          return {
            ...existingPoint,
            accent: pointData.accent,
            icon: pointData.icon,
            title: pointData.title,
            description: pointData.description,
          }
        }
        console.log(`✅ Already exists: Step ${pointData.number}`)
        return existingPoint
      } else {
        // Add new point
        console.log(`➕ Adding new point: Step ${pointData.number}`)
        hasUpdates = true
        return {
          number: pointData.number,
          icon: pointData.icon,
          title: pointData.title,
          description: pointData.description,
          accent: pointData.accent,
        }
      }
    })

    // Check if we removed any points (had more than 4)
    if (currentPoints.length > finalPoints.length) {
      const removedCount = currentPoints.length - finalPoints.length
      console.log(`🗑️  Removed ${removedCount} duplicate/extra point(s)`)
      hasUpdates = true
    }

    // Always ensure header fields are set (even if points are unchanged)
    const needsHeaderUpdate = !homePage.ourApproachSection?.badgeText || 
                               !homePage.ourApproachSection?.headline ||
                               !homePage.ourApproachSection?.subheadline ||
                               !homePage.ourApproachSection?.description ||
                               !homePage.ourApproachSection?.ctaText ||
                               !homePage.ourApproachSection?.ctaLink

    if (hasUpdates || needsHeaderUpdate) {
      try {
        const updatedHomePage = await payload.updateGlobal({
          slug: 'home-page',
          data: {
            ourApproachSection: {
              ...homePage.ourApproachSection,
              enabled: homePage.ourApproachSection?.enabled ?? true,
              badgeText: homePage.ourApproachSection?.badgeText || 'The Solution',
              headline: homePage.ourApproachSection?.headline || 'This Is Where District Steps In',
              subheadline: homePage.ourApproachSection?.subheadline || 'We\'ve seen the cost of sterile spaces—and we\'ve spent years perfecting the antidote.',
              description: homePage.ourApproachSection?.description || 'Our approach transforms these hidden liabilities into competitive advantages. Through strategic biophilic design, we create environments where people don\'t just work—they thrive.',
              ctaText: homePage.ourApproachSection?.ctaText || 'Start Your Transformation',
              ctaLink: homePage.ourApproachSection?.ctaLink || '/contact',
              approachPoints: finalPoints,
            },
          },
        })
        if (needsHeaderUpdate) {
          console.log(`✅ Updated Our Approach section header fields (badgeText, headline, subheadline, description).`)
        }
        if (hasUpdates) {
          console.log(`✅ Updated HomePage global with approach points.`)
        }
      } catch (error: any) {
        console.error(`❌ Error updating HomePage global with approach points:`, error.message || error)
      }
    } else {
      console.log('✅ All approach points are correct (4 points with accent values).')
    }

    console.log(`\n✨ Seed complete!`)
    console.log(`   📦 Total approach points in global: ${finalPoints.length}`)
  } catch (error: any) {
    console.error('❌ Error during Our Approach seed:', error.message)
    throw error
  }
}

seedOurApproach()
  .then(() => {
    console.log('\n🎉 Our Approach seeding completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })

