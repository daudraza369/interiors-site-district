// Fix Projects Page migration - Create table and add columns manually
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

async function fixProjectsPageMigration() {
  console.log('🔧 Fixing Projects Page migration...\n')

  if (!fs.existsSync(absoluteDbPath)) {
    console.error(`❌ Database file not found at ${absoluteDbPath}`)
    console.log('   The database will be created when you restart the dev server')
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
    // Check if projects_page table exists
    const tablesResult = await db.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='projects_page'
    `)
    
    const tableExists = tablesResult.rows.length > 0

    if (!tableExists) {
      console.log('📊 Creating projects_page table...')
      
      // Create the table with Payload's standard structure for globals
      // Payload globals typically have: id, globalType, _status, createdAt, updatedAt
      await db.execute(`
        CREATE TABLE IF NOT EXISTS projects_page (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          globalType TEXT DEFAULT 'projects-page',
          _status TEXT DEFAULT 'published',
          createdAt TEXT DEFAULT (datetime('now')),
          updatedAt TEXT DEFAULT (datetime('now')),
          hero_section_enabled INTEGER DEFAULT 1,
          hero_section_badge_text TEXT DEFAULT 'Portfolio',
          hero_section_headline TEXT DEFAULT 'Our Projects',
          hero_section_description TEXT DEFAULT 'Spaces transformed through green design. A showcase of curated interiors and custom installations.'
        )
      `)
      
      // Insert default row
      await db.execute(`
        INSERT INTO projects_page (globalType, _status, hero_section_enabled, hero_section_badge_text, hero_section_headline, hero_section_description)
        VALUES ('projects-page', 'published', 1, 'Portfolio', 'Our Projects', 'Spaces transformed through green design. A showcase of curated interiors and custom installations.')
      `)
      
      console.log('   ✅ Table created with default data\n')
    } else {
      console.log('✅ Table projects_page already exists\n')
      
      // Check existing columns
      const tableInfo = await db.execute(`PRAGMA table_info(projects_page)`)
      const existingColumns = (tableInfo.rows as any[]).map((col: any) => col.name)

      console.log('📊 Checking existing columns...')

      const requiredColumns = [
        { name: 'hero_section_enabled', type: 'INTEGER', defaultValue: '1' },
        { name: 'hero_section_badge_text', type: 'TEXT', defaultValue: "'Portfolio'" },
        { name: 'hero_section_headline', type: 'TEXT', defaultValue: "'Our Projects'" },
        { name: 'hero_section_description', type: 'TEXT', defaultValue: "'Spaces transformed through green design. A showcase of curated interiors and custom installations.'" },
      ]

      let columnsAdded = 0
      for (const col of requiredColumns) {
        if (!existingColumns.includes(col.name)) {
          console.log(`   ⚠️  Missing: ${col.name}`)
          try {
            const defaultValue = col.type === 'INTEGER' ? col.defaultValue : col.defaultValue
            await db.execute(`ALTER TABLE projects_page ADD COLUMN ${col.name} ${col.type} DEFAULT ${defaultValue}`)
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
    }

    console.log('\n✅ Migration complete!')
    console.log(`\n📦 Backup saved at: ${backupPath}`)
    
    // Log backup to BACKUP_LOG.md
    const backupLogPath = path.join(rootDir, 'BACKUP_LOG.md')
    const backupEntry = `\n## ${new Date().toISOString()}\n- **Backup**: \`${path.basename(backupPath)}\`\n- **Reason**: Projects Page migration fix\n- **Script**: \`fix-projects-page-migration.ts\`\n`
    try {
      fs.appendFileSync(backupLogPath, backupEntry)
      console.log(`📝 Backup logged to BACKUP_LOG.md`)
    } catch (error) {
      console.log(`⚠️  Could not write to BACKUP_LOG.md`)
    }

    console.log('\n💡 Next steps:')
    console.log('   1. Restart your dev server if it\'s running')
    console.log('   2. Access /admin and check if Projects Page appears')
    console.log('   3. If needed, run: npm run seed:projects-page-defaults')

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

fixProjectsPageMigration()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))



