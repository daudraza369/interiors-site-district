// Fix migration error and populate Why Choose Us
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

async function fixAndPopulate() {
  console.log('🔧 Fixing migration and populating Why Choose Us Section...')
  
  const dbPath = path.join(rootDir, 'district-interiors.db')
  const backupPath = path.join(rootDir, 'district-interiors.db.backup-migration-fix')
  
  // Step 1: Backup database if it exists
  if (fs.existsSync(dbPath)) {
    try {
      fs.copyFileSync(dbPath, backupPath)
      console.log('✅ Database backed up to district-interiors.db.backup-migration-fix')
    } catch (error: any) {
      console.log('⚠️  Could not backup database:', error.message)
    }
    
    // Delete database to fix migration issues
    try {
      fs.unlinkSync(dbPath)
      console.log('✅ Old database deleted - Payload will recreate it with correct schema')
    } catch (error: any) {
      if (error.code === 'EBUSY') {
        console.log('❌ Database is locked. Please stop your dev server (Ctrl+C) and run this script again.')
        process.exit(1)
      }
      throw error
    }
  }
  
  console.log('\n📝 Next steps:')
  console.log('   1. Restart your dev server: npm run dev')
  console.log('   2. Wait for Payload to recreate the database')
  console.log('   3. Run: npm run update:why-choose-us')
  console.log('\n   OR run this script again after the server has started to populate data automatically.')
  
  // Try to populate if server might be running
  console.log('\n🔄 Attempting to populate data...')
  await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
  
  try {
    const { getPayload } = await import('payload')
    const configModule = await import('@payload-config')
    const config = configModule.default
    
    const payload = await getPayload({ config })
    
    // Get the existing HomePage global
    const homePage = await payload.findGlobal({
      slug: 'home-page',
    })
    
    if (!homePage) {
      console.log('⚠️  HomePage global not found yet - database might still be initializing')
      console.log('   Run: npm run update:why-choose-us after the server has fully started')
      process.exit(0)
    }
    
    // Check if benefits already exist
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
      
      console.log('✅ Why Choose Us Section populated with default values!')
      console.log(`   - Headline: ${defaultData.headline}`)
      console.log(`   - Benefits: ${defaultData.benefits.length} added`)
    } else {
      console.log(`ℹ️  Why Choose Us Section already has ${currentBenefits.length} benefits`)
    }
    
    console.log('\n🎉 Done! Refresh your admin panel to see the changes.')
    process.exit(0)
  } catch (error: any) {
    console.log('⚠️  Could not populate automatically:', error.message?.substring(0, 100) || 'Unknown error')
    console.log('   This is OK - just run: npm run update:why-choose-us after your server starts')
    process.exit(0)
  }
}

fixAndPopulate()


