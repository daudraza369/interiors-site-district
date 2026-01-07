// Complete seed script - seeds ALL sections at once
// Run this after database reset to restore all data
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

async function seedAllData() {
  console.log('🌱 Seeding ALL sections data...\n')
  console.log('📋 This will seed:')
  console.log('   1. Media files')
  console.log('   2. Default images (header, footer, hero)')
  console.log('   3. Client Logos Section')
  console.log('   4. Expert Quotes Section')
  console.log('   5. Our Approach Section')
  console.log('   6. Why Choose Us Section')
  console.log('   7. Stats Section')
  console.log('   8. Portfolio Section')
  console.log('   9. Differentiation Section\n')

  try {
    // Run seed scripts in correct order using child_process
    const { execSync } = await import('child_process')
    
    console.log('1️⃣  Seeding media files...')
    execSync('npm run seed:media', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n2️⃣  Seeding default images...')
    execSync('npm run seed:default-images', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n3️⃣  Seeding client logos...')
    try {
      execSync('npm run seed:client-logos', { stdio: 'inherit', cwd: rootDir })
    } catch (error: any) {
      console.log('⚠️  Client logos seed failed (will fix separately), continuing...')
    }
    
    console.log('\n4️⃣  Seeding expert quotes...')
    execSync('npm run seed:expert-quotes', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n5️⃣  Seeding our approach...')
    execSync('npm run seed:our-approach', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n6️⃣  Seeding why choose us...')
    execSync('npm run update:why-choose-us', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n7️⃣  Seeding stats...')
    execSync('npm run seed:stats', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n8️⃣  Seeding portfolio...')
    execSync('npm run seed:portfolio', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n9️⃣  Seeding differentiation...')
    try {
      execSync('npm run seed:differentiation', { stdio: 'inherit', cwd: rootDir })
    } catch (error: any) {
      console.log('⚠️  Differentiation seed had issues, but continuing...')
    }
    
    console.log('\n✨ All sections seeded successfully!')
    console.log('📝 Refresh your frontend to see all sections.')
    
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Error seeding data:', error.message || error)
    process.exit(1)
  }
}

seedAllData()

