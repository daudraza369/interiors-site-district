// Auto-reseed script that runs after database recreation
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

async function autoReseed() {
  console.log('🌱 Auto-reseeding database...\n')
  
  try {
    const payload = await getPayload({ config: config.default })
    
    // Check if media exists
    const mediaCount = await payload.count({ collection: 'media' })
    console.log(`📦 Current media count: ${mediaCount.totalDocs}`)
    
    // Check if admin exists
    const userCount = await payload.count({ collection: 'users' })
    if (userCount.totalDocs === 0) {
      console.log('👤 Seeding admin user...')
      const { execSync } = await import('child_process')
      execSync('npm run seed:admin', { stdio: 'inherit', cwd: rootDir, env: { ...process.env } })
    }

    if (mediaCount.totalDocs === 0) {
      console.log('📤 Seeding media...')
      const { execSync } = await import('child_process')
      execSync('npm run seed:media', { stdio: 'inherit', cwd: rootDir, env: { ...process.env } })
      
      console.log('🖼️  Setting default images...')
      execSync('npm run seed:default-images', { stdio: 'inherit', cwd: rootDir, env: { ...process.env } })
      
      console.log('🏢 Seeding client logos...')
      execSync('npm run seed:client-logos', { stdio: 'inherit', cwd: rootDir, env: { ...process.env } })
      
      console.log('💬 Seeding expert quotes...')
      execSync('npm run seed:expert-quotes', { stdio: 'inherit', cwd: rootDir, env: { ...process.env } })
      
      console.log('\n✅ Auto-reseed completed!')
    } else {
      // Check if client logos exist in HomePage
      const homePage = await payload.findGlobal({ slug: 'home-page', depth: 0 })
      const logoCount = homePage.clientLogosSection?.logos?.length || 0
      console.log(`📦 Current client logos count: ${logoCount}`)
      
      if (logoCount === 0) {
        console.log('🏢 Seeding client logos...')
        const { execSync } = await import('child_process')
        execSync('npm run seed:client-logos', { stdio: 'inherit', cwd: rootDir, env: { ...process.env } })
        console.log('✅ Client logos seeded!')
      } else {
        console.log('✅ Database already has data - skipping reseed')
      }
    }
  } catch (error: any) {
    console.error('❌ Error during auto-reseed:', error.message)
    console.log('\n💡 You can manually run:')
    console.log('   npm run seed:media')
    console.log('   npm run seed:default-images')
    console.log('   npm run seed:client-logos')
  }
}

autoReseed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

