// Complete seeding script for Projects and Virtual Showrooms
// This ensures default content exists after deployment
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
    videoUrl: null,
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'Fine Dining Restaurant',
    projectType: 'F&B',
    location: 'Dubai, UAE',
    description: 'Intimate botanical atmosphere with preserved plants and moss features',
    imageBaseName: 'restaurant-plants',
    videoUrl: null,
    displayOrder: 2,
    isPublished: true,
  },
  {
    title: 'Private Villa Garden',
    projectType: 'Villa',
    location: 'Al Khobar, KSA',
    description: 'Custom olive grove with integrated irrigation system',
    imageBaseName: 'olive-tree',
    videoUrl: null,
    displayOrder: 3,
    isPublished: true,
  },
  {
    title: 'Tech Campus Renovation',
    projectType: 'Office',
    location: 'Riyadh, KSA',
    description: 'Biophilic design throughout with custom planter solutions',
    imageBaseName: 'planters',
    videoUrl: null,
    displayOrder: 4,
    isPublished: true,
  },
  {
    title: 'Boutique Hotel Lobby',
    projectType: 'Hospitality',
    location: 'Riyadh, KSA',
    description: 'Sculptural green installations with ambient lighting',
    imageBaseName: 'green-wall',
    videoUrl: null,
    displayOrder: 5,
    isPublished: true,
  },
]

// Default virtual showrooms matching the new repo
const defaultShowrooms = [
  {
    title: 'Kahwet Azmi',
    description: 'A welcoming café space transformed with lush interior planting',
    tourUrl: 'https://livetour.istaging.com/7494b8c5-7e17-4659-9f30-39cf5ff8c366?hideLike=true&hideViewNum=true',
    location: 'Riyadh',
    thumbnailBaseName: 'showroom-kahwet-azmi',
    displayOrder: 0,
    isPublished: true,
  },
  {
    title: 'Cilicia',
    description: 'A modern commercial space enhanced with strategic plant installations',
    tourUrl: 'https://livetour.istaging.com/a22952d4-c384-4597-ac01-0165f1259c22?hideLike=true&hideViewNum=true',
    location: 'Jeddah',
    thumbnailBaseName: 'showroom-cilicia',
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'Bayaz',
    description: 'A contemporary space transformed with curated interior plantscaping',
    tourUrl: 'https://livetour.istaging.com/d8410581-7c2d-4d0c-ac8b-b77a49c79784?hideLike=true&hideViewNum=true',
    location: 'Dammam',
    thumbnailBaseName: 'showroom-bayaz',
    displayOrder: 2,
    isPublished: true,
  },
]

async function findMediaByBaseName(payload: any, baseName: string): Promise<string | null> {
  try {
    const result = await payload.find({
      collection: 'media',
      where: {
        filename: {
          contains: baseName,
        },
      },
      limit: 10,
      depth: 0,
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

async function seedProjectsAndShowrooms() {
  console.log('🌱 Seeding Projects and Virtual Showrooms...\n')

  try {
    const payload = await getPayload({ config: config.default })

    // ========== SEED PROJECTS ==========
    console.log('📦 Seeding Projects...\n')
    
    let existingProjects
    try {
      existingProjects = await payload.find({
        collection: 'projects',
        limit: 100,
        depth: 0,
      })
    } catch (error: any) {
      console.log('⚠️  Initial query failed, trying alternative approach...')
      try {
        const countResult = await payload.count({
          collection: 'projects',
        })
        console.log(`📊 Found ${countResult.totalDocs} project(s) in database`)
        existingProjects = { docs: [] }
      } catch (e: any) {
        console.error('❌ Could not query projects collection:', e.message)
        existingProjects = { docs: [] }
      }
    }

    console.log(`📊 Found ${existingProjects.docs.length} existing project(s)\n`)

    if (existingProjects.docs.length === 0) {
      console.log('📝 Creating default projects...\n')

      let createdCount = 0

      for (const projectTemplate of defaultProjects) {
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
        } else {
          console.log(`   ⚠️  Image not found: ${projectTemplate.imageBaseName}`)
        }

        if (projectTemplate.videoUrl) {
          projectData.videoUrl = projectTemplate.videoUrl
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
    } else {
      console.log('✅ Projects already exist\n')
    }

    // ========== SEED VIRTUAL SHOWROOMS ==========
    console.log('\n📦 Seeding Virtual Showrooms...\n')
    
    let existingShowrooms
    try {
      existingShowrooms = await payload.find({
        collection: 'virtual-showrooms',
        limit: 100,
        depth: 0,
      })
    } catch (error: any) {
      console.log('⚠️  Initial query failed, trying alternative approach...')
      existingShowrooms = { docs: [] }
    }

    console.log(`📊 Found ${existingShowrooms.docs.length} existing showroom(s)\n`)

    if (existingShowrooms.docs.length === 0) {
      console.log('📝 Creating default showrooms...\n')

      let createdCount = 0

      for (const showroomTemplate of defaultShowrooms) {
        console.log(`🔍 Creating: ${showroomTemplate.title}`)

        const thumbnailId = await findMediaByBaseName(payload, showroomTemplate.thumbnailBaseName)

        const showroomData: any = {
          title: showroomTemplate.title,
          description: showroomTemplate.description,
          tourUrl: showroomTemplate.tourUrl,
          location: showroomTemplate.location,
          displayOrder: showroomTemplate.displayOrder,
          isPublished: showroomTemplate.isPublished,
        }

        if (thumbnailId) {
          showroomData.thumbnail = thumbnailId
          console.log(`   ✅ Linked thumbnail: ${showroomTemplate.thumbnailBaseName} (ID: ${thumbnailId})`)
        } else {
          console.log(`   ⚠️  Thumbnail not found: ${showroomTemplate.thumbnailBaseName}`)
        }

        try {
          await payload.create({
            collection: 'virtual-showrooms',
            data: showroomData,
          })
          createdCount++
          console.log(`   ✅ Created successfully!\n`)
        } catch (error: any) {
          console.error(`   ❌ Error creating showroom: ${error.message}\n`)
        }
      }

      console.log(`\n✅ Created ${createdCount} showroom(s)!`)
    } else {
      console.log('✅ Showrooms already exist\n')
    }

    // Final verification
    console.log('\n🔍 Final verification:\n')
    
    let finalProjects
    try {
      finalProjects = await payload.find({
        collection: 'projects',
        limit: 100,
        depth: 0,
      })
    } catch (error: any) {
      console.error('❌ Could not verify projects:', error.message)
      finalProjects = { docs: [] }
    }

    let finalShowrooms
    try {
      finalShowrooms = await payload.find({
        collection: 'virtual-showrooms',
        limit: 100,
        depth: 0,
      })
    } catch (error: any) {
      console.error('❌ Could not verify showrooms:', error.message)
      finalShowrooms = { docs: [] }
    }

    console.log(`📊 Total projects: ${finalProjects.docs.length}`)
    console.log(`📊 Total showrooms: ${finalShowrooms.docs.length}`)

    console.log('\n✨ Done!')
    console.log('\n💡 Next steps:')
    console.log('   1. Go to Admin → Projects to view/edit projects')
    console.log('   2. Go to Admin → Virtual Showrooms to view/edit showrooms')
    console.log('   3. Add video URLs to projects if needed')
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Error seeding:', error)
    process.exit(1)
  }
}

seedProjectsAndShowrooms()

