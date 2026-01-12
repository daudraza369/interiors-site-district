// Seed Hero Section - adds default hero slides
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
    const baseName = filename.replace(/\.[^/.]+$/, '')
    const pattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(-\\d+)?\\.`, 'i')
    
    const result = await payload.find({ collection: 'media', limit: 200 })
    
    const matches = result.docs.filter((doc: any) => 
      doc.filename && pattern.test(doc.filename)
    )
    
    if (matches.length === 0) return null
    
    matches.sort((a: any, b: any) => {
      const numA = parseInt((a.filename.match(/-(\d+)\./) || [0, 0])[1])
      const numB = parseInt((b.filename.match(/-(\d+)\./) || [0, 0])[1])
      return numB - numA
    })
    
    return matches[0].id
  } catch {
    return null
  }
}

const heroSlidesData = [
  {
    imageFilename: 'hero-interior.jpg',
    title: 'BEYOND DESIGN',
    eyebrow: 'Premium Plantscaping for Modern Interiors',
    subtitle: 'From Vision to Reality',
    description: 'We engineer environments that elevate human experience, productivity, and well-being through considered botanical design.',
  },
  {
    imageFilename: 'hotel-atrium.jpg',
    title: 'CRAFTED ATMOSPHERE',
    eyebrow: 'Bespoke Solutions for Hospitality & Corporate',
    subtitle: 'Strategic Biophilic Design',
    description: 'Every installation is a considered response to space, light, and the people who inhabit it.',
  },
  {
    imageFilename: 'restaurant-plants.jpg',
    title: 'LIVING SPACES',
    eyebrow: 'Custom Trees, Green Walls & Plantscaping',
    subtitle: 'Where Interiors Meet Nature',
    description: 'Bespoke greenery solutions for hospitality, corporate, and residential environments across the region.',
  },
]

async function seedHero() {
  console.log('🌱 Starting hero section seed...\n')
  
  try {
    const payload = await getPayload({ config: config.default })
    const homePage = await payload.findGlobal({ slug: 'home-page', depth: 2 })
    
    const existingSlides = homePage.heroSection?.slides || []
    
    // Check if we have all default slides (by title)
    const existingTitles = new Set(existingSlides.map((s: any) => s.title))
    const defaultTitles = new Set(heroSlidesData.map(s => s.title))
    const hasAllDefaults = defaultTitles.size > 0 && [...defaultTitles].every(title => existingTitles.has(title))
    
    if (hasAllDefaults && existingSlides.length >= heroSlidesData.length) {
      console.log(`ℹ️  All default hero slides already exist (${existingSlides.length} slides)`)
      console.log('   Skipping seed - default slides are already in HomePage global')
      process.exit(0)
    }

    // If we have some but not all, we'll add the missing ones
    if (existingSlides.length > 0) {
      console.log(`ℹ️  Found ${existingSlides.length} existing slides, adding missing defaults...`)
    }
    
    // Build slides with images
    // Start with existing slides that aren't in our defaults
    const existingTitles = new Set(existingSlides.map((s: any) => s.title))
    const slidesWithImages: any[] = [...existingSlides]
    
    for (const slideData of heroSlidesData) {
      // Skip if this slide already exists
      if (existingTitles.has(slideData.title)) {
        console.log(`ℹ️  Skipping existing slide: ${slideData.title}`)
        continue
      }

      const imageId = await findMediaByFilename(payload, slideData.imageFilename)
      
      if (!imageId) {
        console.log(`⚠️  Image not found: ${slideData.imageFilename} for slide "${slideData.title}"`)
        console.log(`   Run: npm run seed:media first`)
        continue
      }
      
      slidesWithImages.push({
        image: imageId,
        title: slideData.title,
        eyebrow: slideData.eyebrow,
        subtitle: slideData.subtitle,
        description: slideData.description,
      })
      
      console.log(`✅ Added slide: ${slideData.title}`)
    }
    
    if (slidesWithImages.length === 0) {
      console.log('⚠️  No slides could be added - images not found')
      console.log('   Run: npm run seed:media first')
      process.exit(1)
    }
    
    // STEP 1: Fix invalid portfolio hero images FIRST (separate update)
    // This prevents validation errors when updating hero section
    console.log('\n🔧 Step 1: Fixing invalid portfolio hero images...')
    const existingProjects = homePage.portfolioSection?.projects || []
    const portfolioImageMap: Record<string, string> = {
      'Modern Corporate Lobby': 'portfolio-corporate-lobby.jpg',
      'Fine Dining Restaurant': 'portfolio-restaurant.jpg',
      'Private Villa Garden': 'portfolio-villa.jpg',
      'Co-Working Space': 'portfolio-coworking.jpg',
    }
    
    // Fetch WITHOUT depth to get raw IDs, not populated objects
    const homePageRaw = await payload.findGlobal({ slug: 'home-page', depth: 0 })
    const rawProjects = homePageRaw.portfolioSection?.projects || []
    
    const fixedProjects: any[] = []
    let needsPortfolioFix = false
    
    for (const project of rawProjects) {
      let heroImageId: any = project.heroImage
      
      // Extract ID if it's an object (shouldn't happen with depth: 0, but be safe)
      if (typeof heroImageId === 'object' && heroImageId) {
        heroImageId = heroImageId.id || heroImageId
      }
      
      // Validate the image ID exists
      let isValid = false
      if (heroImageId && typeof heroImageId === 'number' && heroImageId > 0) {
        try {
          await payload.findByID({ collection: 'media', id: heroImageId })
          isValid = true
        } catch {
          isValid = false
        }
      }
      
      // If invalid, find correct image
      if (!isValid) {
        if (project.title && portfolioImageMap[project.title]) {
          const foundId = await findMediaByFilename(payload, portfolioImageMap[project.title])
          if (foundId) {
            heroImageId = foundId
            isValid = true
            needsPortfolioFix = true
            console.log(`   ✅ Fixed hero image for: ${project.title}`)
          }
        }
        
        if (!isValid) {
          console.log(`   ⚠️  Removing project without valid hero image: ${project.title || 'Untitled'}`)
          needsPortfolioFix = true
          continue // Skip this project
        }
      }
      
      // Only include projects with valid hero images
      if (isValid && heroImageId) {
        fixedProjects.push({
          ...project,
          heroImage: heroImageId, // Ensure it's just the ID, not an object
        })
      }
    }
    
    // STEP 2: Update portfolio section FIRST if needed (separate update)
    if (needsPortfolioFix || fixedProjects.length !== rawProjects.length) {
      console.log(`   📝 Updating portfolio section first...`)
      await payload.updateGlobal({
        slug: 'home-page',
        data: {
          portfolioSection: {
            ...homePageRaw.portfolioSection,
            projects: fixedProjects,
          },
        },
      })
      console.log(`   ✅ Portfolio fixed: ${fixedProjects.length} valid projects`)
    } else {
      console.log(`   ✅ Portfolio projects are valid`)
    }
    
    // STEP 3: Now update hero section (portfolio is already fixed)
    console.log(`\n📝 Step 2: Updating hero section...`)
    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        heroSection: {
          slides: slidesWithImages,
        },
      },
    })
    
    console.log(`\n✨ Seed complete!`)
    console.log(`   ✅ Added ${slidesWithImages.length} hero slides`)
    if (needsPortfolioFix || fixedProjects.length !== rawProjects.length) {
      console.log(`   ✅ Fixed portfolio: ${rawProjects.length - fixedProjects.length} invalid projects removed`)
    }
    
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error seeding hero:', error.message || error)
    process.exit(1)
  }
}

seedHero()

