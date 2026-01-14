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

async function migrateClientLogos() {
  console.log('🔄 Starting client logos migration...')
  
  const payload = await getPayload({ config: config.default })
  
  try {
    // Try to get old client logos from the old table structure
    // We'll query the database directly since the collection no longer exists in config
    const db = (payload.db as any).db || (payload.db as any).client
    
    if (!db) {
      console.log('⚠️  Cannot access database directly. Will use seed script instead.')
      console.log('✅ Migration script ready - run seed:client-logos after migration completes')
      return
    }
    
    // Check if old client_logos table exists
    let oldLogos: any[] = []
    
    try {
      // For SQLite, try to query the old table
      if (db.prepare) {
        // SQLite
        const stmt = db.prepare('SELECT * FROM client_logos ORDER BY displayOrder')
        oldLogos = stmt.all()
      } else {
        // Other databases - try raw query
        console.log('⚠️  Database type not directly supported. Using seed script.')
      }
    } catch (error) {
      console.log('ℹ️  Old client_logos table not found or already migrated.')
    }
    
    if (oldLogos.length === 0) {
      console.log('✅ No old data to migrate. You can add logos manually in the admin panel.')
      return
    }
    
    console.log(`📦 Found ${oldLogos.length} logos to migrate`)
    
    // Get HomePage global
    const homePage = await payload.findGlobal({
      slug: 'home-page',
    })
    
    // Transform old logos to new format
    const migratedLogos = oldLogos.map((oldLogo: any) => ({
      clientName: oldLogo.clientName || oldLogo.client_name,
      logo: oldLogo.logo || oldLogo.logo_id,
      websiteUrl: oldLogo.websiteUrl || oldLogo.website_url || null,
      displayOrder: oldLogo.displayOrder || oldLogo.display_order || 0,
    }))
    
    // Update HomePage global
    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        clientLogosSection: {
          ...homePage.clientLogosSection,
          logos: migratedLogos,
        },
      },
    })
    
    console.log(`✅ Migrated ${migratedLogos.length} logos to HomePage global`)
    console.log('✅ Migration complete!')
    
  } catch (error: any) {
    console.error('❌ Migration error:', error.message || error)
    console.log('\n💡 Alternative: Run the seed script after migration: npm run seed:client-logos')
  }
}

// Run migration
migrateClientLogos()
  .then(() => {
    console.log('\n🎉 Migration process completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error during migration:', error)
    process.exit(1)
  })






