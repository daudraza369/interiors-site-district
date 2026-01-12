// Standalone JavaScript script to sync media files
// This can run without TypeScript compilation or tsx
// Run: node src/scripts/sync-media-standalone.js

const fs = require('fs')
const path = require('path')

const rootDir = process.cwd()
const assetsDir = path.join(rootDir, 'src', 'assets')
const mediaDir = path.join(rootDir, 'media')

// Mapping of base names to source paths
const sourceFileMap = {
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

function getBaseName(filename) {
  return filename.replace(/\.[^.]+$/, '').replace(/-\d+$/, '')
}

function findSourceFile(payloadFilename, assetsDir) {
  const base = getBaseName(payloadFilename)
  const src = sourceFileMap[base]
  if (!src) return null
  
  const p1 = path.join(assetsDir, src)
  if (fs.existsSync(p1)) return p1
  
  const p2 = path.join(assetsDir, path.basename(src))
  return fs.existsSync(p2) ? p2 : null
}

// This script can't query the database without Payload
// So it will just copy all files from assets to media with their original names
// For full sync with Payload-generated filenames, use fix-media-filenames.ts

async function syncBasic() {
  console.log('📁 Basic media sync (copying all files from assets to media)...')
  console.log(`   Source: ${assetsDir}`)
  console.log(`   Destination: ${mediaDir}`)
  
  if (!fs.existsSync(assetsDir)) {
    console.error(`❌ Source directory does not exist: ${assetsDir}`)
    process.exit(1)
  }
  
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true })
    console.log(`   ✅ Created media directory`)
  }
  
  function getAllFiles(dir, fileList = []) {
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
  
  const assetFiles = getAllFiles(assetsDir)
  console.log(`   Found ${assetFiles.length} files in assets`)
  
  let copied = 0
  let skipped = 0
  let errors = 0
  
  for (const assetFile of assetFiles) {
    const fileName = path.basename(assetFile)
    const destFile = path.join(mediaDir, fileName)
    
    if (fs.existsSync(destFile)) {
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
    } catch (e) {
      console.warn(`   ⚠️  Failed to copy ${fileName}: ${e.message}`)
      errors++
    }
  }
  
  console.log(`   ✅ Copied ${copied} files, skipped ${skipped} existing, ${errors} errors`)
  console.log(`   💡 Note: For Payload-generated filenames, run: pnpm run fix:media-filenames`)
}

syncBasic()
  .then(() => {
    console.log('\n✨ Basic sync complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })


