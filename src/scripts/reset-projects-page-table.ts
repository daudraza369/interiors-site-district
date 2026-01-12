// Reset Projects Page table - Delete it so Payload can recreate it properly
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

async function resetProjectsPageTable() {
  console.log('🔧 Resetting Projects Page table...\n')

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
    // Check if projects_page table exists
    const tablesResult = await db.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='projects_page'
    `)
    
    const tableExists = tablesResult.rows.length > 0

    if (tableExists) {
      console.log('🗑️  Dropping projects_page table...')
      await db.execute(`DROP TABLE IF EXISTS projects_page`)
      console.log('   ✅ Table dropped\n')
    } else {
      console.log('✅ Table does not exist (nothing to drop)\n')
    }

    console.log('✅ Reset complete!')
    console.log(`\n📦 Backup saved at: ${backupPath}`)
    console.log('\n💡 Next steps:')
    console.log('   1. Restart your dev server (npm run dev)')
    console.log('   2. When Payload prompts for migration, type "y"')
    console.log('   3. Payload will create the table with the correct structure')
    console.log('   4. Access /admin and the Projects Page should work')

  } catch (error: any) {
    console.error('❌ Fatal error during reset:', error.message)
    console.log('Attempting to restore backup due to fatal error...')
    fs.copyFileSync(backupPath, absoluteDbPath)
    console.log('✅ Backup restored.')
    process.exit(1)
  } finally {
    await db.close()
  }
}

resetProjectsPageTable()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))



