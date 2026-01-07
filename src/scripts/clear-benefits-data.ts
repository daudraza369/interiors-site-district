// Load environment variables FIRST, before importing anything
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const rootDir = path.resolve(dirname, '../../')
const envPath = path.join(rootDir, '.env')

// Load .env file BEFORE importing anything that uses env vars
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log(`✅ Loaded .env from: ${envPath}`)
} else {
  dotenv.config()
  console.log(`⚠️  .env not found at ${envPath}, using process.env`)
}

// Ensure PAYLOAD_SECRET is set
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in .env file')
  process.exit(1)
}

// Now dynamically import Payload after .env is loaded
const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function clearBenefitsData() {
  console.log('🧹 Clearing old benefits data to fix migration...')
  
  try {
    const payload = await getPayload({ config: config.default })
    
    // Get the HomePage global
    const homePage = await payload.findGlobal({
      slug: 'home-page',
    })
    
    // Clear the benefits array (set to empty array)
    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        whyChooseUsSection: {
          ...homePage.whyChooseUsSection,
          benefits: [],
        },
      },
    })
    
    console.log('✅ Cleared benefits data successfully!')
    console.log('📝 Now you can run the seed scripts again.')
    
  } catch (error: any) {
    console.error('❌ Error clearing benefits data:', error.message || error)
    throw error
  }
}

clearBenefitsData()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })



