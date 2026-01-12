// Export all data from SQLite database to JSON files
// Run this before migrating to PostgreSQL

import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const rootDir = path.resolve(dirname, '../../')
const envPath = path.join(rootDir, '.env')

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in .env file')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function exportData() {
  console.log('📤 Exporting data from SQLite database...\n')

  try {
    const payload = await getPayload({ config: config.default })
    const exportDir = path.join(rootDir, 'data-export')
    
    // Create export directory
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true })
    }

    // Collections to export
    const collections = [
      'users',
      'media',
      'testimonials',
      'projects',
      'virtual-showrooms',
      'services',
      'collection-items',
    ]

    // Export each collection
    for (const collectionSlug of collections) {
      try {
        const result = await payload.find({
          collection: collectionSlug as any,
          limit: 1000, // Adjust if you have more items
          depth: 2,
        })

        const exportPath = path.join(exportDir, `${collectionSlug}.json`)
        fs.writeFileSync(exportPath, JSON.stringify(result.docs, null, 2))
        console.log(`✅ Exported ${result.docs.length} items from ${collectionSlug}`)
      } catch (error: any) {
        console.error(`⚠️  Error exporting ${collectionSlug}:`, error.message)
      }
    }

    // Export globals
    const globals = [
      'header',
      'footer',
      'home-page',
      'projects-page',
      'contact-page',
      'services-page',
      'tree-solutions-page',
      'about-page',
      'collection-page',
      'flowers-page',
      'hospitality-page',
      'styling-page',
    ]

    for (const globalSlug of globals) {
      try {
        const global = await payload.findGlobal({
          slug: globalSlug as any,
          depth: 2,
        })

        const exportPath = path.join(exportDir, `global-${globalSlug}.json`)
        fs.writeFileSync(exportPath, JSON.stringify(global, null, 2))
        console.log(`✅ Exported global: ${globalSlug}`)
      } catch (error: any) {
        console.error(`⚠️  Error exporting global ${globalSlug}:`, error.message)
      }
    }

    console.log(`\n✨ Export complete!`)
    console.log(`   📁 Data saved to: ${exportDir}`)
    console.log(`\n💡 Next steps:`)
    console.log(`   1. Review the exported JSON files`)
    console.log(`   2. Set up PostgreSQL database`)
    console.log(`   3. Run: npx tsx src/scripts/import-to-postgres.ts`)
  } catch (error: any) {
    console.error('❌ Export failed:', error.message)
    process.exit(1)
  }
}

exportData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))


