// Verify media files are accessible
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET not set')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

const payload = await getPayload({ config: config.default })
const mediaDir = path.resolve(process.cwd(), 'media')

console.log('🔍 Verifying media file access...\n')
console.log(`Media directory: ${mediaDir}`)
console.log(`Exists: ${fs.existsSync(mediaDir)}\n`)

const { docs } = await payload.find({ collection: 'media', limit: 5 })

for (const entry of docs) {
  const filename = entry.filename
  const filePath = path.join(mediaDir, filename)
  
  console.log(`\n📄 ${filename}:`)
  console.log(`   Path: ${filePath}`)
  console.log(`   Exists: ${fs.existsSync(filePath)}`)
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath)
    console.log(`   Size: ${stats.size} bytes`)
    console.log(`   Readable: ${fs.constants.R_OK ? '✅' : '❌'}`)
    
    // Try to read first few bytes
    try {
      const buffer = fs.readFileSync(filePath, { encoding: null, flag: 'r' })
      console.log(`   Can read: ✅ (${buffer.length} bytes)`)
    } catch (error: any) {
      console.log(`   Can read: ❌ ${error.message}`)
    }
  }
}

console.log(`\n💡 If files exist but aren't showing in admin:`)
console.log(`   1. Restart the app in Coolify`)
console.log(`   2. Check file permissions: chmod 644 /app/media/*`)
console.log(`   3. Verify Payload can access: curl http://localhost:3000/api/media/file/hero-interior.jpg`)




