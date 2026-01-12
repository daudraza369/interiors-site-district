// Fix Differentiation Section - Add headlineSecond field
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const rootDir = path.resolve(dirname, '../../')
const envPath = path.join(rootDir, '.env')

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log(`✅ Loaded .env`)
}

const dbUrl = process.env.DATABASE_URL || 'file:./district-interiors.db'
const absoluteDbPath = path.resolve(rootDir, dbUrl.replace('file:', ''))
const backupPath = `${absoluteDbPath}.backup-${Date.now()}`

console.log('🔧 Fixing Differentiation Section headline...\n')
console.log(`📁 Database: ${absoluteDbPath}`)

// Step 1: Backup database
if (fs.existsSync(absoluteDbPath)) {
  console.log('📦 Creating backup...')
  try {
    fs.copyFileSync(absoluteDbPath, backupPath)
    console.log(`   ✅ Backup created: ${backupPath}`)
  } catch (error: any) {
    console.error(`   ⚠️  Could not create backup: ${error.message}`)
  }
} else {
  console.log('⚠️  Database file not found')
  process.exit(0)
}

const db = createClient({
  url: dbUrl,
})

try {
  // Check if column exists
  const tableInfo = await db.execute(`PRAGMA table_info(home_page)`)
  const existingColumns = tableInfo.rows.map((row: any) => row.name)
  
  console.log('\n📊 Checking for headlineSecond column...')
  
  if (existingColumns.includes('differentiation_section_headline_second')) {
    console.log('   ✅ Column already exists!')
    await db.close()
    process.exit(0)
  }
  
  // Add the column
  console.log('🔨 Adding headlineSecond column...')
  await db.execute(`PRAGMA foreign_keys = OFF`)
  
  try {
    await db.execute(`ALTER TABLE home_page ADD COLUMN differentiation_section_headline_second TEXT DEFAULT 'Is Created Equal'`)
    console.log('   ✅ Added: differentiation_section_headline_second')
  } catch (error: any) {
    if (error.message?.includes('duplicate column') || error.message?.includes('already exists')) {
      console.log('   ⏭️  Column already exists (skipping)')
    } else {
      throw error
    }
  }
  
  await db.execute(`PRAGMA foreign_keys = ON`)
  
  console.log('\n✅ Migration complete!')
  console.log(`\n📦 Backup saved at: ${backupPath}`)
  console.log('\n💡 Next steps:')
  console.log('   1. Restart your dev server if it\'s running')
  console.log('   2. Go to Payload Admin → Home Page → Differentiation tab')
  console.log('   3. You should now see "Headline (Second Line)" field!')
  
} catch (error: any) {
  console.error('\n❌ Migration failed:', error.message)
  if (fs.existsSync(backupPath)) {
    console.error('\n🔄 Restoring from backup...')
    try {
      fs.copyFileSync(backupPath, absoluteDbPath)
      console.log('   ✅ Database restored from backup')
    } catch (restoreError: any) {
      console.error(`   ⚠️  Could not restore: ${restoreError.message}`)
    }
  }
  throw error
} finally {
  await db.close()
}

process.exit(0)



