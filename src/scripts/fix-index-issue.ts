// Fix duplicate index issue
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

console.log('🔧 Fixing index issue...\n')
console.log(`📁 Database: ${absoluteDbPath}`)

if (!fs.existsSync(absoluteDbPath)) {
  console.log('⚠️  Database file not found')
  process.exit(0)
}

// Backup
console.log('📦 Creating backup...')
try {
  fs.copyFileSync(absoluteDbPath, backupPath)
  console.log(`   ✅ Backup created: ${backupPath}`)
} catch (error: any) {
  console.error(`   ⚠️  Could not create backup: ${error.message}`)
}

const db = createClient({
  url: dbUrl,
})

try {
  const indexName = 'home_page_tree_consultation_preview_tree_consultation_pr_idx'
  
  console.log(`\n📊 Checking for index: ${indexName}...`)
  
  // Check if index exists
  const indexes = await db.execute(`SELECT name FROM sqlite_master WHERE type='index' AND name=?`, [indexName])
  
  if (indexes.rows.length > 0) {
    console.log(`   ⚠️  Index exists - dropping it...`)
    await db.execute(`DROP INDEX IF EXISTS ${indexName}`)
    console.log(`   ✅ Index dropped`)
  } else {
    console.log(`   ✅ Index does not exist`)
  }
  
  console.log('\n✅ Fix complete!')
  console.log(`\n📦 Backup saved at: ${backupPath}`)
  console.log('\n💡 Next steps:')
  console.log('   1. Restart your dev server: npm run dev')
  console.log('   2. When prompted, type: y (to accept migrations)')
  console.log('   3. After server starts, run: npm run seed:contact-defaults')
  
} catch (error: any) {
  console.error('\n❌ Error:', error.message)
  throw error
} finally {
  await db.close()
}

process.exit(0)





