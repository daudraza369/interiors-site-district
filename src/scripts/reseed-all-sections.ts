// Reseed all sections that need data
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

// Ensure PAYLOAD_SECRET is set
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in .env file')
  process.exit(1)
}

async function reseedAllSections() {
  console.log('🌱 Reseeding all sections...\n')

  try {
    const { getPayload } = await import('payload')
    const configModule = await import('@payload-config')
    const config = configModule.default

    const payload = await getPayload({ config })

    // Get the HomePage global
    const homePage = await payload.findGlobal({
      slug: 'home-page',
    })

    if (!homePage) {
      console.log('❌ HomePage global not found')
      process.exit(1)
    }

    console.log('📋 Checking and populating sections...\n')

    // 1. Why Choose Us Section
    console.log('1️⃣  Why Choose Us Section...')
    const currentBenefits = homePage.whyChooseUsSection?.benefits || []
    if (currentBenefits.length === 0) {
      await payload.updateGlobal({
        slug: 'home-page',
        data: {
          whyChooseUsSection: {
            enabled: true,
            headline: 'Why Leaders Choose District',
            benefits: [
              {
                title: 'Dual Expertise',
                description: 'Mastery in both living plants and premium artificial greenery for any environment.',
                icon: 'Leaf',
              },
              {
                title: 'Bespoke Design',
                description: 'Every installation is custom-crafted to reflect your brand and spatial requirements.',
                icon: 'Palette',
              },
              {
                title: 'Sustainable Focus',
                description: 'Eco-conscious materials and practices that minimize environmental impact.',
                icon: 'Recycle',
              },
              {
                title: 'Premium Quality',
                description: 'Only the finest specimens and materials, backed by quality guarantees.',
                icon: 'Award',
              },
              {
                title: 'End-to-End Service',
                description: 'From concept to installation to ongoing care, we handle everything.',
                icon: 'Building2',
              },
            ],
          },
        },
      })
      console.log('   ✅ Populated with 5 benefits\n')
    } else {
      console.log(`   ⏭️  Already has ${currentBenefits.length} benefits\n`)
    }

    // 2. Our Approach Section (need to run seed script separately, but check here)
    console.log('2️⃣  Our Approach Section...')
    const approachPoints = homePage.ourApproachSection?.approachPoints || []
    if (approachPoints.length === 0) {
      console.log('   ⚠️  No approach points - run: npm run seed:our-approach\n')
    } else {
      console.log(`   ✅ Has ${approachPoints.length} approach points\n`)
    }

    // 3. Client Logos Section (need to run seed script separately)
    console.log('3️⃣  Client Logos Section...')
    const clientLogos = homePage.clientLogosSection?.logos || []
    if (clientLogos.length === 0) {
      console.log('   ⚠️  No client logos - run: npm run seed:client-logos\n')
    } else {
      console.log(`   ✅ Has ${clientLogos.length} client logos\n`)
    }

    // 4. Expert Quotes Section (need to run seed script separately)
    console.log('4️⃣  Expert Quotes Section...')
    const expertQuotes = homePage.expertQuotesSection?.quotes || []
    if (expertQuotes.length === 0) {
      console.log('   ⚠️  No expert quotes - run: npm run seed:expert-quotes\n')
    } else {
      console.log(`   ✅ Has ${expertQuotes.length} expert quotes\n`)
    }

    console.log('✨ Check complete!')
    console.log('\n📝 To populate missing sections, run:')
    console.log('   npm run seed:our-approach')
    console.log('   npm run seed:client-logos')
    console.log('   npm run seed:expert-quotes')

    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message || error)
    process.exit(1)
  }
}

reseedAllSections()



