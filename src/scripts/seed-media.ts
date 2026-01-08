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

// Media directory - check multiple possible locations
const assetsDir = path.resolve(rootDir, 'src', 'assets')
const mediaDir = path.resolve(rootDir, 'media')
const standaloneMediaDir = path.resolve(rootDir, '.next', 'standalone', 'media')

// Priority: 1) src/assets, 2) media/, 3) .next/standalone/media (for production)
let actualMediaDir: string
if (fs.existsSync(assetsDir)) {
  actualMediaDir = assetsDir
} else if (fs.existsSync(mediaDir)) {
  actualMediaDir = mediaDir
} else if (fs.existsSync(standaloneMediaDir)) {
  actualMediaDir = standaloneMediaDir
} else {
  // Last resort: use media/ and create it if needed
  actualMediaDir = mediaDir
  if (!fs.existsSync(actualMediaDir)) {
    fs.mkdirSync(actualMediaDir, { recursive: true })
    console.log(`📁 Created media directory: ${actualMediaDir}`)
  }
}

console.log(`📁 Media directory: ${actualMediaDir}`)
console.log(`   Exists: ${fs.existsSync(actualMediaDir)}`)
if (fs.existsSync(actualMediaDir)) {
  try {
    const files = fs.readdirSync(actualMediaDir)
    console.log(`   Files found: ${files.length}`)
  } catch (error) {
    console.log(`   ⚠️  Could not read directory: ${error}`)
  }
}

// Media files with their alt text
const mediaFiles = [
  // Hero images
  { file: 'hero-interior.jpg', alt: 'Modern interior with luxury plantscaping' },
  { file: 'hotel-atrium.jpg', alt: 'Grand hotel atrium with olive trees' },
  { file: 'restaurant-plants.jpg', alt: 'Restaurant with botanical atmosphere' },
  
  // Header logos
  { file: 'district-brandmark.png', alt: 'District Interiors Brandmark' },
  { file: 'district-brandmark-night-green.png', alt: 'District Interiors Brandmark Night Green' },
  { file: 'district-brandmark-pear.png', alt: 'District Interiors Brandmark Pear' },
  { file: 'district-logo-lockup.png', alt: 'District Interiors Logo Lockup' },
  { file: 'district-logo-lockup-night-green.png', alt: 'District Interiors Logo Lockup Night Green' },
  
  // Footer logo
  { file: 'district-logo.png', alt: 'District Interiors Logo' },
  
  // Client logos
  { file: 'logos/amazon.png', alt: 'Amazon' },
  { file: 'logos/linklaters.png', alt: 'Linklaters' },
  { file: 'logos/pepsico.png', alt: 'PepsiCo' },
  { file: 'logos/simah.png', alt: 'SIMAH' },
  { file: 'logos/tahakom.svg', alt: 'Tahakom' },
  
  // Portfolio images
  { file: 'portfolio-corporate-lobby.jpg', alt: 'Corporate lobby with plantscaping' },
  { file: 'portfolio-coworking.jpg', alt: 'Coworking space with greenery' },
  { file: 'portfolio-hotel-atrium.jpg', alt: 'Hotel atrium with trees' },
  { file: 'portfolio-mall.jpg', alt: 'Mall interior with plants' },
  { file: 'portfolio-restaurant.jpg', alt: 'Restaurant with botanical design' },
  { file: 'portfolio-villa.jpg', alt: 'Villa with custom plantscaping' },
  
  // Service images
  { file: 'plantscaping-service.jpg', alt: 'Professional plantscaping service' },
  { file: 'tree-customization-service.jpg', alt: 'Custom tree fabrication service' },
  { file: 'tree-restoration-service.jpg', alt: 'Tree restoration service' },
  { file: 'custom-planter-service.jpg', alt: 'Custom planter design service' },
  { file: 'maintenance-service.jpg', alt: 'Plant maintenance service' },
  { file: 'maintenance-tech.jpg', alt: 'Plant maintenance technician' },
  { file: 'green-wall.jpg', alt: 'Green wall installation' },
  
  // Collection images
  { file: 'collection-ficus-tree.jpg', alt: 'Ficus tree collection' },
  { file: 'collection-olive-tree.jpg', alt: 'Olive tree collection' },
  { file: 'collection-palm-tree.jpg', alt: 'Palm tree collection' },
  
  // Other images
  { file: 'flowers-collection.jpg', alt: 'Flowers collection' },
  { file: 'flowers-catalog-preview.png', alt: 'District Flowers Wholesale Catalog Preview' },
  { file: 'olive-tree.jpg', alt: 'Olive tree' },
  { file: 'planters.jpg', alt: 'Custom planters' },
  { file: 'tree-detail.jpg', alt: 'Tree detail' },
  { file: 'showroom-kahwet-azmi.png', alt: 'Kahwet Azmi showroom thumbnail' },
  { file: 'showroom-cilicia.png', alt: 'Cilicia showroom thumbnail' },
  { file: 'showroom-bayaz.png', alt: 'Bayaz showroom thumbnail' },
]

async function seedMedia() {
  console.log('🌱 Starting media seed...')
  
  const payload = await getPayload({ config: config.default })
  
  let uploadedCount = 0
  let skippedCount = 0
  
  for (const media of mediaFiles) {
    const filePath = path.join(actualMediaDir, media.file)
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${media.file}`)
      skippedCount++
      continue
    }
    
    // Check if media already exists
    const existing = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: path.basename(media.file),
        },
      },
      limit: 1,
    })
    
    if (existing.docs.length > 0) {
      console.log(`⏭️  Already exists: ${media.file}`)
      skippedCount++
      continue
    }
    
    try {
      // Read file as buffer (better for Windows file handling)
      const fileBuffer = await fs.promises.readFile(filePath)
      const fileStats = await fs.promises.stat(filePath)
      const fileName = path.basename(media.file)
      const mimeType = getMimeType(media.file)
      
      // Create file object for Payload
      // Payload expects a file-like object with data as Buffer
      const file = {
        data: fileBuffer,
        name: fileName,
        size: fileStats.size,
        mimetype: mimeType,
      }
      
      // Upload to Payload using Local API
      const uploadedMedia = await payload.create({
        collection: 'media',
        data: {
          alt: media.alt,
        },
        file: file as any,
      })
      
      console.log(`✅ Uploaded: ${media.file} (ID: ${uploadedMedia.id})`)
      uploadedCount++
    } catch (error: any) {
      console.error(`❌ Error uploading ${media.file}:`, error.message || error)
      skippedCount++
    }
  }
  
  console.log(`\n✨ Seed complete!`)
  console.log(`   ✅ Uploaded: ${uploadedCount}`)
  console.log(`   ⏭️  Skipped: ${skippedCount}`)
  console.log(`   📦 Total: ${mediaFiles.length}`)
}

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

// Run seed
seedMedia()
  .then(() => {
    console.log('\n🎉 Media seeding completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error seeding media:', error)
    process.exit(1)
  })
