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

// Client logos data
const clientLogosData = [
  { name: 'Amazon', filename: 'logos/amazon.png', websiteUrl: 'https://amazon.com', displayOrder: 0 },
  { name: 'Linklaters', filename: 'logos/linklaters.png', websiteUrl: 'https://linklaters.com', displayOrder: 1 },
  { name: 'PepsiCo', filename: 'logos/pepsico.png', websiteUrl: 'https://pepsico.com', displayOrder: 2 },
  { name: 'SIMAH', filename: 'logos/simah.png', websiteUrl: null, displayOrder: 3 },
  { name: 'Tahakom', filename: 'logos/tahakom.svg', websiteUrl: null, displayOrder: 4 },
]

async function findMediaByFilename(payload: any, filename: string): Promise<string | null> {
  try {
    // Payload stores just the filename, not the path (e.g., "logos/amazon.png" -> "amazon.png")
    const justFilename = filename.includes('/') ? filename.split('/').pop()! : filename
    
    // Payload appends numbers to filenames to avoid duplicates
    const baseName = justFilename.replace(/\.[^/.]+$/, '')
    const extension = justFilename.split('.').pop() || ''
    const pattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(-\\d+)?\\.${extension}$`, 'i')
    
    const result = await payload.find({
      collection: 'media',
      limit: 200,
    })
    
    const matches = result.docs.filter((doc: any) => 
      doc.filename && pattern.test(doc.filename)
    )
    
    if (matches.length === 0) {
      return null
    }
    
    // Get the one with the highest number (latest version)
    if (matches.length > 1) {
      matches.sort((a: any, b: any) => {
        const getNumber = (name: string) => {
          const match = name.match(/-(\d+)\./)
          return match ? parseInt(match[1], 10) : 0
        }
        return getNumber(b.filename) - getNumber(a.filename)
      })
    }
    
    return matches[0].id
  } catch (error) {
    console.error(`Error finding media ${filename}:`, error)
    return null
  }
}

async function seedClientLogos() {
  console.log('🌱 Starting client logos seed...')
  
  const payload = await getPayload({ config: config.default })
  
  // Get the HomePage global
  const homePage = await payload.findGlobal({
    slug: 'home-page',
  })
  
  // Clear invalid image references first - set hero slides and portfolio to empty arrays
  try {
    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        heroSection: {
          ...homePage.heroSection,
          heroSlides: [],
        },
        portfolioSection: {
          ...homePage.portfolioSection,
          projects: [],
        },
      },
    })
  } catch (e: any) {
    console.log('⚠️  Could not clear invalid refs, continuing anyway...')
  }
  
  // Get existing logos from the global (refresh after fix)
  const refreshedHomePage = await payload.findGlobal({
    slug: 'home-page',
  })
  const existingLogos = refreshedHomePage.clientLogosSection?.logos || []
  
  // Build new logos array
  const newLogos: any[] = []
  let createdCount = 0
  let skippedCount = 0
  
  for (const clientData of clientLogosData) {
    // Find the logo media file first
    const logoMediaId = await findMediaByFilename(payload, clientData.filename)
    
    if (!logoMediaId) {
      console.log(`⚠️  Logo not found: ${clientData.filename} - Skipping ${clientData.name}`)
      skippedCount++
      continue
    }
    
    // Check if client logo already exists in the global
    const existing = existingLogos.find((logo: any) => 
      logo.clientName === clientData.name
    )
    
    if (existing) {
      // Update existing with correct logo ID
      newLogos.push({
        ...existing,
        logo: logoMediaId,
      })
      createdCount++
      continue
    }
    
    // Add new logo to array
    newLogos.push({
      clientName: clientData.name,
      logo: logoMediaId,
      websiteUrl: clientData.websiteUrl,
      displayOrder: clientData.displayOrder,
    })
    
    console.log(`✅ Added: ${clientData.name} (Logo ID: ${logoMediaId})`)
    createdCount++
  }
  
  // Update the HomePage global with all logos
  try {
    const updatedHomePage = await payload.findGlobal({
      slug: 'home-page',
    })
    
    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        ...updatedHomePage,
        clientLogosSection: {
          ...updatedHomePage.clientLogosSection,
          logos: newLogos,
        },
      },
    })
    
    console.log(`\n✨ Seed complete!`)
    console.log(`   ✅ Added: ${createdCount}`)
    console.log(`   ⏭️  Skipped: ${skippedCount}`)
    console.log(`   📦 Total: ${newLogos.length} logos in global`)
  } catch (error: any) {
    console.error(`❌ Error updating HomePage global:`, error.message || error)
    process.exit(1)
  }
}

// Run seed
seedClientLogos()
  .then(() => {
    console.log('\n🎉 Client logos seeding completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error seeding client logos:', error)
    process.exit(1)
  })

