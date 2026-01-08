#!/bin/bash
# Inline script to fix media filenames - run this directly in Coolify terminal
# This script queries Payload DB and copies files with correct filenames

cd /app

# Create a temporary script file
cat > /tmp/fix-media-inline.ts << 'EOF'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'

const rootDir = '/app'
const envPath = path.join(rootDir, '.env')

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

const assetsDir = path.join(rootDir, 'src', 'assets')
const mediaDir = path.join(rootDir, 'media')

const sourceFileMap: Record<string, string> = {
  'amazon': 'logos/amazon.png',
  'linklaters': 'logos/linklaters.png',
  'pepsico': 'logos/pepsico.png',
  'simah': 'logos/simah.png',
  'tahakom': 'logos/tahakom.svg',
  'hero-interior': 'hero-interior.jpg',
  'hotel-atrium': 'hotel-atrium.jpg',
  'restaurant-plants': 'restaurant-plants.jpg',
  'district-brandmark': 'district-brandmark.png',
  'district-brandmark-night-green': 'district-brandmark-night-green.png',
  'district-brandmark-pear': 'district-brandmark-pear.png',
  'district-logo-lockup': 'district-logo-lockup.png',
  'district-logo-lockup-night-green': 'district-logo-lockup-night-green.png',
  'district-logo': 'district-logo.png',
  'portfolio-corporate-lobby': 'portfolio-corporate-lobby.jpg',
  'portfolio-coworking': 'portfolio-coworking.jpg',
  'portfolio-hotel-atrium': 'portfolio-hotel-atrium.jpg',
  'portfolio-mall': 'portfolio-mall.jpg',
  'portfolio-restaurant': 'portfolio-restaurant.jpg',
  'portfolio-villa': 'portfolio-villa.jpg',
  'plantscaping-service': 'plantscaping-service.jpg',
  'tree-customization-service': 'tree-customization-service.jpg',
  'tree-restoration-service': 'tree-restoration-service.jpg',
  'custom-planter-service': 'custom-planter-service.jpg',
  'maintenance-service': 'maintenance-service.jpg',
  'maintenance-tech': 'maintenance-tech.jpg',
  'green-wall': 'green-wall.jpg',
  'collection-ficus-tree': 'collection-ficus-tree.jpg',
  'collection-olive-tree': 'collection-olive-tree.jpg',
  'collection-palm-tree': 'collection-palm-tree.jpg',
  'flowers-collection': 'flowers-collection.jpg',
  'flowers-catalog-preview': 'flowers-catalog-preview.png',
  'olive-tree': 'olive-tree.jpg',
  'planters': 'planters.jpg',
  'tree-detail': 'tree-detail.jpg',
  'showroom-kahwet-azmi': 'showroom-kahwet-azmi.png',
  'showroom-cilicia': 'showroom-cilicia.png',
  'showroom-bayaz': 'showroom-bayaz.png',
}

function extractBaseName(payloadFilename: string): string {
  const withoutExt = payloadFilename.replace(/\.[^.]+$/, '')
  return withoutExt.replace(/-\d+$/, '')
}

function findSourceFile(payloadFilename: string): string | null {
  const baseName = extractBaseName(payloadFilename)
  const sourcePath = sourceFileMap[baseName]
  if (!sourcePath) return null
  
  const fullPath = path.join(assetsDir, sourcePath)
  if (fs.existsSync(fullPath)) return fullPath
  
  const directPath = path.join(assetsDir, path.basename(sourcePath))
  if (fs.existsSync(directPath)) return directPath
  
  return null
}

async function fixMediaFilenames() {
  console.log('🔧 Fixing media filenames...\n')
  
  const payload = await getPayload({ config: config.default })
  
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true })
  }
  
  const { docs: allMedia } = await payload.find({
    collection: 'media',
    limit: 1000,
  })
  
  console.log(`📦 Found ${allMedia.length} media entries\n`)
  
  let copied = 0
  let skipped = 0
  let notFound = 0
  
  for (const media of allMedia) {
    const payloadFilename = media.filename
    if (!payloadFilename) {
      skipped++
      continue
    }
    
    const sourcePath = findSourceFile(payloadFilename)
    if (!sourcePath) {
      notFound++
      continue
    }
    
    const destPath = path.join(mediaDir, payloadFilename)
    
    if (fs.existsSync(destPath)) {
      const sourceStats = fs.statSync(sourcePath)
      const destStats = fs.statSync(destPath)
      if (sourceStats.size === destStats.size) {
        skipped++
        continue
      }
    }
    
    try {
      const destDir = path.dirname(destPath)
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }
      fs.copyFileSync(sourcePath, destPath)
      console.log(`✅ ${path.basename(sourcePath)} → ${payloadFilename}`)
      copied++
    } catch (error: any) {
      console.error(`❌ Error: ${payloadFilename} - ${error.message}`)
      notFound++
    }
  }
  
  console.log(`\n✨ Complete! Copied: ${copied}, Skipped: ${skipped}, Not found: ${notFound}`)
}

fixMediaFilenames()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Error:', error)
    process.exit(1)
  })
EOF

# Run the script
npx tsx /tmp/fix-media-inline.ts

