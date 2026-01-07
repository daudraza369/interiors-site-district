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
  console.error('❌ PAYLOAD_SECRET is not set')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function fixHomePage() {
  console.log('🔧 Fixing HomePage invalid image references...\n')
  
  const payload = await getPayload({ config: config.default })
  
  const homePage = await payload.findGlobal({
    slug: 'home-page',
  })
  
  // Clear invalid references by setting to empty arrays
  const fixedData: any = {
    ...homePage,
    heroSection: {
      ...homePage.heroSection,
      heroSlides: [],
    },
    portfolioSection: {
      ...homePage.portfolioSection,
      projects: [],
    },
  }
  
  // Use local API to bypass validation
  await payload.updateGlobal({
    slug: 'home-page',
    data: fixedData,
  })
  
  console.log('✅ Cleared invalid hero slide and portfolio image references')
  console.log('✨ HomePage fixed! You can now run seed scripts.')
}

fixHomePage()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error('❌ Error:', error.message)
    process.exit(1)
  })


