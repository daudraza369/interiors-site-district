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

// Logo files to upload - Updated to match new repo from public/logos/
const logoFiles = [
  { file: 'logos/uber.svg', alt: 'Uber' },
  { file: 'logos/pepsico.webp', alt: 'PepsiCo' },
  { file: 'logos/bain.svg', alt: 'Bain' },
  { file: 'logos/pretamanger.svg', alt: 'Pret A Manger' },
  { file: 'logos/google.svg', alt: 'Google' },
  { file: 'logos/bnp-paribas.svg', alt: 'BNP Paribas' },
  { file: 'logos/boehringer-ingelheim.svg', alt: 'Boehringer Ingelheim' },
  { file: 'logos/savvy-games.svg', alt: 'Savvy Games' },
]

// Check multiple possible locations for logo files
const logosDir = path.resolve(rootDir, 'media', 'logos')
const assetsLogosDir = path.resolve(rootDir, 'src', 'assets', 'logos')

let actualLogosDir: string
if (fs.existsSync(logosDir)) {
  actualLogosDir = logosDir
} else if (fs.existsSync(assetsLogosDir)) {
  actualLogosDir = assetsLogosDir
} else {
  console.error(`❌ Logo directory not found!`)
  console.error(`   Checked: ${logosDir}`)
  console.error(`   Checked: ${assetsLogosDir}`)
  process.exit(1)
}

console.log(`📁 Logo directory: ${actualLogosDir}`)

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

async function uploadLogos() {
  console.log('🌱 Starting logo upload...')
  
  const payload = await getPayload({ config: config.default })
  
  let uploadedCount = 0
  let skippedCount = 0
  
  for (const logo of logoFiles) {
    const filePath = path.join(actualLogosDir, path.basename(logo.file))
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${logo.file} (checked: ${filePath})`)
      skippedCount++
      continue
    }
    
    // Check if media already exists
    const baseFilename = path.basename(logo.file)
    const existing = await payload.find({
      collection: 'media',
      where: {
        filename: {
          like: `%${baseFilename}`,
        },
      },
      limit: 10,
    })
    
    // Check if exact filename matches or similar (with version numbers)
    const exactMatch = existing.docs.find((doc: any) => 
      doc.filename === baseFilename || 
      doc.filename.startsWith(baseFilename.replace(/\.svg$/, '').replace(/\.png$/, ''))
    )
    
    if (exactMatch) {
      console.log(`⏭️  Already exists: ${logo.file} (ID: ${exactMatch.id}, filename: ${exactMatch.filename})`)
      skippedCount++
      continue
    }
    
    try {
      // Read file buffer (better for Windows file handling)
      const fileBuffer = await fs.promises.readFile(filePath)
      const fileStats = await fs.promises.stat(filePath)
      const fileName = path.basename(logo.file)
      const mimeType = getMimeType(fileName)
      
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
          alt: logo.alt,
        },
        file: file as any,
      })
      
      console.log(`✅ Uploaded: ${logo.file} (ID: ${uploadedMedia.id}, filename: ${uploadedMedia.filename})`)
      uploadedCount++
    } catch (error: any) {
      console.error(`❌ Error uploading ${logo.file}:`, error.message || error)
      skippedCount++
    }
  }
  
  console.log(`\n✨ Upload complete!`)
  console.log(`   ✅ Uploaded: ${uploadedCount}`)
  console.log(`   ⏭️  Skipped: ${skippedCount}`)
  console.log(`   📦 Total: ${logoFiles.length}`)
}

// Run upload
uploadLogos()
  .then(() => {
    console.log('\n🎉 Logo upload completed!')
    console.log('\n💡 Next step: Run `npm run seed:client-logos` to add these logos to the homepage.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error uploading logos:', error)
    process.exit(1)
  })

