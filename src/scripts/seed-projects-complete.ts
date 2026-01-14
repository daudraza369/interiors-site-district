// Complete Projects seeding: Create default projects with images and video support
// This script ensures default projects exist in the Projects collection
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

// Default projects matching the new repo
const defaultProjects = [
  {
    title: 'Corporate HQ Transformation',
    projectType: 'Office',
    location: 'Riyadh, KSA',
    description: 'Complete interior plantscaping with custom planters and green walls',
    imageBaseName: 'hero-interior',
    videoUrl: null, // Can be added later via admin
    displayOrder: 0,
    isPublished: true,
  },
  {
    title: "Five-Star Hotel Atrium",
    projectType: 'Hospitality',
    location: 'Jeddah, KSA',
    description: 'Grand atrium featuring 8-meter olive trees and cascading greenery',
    imageBaseName: 'hotel-atrium',
    videoUrl: null, // Can be added later via admin
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'Fine Dining Restaurant',
    projectType: 'F&B',
    location: 'Dubai, UAE',
    description: 'Intimate botanical atmosphere with preserved plants and moss features',
    imageBaseName: 'restaurant-plants',
    videoUrl: null, // Can be added later via admin
    displayOrder: 2,
    isPublished: true,
  },
  {
    title: 'Private Villa Garden',
    projectType: 'Villa',
    location: 'Al Khobar, KSA',
    description: 'Custom olive grove with integrated irrigation system',
    imageBaseName: 'olive-tree',
    videoUrl: null, // Can be added later via admin
    displayOrder: 3,
    isPublished: true,
  },
  {
    title: 'Tech Campus Renovation',
    projectType: 'Office',
    location: 'Riyadh, KSA',
    description: 'Biophilic design throughout with custom planter solutions',
    imageBaseName: 'planters',
    videoUrl: null, // Can be added later via admin
    displayOrder: 4,
    isPublished: true,
  },
  {
    title: 'Boutique Hotel Lobby',
    projectType: 'Hospitality',
    location: 'Riyadh, KSA',
    description: 'Sculptural green installations with ambient lighting',
    imageBaseName: 'green-wall',
    videoUrl: null, // Can be added later via admin
    displayOrder: 5,
    isPublished: true,
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

async function seedProjectsComplete() {
  console.log('🌱 Seeding Projects Collection (with video support)...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // Check existing projects
    const existingProjects = await payload.find({
      collection: 'projects',
      limit: 100,
    })

    console.log(`📊 Found ${existingProjects.docs.length} existing project(s)\n`)

    // If no projects exist, create them
    if (existingProjects.docs.length === 0) {
      console.log('📝 Creating default projects...\n')

      let createdCount = 0
      let skippedCount = 0

      for (const projectTemplate of defaultProjects) {
        console.log(`🔍 Creating: ${projectTemplate.title}`)

        // Try to find the hero image
        const imageId = await findMediaByBaseName(payload, projectTemplate.imageBaseName)

        const projectData: any = {
          title: projectTemplate.title,
          projectType: projectTemplate.projectType,
          location: projectTemplate.location,
          description: projectTemplate.description,
          displayOrder: projectTemplate.displayOrder,
          isPublished: projectTemplate.isPublished,
        }

        if (imageId) {
          projectData.heroImage = imageId
          console.log(`   ✅ Linked image: ${projectTemplate.imageBaseName} (ID: ${imageId})`)
        } else {
          console.log(`   ⚠️  Image not found: ${projectTemplate.imageBaseName}`)
          console.log(`   💡 Project will be created without image - you can add it later in admin`)
          skippedCount++
        }

        // Add video URL if provided (currently all are null, but structure supports it)
        if (projectTemplate.videoUrl) {
          projectData.videoUrl = projectTemplate.videoUrl
          console.log(`   ✅ Added video URL: ${projectTemplate.videoUrl}`)
        }

        try {
          await payload.create({
            collection: 'projects',
            data: projectData,
          })
          createdCount++
          console.log(`   ✅ Created successfully!\n`)
        } catch (error: any) {
          console.error(`   ❌ Error creating project: ${error.message}\n`)
        }
      }

      console.log(`\n✅ Created ${createdCount} project(s)!`)
      if (skippedCount > 0) {
        console.log(`⚠️  ${skippedCount} project(s) created without images`)
      }
    } else {
      // Projects exist, but check if they have images
      console.log('📝 Checking existing projects for images...\n')

      let imagesLinked = 0
      let projectsUpdated = 0

      for (const existingProject of existingProjects.docs) {
        console.log(`🔍 Checking: ${existingProject.title}`)

        // Check if image is already linked
        let hasImage = false
        if (existingProject.heroImage) {
          if (typeof existingProject.heroImage === 'object' && existingProject.heroImage.id) {
            console.log(`   ✅ Already has image (ID: ${existingProject.heroImage.id})`)
            hasImage = true
          } else if (typeof existingProject.heroImage === 'number') {
            // Verify the image exists
            try {
              await payload.findByID({
                collection: 'media',
                id: existingProject.heroImage,
              })
              console.log(`   ✅ Already has image (ID: ${existingProject.heroImage})`)
              hasImage = true
            } catch (e) {
              console.log(`   ⚠️  Image ID ${existingProject.heroImage} not found, will search for new one`)
            }
          }
        }

        // If no image, try to find it
        if (!hasImage) {
          const matchingTemplate = defaultProjects.find(
            (p) => p.title === existingProject.title
          )

          if (matchingTemplate) {
            const imageId = await findMediaByBaseName(
              payload,
              matchingTemplate.imageBaseName
            )

            if (imageId) {
              try {
                await payload.update({
                  collection: 'projects',
                  id: existingProject.id,
                  data: {
                    heroImage: imageId,
                  },
                })
                console.log(
                  `   ✅ Linked image: ${matchingTemplate.imageBaseName} (ID: ${imageId})`
                )
                imagesLinked++
                projectsUpdated++
              } catch (error: any) {
                console.error(`   ❌ Error updating project: ${error.message}`)
              }
            } else {
              console.log(`   ⚠️  Image not found: ${matchingTemplate.imageBaseName}`)
            }
          } else {
            console.log(`   ℹ️  No image mapping for: ${existingProject.title}`)
          }
        }
      }

      if (imagesLinked > 0) {
        console.log(`\n✅ Linked ${imagesLinked} image(s) to existing projects!`)
      } else {
        console.log(`\n✅ All projects already have images (or images not found)`)
      }

      // Check if we need to create missing default projects
      const existingTitles = existingProjects.docs.map((p: any) => p.title)
      const missingProjects = defaultProjects.filter(
        (p) => !existingTitles.includes(p.title)
      )

      if (missingProjects.length > 0) {
        console.log(`\n📝 Creating ${missingProjects.length} missing default project(s)...\n`)

        for (const projectTemplate of missingProjects) {
          console.log(`🔍 Creating: ${projectTemplate.title}`)

          const imageId = await findMediaByBaseName(payload, projectTemplate.imageBaseName)

          const projectData: any = {
            title: projectTemplate.title,
            projectType: projectTemplate.projectType,
            location: projectTemplate.location,
            description: projectTemplate.description,
            displayOrder: projectTemplate.displayOrder,
            isPublished: projectTemplate.isPublished,
          }

          if (imageId) {
            projectData.heroImage = imageId
            console.log(`   ✅ Linked image: ${projectTemplate.imageBaseName} (ID: ${imageId})`)
          }

          if (projectTemplate.videoUrl) {
            projectData.videoUrl = projectTemplate.videoUrl
          }

          try {
            await payload.create({
              collection: 'projects',
              data: projectData,
            })
            console.log(`   ✅ Created successfully!\n`)
          } catch (error: any) {
            console.error(`   ❌ Error creating project: ${error.message}\n`)
          }
        }
      }
    }

    // Final verification
    console.log('\n🔍 Final verification:\n')
    const finalProjects = await payload.find({
      collection: 'projects',
      limit: 100,
      depth: 2,
    })

    console.log(`📊 Total projects: ${finalProjects.docs.length}\n`)

    for (const project of finalProjects.docs) {
      const imageInfo = project.heroImage
        ? typeof project.heroImage === 'object'
          ? project.heroImage.filename || 'unknown'
          : `ID: ${project.heroImage}`
        : 'NO IMAGE'

      const videoInfo = project.videoUrl
        ? `Video URL: ${project.videoUrl}`
        : project.video
        ? `Video File: ${typeof project.video === 'object' ? project.video.filename || 'unknown' : 'ID: ' + project.video}`
        : 'NO VIDEO'

      console.log(`   ✅ ${project.title}`)
      console.log(`      📷 ${imageInfo}`)
      console.log(`      🎬 ${videoInfo}`)
      console.log(`      📍 ${project.location || 'N/A'}`)
      console.log(`      🏷️  ${project.projectType || 'N/A'}`)
      console.log(`      ${project.isPublished ? '✅ Published' : '❌ Unpublished'}\n`)
    }

    console.log('\n✨ Done!')
    console.log('\n💡 Next steps:')
    console.log('   1. Go to Admin → Projects to view/edit projects')
    console.log('   2. Upload videos via "Video File" field or add "Video URL" for external links')
    console.log('   3. Videos will play on hover and open in full-screen modal when clicked')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error seeding projects:', error.message || error)
    console.error(error.stack)
    process.exit(1)
  }
}

seedProjectsComplete()

