// Script to add video_id column to projects table
// This allows the video upload field to work
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'
import Database from 'better-sqlite3'

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
    // Get database path
    const dbPath = process.env.DATABASE_URL?.replace('file:', '') || 
                   path.join(rootDir, 'district-interiors.db')
    
    if (!fs.existsSync(dbPath)) {
      console.error(`❌ Database file not found: ${dbPath}`)
      process.exit(1)
    }

    console.log(`📂 Database path: ${dbPath}`)

    // Open database
    const db = new Database(dbPath)

    // Check if column already exists
    const tableInfo = db.prepare("PRAGMA table_info(projects)").all() as Array<{ name: string }>
    const hasVideoId = tableInfo.some((col: { name: string }) => col.name === 'video_id')

    if (hasVideoId) {
      console.log('✅ video_id column already exists!')
      db.close()
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
      db.close()
      process.exit(1)
    }

    db.close()
    console.log('\n✨ Done! You can now re-enable the video upload field.')
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

addVideoColumn()

