// Script to safely delete the database file
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const rootDir = path.resolve(dirname, '../../')

const dbPath = path.join(rootDir, '.payload', 'payload.db')
const dbBackupPath = path.join(rootDir, '.payload', 'payload.db.backup')

function resetDatabase() {
  console.log('🗑️  Resetting database...\n')

  // Check if database exists
  if (!fs.existsSync(dbPath)) {
    console.log('⚠️  Database file not found. Nothing to delete.')
    console.log('   You can proceed with: npm run dev')
    process.exit(0)
  }

  try {
    // Create backup
    console.log('📦 Creating backup...')
    fs.copyFileSync(dbPath, dbBackupPath)
    console.log(`✅ Backup created: ${dbBackupPath}`)

    // Delete database
    console.log('\n🗑️  Deleting database...')
    fs.unlinkSync(dbPath)
    console.log('✅ Database deleted successfully!')

    console.log('\n✨ Database reset complete!')
    console.log('\n📝 Next steps:')
    console.log('   1. Make sure your dev server is STOPPED (Ctrl+C)')
    console.log('   2. Run: npm run dev')
    console.log('   3. When prompted about migrations, type: yes')
    console.log('   4. Run: npm run seed:all-sections')
    console.log(`\n💾 Backup saved at: ${dbBackupPath}`)

    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error resetting database:', error.message || error)
    console.error('\n💡 Make sure:')
    console.error('   - Your dev server is STOPPED')
    console.error('   - No other process is using the database')
    process.exit(1)
  }
}

resetDatabase()


