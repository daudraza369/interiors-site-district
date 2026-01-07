// Safe seed script that checks if dev server is needed first
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

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in .env file')
  process.exit(1)
}

async function seedAllSectionsSafe() {
  console.log('🌱 Seeding ALL sections...\n')
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
    const { execSync } = await import('child_process')

    console.log('1️⃣  Seeding media files...')
    execSync('npm run seed:media', { stdio: 'inherit', cwd: rootDir })

    console.log('\n2️⃣  Seeding default images...')
    execSync('npm run seed:default-images', { stdio: 'inherit', cwd: rootDir })

    console.log('\n3️⃣  Seeding client logos...')
    execSync('npm run seed:client-logos', { stdio: 'inherit', cwd: rootDir })

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
    execSync('npm run seed:differentiation', { stdio: 'inherit', cwd: rootDir })

    console.log('\n✨ All sections seeded successfully!')
    console.log('📝 Refresh your frontend to see all sections.')

    process.exit(0)
  } catch (error: any) {
    if (error.message?.includes('no such column') || error.message?.includes('migration')) {
      console.error('\n❌ Migration error detected!')
      console.error('\n📝 FIX IT:')
      console.error('   1. Stop dev server (Ctrl+C)')
      console.error('   2. Run: npm run fix:migration')
      console.error('   3. Start dev server: npm run dev')
      console.error('   4. Accept migrations (type: yes)')
      console.error('   5. Run: npm run seed:all-sections again')
      process.exit(1)
    }
    console.error('\n❌ Error seeding data:', error.message || error)
    process.exit(1)
  }
}

seedAllSectionsSafe()

