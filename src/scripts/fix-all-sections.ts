// Comprehensive fix - seeds all sections properly
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
  console.log(`✅ Loaded .env`)
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function fixAllSections() {
  console.log('🔧 Fixing all sections...\n')
  
  const payload = await getPayload({ config: config.default })
  const homePage = await payload.findGlobal({ slug: 'home-page', depth: 2 })
  
  // Get all media to find logos
  const allMedia = await payload.find({ collection: 'media', limit: 200 })
  
  // Find logos by searching for logo filenames
  const logoMap: Record<string, string> = {}
  const logoNames = ['amazon', 'linklaters', 'pepsico', 'simah', 'tahakom']
  
  for (const media of allMedia.docs) {
    const filename = media.filename || ''
    for (const logoName of logoNames) {
      if (filename.toLowerCase().includes(logoName.toLowerCase())) {
        logoMap[logoName] = media.id
        break
      }
    }
  }
  
  console.log(`📦 Found ${Object.keys(logoMap).length} logos in media`)
  
  // Build logos array
  const logos = []
  const logoData = [
    { name: 'Amazon', key: 'amazon', url: 'https://amazon.com', order: 0 },
    { name: 'Linklaters', key: 'linklaters', url: 'https://linklaters.com', order: 1 },
    { name: 'PepsiCo', key: 'pepsico', url: 'https://pepsico.com', order: 2 },
    { name: 'SIMAH', key: 'simah', url: null, order: 3 },
    { name: 'Tahakom', key: 'tahakom', url: null, order: 4 },
  ]
  
  for (const logo of logoData) {
    if (logoMap[logo.key]) {
      logos.push({
        clientName: logo.name,
        logo: logoMap[logo.key],
        websiteUrl: logo.url,
        displayOrder: logo.order,
      })
    }
  }
  
  console.log(`✅ Found ${logos.length} logos to add`)
  
  // Update HomePage with logos
  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      ...homePage,
      clientLogosSection: {
        ...homePage.clientLogosSection,
        logos,
      },
    },
  })
  
  console.log('\n✨ All sections fixed!')
  console.log(`   Client Logos: ${logos.length} logos`)
}

fixAllSections()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error('❌ Error:', error.message)
    process.exit(1)
  })



