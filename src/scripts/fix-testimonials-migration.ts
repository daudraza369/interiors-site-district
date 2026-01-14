// Fix testimonials section migration - add missing columns manually
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

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set')
  process.exit(1)
}

const dbUrl = process.env.DATABASE_URL || 'file:./district-interiors.db'
const absoluteDbPath = path.resolve(rootDir, dbUrl.replace('file:', ''))
const backupPath = `${absoluteDbPath}.backup-${Date.now()}`

async function fixTestimonialsMigration() {
  console.log('🔧 Fixing Testimonials Section migration...\n')

  if (!fs.existsSync(absoluteDbPath)) {
    console.error(`❌ Database file not found at ${absoluteDbPath}`)
    process.exit(1)
  }

  console.log(`📁 Database: ${absoluteDbPath}`)

  // Create backup
  console.log('📦 Creating backup...')
  try {
    fs.copyFileSync(absoluteDbPath, backupPath)
    console.log(`   ✅ Backup created: ${backupPath}\n`)
  } catch (error: any) {
    console.error(`   ❌ Error creating backup: ${error.message}`)
    process.exit(1)
  }

  const db = createClient({
    url: dbUrl,
  })

  try {
    // Check existing columns
    const tableInfo = await db.execute(`PRAGMA table_info(home_page)`)
    const existingColumns = (tableInfo.rows as any[]).map((col: any) => col.name)

    console.log('📊 Checking existing columns...')

    const requiredColumns = [
      { name: 'testimonials_section_enabled', type: 'INTEGER', defaultValue: '1' },
      { name: 'testimonials_section_headline', type: 'TEXT', defaultValue: "'Trusted By Industry Leaders'" },
      { name: 'testimonials_section_subheadline', type: 'TEXT', defaultValue: "'What our clients say about working with District'" },
      { name: 'testimonials_section_max_testimonials', type: 'INTEGER', defaultValue: '5' },
    ]

    let columnsAdded = 0
    for (const col of requiredColumns) {
      if (!existingColumns.includes(col.name)) {
        console.log(`   ⚠️  Missing: ${col.name}`)
        try {
          const defaultValue = col.type === 'INTEGER' ? col.defaultValue : col.defaultValue
          await db.execute(`ALTER TABLE home_page ADD COLUMN ${col.name} ${col.type} DEFAULT ${defaultValue}`)
          console.log(`   ✅ Added: ${col.name}`)
          columnsAdded++
        } catch (error: any) {
          console.error(`   ❌ Error adding ${col.name}: ${error.message}`)
          console.log('   Attempting to restore backup due to error...')
          fs.copyFileSync(backupPath, absoluteDbPath)
          console.log('   ✅ Backup restored.')
          process.exit(1)
        }
      } else {
        console.log(`   ✅ Exists: ${col.name}`)
      }
    }

    if (columnsAdded > 0) {
      console.log(`\n🔨 Added ${columnsAdded} missing column(s)...`)
    } else {
      console.log('\n✅ All required columns already exist.')
    }

    console.log('\n✅ Migration complete!')
    console.log(`\n📦 Backup saved at: ${backupPath}`)
    console.log('\n💡 Next steps:')
    console.log('   1. Restart your dev server if it\'s running')
    console.log('   2. Run: npm run reseed:all-sections')
    console.log('   3. Run: npm run seed:testimonials')

  } catch (error: any) {
    console.error('❌ Fatal error during migration:', error.message)
    console.log('Attempting to restore backup due to fatal error...')
    fs.copyFileSync(backupPath, absoluteDbPath)
    console.log('✅ Backup restored.')
    process.exit(1)
  } finally {
    await db.close()
  }
}

fixTestimonialsMigration()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))





