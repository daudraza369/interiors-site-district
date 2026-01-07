// Load environment variables FIRST, before importing anything
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

// Ensure PAYLOAD_SECRET is set
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in .env file')
  process.exit(1)
}

// Now dynamically import Payload after .env is loaded
const { getPayload } = await import('payload')
const config = await import('@payload-config')

// Default projects data - matches reference repository EXACTLY
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

async function findMediaByFilename(payload: any, filename: string): Promise<string | null> {
  try {
    // Payload appends numbers to filenames to avoid duplicates (e.g., portfolio-corporate-lobby-1.jpg)
    // Extract base filename without extension
    const baseName = filename.replace(/\.[^/.]+$/, '') // Remove extension
    const extension = filename.split('.').pop() || ''
    
    // Search for files that start with the base name and end with the extension
    // This will match: baseName.ext, baseName-1.ext, baseName-2.ext, etc.
    const pattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(-\\d+)?\\.${extension}$`, 'i')
    
    const result = await payload.find({
      collection: 'media',
      limit: 200,
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

async function seedPortfolio() {
  console.log('🌱 Starting portfolio seed...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Get the HomePage global
    const homePage = await payload.findGlobal({
      slug: 'home-page',
    })

    // Get existing projects from the global
    const existingProjects = homePage.portfolioSection?.projects || []

    // Check if projects already exist
    if (existingProjects.length > 0) {
      console.log(`ℹ️  Projects already exist (${existingProjects.length} projects)`)
      console.log('   Skipping seed - projects are already in HomePage global')
      process.exit(0)
    }

    // Build projects array with images
    const projectsWithImages: any[] = []

    for (const projectData of projectsData) {
      // Find the specific image by filename
      const heroImageId = await findMediaByFilename(payload, projectData.imageFilename)

      if (!heroImageId) {
        console.log(`⚠️  Image not found: ${projectData.imageFilename} for ${projectData.title}`)
        console.log(`   Run: npm run seed:media first`)
        continue
      }

      projectsWithImages.push({
        title: projectData.title,
        description: projectData.description,
        projectType: projectData.projectType,
        displayOrder: projectData.displayOrder,
        heroImage: heroImageId,
      })

      console.log(`✅ Added: ${projectData.title} with image: ${projectData.imageFilename}`)
    }

    // Update the HomePage global with projects array and default values
    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        portfolioSection: {
          ...homePage.portfolioSection,
          enabled: true,
          headline: homePage.portfolioSection?.headline || 'Transformations',
          subheadline: homePage.portfolioSection?.subheadline || "A showcase of spaces we've brought to life across the region.",
          projects: projectsWithImages,
        },
      },
    })

    console.log(`\n✨ Seed complete!`)
    console.log(`   ✅ Added ${projectsWithImages.length} projects to HomePage global`)

    if (projectsWithImages.length < projectsData.length) {
      console.log(`\n⚠️  Some projects were skipped because images weren't found.`)
      console.log(`   Make sure to run: npm run seed:media first`)
    }

    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error seeding portfolio:', error.message || error)
    process.exit(1)
  }
}

seedPortfolio()

