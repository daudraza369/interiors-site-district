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
  console.log(`✅ Loaded .env from: ${envPath}`)
} else {
  dotenv.config()
}

const dbPath = path.join(rootDir, 'district-interiors.db')
const backupPath = path.join(rootDir, `district-interiors.db.backup-${Date.now()}`)

async function fixSchema() {
  console.log('🔧 Fixing database schema automatically...')
  console.log(`📁 Database path: ${dbPath}\n`)
  
  // Check if database exists
  if (!fs.existsSync(dbPath)) {
    console.log('ℹ️  Database file not found - will be created on next startup')
    console.log('✅ No action needed - schema will be correct on first run')
    return
  }
  
  // Try to backup first
  let backupCreated = false
  try {
    fs.copyFileSync(dbPath, backupPath)
    backupCreated = true
    console.log(`✅ Database backed up to: ${path.basename(backupPath)}`)
  } catch (error: any) {
    console.log('⚠️  Could not backup database:', error.message)
  }
  
  // Try to delete the database
  try {
    // Try to close any connections by renaming first (works better on Windows)
    const tempPath = `${dbPath}.deleting`
    try {
      fs.renameSync(dbPath, tempPath)
      fs.unlinkSync(tempPath)
      console.log('✅ Old database deleted successfully')
      console.log('✅ Payload will recreate the database with correct schema on next startup')
    } catch (renameError: any) {
      // If rename fails, try direct delete
      fs.unlinkSync(dbPath)
      console.log('✅ Old database deleted successfully')
      console.log('✅ Payload will recreate the database with correct schema on next startup')
    }
  } catch (error: any) {
    if (error.code === 'EBUSY' || error.code === 'ENOENT') {
      console.log('\n⚠️  Database is locked (dev server is running)')
      console.log('\n📝 Please do the following:')
      console.log('   1. Stop your dev server (Ctrl+C in the terminal running npm run dev)')
      console.log('   2. Run this command again: npm run fix:schema')
      console.log('   3. Restart your dev server: npm run dev')
      console.log('   4. Run seed scripts to restore data:')
      console.log('      - npm run seed:media')
      console.log('      - npm run seed:default-images')
      console.log('      - npm run seed:client-logos')
      if (backupCreated) {
        console.log(`\n💾 Your database is backed up at: ${path.basename(backupPath)}`)
      }
      process.exit(1)
    } else {
      throw error
    }
  }
  
  console.log('\n📝 Next steps:')
  console.log('   1. Restart your dev server - Payload will recreate the database')
  console.log('   2. Run seed scripts to restore data:')
  console.log('      - npm run seed:media')
  console.log('      - npm run seed:default-images')
  console.log('      - npm run seed:client-logos')
  console.log('\n✅ Schema fix completed!')
}

fixSchema()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error fixing schema:', error)
    process.exit(1)
  })

