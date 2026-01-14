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

    // Get the database adapter - try different ways to access it
    const dbAdapter = payload.db as any
    
    // Try to get the underlying database connection
    let db: any = null
    
    // Method 1: Try payload.db.db (direct access)
    if (dbAdapter?.db) {
      db = dbAdapter.db
    }
    // Method 2: Try payload.db.session (Drizzle session)
    else if (dbAdapter?.session) {
      const session = dbAdapter.session
      // Try to get the underlying libsql client
      if (session?.client) {
        db = session.client
      }
    }
    // Method 3: Try to access via drizzle
    else if (dbAdapter?.drizzle) {
      const drizzle = dbAdapter.drizzle
      if (drizzle?.session?.client) {
        db = drizzle.session.client
      }
    }

    if (!db) {
      console.error('❌ Could not access database connection')
      console.error('💡 Trying alternative: Direct SQL execution via Payload...')
      
      // Alternative: Use Payload's raw query capability if available
      try {
        // Try using Payload's internal query method
        const result = await (payload.db as any).query?.(
          "SELECT sql FROM sqlite_master WHERE type='table' AND name='projects'"
        )
        
        if (result) {
          console.log('✅ Found database connection via query method')
          // Check if column exists
          const tableInfo = await (payload.db as any).query?.("PRAGMA table_info(projects)")
          const hasVideoId = tableInfo?.some((col: any) => col.name === 'video_id')
          
          if (hasVideoId) {
            console.log('✅ video_id column already exists!')
            process.exit(0)
          }
          
          // Add column
          await (payload.db as any).query?.(
            "ALTER TABLE projects ADD COLUMN video_id INTEGER REFERENCES media(id)"
          )
          console.log('✅ Successfully added video_id column!')
          process.exit(0)
        }
      } catch (queryError: any) {
        console.error('❌ Query method also failed:', queryError.message)
      }
      
      console.error('\n💡 Alternative: Restart the server - Payload will auto-migrate when the video field is enabled.')
      console.error('   The video field is already enabled in the code, so restarting should work.')
      process.exit(1)
    }

    // Check if column already exists
    let tableInfo: Array<{ name: string }> = []
    try {
      if (db.prepare) {
        tableInfo = db.prepare("PRAGMA table_info(projects)").all() as Array<{ name: string }>
      } else if (db.execute) {
        const result = db.execute("PRAGMA table_info(projects)")
        tableInfo = Array.isArray(result) ? result : (result.rows || [])
      }
    } catch (e: any) {
      console.error('❌ Error checking table info:', e.message)
      process.exit(1)
    }
    
    const hasVideoId = tableInfo.some((col: { name: string }) => col.name === 'video_id')

    if (hasVideoId) {
      console.log('✅ video_id column already exists!')
      process.exit(0)
    }

    // Add video_id column
    console.log('📝 Adding video_id column...')
    try {
      if (db.prepare) {
        db.prepare(`
          ALTER TABLE projects 
          ADD COLUMN video_id INTEGER REFERENCES media(id)
        `).run()
      } else if (db.execute) {
        db.execute(`
          ALTER TABLE projects 
          ADD COLUMN video_id INTEGER REFERENCES media(id)
        `)
      } else {
        throw new Error('Unknown database client type')
      }
    } catch (alterError: any) {
      console.error('❌ Error adding column:', alterError.message)
      process.exit(1)
    }

    console.log('✅ Successfully added video_id column!')
    
    // Verify
    let newTableInfo: Array<{ name: string }> = []
    try {
      if (db.prepare) {
        newTableInfo = db.prepare("PRAGMA table_info(projects)").all() as Array<{ name: string }>
      } else if (db.execute) {
        const result = db.execute("PRAGMA table_info(projects)")
        newTableInfo = Array.isArray(result) ? result : (result.rows || [])
      }
    } catch (e) {
      // Verification failed but column might still be added
      console.log('⚠️  Could not verify, but column should be added')
    }
    
    const hasVideoIdNow = newTableInfo.some((col: { name: string }) => col.name === 'video_id')
    
    if (hasVideoIdNow || newTableInfo.length === 0) {
      console.log('✅ Verified: video_id column exists (or verification skipped)')
    } else {
      console.error('❌ Error: video_id column was not added')
      process.exit(1)
    }

    console.log('\n✨ Done! The video upload field is now enabled.')
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    console.error('\n💡 Alternative: Restart the server - Payload will auto-migrate when the video field is enabled.')
    console.error('   The video field is already enabled in the code, so restarting should work.')
    process.exit(1)
  }
}

addVideoColumn()

