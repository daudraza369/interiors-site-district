// Script to add video_id column to projects table
// This allows the video upload field to work
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

async function addVideoColumn() {
  console.log('🔧 Adding video_id column to projects table...\n')

  try {
    // Use Payload's database connection
    const { getPayload } = await import('payload')
    const config = await import('@payload-config')
    const payload = await getPayload({ config: config.default })

    // Get the database adapter
    const db = (payload.db as any).db

    if (!db) {
      console.error('❌ Could not access database connection')
      process.exit(1)
    }

    // Check if column already exists
    const tableInfo = db.prepare("PRAGMA table_info(projects)").all() as Array<{ name: string }>
    const hasVideoId = tableInfo.some((col: { name: string }) => col.name === 'video_id')

    if (hasVideoId) {
      console.log('✅ video_id column already exists!')
      process.exit(0)
    }

    // Add video_id column
    console.log('📝 Adding video_id column...')
    db.prepare(`
      ALTER TABLE projects 
      ADD COLUMN video_id INTEGER REFERENCES media(id)
    `).run()

    console.log('✅ Successfully added video_id column!')
    
    // Verify
    const newTableInfo = db.prepare("PRAGMA table_info(projects)").all() as Array<{ name: string }>
    const hasVideoIdNow = newTableInfo.some((col: { name: string }) => col.name === 'video_id')
    
    if (hasVideoIdNow) {
      console.log('✅ Verified: video_id column exists')
    } else {
      console.error('❌ Error: video_id column was not added')
      process.exit(1)
    }

    console.log('\n✨ Done! The video upload field is now enabled.')
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    console.error('\n💡 Alternative: Restart the server - Payload will auto-migrate when the video field is enabled.')
    process.exit(1)
  }
}

addVideoColumn()

