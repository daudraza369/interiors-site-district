// fix-media-filenames.ts
// This script syncs media files from src/assets to /app/media with Payload-generated filenames
// It queries the Payload database to get the actual filenames and matches them with source files

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
  console.log(`✅ Loaded .env from: ${envPath}`)
} else {
  dotenv.config()
  console.log(`⚠️  .env not found at ${envPath}, using process.env`)
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in .env file')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

// Directories
const assetsDir = path.resolve(rootDir, 'src', 'assets')
const mediaDir = path.resolve(rootDir, 'media')

// Mapping of Payload filenames to source file paths
// This helps match auto-generated filenames (amazon-33.png) to source files (logos/amazon.png)
const sourceFileMap: Record<string, string> = {
  // Client logos - map Payload filename patterns to source paths
  'amazon': 'logos/amazon.png',
  'linklaters': 'logos/linklaters.png',
  'pepsico': 'logos/pepsico.png',
  'simah': 'logos/simah.png',
  'tahakom': 'logos/tahakom.svg',
  
  // Hero images
  'hero-interior': 'hero-interior.jpg',
  'hotel-atrium': 'hotel-atrium.jpg',
  'restaurant-plants': 'restaurant-plants.jpg',
  
  // Branding
  'district-brandmark': 'district-brandmark.png',
  'district-brandmark-night-green': 'district-brandmark-night-green.png',
  'district-brandmark-pear': 'district-brandmark-pear.png',
  'district-logo-lockup': 'district-logo-lockup.png',
  'district-logo-lockup-night-green': 'district-logo-lockup-night-green.png',
  'district-logo': 'district-logo.png',
  
  // Portfolio
  'portfolio-corporate-lobby': 'portfolio-corporate-lobby.jpg',
  'portfolio-coworking': 'portfolio-coworking.jpg',
  'portfolio-hotel-atrium': 'portfolio-hotel-atrium.jpg',
  'portfolio-mall': 'portfolio-mall.jpg',
  'portfolio-restaurant': 'portfolio-restaurant.jpg',
  'portfolio-villa': 'portfolio-villa.jpg',
  
  // Services
  'plantscaping-service': 'plantscaping-service.jpg',
  'tree-customization-service': 'tree-customization-service.jpg',
  'tree-restoration-service': 'tree-restoration-service.jpg',
  'custom-planter-service': 'custom-planter-service.jpg',
  'maintenance-service': 'maintenance-service.jpg',
  'maintenance-tech': 'maintenance-tech.jpg',
  'green-wall': 'green-wall.jpg',
  
  // Collection
  'collection-ficus-tree': 'collection-ficus-tree.jpg',
  'collection-olive-tree': 'collection-olive-tree.jpg',
  'collection-palm-tree': 'collection-palm-tree.jpg',
  
  // Other
  'flowers-collection': 'flowers-collection.jpg',
  'flowers-catalog-preview': 'flowers-catalog-preview.png',
  'olive-tree': 'olive-tree.jpg',
  'planters': 'planters.jpg',
  'tree-detail': 'tree-detail.jpg',
  'showroom-kahwet-azmi': 'showroom-kahwet-azmi.png',
  'showroom-cilicia': 'showroom-cilicia.png',
  'showroom-bayaz': 'showroom-bayaz.png',
}

/**
 * Extract base filename from Payload-generated filename
 * e.g., "amazon-33.png" -> "amazon"
 */
function extractBaseName(payloadFilename: string): string {
  // Remove extension
  const withoutExt = payloadFilename.replace(/\.[^.]+$/, '')
  // Remove trailing numbers and dashes (e.g., "-33")
  const baseName = withoutExt.replace(/-\d+$/, '')
  return baseName
}

/**
 * Find source file for a Payload filename
 */
function findSourceFile(payloadFilename: string): string | null {
  const baseName = extractBaseName(payloadFilename)
  const sourcePath = sourceFileMap[baseName]
  
  if (!sourcePath) {
    return null
  }
  
  // Check in assets directory
  const fullPath = path.join(assetsDir, sourcePath)
  if (fs.existsSync(fullPath)) {
    return fullPath
  }
  
  // Also check if it's directly in assets (no subdirectory)
  const directPath = path.join(assetsDir, path.basename(sourcePath))
  if (fs.existsSync(directPath)) {
    return directPath
  }
  
  return null
}

async function fixMediaFilenames() {
  console.log('🔧 Fixing media filenames to match Payload database...\n')
  
  const payload = await getPayload({ config: config.default })
  
  // Ensure media directory exists
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true })
    console.log(`📁 Created media directory: ${mediaDir}`)
  }
  
  // Fetch all media from Payload
  const { docs: allMedia } = await payload.find({
    collection: 'media',
    limit: 1000,
  })
  
  console.log(`📦 Found ${allMedia.length} media entries in database\n`)
  
  let copied = 0
  let skipped = 0
  let notFound = 0
  
  for (const media of allMedia) {
    const payloadFilename = media.filename
    if (!payloadFilename) {
      skipped++
      continue
    }
    
    // Find source file
    const sourcePath = findSourceFile(payloadFilename)
    
    if (!sourcePath) {
      console.log(`⚠️  No source file found for: ${payloadFilename}`)
      notFound++
      continue
    }
    
    // Destination path in /app/media
    const destPath = path.join(mediaDir, payloadFilename)
    
    // Skip if already exists and is the same size
    if (fs.existsSync(destPath)) {
      const sourceStats = fs.statSync(sourcePath)
      const destStats = fs.statSync(destPath)
      
      if (sourceStats.size === destStats.size) {
        // File already exists and matches
        skipped++
        continue
      }
    }
    
    try {
      // Ensure parent directory exists (for subdirectories like logos/)
      const destDir = path.dirname(destPath)
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }
      
      // Copy file with Payload-generated filename
      fs.copyFileSync(sourcePath, destPath)
      console.log(`✅ Copied: ${path.basename(sourcePath)} → ${payloadFilename}`)
      copied++
    } catch (error: any) {
      console.error(`❌ Error copying ${payloadFilename}:`, error.message)
      notFound++
    }
  }
  
  console.log(`\n✨ Fix complete!`)
  console.log(`   ✅ Copied: ${copied}`)
  console.log(`   ⏭️  Skipped (already exists): ${skipped}`)
  console.log(`   ⚠️  Not found: ${notFound}`)
  console.log(`   📦 Total: ${allMedia.length}`)
  
  if (notFound > 0) {
    console.log(`\n💡 Tip: Some files may need to be manually uploaded through Payload admin.`)
  }
}

fixMediaFilenames()
  .then(() => {
    console.log('\n🎉 Media filename fix completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error fixing media filenames:', error)
    process.exit(1)
  })




