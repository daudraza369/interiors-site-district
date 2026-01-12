// Fix portfolio images - ensures all projects have correct image references
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
    const extension = filename.split('.').pop() || ''
    const pattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(-\\d+)?\\.${extension}$`, 'i')
    
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

const projectsData = [
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

async function fixPortfolioImages() {
  console.log('🔧 Fixing portfolio images...\n')
  
  const payload = await getPayload({ config: config.default })
  const homePage = await payload.findGlobal({ slug: 'home-page', depth: 2 })
  
  const existingProjects = homePage.portfolioSection?.projects || []
  const fixedProjects: any[] = []
  
  console.log(`📦 Found ${existingProjects.length} existing projects`)
  
  for (const projectData of projectsData) {
    // Find existing project
    const existing = existingProjects.find((p: any) => p.title === projectData.title)
    
    if (existing) {
      // Check if image is valid
      let heroImageId = existing.heroImage
      
      if (typeof heroImageId === 'object') {
        heroImageId = heroImageId.id
      }
      
      // If image is missing or invalid, find it
      if (!heroImageId || (typeof heroImageId === 'number' && heroImageId <= 0)) {
        const foundId = await findMediaByFilename(payload, projectData.imageFilename)
        if (foundId) {
          heroImageId = foundId
          console.log(`   ✅ Fixed image for: ${projectData.title}`)
        } else {
          console.log(`   ⚠️  Image not found: ${projectData.imageFilename} for ${projectData.title}`)
        }
      }
      
      fixedProjects.push({
        ...existing,
        heroImage: heroImageId || existing.heroImage,
      })
    } else {
      // New project - find image
      const heroImageId = await findMediaByFilename(payload, projectData.imageFilename)
      
      if (heroImageId) {
        fixedProjects.push({
          title: projectData.title,
          description: projectData.description,
          projectType: projectData.projectType,
          displayOrder: projectData.displayOrder,
          heroImage: heroImageId,
        })
        console.log(`   ✅ Added: ${projectData.title}`)
      } else {
        console.log(`   ⚠️  Image not found: ${projectData.imageFilename} for ${projectData.title}`)
      }
    }
  }
  
  // Update HomePage
  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      portfolioSection: {
        ...homePage.portfolioSection,
        projects: fixedProjects,
      },
    },
  })
  
  console.log(`\n✨ Fixed ${fixedProjects.length} portfolio projects`)
  console.log(`   All images should now be visible on frontend and admin!`)
}

fixPortfolioImages()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error('❌ Error:', error.message || error)
    process.exit(1)
  })



