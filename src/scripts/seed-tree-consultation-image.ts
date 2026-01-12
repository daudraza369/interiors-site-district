// Seed Tree Consultation Preview with default image
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
  console.log(`✅ Loaded .env`)
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function findMediaByFilename(payload: any, filename: string): Promise<string | null> {
  try {
    const result = await payload.find({
      collection: 'media',
      where: {
        filename: {
          contains: filename.replace(/\.[^/.]+$/, ''),
        },
      },
      limit: 10,
    })
    
    if (result.docs.length > 0) {
      return result.docs[0].id
    }
    return null
  } catch {
    return null
  }
}

async function seedTreeConsultationImage() {
  console.log('🌱 Seeding Tree Consultation Preview image...\n')
  
  const payload = await getPayload({ config: config.default })
  
  // Find olive-tree.jpg image
  console.log('📦 Looking for olive-tree.jpg...')
  const imageId = await findMediaByFilename(payload, 'olive-tree.jpg')
  
  if (!imageId) {
    console.log('⚠️  olive-tree.jpg not found in media collection')
    console.log('   Please upload it first using: npm run seed:media')
    process.exit(1)
  }
  
  console.log(`✅ Found image: ID ${imageId}\n`)
  
  // Update Tree Consultation Preview section
  console.log('📝 Updating Tree Consultation Preview section...')
  try {
    const homePage = await payload.findGlobal({
      slug: 'home-page',
      depth: 0,
    })
    
    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        treeConsultationPreview: {
          ...homePage.treeConsultationPreview,
          backgroundImage: imageId,
        },
      },
    })
    
    console.log('✅ Tree Consultation Preview image set!')
    console.log(`   Image ID: ${imageId}`)
    console.log('\n💡 The image should now appear on the frontend!')
  } catch (error: any) {
    console.error('❌ Error updating Tree Consultation Preview:', error.message || error)
    throw error
  }
}

seedTreeConsultationImage()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error:', error)
    process.exit(1)
  })



