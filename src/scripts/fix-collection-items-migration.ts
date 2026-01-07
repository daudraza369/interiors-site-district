// Script to fix Collection Items migration by dropping the problematic table
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { createClient } from '@libsql/client'
import dotenv from 'dotenv'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const rootDir = path.resolve(dirname, '../../')
const envPath = path.join(rootDir, '.env')

// Load .env file
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

const dbUrl = process.env.DATABASE_URL || 'file:./district-interiors.db'
const dbPath = dbUrl.replace('file:', '').replace(/^\./, rootDir)
const backupPath = `${dbPath}.backup-${Date.now()}`

async function fixCollectionItemsMigration() {
  console.log('🔧 Fixing Collection Items migration...\n')

  try {
    // Check if database exists
    if (!fs.existsSync(dbPath)) {
      console.log('⚠️  Database file not found. Nothing to fix.')
      console.log('   You can proceed with: npm run dev')
      process.exit(0)
    }

    // Create backup
    console.log('📦 Creating backup...')
    fs.copyFileSync(dbPath, backupPath)
    console.log(`✅ Backup created: ${backupPath}\n`)

    // Connect to database
    const client = createClient({
      url: `file:${dbPath}`,
    })

    console.log('🗑️  Dropping collection_items table...')
    
    // Drop the old table and any related tables
    try {
      await client.execute('DROP TABLE IF EXISTS `collection_items`')
      await client.execute('DROP TABLE IF EXISTS `__new_collection_items`')
      console.log('✅ Old tables dropped successfully!')
    } catch (error: any) {
      console.log('⚠️  Note:', error.message)
    }

    // Close connection
    await client.close()

    console.log('\n✨ Migration fix complete!')
    console.log('\n📝 Next steps:')
    console.log('   1. Make sure your dev server is STOPPED (Ctrl+C)')
    console.log('   2. Run: npm run dev')
    console.log('   3. Payload will recreate the collection_items table with the new schema')
    console.log(`\n💾 Backup saved at: ${backupPath}`)

    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error fixing migration:', error.message || error)
    console.error('\n💡 Make sure:')
    console.error('   - Your dev server is STOPPED')
    console.error('   - No other process is using the database')
    process.exit(1)
  }
}

fixCollectionItemsMigration()


