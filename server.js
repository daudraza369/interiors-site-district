// server.js - Wrapper for Next.js standalone server
// This ensures the server binds to 0.0.0.0 and uses the correct port
// And automatically syncs media files with Payload-generated filenames on startup

import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { chdir } from 'process'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Set environment variables for the standalone server
process.env.PORT = process.env.PORT || '3000'
process.env.HOSTNAME = process.env.HOST || '0.0.0.0'
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

// Path to the standalone directory
const standaloneDir = path.join(__dirname, '.next', 'standalone')
const serverPath = path.join(standaloneDir, 'server.js')

// Paths for media and fonts
const appMediaDir = path.join(__dirname, 'media')
const standaloneMediaDir = path.join(standaloneDir, 'media')
const appPublicDir = path.join(__dirname, 'public')
const standalonePublicDir = path.join(standaloneDir, 'public')

console.log('🚀 Starting Next.js standalone server...')
console.log(`   PORT: ${process.env.PORT}`)
console.log(`   HOSTNAME: ${process.env.HOSTNAME}`)
console.log(`   Working directory: ${standaloneDir}`)
console.log(`   Server path: ${serverPath}`)

// Source file mapping for Payload-generated filenames
const sourceFileMap = {
  'amazon': 'logos/amazon.png', 'linklaters': 'logos/linklaters.png',
  'pepsico': 'logos/pepsico.png', 'simah': 'logos/simah.png',
  'tahakom': 'logos/tahakom.svg', 'hero-interior': 'hero-interior.jpg',
  'hotel-atrium': 'hotel-atrium.jpg', 'restaurant-plants': 'restaurant-plants.jpg',
  'district-brandmark': 'district-brandmark.png',
  'district-brandmark-night-green': 'district-brandmark-night-green.png',
  'district-brandmark-pear': 'district-brandmark-pear.png',
  'district-logo-lockup': 'district-logo-lockup.png',
  'district-logo-lockup-night-green': 'district-logo-lockup-night-green.png',
  'district-logo': 'district-logo.png',
  'portfolio-corporate-lobby': 'portfolio-corporate-lobby.jpg',
  'portfolio-coworking': 'portfolio-coworking.jpg',
  'portfolio-hotel-atrium': 'portfolio-hotel-atrium.jpg',
  'portfolio-mall': 'portfolio-mall.jpg', 'portfolio-restaurant': 'portfolio-restaurant.jpg',
  'portfolio-villa': 'portfolio-villa.jpg', 'plantscaping-service': 'plantscaping-service.jpg',
  'tree-customization-service': 'tree-customization-service.jpg',
  'tree-restoration-service': 'tree-restoration-service.jpg',
  'custom-planter-service': 'custom-planter-service.jpg',
  'maintenance-service': 'maintenance-service.jpg', 'maintenance-tech': 'maintenance-tech.jpg',
  'green-wall': 'green-wall.jpg', 'collection-ficus-tree': 'collection-ficus-tree.jpg',
  'collection-olive-tree': 'collection-olive-tree.jpg',
  'collection-palm-tree': 'collection-palm-tree.jpg',
  'flowers-collection': 'flowers-collection.jpg',
  'flowers-catalog-preview': 'flowers-catalog-preview.png',
  'olive-tree': 'olive-tree.jpg', 'planters': 'planters.jpg',
  'tree-detail': 'tree-detail.jpg', 'showroom-kahwet-azmi': 'showroom-kahwet-azmi.png',
  'showroom-cilicia': 'showroom-cilicia.png', 'showroom-bayaz': 'showroom-bayaz.png',
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

// Sync media files with Payload-generated filenames
async function syncMediaFiles() {
  console.log('📁 Syncing media files with Payload database...')
  
  try {
    const { getPayload } = await import('payload')
    const config = await import(path.join(__dirname, 'src', 'payload.config.ts'))
    
    const assetsDir = path.join(__dirname, 'src', 'assets')
    const mediaDir = path.join(__dirname, 'media')
    
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true })
    }
    
    const payload = await getPayload({ config: config.default })
    const { docs } = await payload.find({ collection: 'media', limit: 1000 })
    
    console.log(`   Found ${docs.length} media entries in database`)
    
    let copied = 0
    let skipped = 0
    let notFound = 0
    
    for (const m of docs) {
      if (!m.filename) {
        skipped++
        continue
      }
      
      const src = findSourceFile(m.filename, assetsDir)
      if (!src) {
        notFound++
        continue
      }
      
      const dest = path.join(mediaDir, m.filename)
      
      if (fs.existsSync(dest)) {
        try {
          if (fs.statSync(src).size === fs.statSync(dest).size) {
            skipped++
            continue
          }
        } catch (e) {
          // File exists but can't stat, copy anyway
        }
      }
      
      try {
        const dir = path.dirname(dest)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        fs.copyFileSync(src, dest)
        copied++
      } catch (e) {
        notFound++
      }
    }
    
    console.log(`   ✅ Synced ${copied} files (${skipped} already exist, ${notFound} not found)`)
  } catch (error) {
    console.warn(`   ⚠️  Could not sync media files: ${error.message}`)
    console.warn(`   Stack: ${error.stack}`)
    throw error // Re-throw so we know it failed
  }
}

