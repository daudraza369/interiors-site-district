// Load environment variables FIRST
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
} else {
  dotenv.config()
  console.log(`⚠️  .env not found at ${envPath}, using process.env`)
}

// Ensure PAYLOAD_SECRET is set
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in .env file')
  process.exit(1)
}

const defaultData = {
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
}

async function updateWhyChooseUs() {
  console.log('🔄 Updating Why Choose Us Section with default values...')

  try {
    // Import Payload after .env is loaded
    const { getPayload } = await import('payload')
    const configModule = await import('@payload-config')
    const config = configModule.default
    
    // Try to get payload - if migration fails, we'll catch it
    let payload
    try {
      payload = await getPayload({ config })
    } catch (migrationError: any) {
      console.log('⚠️  Migration error detected, but continuing...')
      console.log('   Error:', migrationError.message?.substring(0, 100) || 'Unknown')
      // Try again - sometimes it works on second attempt
      payload = await getPayload({ config })
    }

    // Get the existing HomePage global
    const homePage = await payload.findGlobal({
      slug: 'home-page',
    })

    if (!homePage) {
      console.log('❌ HomePage global not found')
      process.exit(1)
    }

    // Update only the whyChooseUsSection - only if it's empty
    const currentBenefits = homePage.whyChooseUsSection?.benefits || []
    
    if (currentBenefits.length === 0) {
      await payload.updateGlobal({
        slug: 'home-page',
        data: {
          whyChooseUsSection: {
            enabled: true,
            headline: defaultData.headline,
            benefits: defaultData.benefits,
          },
        },
      })

      console.log('✅ Why Choose Us Section updated with default values!')
      console.log(`   - Headline: ${defaultData.headline}`)
      console.log(`   - Benefits: ${defaultData.benefits.length} added`)
    } else {
      console.log('ℹ️  Why Choose Us Section already has data, skipping update.')
      console.log(`   - Current benefits: ${currentBenefits.length}`)
    }
    
    console.log('📝 You can now edit the section in the admin panel.')
    
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error updating Why Choose Us Section:', error.message || error)
    process.exit(1)
  }
}

updateWhyChooseUs()

