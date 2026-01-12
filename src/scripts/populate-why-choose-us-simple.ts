// Simple script to populate Why Choose Us using Payload API
// This will work if your dev server is running
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const rootDir = path.resolve(dirname, '../../')
const envPath = path.join(rootDir, '.env')

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

const defaultData = {
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
}

async function populateViaAPI() {
  console.log('🔄 Populating Why Choose Us Section via API...')
  console.log('⚠️  Make sure your dev server is running (npm run dev)')
  
  const baseURL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const apiURL = `${baseURL}/api/globals/home-page`
  
  try {
    // First, get the current global
    const getResponse = await fetch(apiURL)
    if (!getResponse.ok) {
      throw new Error(`Failed to fetch: ${getResponse.status} ${getResponse.statusText}`)
    }
    
    const currentData = await getResponse.json()
    
    // Check if benefits already exist
    const currentBenefits = currentData.whyChooseUsSection?.benefits || []
    if (currentBenefits.length > 0) {
      console.log(`ℹ️  Already has ${currentBenefits.length} benefits, skipping.`)
      process.exit(0)
    }
    
    // Update with defaults
    const updateResponse = await fetch(apiURL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        whyChooseUsSection: {
          ...(currentData.whyChooseUsSection || {}),
          ...defaultData,
        },
      }),
    })
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      throw new Error(`Failed to update: ${updateResponse.status} ${errorText}`)
    }
    
    console.log('✅ Why Choose Us Section populated successfully!')
    console.log(`   - Headline: ${defaultData.headline}`)
    console.log(`   - Benefits: ${defaultData.benefits.length} added`)
    console.log('\n📝 Refresh your admin panel to see the changes.')
    
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message || error)
    console.log('\n💡 Tip: Make sure your dev server is running: npm run dev')
    process.exit(1)
  }
}

populateViaAPI()



