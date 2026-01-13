// Quick script to check media files vs database
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

const rootDir = path.resolve(process.cwd())
dotenv.config()

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET not set')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

const payload = await getPayload({ config: config.default })
const mediaDir = path.resolve(process.cwd(), 'media')

console.log('📦 Checking media files...\n')

const { docs } = await payload.find({ collection: 'media', limit: 100 })

console.log(`Found ${docs.length} media entries in database\n`)

let found = 0
let missing = 0

for (const entry of docs) {
  const filename = entry.filename
  const filePath = path.join(mediaDir, filename)
  
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${filename}`)
    found++
  } else {
    console.log(`❌ ${filename} - MISSING`)
    missing++
  }
}

console.log(`\n📊 Summary:`)
console.log(`   ✅ Found: ${found}`)
console.log(`   ❌ Missing: ${missing}`)

if (missing > 0) {
  console.log(`\n💡 Missing files need to be re-uploaded via Payload admin`)
}



