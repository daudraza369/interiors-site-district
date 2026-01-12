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

async function updateVirtualShowroomThumbnails() {
  console.log('🌱 Updating virtual showroom thumbnails...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Mapping of showroom titles to thumbnail filenames
    const thumbnailMap: Record<string, string> = {
      'Kahwet Azmi': 'showroom-kahwet-azmi.png',
      'Cilicia': 'showroom-cilicia.png',
      'Bayaz': 'showroom-bayaz.png',
    }

    // Get all virtual showrooms
    const showrooms = await payload.find({
      collection: 'virtual-showrooms',
      limit: 100,
    })

    let updatedCount = 0
    let skippedCount = 0

    for (const showroom of showrooms.docs) {
      const thumbnailFilename = thumbnailMap[showroom.title]
      
      if (!thumbnailFilename) {
        console.log(`⏭️  Skipping "${showroom.title}" - no thumbnail mapping`)
        skippedCount++
        continue
      }

      // Find thumbnail image
      const thumbnailId = await findMediaByFilename(payload, thumbnailFilename)

      if (!thumbnailId) {
        console.log(`⚠️  Thumbnail not found: ${thumbnailFilename} for "${showroom.title}"`)
        console.log(`   Run: npm run seed:media first to upload thumbnails`)
        skippedCount++
        continue
      }

      // Update showroom with thumbnail
      await payload.update({
        collection: 'virtual-showrooms',
        id: showroom.id,
        data: {
          thumbnail: thumbnailId,
        },
      })

      console.log(`✅ Updated: "${showroom.title}" with thumbnail`)
      updatedCount++
    }

    console.log(`\n✨ Update complete!`)
    console.log(`   ✅ Updated: ${updatedCount} showrooms`)
    console.log(`   ⏭️  Skipped: ${skippedCount} showrooms`)
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  }
}

updateVirtualShowroomThumbnails()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))



