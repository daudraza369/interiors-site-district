// Production seed script - seeds ALL essential data for live site
// Run this via Coolify terminal: pnpm run seed:production
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

async function seedProduction() {
  console.log('🚀 Seeding production site with ALL essential data...\n')
  console.log('📋 This will seed:')
  console.log('   1. Admin user (if not exists)')
  console.log('   2. Media files')
  console.log('   3. Default images (header, footer, hero)')
  console.log('   4. Client Logos Section')
  console.log('   5. Expert Quotes Section')
  console.log('   6. Our Approach Section')
  console.log('   7. Why Choose Us Section')
  console.log('   8. Stats Section')
  console.log('   9. Portfolio Section')
  console.log('   10. Differentiation Section')
  console.log('   11. Testimonials')
  console.log('   12. Virtual Showrooms')
  console.log('   13. Services')
  console.log('   14. All page defaults\n')

  try {
    const { execSync } = await import('child_process')
    
    console.log('1️⃣  Seeding admin user...')
    try {
      execSync('pnpm run seed:admin', { stdio: 'inherit', cwd: rootDir })
    } catch (error: any) {
      console.log('⚠️  Admin user may already exist, continuing...')
    }
    
    console.log('\n2️⃣  Seeding media files...')
    execSync('pnpm run seed:media', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n3️⃣  Seeding default images...')
    execSync('pnpm run seed:default-images', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n4️⃣  Seeding client logos...')
    execSync('pnpm run seed:client-logos', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n5️⃣  Seeding expert quotes...')
    execSync('pnpm run seed:expert-quotes', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n6️⃣  Seeding our approach...')
    execSync('pnpm run seed:our-approach', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n7️⃣  Seeding why choose us...')
    execSync('pnpm run populate:why-choose-us', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n8️⃣  Seeding stats...')
    execSync('pnpm run seed:stats', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n9️⃣  Seeding portfolio...')
    execSync('pnpm run seed:portfolio', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n🔟 Seeding differentiation...')
    execSync('pnpm run seed:differentiation', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n1️⃣1️⃣  Seeding testimonials...')
    execSync('pnpm run seed:testimonials', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n1️⃣2️⃣  Seeding virtual showrooms...')
    execSync('pnpm run seed:virtual-showrooms', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n1️⃣3️⃣  Seeding services...')
    execSync('pnpm run seed:services', { stdio: 'inherit', cwd: rootDir })
    
    console.log('\n1️⃣4️⃣  Seeding page defaults...')
    try {
      execSync('pnpm run seed:services-page-defaults', { stdio: 'inherit', cwd: rootDir })
      execSync('pnpm run seed:projects-page-defaults', { stdio: 'inherit', cwd: rootDir })
      execSync('pnpm run seed:contact-defaults', { stdio: 'inherit', cwd: rootDir })
      execSync('pnpm run seed:about-page-defaults', { stdio: 'inherit', cwd: rootDir })
      execSync('pnpm run seed:collection-page-defaults', { stdio: 'inherit', cwd: rootDir })
      execSync('pnpm run seed:flowers-page-defaults', { stdio: 'inherit', cwd: rootDir })
      execSync('pnpm run seed:tree-solutions-page-defaults', { stdio: 'inherit', cwd: rootDir })
      execSync('pnpm run seed:styling-page-defaults', { stdio: 'inherit', cwd: rootDir })
    } catch (error: any) {
      console.log('⚠️  Some page defaults may have failed, but continuing...')
    }
    
    console.log('\n✨ All production data seeded successfully!')
    console.log('📝 Refresh your frontend to see all sections.')
    console.log('🔗 Admin panel: /admin')
    
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Error seeding production data:', error.message || error)
    console.error('\n💡 Tip: Check that all environment variables are set correctly.')
    process.exit(1)
  }
}

seedProduction()



