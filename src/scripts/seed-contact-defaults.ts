// Seed Contact Section with default values
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

async function seedContactDefaults() {
  console.log('🌱 Seeding Contact Section defaults...\n')
  
  const payload = await getPayload({ config: config.default })
  
  // Get current HomePage
  console.log('📝 Fetching current HomePage...')
  const homePage = await payload.findGlobal({
    slug: 'home-page',
    depth: 0,
  })
  
  // Prepare update data
  const updateData = {
    contactSection: {
      enabled: homePage.contactSection?.enabled ?? true,
      badgeText: homePage.contactSection?.badgeText || 'Start Your Transformation',
      headline: homePage.contactSection?.headline || "Let's Create",
      headlineSecond: homePage.contactSection?.headlineSecond || 'Something Remarkable',
      subheadline: homePage.contactSection?.subheadline || "Every great space starts with a conversation. Tell us about your vision.",
      ctaText: homePage.contactSection?.ctaText || 'Request Consultation',
      contactInfo: {
        email: homePage.contactSection?.contactInfo?.email || 'Sales@district.sa',
        phone: homePage.contactSection?.contactInfo?.phone || '+966 056 228 8177',
        whatsapp: homePage.contactSection?.contactInfo?.whatsapp || '+966 50 060 6506',
        address: homePage.contactSection?.contactInfo?.address || 'Al Zoubair Ibn Al Awwam, Ar Rawabi, Riyadh 14214',
        googleMaps: homePage.contactSection?.contactInfo?.googleMaps || 'https://share.google/OwSIbmaVwv0vXcatO',
      },
      socialLinks: homePage.contactSection?.socialLinks && homePage.contactSection.socialLinks.length > 0
        ? homePage.contactSection.socialLinks
        : [
            { label: 'Instagram', href: 'https://www.instagram.com/districtflora', abbr: 'IG' },
            { label: 'TikTok', href: 'https://www.tiktok.com/@districtflora', abbr: 'TT' },
            { label: 'Snapchat', href: '#', abbr: 'SC' },
          ],
      projectTypes: homePage.contactSection?.projectTypes && homePage.contactSection.projectTypes.length > 0
        ? homePage.contactSection.projectTypes
        : [
            { type: 'Corporate Office' },
            { type: 'Hotel / Hospitality' },
            { type: 'Restaurant / F&B' },
            { type: 'Retail Space' },
            { type: 'Private Residence' },
            { type: 'Healthcare Facility' },
            { type: 'Other' },
          ],
    },
  }
  
  console.log('📝 Updating Contact Section with defaults...')
  try {
    await payload.updateGlobal({
      slug: 'home-page',
      data: updateData,
    })
    
    console.log('\n✅ Contact Section defaults set!')
    console.log('\n📋 Updated fields:')
    console.log(`   ✅ Badge Text: ${updateData.contactSection.badgeText}`)
    console.log(`   ✅ Headline: ${updateData.contactSection.headline} ${updateData.contactSection.headlineSecond}`)
    console.log(`   ✅ Subheadline: ${updateData.contactSection.subheadline.substring(0, 50)}...`)
    console.log(`   ✅ CTA Text: ${updateData.contactSection.ctaText}`)
    console.log(`   ✅ Contact Info:`)
    console.log(`      - Email: ${updateData.contactSection.contactInfo.email}`)
    console.log(`      - Phone: ${updateData.contactSection.contactInfo.phone}`)
    console.log(`      - WhatsApp: ${updateData.contactSection.contactInfo.whatsapp}`)
    console.log(`      - Address: ${updateData.contactSection.contactInfo.address.substring(0, 40)}...`)
    console.log(`   ✅ Social Links: ${updateData.contactSection.socialLinks.length} links`)
    console.log(`   ✅ Project Types: ${updateData.contactSection.projectTypes.length} types`)
    
    console.log('\n💡 Refresh the admin panel to see the updated values!')
  } catch (error: any) {
    console.error('❌ Error updating Contact Section:', error.message || error)
    throw error
  }
}

seedContactDefaults()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error:', error)
    process.exit(1)
  })


