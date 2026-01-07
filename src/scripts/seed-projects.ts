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

// Helper to find media by filename
async function findMediaByFilename(payload: any, filename: string): Promise<string | null> {
  try {
    // Payload stores just the filename, not the path (e.g., "logos/file.png" -> "file.png")
    const justFilename = filename.includes('/') ? filename.split('/').pop()! : filename
    
    // Payload appends numbers to filenames to avoid duplicates (e.g., "hero-interior-1.jpg")
    const baseName = justFilename.replace(/\.[^/.]+$/, '')
    const extension = justFilename.split('.').pop() || ''
    const pattern = new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(-\\d+)?\\.${extension}$`, 'i')
    
    const result = await payload.find({
      collection: 'media',
      limit: 200,
    })
    
    const matches = result.docs.filter((doc: any) => 
      doc.filename && pattern.test(doc.filename)
    )
    
    if (matches.length === 0) {
      return null
    }
    
    // Get the one with the highest number (latest version)
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
    console.error(`⚠️  Error finding media ${filename}:`, error)
    return null
  }
}

async function seedProjects() {
  console.log('🧹 Starting projects cleanup and seed...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // STEP 1: Delete ALL existing projects first
    console.log('🗑️  Deleting all existing projects...')
    const allProjects = await payload.find({
      collection: 'projects',
      limit: 1000,
    })

    let deletedCount = 0
    for (const project of allProjects.docs) {
      try {
        await payload.delete({
          collection: 'projects',
          id: project.id,
        })
        deletedCount++
        console.log(`   ✅ Deleted: "${project.title}"`)
      } catch (error: any) {
        console.error(`   ❌ Error deleting "${project.title}":`, error.message)
      }
    }
    console.log(`\n✅ Deleted ${deletedCount} projects\n`)

    // STEP 2: Create ONLY the "sun" project with video (matching reference repo)
    // The reference repo only has ONE video project: "sun" / "Office" / "KSA"
    const projectsData = [
      {
        title: 'sun',
        projectType: 'Office',
        location: 'KSA',
        description: null,
        heroImageFilename: 'hero-interior.jpg', // Use fallback image
        videoUrl: null, // TODO: Add actual video URL from reference repo or CMS
        displayOrder: 0,
      },
    ]

    let createdCount = 0
    let skippedCount = 0

    for (const projectData of projectsData) {
      try {
        // Check if project already exists
        const existing = await payload.find({
          collection: 'projects',
          where: {
            title: {
              equals: projectData.title,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          console.log(`⏭️  Skipping "${projectData.title}" - already exists`)
          skippedCount++
          continue
        }

        // Find hero image
        const heroImageId = await findMediaByFilename(payload, projectData.heroImageFilename)

        if (!heroImageId) {
          console.log(`⚠️  Image not found: ${projectData.heroImageFilename} for "${projectData.title}"`)
          console.log(`   Run: npm run seed:media first`)
          continue
        }

        // Create project
        await payload.create({
          collection: 'projects',
          data: {
            title: projectData.title,
            projectType: projectData.projectType,
            location: projectData.location,
            description: projectData.description,
            heroImage: heroImageId,
            videoUrl: projectData.videoUrl,
            displayOrder: projectData.displayOrder,
            isPublished: true,
          },
        })

        console.log(`✅ Created: "${projectData.title}"`)
        createdCount++
      } catch (error: any) {
        console.error(`❌ Error creating "${projectData.title}":`, error.message)
      }
    }

    console.log(`\n✨ Seed complete!`)
    console.log(`   ✅ Created: ${createdCount} projects`)
    console.log(`   ⏭️  Skipped: ${skippedCount} projects`)
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  }
}

seedProjects()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
