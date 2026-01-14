// Fix Tree Consultation Preview migration - Add missing columns safely
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

console.log('🔧 Fixing Tree Consultation Preview migration...\n')
console.log(`📁 Database: ${absoluteDbPath}`)

// Step 1: Backup database
if (fs.existsSync(absoluteDbPath)) {
  console.log('📦 Creating backup...')
  try {
    fs.copyFileSync(absoluteDbPath, backupPath)
    console.log(`   ✅ Backup created: ${backupPath}`)
  } catch (error: any) {
    console.error(`   ⚠️  Could not create backup: ${error.message}`)
    console.log('   Continuing anyway...')
  }
} else {
  console.log('⚠️  Database file not found')
  console.log('   It will be created when you restart the dev server')
  process.exit(0)
}

const db = createClient({
  url: dbUrl,
})

try {
  // Check if columns exist
  const tableInfo = await db.execute(`PRAGMA table_info(home_page)`)
  const existingColumns = tableInfo.rows.map((row: any) => row.name)
  
  console.log('\n📊 Checking existing columns...')
  const missingColumns = []
  
  const requiredColumns = [
    { name: 'tree_consultation_preview_badge_text', type: 'TEXT', defaultValue: 'Featured Service' },
    { name: 'tree_consultation_preview_headline_second', type: 'TEXT', defaultValue: 'Solutions' },
    { name: 'tree_consultation_preview_secondary_cta_text', type: 'TEXT', defaultValue: 'View Collection' },
    { name: 'tree_consultation_preview_secondary_cta_link', type: 'TEXT', defaultValue: '/collection' },
    { name: 'tree_consultation_preview_stat_number', type: 'TEXT', defaultValue: '50+' },
    { name: 'tree_consultation_preview_stat_label', type: 'TEXT', defaultValue: 'Tree species available' },
  ]
  
  for (const col of requiredColumns) {
    if (!existingColumns.includes(col.name)) {
      missingColumns.push(col)
      console.log(`   ⚠️  Missing: ${col.name}`)
    } else {
      console.log(`   ✅ Exists: ${col.name}`)
    }
  }
  
  if (missingColumns.length === 0) {
    console.log('\n✅ All columns already exist! No migration needed.')
    await db.close()
    process.exit(0)
  }
  
  // Step 3: Add missing columns
  console.log(`\n🔨 Adding ${missingColumns.length} missing column(s)...`)
  
  // Disable foreign keys temporarily
  await db.execute(`PRAGMA foreign_keys = OFF`)
  
  for (const col of missingColumns) {
    try {
      // Escape single quotes in the default value for SQL
      const escapedValue = col.defaultValue.replace(/'/g, "''")
      await db.execute(`ALTER TABLE home_page ADD COLUMN ${col.name} ${col.type} DEFAULT '${escapedValue}'`)
      console.log(`   ✅ Added: ${col.name}`)
    } catch (error: any) {
      if (error.message?.includes('duplicate column') || error.message?.includes('already exists')) {
        console.log(`   ⏭️  Column ${col.name} already exists (skipping)`)
      } else {
        console.error(`   ❌ Error adding ${col.name}:`, error.message)
        throw error
      }
    }
  }
  
  // Re-enable foreign keys
  await db.execute(`PRAGMA foreign_keys = ON`)
  
  console.log('\n✅ Migration complete!')
  console.log(`\n📦 Backup saved at: ${backupPath}`)
  console.log('\n💡 Next steps:')
  console.log('   1. Restart your dev server if it\'s running')
  console.log('   2. Go to Payload Admin → Home Page → Tree Consultation Preview tab')
  console.log('   3. All fields should now be editable!')
  
} catch (error: any) {
  console.error('\n❌ Migration failed:', error.message)
  console.error('\n🔄 Restoring from backup...')
  
  if (fs.existsSync(backupPath)) {
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





