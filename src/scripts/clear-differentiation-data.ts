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
  console.log(`✅ Loaded .env from: ${envPath}`)
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in .env file')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function clearDifferentiationData() {
  console.log('🧹 Clearing old differentiation section comparison points data...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Get the HomePage global
    const homePage = await payload.findGlobal({
      slug: 'home-page',
    })

    // Clear comparison points by setting to empty array
    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        differentiationSection: {
          ...homePage.differentiationSection,
          comparisonPoints: [],
        },
      },
    })

    console.log('✅ Cleared comparison points from HomePage global')
    console.log('\n✨ Database cleared!')
    console.log('   You can now run migrations and seed scripts.')

    process.exit(0)
  } catch (error: any) {
    // If migration error, try to backup and delete database
    if (error.message?.includes('no such column') || error.message?.includes('migration')) {
      console.log('\n⚠️  Migration conflict detected.')
      console.log('   The database has old schema. You need to:')
      console.log('   1. Stop your dev server (Ctrl+C)')
      console.log('   2. Delete the database: rm .payload/payload.db (or delete the file manually)')
      console.log('   3. Restart dev server to recreate database')
      console.log('   4. Run: npm run seed:all-sections')
      process.exit(1)
    }
    console.error('❌ Error clearing data:', error.message || error)
    process.exit(1)
  }
}

clearDifferentiationData()

