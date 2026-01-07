// Load environment variables FIRST, before importing anything
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const rootDir = path.resolve(dirname, '../../')
const envPath = path.join(rootDir, '.env')

// Load .env file
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

const dbPath = path.join(rootDir, 'district-interiors.db')
const backupPath = path.join(rootDir, 'district-interiors.db.backup')

async function fixDatabase() {
  console.log('🔧 Fixing database index issue...')
  
  // Backup database if it exists
  if (fs.existsSync(dbPath)) {
    try {
      fs.copyFileSync(dbPath, backupPath)
      console.log('✅ Database backed up to district-interiors.db.backup')
    } catch (error) {
      console.log('⚠️  Could not backup database:', error)
    }
    
    // Delete the database to let Payload recreate it with correct schema
    fs.unlinkSync(dbPath)
    console.log('✅ Old database deleted')
    console.log('✅ Payload will recreate the database with correct schema on next startup')
    console.log('\n📝 Next steps:')
    console.log('   1. Restart your dev server: npm run dev')
    console.log('   2. Run seed scripts to restore data:')
    console.log('      - npm run seed:media')
    console.log('      - npm run seed:default-images')
    console.log('      - npm run seed:client-logos')
  } else {
    console.log('ℹ️  Database file not found - nothing to fix')
  }
}

fixDatabase()
  .then(() => {
    console.log('\n🎉 Database fix completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error fixing database:', error)
    process.exit(1)
  })



