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
  console.log(`✅ Loaded .env`)
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

async function seedTestimonialsSectionDefaults() {
  console.log('🌱 Seeding Testimonials Section defaults...\n')

  const payload = await getPayload({ config: config.default })

  // Get current HomePage
  console.log('📝 Fetching current HomePage...')
  const homePage = await payload.findGlobal({
    slug: 'home-page',
    depth: 0,
  })

  // Prepare update data - merge with existing to preserve other fields
  const updateData = {
    testimonialsSection: {
      enabled: homePage.testimonialsSection?.enabled ?? true,
      headline: homePage.testimonialsSection?.headline || 'Trusted By Industry Leaders',
      subheadline: homePage.testimonialsSection?.subheadline || "What our clients say about working with District",
      maxTestimonials: homePage.testimonialsSection?.maxTestimonials || 5,
    },
  }

  // Update the HomePage global
  console.log('📝 Updating Testimonials Section with defaults...')
  try {
    await payload.updateGlobal({
      slug: 'home-page',
      data: updateData,
    })
    console.log(`✅ Testimonials Section defaults set!`)
    console.log('\n📋 Updated fields:')
    console.log(`   ✅ Headline: ${updateData.testimonialsSection.headline}`)
    console.log(`   ✅ Subheadline: ${updateData.testimonialsSection.subheadline}`)
    console.log(`   ✅ Max Testimonials: ${updateData.testimonialsSection.maxTestimonials}`)
    console.log(`   ✅ Enabled: ${updateData.testimonialsSection.enabled}`)
    console.log('\n💡 Refresh the admin panel to see the updated values!')
  } catch (error: any) {
    console.error('❌ Error updating Testimonials Section defaults:', error.message || error)
    process.exit(1)
  }

  console.log('\n✨ Done!')
}

seedTestimonialsSectionDefaults()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))


