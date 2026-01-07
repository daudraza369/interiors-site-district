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

async function seedServices() {
  console.log('🌱 Starting services seed...\n')

  try {
    const payload = await getPayload({ config: config.default })

    const servicesData = [
      {
        title: 'Office & F&B Plantscaping',
        description: 'Greenery that works as hard as your space. Purposeful greenery that improves focus, comfort, and the way people experience space.',
        imageFilename: 'restaurant-plants.jpg',
        link: '/services/plantscaping',
        displayOrder: 0,
      },
      {
        title: 'Tree Customization & Enhancement',
        description: 'Your vision, brought to life in green. We design custom artificial trees with bespoke sizing, foliage density, and finishes.',
        imageFilename: 'olive-tree.jpg',
        link: '/tree-solutions',
        displayOrder: 1,
      },
      {
        title: 'Tree Restoration & Refurbishment',
        description: 'Breathe new life into your existing trees. Our specialists revive artificial and natural trees with UV-graded materials.',
        imageFilename: 'tree-detail.jpg',
        link: '/tree-solutions',
        displayOrder: 2,
      },
      {
        title: 'Green Wall Installations',
        description: 'Design vertical landscapes that inspire. We create artificial, natural, and preserved moss walls with integrated systems.',
        imageFilename: 'green-wall.jpg',
        link: '/services/green-walls',
        displayOrder: 3,
      },
      {
        title: 'Custom Planter Design & Fabrication',
        description: 'Planters made to match your design vision. Crafted in GRC, acrylic, or stone with elegance and durability.',
        imageFilename: 'planters.jpg',
        link: '/services/planters',
        displayOrder: 4,
      },
      {
        title: 'Natural Plant Maintenance',
        description: 'Keeping every plant at its best. Routine watering, pruning, and replacement programs ensure vibrant greenery.',
        imageFilename: 'maintenance-tech.jpg',
        link: '/services/maintenance',
        displayOrder: 5,
      },
    ]

    let createdCount = 0
    let skippedCount = 0

    for (const serviceData of servicesData) {
      try {
        // Check if service already exists
        const existing = await payload.find({
          collection: 'services',
          where: {
            title: {
              equals: serviceData.title,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          console.log(`⏭️  Skipping "${serviceData.title}" - already exists`)
          skippedCount++
          continue
        }

        // Find image
        let imageId: string | null = null
        if (serviceData.imageFilename) {
          imageId = await findMediaByFilename(payload, serviceData.imageFilename)
          if (!imageId) {
            console.log(`⚠️  Image not found: ${serviceData.imageFilename} for "${serviceData.title}"`)
            console.log(`   Run: npm run seed:media first`)
          }
        }

        // Create service
        await payload.create({
          collection: 'services',
          data: {
            title: serviceData.title,
            description: serviceData.description,
            image: imageId,
            link: serviceData.link,
            displayOrder: serviceData.displayOrder,
            isPublished: true,
          },
        })

        console.log(`✅ Created: "${serviceData.title}"`)
        createdCount++
      } catch (error: any) {
        console.error(`❌ Error creating "${serviceData.title}":`, error.message)
      }
    }

    console.log(`\n✨ Seed complete!`)
    console.log(`   ✅ Created: ${createdCount} services`)
    console.log(`   ⏭️  Skipped: ${skippedCount} services`)
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  }
}

seedServices()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))


