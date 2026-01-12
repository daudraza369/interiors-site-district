// Ensure default content is always present in HomePage global
// This script ensures portfolio projects and hero slides have default content
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

const { getPayload } = await import('payload')
const config = await import('@payload-config')

// Default portfolio projects
const defaultPortfolioProjects = [
  {
    title: 'Modern Corporate Lobby',
    description: 'Custom planters, preserved wall, and focal tree installation.',
    projectType: 'Offices',
    displayOrder: 0,
    imageFilename: 'portfolio-corporate-lobby.jpg',
  },
  {
    title: 'Fine Dining Restaurant',
    description: 'Living green wall with preserved moss accents.',
    projectType: 'F&B',
    displayOrder: 1,
    imageFilename: 'portfolio-restaurant.jpg',
  },
  {
    title: 'Private Villa Garden',
    description: 'Custom olive trees and Mediterranean plantscaping.',
    projectType: 'Private Villa',
    displayOrder: 2,
    imageFilename: 'portfolio-villa.jpg',
  },
  {
    title: 'Co-Working Space',
    description: 'Biophilic design with desk planters and partition walls.',
    projectType: 'Offices',
    displayOrder: 3,
    imageFilename: 'portfolio-coworking.jpg',
  },
]

// Default hero slides
const defaultHeroSlides = [
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

async function findMediaByFilename(payload: any, filename: string): Promise<string | null> {
  try {
    const baseName = filename.replace(/\.[^/.]+$/, '')
    const pattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(-\\d+)?\\.`, 'i')
    
    // Try to query media - may fail if database schema is out of sync
    let result
    try {
      result = await payload.find({ collection: 'media', limit: 200 })
    } catch (dbError: any) {
      // Database schema mismatch - return null so we can continue without images
      console.log(`      ⚠️  Database schema issue - cannot query media collection`)
      return null
    }
    
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
  } catch (error: any) {
    // Any other error - return null
    return null
  }
}

async function ensureDefaults() {
  console.log('🌱 Ensuring default content in HomePage global...\n')

  try {
    const payload = await getPayload({ config: config.default })
    
    // First, check if any portfolio images exist in media collection
    console.log('🔍 Checking for portfolio images in media collection...')
    let hasPortfolioImages = false
    let mediaFilenames: string[] = []
    
    try {
      const mediaResult = await payload.find({ collection: 'media', limit: 100 })
      mediaFilenames = mediaResult.docs.map((doc: any) => doc.filename || '').filter(Boolean)
      hasPortfolioImages = defaultPortfolioProjects.some(project => 
        mediaFilenames.some((filename: string) => filename.includes(project.imageFilename.replace('.jpg', '')))
      )
      
      if (!hasPortfolioImages) {
        console.log('   ⚠️  No portfolio images found in media collection')
        console.log('   💡 Run "npm run seed:media" first to upload portfolio images')
        console.log('   📝 Projects will be created without images - you can add them in admin later\n')
      } else {
        console.log('   ✅ Portfolio images found in media collection\n')
      }
    } catch (error: any) {
      console.log('   ⚠️  Error querying media collection (database schema may need migration)')
      console.log('   💡 This might be a database schema mismatch. Try:')
      console.log('      1. Restart the dev server to trigger auto-migration')
      console.log('      2. Or run: npm run payload migrate')
      console.log('   📝 Continuing anyway - projects will be created without images\n')
      // Continue anyway - we'll try to find images later
    }
    
    const homePage = await payload.findGlobal({ slug: 'home-page', depth: 0 })

    let needsUpdate = false
    const updateData: any = {}

    // Check and ensure portfolio projects
    const existingProjects = homePage.portfolioSection?.projects || []
    const existingProjectTitles = new Set(existingProjects.map((p: any) => p.title || '').filter(Boolean))
    const defaultTitles = new Set(defaultPortfolioProjects.map(p => p.title))
    const hasAllDefaults = defaultTitles.size > 0 && [...defaultTitles].every(title => existingProjectTitles.has(title))
    
    console.log(`   📊 Current portfolio projects: ${existingProjects.length}`)
    if (existingProjects.length > 0) {
      console.log(`   📋 Existing titles: ${Array.from(existingProjectTitles).join(', ')}`)
    }
    
    if (!hasAllDefaults || existingProjects.length < defaultPortfolioProjects.length) {
      console.log('📦 Ensuring portfolio projects...')
      const projectsToAdd: any[] = [...existingProjects]
      let missingImages = false
      
      for (const projectData of defaultPortfolioProjects) {
        if (!existingProjectTitles.has(projectData.title)) {
          let imageId: string | null = null
          
          // Try to find image, but don't fail if media query has issues
          try {
            imageId = await findMediaByFilename(payload, projectData.imageFilename)
          } catch (error: any) {
            console.log(`   ⚠️  Could not search for image ${projectData.imageFilename} (database schema issue)`)
            // Continue without image
          }
          
          if (imageId) {
            projectsToAdd.push({
              title: projectData.title,
              description: projectData.description,
              projectType: projectData.projectType,
              displayOrder: projectData.displayOrder,
              heroImage: imageId,
            })
            console.log(`   ✅ Will add: ${projectData.title} (with image)`)
          } else {
            // Create project without image - user can add image in admin later
            projectsToAdd.push({
              title: projectData.title,
              description: projectData.description,
              projectType: projectData.projectType,
              displayOrder: projectData.displayOrder,
              // heroImage will be null/undefined - user can add it in admin
            })
            console.log(`   ✅ Will add: ${projectData.title} (image missing - add in admin)`)
            console.log(`      ⚠️  Image not found: ${projectData.imageFilename}`)
            missingImages = true
          }
        }
      }
      
      if (missingImages) {
        console.log(`\n   💡 Tip: Run 'npm run seed:media' to upload portfolio images, then re-run this script.`)
      }

      if (projectsToAdd.length > existingProjects.length) {
        updateData.portfolioSection = {
          ...homePage.portfolioSection,
          enabled: homePage.portfolioSection?.enabled ?? true,
          headline: homePage.portfolioSection?.headline || 'Transformations',
          subheadline: homePage.portfolioSection?.subheadline || "A showcase of spaces we've brought to life across the region.",
          projects: projectsToAdd,
        }
        needsUpdate = true
        const newCount = projectsToAdd.length - existingProjects.length
        console.log(`   ✅ Portfolio: ${projectsToAdd.length} projects (${existingProjects.length} existing + ${newCount} new)`)
      } else {
        console.log(`   ℹ️  Portfolio: ${existingProjects.length} projects already exist`)
      }
    } else {
      console.log(`   ℹ️  Portfolio: ${existingProjects.length} projects already exist`)
    }

    // Check and ensure hero slides
    const existingSlides = homePage.heroSection?.slides || []
    const existingSlideTitles = new Set(existingSlides.map((s: any) => s.title))
    
    if (existingSlides.length === 0 || existingSlideTitles.size < defaultHeroSlides.length) {
      console.log('\n🎬 Ensuring hero slides...')
      const slidesToAdd: any[] = [...existingSlides]
      
      for (const slideData of defaultHeroSlides) {
        if (!existingSlideTitles.has(slideData.title)) {
          const imageId = await findMediaByFilename(payload, slideData.imageFilename)
          
          if (imageId) {
            slidesToAdd.push({
              image: imageId,
              title: slideData.title,
              eyebrow: slideData.eyebrow,
              subtitle: slideData.subtitle,
              description: slideData.description,
            })
            console.log(`   ✅ Will add: ${slideData.title}`)
          } else {
            console.log(`   ⚠️  Image not found: ${slideData.imageFilename} for ${slideData.title}`)
          }
        }
      }

      if (slidesToAdd.length > existingSlides.length) {
        updateData.heroSection = {
          slides: slidesToAdd,
        }
        needsUpdate = true
        console.log(`   ✅ Hero: ${slidesToAdd.length} slides (${existingSlides.length} existing + ${slidesToAdd.length - existingSlides.length} new)`)
      } else {
        console.log(`   ℹ️  Hero: ${existingSlides.length} slides already exist`)
      }
    } else {
      console.log(`   ℹ️  Hero: ${existingSlides.length} slides already exist`)
    }

    // Update if needed
    if (needsUpdate) {
      console.log('\n📝 Updating HomePage global...')
      try {
        await payload.updateGlobal({
          slug: 'home-page',
          data: updateData,
        })
        console.log('✅ HomePage global updated with default content!')
        
        if (missingImages) {
          console.log('\n💡 Next steps:')
          console.log('   1. Fix database schema: Restart your dev server (Ctrl+C then npm run dev)')
          console.log('      This will trigger Payload to auto-migrate the database schema')
          console.log('   2. After restart, run: npm run seed:media (if not already done)')
          console.log('   3. Then run: npm run ensure:defaults again to link images')
          console.log('   OR: Add images manually in Admin → Home Page → Portfolio tab')
        }
      } catch (updateError: any) {
        console.error('❌ Error updating HomePage global:', updateError.message || updateError)
        console.log('\n💡 This might be a database schema issue. Try:')
        console.log('   1. Restart your dev server (Ctrl+C then npm run dev)')
        console.log('   2. This will trigger Payload to auto-migrate the database')
        process.exit(1)
      }
    } else {
      console.log('\n✅ All default content already exists!')
    }

    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error ensuring defaults:', error.message || error)
    process.exit(1)
  }
}

ensureDefaults()

