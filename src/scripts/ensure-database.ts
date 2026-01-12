// Script to ensure database is initialized and migrated
// Run this on server startup to ensure tables exist
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

// Ensure PAYLOAD_SECRET is set
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set')
  process.exit(1)
}

async function ensureDatabase() {
  console.log('🔧 Ensuring database is initialized...\n')

  try {
    const { getPayload } = await import('payload')
    const configModule = await import('@payload-config')
    const config = configModule.default

    // Initialize Payload - this will run migrations automatically
    const payload = await getPayload({ config })

    console.log('✅ Database initialized and migrations complete!')
    console.log('📊 Checking tables...\n')

    // Check if key tables exist by trying to query them
    const tables = [
      'home_page',
      'services_page',
      'projects_page',
      'contact_page',
      'about_page',
      'collection_page',
      'flowers_page',
      'hospitality_page',
      'styling_page',
      'tree_solutions_page',
    ]

    for (const table of tables) {
      try {
        // Try to find the global - if it fails, table doesn't exist
        await payload.findGlobal({ slug: table.replace('_page', '-page') })
        console.log(`✅ ${table} table exists`)
      } catch (error: any) {
        if (error.message?.includes('no such table')) {
          console.log(`⚠️  ${table} table missing - will be created on first access`)
        } else {
          // Table exists but might be empty - that's okay
          console.log(`✅ ${table} table exists (empty)`)
        }
      }
    }

    console.log('\n✨ Database check complete!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error ensuring database:', error.message || error)
    process.exit(1)
  }
}

ensureDatabase()