// Start server function
function startServer() {
  // Copy media files to standalone directory if they exist (for Next.js static serving)
  if (fs.existsSync(appMediaDir)) {
    console.log('📁 Copying media files to standalone directory...')
    if (!fs.existsSync(standaloneMediaDir)) {
      fs.mkdirSync(standaloneMediaDir, { recursive: true })
    }
    
    try {
      const files = fs.readdirSync(appMediaDir)
      let copied = 0
      for (const file of files) {
        const srcPath = path.join(appMediaDir, file)
        const destPath = path.join(standaloneMediaDir, file)
        const stat = fs.statSync(srcPath)
        
        if (stat.isDirectory()) {
          // Copy directory recursively
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true })
          }
          const subFiles = fs.readdirSync(srcPath)
          for (const subFile of subFiles) {
            fs.copyFileSync(path.join(srcPath, subFile), path.join(destPath, subFile))
            copied++
          }
        } else {
          fs.copyFileSync(srcPath, destPath)
          copied++
        }
      }
      console.log(`   ✅ Copied ${copied} media files to standalone`)
    } catch (error) {
      console.warn(`   ⚠️  Error copying media files: ${error.message}`)
    }
  } else {
    console.log('   ⚠️  Media directory not found at /app/media')
  }

  // Ensure public directory exists in standalone (fonts should be there from build)
  if (!fs.existsSync(standalonePublicDir)) {
    console.log('📁 Creating public directory in standalone...')
    fs.mkdirSync(standalonePublicDir, { recursive: true })
    
    // Copy fonts if they exist in app public but not in standalone
    if (fs.existsSync(appPublicDir)) {
      const fontsSrc = path.join(appPublicDir, 'fonts')
      const fontsDest = path.join(standalonePublicDir, 'fonts')
      if (fs.existsSync(fontsSrc) && !fs.existsSync(fontsDest)) {
        fs.cpSync(fontsSrc, fontsDest, { recursive: true })
        console.log('   ✅ Copied fonts to standalone')
      }
    }
  }

  // Change to standalone directory (required for Next.js standalone)
  chdir(standaloneDir)

  // Spawn the standalone server
  const server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    cwd: standaloneDir,
    env: {
      ...process.env,
      PORT: process.env.PORT,
      HOSTNAME: process.env.HOSTNAME,
    },
  })

  server.on('error', (error) => {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  })

  server.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ Server exited with code ${code}`)
      process.exit(code)
    }
  })

  // Handle termination signals
  process.on('SIGTERM', () => {
    console.log('📴 Received SIGTERM, shutting down gracefully...')
    server.kill('SIGTERM')
  })

  process.on('SIGINT', () => {
    console.log('📴 Received SIGINT, shutting down gracefully...')
    server.kill('SIGINT')
  })
}

// Run media sync BEFORE starting server (must complete first)
// This ensures files are available when Payload starts serving requests
async function startWithMediaSync() {
  try {
    await syncMediaFiles()
    console.log('✅ Media sync complete, starting server...')
  } catch (err) {
    console.error('❌ Media sync failed:', err.message)
    console.error('   Stack:', err.stack)
    console.warn('   Continuing anyway, but media may not be available...')
  }
  
  // Now start the server
  startServer()
}

// Start the application with media sync
startWithMediaSync()
