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
    const pattern = new RegExp(
      `^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(-\\d+)?\\.${extension}$`,
      'i',
    )

    const result = await payload.find({
      collection: 'media',
      limit: 200, // Fetch a reasonable number of media items to search through
    })

    const matches = result.docs.filter(
      (doc: any) => doc.filename && pattern.test(doc.filename),
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

async function seedCollectionItems() {
  console.log('🎨 Seeding Collection Items...\n')

  try {
    const payload = await getPayload({ config: config.default })

    const collectionItemsData = [
      {
        name: 'Premium Olive Tree',
        category: 'Trees',
        imageFilename: 'olive-tree.jpg',
        price: 'Price on Request',
        displayOrder: 0,
      },
      {
        name: 'Deluxe Ficus',
        category: 'Trees',
        imageFilename: 'tree-detail.jpg',
        price: 'Price on Request',
        displayOrder: 1,
      },
      {
        name: 'Royal Palm',
        category: 'Trees',
        imageFilename: 'hotel-atrium.jpg',
        price: 'Price on Request',
        displayOrder: 2,
      },
      {
        name: 'Orchid Arrangement',
        category: 'Flowers',
        imageFilename: 'hero-interior.jpg', // Using fallback image
        price: 'From SAR 850',
        displayOrder: 3,
      },
      {
        name: 'Preserved Rose Display',
        category: 'Flowers',
        imageFilename: 'hero-interior.jpg', // Using fallback image
        price: 'From SAR 1,200',
        displayOrder: 4,
      },
      {
        name: 'Monstera Leaves',
        category: 'Leaves/Foliage',
        imageFilename: 'tree-detail.jpg',
        price: 'From SAR 450',
        displayOrder: 5,
      },
      {
        name: 'Vertical Garden Panel',
        category: 'Green Walls',
        imageFilename: 'green-wall.jpg',
        price: 'Price on Request',
        displayOrder: 6,
      },
      {
        name: 'Moss Wall Installation',
        category: 'Green Walls',
        imageFilename: 'green-wall.jpg',
        price: 'Price on Request',
        displayOrder: 7,
      },
      {
        name: 'Sculptural Trunk',
        category: 'Trunks & Branches',
        imageFilename: 'tree-detail.jpg',
        price: 'Price on Request',
        displayOrder: 8,
      },
      {
        name: 'GRC Planter Large',
        category: 'Planters',
        imageFilename: 'planters.jpg',
        price: 'From SAR 2,800',
        displayOrder: 9,
      },
      {
        name: 'Acrylic Planter Set',
        category: 'Planters',
        imageFilename: 'planters.jpg',
        price: 'From SAR 1,600',
        displayOrder: 10,
      },
      {
        name: 'Stone Planter Premium',
        category: 'Planters',
        imageFilename: 'planters.jpg',
        price: 'Price on Request',
        displayOrder: 11,
      },
    ]

    let created = 0
    let skipped = 0

    for (const itemData of collectionItemsData) {
      // Check if item already exists
      const existing = await payload.find({
        collection: 'collection-items',
        where: {
          name: {
            equals: itemData.name,
          },
        },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`⏭️  Skipping "${itemData.name}" (already exists)`)
        skipped++
        continue
      }

      // Find image
      const imageId = await findMediaByFilename(payload, itemData.imageFilename)

      if (!imageId) {
        console.log(
          `⚠️  Image not found for "${itemData.name}": ${itemData.imageFilename}`,
        )
        console.log(`   Creating item without image...`)
      }

      // Create collection item
      await payload.create({
        collection: 'collection-items',
        data: {
          name: itemData.name,
          category: itemData.category,
          image: imageId || undefined,
          price: itemData.price,
          displayOrder: itemData.displayOrder,
          isPublished: true,
        },
      })

      console.log(
        `✅ Created: "${itemData.name}" (Category: ${itemData.category}, Order: ${itemData.displayOrder})`,
      )
      created++
    }

    console.log(`\n✨ Seeding complete!`)
    console.log(`   Created: ${created} items`)
    console.log(`   Skipped: ${skipped} items (already exist)`)
  } catch (error: any) {
    console.error('❌ Error seeding Collection Items:', error.message)
    process.exit(1)
  }
}

seedCollectionItems()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))





