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

// Helper to find media by filename
async function findMediaByFilename(payload: any, filename: string): Promise<string | null> {
  try {
    const justFilename = filename.includes('/') ? filename.split('/').pop()! : filename
    const baseName = justFilename.replace(/\.[^/.]+$/, '')
    const extension = justFilename.split('.').pop() || ''
    const pattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(-\\d+)?\\.${extension}$`, 'i')

    const result = await payload.find({
      collection: 'media',
      limit: 200,
    })

    const matches = result.docs.filter((doc: any) =>
      doc.filename && pattern.test(doc.filename)
    )

    if (matches.length === 0) {
      return null
    }

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
    console.error(`⚠️  Error finding media ${filename}:`, error)
    return null
  }
}

async function seedAboutPageImages() {
  console.log('🖼️  Seeding About Page images...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Get current About Page
    let aboutPage
    try {
      aboutPage = await payload.findGlobal({
        slug: 'about-page',
        depth: 2,
      })
    } catch (error) {
      console.error('❌ About Page not found!')
      console.error('   Run: npm run seed:about-page-defaults first')
      process.exit(1)
    }

    // Find images
    const heroImageId = await findMediaByFilename(payload, 'hotel-atrium.jpg')
    const storyImageId = await findMediaByFilename(payload, 'hero-interior.jpg')
    const teamImageId = await findMediaByFilename(payload, 'maintenance-tech.jpg')

    // Build update data with proper nested structure
    const updateData: any = {
      heroSection: {
        ...(aboutPage?.heroSection || {}),
      },
      storySection: {
        ...(aboutPage?.storySection || {}),
      },
      teamSection: {
        ...(aboutPage?.teamSection || {}),
      },
    }

    // Update hero section background image
    if (heroImageId) {
      console.log(`✅ Found hero image: hotel-atrium.jpg (ID: ${heroImageId})`)
      updateData.heroSection.backgroundImage = heroImageId
    } else {
      console.log(`⚠️  Hero image not found: hotel-atrium.jpg`)
    }

    // Update story section image
    if (storyImageId) {
      console.log(`✅ Found story image: hero-interior.jpg (ID: ${storyImageId})`)
      updateData.storySection.image = storyImageId
    } else {
      console.log(`⚠️  Story image not found: hero-interior.jpg`)
    }

    // Update team section image
    if (teamImageId) {
      console.log(`✅ Found team image: maintenance-tech.jpg (ID: ${teamImageId})`)
      updateData.teamSection.image = teamImageId
    } else {
      console.log(`⚠️  Team image not found: maintenance-tech.jpg`)
    }

    // Only update if we have at least one image
    if (heroImageId || storyImageId || teamImageId) {
      await payload.updateGlobal({
        slug: 'about-page',
        data: updateData,
      })
      console.log(`\n✅ Successfully updated About Page with images!`)
      if (heroImageId) console.log(`   ✅ Hero image linked`)
      if (storyImageId) console.log(`   ✅ Story image linked`)
      if (teamImageId) console.log(`   ✅ Team image linked`)
    } else {
      console.log(`\n⚠️  No images found to update. Make sure to upload images to Media collection first.`)
      console.log(`   Expected images: hotel-atrium.jpg, hero-interior.jpg, maintenance-tech.jpg`)
      console.log(`   Run: npm run seed:media first to upload images`)
    }
  } catch (error: any) {
    console.error('❌ Error seeding images:', error.message)
    process.exit(1)
  }
}

seedAboutPageImages()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))



