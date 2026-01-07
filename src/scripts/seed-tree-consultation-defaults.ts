// Seed Tree Consultation Preview with default values
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

async function findMediaByFilename(payload: any, filename: string): Promise<string | null> {
  try {
    const result = await payload.find({
      collection: 'media',
      where: {
        filename: {
          contains: filename.replace(/\.[^/.]+$/, ''),
        },
      },
      limit: 10,
    })
    
    if (result.docs.length > 0) {
      return result.docs[0].id
    }
    return null
  } catch {
    return null
  }
}

async function seedTreeConsultationDefaults() {
  console.log('🌱 Seeding Tree Consultation Preview defaults...\n')
  
  const payload = await getPayload({ config: config.default })
  
  // Find olive-tree.jpg image
  console.log('📦 Looking for olive-tree.jpg...')
  const imageId = await findMediaByFilename(payload, 'olive-tree.jpg')
  
  if (!imageId) {
    console.log('⚠️  olive-tree.jpg not found in media collection')
    console.log('   Will set image later if available')
  } else {
    console.log(`✅ Found image: ID ${imageId}\n`)
  }
  
  // Get current HomePage
  console.log('📝 Fetching current HomePage...')
  const homePage = await payload.findGlobal({
    slug: 'home-page',
    depth: 0,
  })
  
  // Prepare update data - merge with existing to preserve other fields
  const updateData = {
    treeConsultationPreview: {
      enabled: homePage.treeConsultationPreview?.enabled ?? true,
      badgeText: homePage.treeConsultationPreview?.badgeText || 'Featured Service',
      headline: homePage.treeConsultationPreview?.headline || 'Custom Tree',
      headlineSecond: homePage.treeConsultationPreview?.headlineSecond || 'Solutions',
      description: homePage.treeConsultationPreview?.description || 'From concept to creation: trees tailored to your exact specifications.\n\nWhether you need a statement olive tree for your lobby, preserved botanicals for a restaurant, or a complete green wall installation, our team guides you through every decision. We match species, scale, and aesthetic to your space perfectly.',
      ctaText: homePage.treeConsultationPreview?.ctaText && homePage.treeConsultationPreview.ctaText !== 'Learn More' 
        ? homePage.treeConsultationPreview.ctaText 
        : 'Explore Tree Solutions',
      ctaLink: homePage.treeConsultationPreview?.ctaLink || '/tree-solutions',
      secondaryCtaText: homePage.treeConsultationPreview?.secondaryCtaText || 'View Collection',
      secondaryCtaLink: homePage.treeConsultationPreview?.secondaryCtaLink || '/collection',
      // Ensure all fields are set even if they're empty
      ...(homePage.treeConsultationPreview?.headline ? {} : { headline: 'Custom Tree' }),
      ...(homePage.treeConsultationPreview?.description ? {} : { description: 'From concept to creation: trees tailored to your exact specifications.\n\nWhether you need a statement olive tree for your lobby, preserved botanicals for a restaurant, or a complete green wall installation, our team guides you through every decision. We match species, scale, and aesthetic to your space perfectly.' }),
      backgroundImage: homePage.treeConsultationPreview?.backgroundImage || imageId || null,
      statNumber: homePage.treeConsultationPreview?.statNumber || '50+',
      statLabel: homePage.treeConsultationPreview?.statLabel || 'Tree species available',
    },
  }
  
  console.log('📝 Updating Tree Consultation Preview with defaults...')
  try {
    await payload.updateGlobal({
      slug: 'home-page',
      data: updateData,
    })
    
    console.log('\n✅ Tree Consultation Preview defaults set!')
    console.log('\n📋 Updated fields:')
    console.log(`   ✅ Badge Text: ${updateData.treeConsultationPreview.badgeText}`)
    console.log(`   ✅ Headline (First Line): ${updateData.treeConsultationPreview.headline}`)
    console.log(`   ✅ Headline (Second Line): ${updateData.treeConsultationPreview.headlineSecond}`)
    console.log(`   ✅ Description: ${updateData.treeConsultationPreview.description.substring(0, 50)}...`)
    console.log(`   ✅ Primary CTA: ${updateData.treeConsultationPreview.ctaText} → ${updateData.treeConsultationPreview.ctaLink}`)
    console.log(`   ✅ Secondary CTA: ${updateData.treeConsultationPreview.secondaryCtaText} → ${updateData.treeConsultationPreview.secondaryCtaLink}`)
    console.log(`   ✅ Stat: ${updateData.treeConsultationPreview.statNumber} ${updateData.treeConsultationPreview.statLabel}`)
    if (imageId) {
      console.log(`   ✅ Background Image: ID ${imageId}`)
    } else {
      console.log(`   ⚠️  Background Image: Not set (upload olive-tree.jpg first)`)
    }
    
    console.log('\n💡 Refresh the admin panel to see the updated values!')
  } catch (error: any) {
    console.error('❌ Error updating Tree Consultation Preview:', error.message || error)
    throw error
  }
}

seedTreeConsultationDefaults()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error:', error)
    process.exit(1)
  })

