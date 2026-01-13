// Fix media files - ensure database entries match actual files
// This script checks if media files exist and fixes any mismatches

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
} else {
  dotenv.config()
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function fixMediaFiles() {
  console.log('🔧 Checking media files...\n')

  const payload = await getPayload({ config: config.default })
  const mediaDir = path.resolve(process.cwd(), 'media')

  // Get all media entries
  const { docs: mediaEntries } = await payload.find({
    collection: 'media',
    limit: 1000,
  })

  console.log(`📦 Found ${mediaEntries.length} media entries in database\n`)

  let fixed = 0
  let missing = 0
  let ok = 0

  for (const entry of mediaEntries) {
    const filename = entry.filename || ''
    const filePath = path.join(mediaDir, filename)

    if (fs.existsSync(filePath)) {
      console.log(`✅ ${filename} - OK`)
      ok++
    } else {
      console.log(`❌ ${filename} - MISSING`)
      missing++

      // Try to find the file with a similar name
      try {
        const files = fs.readdirSync(mediaDir)
        const baseName = filename.split('-')[0] || filename.split('.')[0]
        const matchingFile = files.find((f) => f.includes(baseName) || filename.includes(f.split('.')[0]))

        if (matchingFile) {
          console.log(`   💡 Found similar file: ${matchingFile}`)
          // Optionally rename it
          // const newPath = path.join(mediaDir, filename)
          // fs.renameSync(path.join(mediaDir, matchingFile), newPath)
          // console.log(`   ✅ Renamed to match database entry`)
        }
      } catch (error) {
        // Ignore
      }
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`   ✅ OK: ${ok}`)
  console.log(`   ❌ Missing: ${missing}`)
  console.log(`\n💡 If files are missing, you may need to:`)
  console.log(`   1. Re-upload them via Payload admin, OR`)
  console.log(`   2. Delete database entries and re-run: pnpm run seed:media`)
}

fixMediaFiles()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })



