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

const { getPayload } = await import('payload')
const config = await import('@payload-config')

// Helper function to get MIME type
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

async function seedFlowersCatalogImage() {
  console.log('🌸 Seeding Flowers Page Catalog Preview Image...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Check if image already exists in media collection
    let previewImageId: string | number | null = null
    const existingImage = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: 'flowers-catalog-preview.png',
        },
      },
      limit: 1,
    })

    if (existingImage.docs.length > 0) {
      previewImageId = existingImage.docs[0].id
      console.log(`✅ Catalog preview image already exists (ID: ${previewImageId})`)
    } else {
      // Image doesn't exist, upload it
      console.log('📤 Uploading catalog preview image...')
      
      // Check both src/assets and media directories
      const assetsDir = path.resolve(rootDir, 'src', 'assets')
      const mediaDir = path.resolve(rootDir, 'media')
      const actualMediaDir = fs.existsSync(assetsDir) ? assetsDir : mediaDir
      
      const imagePath = path.join(actualMediaDir, 'flowers-catalog-preview.png')
      
      if (!fs.existsSync(imagePath)) {
        console.error(`❌ Image file not found at: ${imagePath}`)
        console.error(`   Please ensure flowers-catalog-preview.png exists in src/assets/ or media/`)
        process.exit(1)
      }

      try {
        const fileBuffer = await fs.promises.readFile(imagePath)
        const fileStats = await fs.promises.stat(imagePath)
        const fileName = path.basename(imagePath)
        const mimeType = getMimeType(fileName)

        const file = {
          data: fileBuffer,
          name: fileName,
          size: fileStats.size,
          mimetype: mimeType,
        }

        const uploadedMedia = await payload.create({
          collection: 'media',
          data: {
            alt: 'District Flowers Wholesale Catalog Preview',
          },
          file: file as any,
        })

        previewImageId = uploadedMedia.id
        console.log(`✅ Uploaded catalog preview image (ID: ${previewImageId})`)
      } catch (uploadError: any) {
        console.error(`❌ Error uploading image: ${uploadError.message}`)
        process.exit(1)
      }
    }

    // Now link it to the Flowers Page
    console.log('\n🔗 Linking image to Flowers Page...')
    
    // Get current Flowers Page data
    const flowersPage = await payload.findGlobal({
      slug: 'flowers-page',
    })

    // Update catalog section with preview image
    const updateData: any = {
      catalogSection: {
        ...(flowersPage?.catalogSection || {}),
        previewImage: previewImageId,
      },
    }

    await payload.updateGlobal({
      slug: 'flowers-page',
      data: updateData,
    })

    console.log('✅ Flowers Page catalog preview image linked successfully!')
    console.log(`   Image ID: ${previewImageId}`)
    console.log('\n✨ Done! The image should now appear in the admin panel.')
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

seedFlowersCatalogImage()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))




