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

// Mapping of filenames to their IDs (will be populated after finding media)
const mediaMap: Record<string, string> = {}

async function findMediaByFilename(payload: any, filename: string): Promise<string | null> {
  try {
    // Payload appends numbers to filenames to avoid duplicates (e.g., hero-interior-1.jpg)
    // Extract base filename without extension
    const baseName = filename.replace(/\.[^/.]+$/, '') // Remove extension
    const extension = filename.split('.').pop() || ''
    
    // Search for files that start with the base name and end with the extension
    // This will match: baseName.ext, baseName-1.ext, baseName-2.ext, etc.
    const pattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(-\\d+)?\\.${extension}$`, 'i')
    
    const result = await payload.find({
      collection: 'media',
      limit: 100,
    })
    
    // Find all matches
    const matches = result.docs.filter((doc: any) => 
      doc.filename && pattern.test(doc.filename)
    )
    
    if (matches.length === 0) {
      return null
    }
    
    // If multiple matches, get the one with the highest number (latest version)
    if (matches.length > 1) {
      matches.sort((a: any, b: any) => {
        const getNumber = (name: string) => {
          const match = name.match(/-(\d+)\./)
          return match ? parseInt(match[1], 10) : 0
        }
        return getNumber(b.filename) - getNumber(a.filename)
      })
    }
    
    return matches[0].id
  } catch (error) {
    console.error(`Error finding media ${filename}:`, error)
    return null
  }
}

async function seedDefaultImages() {
  console.log('🌱 Starting default images seed...')
  
  const payload = await getPayload({ config: config.default })
  
  // Debug: List all media files first
  console.log('\n📦 Listing all media files in database...')
  try {
    const allMedia = await payload.find({
      collection: 'media',
      limit: 100,
    })
    console.log(`Found ${allMedia.docs.length} media files:`)
    allMedia.docs.forEach((doc: any) => {
      console.log(`  - ID: ${doc.id}, Filename: ${doc.filename}, Alt: ${doc.alt}`)
    })
  } catch (error) {
    console.error('Error listing media:', error)
  }
  
  // Find all media files by filename
  console.log('\n📦 Finding specific media files...')
  const mediaFiles = [
    // Hero images
    { filename: 'hero-interior.jpg', key: 'hero-interior' },
    { filename: 'hotel-atrium.jpg', key: 'hotel-atrium' },
    { filename: 'restaurant-plants.jpg', key: 'restaurant-plants' },
    
    // Header logos
    { filename: 'district-brandmark.png', key: 'brandmark' },
    { filename: 'district-brandmark-night-green.png', key: 'brandmarkNightGreen' },
    { filename: 'district-brandmark-pear.png', key: 'brandmarkPear' },
    { filename: 'district-logo-lockup.png', key: 'logoLockup' },
    { filename: 'district-logo-lockup-night-green.png', key: 'logoLockupNightGreen' },
    
    // Footer logo
    { filename: 'district-logo.png', key: 'footerLogo' },
  ]
  
  for (const media of mediaFiles) {
    const mediaId = await findMediaByFilename(payload, media.filename)
    if (mediaId) {
      mediaMap[media.key] = mediaId
      console.log(`✅ Found: ${media.filename} (ID: ${mediaId})`)
    } else {
      console.log(`⚠️  Not found: ${media.filename}`)
    }
  }
  
  // Update Header Global
  console.log('\n📝 Updating Header Global...')
  try {
    const headerGlobal = await payload.findGlobal({
      slug: 'header',
    })
    
    const headerUpdate: any = {}
    
    if (mediaMap.brandmark) {
      headerUpdate.logos = {
        ...(headerGlobal.logos || {}),
        brandmark: mediaMap.brandmark,
      }
    }
    if (mediaMap.brandmarkNightGreen) {
      headerUpdate.logos = {
        ...headerUpdate.logos,
        brandmarkNightGreen: mediaMap.brandmarkNightGreen,
      }
    }
    if (mediaMap.brandmarkPear) {
      headerUpdate.logos = {
        ...headerUpdate.logos,
        brandmarkPear: mediaMap.brandmarkPear,
      }
    }
    if (mediaMap.logoLockup) {
      headerUpdate.logos = {
        ...headerUpdate.logos,
        logoLockup: mediaMap.logoLockup,
      }
    }
    if (mediaMap.logoLockupNightGreen) {
      headerUpdate.logos = {
        ...headerUpdate.logos,
        logoLockupNightGreen: mediaMap.logoLockupNightGreen,
      }
    }
    
    if (Object.keys(headerUpdate).length > 0) {
      await payload.updateGlobal({
        slug: 'header',
        data: headerUpdate,
      })
      console.log('✅ Header logos assigned!')
    } else {
      console.log('⚠️  No header logos to assign')
    }
  } catch (error: any) {
    console.error('❌ Error updating Header:', error.message || error)
  }
  
  // Update Footer Global
  console.log('\n📝 Updating Footer Global...')
  try {
    if (mediaMap.footerLogo) {
      await payload.updateGlobal({
        slug: 'footer',
        data: {
          logo: mediaMap.footerLogo,
        },
      })
      console.log('✅ Footer logo assigned!')
    } else {
      console.log('⚠️  Footer logo not found')
    }
  } catch (error: any) {
    console.error('❌ Error updating Footer:', error.message || error)
  }
  
  // Update HomePage Global - Hero Section
  console.log('\n📝 Updating HomePage Hero Section...')
  try {
    const homePageGlobal = await payload.findGlobal({
      slug: 'home-page',
    })
    
    // Get existing hero section or create default structure
    const existingSlides = homePageGlobal.heroSection?.slides || []
    
    // Hero images mapping
    const heroImages = [
      { filename: 'hero-interior.jpg', key: 'hero-interior' },
      { filename: 'hotel-atrium.jpg', key: 'hotel-atrium' },
      { filename: 'restaurant-plants.jpg', key: 'restaurant-plants' },
    ]
    
    const updatedSlides = heroImages.map((hero, index) => {
      const existingSlide = existingSlides[index] || {}
      const mediaId = mediaMap[hero.key]
      
      if (mediaId) {
        return {
          ...existingSlide,
          image: mediaId,
          // Keep existing text content or use defaults
          title: existingSlide.title || (index === 0 ? 'BEYOND DESIGN' : index === 1 ? 'CRAFTED ATMOSPHERE' : 'LIVING SPACES'),
          eyebrow: existingSlide.eyebrow || (index === 0 ? 'Premium Plantscaping for Modern Interiors' : index === 1 ? 'Bespoke Solutions for Hospitality & Corporate' : 'Custom Trees, Green Walls & Plantscaping'),
          subtitle: existingSlide.subtitle || (index === 0 ? 'From Vision to Reality' : index === 1 ? 'Strategic Biophilic Design' : 'Where Interiors Meet Nature'),
          description: existingSlide.description || (index === 0 ? 'We engineer environments that elevate human experience, productivity, and well-being through considered botanical design.' : index === 1 ? 'Every installation is a considered response to space, light, and the people who inhabit it.' : 'Bespoke greenery solutions for hospitality, corporate, and residential environments across the region.'),
        }
      }
      return existingSlide
    })
    
    // Only update if we have at least one image
    if (updatedSlides.some(slide => slide.image)) {
      await payload.updateGlobal({
        slug: 'home-page',
        data: {
          heroSection: {
            slides: updatedSlides,
          },
        },
      })
      console.log('✅ Hero section images assigned!')
      console.log(`   - Slide 1: ${mediaMap['hero-interior'] ? '✅' : '❌'}`)
      console.log(`   - Slide 2: ${mediaMap['hotel-atrium'] ? '✅' : '❌'}`)
      console.log(`   - Slide 3: ${mediaMap['restaurant-plants'] ? '✅' : '❌'}`)
    } else {
      console.log('⚠️  No hero images found to assign')
    }
  } catch (error: any) {
    console.error('❌ Error updating HomePage Hero Section:', error.message || error)
  }
  
  console.log('\n✨ Default images seed complete!')
  console.log('\n📋 Summary:')
  console.log(`   Header logos: ${Object.keys(mediaMap).filter(k => ['brandmark', 'brandmarkNightGreen', 'brandmarkPear', 'logoLockup', 'logoLockupNightGreen'].includes(k)).length}/5`)
  console.log(`   Footer logo: ${mediaMap.footerLogo ? '✅' : '❌'}`)
  console.log(`   Hero images: ${Object.keys(mediaMap).filter(k => ['hero-interior', 'hotel-atrium', 'restaurant-plants'].includes(k)).length}/3`)
}

// Run seed
seedDefaultImages()
  .then(() => {
    console.log('\n🎉 Default images seeding completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error seeding default images:', error)
    process.exit(1)
  })

