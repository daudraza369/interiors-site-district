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

const dbPath = path.join(rootDir, '.payload', 'payload.db')
const dbBackupPath = path.join(rootDir, '.payload', 'payload.db.backup')

async function fixMigration() {
  console.log('🔧 Fixing differentiation section migration issue...\n')

  try {
    // Check if database exists
    if (!fs.existsSync(dbPath)) {
      console.log('⚠️  Database file not found. Nothing to fix.')
      process.exit(0)
    }

    // Try to clear data using Payload API first
    try {
      const { getPayload } = await import('payload')
      const config = await import('@payload-config')

      const payload = await getPayload({ config: config.default })

      const homePage = await payload.findGlobal({
        slug: 'home-page',
      })

      await payload.updateGlobal({
        slug: 'home-page',
        data: {
          differentiationSection: {
            ...homePage.differentiationSection,
            comparisonPoints: [],
          },
        },
      })

      console.log('✅ Cleared comparison points using Payload API')
      console.log('\n✨ Migration issue fixed!')
      console.log('   You can now run: npm run seed:all-sections')
      process.exit(0)
    } catch (apiError: any) {
      // If Payload API fails (migration blocking), backup and delete database
      if (
        apiError.message?.includes('no such column') ||
        apiError.message?.includes('migration') ||
        apiError.message?.includes('SQLITE_ERROR')
      ) {
        console.log('⚠️  Migration conflict detected. Database needs to be reset.')
        console.log('\n📦 Creating backup...')
        
        // Create backup
        if (fs.existsSync(dbPath)) {
          fs.copyFileSync(dbPath, dbBackupPath)
          console.log(`✅ Backup created: ${dbBackupPath}`)
        }

        console.log('\n🗑️  Deleting database to allow fresh migration...')
        fs.unlinkSync(dbPath)
        console.log('✅ Database deleted')

        console.log('\n✨ Fix complete!')
        console.log('\n📝 Next steps:')
        console.log('   1. Restart your dev server (it will recreate the database)')
        console.log('   2. Accept any migration prompts')
        console.log('   3. Run: npm run seed:all-sections')
        console.log(`\n💾 Backup saved at: ${dbBackupPath}`)
        process.exit(0)
      } else {
        throw apiError
      }
    }
  } catch (error: any) {
    console.error('❌ Error fixing migration:', error.message || error)
    process.exit(1)
  }
}

fixMigration()



