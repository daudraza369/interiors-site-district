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

async function verifyLogos() {
  console.log('🔍 Verifying client logos in database...\n')
  
  const payload = await getPayload({ config: config.default })
  
  // Get the HomePage global with depth 2 to populate logo relationships
  const homePage = await payload.findGlobal({
    slug: 'home-page',
    depth: 2,
  })
  
  const logos = homePage.clientLogosSection?.logos || []
  const maxLogos = homePage.clientLogosSection?.maxLogos || 10
  
  console.log(`📊 Client Logos Section Status:`)
  console.log(`   Enabled: ${homePage.clientLogosSection?.enabled}`)
  console.log(`   Max Logos: ${maxLogos}`)
  console.log(`   Total Logos in Array: ${logos.length}\n`)
  
  if (logos.length === 0) {
    console.log('❌ No logos found in HomePage global!')
    return
  }
  
  console.log('📋 Logos in Database (sorted by displayOrder):\n')
  
  const sortedLogos = [...logos].sort((a: any, b: any) => 
    (a.displayOrder || 0) - (b.displayOrder || 0)
  )
  
  sortedLogos.forEach((logo: any, index: number) => {
    const logoUrl = typeof logo.logo === 'object' && logo.logo?.url 
      ? logo.logo.url 
      : logo.logo 
        ? `Media ID: ${logo.logo}`
        : '❌ NO LOGO URL'
    
    console.log(`${index + 1}. ${logo.clientName}`)
    console.log(`   Display Order: ${logo.displayOrder || 0}`)
    console.log(`   Logo URL: ${logoUrl}`)
    console.log(`   Website: ${logo.websiteUrl || 'None'}`)
    console.log(`   Logo Object Type: ${typeof logo.logo}`)
    if (typeof logo.logo === 'object') {
      console.log(`   Logo ID: ${logo.logo?.id || 'N/A'}`)
      console.log(`   Logo Filename: ${logo.logo?.filename || 'N/A'}`)
    }
    console.log('')
  })
  
  // Check which logos will be displayed
  const displayLogos = sortedLogos.slice(0, maxLogos)
  console.log(`\n✅ Logos that WILL be displayed (first ${maxLogos}):`)
  displayLogos.forEach((logo: any, index: number) => {
    console.log(`   ${index + 1}. ${logo.clientName}`)
  })
  
  if (logos.length > maxLogos) {
    console.log(`\n⚠️  Warning: ${logos.length - maxLogos} logos will NOT be displayed (exceeds maxLogos limit)`)
    const hiddenLogos = sortedLogos.slice(maxLogos)
    hiddenLogos.forEach((logo: any) => {
      console.log(`   - ${logo.clientName} (displayOrder: ${logo.displayOrder || 0})`)
    })
  }
}

// Run verification
verifyLogos()
  .then(() => {
    console.log('\n✅ Verification complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error verifying logos:', error)
    process.exit(1)
  })

