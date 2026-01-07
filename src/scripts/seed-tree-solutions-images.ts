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

async function seedTreeSolutionsImages() {
  console.log('🖼️  Seeding Tree Solutions Page images...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Get current Tree Solutions Page
    let treeSolutionsPage
    try {
      treeSolutionsPage = await payload.findGlobal({
        slug: 'tree-solutions-page',
        depth: 2,
      })
    } catch (error) {
      console.error('❌ Tree Solutions Page not found!')
      console.error('   Run: npm run seed:tree-solutions-page-defaults first')
      process.exit(1)
    }

    // Find images
    const heroImageId = await findMediaByFilename(payload, 'olive-tree.jpg')
    const materialsImageId = await findMediaByFilename(payload, 'tree-detail.jpg')
    const maintenanceImageId = await findMediaByFilename(payload, 'maintenance-tech.jpg')

    // Update hero section background image
    if (heroImageId) {
      console.log(`✅ Found hero image: olive-tree.jpg (ID: ${heroImageId})`)
    } else {
      console.log(`⚠️  Hero image not found: olive-tree.jpg`)
      console.log(`   Run: npm run seed:media first`)
    }

    // Update materials section image
    if (materialsImageId) {
      console.log(`✅ Found materials image: tree-detail.jpg (ID: ${materialsImageId})`)
    } else {
      console.log(`⚠️  Materials image not found: tree-detail.jpg`)
    }

    // Update maintenance section image
    if (maintenanceImageId) {
      console.log(`✅ Found maintenance image: maintenance-tech.jpg (ID: ${maintenanceImageId})`)
    } else {
      console.log(`⚠️  Maintenance image not found: maintenance-tech.jpg`)
    }

    // Build update data with proper nested structure
    const updateData: any = {
      heroSection: {
        ...(treeSolutionsPage?.heroSection || {}),
      },
      materialsSection: {
        ...(treeSolutionsPage?.materialsSection || {}),
      },
      maintenanceSection: {
        ...(treeSolutionsPage?.maintenanceSection || {}),
      },
    }

    // Update hero section background image
    if (heroImageId) {
      updateData.heroSection.backgroundImage = heroImageId
    }

    // Update materials section image
    if (materialsImageId) {
      updateData.materialsSection.image = materialsImageId
    }

    // Update maintenance section image
    if (maintenanceImageId) {
      updateData.maintenanceSection.image = maintenanceImageId
    }

    // Only update if we have at least one image
    if (heroImageId || materialsImageId || maintenanceImageId) {
      await payload.updateGlobal({
        slug: 'tree-solutions-page',
        data: updateData,
      })
      console.log(`\n✅ Successfully updated Tree Solutions Page with images!`)
      if (heroImageId) console.log(`   ✅ Hero image linked`)
      if (materialsImageId) console.log(`   ✅ Materials image linked`)
      if (maintenanceImageId) console.log(`   ✅ Maintenance image linked`)
    } else {
      console.log(`\n⚠️  No images found to update. Make sure to upload images to Media collection first.`)
      console.log(`   Expected images: olive-tree.jpg, tree-detail.jpg, maintenance-tech.jpg`)
      console.log(`   Run: npm run seed:media first to upload images`)
    }
  } catch (error: any) {
    console.error('❌ Error seeding images:', error.message)
    process.exit(1)
  }
}

seedTreeSolutionsImages()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))

