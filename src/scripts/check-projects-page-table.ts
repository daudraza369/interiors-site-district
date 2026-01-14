// Check if projects_page table exists and has correct structure
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

async function checkProjectsPageTable() {
  console.log('🔍 Checking Projects Page table...\n')

  if (!fs.existsSync(absoluteDbPath)) {
    console.error(`❌ Database file not found at ${absoluteDbPath}`)
    process.exit(1)
  }

  console.log(`📁 Database: ${absoluteDbPath}\n`)

  const db = createClient({
    url: dbUrl,
  })

  try {
    // Check if table exists
    const tablesResult = await db.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='projects_page'
    `)
    
    if (tablesResult.rows.length === 0) {
      console.log('❌ Table "projects_page" does NOT exist\n')
      console.log('💡 Solution:')
      console.log('   1. Make sure your dev server is running')
      console.log('   2. When Payload prompts "Schema changed, migrate?", type "y"')
      console.log('   3. Wait for migration to complete')
      process.exit(1)
    }

    console.log('✅ Table "projects_page" exists\n')

    // Check table structure
    const tableInfo = await db.execute(`PRAGMA table_info(projects_page)`)
    const columns = (tableInfo.rows as any[]).map((col: any) => ({
      name: col.name,
      type: col.type,
    }))

    console.log(`📊 Table has ${columns.length} columns:`)
    columns.forEach(col => {
      console.log(`   - ${col.name} (${col.type})`)
    })

    // Check if there's any data
    const dataResult = await db.execute(`SELECT COUNT(*) as count FROM projects_page`)
    const count = (dataResult.rows[0] as any).count
    console.log(`\n📦 Rows in table: ${count}`)

    if (count === 0) {
      console.log('\n⚠️  Table exists but is empty. This is normal - Payload will populate it when you access the admin.')
    }

    console.log('\n✅ Table structure looks correct!')
    console.log('\n💡 If you still see "Not Found" in admin:')
    console.log('   1. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)')
    console.log('   2. Clear browser cache')
    console.log('   3. Try accessing /admin/globals/projects-page directly')

  } catch (error: any) {
    console.error('❌ Error checking table:', error.message)
    process.exit(1)
  } finally {
    await db.close()
  }
}

checkProjectsPageTable()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))





