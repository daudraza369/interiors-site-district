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

// Default admin credentials (you can change these)
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@districtinteriors.com'
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

async function seedAdmin() {
  console.log('👤 Seeding admin user...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Check if any users exist
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (existingUsers.totalDocs > 0) {
      console.log(`✅ Admin user already exists (${existingUsers.totalDocs} user(s) found)`)
      console.log('   Skipping admin creation.')
      return
    }

    // Create admin user
    console.log(`📧 Creating admin user with email: ${DEFAULT_ADMIN_EMAIL}`)
    
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: DEFAULT_ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD,
      },
    })

    console.log(`✅ Admin user created successfully!`)
    console.log(`   Email: ${DEFAULT_ADMIN_EMAIL}`)
    console.log(`   Password: ${DEFAULT_ADMIN_PASSWORD}`)
    console.log(`\n⚠️  IMPORTANT: Change this password after first login!`)
    console.log(`\n🔗 Login at: http://localhost:3003/admin`)
  } catch (error: any) {
    if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
      console.log('✅ Admin user already exists')
    } else {
      console.error('❌ Error creating admin user:', error.message)
      throw error
    }
  }
}

seedAdmin()
  .then(() => {
    console.log('\n✨ Admin seeding completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })




