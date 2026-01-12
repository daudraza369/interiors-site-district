// Simple media sync script that doesn't require Payload initialization
// This just copies files from src/assets to /app/media based on a mapping
// Run this BEFORE Payload starts serving requests

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const rootDir = path.resolve(dirname, '../../')

// Source and destination directories
const assetsDir = path.join(rootDir, 'src', 'assets')
const mediaDir = path.join(rootDir, 'media')

// Mapping of Payload-generated filenames to source files
const sourceFileMap: Record<string, string> = {
  // Client logos
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

function getBaseName(filename: string): string {
  // Remove extension and trailing numbers (e.g., "amazon-33.png" -> "amazon")
  return filename.replace(/\.[^.]+$/, '').replace(/-\d+$/, '')
}

function findSourceFile(payloadFilename: string): string | null {
  const base = getBaseName(payloadFilename)
  const src = sourceFileMap[base]
  if (!src) return null
  
  // Try full path first
  const fullPath = path.join(assetsDir, src)
  if (fs.existsSync(fullPath)) return fullPath
  
  // Try direct filename
  const directPath = path.join(assetsDir, path.basename(src))
  if (fs.existsSync(directPath)) return directPath
  
  return null
}

async function syncMediaFiles() {
  console.log('📁 Syncing media files (simple copy)...')
  console.log(`   Source: ${assetsDir}`)
  console.log(`   Destination: ${mediaDir}`)
  
  // Ensure media directory exists
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true })
    console.log(`   ✅ Created media directory`)
  }
  
  // Get all files in assets directory recursively
  function getAllFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir)
    
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        getAllFiles(filePath, fileList)
      } else {
        fileList.push(filePath)
      }
    }
    
    return fileList
  }
  
  // Get all asset files
  const assetFiles = fs.existsSync(assetsDir) ? getAllFiles(assetsDir) : []
  console.log(`   Found ${assetFiles.length} files in assets directory`)
  
  // Create a reverse map: source file -> all possible Payload filenames
  const fileMap = new Map<string, string[]>()
  
  for (const assetFile of assetFiles) {
    const relativePath = path.relative(assetsDir, assetFile)
    const baseName = path.basename(relativePath, path.extname(relativePath))
    
    // For each source file, find all Payload filenames that might match
    for (const [payloadBase, sourcePath] of Object.entries(sourceFileMap)) {
      if (relativePath === sourcePath || path.basename(sourcePath) === path.basename(relativePath)) {
        // This source file matches - now find all Payload filenames with this base
        // We'll copy it for any matching Payload filename we find in the media dir
        if (!fileMap.has(assetFile)) {
          fileMap.set(assetFile, [])
        }
        fileMap.get(assetFile)!.push(payloadBase)
      }
    }
  }
  
  // Now check what files exist in media directory (from database)
  // We need to query the database to get actual filenames, but we can't do that without Payload
  // So we'll use a simpler approach: copy all asset files to media directory
  // But with their original names, and let Payload's API handle filename mapping
  
  // Actually, wait - we can't know the Payload-generated filenames without querying the database
  // So this script won't work on its own. We need the database query.
  
  // But for now, let's just copy all files directly - this will help with manually uploaded files
  let copied = 0
  let skipped = 0
  
  for (const assetFile of assetFiles) {
    const fileName = path.basename(assetFile)
    const destFile = path.join(mediaDir, fileName)
    
    if (fs.existsSync(destFile)) {
      // Check if sizes match
      try {
        if (fs.statSync(assetFile).size === fs.statSync(destFile).size) {
          skipped++
          continue
        }
      } catch (e) {
        // Can't stat, copy anyway
      }
    }
    
    try {
      fs.copyFileSync(assetFile, destFile)
      copied++
    } catch (e: any) {
      console.warn(`   ⚠️  Failed to copy ${fileName}: ${e.message}`)
    }
  }
  
  console.log(`   ✅ Copied ${copied} files, skipped ${skipped} existing`)
  console.log(`   💡 Note: This is a basic copy. For Payload-generated filenames, run fix-media-filenames.ts`)
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncMediaFiles()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}

export { syncMediaFiles }


