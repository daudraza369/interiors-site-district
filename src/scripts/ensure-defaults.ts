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

async function ensureDefaults() {
  console.log('🌱 Ensuring default content in HomePage global...\n')

  try {
    const payload = await getPayload({ config: config.default })
    const homePage = await payload.findGlobal({ slug: 'home-page', depth: 0 })

    let needsUpdate = false
    const updateData: any = {}

    // Check and ensure portfolio projects
    const existingProjects = homePage.portfolioSection?.projects || []
    const existingProjectTitles = new Set(existingProjects.map((p: any) => p.title))
    
    if (existingProjects.length === 0 || existingProjectTitles.size < defaultPortfolioProjects.length) {
      console.log('📦 Ensuring portfolio projects...')
      const projectsToAdd: any[] = [...existingProjects]
      
      for (const projectData of defaultPortfolioProjects) {
        if (!existingProjectTitles.has(projectData.title)) {
          const imageId = await findMediaByFilename(payload, projectData.imageFilename)
          
          if (imageId) {
            projectsToAdd.push({
              title: projectData.title,
              description: projectData.description,
              projectType: projectData.projectType,
              displayOrder: projectData.displayOrder,
              heroImage: imageId,
            })
            console.log(`   ✅ Will add: ${projectData.title}`)
          } else {
            console.log(`   ⚠️  Image not found: ${projectData.imageFilename} for ${projectData.title}`)
          }
        }
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
        console.log(`   ✅ Portfolio: ${projectsToAdd.length} projects (${existingProjects.length} existing + ${projectsToAdd.length - existingProjects.length} new)`)
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
      await payload.updateGlobal({
        slug: 'home-page',
        data: updateData,
      })
      console.log('✅ HomePage global updated with default content!')
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

