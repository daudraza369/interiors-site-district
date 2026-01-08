// server.js - Wrapper for Next.js standalone server
// This ensures the server binds to 0.0.0.0 and uses the correct port

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

// Copy media files to standalone directory if they exist
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
    console.log(`   ✅ Copied ${copied} media files`)
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

