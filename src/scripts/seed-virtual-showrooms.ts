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

// Helper to find media by filename (for thumbnails)
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

async function seedVirtualShowrooms() {
  console.log('🌱 Starting virtual showrooms seed...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Virtual showrooms data from reference repo
    const showroomsData = [
      {
        title: 'Kahwet Azmi',
        description: 'A welcoming café space transformed with lush interior planting',
        tourUrl: 'https://livetour.istaging.com/7494b8c5-7e17-4659-9f30-39cf5ff8c366?hideLike=true&hideViewNum=true',
        location: 'Riyadh',
        thumbnailFilename: 'showroom-kahwet-azmi.png',
        displayOrder: 0,
      },
      {
        title: 'Cilicia',
        description: 'A modern commercial space enhanced with strategic plant installations',
        tourUrl: 'https://livetour.istaging.com/a22952d4-c384-4597-ac01-0165f1259c22?hideLike=true&hideViewNum=true',
        location: 'Jeddah',
        thumbnailFilename: 'showroom-cilicia.png',
        displayOrder: 1,
      },
      {
        title: 'Bayaz',
        description: 'A contemporary space transformed with curated interior plantscaping',
        tourUrl: 'https://livetour.istaging.com/d8410581-7c2d-4d0c-ac8b-b77a49c79784?hideLike=true&hideViewNum=true',
        location: 'Dammam',
        thumbnailFilename: 'showroom-bayaz.png',
        displayOrder: 2,
      },
    ]

    let createdCount = 0
    let skippedCount = 0

    for (const showroomData of showroomsData) {
      try {
        // Check if showroom already exists
        const existing = await payload.find({
          collection: 'virtual-showrooms',
          where: {
            title: {
              equals: showroomData.title,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          console.log(`⏭️  Skipping "${showroomData.title}" - already exists`)
          skippedCount++
          continue
        }

        // Find thumbnail image (optional - continue even if not found)
        let thumbnailId: string | null = null
        if (showroomData.thumbnailFilename) {
          thumbnailId = await findMediaByFilename(payload, showroomData.thumbnailFilename)
          if (!thumbnailId) {
            console.log(`⚠️  Thumbnail not found: ${showroomData.thumbnailFilename} for "${showroomData.title}"`)
            console.log(`   Creating showroom without thumbnail...`)
          }
        }

        // Create showroom
        await payload.create({
          collection: 'virtual-showrooms',
          data: {
            title: showroomData.title,
            description: showroomData.description,
            tourUrl: showroomData.tourUrl,
            location: showroomData.location,
            thumbnail: thumbnailId,
            displayOrder: showroomData.displayOrder,
            isPublished: true,
          },
        })

        console.log(`✅ Created: "${showroomData.title}"`)
        createdCount++
      } catch (error: any) {
        console.error(`❌ Error creating "${showroomData.title}":`, error.message)
      }
    }

    console.log(`\n✨ Seed complete!`)
    console.log(`   ✅ Created: ${createdCount} showrooms`)
    console.log(`   ⏭️  Skipped: ${skippedCount} showrooms`)
    console.log(`\n💡 Note: Thumbnail images (showroom-*.png) are optional.`)
    console.log(`   You can add them later through the admin panel.`)
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  }
}

seedVirtualShowrooms()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))



