// Import exported data to PostgreSQL database
// Run this after setting up PostgreSQL and updating payload.config.ts

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

if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.includes('postgres')) {
  console.error('❌ DATABASE_URL must be a PostgreSQL connection string')
  console.error('   Current DATABASE_URL:', process.env.DATABASE_URL || 'not set')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function importData() {
  console.log('📥 Importing data to PostgreSQL database...\n')

  try {
    const payload = await getPayload({ config: config.default })
    const exportDir = path.join(rootDir, 'data-export')

    if (!fs.existsSync(exportDir)) {
      console.error('❌ Export directory not found. Run export-sqlite-data.ts first.')
      process.exit(1)
    }

    // Import collections
    const collections = [
      'users',
      'media',
      'testimonials',
      'projects',
      'virtual-showrooms',
      'services',
      'collection-items',
    ]

    for (const collectionSlug of collections) {
      const importPath = path.join(exportDir, `${collectionSlug}.json`)
      
      if (!fs.existsSync(importPath)) {
        console.log(`⏭️  Skipping ${collectionSlug} (file not found)`)
        continue
      }

      try {
        const data = JSON.parse(fs.readFileSync(importPath, 'utf-8'))
        
        for (const item of data) {
          try {
            // Remove id to let database generate new one
            const { id, ...itemData } = item
            
            await payload.create({
              collection: collectionSlug as any,
              data: itemData,
            })
            console.log(`✅ Imported: ${collectionSlug} - ${itemData.title || itemData.email || itemData.alt || 'item'}`)
          } catch (error: any) {
            if (error.message.includes('duplicate') || error.message.includes('unique')) {
              console.log(`⏭️  Skipped duplicate: ${collectionSlug}`)
            } else {
              console.error(`⚠️  Error importing item:`, error.message)
            }
          }
        }
      } catch (error: any) {
        console.error(`⚠️  Error importing ${collectionSlug}:`, error.message)
      }
    }

    // Import globals
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
      const importPath = path.join(exportDir, `global-${globalSlug}.json`)
      
      if (!fs.existsSync(importPath)) {
        console.log(`⏭️  Skipping global ${globalSlug} (file not found)`)
        continue
      }

      try {
        const globalData = JSON.parse(fs.readFileSync(importPath, 'utf-8'))
        
        await payload.updateGlobal({
          slug: globalSlug as any,
          data: globalData,
        })
        console.log(`✅ Imported global: ${globalSlug}`)
      } catch (error: any) {
        console.error(`⚠️  Error importing global ${globalSlug}:`, error.message)
      }
    }

    console.log(`\n✨ Import complete!`)
    console.log(`\n💡 Next steps:`)
    console.log(`   1. Verify data in admin panel`)
    console.log(`   2. Test the site`)
    console.log(`   3. Update production DATABASE_URL in Coolify`)
  } catch (error: any) {
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  }
}

importData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))


