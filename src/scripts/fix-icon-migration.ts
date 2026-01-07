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

async function fixIconMigration() {
  console.log('🔧 Fixing icon migration issue by backing up and deleting database...')
  
  const dbPath = path.join(rootDir, 'district-interiors.db')
  const backupPath = path.join(rootDir, 'district-interiors.db.backup-icon-fix')
  
  if (!fs.existsSync(dbPath)) {
    console.log('ℹ️  Database file not found - nothing to fix')
    return
  }
  
  try {
    // Backup database
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath)
      console.log('✅ Database backed up to district-interiors.db.backup-icon-fix')
    }
    
    // Delete the database - Payload will recreate it with correct schema
    fs.unlinkSync(dbPath)
    console.log('✅ Old database deleted')
    
    console.log('\n✅ Database fixed!')
    console.log('📝 Next steps:')
    console.log('   1. Restart your dev server (Ctrl+C then npm run dev)')
    console.log('   2. Run seed scripts:')
    console.log('      - npm run seed:media')
    console.log('      - npm run seed:default-images')
    console.log('      - npm run seed:client-logos')
    console.log('      - npm run seed:expert-quotes')
    console.log('      - npm run seed:our-approach')
    console.log('\n⚠️  Note: You may need to recreate admin user: npm run seed:admin')
    
  } catch (error: any) {
    console.error('❌ Error fixing database:', error.message || error)
    throw error
  }
}

fixIconMigration()
  .then(() => {
    console.log('\n🎉 Fix completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })

