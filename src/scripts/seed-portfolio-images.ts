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

// Portfolio image mapping - matches project titles to image filenames
const portfolioImageMap: Record<string, string> = {
  'Modern Corporate Lobby': 'portfolio-corporate-lobby.jpg',
  'Fine Dining Restaurant': 'portfolio-restaurant.jpg',
  'Private Villa Garden': 'portfolio-villa.jpg',
  'Co-Working Space': 'portfolio-coworking.jpg',
}

async function findMediaByFilename(payload: any, filename: string): Promise<string | null> {
  try {
    const justFilename = filename.includes('/') ? filename.split('/').pop()! : filename
    const baseName = justFilename.replace(/\.[^/.]+$/, '')

    const result = await payload.find({ collection: 'media', limit: 200 })

    const matches = result.docs.filter((doc: any) => {
      const docFilename = (doc.filename || '').toLowerCase()
      return docFilename.includes(baseName.toLowerCase())
    })

    if (matches.length === 0) return null

    // Sort by number suffix (highest first) to get latest version
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

async function seedPortfolioImages() {
  console.log('🌱 Seeding Portfolio Section images...\n')

  const payload = await getPayload({ config: config.default })

  // Get the HomePage global
  console.log('📝 Fetching HomePage global...')
  const homePage = await payload.findGlobal({
    slug: 'home-page',
    depth: 0, // Get raw IDs, not populated objects
  })

  const existingProjects = homePage.portfolioSection?.projects || []

  if (existingProjects.length === 0) {
    console.log('⚠️  No projects found in Portfolio Section')
    console.log('   Run: npm run seed:portfolio first to create projects')
    process.exit(0)
  }

  console.log(`📋 Found ${existingProjects.length} existing project(s)\n`)

  // Update each project with its image
  const updatedProjects: any[] = []
  let imagesUpdated = 0
  let imagesSkipped = 0

  for (const project of existingProjects) {
    const projectTitle = project.title
    const imageFilename = portfolioImageMap[projectTitle]

    if (!imageFilename) {
      console.log(`⚠️  No image mapping for: ${projectTitle}`)
      updatedProjects.push(project) // Keep existing project as-is
      imagesSkipped++
      continue
    }

    // Check if image already exists (extract ID if it's an object)
    let existingImageId: any = project.heroImage
    if (typeof existingImageId === 'object' && existingImageId) {
      existingImageId = existingImageId.id || existingImageId
    }

    // Validate the existing image ID
    let hasValidImage = false
    if (existingImageId && typeof existingImageId === 'number' && existingImageId > 0) {
      try {
        await payload.findByID({ collection: 'media', id: existingImageId })
        hasValidImage = true
        console.log(`✅ ${projectTitle}: Already has valid image (ID: ${existingImageId})`)
      } catch {
        hasValidImage = false
      }
    }

    if (hasValidImage) {
      updatedProjects.push(project) // Keep existing project with valid image
      imagesSkipped++
      continue
    }

    // Find the correct image
    console.log(`🔍 Looking for image: ${imageFilename} for "${projectTitle}"...`)
    const imageId = await findMediaByFilename(payload, imageFilename)

    if (!imageId) {
      console.log(`   ⚠️  Image not found: ${imageFilename}`)
      console.log(`   Run: npm run seed:media first`)
      updatedProjects.push(project) // Keep existing project (without image)
      imagesSkipped++
      continue
    }

    // Update project with image ID
    updatedProjects.push({
      ...project,
      heroImage: imageId,
    })

    console.log(`   ✅ Linked image: ${imageFilename} (ID: ${imageId})`)
    imagesUpdated++
  }

  // Update the HomePage global with projects that have images
  if (imagesUpdated > 0) {
    console.log(`\n📝 Updating Portfolio Section with images...`)
    try {
      await payload.updateGlobal({
        slug: 'home-page',
        data: {
          portfolioSection: {
            ...homePage.portfolioSection,
            projects: updatedProjects,
          },
        },
      })
      console.log(`✅ Portfolio Section updated!`)
      console.log(`   📊 Updated ${imagesUpdated} project image(s)`)
      if (imagesSkipped > 0) {
        console.log(`   ⏭️  Skipped ${imagesSkipped} project(s) (already have images or no mapping)`)
      }
      console.log('\n💡 Refresh the admin panel to see the images!')
    } catch (error: any) {
      console.error('❌ Error updating Portfolio Section:', error.message || error)
      process.exit(1)
    }
  } else {
    console.log(`\n✅ All projects already have valid images (or images not found)`)
    if (imagesSkipped > 0) {
      console.log(`   ⏭️  ${imagesSkipped} project(s) skipped`)
    }
  }

  console.log('\n✨ Done!')
}

seedPortfolioImages()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))





