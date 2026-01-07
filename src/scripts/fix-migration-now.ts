// Comprehensive fix for migration issues - deletes database and provides clear next steps
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const rootDir = path.resolve(dirname, '../../')

const dbPath = path.join(rootDir, '.payload', 'payload.db')
const dbBackupPath = path.join(rootDir, '.payload', 'payload.db.backup')

function fixMigrationNow() {
  console.log('🔧 FIXING MIGRATION ISSUE NOW...\n')

  try {
    // Check if database exists
    if (fs.existsSync(dbPath)) {
      // Create backup
      console.log('📦 Creating backup...')
      try {
        fs.copyFileSync(dbPath, dbBackupPath)
        console.log(`✅ Backup created: ${dbBackupPath}\n`)
      } catch (backupError) {
        console.log('⚠️  Could not create backup (file may be locked)\n')
      }

      // Delete database
      console.log('🗑️  Deleting old database...')
      try {
        fs.unlinkSync(dbPath)
        console.log('✅ Database deleted!\n')
      } catch (deleteError: any) {
        if (deleteError.code === 'EBUSY' || deleteError.code === 'EPERM') {
          console.error('❌ Database is locked!')
          console.error('\n📝 DO THIS:')
          console.error('   1. Stop your dev server (Ctrl+C)')
          console.error('   2. Close any programs using the database')
          console.error('   3. Run this script again: npm run fix:migration')
          console.error('   4. Or manually delete: .payload/payload.db')
          process.exit(1)
        }
        throw deleteError
      }
    } else {
      console.log('✅ Database already deleted or doesn\'t exist\n')
    }

    // Also delete any migration lock files
    const lockFiles = [
      path.join(rootDir, '.payload', 'migrations', '.migrations'),
      path.join(rootDir, '.payload', '.migrations'),
    ]

    lockFiles.forEach((lockFile) => {
      if (fs.existsSync(lockFile)) {
        try {
          fs.unlinkSync(lockFile)
          console.log(`✅ Deleted lock file: ${lockFile}`)
        } catch (e) {
          // Ignore
        }
      }
    })

    console.log('\n✨ FIX COMPLETE!\n')
    console.log('📝 NEXT STEPS:')
    console.log('   1. Make sure dev server is STOPPED')
    console.log('   2. Run: npm run dev')
    console.log('   3. When prompted, type: yes (to accept migrations)')
    console.log('   4. Wait for server to start')
    console.log('   5. In a NEW terminal, run: npm run seed:all-sections')
    console.log(`\n💾 Backup saved at: ${dbBackupPath}`)

    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Error:', error.message || error)
    console.error('\n💡 Manual fix:')
    console.error('   1. Stop dev server (Ctrl+C)')
    console.error('   2. Delete: .payload/payload.db')
    console.error('   3. Restart: npm run dev')
    process.exit(1)
  }
}

fixMigrationNow()


