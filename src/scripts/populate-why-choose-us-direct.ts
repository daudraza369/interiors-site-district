// Direct database update to populate Why Choose Us defaults
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'
import Database from 'better-sqlite3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const rootDir = path.resolve(dirname, '../../')
const envPath = path.join(rootDir, '.env')

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
  console.log(`✅ Loaded .env from: ${envPath}`)
}

async function populateWhyChooseUs() {
  console.log('🔄 Populating Why Choose Us Section with default values...')
  
  const dbPath = path.join(rootDir, 'district-interiors.db')
  
  if (!fs.existsSync(dbPath)) {
    console.log('❌ Database file not found')
    process.exit(1)
  }
  
  try {
    const db = new Database(dbPath)
    
    // Get the current HomePage JSON
    const homePageRow = db.prepare('SELECT value FROM _globals WHERE key = ?').get('home-page') as any
    if (!homePageRow) {
      console.log('❌ HomePage global not found')
      db.close()
      process.exit(1)
    }
    
    const homePage = JSON.parse(homePageRow.value)
    
    // Check if benefits already exist
    const currentBenefits = homePage.whyChooseUsSection?.benefits || []
    
    if (currentBenefits.length > 0) {
      console.log(`ℹ️  Why Choose Us Section already has ${currentBenefits.length} benefits, skipping.`)
      db.close()
      process.exit(0)
    }
    
    // Set default values
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
    
    // Update the HomePage
    homePage.whyChooseUsSection = {
      ...(homePage.whyChooseUsSection || {}),
      ...defaultData,
    }
    
    // Save back to database
    db.prepare('UPDATE _globals SET value = ? WHERE key = ?').run(
      JSON.stringify(homePage),
      'home-page'
    )
    
    db.close()
    
    console.log('✅ Why Choose Us Section populated with default values!')
    console.log(`   - Headline: ${defaultData.headline}`)
    console.log(`   - Benefits: ${defaultData.benefits.length} added`)
    console.log('\n📝 Refresh your admin panel to see the changes.')
    
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message || error)
    process.exit(1)
  }
}

populateWhyChooseUs()



