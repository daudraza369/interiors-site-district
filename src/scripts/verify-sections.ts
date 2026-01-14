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

async function verifySections() {
  console.log('🔍 Verifying sections data...\n')
  
  const payload = await getPayload({ config: config.default })
  
  const homePage = await payload.findGlobal({
    slug: 'home-page',
    depth: 2,
  })
  
  console.log('📊 Section Status:')
  console.log(`   Hero Section (slides): ${homePage.heroSection?.slides?.length || 0} slides`)
  console.log(`   Client Logos: ${homePage.clientLogosSection?.logos?.length || 0} logos`)
  console.log(`   Expert Quotes: ${homePage.expertQuotesCarousel?.quotes?.length || 0} quotes`)
  console.log(`   Our Approach: ${homePage.ourApproachSection?.approachPoints?.length || 0} points`)
  console.log(`   Why Choose Us: ${homePage.whyChooseUsSection?.benefits?.length || 0} benefits`)
  console.log(`   Stats: ${homePage.statsSection?.stats?.length || 0} stats`)
  console.log(`   Portfolio: ${homePage.portfolioSection?.projects?.length || 0} projects`)
  console.log(`   Differentiation: ${homePage.differentiationSection?.comparisonPoints?.length || 0} points`)
  
  process.exit(0)
}

verifySections()
  .catch((error: any) => {
    console.error('❌ Error:', error.message)
    process.exit(1)
  })





