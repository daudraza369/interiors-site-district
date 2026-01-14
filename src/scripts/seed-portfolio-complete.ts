// Complete portfolio seeding: Create projects AND link images
// This script ensures portfolio projects exist and have images linked
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
} else {
  dotenv.config()
  console.log(`⚠️  .env not found at ${envPath}, using process.env`)
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in .env file')
  process.exit(1)
}

const { getPayload } = await import('payload')
const config = await import('@payload-config')

// Default portfolio projects with image mappings
const defaultPortfolioProjects = [
  {
    title: 'Modern Corporate Lobby',
    description: 'Custom planters, preserved wall, and focal tree installation.',
    projectType: 'Offices',
    displayOrder: 0,
    imageBaseName: 'portfolio-corporate-lobby',
  },
  {
    title: 'Fine Dining Restaurant',
    description: 'Living green wall with preserved moss accents.',
    projectType: 'F&B',
    displayOrder: 1,
    imageBaseName: 'portfolio-restaurant',
  },
  {
    title: 'Private Villa Garden',
    description: 'Custom olive trees and Mediterranean plantscaping.',
    projectType: 'Private Villa',
    displayOrder: 2,
    imageBaseName: 'portfolio-villa',
  },
  {
    title: 'Co-Working Space',
    description: 'Biophilic design with desk planters and partition walls.',
    projectType: 'Offices',
    displayOrder: 3,
    imageBaseName: 'portfolio-coworking',
  },
]

async function findMediaByBaseName(payload: any, baseName: string): Promise<string | null> {
  try {
    // Find all media files that contain the base name
    const result = await payload.find({
      collection: 'media',
      where: {
        filename: {
          contains: baseName,
        },
      },
      limit: 50,
    })

    if (result.docs.length === 0) {
      return null
    }

    // Filter to exact base name match (ignoring version numbers)
    const matches = result.docs.filter((doc: any) => {
      const docFilename = doc.filename || ''
      const docBase = docFilename.replace(/-\d+\./, '.').replace(/\.[^/.]+$/, '')
      return docBase.toLowerCase() === baseName.toLowerCase()
    })

    if (matches.length === 0) {
      return null
    }

    // Sort by version number (highest first) to get latest version
    matches.sort((a: any, b: any) => {
      const getVersion = (name: string) => {
        const match = name.match(/-(\d+)\./)
        return match ? parseInt(match[1], 10) : 0
      }
      return getVersion(b.filename) - getVersion(a.filename)
    })

    return matches[0].id
  } catch (error: any) {
    console.error(`Error finding media: ${error.message}`)
    return null
  }
}

async function seedPortfolioComplete() {
  console.log('🌱 Seeding Portfolio Section (projects + images)...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Get the HomePage global
    const homePage = await payload.findGlobal({
      slug: 'home-page',
      depth: 0,
    })

    const existingProjects = homePage.portfolioSection?.projects || []
    console.log(`📊 Found ${existingProjects.length} existing project(s)\n`)

    // If no projects exist, create them
    if (existingProjects.length === 0) {
      console.log('📝 Creating portfolio projects...\n')

      const projectsWithImages: any[] = []

      for (const projectTemplate of defaultPortfolioProjects) {
        console.log(`🔍 Creating: ${projectTemplate.title}`)

        // Try to find the image
        const imageId = await findMediaByBaseName(payload, projectTemplate.imageBaseName)

        const project: any = {
          title: projectTemplate.title,
          description: projectTemplate.description,
          projectType: projectTemplate.projectType,
          displayOrder: projectTemplate.displayOrder,
        }

        if (imageId) {
          project.heroImage = imageId
          console.log(`   ✅ Linked image: ${projectTemplate.imageBaseName} (ID: ${imageId})`)
        } else {
          console.log(`   ⚠️  Image not found: ${projectTemplate.imageBaseName}`)
          console.log(`   💡 Project created without image - you can add it later in admin`)
        }

        projectsWithImages.push(project)
      }

      // Update the HomePage global
      await payload.updateGlobal({
        slug: 'home-page',
        data: {
          portfolioSection: {
            enabled: true,
            projects: projectsWithImages,
          },
        },
      })

      console.log(`\n✅ Created ${projectsWithImages.length} portfolio project(s)!`)
    } else {
      // Projects exist, but check if they have images
      console.log('📝 Checking existing projects for images...\n')

      const updatedProjects: any[] = []
      let imagesLinked = 0

      for (const project of existingProjects) {
        console.log(`🔍 Checking: ${project.title}`)

        // Check if image is already linked
        let hasImage = false
        if (project.heroImage) {
          if (typeof project.heroImage === 'object' && project.heroImage.id) {
            console.log(`   ✅ Already has image (ID: ${project.heroImage.id})`)
            hasImage = true
          } else if (typeof project.heroImage === 'number') {
            // Verify the image exists
            try {
              await payload.findByID({
                collection: 'media',
                id: project.heroImage,
              })
              console.log(`   ✅ Already has image (ID: ${project.heroImage})`)
              hasImage = true
            } catch (e) {
              console.log(`   ⚠️  Image ID ${project.heroImage} not found, will search for new one`)
            }
          }
        }

        // If no image, try to find it
        if (!hasImage) {
          const matchingTemplate = defaultPortfolioProjects.find(
            (p) => p.title === project.title
          )

          if (matchingTemplate) {
            const imageId = await findMediaByBaseName(
              payload,
              matchingTemplate.imageBaseName
            )

            if (imageId) {
              updatedProjects.push({
                ...project,
                heroImage: imageId,
              })
              console.log(
                `   ✅ Linked image: ${matchingTemplate.imageBaseName} (ID: ${imageId})`
              )
              imagesLinked++
            } else {
              updatedProjects.push(project) // Keep as is
              console.log(`   ⚠️  Image not found: ${matchingTemplate.imageBaseName}`)
            }
          } else {
            updatedProjects.push(project) // Keep as is
            console.log(`   ⚠️  No image mapping for: ${project.title}`)
          }
        } else {
          updatedProjects.push(project) // Keep as is
        }
      }

      // Update if images were linked
      if (imagesLinked > 0) {
        await payload.updateGlobal({
          slug: 'home-page',
          data: {
            portfolioSection: {
              ...homePage.portfolioSection,
              projects: updatedProjects,
            },
          },
        })

        console.log(`\n✅ Linked ${imagesLinked} image(s) to existing projects!`)
      } else {
        console.log(`\n✅ All projects already have images (or images not found)`)
      }
    }

    // Final verification
    console.log('\n🔍 Final verification:\n')
    const finalHomePage = await payload.findGlobal({
      slug: 'home-page',
      depth: 2,
    })

    const finalProjects = finalHomePage.portfolioSection?.projects || []
    console.log(`📊 Total projects: ${finalProjects.length}\n`)

    for (const project of finalProjects) {
      if (project.heroImage && typeof project.heroImage === 'object') {
        const filename = project.heroImage.filename || 'unknown'
        console.log(`   ✅ ${project.title}: ${filename}`)
      } else {
        console.log(`   ⚠️  ${project.title}: NO IMAGE`)
      }
    }

    console.log('\n✨ Done!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error seeding portfolio:', error.message || error)
    console.error(error.stack)
    process.exit(1)
  }
}

seedPortfolioComplete()


